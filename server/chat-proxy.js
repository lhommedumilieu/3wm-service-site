// Petit service qui fait le lien entre le site 3-wm.net et l'IA locale
// (Ollama, sur la VM ia-3wm). Ne parle jamais directement au navigateur du
// visiteur : nginx redirige /api/chat vers ce service, qui lui interroge
// Ollama sur le reseau interne uniquement.
//
// Lancement :  OLLAMA_HOST=http://<ip-ia-3wm>:11434 node chat-proxy.js
// (voir chat-ia.service pour le lancement automatique au demarrage)

const http = require('http')

const PORT = process.env.PORT || 3001
const OLLAMA_HOST = process.env.OLLAMA_HOST || 'http://127.0.0.1:11434'
const MODEL = process.env.OLLAMA_MODEL || 'llama3.1:8b'

const PROMPT_SYSTEME = `Tu es l'assistant du site 3WM Service (3-wm.net), tenu par un auto-entrepreneur francais surnomme "L'Homme du Milieu".

Ce que propose 3WM Service :
- Depannage informatique Windows a distance (PC lent, virus, bugs, imprimante, Wi-Fi, messagerie). Le client garde le controle, prend rendez-vous via la page Contact. Tarifs annonces avant intervention, diagnostic gratuit, "pas repare = pas paye".
- Des ebooks sur les bases de Linux et la cybersecurite, en vente sur la page Boutique.
- Une page Recommandations avec des outils de securite (VPN, gestionnaire de mots de passe) recommandes par 3WM Service.

Regles :
- Reponds toujours en francais, de maniere breve, chaleureuse et professionnelle (2-4 phrases maximum).
- Si on te demande un prix exact, dis que le diagnostic est gratuit et que le tarif est confirme avant toute intervention, invite a passer par la page Contact.
- Si la question sort de ton domaine (rien a voir avec depannage informatique, Linux, cybersecurite ou les services du site), dis poliment que tu ne peux aider que sur ces sujets.
- Ne donne jamais de conseil medical, juridique ou financier.
- Si tu ne sais pas, dis-le simplement et invite a utiliser la page Contact plutot que d'inventer une reponse.`

function ipClient(req) {
  return (req.headers['x-forwarded-for'] || req.socket.remoteAddress || '').split(',')[0].trim()
}

// Limite simple : 20 messages par minute et par IP, pour eviter les abus
// sur un service expose publiquement.
const compteurs = new Map()
function limiteAtteinte(ip) {
  const maintenant = Date.now()
  const fenetre = 60_000
  const entree = compteurs.get(ip) || { debut: maintenant, nombre: 0 }
  if (maintenant - entree.debut > fenetre) {
    entree.debut = maintenant
    entree.nombre = 0
  }
  entree.nombre += 1
  compteurs.set(ip, entree)
  return entree.nombre > 20
}

const serveur = http.createServer(async (req, res) => {
  if (req.method !== 'POST' || req.url !== '/api/chat') {
    res.writeHead(404, { 'Content-Type': 'application/json' })
    res.end(JSON.stringify({ error: 'not_found' }))
    return
  }

  const ip = ipClient(req)
  if (limiteAtteinte(ip)) {
    res.writeHead(429, { 'Content-Type': 'application/json' })
    res.end(JSON.stringify({ error: 'trop_de_requetes' }))
    return
  }

  let corps = ''
  req.on('data', (morceau) => { corps += morceau; if (corps.length > 20_000) req.destroy() })
  req.on('end', async () => {
    try {
      const { messages } = JSON.parse(corps || '{}')
      if (!Array.isArray(messages) || messages.length === 0) {
        res.writeHead(400, { 'Content-Type': 'application/json' })
        res.end(JSON.stringify({ error: 'messages_manquants' }))
        return
      }

      const messagesOllama = [
        { role: 'system', content: PROMPT_SYSTEME },
        ...messages
          .filter((m) => m && typeof m.content === 'string')
          .slice(-10)
          .map((m) => ({ role: m.role === 'user' ? 'user' : 'assistant', content: m.content.slice(0, 2000) })),
      ]

      const controleur = new AbortController()
      const delai = setTimeout(() => controleur.abort(), 30_000)

      const reponse = await fetch(`${OLLAMA_HOST}/api/chat`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ model: MODEL, messages: messagesOllama, stream: false }),
        signal: controleur.signal,
      })
      clearTimeout(delai)

      if (!reponse.ok) throw new Error(`ollama_${reponse.status}`)
      const data = await reponse.json()
      const texte = data?.message?.content?.trim() || "Désolé, je n'ai pas de réponse pour le moment."

      res.writeHead(200, { 'Content-Type': 'application/json' })
      res.end(JSON.stringify({ reply: texte }))
    } catch (erreur) {
      console.error('Erreur chat-proxy :', erreur.message)
      res.writeHead(502, { 'Content-Type': 'application/json' })
      res.end(JSON.stringify({ error: 'ia_indisponible' }))
    }
  })
})

serveur.listen(PORT, '127.0.0.1', () => {
  console.log(`chat-proxy en ecoute sur 127.0.0.1:${PORT}, IA : ${OLLAMA_HOST}`)
})
