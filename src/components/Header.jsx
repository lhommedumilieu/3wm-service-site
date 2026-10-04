import { NavLink } from 'react-router-dom'
import { useEffect, useState } from 'react'
import { useAuth } from '../context/AuthContext.jsx'

function getInitialTheme() {
  if (typeof document === 'undefined') return 'dark'
  return document.documentElement.getAttribute('data-theme') === 'light' ? 'light' : 'dark'
}

const links = [
  { to: '/', label: 'Accueil', end: true },
  { to: '/services', label: 'Services' },
  { to: '/boutique', label: 'Boutique' },
  { to: '/forum', label: 'Forum' },
  { to: '/avis', label: 'Avis' },
  { to: '/blog', label: 'Blog' },
  { to: '/recommandations', label: 'Recommandations' },
  { to: '/a-propos', label: 'À propos' },
  { to: '/contact', label: 'Contact' },
]

export default function Header() {
  const [open, setOpen] = useState(false)
  const [theme, setTheme] = useState(getInitialTheme)
  const { user, isConfigured } = useAuth()

  useEffect(() => {
    document.documentElement.setAttribute('data-theme', theme)
    try {
      localStorage.setItem('theme', theme)
    } catch {
      // stockage indisponible (navigation privée, etc.) : on continue sans persister
    }
  }, [theme])

  const toggleTheme = () => setTheme((t) => (t === 'light' ? 'dark' : 'light'))

  const accountLink = isConfigured
    ? (user ? { to: '/espace-membre', label: 'Espace membre' } : { to: '/connexion', label: 'Connexion' })
    : null

  return (
    <header className="site-header">
      <div className="nav-wrap">
        <NavLink to="/" className="logo" onClick={() => setOpen(false)}>
          <span className="logo-mark" aria-hidden="true">&gt;_</span>
          3WM<span className="accent">Service</span>
        </NavLink>
        <button
          type="button"
          className="theme-toggle"
          aria-label={theme === 'light' ? 'Activer le mode sombre' : 'Activer le mode clair'}
          onClick={toggleTheme}
        >
          <span aria-hidden="true">{theme === 'light' ? '🌙' : '☀️'}</span>
        </button>
        <button
          className="nav-toggle"
          aria-label={open ? 'Fermer le menu' : 'Ouvrir le menu'}
          aria-expanded={open}
          aria-controls="main-nav"
          onClick={() => setOpen((v) => !v)}
        >
          <span aria-hidden="true">☰</span>
        </button>
        <nav id="main-nav" aria-label="Navigation principale" className={`main-nav${open ? ' open' : ''}`}>
          <ul>
            {links.map((l) => (
              <li key={l.to}>
                <NavLink
                  to={l.to}
                  end={l.end}
                  onClick={() => setOpen(false)}
                  className={({ isActive }) => (isActive ? 'active' : '')}
                >
                  {l.label}
                </NavLink>
              </li>
            ))}
            {user?.email === 'service@3-wm.net' && (
              <li>
                <NavLink
                  to="/admin"
                  onClick={() => setOpen(false)}
                  className={({ isActive }) => (isActive ? 'active' : '')}
                >
                  Admin
                </NavLink>
              </li>
            )}
            {accountLink && (
              <li>
                <NavLink
                  to={accountLink.to}
                  onClick={() => setOpen(false)}
                  className={({ isActive }) => (isActive ? 'active' : '')}
                >
                  {accountLink.label}
                </NavLink>
              </li>
            )}
          </ul>
        </nav>
      </div>
    </header>
  )
}
