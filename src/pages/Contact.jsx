import { useState } from 'react'
import useDocumentMeta from '../hooks/useDocumentMeta.js'
import { trackEvent } from '../lib/analytics.js'
import { logContactMessage } from '../lib/publicLogs.js'

const EMAIL = 'service@3-wm.net'

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
    if (form['bot-field']) return // piège anti-robot : on ignore silencieusement
    setStatus('sending')
    const ok = await logContactMessage(form)
    if (ok) {
      setStatus('sent')
      trackEvent('contact_submit', form.sujet)
    } else {
      setStatus('error')
    }
  }

  const mailto = `mailto:${EMAIL}?subject=${encodeURIComponent(form.sujet)}&body=${encodeURIComponent(form.message)}`

  return (
    <>
      <section className="page-hero page-hero-simple">
        <div className="container">
          <p className="eyebrow">Contact</p>
          <h1>
            Parlons de <span className="hl">votre problème</span>
          </h1>
          <p className="lead">
            Décrivez votre souci ou votre question : je reviens vers vous par e-mail dans les meilleurs délais,
            avec la formule adaptée avant toute intervention.
          </p>
        </div>
      </section>

      <section>
        <div className="container contact-layout">
          <div>
            {status === 'sent' ? (
              <div className="card form-done">
                <span className="done-ico" aria-hidden="true">✓</span>
                <h2>Message envoyé</h2>
                <p>Merci ! Votre message a bien été reçu, vous aurez une réponse par e-mail dans les meilleurs délais.</p>
              </div>
            ) : (
              <form className="contact-form card" onSubmit={handleSubmit} name="contact" style={{ maxWidth: 'none', margin: 0 }}>
                <p className="hidden">
                  <label>
                    Ne pas remplir si vous êtes humain :
                    <input name="bot-field" value={form['bot-field']} onChange={handleChange} tabIndex={-1} autoComplete="off" />
                  </label>
                </p>

                <div className="form-row">
                  <div>
                    <label htmlFor="name">Nom</label>
                    <input type="text" id="name" name="name" required value={form.name} onChange={handleChange} autoComplete="name" />
                  </div>
                  <div>
                    <label htmlFor="email">E-mail</label>
                    <input type="email" id="email" name="email" required value={form.email} onChange={handleChange} autoComplete="email" />
                  </div>
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
                  <label htmlFor="message">Votre message</label>
                  <textarea id="message" name="message" required value={form.message} onChange={handleChange} placeholder="Ex. : mon PC met 10 minutes à démarrer depuis la dernière mise à jour…"></textarea>
                </div>

                <button type="submit" className="btn btn-primary btn-lg" disabled={status === 'sending'}>
                  {status === 'sending' ? 'Envoi…' : 'Envoyer le message'}
                </button>

                {status === 'error' && (
                  <p className="form-error" role="alert">
                    Votre message n'a pas pu être enregistré. Vous pouvez écrire directement à{' '}
                    <a href={mailto}>{EMAIL}</a> : votre texte sera repris dans le message.
                  </p>
                )}
              </form>
            )}
          </div>

          <aside className="contact-side">
            <div className="card">
              <h3 className="mt-0">📧 Écrire directement</h3>
              <p className="small">Vous préférez votre messagerie habituelle ?</p>
              <p><a href={`mailto:${EMAIL}`}>{EMAIL}</a></p>
            </div>
            <div className="card">
              <h3 className="mt-0">🤝 Ce qui se passe ensuite</h3>
              <ol className="mini-steps">
                <li>Je lis votre message et je vous réponds par e-mail.</li>
                <li>Je vous propose la formule la plus adaptée.</li>
                <li>Rien ne démarre sans votre accord.</li>
              </ol>
            </div>
          </aside>
        </div>
      </section>
    </>
  )
}
