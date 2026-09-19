import { Link } from 'react-router-dom'
import Reveal from '../components/Reveal.jsx'
import tome1Cover from '../assets/images/tome1-cover.jpg'

const ETSY_URL = 'https://www.etsy.com/shop/3wmService'

export default function Boutique() {
  return (
    <>
      <div className="page-header">
        <div className="container">
          <p className="eyebrow">cd boutique</p>
          <h1>Nos ebooks Linux &amp; cybersécurité</h1>
          <p>Écrits par L'Homme-du-Milieu. PDF en français et en anglais inclus dans chaque achat. Disponibles sur notre boutique Etsy 3wmService.</p>
        </div>
      </div>

      <section>
        <div className="container">
          <Reveal className="book-card" style={{ marginBottom: 32 }}>
            <img src={tome1Cover} alt="Couverture — Linux pour débutants, fondamentaux cybersécurité" />
            <div>
              <span className="book-tag">Tome 1 — Débutant</span>
              <h2 className="mt-0">Linux pour débutants — Fondamentaux cybersécurité</h2>
              <p>Le point de départ idéal pour découvrir Linux et poser de vraies bases en cybersécurité, sans jargon inutile. Installation, ligne de commande, sécurité de base : tout pour bien commencer.</p>
              <div className="book-price">14,99 €</div>
              <p className="small">PDF en français et en anglais inclus · accès immédiat après achat</p>
              <a href={ETSY_URL} target="_blank" rel="noopener noreferrer" className="btn btn-primary">Acheter sur Etsy</a>
            </div>
          </Reveal>

          <Reveal className="book-card" delay={0.1}>
            <div className="book-cover-placeholder">Kali Linux &amp; Méthodologie Pentest — Tome 2</div>
            <div>
              <span className="book-tag">Tome 2 — Intermédiaire</span>
              <h2 className="mt-0">Kali Linux &amp; Méthodologie Pentest</h2>
              <p>La suite avancée du Tome 1 : découverte de Kali Linux, méthodologie de pentest étape par étape (reconnaissance, scan, exploitation, reporting) et bonnes pratiques éthiques.</p>
              <div className="book-price">19,90 €</div>
              <p className="small">PDF en français et en anglais inclus · accès immédiat après achat</p>
              <a href={ETSY_URL} target="_blank" rel="noopener noreferrer" className="btn btn-primary">Acheter sur Etsy</a>
            </div>
          </Reveal>
        </div>
      </section>

      <section className="alt">
        <div className="container center">
          <h2 className="section-title">Une question avant d'acheter ?</h2>
          <p className="section-sub">Écrivez-nous, nous répondons rapidement.</p>
          <Link to="/contact" className="btn btn-outline">Contacter 3WM Service</Link>
        </div>
      </section>
    </>
  )
}
