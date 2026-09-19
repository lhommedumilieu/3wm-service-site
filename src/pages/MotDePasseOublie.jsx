import { useState } from 'react'
import { Link } from 'react-router-dom'
import { useAuth } from '../context/AuthContext.jsx'

export default function MotDePasseOublie() {
  const { requestPasswordReset, isConfigured } = useAuth()
  const [email, setEmail] = useState('')
  const [error, setError] = useState('')
  const [done, setDone] = useState(false)
  const [loading, setLoading] = useState(false)

  if (!isConfigured) {
    return (
      <div className="page-header">
        <div className="container">
          <h1>Mot de passe oublié</h1>
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
      const redirectTo = `${window.location.origin}/reinitialiser-mot-de-passe`
      await requestPasswordReset(email, redirectTo)
      setDone(true)
    } catch (err) {
      setError(err.message || "Impossible d'envoyer l'email de réinitialisation.")
    } finally {
      setLoading(false)
    }
  }

  return (
    <>
      <div className="page-header">
        <div className="container">
          <p className="eyebrow">passwd --reset</p>
          <h1>Mot de passe oublié</h1>
          <p>Recevez un lien par email pour choisir un nouveau mot de passe.</p>
        </div>
      </div>
      <section>
        <div className="container">
          {done ? (
            <div className="form-success">
              <h3 className="mt-0">Vérifiez votre boîte mail</h3>
              <p>
                Si un compte existe pour <strong>{email}</strong>, un email vient de vous être envoyé avec
                un lien pour choisir un nouveau mot de passe.
              </p>
              <p className="small" style={{ marginTop: 12 }}>
                Vous ne recevez rien après quelques minutes ? Pensez à vérifier vos spams, ou{' '}
                <Link to="/connexion">retournez à la connexion</Link>.
              </p>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="contact-form card" style={{ maxWidth: 420, margin: '0 auto' }}>
              <label htmlFor="email">Adresse email</label>
              <input id="email" type="email" required value={email} onChange={(e) => setEmail(e.target.value)} autoComplete="email" />

              {error && <p style={{ color: '#e5484d', marginTop: 12 }}>{error}</p>}

              <button type="submit" className="btn btn-primary" style={{ marginTop: 20 }} disabled={loading}>
                {loading ? 'Envoi…' : 'Envoyer le lien de réinitialisation'}
              </button>

              <p className="small" style={{ marginTop: 16 }}>
                <Link to="/connexion">Retour à la connexion</Link>
              </p>
            </form>
          )}
        </div>
      </section>
    </>
  )
}

