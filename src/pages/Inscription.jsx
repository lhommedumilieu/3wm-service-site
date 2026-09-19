import { useState } from 'react'
import { Link } from 'react-router-dom'
import { useAuth } from '../context/AuthContext.jsx'

export default function Inscription() {
  const { signUp, isConfigured } = useAuth()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [confirm, setConfirm] = useState('')
  const [error, setError] = useState('')
  const [done, setDone] = useState(false)
  const [loading, setLoading] = useState(false)

  if (!isConfigured) {
    return (
      <div className="page-header">
        <div className="container">
          <h1>Inscription</h1>
          <p>Les comptes utilisateurs arrivent bientôt sur 3WM Service. Revenez un peu plus tard !</p>
        </div>
      </div>
    )
  }

  async function handleSubmit(e) {
    e.preventDefault()
    setError('')
    if (password !== confirm) {
      setError('Les deux mots de passe ne correspondent pas.')
      return
    }
    if (password.length < 8) {
      setError('Le mot de passe doit contenir au moins 8 caractères.')
      return
    }
    setLoading(true)
    try {
      await signUp(email, password)
      setDone(true)
    } catch (err) {
      setError(err.message || 'Inscription impossible.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <>
      <div className="page-header">
        <div className="container">
          <p className="eyebrow">useradd</p>
          <h1>Créer un compte</h1>
          <p>Rejoignez l'espace membre 3WM Service : contenu réservé et commentaires sur le blog.</p>
        </div>
      </div>
      <section>
        <div className="container">
          {done ? (
            <div className="card" style={{ maxWidth: 480, margin: '0 auto' }}>
              <h3 className="mt-0">Vérifiez votre boîte mail</h3>
              <p>Un email de confirmation vient de vous être envoyé. Cliquez sur le lien qu'il contient pour activer votre compte, puis revenez vous <Link to="/connexion">connecter</Link>.</p>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="card" style={{ maxWidth: 420, margin: '0 auto' }}>
              <label htmlFor="email">Adresse email</label>
              <input id="email" type="email" required value={email} onChange={(e) => setEmail(e.target.value)} autoComplete="email" />

              <label htmlFor="password" style={{ marginTop: 16 }}>Mot de passe (8 caractères minimum)</label>
              <input id="password" type="password" required minLength={8} value={password} onChange={(e) => setPassword(e.target.value)} autoComplete="new-password" />

              <label htmlFor="confirm" style={{ marginTop: 16 }}>Confirmer le mot de passe</label>
              <input id="confirm" type="password" required minLength={8} value={confirm} onChange={(e) => setConfirm(e.target.value)} autoComplete="new-password" />

              {error && <p style={{ color: '#e5484d', marginTop: 12 }}>{error}</p>}

              <button type="submit" className="btn btn-primary" style={{ marginTop: 20 }} disabled={loading}>
                {loading ? 'Création…' : 'Créer mon compte'}
              </button>

              <p className="small" style={{ marginTop: 16 }}>
                Déjà inscrit ? <Link to="/connexion">Se connecter</Link>
              </p>
            </form>
          )}
        </div>
      </section>
    </>
  )
}
