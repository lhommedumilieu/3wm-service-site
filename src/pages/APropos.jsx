import { Link } from 'react-router-dom'
import Reveal from '../components/Reveal.jsx'
import useDocumentMeta from '../hooks/useDocumentMeta.js'

const ACTIVITES = [
  { emo: '🛠️', titre: 'Dépannage Windows', texte: 'Assistance à distance basée sur le consentement explicite, pour résoudre les problèmes Windows du quotidien sans jargon ni pression.', lien: '/services', cta: 'Voir le dépannage' },
  { emo: '📘', titre: 'Ebooks', texte: "Des guides écrits pour être compris, qui posent de vraies bases avant d'aller plus loin vers le pentest.", lien: '/boutique', cta: 'Voir les ebooks' },
  { emo: '✍️', titre: 'Blog', texte: 'Des tutoriels pratiques, testés, pour progresser en Linux et en cybersécurité à son rythme.', lien: '/blog', cta: 'Lire le blog' },
]

const ENGAGEMENTS = [
  { ico: '🤝', titre: 'Consentement et transparence', texte: "Jamais d'action cachée sur votre machine : vous voyez tout et vous gardez la main." },
  { ico: '💬', titre: 'Des explications claires', texte: 'Du français simple plutôt que du jargon technique.' },
  { ico: '💶', titre: 'Des tarifs annoncés', texte: "Simples, et connus à l'avance." },
]

export default function APropos() {
  useDocumentMeta(
    'À propos',
    "3WM Service, c'est L'Homme-du-Milieu : dépannage Windows à distance, ebooks Linux & cybersécurité et blog de tutoriels, avec une approche basée sur le consentement et la transparence.",
    '/a-propos'
  )

  return (
    <>
      <section className="page-hero page-hero-simple">
        <div className="container">
          <p className="eyebrow">À propos</p>
          <h1>
            À propos de <span className="hl">3WM Service</span>
          </h1>
          <p className="lead">
            Une seule personne, L'Homme-du-Milieu, qui aide particuliers et petites structures à dépanner leur PC
            Windows au quotidien.
          </p>
        </div>
      </section>

      <section>
        <div className="container" style={{ maxWidth: 760 }}>
          <Reveal as="p">
            3WM Service, c'est <strong>L'Homme-du-Milieu</strong> : il dépanne les PC Windows de particuliers et
            de petites structures, et partage par ailleurs sa passion pour Linux et la cybersécurité à travers
            des ebooks et un blog.
          </Reveal>
          <Reveal as="p" delay={0.05}>
            Le nom fait un clin d'œil au concept d'attaque « Man-in-the-Middle » (l'homme du milieu) bien connu
            en sécurité informatique — ici détourné pour une activité tout à fait légitime : se placer entre vous
            et vos problèmes techniques pour les régler.
          </Reveal>
        </div>
      </section>

      <section className="alt">
        <div className="container">
          <Reveal as="h2" className="section-title">Trois activités, une même exigence</Reveal>
          <div className="grid grid-3" style={{ marginTop: 32 }}>
            {ACTIVITES.map((a, i) => (
              <Reveal className="card activite" delay={i * 0.08} key={a.titre}>
                <span className="emo-lg" aria-hidden="true">{a.emo}</span>
                <h3>{a.titre}</h3>
                <p>{a.texte}</p>
                <Link to={a.lien} className="blog-more">{a.cta} →</Link>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      <section>
        <div className="container">
          <Reveal as="h2" className="section-title">Pourquoi faire confiance à 3WM Service ?</Reveal>
          <div className="trust-grid trust-3" style={{ marginTop: 32 }}>
            {ENGAGEMENTS.map((c) => (
              <div className="trust-item" key={c.titre}>
                <span className="trust-ico" aria-hidden="true">{c.ico}</span>
                <div>
                  <strong>{c.titre}</strong>
                  <span className="t">{c.texte}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section style={{ paddingTop: 0 }}>
        <div className="container">
          <Reveal className="cta-band">
            <h2>Un souci informatique ?</h2>
            <p>Écrivez-moi : je vous réponds par e-mail avant toute intervention.</p>
            <Link to="/contact" className="btn btn-primary btn-lg">Prendre contact</Link>
          </Reveal>
        </div>
      </section>
    </>
  )
}
