import { Link } from 'react-router-dom'
import Reveal from '../components/Reveal.jsx'
import tome1Cover from '../assets/images/tome1-cover.jpg'
import tome2Cover from '../assets/images/tome2-cover.jpg'
import tome3Cover from '../assets/images/tome3-cover.jpg'
import tome4Cover from '../assets/images/tome4-cover.jpg'
import tome5Cover from '../assets/images/tome5-cover.jpg'
import tome6Cover from '../assets/images/tome6-cover.jpg'
import useDocumentMeta from '../hooks/useDocumentMeta.js'
import { trackEvent } from '../lib/analytics.js'

const ETSY_URL = 'https://www.etsy.com/shop/3wmService'

function absoluteUrl(path) {
  if (typeof window === 'undefined') return path
  try {
    return new URL(path, window.location.origin).href
  } catch {
    return path
  }
}

const LIVRES = [
  { id: 'tome1', cover: tome1Cover, niveau: 'Tome 1 · Débutant', titre: 'Linux pour débutants — Fondamentaux cybersécurité', alt: 'Linux pour débutants, fondamentaux cybersécurité', texte: 'Le point de départ idéal pour découvrir Linux et poser de vraies bases en cybersécurité, sans jargon inutile. Installation, ligne de commande, sécurité de base : tout pour bien commencer.', prix: '14,99 €', format: 'PDF en français et en anglais inclus · accès immédiat après achat' },
  { id: 'tome2', cover: tome2Cover, niveau: 'Tome 2 · Intermédiaire', titre: 'Kali Linux & Méthodologie Pentest', alt: 'Kali Linux & Méthodologie Pentest', texte: 'La suite avancée du Tome 1 : découverte de Kali Linux, méthodologie de pentest étape par étape (reconnaissance, scan, exploitation, reporting) et bonnes pratiques éthiques.', prix: '19,90 €', format: 'PDF en français et en anglais inclus · accès immédiat après achat' },
  { id: 'tome3', cover: tome3Cover, niveau: 'Tome 3 · Intermédiaire', titre: 'Windows avancé — Sécurité, optimisation et dépannage professionnel', alt: 'Windows avancé, sécurité, optimisation et dépannage professionnel', texte: 'Sécuriser Windows en profondeur, optimiser les performances et le démarrage, automatiser avec PowerShell et le Planificateur de tâches, et diagnostiquer méthodiquement les pannes courantes grâce à une étude de cas complète.', prix: '19,90 €', format: 'PDF en français · accès immédiat après achat' },
  { id: 'tome4', cover: tome4Cover, niveau: 'Tome 4 · Avancé', titre: 'Cybersécurité avancée — Audit, hardening et réponse à incident', alt: 'Cybersécurité avancée, audit, hardening et réponse à incident', texte: 'La suite directe du Tome 2 : mener un audit de sécurité méthodique, durcir (hardening) un système et un réseau, structurer une réponse à incident et réaliser un mini-audit de sécurité sur sa propre installation.', prix: '24,90 €', format: 'PDF en français · accès immédiat après achat' },
  { id: 'tome5', cover: tome5Cover, niveau: 'Tome 5 · Débutant / Intermédiaire', titre: 'VPN & vie privée en ligne — Comprendre, choisir et agir concrètement', alt: 'VPN et vie privée en ligne, comprendre, choisir et agir concrètement', texte: "Comment fonctionne réellement un VPN et ce qu'il ne protège PAS, comment choisir un fournisseur sérieux, configurer son VPN correctement et réduire le pistage publicitaire sur ses réseaux sociaux et messageries.", prix: '16,99 €', format: 'PDF en français · accès immédiat après achat' },
  { id: 'tome6', cover: tome6Cover, niveau: 'Tome 6 · Débutant', titre: 'Réseaux & Wi-Fi pour tous — Comprendre, sécuriser et dépanner son réseau', alt: 'Réseaux et Wi-Fi pour tous, comprendre, sécuriser et dépanner son réseau', texte: 'Les bases indispensables (IP, DHCP, DNS, passerelle) expliquées simplement, sécuriser sa box et son Wi-Fi, diagnostiquer un Wi-Fi lent ou qui coupe et isoler ses objets connectés pour plus de sécurité.', prix: '14,99 €', format: 'PDF en français · accès immédiat après achat' },
]

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
      <section className="page-hero page-hero-simple">
        <div className="container">
          <p className="eyebrow">Boutique</p>
          <h1>
            Nos ebooks <span className="hl">Linux, Windows &amp; cybersécurité</span>
          </h1>
          <p className="lead">
            Écrits par L'Homme-du-Milieu. PDF en français, accès immédiat après achat. Disponibles sur notre
            boutique Etsy 3wmService.
          </p>
          <div className="page-hero-tags">
            <span>📘 6 ebooks</span>
            <span>⚡ Accès immédiat</span>
            <span>🇫🇷 En français</span>
          </div>
        </div>
      </section>

      <section>
        <div className="container book-list">
          {LIVRES.map((l, i) => (
            <Reveal className="book-card" delay={i === 0 ? 0 : 0.08} key={l.id}>
              <img
                src={l.cover}
                alt={`Couverture — ${l.alt}`}
                width="400"
                height="400"
                loading={i === 0 ? undefined : 'lazy'}
              />
              <div>
                <span className="book-tag">{l.niveau}</span>
                <h2 className="mt-0">{l.titre}</h2>
                <p>{l.texte}</p>
                <div className="book-buy">
                  <div>
                    <div className="book-price">{l.prix}</div>
                    <p className="small" style={{ margin: 0 }}>{l.format}</p>
                  </div>
                  <a
                    href={ETSY_URL}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="btn btn-primary"
                    onClick={() => trackEvent('etsy_click', l.id)}
                  >
                    Acheter sur Etsy
                  </a>
                </div>
              </div>
            </Reveal>
          ))}
        </div>
      </section>

      <section style={{ paddingTop: 0 }}>
        <div className="container">
          <Reveal className="cta-band cta-soft">
            <h2>Une question avant d'acheter ?</h2>
            <p>Écrivez-nous, nous répondons rapidement.</p>
            <Link to="/contact" className="btn btn-primary btn-lg">Contacter 3WM Service</Link>
          </Reveal>
        </div>
      </section>
    </>
  )
}
