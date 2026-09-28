import { Link } from 'react-router-dom'
import Reveal from '../components/Reveal.jsx'
import tome1Cover from '../assets/images/tome1-cover.jpg'
import tome2Cover from '../assets/images/tome2-cover.jpg'
import tome3Cover from '../assets/images/tome3-cover.jpg'
import tome4Cover from '../assets/images/tome4-cover.jpg'
import tome5Cover from '../assets/images/tome5-cover.jpg'
import tome6Cover from '../assets/images/tome6-cover.jpg'
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
    {
      '@context': 'https://schema.org',
      '@type': 'Product',
      name: 'Windows avancé — Sécurité, optimisation et dépannage professionnel',
      description:
        'Sécuriser Windows en profondeur, optimiser les performances, automatiser avec PowerShell et le Planificateur de tâches, et diagnostiquer méthodiquement les pannes courantes.',
      image: absoluteUrl(tome3Cover),
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
    {
      '@context': 'https://schema.org',
      '@type': 'Product',
      name: 'Cybersécurité avancée — Audit, hardening et réponse à incident',
      description:
        'La suite du Tome 2 : mener un audit de sécurité, durcir un système et un réseau, structurer une réponse à incident et réaliser un mini-audit sur sa propre installation.',
      image: absoluteUrl(tome4Cover),
      brand: { '@type': 'Brand', name: '3WM Service' },
      author: { '@type': 'Person', name: "L'Homme-du-Milieu" },
      offers: {
        '@type': 'Offer',
        url: ETSY_URL,
        price: '24.90',
        priceCurrency: 'EUR',
        availability: 'https://schema.org/InStock',
      },
    },
    {
      '@context': 'https://schema.org',
      '@type': 'Product',
      name: 'VPN & vie privée en ligne — Comprendre, choisir et agir concrètement',
      description:
        'Comment fonctionne réellement un VPN, comment choisir un fournisseur sérieux, réduire le pistage publicitaire et protéger ses réseaux sociaux, messageries et données mobiles.',
      image: absoluteUrl(tome5Cover),
      brand: { '@type': 'Brand', name: '3WM Service' },
      author: { '@type': 'Person', name: "L'Homme-du-Milieu" },
      offers: {
        '@type': 'Offer',
        url: ETSY_URL,
        price: '16.99',
        priceCurrency: 'EUR',
        availability: 'https://schema.org/InStock',
      },
    },
    {
      '@context': 'https://schema.org',
      '@type': 'Product',
      name: 'Réseaux & Wi-Fi pour tous — Comprendre, sécuriser et dépanner son réseau',
      description:
        "Les bases indispensables (IP, DHCP, DNS), sécuriser sa box et son Wi-Fi, diagnostiquer une connexion lente et isoler ses objets connectés, sans jargon inutile.",
      image: absoluteUrl(tome6Cover),
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
  ]

  useDocumentMeta(
    'Ebooks Linux, Windows & cybersécurité',
    "Six ebooks pour apprendre Linux, Windows, la cybersécurité, les VPN et les réseaux Wi-Fi, de 14,99 € à 24,90 €. PDF en français, accès immédiat après achat sur notre boutique Etsy.",
    '/boutique',
    structuredData
  )

  return (
    <>
      <div className="page-header">
        <div className="container">
          <p className="eyebrow">cd boutique</p>
          <h1>Nos ebooks Linux, Windows &amp; cybersécurité</h1>
          <p>Écrits par L'Homme-du-Milieu. PDF en français, accès immédiat après achat. Disponibles sur notre boutique Etsy 3wmService.</p>
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

          <Reveal className="book-card" delay={0.1}>
            <img src={tome3Cover} alt="Couverture — Windows avancé, sécurité, optimisation et dépannage professionnel" width="400" height="400" loading="lazy" />
            <div>
              <span className="book-tag">Tome 3 — Intermédiaire</span>
              <h2 className="mt-0">Windows avancé — Sécurité, optimisation et dépannage professionnel</h2>
              <p>Sécuriser Windows en profondeur, optimiser les performances et le démarrage, automatiser avec PowerShell et le Planificateur de tâches, et diagnostiquer méthodiquement les pannes courantes grâce à une étude de cas complète.</p>
              <div className="book-price">19,90 €</div>
              <p className="small">PDF en français · accès immédiat après achat</p>
              <a href={ETSY_URL} target="_blank" rel="noopener noreferrer" className="btn btn-primary">Acheter sur Etsy</a>
            </div>
          </Reveal>

          <Reveal className="book-card" delay={0.15}>
            <img src={tome4Cover} alt="Couverture — Cybersécurité avancée, audit, hardening et réponse à incident" width="400" height="400" loading="lazy" />
            <div>
              <span className="book-tag">Tome 4 — Avancé</span>
              <h2 className="mt-0">Cybersécurité avancée — Audit, hardening et réponse à incident</h2>
              <p>La suite directe du Tome 2 : mener un audit de sécurité méthodique, durcir (hardening) un système et un réseau, structurer une réponse à incident et réaliser un mini-audit de sécurité sur sa propre installation.</p>
              <div className="book-price">24,90 €</div>
              <p className="small">PDF en français · accès immédiat après achat</p>
              <a href={ETSY_URL} target="_blank" rel="noopener noreferrer" className="btn btn-primary">Acheter sur Etsy</a>
            </div>
          </Reveal>

          <Reveal className="book-card" delay={0.2}>
            <img src={tome5Cover} alt="Couverture — VPN et vie privée en ligne, comprendre, choisir et agir concrètement" width="400" height="400" loading="lazy" />
            <div>
              <span className="book-tag">Tome 5 — Débutant/Intermédiaire</span>
              <h2 className="mt-0">VPN &amp; vie privée en ligne — Comprendre, choisir et agir concrètement</h2>
              <p>Comment fonctionne réellement un VPN et ce qu'il ne protège PAS, comment choisir un fournisseur sérieux, configurer son VPN correctement et réduire le pistage publicitaire sur ses réseaux sociaux et messageries.</p>
              <div className="book-price">16,99 €</div>
              <p className="small">PDF en français · accès immédiat après achat</p>
              <a href={ETSY_URL} target="_blank" rel="noopener noreferrer" className="btn btn-primary">Acheter sur Etsy</a>
            </div>
          </Reveal>

          <Reveal className="book-card" delay={0.25}>
            <img src={tome6Cover} alt="Couverture — Réseaux et Wi-Fi pour tous, comprendre, sécuriser et dépanner son réseau" width="400" height="400" loading="lazy" />
            <div>
              <span className="book-tag">Tome 6 — Débutant</span>
              <h2 className="mt-0">Réseaux &amp; Wi-Fi pour tous — Comprendre, sécuriser et dépanner son réseau</h2>
              <p>Les bases indispensables (IP, DHCP, DNS, passerelle) expliquées simplement, sécuriser sa box et son Wi-Fi, diagnostiquer un Wi-Fi lent ou qui coupe et isoler ses objets connectés pour plus de sécurité.</p>
              <div className="book-price">14,99 €</div>
              <p className="small">PDF en français · accès immédiat après achat</p>
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
      </>
  )
}
