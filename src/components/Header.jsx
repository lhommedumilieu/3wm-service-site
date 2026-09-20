import { NavLink } from 'react-router-dom'
import { useState } from 'react'
import { useAuth } from '../context/AuthContext.jsx'

const links = [
  { to: '/', label: 'Accueil', end: true },
  { to: '/services', label: 'Services' },
  { to: '/boutique', label: 'Boutique' },
  { to: '/blog', label: 'Blog' },
  { to: '/a-propos', label: 'À propos' },
  { to: '/contact', label: 'Contact' },
]

export default function Header() {
  const [open, setOpen] = useState(false)
  const { user, isConfigured } = useAuth()

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
