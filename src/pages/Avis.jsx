import { useCallback, useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { useAuth } from '../context/AuthContext.jsx'
import useDocumentMeta from '../hooks/useDocumentMeta.js'
import { listerAvisPublies, monAvis as chargerMonAvis, publierAvis, resumeAvis, supprimerAvis, urlPhoto } from '../lib/avisApi.js'
import '../avis.css'

const PAR_PAGE = 10
const LIBELLES = ['', 'Très décevant', 'Décevant', 'Correct', 'Très bien', 'Excellent']

export function Etoiles({ note, taille }) {
  const arrondi = Math.round(note)
  return (
    <span className="avis-etoiles" style={taille ? { fontSize: taille } : undefined} aria-label={`${String(note).replace('.', ',')} sur 5`}>
      {[1, 2, 3, 4, 5].map((i) => (
        <span key={i} className={i <= arrondi ? '' : 'vide'} aria-hidden="true">★</span>
      ))}
    </span>
  )
}

const dateFr = (d) => new Date(d).toLocaleDateString('fr-FR', { day: 'numeric', month: 'long', year: 'numeric' })

function CarteAvis({ avis, estMoi, onSupprimer, onPhoto }) {
  return (
    <article className="card avis-carte">
      <div className="avis-entete">
        <div className="avis-avatar" aria-hidden="true">{(avis.author_name || '?')[0].toUpperCase()}</div>
        <div>
          <div className="avis-auteur">
            {avis.author_name}
            {avis.statut === 'en_attente' && <span className="avis-badge">En attente de validation</span>}
            {avis.statut === 'refuse' && <span className="avis-badge">Non publié</span>}
          </div>
          <div className="small">{dateFr(avis.created_at)}</div>
        </div>
      </div>
      <Etoiles note={avis.note} />
      {avis.titre && <h3 className="avis-titre">{avis.titre}</h3>}
      <p className="avis-texte">{avis.contenu}</p>
      {avis.photos?.length > 0 && (
        <div className="avis-photos">
          {avis.photos.map((p) => (
            <button key={p} type="button" onClick={() => onPhoto(urlPhoto(p))} aria-label="Agrandir la photo">
              <img src={urlPhoto(p)} alt={`Photo jointe par ${avis.author_name}`} loading="lazy" />
            </button>
          ))}
        </div>
      )}
      {avis.reponse && (
        <div className="avis-reponse">
          <strong>Réponse de 3WM Service</strong>
          {avis.reponse}
        </div>
      )}
      {estMoi && (
        <button type="button" className="btn btn-outline btn-sm" style={{ marginTop: 14 }} onClick={() => onSupprimer(avis)}>
          Supprimer mon avis
        </button>
      )}
    </article>
  )
}

function Formulaire({ user, onPublie, onAnnuler }) {
  const [note, setNote] = useState(0)
  const [survol, setSurvol] = useState(0)
  const [titre, setTitre] = useState('')
  const [contenu, setContenu] = useState('')
  const [fichiers, setFichiers] = useState([])
  const [erreur, setErreur] = useState('')
  const [envoi, setEnvoi] = useState(false)
  const v = survol || note

  function ajouter(e) {
    const liste = [...e.target.files]
    e.target.value = ''
    setErreur('')
    setFichiers((actuels) => {
      const suite = [...actuels]
      for (const f of liste) {
        if (suite.length >= 3) { setErreur('3 photos maximum.'); break }
        if (!/^image\/(jpeg|png|webp)$/.test(f.type)) { setErreur(`« ${f.name} » n'est pas une image JPG, PNG ou WebP.`); continue }
        if (f.size > 15 * 1024 * 1024) { setErreur(`« ${f.name} » est trop lourde (15 Mo max).`); continue }
        suite.push(Object.assign(f, { apercu: URL.createObjectURL(f) }))
      }
      return suite
    })
  }

  async function envoyer(e) {
    e.preventDefault()
    setErreur('')
    if (!note) return setErreur('Choisissez une note de 1 à 5 étoiles.')
    if (contenu.trim().length < 10) return setErreur('Votre avis doit faire au moins 10 caractères.')
    if (titre.trim() && titre.trim().length < 3) return setErreur('Le titre doit faire au moins 3 caractères.')
    setEnvoi(true)
    try {
      const avis = await publierAvis(user.id, { note, titre: titre.trim(), contenu: contenu.trim(), fichiers })
      onPublie(avis)
    } catch (err) {
      setErreur(err.code === '23505' ? 'Vous avez déjà donné un avis.' : "L'envoi a échoué. Vérifiez votre connexion et réessayez.")
      setEnvoi(false)
    }
  }

  return (
    <form className="card avis-form" onSubmit={envoyer}>
      <h2 className="mt-0">Votre avis</h2>

      <label id="lbl-note">Votre note *</label>
      <div className="avis-choix" role="radiogroup" aria-labelledby="lbl-note" onMouseLeave={() => setSurvol(0)}>
        {[1, 2, 3, 4, 5].map((i) => (
          <button
            key={i}
            type="button"
            role="radio"
            aria-checked={note === i}
            aria-label={`${i} étoile${i > 1 ? 's' : ''}`}
            className={i <= v ? 'actif' : ''}
            onClick={() => setNote(i)}
            onMouseEnter={() => setSurvol(i)}
          >★</button>
        ))}
      </div>
      <p className="small avis-libelle">{v ? `${v}/5 · ${LIBELLES[v]}` : 'Cliquez sur les étoiles'}</p>

      <label htmlFor="avis-titre">Titre <span className="small">(facultatif)</span></label>
      <input id="avis-titre" type="text" maxLength={100} value={titre} onChange={(e) => setTitre(e.target.value)} placeholder="Ex. : PC réparé en une heure" />

      <label htmlFor="avis-texte">Votre expérience *</label>
      <textarea id="avis-texte" maxLength={2000} value={contenu} onChange={(e) => setContenu(e.target.value)} placeholder="Quel était le problème ? Comment s'est passée l'intervention ?" />
      <p className="small">{contenu.length} / 2000 caractères (10 minimum)</p>

      <label>Photos <span className="small">(facultatif, 3 maximum)</span></label>
      <div className="avis-vignettes">
        {fichiers.map((f, i) => (
          <div key={f.apercu} className="avis-vignette">
            <img src={f.apercu} alt="" />
            <button type="button" aria-label="Retirer la photo" onClick={() => setFichiers((l) => l.filter((_, j) => j !== i))}>×</button>
          </div>
        ))}
        {fichiers.length < 3 && (
          <label className="avis-ajout">
            + Ajouter une photo
            <input type="file" accept="image/jpeg,image/png,image/webp" multiple hidden onChange={ajouter} />
          </label>
        )}
      </div>
      <p className="small">JPG, PNG ou WebP. Évitez les photos où l'on voit des informations personnelles (mots de passe, adresse…).</p>

      {erreur && <p className="form-error" role="alert">{erreur}</p>}

      <div className="avis-actions">
        <button type="submit" className="btn btn-primary" disabled={envoi}>{envoi ? 'Envoi en cours…' : 'Publier mon avis'}</button>
        <button type="button" className="btn btn-outline" onClick={onAnnuler}>Annuler</button>
      </div>
    </form>
  )
}

export default function Avis() {
  const { user, loading } = useAuth()
  useDocumentMeta(
    'Avis clients',
    'Les avis des clients de 3WM Service sur le dépannage Windows à distance et les ebooks : notes de 1 à 5 étoiles, avec photos.',
    '/avis'
  )

  const [resume, setResume] = useState(null)
  const [liste, setListe] = useState([])
  const [page, setPage] = useState(0)
  const [encore, setEncore] = useState(false)
  const [mien, setMien] = useState(null)
  const [formOuvert, setFormOuvert] = useState(false)
  const [photo, setPhoto] = useState(null)
  const [erreur, setErreur] = useState('')

  const charger = useCallback(async () => {
    try {
      const [r, l] = await Promise.all([resumeAvis(), listerAvisPublies(0, PAR_PAGE)])
      setResume(r)
      setListe(l)
      setPage(1)
      setEncore(l.length === PAR_PAGE)
    } catch {
      setErreur('Impossible de charger les avis pour le moment.')
    }
  }, [])

  useEffect(() => { charger() }, [charger])
  useEffect(() => {
    if (!user) { setMien(null); return }
    chargerMonAvis(user.id).then(setMien).catch(() => {})
  }, [user])
  useEffect(() => {
    if (!photo) return
    const f = (e) => e.key === 'Escape' && setPhoto(null)
    window.addEventListener('keydown', f)
    return () => window.removeEventListener('keydown', f)
  }, [photo])

  async function suite() {
    const l = await listerAvisPublies(page, PAR_PAGE)
    setListe((x) => [...x, ...l])
    setPage((p) => p + 1)
    setEncore(l.length === PAR_PAGE)
  }

  async function supprimer(a) {
    if (!window.confirm('Supprimer définitivement votre avis ?')) return
    try {
      await supprimerAvis(a)
      setMien(null)
      charger()
    } catch {
      window.alert('Suppression impossible.')
    }
  }

  const n = resume?.nombre || 0
  const affiches = mien && mien.statut !== 'publie' ? [mien, ...liste] : liste

  let zoneForm = null
  if (formOuvert) {
    if (loading) zoneForm = null
    else if (!user) {
      zoneForm = (
        <div className="card avis-form">
          <p>Pour donner votre avis, connectez-vous à votre espace membre (c'est gratuit). Cela garantit que chaque avis vient d'une vraie personne.</p>
          <div className="avis-actions">
            <Link to="/connexion" className="btn btn-primary">Se connecter</Link>
            <Link to="/inscription" className="btn btn-outline">Créer un compte</Link>
          </div>
        </div>
      )
    } else if (mien) {
      zoneForm = (
        <div className="card avis-form">
          <p className="mt-0">
            {mien.statut === 'en_attente'
              ? 'Merci ! Votre avis a bien été reçu. Il sera visible dès qu’il aura été validé.'
              : 'Vous avez déjà donné votre avis. Pour le modifier, supprimez-le puis rédigez-en un nouveau.'}
          </p>
        </div>
      )
    } else {
      zoneForm = <Formulaire user={user} onPublie={(a) => setMien(a)} onAnnuler={() => setFormOuvert(false)} />
    }
  }

  return (
    <>
      <section className="page-hero page-hero-simple">
        <div className="container">
          <p className="eyebrow">Avis clients</p>
          <h1>Ce qu'en pensent <span className="hl">les clients</span></h1>
          <p className="lead">Chaque avis vient d'un membre inscrit et est vérifié avant d'être publié.</p>
        </div>
      </section>

      <section>
        <div className="container avis-page">
          <div className="card avis-resume" aria-label="Note moyenne">
            <div className="avis-moyenne">
              <div className="avis-chiffre">{n ? String(resume.moyenne).replace('.', ',') : '–'}</div>
              <Etoiles note={n ? resume.moyenne : 0} taille="1.3rem" />
              <div className="small">{resume === null ? 'Chargement…' : n ? `${n} avis` : 'Aucun avis pour le moment'}</div>
            </div>
            <div className="avis-barres">
              {[5, 4, 3, 2, 1].map((i) => {
                const c = resume?.repartition?.[i] || 0
                return (
                  <div key={i} className="avis-barre">
                    <span>{i} ★</span>
                    <div className="avis-fond"><div className="avis-plein" style={{ width: n ? `${(c / n) * 100}%` : 0 }} /></div>
                    <span>{c}</span>
                  </div>
                )
              })}
            </div>
          </div>

          <div className="avis-liste-tete">
            <h2>Tous les avis</h2>
            {!formOuvert && (
              <button type="button" className="btn btn-primary" onClick={() => setFormOuvert(true)}>★ Donner mon avis</button>
            )}
          </div>

          {zoneForm}
          {erreur && <p className="form-error" role="alert">{erreur}</p>}

          <div className="avis-liste" aria-live="polite">
            {affiches.map((a) => (
              <CarteAvis key={a.id} avis={a} estMoi={user && a.user_id === user.id} onSupprimer={supprimer} onPhoto={setPhoto} />
            ))}
            {resume !== null && affiches.length === 0 && (
              <div className="card avis-vide">
                <div className="avis-vide-ico" aria-hidden="true">☆</div>
                <p>Aucun avis publié pour l'instant. Vous avez fait appel à 3WM Service ? Soyez le premier à donner votre avis !</p>
              </div>
            )}
          </div>

          {encore && (
            <div style={{ textAlign: 'center', marginTop: 20 }}>
              <button type="button" className="btn btn-outline" onClick={suite}>Voir plus d'avis</button>
            </div>
          )}
        </div>
      </section>

      {photo && (
        <div className="avis-visionneuse" role="dialog" aria-label="Photo agrandie" onClick={() => setPhoto(null)}>
          <img src={photo} alt="" />
        </div>
      )}
    </>
  )
}
