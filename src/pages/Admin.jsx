import { useCallback, useEffect, useMemo, useState } from 'react'
import { Link } from 'react-router-dom'
import { useAuth } from '../context/AuthContext.jsx'
import useDocumentMeta from '../hooks/useDocumentMeta.js'
import {
  listerComptes,
  creerCompte,
  bannirCompte,
  reactiverCompte,
  supprimerCompte,
  listerPresence,
  listerErreurs,
  listerVentes,
  listerMessagesContact,
  listerMessagesChat,
  compterLignes,
} from '../lib/adminApi.js'

const ADMIN_EMAIL = 'service@3-wm.net'
// Un compte est considéré "en ligne" si son dernier signal date de moins
// de 45s (le site envoie un signal toutes les 20s tant que l'onglet est ouvert).
const FENETRE_EN_LIGNE_MS = 45_000

function estBanni(utilisateur) {
  if (!utilisateur.banned_until) return false
  return new Date(utilisateur.banned_until).getTime() > Date.now()
}

function formatDate(valeur) {
  if (!valeur) return '—'
  return new Date(valeur).toLocaleString('fr-FR')
}

function StatCard({ label, valeur }) {
  return (
    <div className="card" style={{ padding: '16px 18px' }}>
      <p className="small" style={{ margin: 0, opacity: 0.75 }}>{label}</p>
      <p style={{ margin: '4px 0 0', fontSize: '1.6rem', fontWeight: 700 }}>{valeur}</p>
    </div>
  )
}

