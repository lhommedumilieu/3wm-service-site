import { Link } from 'react-router-dom'

export default function NotFound() {
  return (
    <section className="hero">
      <div className="container center">
        <p className="eyebrow">404</p>
        <h1>Page introuvable</h1>
        <p className="lead" style={{ margin: '0 auto 32px' }}>Cette page n'existe pas ou a été déplacée.</p>
        <Link to="/" className="btn btn-primary">Retour à l'accueil</Link>
      </div>
    </section>
  )
}
