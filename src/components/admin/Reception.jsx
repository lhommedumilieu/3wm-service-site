import { useMemo, useState } from 'react'
import {
  listerMessagesContact,
  majMessageContact,
  supprimerMessageContact,
  listerChatLeads,
  majChatLead,
  supprimerChatLead,
  listerNewsletter,
  supprimerAbonne,
} from '../../lib/adminApi.js'
import { Erreur, Panneau, Pastille, StatCard, Vide, confirmer, formatDate, useListe } from './ui.jsx'

const FILTRES = [
  { id: 'tous', libelle: 'Tout' },
  { id: 'contact', libelle: 'Formulaire' },
  { id: 'chat', libelle: 'Chatbot' },
  { id: 'newsletter', libelle: 'Newsletter' },
]

// Les contacts du chat arrivent sous forme de transcription (webhook du service
// de chat) : { chat: { messages: [{ sender: { t, n }, msg, time }] } }.
function extraitChat(lead) {
  const t = lead.transcript
  const messages = Array.isArray(t?.chat?.messages) ? t.chat.messages : Array.isArray(t) ? t : []
  const lignes = messages
    .filter((m) => (m.msg ?? m.content ?? m.text))
    .map((m) => {
      const visiteur = m.sender?.t === 'v' || m.role === 'user'
      const qui = visiteur ? 'Visiteur' : m.sender?.n || 'Réponse'
      return `${qui} : ${m.msg ?? m.content ?? m.text}`
    })
  return lignes.length ? lignes.join('\n') : 'Conversation sans message lisible.'
}

