import { Link } from 'react-router-dom'
import { useAuth } from '../context/AuthContext.jsx'

export default function EspaceMembre() {
  const { user, loading, isConfigured, signOut } = useAuth()

  if (!isConfigured) {
    return (
      <div className="page-header">
        <div className="container">
          <h1>Espace membre</h1>
          <p>Les comptes utilisateurs arrivent bientôt sur 3WM Service. Revenez un peu plus tard !</p>
        </div>
      </div>
    )
  }

  if (loading) {
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
          <h1>Espace membre</h1>
          <p>Vous devez être connecté pour accéder à cette page.</p>
          <Link to="/connexion" className="btn btn-primary">Se connecter</Link>
        </div>
      </div>
    )
  }

  return (
    <>
      <div className="page-header">
        <div className="container">
          <p className="eyebrow">cd ~</p>
          <h1>Bienvenue, {user.email}</h1>
          <p>Votre espace membre 3WM Service.</p>
        </div>
      </div>

      <section>
        <div className="container">
          <div className="grid grid-2">
            <div className="card">
              <h3 className="mt-0">Contenu réservé aux membres</h3>
              <p>Un premier extrait exclusif du Tome 2 — Kali Linux &amp; Méthodologie Pentest, réservé aux membres inscrits.</p>
              <p className="small">« Avant de lancer le moindre scan, la méthodologie de pentest impose une phase de reconnaissance passive : comprendre la cible sans jamais interagir directement avec elle. C'est cette discipline qui distingue un audit professionnel d'un simple test au hasard… »</p>
            </div>
            <div className="card">
              <h3 className="mt-0">Vos informations</h3>
              <p className="small">Email : {user.email}</p>
              <p className="small">Compte créé le : {new Date(user.created_at).toLocaleDateString('fr-FR')}</p>
              <button type="button" className="btn btn-outline" onClick={signOut}>Se déconnecter</button>
            </div>
          </div>
        </div>
      </section>
    </>
  )
}
