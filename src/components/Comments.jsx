import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { useAuth } from '../context/AuthContext.jsx'
import { SUPABASE_URL, SUPABASE_ANON_KEY, isSupabaseConfigured } from '../lib/config.js'
import { getSession } from '../lib/supabaseAuth.js'

export default function Comments({ slug }) {
  const { user, isConfigured } = useAuth()
  const [comments, setComments] = useState([])
  const [text, setText] = useState('')
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [posting, setPosting] = useState(false)

  useEffect(() => {
    if (!isConfigured) {
      setLoading(false)
      return
    }
    fetch(`${SUPABASE_URL}/rest/v1/comments?post_slug=eq.${encodeURIComponent(slug)}&order=created_at.asc&select=id,author_email,content,created_at`, {
      headers: { apikey: SUPABASE_ANON_KEY },
    })
      .then((res) => (res.ok ? res.json() : []))
      .then(setComments)
      .catch(() => setComments([]))
      .finally(() => setLoading(false))
  }, [slug, isConfigured])

  async function handleSubmit(e) {
    e.preventDefault()
    if (!text.trim()) return
    setPosting(true)
    setError('')
    try {
      const session = getSession()
      const res = await fetch(`${SUPABASE_URL}/rest/v1/comments`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          apikey: SUPABASE_ANON_KEY,
          Authorization: `Bearer ${session?.access_token || SUPABASE_ANON_KEY}`,
          Prefer: 'return=representation',
        },
        body: JSON.stringify({
          post_slug: slug,
          author_email: user.email,
          content: text.trim(),
        }),
      })
      if (!res.ok) throw new Error("Le commentaire n'a pas pu être publié.")
      const [created] = await res.json()
      setComments((prev) => [...prev, created])
      setText('')
    } catch (err) {
      setError(err.message)
    } finally {
      setPosting(false)
    }
  }

  if (!isConfigured) return null

  return (
    <div style={{ marginTop: 48, borderTop: '1px solid var(--border, #2a2f3a)', paddingTop: 32 }}>
      <h3>Commentaires {comments.length > 0 ? `(${comments.length})` : ''}</h3>

      {loading && <p className="small">Chargement des commentaires…</p>}

      {!loading && comments.length === 0 && <p className="small">Aucun commentaire pour le moment. Soyez le premier à réagir.</p>}

      {comments.map((c) => (
        <div key={c.id} className="card" style={{ marginBottom: 12 }}>
          <p className="post-meta">{c.author_email} · {new Date(c.created_at).toLocaleDateString('fr-FR')}</p>
          <p style={{ marginBottom: 0 }}>{c.content}</p>
        </div>
      ))}

      {user ? (
        <form onSubmit={handleSubmit} style={{ marginTop: 20 }}>
          <label htmlFor="comment-text">Ajouter un commentaire</label>
          <textarea
            id="comment-text"
            rows={3}
            value={text}
            onChange={(e) => setText(e.target.value)}
            style={{ width: '100%', marginTop: 8 }}
            required
          />
          {error && <p style={{ color: '#e5484d' }}>{error}</p>}
          <button type="submit" className="btn btn-primary" style={{ marginTop: 12 }} disabled={posting}>
            {posting ? 'Publication…' : 'Publier'}
          </button>
        </form>
      ) : (
        <p className="small" style={{ marginTop: 16 }}>
          <Link to="/connexion">Connectez-vous</Link> pour laisser un commentaire.
        </p>
      )}
    </div>
  )
}
