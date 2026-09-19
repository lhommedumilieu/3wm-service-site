import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext.jsx'
import PasswordField from '../components/PasswordField.jsx'
import useDocumentMeta from '../hooks/useDocumentMeta.js'

export default function Connexion() {
  const { signIn, isConfigured } = useAuth()
  const navigate = useNavigate()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  useDocumentMeta('Connexion', 'Connectez-vous à votre espace membre 3WM Service.', '/connexion')

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
          <form onSubmit={handleSubmit} className="contact-form card" style={{ maxWidth: 420, margin: '0 auto' }}>
            <label htmlFor="email">Adresse email</label>
            <input id="email" type="email" required value={email} onChange={(e) => setEmail(e.target.value)} autoComplete="email" />

            <PasswordField
              id="password"
              label="Mot de passe"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              autoComplete="current-password"
              style={{ marginTop: 16 }}
            />

            <p className="small" style={{ marginTop: 10, marginBottom: 0, textAlign: 'right' }}>
              <Link to="/mot-de-passe-oublie">Mot de passe oublié ?</Link>
            </p>

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
