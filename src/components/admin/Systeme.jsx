import { useState } from 'react'
import { listerErreurs, listerMessagesChat } from '../../lib/adminApi.js'
import { Erreur, Panneau, StatCard, Vide, formatDate, useListe } from './ui.jsx'

// Regroupe les messages du chatbot par visiteur pour lire chaque
// conversation d'un seul coup d'œil, du plus récent au plus ancien.
function grouperConversations(messages) {
  const map = new Map()
  for (const m of messages) {
    const cle = m.visitor_id || 'inconnu'
    const c = map.get(cle) || { visiteur: cle, messages: [], derniere: m.created_at }
    c.messages.push(m)
    if (new Date(m.created_at) > new Date(c.derniere)) c.derniere = m.created_at
    map.set(cle, c)
  }
  return [...map.values()]
    .map((c) => ({ ...c, messages: c.messages.sort((a, b) => new Date(a.created_at) - new Date(b.created_at)) }))
    .sort((a, b) => new Date(b.derniere) - new Date(a.derniere))
}

export default function Systeme() {
  const erreurs = useListe(listerErreurs)
  const chat = useListe(listerMessagesChat)
  const [ouvert, setOuvert] = useState(null)

  const listeErreurs = erreurs.donnees || []
  const conversations = grouperConversations(chat.donnees || [])
  const sept = listeErreurs.filter((e) => Date.now() - new Date(e.created_at).getTime() < 7 * 86400000).length

  return (
    <div className="admin-onglet">
      <div className="admin-stats">
        <StatCard label="Conversations chatbot" valeur={conversations.length} />
        <StatCard label="Messages chatbot" valeur={(chat.donnees || []).length} />
        <StatCard label="Erreurs (7 derniers jours)" valeur={sept} ton={sept ? 'orange' : 'vert'} aide={sept ? 'À regarder ci-dessous' : 'Rien à signaler'} />
        <StatCard label="Erreurs au total" valeur={listeErreurs.length} />
      </div>

      <Erreur>{erreurs.erreur || chat.erreur}</Erreur>

      <Panneau titre="Conversations avec l'assistant (Cams)">
        {chat.donnees === null ? (
          <Vide>Chargement…</Vide>
        ) : conversations.length === 0 ? (
          <Vide>Aucune conversation enregistrée pour le moment.</Vide>
        ) : (
          <ul className="inbox">
            {conversations.map((c) => {
              const estOuvert = ouvert === c.visiteur
              const premier = c.messages.find((m) => m.role === 'user')
              return (
                <li key={c.visiteur} className={`inbox-item${estOuvert ? ' ouvert' : ''}`}>
                  <button type="button" className="inbox-tete" onClick={() => setOuvert(estOuvert ? null : c.visiteur)} aria-expanded={estOuvert}>
                    <span className="inbox-type type-chat">💬</span>
                    <span className="inbox-texte">
                      <strong>Visiteur {c.visiteur.slice(0, 8)}</strong>
                      <small>{premier ? premier.content.slice(0, 90) : 'Conversation'} · {c.messages.length} message{c.messages.length > 1 ? 's' : ''}</small>
                    </span>
                    <time>{formatDate(c.derniere)}</time>
                  </button>
                  {estOuvert && (
                    <div className="inbox-corps conversation">
                      {c.messages.map((m) => (
                        <p key={m.id} className={`bulle ${m.role === 'user' ? 'visiteur' : 'cams'}`}>
                          <span>{m.role === 'user' ? 'Visiteur' : 'Cams'}</span>
                          {m.content}
                        </p>
                      ))}
                    </div>
                  )}
                </li>
              )
            })}
          </ul>
        )}
      </Panneau>

      <Panneau titre="Erreurs remontées côté visiteur">
        <p className="small">Capturées automatiquement quand une page plante dans le navigateur d'un visiteur.</p>
        {erreurs.donnees === null ? (
          <Vide>Chargement…</Vide>
        ) : listeErreurs.length === 0 ? (
          <Vide>Aucune erreur remontée pour le moment.</Vide>
        ) : (
          <div className="admin-table-wrap" style={{ maxHeight: 420 }}>
            <table className="admin-table">
              <thead>
                <tr><th>Date</th><th>Message</th><th>Page</th><th>Appareil</th></tr>
              </thead>
              <tbody>
                {listeErreurs.map((e) => (
                  <tr key={e.id}>
                    <td className="nowrap">{formatDate(e.created_at)}</td>
                    <td className="cellule-large">{e.message}</td>
                    <td>{e.path || '—'}</td>
                    <td className="cellule-petite">{e.user_agent || '—'}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </Panneau>
    </div>
  )
}
