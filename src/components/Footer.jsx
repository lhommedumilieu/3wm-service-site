import { Link } from 'react-router-dom'

export default function Footer() {
  return (
    <footer className="site-footer">
      <nav className="footer-links" aria-label="Pied de page">
        <Link to="/">Accueil</Link>
        <Link to="/services">Services</Link>
        <Link to="/boutique">Boutique</Link>
        <Link to="/blog">Blog</Link>
        <Link to="/a-propos">À propos</Link>
        <Link to="/contact">Contact</Link>
        <Link to="/mentions-legales">Mentions légales</Link>
      </nav>
      <p>© 2026 3WM Service — contact : <a href="mailto:service@3-wm.net">service@3-wm.net</a></p>
    </footer>
  )
}
