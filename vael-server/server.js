// Serveur multijoueur de Cendres de Vael : relie les joueurs d'une même partie (2 à 4).
const { WebSocketServer } = require('ws');
const fs = require('fs'), path = require('path');
const SAVES = path.join(__dirname, 'saves'); fs.mkdirSync(SAVES, { recursive: true });
const PORT = process.env.PORT || 8787;
const MAX = 4;
const wss = new WebSocketServer({ port: PORT, maxPayload: 2 * 1024 * 1024 });
const rooms = new Map(); // code -> { members: Map(id -> ws), host: id }
let nextId = 1;
const LET = 'ABCDEFGHJKLMNPQRSTUVWXYZ';
const newCode = () => { let c; do { c = Array.from({ length: 4 }, () => LET[Math.floor(Math.random() * LET.length)]).join(''); } while (rooms.has(c)); return c; };
const send = (ws, m) => { if (ws.readyState === 1) ws.send(JSON.stringify(m)); };
const others = (room, id, m) => { for (const [mid, w] of room.members) if (mid !== id) send(w, m); };
const info = ws => ({ id: ws.id, name: ws.name, cls: ws.cls });
const clean = s => String(s || '').replace(/[<>&"]/g, '').slice(0, 16) || 'Héros';

function leave(ws) {
  const room = rooms.get(ws.room); if (!room) return;
  room.members.delete(ws.id); ws.room = null;
  if (!room.members.size) { room.emptySince = Date.now(); return; } // la partie reste ouverte 10 min (reconnexion)
  others(room, ws.id, { t: 'peer-', id: ws.id });
  if (room.host === ws.id) { room.host = room.members.keys().next().value; for (const w of room.members.values()) send(w, { t: 'host', id: room.host }); }
}

wss.on('connection', ws => {
  ws.id = nextId++; ws.alive = true; ws.msgs = 0;
  ws.on('pong', () => { ws.alive = true; });
  ws.on('message', raw => {
    if (++ws.msgs > 60) return; // anti-spam : 60 messages / seconde max
    let m; try { m = JSON.parse(raw); } catch { return; }
    if (m.t === 'create' || m.t === 'join') {
      if (ws.room) leave(ws);
      ws.name = clean(m.name); ws.cls = ['guerrier', 'magicien', 'chasseur'].includes(m.cls) ? m.cls : 'guerrier';
      let code = m.t === 'create' ? newCode() : String(m.room || '').toUpperCase().trim();
      let room = rooms.get(code);
      if (m.t === 'join' && !room && m.rejoin && /^[A-Z]{4}$/.test(code)) { room = { members: new Map(), host: ws.id }; rooms.set(code, room); }
      if (m.t === 'join' && !room) return send(ws, { t: 'err', m: 'Aucune partie avec ce code. Vérifiez les 4 lettres, ou demandez à votre ami de recréer la partie.' });
      if (room && !room.members.size) { room.host = ws.id; room.emptySince = 0; }
      if (room && room.members.size >= MAX) return send(ws, { t: 'err', m: 'La partie est pleine (4 joueurs).' });
      if (!room) { room = { members: new Map(), host: ws.id }; rooms.set(code, room); }
      room.members.set(ws.id, ws); ws.room = code; ws.roomCode = code;
      send(ws, { t: 'joined', room: code, id: ws.id, host: room.host, peers: [...room.members.values()].filter(w => w !== ws).map(info) });
      others(room, ws.id, { t: 'peer+', ...info(ws) });
      return;
    }
    if (m.t === 'cloud') { // sauvegarde en ligne
      const key = String(m.key || '').toUpperCase().replace(/[^A-Z0-9]/g, '');
      if (key.length !== 8) return send(ws, { t: 'cloud', ok: 0, err: 'Code invalide.' });
      const f = path.join(SAVES, key + '.json');
      if (m.op === 'save') { const data = JSON.stringify(m.data || {}); if (data.length > 1.8e6) return send(ws, { t: 'cloud', ok: 0, err: 'Sauvegarde trop grosse.' });
        return fs.writeFile(f, data, e => send(ws, { t: 'cloud', op: 'save', ok: !e, key, err: e ? 'Erreur du serveur.' : undefined })); }
      if (m.op === 'load') return fs.readFile(f, 'utf8', (e, d) => { if (e) return send(ws, { t: 'cloud', op: 'load', ok: 0, err: 'Aucune sauvegarde avec ce code.' }); let data; try { data = JSON.parse(d); } catch { return send(ws, { t: 'cloud', ok: 0, err: 'Sauvegarde abîmée.' }); } send(ws, { t: 'cloud', op: 'load', ok: 1, data }); });
      return;
    }
    if (m.t === 'leave') return leave(ws);
    const room = rooms.get(ws.room); if (!room) return;
    m.id = ws.id;
    if (m.to) { const w = room.members.get(m.to); if (w) send(w, m); return; }
    others(room, ws.id, m);
  });
  ws.on('close', () => leave(ws));
});

setInterval(() => { for (const ws of wss.clients) { ws.msgs = 0; } }, 1000);
setInterval(() => { const now = Date.now(); for (const [c, r] of rooms) if (!r.members.size && r.emptySince && now - r.emptySince > 10 * 60 * 1000) rooms.delete(c); }, 30000);
setInterval(() => { for (const ws of wss.clients) { if (!ws.alive) { ws.terminate(); continue; } ws.alive = false; ws.ping(); } }, 20000);
console.log('Serveur Cendres de Vael prêt sur le port ' + PORT);
