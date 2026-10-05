import { Link } from 'react-router-dom'
import Reveal from '../components/Reveal.jsx'
import IllustrationDepannage from '../components/IllustrationDepannage.jsx'
import useDocumentMeta from '../hooks/useDocumentMeta.js'
import { VENTE_ACTIVE } from '../lib/boutique.js'

const STRUCTURED_DATA = {
  '@context': 'https://schema.org',
  '@type': 'Service',
  serviceType: 'Dépannage informatique à distance',
  provider: {
    '@type': 'ProfessionalService',
    name: '3WM Service',
    url: 'https://3-wm.net/',
    email: 'service@3-wm.net',
  },
  areaServed: 'FR',
  offers: [
    { '@type': 'Offer', name: 'Dépannage ponctuel', price: '29', priceCurrency: 'EUR', description: '1 problème identifié' },
    { '@type': 'Offer', name: 'Dépannage approfondi', price: '49', priceCurrency: 'EUR', description: 'Plusieurs problèmes traités dans la même session' },
    { '@type': 'Offer', name: 'Forfait mensuel', price: '19', priceCurrency: 'EUR', description: 'Assistance illimitée + 50 Go de cloud, par mois' },
    { '@type': 'Offer', name: 'Pack entreprise', price: '149', priceCurrency: 'EUR', description: 'Intervention pour les entreprises, jusqu’à 3 postes Windows, puis sur devis' },
  ],
}

const ETAPES = [
  {
    titre: 'Vous décrivez le problème',
    texte: (
      <>
        Via le <Link to="/contact">formulaire de contact</Link>, expliquez ce qui ne va pas sur votre PC Windows.
        Vous recevez une réponse avec la formule la plus adaptée.
      </>
    ),
  },
  { titre: 'Session à distance', texte: "Une fois d'accord, une session d'assistance est lancée sur votre PC Windows. Vous voyez tout ce qui se passe et pouvez l'interrompre instantanément." },
  { titre: 'Problème résolu', texte: 'Diagnostic, correction et explications claires sur ce qui a été fait, pour éviter que le souci ne revienne.' },
]

const PANNES = [
  { emo: '🐢', titre: 'Lenteur et démarrage', texte: 'PC qui rame, démarrage interminable, programmes qui se lancent tout seuls.' },
  { emo: '🦠', titre: 'Virus et sécurité', texte: 'Suspicion de virus, pop-up publicitaires, antivirus à configurer.' },
  { emo: '🔄', titre: 'Windows Update', texte: 'Mise à jour bloquée, écran bleu après une mise à jour, Windows qui ne démarre plus.' },
  { emo: '🖨️', titre: 'Imprimante et périphériques', texte: 'Imprimante non détectée, pilotes manquants, périphérique USB qui ne fonctionne pas.' },
  { emo: '📶', titre: 'Wi-Fi et réseau', texte: 'Connexion instable, Wi-Fi qui se déconnecte, partage de fichiers entre PC.' },
  { emo: '✉️', titre: 'E-mails et logiciels', texte: "Configuration d'Outlook ou Mail, installation et dépannage de logiciels du quotidien." },
]

const FORMULES = [
  { cle: 'ponctuel', nom: 'Dépannage ponctuel', sous: '1 problème identifié', prix: '29 €', texte: 'Idéal pour un souci précis sur Windows : PC lent, virus, écran bleu, panne logicielle, configuration.' },
  { cle: 'approfondi', nom: 'Dépannage approfondi', sous: 'Plusieurs problèmes', prix: '49 €', texte: 'Pour un PC Windows qui cumule plusieurs soucis (mises à jour, pilotes, imprimante, Wi-Fi…) à traiter dans la même session.' },
  { cle: 'mensuel', nom: 'Forfait mensuel', sous: 'Assistance illimitée + 50 Go de cloud', prix: '19 €', suffixe: '/mois', texte: 'Pour ceux qui veulent une assistance Windows récurrente sans compter les sessions, avec 50 Go de stockage en ligne sauvegardé chaque nuit pour mettre leurs fichiers à l’abri.' },
  { nom: 'Pack entreprise', sous: 'Jusqu’à 3 postes, puis sur devis', prix: 'Dès 149 €', texte: 'Remise à niveau des postes Windows de votre structure : nettoyage, mises à jour, sécurité et sauvegardes. Au-delà de 3 postes, devis gratuit.' },
]

const GARANTIES = [
  { ico: '🤝', titre: 'Une autorisation claire', texte: "Avant toute chose, une demande d'autorisation s'affiche sur votre écran." },
  { ico: '🛑', titre: 'Un bouton pour tout arrêter', texte: 'Une bannière reste visible pendant toute la session, avec un bouton pour tout interrompre immédiatement.' },
  { ico: '🔒', titre: 'Une session chiffrée', texte: 'Le trafic de la session est chiffré de bout en bout.' },
]

