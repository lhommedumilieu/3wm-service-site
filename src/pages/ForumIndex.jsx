import { useCallback, useEffect, useMemo, useState } from 'react'
import { Link } from 'react-router-dom'
import { useAuth } from '../context/AuthContext.jsx'
import useDocumentMeta from '../hooks/useDocumentMeta.js'
import { listerSujets, creerSujet, CATEGORIES } from '../lib/forumApi.js'

function formatDate(valeur) {
  if (!valeur) return ''
  return new Date(valeur).toLocaleDateString('fr-FR', { day: '2-digit', month: 'short', year: 'numeric' })
}

export default function ForumIndex() {
  const { user } = useAuth()

  useDocumentMeta(
    'Forum communautaire',
    "Posez vos questions et partagez vos solutions avec la communauté 3WM Service : dépannage Windows, Linux, cybersécurité et discussions.",
    '/forum'
  )

  const [sujets, setSujets] = useState([])
  const [filtre, setFiltre] = useState('')
  const [chargement, setChargement] = useState(true)
  const [erreur, setErreur] = useState('')

  const [formOuvert, setFormOuvert] = useState(false)
  const [titre, setTitre] = useState('')
  const [categorie, setCategorie] = useState(CATEGORIES[0])
  const [message, setMessage] = useState('')
  const [envoi, setEnvoi] = useState(false)
  const [messageForm, setMessageForm] = useState('')

  const rafraichir = useCallback(async () => {
    setChargement(true)
    setErreur('')
    try {
      setSujets(await listerSujets(filtre || undefined))
    } catch (e) {
      setErreur(e.message)
    } finally {
      setChargement(false)
    }
  }, [filtre])

  useEffect(() => {
    rafraichir()
  }, [rafraichir])

  async function handleCreation(e) {
    e.preventDefault()
    setEnvoi(true)
    setMessageForm('')
    try {
      const sujet = await creerSujet(titre.trim(), categorie, message.trim())
      setTitre('')
      setMessage('')
      setFormOuvert(false)
      window.location.href = `/forum/${sujet.id}`
    } catch (err) {
      setMessageForm(err.message)
    } finally {
      setEnvoi(false)
    }
  }

  const categoriesAffichees = useMemo(() => ['', ...CATEGORIES], [])

  return (
    <>
      <div className="page-header">
        <div className="container">
          <p className="eyebrow eyebrow-ps">Communauté</p>
          <h1>Forum 3WM Service</h1>
          <p>Un problème ? Une astuce à partager ? Ouvrez un sujet, la communauté vous répond.</p>
        </div>
      </div>

      <section>
        <div className="container">
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8, alignItems: 'center', justifyContent: 'space-between', marginBottom: 20 }}>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8 }}>
              {categoriesAffichees.map((c) => (
                <button
                  key={c || 'toutes'}
                  type="button"
                  className={`btn ${filtre === c ? 'btn-primary' : 'btn-outline'}`}
                  onClick={() => setFiltre(c)}
                >
                  {c || 'Toutes'}
                </button>
              ))}
            </div>
            {user ? (
              <button type="button" className="btn btn-primary" onClick={() => setFormOuvert((v) => !v)}>
                {formOuvert ? 'Annuler' : '+ Nouveau sujet'}
              </button>
            ) : (
              <Link to="/connexion" className="btn btn-outline">Se connecter pour écrire</Link>
            )}
          </div>

          {formOuvert && user && (
            <div className="card" style={{ marginBottom: 24 }}>
              <h3 className="mt-0">Nouveau sujet</h3>
              <form onSubmit={handleCreation} style={{ display: 'grid', gap: 10 }}>
                <input
                  type="text"
                  placeholder="Titre du sujet (ex. : mon PC rame au démarrage)"
                  required
                  minLength={3}
                  maxLength={150}
                  value={titre}
                  onChange={(e) => setTitre(e.target.value)}
                />
                <select value={categorie} onChange={(e) => setCategorie(e.target.value)}>
                  {CATEGORIES.map((c) => (
                    <option key={c} value={c}>{c}</option>
                  ))}
                </select>
                <textarea
                  placeholder="Décrivez votre problème ou votre message…"
                  required
                  rows={5}
                  maxLength={5000}
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                />
                <button type="submit" className="btn btn-primary" disabled={envoi}>
                  {envoi ? 'Publication…' : 'Publier le sujet'}
                </button>
                {messageForm && <p className="small" style={{ color: '#e5484d' }}>{messageForm}</p>}
              </form>
            </div>
          )}

          {erreur && <p className="small" style={{ color: '#e5484d' }}>{erreur}</p>}

          {chargement ? (
            <p>Chargement…</p>
          ) : sujets.length === 0 ? (
            <p className="small">Aucun sujet pour le moment{filtre ? ' dans cette catégorie' : ''}. Soyez le premier à en ouvrir un !</p>
          ) : (
            <div style={{ display: 'grid', gap: 10 }}>
              {sujets.map((s) => (
                <Link
                  key={s.id}
                  to={`/forum/${s.id}`}
                  className="card"
                  style={{ display: 'block', textDecoration: 'none' }}
                >
                  <div style={{ display: 'flex', justifyContent: 'space-between', gap: 12, flexWrap: 'wrap' }}>
                    <div>
                      <h3 className="mt-0" style={{ marginBottom: 4 }}>
                        {s.solution_post_id ? '✅ ' : ''}{s.title}
                      </h3>
                      <p className="small" style={{ margin: 0, opacity: 0.8 }}>
                        <span style={{ display: 'inline-block', padding: '1px 8px', borderRadius: 999, border: '1px solid currentColor', fontSize: '0.8em', opacity: 0.9 }}>{s.category}</span>
                        {' '}· par {s.author_name} · {formatDate(s.created_at)}
                      </p>
                    </div>
                    <div className="small" style={{ opacity: 0.8, whiteSpace: 'nowrap' }}>
                      💬 {s.nbMessages} message{s.nbMessages > 1 ? 's' : ''}
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          )}
        </div>
      </section>
    </>
  )
}
