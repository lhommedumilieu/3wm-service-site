import { useEffect, useMemo, useState } from 'react'
import {
  listerComptes,
  creerCompte,
  bannirCompte,
  reactiverCompte,
  supprimerCompte,
  listerPresence,
} from '../../lib/adminApi.js'
import { Erreur, Panneau, Pastille, StatCard, Vide, confirmer, formatDateCourte } from './ui.jsx'

const ADMIN_EMAIL = 'service@3-wm.net'
const FENETRE_EN_LIGNE_MS = 45_000

function estBanni(u) {
  return !!u.banned_until && new Date(u.banned_until).getTime() > Date.now()
}

export default function Comptes() {
  const [comptes, setComptes] = useState(null)
  const [presence, setPresence] = useState([])
  const [erreur, setErreur] = useState('')
  const [actionEnCours, setActionEnCours] = useState(null)
  const [nouvelEmail, setNouvelEmail] = useState('')
  const [nouveauMdp, setNouveauMdp] = useState('')
  const [creation, setCreation] = useState(false)
  const [messageCreation, setMessageCreation] = useState('')
  const [recherche, setRecherche] = useState('')
  const [tri, setTri] = useState({ champ: 'created_at', direction: 'desc' })

  async function charger() {
    try {
      const rep = await listerComptes()
      setComptes(rep.users || [])
      setErreur('')
    } catch (e) {
      setErreur(e.message || 'Impossible de charger les comptes.')
      setComptes((c) => c ?? [])
    }
  }

  useEffect(() => {
    charger()
    listerPresence().then(setPresence).catch(() => {})
  }, [])

  async function handleCreation(e) {
    e.preventDefault()
    setCreation(true)
    setMessageCreation('')
    try {
      await creerCompte(nouvelEmail.trim(), nouveauMdp)
      setMessageCreation(`Compte créé pour ${nouvelEmail.trim()}.`)
      setNouvelEmail('')
      setNouveauMdp('')
      charger()
    } catch (err) {
      setMessageCreation(`Erreur : ${err.message}`)
    } finally {
      setCreation(false)
    }
  }

  async function agir(utilisateur, fn, message) {
    if (!confirmer(message)) return
    setActionEnCours(utilisateur.id)
    try {
      await fn(utilisateur.id)
      await charger()
    } catch (e) {
      setErreur(e.message)
    } finally {
      setActionEnCours(null)
    }
  }

  const trier = (champ) =>
    setTri((t) => ({ champ, direction: t.champ === champ && t.direction === 'asc' ? 'desc' : 'asc' }))

  const affiches = useMemo(() => {
    const source = comptes || []
    const q = recherche.trim().toLowerCase()
    const filtres = q ? source.filter((c) => c.email?.toLowerCase().includes(q)) : source
    return [...filtres].sort((a, b) => {
      let va
      let vb
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
  }, [comptes, recherche, tri])

  const fleche = (champ) => (tri.champ === champ ? (tri.direction === 'asc' ? ' ▲' : ' ▼') : '')
  const total = comptes?.length ?? '—'
  const bannis = (comptes || []).filter(estBanni).length
  const recents = (comptes || []).filter((c) => Date.now() - new Date(c.created_at).getTime() < 7 * 86400000).length
  const enLigne = presence.filter((p) => Date.now() - new Date(p.last_seen).getTime() < FENETRE_EN_LIGNE_MS && !(p.path || '').startsWith('/admin')).length

  return (
    <div className="admin-onglet">
      <div className="admin-stats">
        <StatCard label="Comptes membres" valeur={total} />
        <StatCard label="Nouveaux (7 jours)" valeur={comptes ? recents : '—'} ton="vert" />
        <StatCard label="Comptes bannis" valeur={comptes ? bannis : '—'} ton={bannis ? 'orange' : undefined} />
        <StatCard label="Visiteurs en ligne" valeur={enLigne} />
      </div>

      <Erreur>{erreur}</Erreur>

      <div className="admin-deux-colonnes egal">
        <Panneau titre="Ajouter un compte">
          <form onSubmit={handleCreation} className="admin-form">
            <input type="email" placeholder="E-mail du nouveau membre" required value={nouvelEmail} onChange={(e) => setNouvelEmail(e.target.value)} />
            <input type="password" placeholder="Mot de passe (6 caractères min.)" required minLength={6} value={nouveauMdp} onChange={(e) => setNouveauMdp(e.target.value)} autoComplete="new-password" />
            <button type="submit" className="btn btn-primary btn-sm" disabled={creation}>{creation ? 'Création…' : 'Créer le compte'}</button>
            {messageCreation && <p className="small">{messageCreation}</p>}
          </form>
        </Panneau>
        <Panneau titre="Bon à savoir">
          <ul className="admin-aide">
            <li><strong>Bannir</strong> empêche la connexion sans supprimer les données du membre : c'est réversible.</li>
            <li><strong>Supprimer</strong> efface le compte pour de bon.</li>
            <li>Votre propre compte (administrateur) est protégé : il ne peut être ni banni ni supprimé d'ici.</li>
          </ul>
        </Panneau>
      </div>

      <Panneau
        titre={`Comptes inscrits${comptes ? ` (${affiches.length}/${comptes.length})` : ''}`}
        actions={<input type="search" placeholder="Rechercher un e-mail…" value={recherche} onChange={(e) => setRecherche(e.target.value)} />}
      >
        {comptes === null ? (
          <Vide>Chargement…</Vide>
        ) : (
          <div className="admin-table-wrap">
            <table className="admin-table">
              <thead>
                <tr>
                  <th className="tri" onClick={() => trier('email')}>E-mail{fleche('email')}</th>
                  <th className="tri" onClick={() => trier('created_at')}>Créé le{fleche('created_at')}</th>
                  <th className="tri" onClick={() => trier('statut')}>Statut{fleche('statut')}</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {affiches.map((c) => (
                  <tr key={c.id}>
                    <td>{c.email}</td>
                    <td>{formatDateCourte(c.created_at)}</td>
                    <td>{estBanni(c) ? <Pastille ton="rouge">Banni</Pastille> : <Pastille ton="vert">Actif</Pastille>}</td>
                    <td className="admin-actions-cellule">
                      <button
                        type="button"
                        className="btn btn-outline btn-sm"
                        disabled={actionEnCours === c.id || c.email === ADMIN_EMAIL}
                        onClick={() =>
                          estBanni(c)
                            ? agir(c, reactiverCompte, `Réactiver ${c.email} ?`)
                            : agir(c, bannirCompte, `Bannir ${c.email} ? Ce compte ne pourra plus se connecter.`)
                        }
                      >
                        {estBanni(c) ? 'Réactiver' : 'Bannir'}
                      </button>
                      <button
                        type="button"
                        className="btn btn-outline btn-sm danger"
                        disabled={actionEnCours === c.id || c.email === ADMIN_EMAIL}
                        onClick={() => agir(c, supprimerCompte, `Supprimer définitivement le compte de ${c.email} ? Cette action est irréversible.`)}
                      >
                        Supprimer
                      </button>
                    </td>
                  </tr>
                ))}
                {affiches.length === 0 && (
                  <tr><td colSpan={4} className="small">Aucun compte ne correspond à la recherche.</td></tr>
                )}
              </tbody>
            </table>
          </div>
        )}
      </Panneau>
    </div>
  )
}
