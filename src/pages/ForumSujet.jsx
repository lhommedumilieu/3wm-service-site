import { useCallback, useEffect, useState } from 'react'
import { Link, useParams, useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext.jsx'
import useDocumentMeta from '../hooks/useDocumentMeta.js'
import {
  getSujet,
  listerMessages,
  repondre,
  marquerSolution,
  supprimerMessage,
  supprimerSujet,
} from '../lib/forumApi.js'

const ADMIN_EMAIL = 'service@3-wm.net'

function formatDate(valeur) {
  if (!valeur) return ''
  return new Date(valeur).toLocaleString('fr-FR', {
    day: '2-digit', month: 'short', year: 'numeric', hour: '2-digit', minute: '2-digit',
  })
}

export default function ForumSujet() {
  const { id } = useParams()
  const navigate = useNavigate()
  const { user } = useAuth()

  const [sujet, setSujet] = useState(null)
  const [messages, setMessages] = useState([])
  const [chargement, setChargement] = useState(true)
  const [erreur, setErreur] = useState('')

  const [reponse, setReponse] = useState('')
  const [envoi, setEnvoi] = useState(false)
  const [actionEnCours, setActionEnCours] = useState(null)

  useDocumentMeta(sujet ? sujet.title : 'Sujet du forum', 'Discussion sur le forum 3WM Service.', undefined)

  const estAdmin = user?.email === ADMIN_EMAIL
  const estAuteurSujet = !!user && !!sujet && user.id === sujet.author_id
  const peutModerer = estAuteurSujet || estAdmin

  const rafraichir = useCallback(async () => {
    setChargement(true)
    setErreur('')
    try {
      const [s, m] = await Promise.all([getSujet(id), listerMessages(id)])
      if (!s) {
        setErreur('introuvable')
      } else {
        setSujet(s)
        setMessages(m)
      }
    } catch (e) {
      setErreur(e.message)
    } finally {
      setChargement(false)
    }
  }, [id])

  useEffect(() => {
    rafraichir()
  }, [rafraichir])

  async function handleReponse(e) {
    e.preventDefault()
    setEnvoi(true)
    try {
      await repondre(id, reponse.trim())
      setReponse('')
      await rafraichir()
    } catch (err) {
      setErreur(err.message)
    } finally {
      setEnvoi(false)
    }
  }

  async function handleSolution(postId) {
    setActionEnCours(postId)
    try {
      const nouvelle = sujet.solution_post_id === postId ? null : postId
      await marquerSolution(id, nouvelle)
      await rafraichir()
    } catch (err) {
      setErreur(err.message)
    } finally {
      setActionEnCours(null)
    }
  }

  async function handleSupprimerMessage(postId) {
    if (!window.confirm('Supprimer ce message ?')) return
    setActionEnCours(postId)
    try {
      await supprimerMessage(postId)
      await rafraichir()
    } catch (err) {
      setErreur(err.message)
    } finally {
      setActionEnCours(null)
    }
  }

  async function handleSupprimerSujet() {
    if (!window.confirm('Supprimer définitivement ce sujet et toutes ses réponses ?')) return
    try {
      await supprimerSujet(id)
      navigate('/forum')
    } catch (err) {
      setErreur(err.message)
    }
  }

  if (chargement) {
    return (
      <div className="page-header">
        <div className="container"><p>Chargement…</p></div>
      </div>
    )
  }

  if (erreur === 'introuvable' || !sujet) {
    return (
      <div className="page-header">
        <div className="container">
          <h1>Sujet introuvable</h1>
          <p>Ce sujet n'existe pas ou a été supprimé.</p>
          <Link to="/forum" className="btn btn-primary">Retour au forum</Link>
        </div>
      </div>
    )
  }

  return (
    <>
      <div className="page-header">
        <div className="container">
          <p className="small" style={{ margin: 0 }}>
            <Link to="/forum">← Forum</Link> · {sujet.category}
          </p>
          <h1 style={{ marginBottom: 6 }}>{sujet.solution_post_id ? '✅ ' : ''}{sujet.title}</h1>
          <p className="small" style={{ opacity: 0.8 }}>Ouvert par {sujet.author_name} le {formatDate(sujet.created_at)}</p>
          {(estAuteurSujet || estAdmin) && (
            <button type="button" className="btn btn-outline" onClick={handleSupprimerSujet}>
              Supprimer le sujet
            </button>
          )}
        </div>
      </div>

      <section>
        <div className="container">
          {erreur && erreur !== 'introuvable' && <p className="small" style={{ color: '#e5484d' }}>{erreur}</p>}

          <div style={{ display: 'grid', gap: 12 }}>
            {messages.map((m, index) => {
              const estSolution = sujet.solution_post_id === m.id
              const estOuverture = index === 0
              const peutSupprimerCeMessage = !!user && (user.id === m.author_id || estAdmin)
              return (
                <div
                  key={m.id}
                  className="card"
                  style={estSolution ? { borderColor: '#2e7d32', borderWidth: 2, borderStyle: 'solid' } : undefined}
                >
                  <div style={{ display: 'flex', justifyContent: 'space-between', gap: 12, flexWrap: 'wrap', marginBottom: 8 }}>
                    <strong>{m.author_name}{estOuverture ? ' (auteur)' : ''}</strong>
                    <span className="small" style={{ opacity: 0.7 }}>{formatDate(m.created_at)}</span>
                  </div>
                  {estSolution && (
                    <p className="small" style={{ color: '#2e7d32', margin: '0 0 8px', fontWeight: 600 }}>✅ Solution retenue</p>
                  )}
                  <p style={{ whiteSpace: 'pre-wrap', margin: 0 }}>{m.content}</p>

                  {(peutModerer && !estOuverture) || peutSupprimerCeMessage ? (
                    <div style={{ display: 'flex', gap: 8, marginTop: 12, flexWrap: 'wrap' }}>
                      {peutModerer && !estOuverture && (
                        <button
                          type="button"
                          className="btn btn-outline"
                          disabled={actionEnCours === m.id}
                          onClick={() => handleSolution(m.id)}
                        >
                          {estSolution ? 'Retirer la solution' : '✅ Marquer comme solution'}
                        </button>
                      )}
                      {peutSupprimerCeMessage && !estOuverture && (
                        <button
                          type="button"
                          className="btn btn-outline"
                          disabled={actionEnCours === m.id}
                          onClick={() => handleSupprimerMessage(m.id)}
                        >
                          Supprimer
                        </button>
                      )}
                    </div>
                  ) : null}
                </div>
              )
            })}
          </div>

          <div style={{ marginTop: 28 }}>
            {user ? (
              <form onSubmit={handleReponse} style={{ display: 'grid', gap: 10 }}>
                <h3 className="mt-0">Répondre</h3>
                <textarea
                  placeholder="Votre réponse…"
                  required
                  rows={4}
                  maxLength={5000}
                  value={reponse}
                  onChange={(e) => setReponse(e.target.value)}
                />
                <button type="submit" className="btn btn-primary" disabled={envoi} style={{ justifySelf: 'start' }}>
                  {envoi ? 'Envoi…' : 'Envoyer la réponse'}
                </button>
              </form>
            ) : (
              <p className="small">
                <Link to="/connexion" className="btn btn-outline">Se connecter</Link> pour répondre à ce sujet.
              </p>
            )}
          </div>
        </div>
      </section>
    </>
  )
}