export default function Admin() {
  const { user, loading: chargementSession } = useAuth()

  useDocumentMeta('Administration', 'Gestion des comptes membres du site.', undefined)

  const [comptes, setComptes] = useState(null)
  const [presence, setPresence] = useState([])
  const [erreurs, setErreurs] = useState([])
  const [ventes, setVentes] = useState([])
  const [messagesContact, setMessagesContact] = useState([])
  const [messagesChat, setMessagesChat] = useState([])
  const [nbVues, setNbVues] = useState(null)
  const [erreur, setErreur] = useState('')
  const [chargement, setChargement] = useState(true)
  const [actionEnCours, setActionEnCours] = useState(null)

  const [nouvelEmail, setNouvelEmail] = useState('')
  const [nouveauMdp, setNouveauMdp] = useState('')
  const [creationEnCours, setCreationEnCours] = useState(false)
  const [messageCreation, setMessageCreation] = useState('')

  const [rechercheComptes, setRechercheComptes] = useState('')
  const [tri, setTri] = useState({ champ: 'created_at', direction: 'desc' })

  const estAdmin = user?.email === ADMIN_EMAIL

  const rafraichir = useCallback(async () => {
    if (!estAdmin) return
    setChargement(true)
    setErreur('')
    try {
      const [
        reponseComptes,
        lignesPresence,
        lignesErreurs,
        lignesVentes,
        lignesContact,
        lignesChat,
        totalVues,
      ] = await Promise.allSettled([
        listerComptes(),
        listerPresence(),
        listerErreurs(),
        listerVentes(),
        listerMessagesContact(),
        listerMessagesChat(),
        compterLignes('page_views'),
      ])

      if (reponseComptes.status === 'fulfilled') setComptes(reponseComptes.value.users || [])
      else setErreur(reponseComptes.reason?.message || 'Impossible de charger les comptes.')

      setPresence(lignesPresence.status === 'fulfilled' ? lignesPresence.value || [] : [])
      setErreurs(lignesErreurs.status === 'fulfilled' ? lignesErreurs.value || [] : [])
      setVentes(lignesVentes.status === 'fulfilled' ? lignesVentes.value || [] : [])
      setMessagesContact(lignesContact.status === 'fulfilled' ? lignesContact.value || [] : [])
      setMessagesChat(lignesChat.status === 'fulfilled' ? lignesChat.value || [] : [])
      setNbVues(totalVues.status === 'fulfilled' ? totalVues.value : null)
    } finally {
      setChargement(false)
    }
  }, [estAdmin])

  useEffect(() => {
    if (estAdmin) rafraichir()
  }, [estAdmin, rafraichir])

  async function handleCreation(e) {
    e.preventDefault()
    setCreationEnCours(true)
    setMessageCreation('')
    try {
      await creerCompte(nouvelEmail.trim(), nouveauMdp)
      setMessageCreation(`Compte créé pour ${nouvelEmail.trim()}.`)
      setNouvelEmail('')
      setNouveauMdp('')
      rafraichir()
    } catch (err) {
      setMessageCreation(`Erreur : ${err.message}`)
    } finally {
      setCreationEnCours(false)
    }
  }

  async function handleBannir(utilisateur) {
    const bannir = !estBanni(utilisateur)
    const confirmation = bannir
      ? `Bannir ${utilisateur.email} ? Ce compte ne pourra plus se connecter.`
      : `Réactiver ${utilisateur.email} ?`
    if (!window.confirm(confirmation)) return

    setActionEnCours(utilisateur.id)
    try {
      if (bannir) await bannirCompte(utilisateur.id)
      else await reactiverCompte(utilisateur.id)
      await rafraichir()
    } catch (e) {
      setErreur(e.message)
    } finally {
      setActionEnCours(null)
    }
  }

  async function handleSupprimer(utilisateur) {
    if (!window.confirm(`Supprimer définitivement le compte de ${utilisateur.email} ? Cette action est irréversible.`)) return
    setActionEnCours(utilisateur.id)
    try {
      await supprimerCompte(utilisateur.id)
      await rafraichir()
    } catch (e) {
      setErreur(e.message)
    } finally {
      setActionEnCours(null)
    }
  }

  function trier(champ) {
    setTri((t) => ({
      champ,
      direction: t.champ === champ && t.direction === 'asc' ? 'desc' : 'asc',
    }))
  }

  const comptesAffiches = useMemo(() => {
    const source = comptes || []
    const recherche = rechercheComptes.trim().toLowerCase()
    const filtres = recherche
      ? source.filter((c) => c.email?.toLowerCase().includes(recherche))
      : source

    const triees = [...filtres].sort((a, b) => {
      let va, vb
      if (tri.champ === 'email') {
        va = a.email || ''
        vb = b.email || ''
      } else if (tri.champ === 'statut') {
        va = estBanni(a) ? 1 : 0
        vb = estBanni(b) ? 1 : 0
      } else {
        va = new Date(a.created_at).getTime()
        vb = new Date(b.created_at).getTime()
      }
      if (va < vb) return tri.direction === 'asc' ? -1 : 1
      if (va > vb) return tri.direction === 'asc' ? 1 : -1
      return 0
    })
    return triees
  }, [comptes, rechercheComptes, tri])

  const totalVentesEuros = useMemo(
    () => ventes.reduce((somme, v) => somme + (Number(v.prix) || 0), 0),
    [ventes]
  )

  if (chargementSession) {
    return (
      <div className="page-header">
        <div className="container">
          <p>Chargement…</p>
        </div>
      </div>
    )
  }

  if (!user) {
    return (
      <div className="page-header">
        <div className="container">
          <h1>Administration</h1>
          <p>Vous devez être connecté avec le compte administrateur pour accéder à cette page.</p>
          <Link to="/connexion" className="btn btn-primary">Se connecter</Link>
        </div>
      </div>
    )
  }

  if (!estAdmin) {
    return (
      <div className="page-header">
        <div className="container">
          <h1>Administration</h1>
          <p>Cette page est réservée à l'administrateur du site.</p>
        </div>
      </div>
    )
  }

  const enLigne = new Set(
    presence
      .filter((p) => Date.now() - new Date(p.last_seen).getTime() < FENETRE_EN_LIGNE_MS)
      .map((p) => p.visitor_id)
  )

  return (
    <>
      <div className="page-header">
        <div className="container">
          <p className="eyebrow">Administration</p>
          <h1>Administration — comptes membres</h1>
          <p>Comptes inscrits, présence en direct, création et bannissement.</p>
        </div>
      </div>

      <section>
        <div className="container">
          {erreur && <p className="small" style={{ color: '#e5484d' }}>{erreur}</p>}

          <h3 className="mt-0">Vue d'ensemble</h3>
          <div
            className="grid"
            style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(140px, 1fr))', gap: 12, marginBottom: 32 }}
          >
            <StatCard label="Visiteurs en ligne" valeur={enLigne.size} />
            <StatCard label="Vues de page" valeur={nbVues ?? '—'} />
            <StatCard label="Comptes membres" valeur={comptes ? comptes.length : '—'} />
            <StatCard label="Ebooks vendus" valeur={ventes.length} />
            <StatCard label="Revenu ebooks" valeur={`${totalVentesEuros.toFixed(2)} €`} />
            <StatCard label="Messages contact" valeur={messagesContact.length} />
            <StatCard label="Messages chat" valeur={messagesChat.length} />
            <StatCard label="Erreurs remontées" valeur={erreurs.length} />
          </div>

          <div className="grid grid-2" style={{ marginBottom: 32 }}>
            <div className="card">
              <h3 className="mt-0">Visiteurs en ligne maintenant</h3>
              <p className="small">{enLigne.size} visiteur{enLigne.size > 1 ? 's' : ''} actif{enLigne.size > 1 ? 's' : ''} (signal envoyé toutes les 20 secondes).</p>
              {presence.slice(0, 8).map((p) => (
                <p key={p.visitor_id} className="small" style={{ marginBottom: 4 }}>
                  {Date.now() - new Date(p.last_seen).getTime() < FENETRE_EN_LIGNE_MS ? '🟢' : '⚪'} {p.path || '/'} — {new Date(p.last_seen).toLocaleTimeString('fr-FR')}
                </p>
              ))}
            </div>

            <div className="card">
              <h3 className="mt-0">Ajouter un compte</h3>
              <form onSubmit={handleCreation} style={{ display: 'grid', gap: 10 }}>
                <input
                  type="email"
                  placeholder="Email du nouveau membre"
                  required
                  value={nouvelEmail}
                  onChange={(e) => setNouvelEmail(e.target.value)}
                />
                <input
                  type="password"
                  placeholder="Mot de passe (6 caractères min.)"
                  required
                  minLength={6}
                  value={nouveauMdp}
                  onChange={(e) => setNouveauMdp(e.target.value)}
                />
                <button type="submit" className="btn btn-primary" disabled={creationEnCours}>
                  {creationEnCours ? 'Création…' : 'Créer le compte'}
                </button>
                {messageCreation && <p className="small">{messageCreation}</p>}
              </form>
            </div>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 12, flexWrap: 'wrap' }}>
            <h3 style={{ margin: 0 }}>Comptes inscrits {comptes ? `(${comptesAffiches.length}/${comptes.length})` : ''}</h3>
            <input
              type="search"
              placeholder="Rechercher un email…"
              value={rechercheComptes}
              onChange={(e) => setRechercheComptes(e.target.value)}
              style={{ maxWidth: 260 }}
            />
          </div>
          {chargement ? (
            <p>Chargement…</p>
          ) : (
            <div style={{ overflowX: 'auto', marginBottom: 40 }}>
              <table className="admin-table" style={{ width: '100%', borderCollapse: 'collapse' }}>
                <thead>
                  <tr style={{ textAlign: 'left' }}>
                    <th style={{ padding: '8px 12px', cursor: 'pointer' }} onClick={() => trier('email')}>
                      Email {tri.champ === 'email' ? (tri.direction === 'asc' ? '▲' : '▼') : ''}
                    </th>
                    <th style={{ padding: '8px 12px', cursor: 'pointer' }} onClick={() => trier('created_at')}>
                      Créé le {tri.champ === 'created_at' ? (tri.direction === 'asc' ? '▲' : '▼') : ''}
                    </th>
                    <th style={{ padding: '8px 12px', cursor: 'pointer' }} onClick={() => trier('statut')}>
                      Statut {tri.champ === 'statut' ? (tri.direction === 'asc' ? '▲' : '▼') : ''}
                    </th>
                    <th style={{ padding: '8px 12px' }}>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {comptesAffiches.map((c) => (
                    <tr key={c.id} style={{ borderTop: '1px solid var(--border, #e2e2e2)' }}>
                      <td style={{ padding: '8px 12px' }}>{c.email}</td>
                      <td style={{ padding: '8px 12px' }}>{new Date(c.created_at).toLocaleDateString('fr-FR')}</td>
                      <td style={{ padding: '8px 12px' }}>{estBanni(c) ? '⛔ Banni' : '✅ Actif'}</td>
                      <td style={{ padding: '8px 12px', display: 'flex', gap: 8 }}>
                        <button
                          type="button"
                          className="btn btn-outline"
                          disabled={actionEnCours === c.id || c.email === ADMIN_EMAIL}
                          onClick={() => handleBannir(c)}
                        >
                          {estBanni(c) ? 'Réactiver' : 'Bannir'}
                        </button>
                        <button
                          type="button"
                          className="btn btn-outline"
                          disabled={actionEnCours === c.id || c.email === ADMIN_EMAIL}
                          onClick={() => handleSupprimer(c)}
                        >
                          Supprimer
                        </button>
                      </td>
                    </tr>
                  ))}
                  {comptesAffiches.length === 0 && (
                    <tr>
                      <td colSpan={4} style={{ padding: '12px' }} className="small">Aucun compte ne correspond à la recherche.</td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          )}

          <h3>Ventes d'ebooks {ventes.length ? `(${ventes.length})` : ''}</h3>
          {ventes.length === 0 ? (
            <p className="small" style={{ marginBottom: 40 }}>Aucune vente enregistrée pour le moment.</p>
          ) : (
            <div style={{ overflowX: 'auto', marginBottom: 40 }}>
              <table className="admin-table" style={{ width: '100%', borderCollapse: 'collapse' }}>
                <thead>
                  <tr style={{ textAlign: 'left' }}>
                    <th style={{ padding: '8px 12px' }}>Tome</th>
                    <th style={{ padding: '8px 12px' }}>Source</th>
                    <th style={{ padding: '8px 12px' }}>Prix</th>
                    <th style={{ padding: '8px 12px' }}>Date</th>
                  </tr>
                </thead>
                <tbody>
                  {ventes.map((v) => (
                    <tr key={v.id} style={{ borderTop: '1px solid var(--border, #e2e2e2)' }}>
                      <td style={{ padding: '8px 12px' }}>{v.tome}</td>
                      <td style={{ padding: '8px 12px' }}>{v.source || '—'}</td>
                      <td style={{ padding: '8px 12px' }}>{v.prix != null ? `${Number(v.prix).toFixed(2)} €` : '—'}</td>
                      <td style={{ padding: '8px 12px' }}>{formatDate(v.created_at)}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}

          <h3>Messages de contact {messagesContact.length ? `(${messagesContact.length})` : ''}</h3>
          {messagesContact.length === 0 ? (
            <p className="small" style={{ marginBottom: 40 }}>Aucun message reçu via le formulaire pour le moment.</p>
          ) : (
            <div style={{ overflowX: 'auto', marginBottom: 40 }}>
              <table className="admin-table" style={{ width: '100%', borderCollapse: 'collapse' }}>
                <thead>
                  <tr style={{ textAlign: 'left' }}>
                    <th style={{ padding: '8px 12px' }}>Nom</th>
                    <th style={{ padding: '8px 12px' }}>Email</th>
                    <th style={{ padding: '8px 12px' }}>Sujet</th>
                    <th style={{ padding: '8px 12px' }}>Message</th>
                    <th style={{ padding: '8px 12px' }}>Reçu le</th>
                  </tr>
                </thead>
                <tbody>
                  {messagesContact.map((m) => (
                    <tr key={m.id} style={{ borderTop: '1px solid var(--border, #e2e2e2)' }}>
                      <td style={{ padding: '8px 12px' }}>{m.name || '—'}</td>
                      <td style={{ padding: '8px 12px' }}>
                        {m.email ? <a href={`mailto:${m.email}`}>{m.email}</a> : '—'}
                      </td>
                      <td style={{ padding: '8px 12px' }}>{m.sujet || '—'}</td>
                      <td style={{ padding: '8px 12px', maxWidth: 320 }}>{m.message}</td>
                      <td style={{ padding: '8px 12px', whiteSpace: 'nowrap' }}>{formatDate(m.created_at)}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}

          <h3>Historique du chat (Cams) {messagesChat.length ? `(${messagesChat.length})` : ''}</h3>
          {messagesChat.length === 0 ? (
            <p className="small" style={{ marginBottom: 40 }}>Aucun message enregistré pour le moment.</p>
          ) : (
            <div style={{ overflowX: 'auto', marginBottom: 40, maxHeight: 360, overflowY: 'auto' }}>
              <table className="admin-table" style={{ width: '100%', borderCollapse: 'collapse' }}>
                <thead>
                  <tr style={{ textAlign: 'left' }}>
                    <th style={{ padding: '8px 12px' }}>Rôle</th>
                    <th style={{ padding: '8px 12px' }}>Message</th>
                    <th style={{ padding: '8px 12px' }}>Visiteur</th>
                    <th style={{ padding: '8px 12px' }}>Date</th>
                  </tr>
                </thead>
                <tbody>
                  {messagesChat.map((m) => (
                    <tr key={m.id} style={{ borderTop: '1px solid var(--border, #e2e2e2)' }}>
                      <td style={{ padding: '8px 12px' }}>{m.role === 'user' ? '🧑 Visiteur' : '🤖 Cams'}</td>
                      <td style={{ padding: '8px 12px', maxWidth: 400 }}>{m.content}</td>
                      <td style={{ padding: '8px 12px', fontFamily: 'monospace', fontSize: '0.8em' }}>{m.visitor_id ? m.visitor_id.slice(0, 10) : '—'}</td>
                      <td style={{ padding: '8px 12px', whiteSpace: 'nowrap' }}>{formatDate(m.created_at)}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}

          <h3>Erreurs remontées côté visiteur {erreurs.length ? `(${erreurs.length})` : ''}</h3>
          <p className="small">Capturées automatiquement quand une page plante dans le navigateur d'un visiteur (utile pour le bug sur téléphone).</p>
          {erreurs.length === 0 ? (
            <p className="small">Aucune erreur remontée pour le moment.</p>
          ) : (
            <div style={{ overflowX: 'auto' }}>
              <table className="admin-table" style={{ width: '100%', borderCollapse: 'collapse' }}>
                <thead>
                  <tr style={{ textAlign: 'left' }}>
                    <th style={{ padding: '8px 12px' }}>Message</th>
                    <th style={{ padding: '8px 12px' }}>Page</th>
                    <th style={{ padding: '8px 12px' }}>Appareil / navigateur</th>
                    <th style={{ padding: '8px 12px' }}>Date</th>
                  </tr>
                </thead>
                <tbody>
                  {erreurs.map((e) => (
                    <tr key={e.id} style={{ borderTop: '1px solid var(--border, #e2e2e2)' }}>
                      <td style={{ padding: '8px 12px', maxWidth: 280 }}>{e.message}</td>
                      <td style={{ padding: '8px 12px' }}>{e.path || '—'}</td>
                      <td style={{ padding: '8px 12px', maxWidth: 280, fontSize: '0.8em' }}>{e.user_agent || '—'}</td>
                      <td style={{ padding: '8px 12px', whiteSpace: 'nowrap' }}>{formatDate(e.created_at)}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </section>
    </>
  )
}
