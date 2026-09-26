import { useEffect, useRef, useState } from 'react'
import { CHAT_API_URL } from '../lib/config.js'

// Petit assistant IA auto-hébergé (voir /server) : répond aux questions
// courantes sur 3WM Service. En cas d'erreur (IA hors ligne, etc.), on
// invite simplement à passer par le formulaire de contact plutôt que de
// planter ou d'afficher une erreur technique.
export default function AiChat() {
  const [open, setOpen] = useState(false)
  const [messages, setMessages] = useState([
    { role: 'assistant', content: "Bonjour ! Je suis l'assistant de 3WM Service. Posez-moi une question sur les dépannages, les tarifs ou les ebooks." },
  ])
  const [input, setInput] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(false)
  const scrollRef = useRef(null)

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight
    }
  }, [messages, open])

  async function envoyer(e) {
    e.preventDefault()
    const texte = input.trim()
    if (!texte || loading) return

    const historique = [...messages, { role: 'user', content: texte }]
    setMessages(historique)
    setInput('')
    setLoading(true)
    setError(false)

    try {
      const res = await fetch(CHAT_API_URL, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ messages: historique.slice(-10) }),
      })
      if (!res.ok) throw new Error('reponse non ok')
      const data = await res.json()
      setMessages((m) => [...m, { role: 'assistant', content: data.reply }])
    } catch {
      setError(true)
      setMessages((m) => [
        ...m,
        {
          role: 'assistant',
          content: "Désolé, je ne suis pas disponible pour le moment. Vous pouvez décrire votre besoin via la page Contact, je vous répondrai directement.",
        },
      ])
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="ai-chat">
      {open && (
        <div className="ai-chat-panel" role="dialog" aria-label="Assistant 3WM Service">
          <div className="ai-chat-header">
            <span>Assistant 3WM Service</span>
            <button
              type="button"
              className="ai-chat-close"
              onClick={() => setOpen(false)}
              aria-label="Fermer l'assistant"
            >
              ✕
            </button>
          </div>

          <div className="ai-chat-messages" ref={scrollRef}>
            {messages.map((m, i) => (
              <div key={i} className={`ai-chat-bubble ai-chat-bubble-${m.role}`}>
                {m.content}
              </div>
            ))}
            {loading && (
              <div className="ai-chat-bubble ai-chat-bubble-assistant ai-chat-typing">
                <span></span><span></span><span></span>
              </div>
            )}
          </div>

          <form className="ai-chat-form" onSubmit={envoyer}>
            <input
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="Écrivez votre question..."
              aria-label="Votre message"
              disabled={loading}
            />
            <button type="submit" className="btn btn-primary" disabled={loading || !input.trim()}>
              Envoyer
            </button>
          </form>

          {error && (
            <p className="ai-chat-hint small">
              Réponse indisponible pour le moment — réessayez dans un instant.
            </p>
          )}
        </div>
      )}

      <button
        type="button"
        className="ai-chat-toggle"
        onClick={() => setOpen((v) => !v)}
        aria-label={open ? "Fermer l'assistant" : "Ouvrir l'assistant"}
      >
        {open ? '✕' : '💬'}
      </button>
    </div>
  )
}
