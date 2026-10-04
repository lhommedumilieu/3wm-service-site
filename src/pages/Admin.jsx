import { lazy, Suspense, useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { useAuth } from '../context/AuthContext.jsx'
import useDocumentMeta from '../hooks/useDocumentMeta.js'
import { listerChatLeads, listerMessagesContact } from '../lib/adminApi.js'

const Apercu = lazy(() => import('../components/admin/Apercu.jsx'))
const Clients = lazy(() => import('../components/admin/Clients.jsx'))
const Statistiques = lazy(() => import('../components/admin/Statistiques.jsx'))
const Reception = lazy(() => import('../components/admin/Reception.jsx'))
const Moderation = lazy(() => import('../components/admin/Moderation.jsx'))
const Comptes = lazy(() => import('../components/admin/Comptes.jsx'))
const Systeme = lazy(() => import('../components/admin/Systeme.jsx'))
const AvisAdmin = lazy(() => import('../components/admin/Avis.jsx'))

const ADMIN_EMAIL = 'service@3-wm.net'

const ONGLETS = [
  { id: 'apercu', ico: '🏠', libelle: 'Accueil', composant: Apercu },
  { id: 'clients', ico: '🧑‍💼', libelle: 'Clients & dépannages', composant: Clients },
  { id: 'reception', ico: '✉️', libelle: 'Messages', composant: Reception },
  { id: 'stats', ico: '📈', libelle: 'Statistiques', composant: Statistiques },
  { id: 'avis', ico: '⭐', libelle: 'Avis clients', composant: AvisAdmin },
  { id: 'moderation', ico: '🛡️', libelle: 'Forum & commentaires', composant: Moderation },
  { id: 'comptes', ico: '👥', libelle: 'Comptes membres', composant: Comptes },
  { id: 'systeme', ico: '⚙️', libelle: 'Chatbot & erreurs', composant: Systeme },
]

function lireOnglet() {
  try {
    const demande = window.location.hash.replace('#', '')
    if (ONGLETS.some((o) => o.id === demande)) return demande
  } catch {
    /* pas de navigateur */
  }
  return 'apercu'
}

function Message({ titre, texte, bouton }) {
  return (
    <div className="page-header">
      <div className="container">
        {titre && <h1>{titre}</h1>}
        {texte && <p>{texte}</p>}
        {bouton}
      </div>
    </div>
  )
}

export default function Admin() {
  const { user, loading: chargementSession } = useAuth()
  useDocumentMeta('Administration', 'Tableau de bord du site.', undefined)

  const [onglet, setOnglet] = useState(lireOnglet)
  const [aTraiter, setATraiter] = useState(0)
  const estAdmin = user?.email === ADMIN_EMAIL

  function aller(id) {
    setOnglet(id)
    try {
      window.history.replaceState(null, '', `#${id}`)
      window.scrollTo({ top: 0 })
    } catch {
      /* sans conséquence */
    }
  }

  // Suit les changements de #ancre (retour arrière, lien direct vers un onglet).
  useEffect(() => {
    const surChangement = () => setOnglet(lireOnglet())
    window.addEventListener('hashchange', surChangement)
    return () => window.removeEventListener('hashchange', surChangement)
  }, [])

  // Pastille « messages à traiter » dans le menu (se met à jour à chaque changement d'onglet).
  useEffect(() => {
    if (!estAdmin) return
    let annule = false
    Promise.allSettled([listerMessagesContact(), listerChatLeads()]).then(([c, l]) => {
      if (annule) return
      const n = (r) => (r.status === 'fulfilled' ? (r.value || []).filter((x) => !x.traite).length : 0)
      setATraiter(n(c) + n(l))
    })
    return () => {
      annule = true
    }
  }, [estAdmin, onglet])

  if (chargementSession) return <Message texte="Chargement…" />
  if (!user) {
    return (
      <Message
        titre="Administration"
        texte="Vous devez être connecté avec le compte administrateur pour accéder à cette page."
        bouton={<Link to="/connexion" className="btn btn-primary">Se connecter</Link>}
      />
    )
  }
  if (!estAdmin) return <Message titre="Administration" texte="Cette page est réservée à l'administrateur du site." />

  const actif = ONGLETS.find((o) => o.id === onglet) || ONGLETS[0]
  const Composant = actif.composant

  return (
    <div className="admin-page">
      <div className="container admin-shell">
        <aside className="admin-menu" aria-label="Sections de l'administration">
          <p className="admin-menu-titre">Administration</p>
          <nav>
            {ONGLETS.map((o) => (
              <button
                key={o.id}
                type="button"
                className={`admin-menu-lien${o.id === actif.id ? ' actif' : ''}`}
                onClick={() => aller(o.id)}
                aria-current={o.id === actif.id ? 'page' : undefined}
              >
                <span aria-hidden="true">{o.ico}</span>
                <span className="admin-menu-texte">{o.libelle}</span>
                {o.id === 'reception' && aTraiter > 0 && <span className="admin-menu-badge">{aTraiter}</span>}
              </button>
            ))}
          </nav>
        </aside>

        <main className="admin-contenu">
          <h1 className="admin-titre">{actif.ico} {actif.libelle}</h1>
          <Suspense fallback={<p className="admin-vide">Chargement…</p>}>
            <Composant aller={aller} />
          </Suspense>
        </main>
      </div>
    </div>
  )
}
