import { Link } from 'react-router-dom'
import useDocumentMeta from '../hooks/useDocumentMeta.js'

export default function NotFound() {
  useDocumentMeta('Page introuvable', "Cette page n'existe pas ou a été déplacée.", undefined)

  return (
    <section className="page-hero page-hero-simple notfound">
      <div className="container center">
        <p className="notfound-code" aria-hidden="true">404</p>
        <h1>Oups, cette page <span className="hl">est introuvable</span></h1>
        <p className="lead" style={{ margin: '0 auto 28px' }}>
          Elle n'existe pas ou a été déplacée. Pas de panique : retournez à l'accueil, ou dites-moi ce que vous cherchiez.
        </p>
        <div className="btn-row" style={{ justifyContent: 'center' }}>
          <Link to="/" className="btn btn-primary btn-lg">Retour à l'accueil</Link>
          <Link to="/contact" className="btn btn-outline btn-lg">Me contacter</Link>
        </div>
      </div>
    </section>
  )
}
