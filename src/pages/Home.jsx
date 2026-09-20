import { Link } from 'react-router-dom'
import { lazy, Suspense } from 'react'
import Reveal from '../components/Reveal.jsx'
import PcHealthCard from '../components/PcHealthCard.jsx'
import useDocumentMeta from '../hooks/useDocumentMeta.js'

const NetworkBackground = lazy(() => import('../components/NetworkBackground.jsx'))

const STRUCTURED_DATA = {
  '@context': 'https://schema.org',
  '@type': 'ProfessionalService',
  name: '3WM Service',
  url: 'https://3-wm.net/',
  email: 'service@3-wm.net',
  description:
    "Dépannage Windows à distance basé sur le consentement, ebooks pour apprendre Linux et la cybersécurité, blog de tutoriels pratiques.",
  areaServed: 'FR',
  priceRange: '€€',
  sameAs: ['https://www.etsy.com/shop/3wmService'],
}

export default function Home() {
  useDocumentMeta(
    null,
    "Dépannage Windows à distance basé sur le consentement, ebooks pour apprendre Linux et la cybersécurité, blog de tutoriels pratiques. Devis gratuit.",
    '/',
    STRUCTURED_DATA
  )

  return (
    <>
      <section className="hero">
        <Suspense fallback={null}>
          <NetworkBackground />
        </Suspense>
        <div className="container hero-grid">
          <div>
            <p className="eyebrow eyebrow-ps">3WM Service — Assistance Windows</p>
            <h1>Dépannage Windows à distance, simple et rassurant</h1>
            <p className="lead">
              Un PC lent, un virus, une mise à jour qui bloque ? Assistance à distance basée sur le
              consentement pour votre PC Windows — et, pour les curieux, des ebooks pour apprendre
              Linux et la cybersécurité.
            </p>
            <div className="btn-row">
              <Link to="/services" className="btn btn-primary">Voir les formules de dépannage</Link>
              <Link to="/boutique" className="btn btn-outline">Découvrir les ebooks Linux</Link>
            </div>
          </div>
          <PcHealthCard />
        </div>
      </section>

      <section className="alt">
        <div className="container">
          <Reveal as="h2" className="section-title">Ce que propose 3WM Service</Reveal>
          <Reveal as="p" className="section-sub" delay={0.05}>
            Trois façons de progresser : se faire dépanner, apprendre par soi-même, ou suivre les tutoriels du blog.
          </Reveal>
          <div className="grid grid-3">
            <Reveal className="card" delay={0}>
              <svg className="icon" aria-hidden="true" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round">
                <circle cx="12" cy="12" r="9"></circle>
                <path d="M8.5 12.5l2.3 2.3L16 10"></path>
              </svg>
              <h3>Dépannage Windows à distance</h3>
              <p>PC lent, virus, mise à jour Windows qui bloque, imprimante ou Wi-Fi capricieux… Assistance basée sur le consentement explicite : rien ne se passe sur votre machine sans votre accord.</p>
              <p><Link to="/services">Voir les formules →</Link></p>
            </Reveal>
            <Reveal className="card" delay={0.08}>
              <svg className="icon" aria-hidden="true" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round">
                <path d="M2 4.5h6a4 4 0 014 4v13a3 3 0 00-3-3H2z"></path>
                <path d="M22 4.5h-6a4 4 0 00-4 4v13a3 3 0 013-3h7z"></path>
              </svg>
              <h3>Ebooks Linux &amp; cybersécurité</h3>
              <p>Deux tomes pour découvrir Linux, poser des bases solides en cybersécurité, puis progresser vers Kali Linux et la méthodologie de pentest.</p>
              <p><Link to="/boutique">Voir les ebooks →</Link></p>
            </Reveal>
            <Reveal className="card" delay={0.16}>
              <svg className="icon" aria-hidden="true" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round">
                <path d="M4 19.5V17l10-10 2.5 2.5-10 10H4z"></path>
                <path d="M13.5 8L16 5.5 18.5 8 16 10.5z"></path>
              </svg>
              <h3>Blog &amp; tutoriels</h3>
              <p>Des articles pratiques sur Linux, la sécurité informatique et les outils utiles au quotidien, écrits pour être compris sans jargon inutile.</p>
              <p><Link to="/blog">Lire le blog →</Link></p>
            </Reveal>
          </div>
        </div>
      </section>

      <section>
        <div className="container center">
          <Reveal as="h2" className="section-title">Un souci sur votre PC Windows, maintenant ?</Reveal>
          <Reveal as="p" className="section-sub" delay={0.05}>
            Décrivez votre souci via le formulaire de contact et 3WM Service revient vers vous avec une formule adaptée.
          </Reveal>
          <Reveal delay={0.1}>
            <Link to="/contact" className="btn btn-primary">Demander de l'aide</Link>
          </Reveal>
        </div>
      </section>
    </>
  )
}
