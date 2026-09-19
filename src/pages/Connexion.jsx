import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext.jsx'

export default function Connexion() {
  const { signIn, isConfigured } = useAuth()
  const navigate = useNavigate()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  if (!isConfigured) {
    return (
      <div className="page-header">
        <div className="container">
          <h1>Connexion</h1>
          <p>Les comptes utilisateurs arrivent bientôt sur 3WM Service. Revenez un peu plus tard !</p>
        </div>
      </div>
    )
  }

  async function handleSubmit(e) {
    e.preventDefault()
    setError('')
    setLoading(true)
    try {
      await signIn(email, password)
      navigate('/espace-membre')
    } catch (err) {
      setError(err.message || 'Connexion impossible.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <>
      <div className="page-header">
        <div className="container">
          <p className="eyebrow">whoami</p>
          <h1>Connexion</h1>
          <p>Accédez à votre espace membre 3WM Service.</p>
        </div>
      </div>
      <section>
        <div className="container">
          <form onSubmit={handleSubmit} className="card" style={{ maxWidth: 420, margin: '0 auto' }}>
            <label htmlFor="email">Adresse email</label>
            <input id="email" type="email" required value={email} onChange={(e) => setEmail(e.target.value)} autoComplete="email" />

            <label htmlFor="password" style={{ marginTop: 16 }}>Mot de passe</label>
            <input id="password" type="password" required value={password} onChange={(e) => setPassword(e.target.value)} autoComplete="current-password" />

            {error && <p style={{ color: '#e5484d', marginTop: 12 }}>{error}</p>}

            <button type="submit" className="btn btn-primary" style={{ marginTop: 20 }} disabled={loading}>
              {loading ? 'Connexion…' : 'Se connecter'}
            </button>

            <p className="small" style={{ marginTop: 16 }}>
              Pas encore de compte ? <Link to="/inscription">Créer un compte</Link>
            </p>
          </form>
        </div>
      </section>
    </>
  )
}
