import { useCallback, useEffect, useState } from 'react'
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
} from '../lib/adminApi.js'

const ADMIN_EMAIL = 'service@3-wm.net'
// Un compte est considéré "en ligne" si son dernier signal date de moins
// de 45s (le site envoie un signal toutes les 20s tant que l'onglet est ouvert).
const FENETRE_EN_LIGNE_MS = 45_000

function estBanni(utilisateur) {
  if (!utilisateur.banned_until) return false
  return new Date(utilisateur.banned_until).getTime() > Date.now()
}

export default function Admin() {
  const { user, loading: chargementSession } = useAuth()

  useDocumentMeta('Administration', 'Gestion des comptes membres du site.', undefined)

  const [comptes, setComptes] = useState(null)
  const [presence, setPresence] = useState([])
  const [erreur, setErreur] = useState('')
  const [chargement, setChargement] = useState(true)
  const [actionEnCours, setActionEnCours] = useState(null)

  const [nouvelEmail, setNouvelEmail] = useState('')
  const [nouveauMdp, setNouveauMdp] = useState('')
  const [creationEnCours, setCreationEnCours] = useState(false)
  const [messageCreation, setMessageCreation] = useState('')

  const estAdmin = user?.email === ADMIN_EMAIL

  const rafraichir = useCallback(async () => {
    if (!estAdmin) return
    setChargement(true)
    setErreur('')
    try {
      const [reponseComptes, lignesPresence] = await Promise.all([listerComptes(), listerPresence()])
      setComptes(reponseComptes.users || [])
      setPresence(lignesPresence || [])
    } catch (e) {
      setErreur(e.message)
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
          <p className="eyebrow">sudo</p>
          <h1>Administration — comptes membres</h1>
          <p>Comptes inscrits, présence en direct, création et bannissement.</p>
        </div>
      </div>

      <section>
        <div className="container">
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

          <h3>Comptes inscrits {comptes ? `(${comptes.length})` : ''}</h3>
          {erreur && <p className="small" style={{ color: '#e5484d' }}>{erreur}</p>}
          {chargement ? (
            <p>Chargement…</p>
          ) : (
            <div style={{ overflowX: 'auto' }}>
              <table className="admin-table" style={{ width: '100%', borderCollapse: 'collapse' }}>
                <thead>
                  <tr style={{ textAlign: 'left' }}>
                    <th style={{ padding: '8px 12px' }}>Email</th>
                    <th style={{ padding: '8px 12px' }}>Créé le</th>
                    <th style={{ padding: '8px 12px' }}>Statut</th>
                    <th style={{ padding: '8px 12px' }}>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {(comptes || []).map((c) => (
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
                </tbody>
              </table>
            </div>
          )}
        </div>
      </section>
    </>
  )
}
