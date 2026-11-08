#!/bin/bash
# Installe (ou met à jour) le serveur multijoueur de Cendres de Vael sur ce serveur.
# Utilisation :  bash ~/3wm-service/vael-server/installer.sh
set -e
SRC="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
DEST=/opt/vael-server
CONF=/etc/nginx/sites-available/3wm
NODE="$(command -v node)"
[ -z "$NODE" ] && { echo "✗ Node.js est introuvable sur ce serveur."; exit 1; }

echo "→ Copie du serveur dans $DEST…"
sudo mkdir -p "$DEST"
sudo cp "$SRC/server.js" "$SRC/package.json" "$DEST/"
sudo chown -R "$USER:$USER" "$DEST"
cd "$DEST" && npm install --omit=dev --no-audit --no-fund

echo "→ Service automatique (redémarre tout seul)…"
sudo tee /etc/systemd/system/vael-server.service >/dev/null <<EOT
[Unit]
Description=Serveur multijoueur Cendres de Vael
After=network.target

[Service]
WorkingDirectory=$DEST
ExecStart=$NODE $DEST/server.js
Restart=always
RestartSec=3
User=$USER
Environment=PORT=8787

[Install]
WantedBy=multi-user.target
EOT
sudo systemctl daemon-reload
sudo systemctl enable vael-server >/dev/null 2>&1
sudo systemctl restart vael-server

echo "→ Configuration nginx (adresse /vael-ws)…"
if sudo grep -q 'vael-ws' "$CONF"; then
  echo "  déjà configuré."
else
  sudo cp "$CONF" "$CONF.bak-vael"
  BLOCK='    location /vael-ws {\n        proxy_pass http://127.0.0.1:8787;\n        proxy_http_version 1.1;\n        proxy_set_header Upgrade $http_upgrade;\n        proxy_set_header Connection "upgrade";\n        proxy_set_header Host $host;\n        proxy_read_timeout 3600s;\n    }\n\n'
  if sudo grep -q 'location /api/chat' "$CONF"; then ANCHOR='location \/api\/chat'; else ANCHOR='location \/'; fi
  sudo awk -v b="$BLOCK" -v a="$ANCHOR" '!d && $0 ~ a {printf "%s", b; d=1} {print}' "$CONF" | sudo tee "$CONF.new" >/dev/null
  sudo mv "$CONF.new" "$CONF"
  if sudo nginx -t 2>/dev/null; then sudo systemctl reload nginx; echo "  ajouté."
  else sudo cp "$CONF.bak-vael" "$CONF"; echo "✗ nginx a refusé la configuration : elle a été remise comme avant."; exit 1; fi
fi

sleep 1
if systemctl is-active --quiet vael-server; then echo "✓ Serveur multijoueur en marche. Testez « Jouer à plusieurs » sur https://3-wm.net/vael/"
else echo "✗ Le serveur ne démarre pas. Voir : sudo journalctl -u vael-server -n 30"; fi
