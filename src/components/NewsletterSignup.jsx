import { useState } from 'react'
import { SUPABASE_URL, SUPABASE_ANON_KEY, isSupabaseConfigured } from '../lib/config.js'

/**
 * Formulaire d'inscription minimal : une adresse e-mail, envoyée dans la
 * table Supabase `newsletter_subscribers` (INSERT uniquement, RLS activée —
 * personne ne peut lire ni exporter les adresses avec la clé publique).
 */
export default function NewsletterSignup({ source = 'site', title, description }) {
  const [email, setEmail] = useState('')
  const [status, setStatus] = useState('idle') // idle | sending | sent | error

  async function handleSubmit(e) {
    e.preventDefault()
    if (!email) return
    if (!isSupabaseConfigured) {
      setStatus('error')
      return
    }
    setStatus('sending')
    try {
      const res = await fetch(`${SUPABASE_URL}/rest/v1/newsletter_subscribers`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          apikey: SUPABASE_ANON_KEY,
          Authorization: `Bearer ${SUPABASE_ANON_KEY}`,
          Prefer: 'return=minimal',
        },
        body: JSON.stringify({ email, source }),
      })
      // 201 = créé, 409 = déjà inscrit (contrainte unique) : dans les deux cas,
      // l'adresse est bien dans la liste, donc on affiche un succès.
      if (res.ok || res.status === 409) {
        setStatus('sent')
        setEmail('')
      } else {
        setStatus('error')
      }
    } catch {
      setStatus('error')
    }
  }

  if (status === 'sent') {
    return (
      <div className="newsletter-signup newsletter-signup-sent">
        <p>Merci ! Vous êtes inscrit·e — à bientôt par e-mail.</p>
      </div>
    )
  }

  return (
    <div className="newsletter-signup">
      <div>
        <h3 className="mt-0">{title || 'Un tuto par e-mail, de temps en temps'}</h3>
        <p>{description || "Pas de spam : juste un e-mail quand un nouvel article ou un nouvel ebook sort."}</p>
      </div>
      <form onSubmit={handleSubmit} className="newsletter-form">
        <label htmlFor={`newsletter-email-${source}`} className="visually-hidden">Adresse e-mail</label>
        <input
          id={`newsletter-email-${source}`}
          type="email"
          required
          placeholder="vous@exemple.com"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />
        <button type="submit" className="btn btn-primary" disabled={status === 'sending'}>
          {status === 'sending' ? 'Inscription…' : "S'inscrire"}
        </button>
      </form>
      {status === 'error' && (
        <p className="small" role="alert" style={{ color: '#e5484d' }}>
          Une erreur est survenue, réessayez dans un instant.
        </p>
      )}
    </div>
  )
}
