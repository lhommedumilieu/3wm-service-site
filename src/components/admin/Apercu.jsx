import { useEffect, useState } from 'react'
import {
  listerClients,
  listerInterventions,
  listerVentes,
  listerMessagesContact,
  listerChatLeads,
  listerErreurs,
  listerPresence,
  statsSite,
} from '../../lib/adminApi.js'
import { Panneau, StatCard, Vide, euros, formatDate } from './ui.jsx'

const FENETRE_EN_LIGNE_MS = 45_000

function heure() {
  const h = new Date().getHours()
  if (h < 6) return 'Bonne nuit'
  if (h < 18) return 'Bonjour'
  return 'Bonsoir'
}

export default function Apercu({ aller }) {
  const [d, setD] = useState(null)

  useEffect(() => {
    let annule = false
    Promise.allSettled([
      listerClients(),
      listerInterventions(),
      listerVentes(),
      listerMessagesContact(),
      listerChatLeads(),
      listerErreurs(),
      listerPresence(),
      statsSite(7),
    ]).then((r) => {
      if (annule) return
      const v = (i) => (r[i].status === 'fulfilled' ? r[i].value : null)
      setD({
        clients: v(0) || [],
        interventions: v(1) || [],
        ventes: v(2) || [],
        contacts: v(3) || [],
        leads: v(4) || [],
        erreurs: v(5) || [],
        presence: v(6) || [],
        stats: v(7),
      })
    })
    return () => {
      annule = true
    }
  }, [])

  if (!d) return <Vide>Chargement du tableau de bord…</Vide>

  const contactsATraiter = d.contacts.filter((m) => !m.traite)
  const leadsATraiter = d.leads.filter((m) => !m.traite)
  const aTraiter = contactsATraiter.length + leadsATraiter.length
  const enCours = d.interventions.filter((i) => i.statut === 'en_cours' || i.statut === 'diagnostic')
  const aEncaisser = d.interventions.filter((i) => i.statut === 'termine')
  const encaisse = d.interventions.filter((i) => i.statut === 'paye').reduce((s, i) => s + (Number(i.tarif) || 0), 0)
  const ebooks = d.ventes.reduce((s, v) => s + (Number(v.prix) || 0), 0)
  const enLigne = d.presence.filter((p) => Date.now() - new Date(p.last_seen).getTime() < FENETRE_EN_LIGNE_MS && !(p.path || '').startsWith('/admin')).length
  const erreurs7j = d.erreurs.filter((e) => Date.now() - new Date(e.created_at).getTime() < 7 * 86400000).length

  const afaire = []
  if (aTraiter) afaire.push({ ico: '✉️', texte: `${aTraiter} message${aTraiter > 1 ? 's' : ''} à traiter`, cible: 'reception' })
  if (enCours.length) afaire.push({ ico: '🛠️', texte: `${enCours.length} dépannage${enCours.length > 1 ? 's' : ''} en cours`, cible: 'clients' })
  if (aEncaisser.length) {
    const montant = aEncaisser.reduce((s, i) => s + (Number(i.tarif) || 0), 0)
    afaire.push({ ico: '💶', texte: `${aEncaisser.length} dépannage${aEncaisser.length > 1 ? 's' : ''} terminé${aEncaisser.length > 1 ? 's' : ''} à encaisser (${euros(montant)})`, cible: 'clients' })
  }
  if (erreurs7j) afaire.push({ ico: '🐞', texte: `${erreurs7j} erreur${erreurs7j > 1 ? 's' : ''} côté visiteur cette semaine`, cible: 'systeme' })

  const activite = [
    ...d.contacts.map((m) => ({ date: m.created_at, ico: '✉️', texte: `Message de ${m.name || 'un visiteur'} : ${m.sujet || 'contact'}` })),
    ...d.leads.map((m) => ({ date: m.created_at, ico: '💬', texte: `${m.visitor_name || 'Un visiteur'} a laissé ses coordonnées via le chat` })),
    ...d.interventions.map((i) => ({ date: i.created_at, ico: '🛠️', texte: `Dépannage : ${i.description || 'sans description'}` })),
    ...d.ventes.map((v) => ({ date: v.created_at, ico: '📘', texte: `Vente : ${v.tome}` })),
  ]
    .sort((a, b) => new Date(b.date) - new Date(a.date))
    .slice(0, 8)

  return (
    <div className="admin-onglet">
      <div className="admin-bienvenue">
        <h2>{heure()} 👋</h2>
        <p>{afaire.length ? 'Voici ce qui demande votre attention.' : 'Tout est à jour, rien d’urgent.'}</p>
      </div>

      <div className="admin-stats">
        <StatCard label="En ligne maintenant" valeur={enLigne} ton="vert" />
        <StatCard label="Vues (7 jours)" valeur={d.stats ? d.stats.periode : '—'} />
        <StatCard label="Clients" valeur={d.clients.length} />
        <StatCard label="Encaissé (dépannages)" valeur={euros(encaisse)} ton="vert" />
        <StatCard label="Ventes d'ebooks" valeur={euros(ebooks)} aide={`${d.ventes.length} vendu${d.ventes.length > 1 ? 's' : ''}`} />
      </div>

      <div className="admin-deux-colonnes egal">
        <Panneau titre="À faire">
          {afaire.length === 0 ? (
            <Vide>Rien à faire pour le moment. 🎉</Vide>
          ) : (
            <ul className="admin-liste">
              {afaire.map((a) => (
                <li key={a.texte}>
                  <button type="button" className="admin-ligne" onClick={() => aller(a.cible)}>
                    <span className="admin-avatar" aria-hidden="true">{a.ico}</span>
                    <span className="admin-ligne-texte"><strong>{a.texte}</strong></span>
                    <span className="admin-ligne-meta">Ouvrir →</span>
                  </button>
                </li>
              ))}
            </ul>
          )}
        </Panneau>

        <Panneau titre="Activité récente">
          {activite.length === 0 ? (
            <Vide>Aucune activité enregistrée pour le moment.</Vide>
          ) : (
            <ul className="admin-liste compact">
              {activite.map((a, i) => (
                <li key={i} className="admin-activite">
                  <span aria-hidden="true">{a.ico}</span>
                  <span>{a.texte}</span>
                  <time>{formatDate(a.date)}</time>
                </li>
              ))}
            </ul>
          )}
        </Panneau>
      </div>
    </div>
  )
}