export default function Reception() {
  const contacts = useListe(listerMessagesContact)
  const leads = useListe(listerChatLeads)
  const abonnes = useListe(listerNewsletter)

  const [filtre, setFiltre] = useState('tous')
  const [masquerTraites, setMasquerTraites] = useState(true)
  const [ouvert, setOuvert] = useState(null)
  const [erreur, setErreur] = useState('')

  const elements = useMemo(() => {
    const l = []
    for (const m of contacts.donnees || []) {
      l.push({
        cle: `contact-${m.id}`, type: 'contact', id: m.id, date: m.created_at, traite: !!m.traite,
        nom: m.name || 'Sans nom', email: m.email, titre: m.sujet || 'Message', texte: m.message || '',
      })
    }
    for (const c of leads.donnees || []) {
      l.push({
        cle: `chat-${c.id}`, type: 'chat', id: c.id, date: c.created_at, traite: !!c.traite,
        nom: c.visitor_name || 'Visiteur du chat', email: c.visitor_email, titre: 'Contact laissé via le chatbot', texte: extraitChat(c),
      })
    }
    for (const a of abonnes.donnees || []) {
      l.push({
        cle: `news-${a.id}`, type: 'newsletter', id: a.id, date: a.created_at, traite: true,
        nom: a.email, email: a.email, titre: `Inscription newsletter${a.source ? ` (${a.source})` : ''}`, texte: '',
      })
    }
    return l.sort((a, b) => new Date(b.date) - new Date(a.date))
  }, [contacts.donnees, leads.donnees, abonnes.donnees])

  const nonTraites = elements.filter((e) => !e.traite).length
  const visibles = elements.filter((e) => {
    if (filtre === 'contact' && e.type !== 'contact') return false
    if (filtre === 'chat' && e.type !== 'chat') return false
    if (filtre === 'newsletter' && e.type !== 'newsletter') return false
    if (masquerTraites && e.type !== 'newsletter' && e.traite) return false
    return true
  })

  async function basculerTraite(e) {
    setErreur('')
    try {
      if (e.type === 'contact') {
        await majMessageContact(e.id, { traite: !e.traite })
        await contacts.recharger()
      } else if (e.type === 'chat') {
        await majChatLead(e.id, { traite: !e.traite })
        await leads.recharger()
      }
    } catch (err) {
      setErreur(err.message)
    }
  }

  async function retirer(e) {
    if (!confirmer('Supprimer définitivement cet élément ?')) return
    setErreur('')
    try {
      if (e.type === 'contact') {
        await supprimerMessageContact(e.id)
        await contacts.recharger()
      } else if (e.type === 'chat') {
        await supprimerChatLead(e.id)
        await leads.recharger()
      } else {
        await supprimerAbonne(e.id)
        await abonnes.recharger()
      }
      setOuvert(null)
    } catch (err) {
      setErreur(err.message)
    }
  }

  const chargement = contacts.donnees === null || leads.donnees === null || abonnes.donnees === null

  return (
    <div className="admin-onglet">
      <div className="admin-stats">
        <StatCard label="À traiter" valeur={nonTraites} ton={nonTraites ? 'orange' : 'vert'} aide={nonTraites ? 'Messages non marqués « traité »' : 'Tout est à jour'} />
        <StatCard label="Messages du formulaire" valeur={(contacts.donnees || []).length} />
        <StatCard label="Contacts du chatbot" valeur={(leads.donnees || []).length} />
        <StatCard label="Inscrits newsletter" valeur={(abonnes.donnees || []).length} />
      </div>

      <Erreur>{erreur || contacts.erreur || leads.erreur || abonnes.erreur}</Erreur>

      <Panneau
        titre="Boîte de réception"
        actions={
          <>
            <div className="segment" role="group" aria-label="Filtrer par origine">
              {FILTRES.map((f) => (
                <button key={f.id} type="button" className={filtre === f.id ? 'actif' : ''} onClick={() => setFiltre(f.id)}>{f.libelle}</button>
              ))}
            </div>
            <label className="admin-case">
              <input type="checkbox" checked={masquerTraites} onChange={(e) => setMasquerTraites(e.target.checked)} />
              Masquer les traités
            </label>
          </>
        }
      >
        {chargement ? (
          <Vide>Chargement…</Vide>
        ) : visibles.length === 0 ? (
          <Vide>{masquerTraites && elements.length ? 'Rien à traiter pour le moment. 🎉' : 'Aucun message pour le moment.'}</Vide>
        ) : (
          <ul className="inbox">
            {visibles.map((e) => {
              const estOuvert = ouvert === e.cle
              return (
                <li key={e.cle} className={`inbox-item${e.traite ? ' traite' : ''}${estOuvert ? ' ouvert' : ''}`}>
                  <button type="button" className="inbox-tete" onClick={() => setOuvert(estOuvert ? null : e.cle)} aria-expanded={estOuvert}>
                    <span className={`inbox-type type-${e.type}`}>{e.type === 'contact' ? '✉️' : e.type === 'chat' ? '💬' : '📰'}</span>
                    <span className="inbox-texte">
                      <strong>{e.nom}</strong>
                      <small>{e.titre}</small>
                    </span>
                    {!e.traite && <Pastille ton="orange">Nouveau</Pastille>}
                    <time>{formatDate(e.date)}</time>
                  </button>
                  {estOuvert && (
                    <div className="inbox-corps">
                      {e.email && <p><span className="small">E-mail : </span><a href={`mailto:${e.email}`}>{e.email}</a></p>}
                      {e.texte && <pre className="inbox-message">{e.texte}</pre>}
                      <div className="admin-form-actions">
                        {e.email && e.type !== 'newsletter' && (
                          <a
                            className="btn btn-primary btn-sm"
                            href={`mailto:${e.email}?subject=${encodeURIComponent(`Re: ${e.titre}`)}`}
                            onClick={() => !e.traite && basculerTraite(e)}
                          >
                            Répondre par e-mail
                          </a>
                        )}
                        {e.type !== 'newsletter' && (
                          <button type="button" className="btn btn-outline btn-sm" onClick={() => basculerTraite(e)}>
                            {e.traite ? 'Remettre à traiter' : 'Marquer comme traité'}
                          </button>
                        )}
                        <button type="button" className="btn btn-outline btn-sm danger" onClick={() => retirer(e)}>Supprimer</button>
                      </div>
                    </div>
                  )}
                </li>
              )
            })}
          </ul>
        )}
      </Panneau>
    </div>
  )
}
