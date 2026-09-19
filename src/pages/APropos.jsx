import { Link } from 'react-router-dom'
import Reveal from '../components/Reveal.jsx'
import useDocumentMeta from '../hooks/useDocumentMeta.js'

export default function APropos() {
  useDocumentMeta(
    'À propos',
    "3WM Service, c'est L'Homme-du-Milieu : dépannage Windows à distance, ebooks Linux & cybersécurité et blog de tutoriels, avec une approche basée sur le consentement et la transparence.",
    '/a-propos'
  )

  return (
    <>
      <div className="page-header">
        <div className="container">
          <p className="eyebrow">À propos</p>
          <h1>À propos de 3WM Service</h1>
        </div>
      </div>

      <section>
        <div className="container" style={{ maxWidth: 720 }}>
          <p>3WM Service, c'est une seule personne : <strong>L'Homme-du-Milieu</strong>, qui aide particuliers et petites structures à dépanner leur PC Windows au quotidien, et qui partage par ailleurs sa passion pour Linux et la cybersécurité à travers des ebooks et un blog.</p>
          <p>Le nom fait un clin d'œil au concept d'attaque « Man-in-the-Middle » (l'homme du milieu) bien connu en sécurité informatique — ici détourné pour une activité tout à fait légitime : se placer entre vous et vos problèmes techniques pour les régler.</p>

          <h2>Trois activités, une même exigence</h2>
          <div className="grid grid-3" style={{ marginTop: 24 }}>
            <Reveal className="card">
              <h3>Dépannage Windows</h3>
              <p>Assistance à distance basée sur le consentement explicite, pour résoudre les problèmes Windows du quotidien sans jargon ni pression.</p>
            </Reveal>
            <Reveal className="card" delay={0.08}>
              <h3>Ebooks</h3>
              <p>Des guides écrits pour être compris, qui posent de vraies bases avant d'aller plus loin vers le pentest.</p>
            </Reveal>
            <Reveal className="card" delay={0.16}>
              <h3>Blog</h3>
              <p>Des tutoriels pratiques, testés, pour progresser en Linux et en cybersécurité à son rythme.</p>
            </Reveal>
          </div>

          <h2>Pourquoi faire confiance à 3WM Service ?</h2>
          <ul>
            <li>Une approche centrée sur le consentement et la transparence, jamais d'action cachée sur votre machine.</li>
            <li>Des explications claires plutôt que du jargon technique.</li>
            <li>Des tarifs simples et annoncés à l'avance.</li>
          </ul>

          <p className="center" style={{ marginTop: 40 }}>
            <Link to="/contact" className="btn btn-primary">Prendre contact</Link>
          </p>
        </div>
      </section>
    </>
  )
}
