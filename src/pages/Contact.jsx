import { useState } from 'react'
import useDocumentMeta from '../hooks/useDocumentMeta.js'

function encode(data) {
  return Object.keys(data)
    .map((key) => encodeURIComponent(key) + '=' + encodeURIComponent(data[key]))
    .join('&')
}

export default function Contact() {
  const [form, setForm] = useState({ name: '', email: '', sujet: 'Dépannage Windows', message: '', 'bot-field': '' })
  const [status, setStatus] = useState('idle') // idle | sending | sent | error

  useDocumentMeta(
    'Contact',
    "Contactez 3WM Service pour un dépannage Windows à distance ou une question sur les ebooks Linux & cybersécurité. Réponse par e-mail dans les meilleurs délais.",
    '/contact'
  )

  function handleChange(e) {
    const { name, value } = e.target
    setForm((f) => ({ ...f, [name]: value }))
  }

  async function handleSubmit(e) {
    e.preventDefault()
    if (form['bot-field']) return // honeypot triggered, silently ignore
    setStatus('sending')
    try {
      await fetch('/', {
        method: 'POST',
        headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
        body: encode({ 'form-name': 'contact', ...form }),
      })
      setStatus('sent')
    } catch {
      setStatus('error')
    }
  }

  return (
    <>
      <div className="page-header">
        <div className="container">
          <p className="eyebrow eyebrow-ps">Contact</p>
          <h1>Contactez 3WM Service</h1>
          <p>Décrivez votre problème ou votre question — réponse par e-mail dans les meilleurs délais.</p>
        </div>
      </div>

      <section>
        <div className="container">
          {status === 'sent' ? (
            <div className="form-success">
              <svg className="icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" style={{ width: 44, height: 44, margin: '0 auto 16px' }}>
                <circle cx="12" cy="12" r="9"></circle>
                <path d="M8.5 12.5l2.3 2.3L16 10"></path>
              </svg>
              <h2 style={{ marginTop: 0 }}>Message envoyé</h2>
              <p>Merci ! Votre message a bien été reçu, vous aurez une réponse par e-mail dans les meilleurs délais.</p>
            </div>
          ) : (
            <form className="contact-form" onSubmit={handleSubmit} name="contact">
              <p className="hidden">
                <label>
                  Ne pas remplir si vous êtes humain :
                  <input name="bot-field" value={form['bot-field']} onChange={handleChange} />
                </label>
              </p>

              <div>
                <label htmlFor="name">Nom</label>
                <input type="text" id="name" name="name" required value={form.name} onChange={handleChange} />
              </div>

              <div>
                <label htmlFor="email">E-mail</label>
                <input type="email" id="email" name="email" required value={form.email} onChange={handleChange} />
              </div>

              <div>
                <label htmlFor="sujet">Sujet</label>
                <select id="sujet" name="sujet" value={form.sujet} onChange={handleChange}>
                  <option>Dépannage Windows</option>
                  <option>Question sur un ebook</option>
                  <option>Autre</option>
                </select>
              </div>

              <div>
                <label htmlFor="message">Message</label>
                <textarea id="message" name="message" required value={form.message} onChange={handleChange}></textarea>
              </div>

              <button type="submit" className="btn btn-primary" disabled={status === 'sending'}>
                {status === 'sending' ? 'Envoi…' : 'Envoyer le message'}
              </button>

              {status === 'error' && (
                <p className="small" style={{ color: '#c0392b' }}>
                  Une erreur est survenue. Vous pouvez écrire directement à{' '}
                  <a href="mailto:service@3-wm.net">service@3-wm.net</a>.
                </p>
              )}
            </form>
          )}

          {status !== 'sent' && (
            <p className="small center" style={{ marginTop: 24 }}>
              Vous pouvez aussi écrire directement à <a href="mailto:service@3-wm.net">service@3-wm.net</a>
            </p>
          )}
        </div>
      </section>
    </>
  )
}
