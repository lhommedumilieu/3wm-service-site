import { Link } from 'react-router-dom'
import Reveal from '../components/Reveal.jsx'
import tome1Cover from '../assets/images/tome1-cover.jpg'
import tome2Cover from '../assets/images/tome2-cover.jpg'
import useDocumentMeta from '../hooks/useDocumentMeta.js'

const ETSY_URL = 'https://www.etsy.com/shop/3wmService'

function absoluteUrl(path) {
  if (typeof window === 'undefined') return path
  try {
    return new URL(path, window.location.origin).href
  } catch {
    return path
  }
}

export default function Boutique() {
  const structuredData = [
    {
      '@context': 'https://schema.org',
      '@type': 'Product',
      name: 'Linux pour débutants — Fondamentaux cybersécurité',
      description:
        'Le point de départ idéal pour découvrir Linux et poser de vraies bases en cybersécurité, sans jargon inutile. Installation, ligne de commande, sécurité de base.',
      image: absoluteUrl(tome1Cover),
      brand: { '@type': 'Brand', name: '3WM Service' },
      author: { '@type': 'Person', name: "L'Homme-du-Milieu" },
      offers: {
        '@type': 'Offer',
        url: ETSY_URL,
        price: '14.99',
        priceCurrency: 'EUR',
        availability: 'https://schema.org/InStock',
      },
    },
    {
      '@context': 'https://schema.org',
      '@type': 'Product',
      name: 'Kali Linux & Méthodologie Pentest',
      description:
        'La suite avancée du Tome 1 : découverte de Kali Linux, méthodologie de pentest étape par étape (reconnaissance, scan, exploitation, reporting) et bonnes pratiques éthiques.',
      image: absoluteUrl(tome2Cover),
      brand: { '@type': 'Brand', name: '3WM Service' },
      author: { '@type': 'Person', name: "L'Homme-du-Milieu" },
      offers: {
        '@type': 'Offer',
        url: ETSY_URL,
        price: '19.90',
        priceCurrency: 'EUR',
        availability: 'https://schema.org/InStock',
      },
    },
  ]

  useDocumentMeta(
    'Ebooks Linux & cybersécurité',
    "Deux ebooks pour apprendre Linux et la cybersécurité : Tome 1 — Linux pour débutants (14,99 €) et Tome 2 — Kali Linux & Méthodologie Pentest (19,90 €). PDF en français et en anglais.",
    '/boutique',
    structuredData
  )

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
            <img src={tome1Cover} alt="Couverture — Linux pour débutants, fondamentaux cybersécurité" width="400" height="400" />
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
            <img src={tome2Cover} alt="Couverture — Kali Linux & Méthodologie Pentest" width="400" height="400" loading="lazy" />
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
