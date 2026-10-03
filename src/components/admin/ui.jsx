import { useCallback, useEffect, useState } from 'react'

export function formatDate(valeur) {
  if (!valeur) return '—'
  return new Date(valeur).toLocaleString('fr-FR', { dateStyle: 'short', timeStyle: 'short' })
}

export function formatDateCourte(valeur) {
  if (!valeur) return '—'
  return new Date(valeur).toLocaleDateString('fr-FR')
}

export function euros(n) {
  return `${(Number(n) || 0).toLocaleString('fr-FR', { minimumFractionDigits: 2, maximumFractionDigits: 2 })} €`
}

// Charge une liste au montage et fournit un rafraîchissement manuel.
export function useListe(chargeur) {
  const [donnees, setDonnees] = useState(null)
  const [erreur, setErreur] = useState('')
  const recharger = useCallback(async () => {
    try {
      setErreur('')
      setDonnees(await chargeur())
    } catch (e) {
      setErreur(e.message || 'Chargement impossible.')
      setDonnees((d) => d ?? [])
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])
  useEffect(() => {
    recharger()
  }, [recharger])
  return { donnees, erreur, recharger, setDonnees }
}

export function StatCard({ label, valeur, aide, ton }) {
  return (
    <div className={`admin-stat${ton ? ` ton-${ton}` : ''}`}>
      <span className="admin-stat-label">{label}</span>
      <strong className="admin-stat-valeur">{valeur}</strong>
      {aide && <span className="admin-stat-aide">{aide}</span>}
    </div>
  )
}

export function Vide({ children }) {
  return <p className="admin-vide">{children}</p>
}

export function Erreur({ children }) {
  return children ? <p className="admin-erreur" role="alert">{children}</p> : null
}

export function Panneau({ titre, actions, children, className = '' }) {
  return (
    <section className={`admin-panneau ${className}`}>
      {(titre || actions) && (
        <header className="admin-panneau-tete">
          <h3>{titre}</h3>
          {actions && <div className="admin-panneau-actions">{actions}</div>}
        </header>
      )}
      {children}
    </section>
  )
}

export function Pastille({ ton = 'gris', children }) {
  return <span className={`pastille pastille-${ton}`}>{children}</span>
}

// Confirmation puis action ; renvoie true si l'action a été lancée.
export function confirmer(message) {
  return window.confirm(message)
}
