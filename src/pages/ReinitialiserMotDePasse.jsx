import { useEffect, useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext.jsx'
import PasswordField from '../components/PasswordField.jsx'
import useDocumentMeta from '../hooks/useDocumentMeta.js'

// Le lien reçu par email redirige ici avec un jeton temporaire dans le
// fragment d'URL, ex : /reinitialiser-mot-de-passe#access_token=...&type=recovery
function readRecoveryToken() {
  const hash = window.location.hash?.startsWith('#') ? window.location.hash.slice(1) : window.location.hash
  const params = new URLSearchParams(hash || '')
  const accessToken = params.get('access_token')
  const type = params.get('type')
  if (accessToken && (type === 'recovery' || type === null)) {
    return accessToken
  }
  return null
}
export default function ReinitialiserMotDePasse() {
  const { updatePasswordWithToken, isConfigured } = useAuth()
  const navigate = useNavigate()
  const [token, setToken] = useState(null)
  const [checkedToken, setCheckedToken] = useState(false)
  const [password, setPassword] = useState('')
  const [confirm, setConfirm] = useState('')
  const [error, setError] = useState('')
  const [done, setDone] = useState(false)
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    setToken(readRecoveryToken())
    setCheckedToken(true)
  }, [])

  useDocumentMeta('Réinitialiser le mot de passe', 'Choisissez un nouveau mot de passe pour votre compte 3WM Service.', '/reinitialiser-mot-de-passe')

  if (!isConfigured) {
    return (
      <div className="page-header">
        <div className="container">
          <h1>Réinitialiser le mot de passe</h1>
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
      await updatePasswordWithToken(token, password)
      setDone(true)
      window.history.replaceState(null, '', window.location.pathname)
      setTimeout(() => navigate('/connexion'), 3000)
    } catch (err) {
      setError(err.message || 'Impossible de mettre à jour le mot de passe.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <>
      <div className="page-header">
        <div className="container">
          <p className="eyebrow">passwd --set</p>
          <h1>Réinitialiser le mot de passe</h1>
          <p>Choisissez un nouveau mot de passe pour votre compte.</p>
        </div>
      </div>
      <section>
        <div className="container">
          {!checkedToken ? null : done ? (
            <div className="form-success">
              <h3 className="mt-0">Mot de passe mis à jour</h3>
              <p>Votre mot de passe a bien été changé. Vous allez être redirigé vers la connexion…</p>
              <p className="small" style={{ marginTop: 12 }}>
                <Link to="/connexion">Se connecter maintenant</Link>
              </p>
            </div>
          ) : !token ? (
            <div className="form-success">
              <h3 className="mt-0">Lien invalide ou expiré</h3>
              <p>Ce lien de réinitialisation n'est plus valable. Demandez-en un nouveau ci-dessous.</p>
              <p className="small" style={{ marginTop: 12 }}>
                <Link to="/mot-de-passe-oublie">Demander un nouveau lien</Link>
              </p>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="contact-form card" style={{ maxWidth: 420, margin: '0 auto' }}>
              <PasswordField
                id="password"
                label="Nouveau mot de passe (8 caractères minimum)"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                autoComplete="new-password"
                minLength={8}
              />

              <PasswordField
                id="confirm"
                label="Confirmer le nouveau mot de passe"
                value={confirm}
                onChange={(e) => setConfirm(e.target.value)}
                autoComplete="new-password"
                minLength={8}
                style={{ marginTop: 16 }}
              />

              {error && <p style={{ color: '#e5484d', marginTop: 12 }}>{error}</p>}

              <button type="submit" className="btn btn-primary" style={{ marginTop: 20 }} disabled={loading}>
                {loading ? 'Mise à jour…' : 'Mettre à jour le mot de passe'}
              </button>
            </form>
          )}
        </div>
      </section>
    </>
  )
}