export default function Services() {
  useDocumentMeta(
    'Dépannage Windows à distance',
    "Formules de dépannage Windows à distance dès 29 € : PC lent, virus, Windows Update bloqué, imprimante, Wi-Fi. Session basée sur le consentement explicite.",
    '/services',
    STRUCTURED_DATA
  )

  return (
    <>
      <section className="page-hero">
        <div className="container page-hero-grid">
          <div>
            <p className="eyebrow">Assistance Windows à distance</p>
            <h1>
              Dépannage Windows <span className="hl">à distance</span>
            </h1>
            <p className="lead">
              Une assistance basée sur le consentement explicite : rien ne démarre sans votre accord, et vous
              gardez à tout moment le contrôle de la session.
            </p>
            <div className="btn-row">
              <Link to="/contact" className="btn btn-primary btn-lg">Demander un dépannage</Link>
              <a href="#formules" className="btn btn-outline btn-lg">Voir les formules</a>
            </div>
          </div>
          <div className="hero-art page-hero-art">
            <IllustrationDepannage />
          </div>
        </div>
      </section>

      <section>
        <div className="container">
          <Reveal as="h2" className="section-title">Comment ça se passe</Reveal>
          <Reveal as="p" className="section-sub" delay={0.05}>Trois étapes, sans jargon et sans prise de tête.</Reveal>
          <div className="grid grid-3 steps">
            {ETAPES.map((e, i) => (
              <Reveal className="card step-card" delay={i * 0.08} key={e.titre}>
                <h3>{e.titre}</h3>
                <p>{e.texte}</p>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      <section className="alt">
        <div className="container">
          <Reveal as="h2" className="section-title">Les pannes Windows les plus fréquentes</Reveal>
          <Reveal as="p" className="section-sub" delay={0.05}>Si vous reconnaissez l'un de ces soucis, c'est le bon endroit.</Reveal>
          <div className="problem-grid">
            {PANNES.map((p, i) => (
              <Reveal className="problem" delay={i * 0.05} key={p.titre}>
                <span className="emo" aria-hidden="true">{p.emo}</span>
                <span>
                  {p.titre}
                  <small>{p.texte}</small>
                </span>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      <section id="formules">
        <div className="container">
          <Reveal as="h2" className="section-title">Nos formules</Reveal>
          <Reveal as="p" className="section-sub" delay={0.05}>{VENTE_ACTIVE ? 'Des tarifs simples, sans surprise. Commandez et payez en ligne en toute sécurité.' : 'Des tarifs simples, sans surprise. Paiement précisé lors de la prise de contact.'}</Reveal>
          <div className="price-grid">
            {FORMULES.map((f, i) => (
              <Reveal className="card price-card" delay={i * 0.06} key={f.nom}>
                <h3>{f.nom}</h3>
                <p className="small price-sub">{f.sous}</p>
                <p className="big">{f.prix}{f.suffixe && <small> {f.suffixe}</small>}</p>
                <p className="small">{f.texte}</p>
                {VENTE_ACTIVE && (f.cle ? (
                  <Link to={`/commander/${f.cle}`} className="btn btn-primary prix-commander">Commander</Link>
                ) : (
                  <Link to="/contact" className="btn btn-outline prix-commander">Demander un devis</Link>
                ))}
              </Reveal>
            ))}
          </div>
          <p className="center" style={{ marginTop: 32 }}>
            <Link to="/contact" className="btn btn-primary btn-lg">Demander un dépannage</Link>
          </p>
        </div>
      </section>

      <section className="alt">
        <div className="container">
          <Reveal as="h2" className="section-title">Le logiciel utilisé</Reveal>
          <Reveal as="p" className="section-sub" delay={0.05}>
            La confiance et la transparence avant tout : rien ne se passe sans consentement explicite et visible.
          </Reveal>
          <div className="grid grid-3">
            {GARANTIES.map((g, i) => (
              <Reveal className="card garantie" delay={i * 0.08} key={g.titre}>
                <span className="trust-ico" aria-hidden="true">{g.ico}</span>
                <h3>{g.titre}</h3>
                <p>{g.texte}</p>
              </Reveal>
            ))}
          </div>
          <Reveal as="p" className="small center note-centre" delay={0.1}>
            Pour un usage professionnel ou répété, des outils établis et audités (RustDesk, AnyDesk, TeamViewer)
            peuvent également être utilisés selon le cas.
          </Reveal>
        </div>
      </section>

      <section style={{ paddingTop: 0 }}>
        <div className="container">
          <Reveal className="cta-band">
            <h2>Un souci sur votre PC Windows ?</h2>
            <p>Décrivez-le via le formulaire de contact : je reviens vers vous avec la formule adaptée, avant toute intervention.</p>
            <Link to="/contact" className="btn btn-primary btn-lg">Demander de l'aide</Link>
          </Reveal>
        </div>
      </section>
    </>
  )
}
