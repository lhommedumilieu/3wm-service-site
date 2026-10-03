import { Link } from 'react-router-dom'
import Reveal from '../components/Reveal.jsx'
import NewsletterSignup from '../components/NewsletterSignup.jsx'
import IllustrationDepannage from '../components/IllustrationDepannage.jsx'
import useDocumentMeta from '../hooks/useDocumentMeta.js'

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

const CONFIANCE = [
  { ico: '🤝', titre: 'Rien sans votre accord', texte: "Une demande d'autorisation claire s'affiche avant chaque session." },
  { ico: '🛑', titre: 'Vous gardez la main', texte: 'Un bouton pour tout arrêter, à tout moment.' },
  { ico: '🔒', titre: 'Session chiffrée', texte: 'Le trafic est chiffré de bout en bout.' },
  { ico: '💶', titre: 'Tarifs simples', texte: 'Dès 29 €, sans mauvaise surprise.' },
]

const ETAPES = [
  { titre: 'Vous décrivez le problème', texte: 'Via le formulaire de contact, expliquez ce qui ne va pas sur votre PC. Vous recevez la formule la plus adaptée.' },
  { titre: 'Session à distance', texte: "Une fois d'accord, la session démarre. Vous voyez tout ce qui se passe et pouvez l'interrompre instantanément." },
  { titre: 'Problème résolu', texte: 'Diagnostic, correction et explications claires sur ce qui a été fait, pour éviter que le souci ne revienne.' },
]

const PANNES = [
  { emo: '🐢', titre: 'PC lent ou démarrage interminable', texte: 'Programmes qui se lancent tout seuls, PC qui rame.' },
  { emo: '🦠', titre: 'Virus et sécurité', texte: 'Pop-up publicitaires, suspicion de virus.' },
  { emo: '🔄', titre: 'Windows Update bloqué', texte: 'Mise à jour qui plante, écran bleu.' },
  { emo: '🖨️', titre: 'Imprimante et périphériques', texte: 'Imprimante non détectée, pilotes manquants.' },
  { emo: '📶', titre: 'Wi-Fi et réseau', texte: 'Connexion instable, partage de fichiers.' },
  { emo: '✉️', titre: 'E-mails et logiciels', texte: "Outlook, Mail, installation de logiciels du quotidien." },
]

const FORMULES = [
  { nom: 'Dépannage ponctuel', prix: '29 €', detail: '1 problème identifié' },
  { nom: 'Dépannage approfondi', prix: '49 €', detail: 'Plusieurs problèmes dans la même session' },
  { nom: 'Forfait mensuel', prix: '19 €', suffixe: '/mois', detail: 'Assistance illimitée' },
  { nom: 'Pack entreprise', prix: '79 €', detail: 'Plusieurs postes Windows' },
]

export default function Home() {
  useDocumentMeta(
    null,
    "Dépannage Windows à distance basé sur le consentement, ebooks pour apprendre Linux et la cybersécurité, blog de tutoriels pratiques. Devis gratuit.",
    '/',
    STRUCTURED_DATA
  )

  return (
    <>
      <section className="hero-split">
        <div className="container hero-split-grid">
          <div>
            <p className="eyebrow">Dépannage Windows à distance</p>
            <h1>
              Votre PC Windows pose problème ? On le <span className="hl">répare à distance</span>, simplement.
            </h1>
            <p className="lead">
              Un PC lent, un virus, une mise à jour qui bloque ? Je prends la main sur votre ordinateur
              avec votre accord, vous regardez tout en direct, et je vous explique ce qui a été fait.
            </p>
            <ul className="hero-points">
              <li>Rien ne démarre sans votre autorisation</li>
              <li>Vous pouvez tout arrêter d'un clic</li>
              <li>Aucun déplacement, depuis votre canapé</li>
            </ul>
            <div className="btn-row">
              <Link to="/contact" className="btn btn-primary btn-lg">Demander de l'aide</Link>
              <Link to="/services" className="btn btn-outline btn-lg">Voir les tarifs</Link>
            </div>
            <p className="hero-note">À partir de 29 € · Paiement précisé lors de la prise de contact</p>
          </div>

          <div className="hero-art">
            <IllustrationDepannage />
            <span className="chip chip-1"><i></i>Session chiffrée</span>
            <span className="chip chip-2"><i></i>Vous gardez le contrôle</span>
            <span className="chip chip-3"><i></i>Rien sans votre accord</span>
          </div>
        </div>
      </section>

      <section className="trust">
        <div className="container">
          <div className="trust-grid">
            {CONFIANCE.map((c) => (
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

      <section>
        <div className="container">
          <Reveal as="h2" className="section-title">Comment ça se passe</Reveal>
          <Reveal as="p" className="section-sub" delay={0.05}>
            Trois étapes, sans jargon et sans prise de tête.
          </Reveal>
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
          <Reveal as="h2" className="section-title">Les pannes que je règle le plus souvent</Reveal>
          <Reveal as="p" className="section-sub" delay={0.05}>
            Si vous vous reconnaissez dans l'une d'elles, vous êtes au bon endroit.
          </Reveal>
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

      <section>
        <div className="container">
          <Reveal as="h2" className="section-title">Des tarifs clairs</Reveal>
          <Reveal as="p" className="section-sub" delay={0.05}>
            Pas de devis compliqué : vous savez ce que vous payez avant que ça commence.
          </Reveal>
          <div className="price-grid">
            {FORMULES.map((f, i) => (
              <Reveal className="card price-card" delay={i * 0.06} key={f.nom}>
                <h3>{f.nom}</h3>
                <p className="big">{f.prix}{f.suffixe && <small> {f.suffixe}</small>}</p>
                <p className="small">{f.detail}</p>
              </Reveal>
            ))}
          </div>
          <p className="center" style={{ marginTop: 32 }}>
            <Link to="/services" className="btn btn-outline">Voir le détail des formules</Link>
          </p>
        </div>
      </section>

      <section className="alt">
        <div className="container">
          <Reveal as="h2" className="section-title">Vos données ont-elles fuité ?</Reveal>
          <Reveal as="p" className="section-sub" delay={0.05}>
            Deux outils gratuits pour savoir si vos informations circulent après un piratage de site.
          </Reveal>
          <div className="grid grid-2">
            <Reveal className="card" delay={0}>
              <h3 className="mt-0">Mon mot de passe est-il compromis ?</h3>
              <p>Testez un mot de passe en quelques secondes, sans compte. Il reste dans votre navigateur : seuls 5 caractères d'une empreinte sont envoyés au service de vérification.</p>
              <p><Link to="/verifier-mot-de-passe">Tester un mot de passe →</Link></p>
            </Reveal>
            <Reveal className="card" delay={0.08}>
              <h3 className="mt-0">Mon adresse e-mail a-t-elle fuité ?</h3>
              <p>Avec un compte gratuit, vérifiez si l'adresse de votre compte apparaît dans des fuites connues, et quelles données ont été exposées.</p>
              <p><Link to="/espace-membre">Vérifier mon adresse e-mail →</Link></p>
            </Reveal>
          </div>
          <Reveal as="p" className="small center" delay={0.12} style={{ marginTop: 20 }}>
            Pas sûr de ce que ça change pour vous ? Lisez{' '}
            <Link to="/blog/mot-de-passe-email-fuite-que-faire">notre guide : que faire si vos données ont fuité</Link>.
          </Reveal>
        </div>
      </section>

      <section>
        <div className="container">
          <Reveal as="h2" className="section-title">Pour apprendre par vous-même</Reveal>
          <Reveal as="p" className="section-sub" delay={0.05}>
            Envie de comprendre plutôt que de déléguer ? Des ebooks et des tutoriels pour progresser à votre rythme.
          </Reveal>
          <div className="grid grid-2">
            <Reveal className="card" delay={0}>
              <h3 className="mt-0">Ebooks Linux &amp; cybersécurité</h3>
              <p>Des guides pour découvrir Linux, poser des bases solides en cybersécurité, puis progresser vers Kali Linux et la méthodologie de pentest.</p>
              <p><Link to="/boutique">Voir les ebooks →</Link></p>
            </Reveal>
            <Reveal className="card" delay={0.08}>
              <h3 className="mt-0">Blog &amp; tutoriels</h3>
              <p>Des articles pratiques sur Linux, la sécurité informatique et les outils utiles au quotidien, écrits pour être compris sans jargon inutile.</p>
              <p><Link to="/blog">Lire le blog →</Link></p>
            </Reveal>
          </div>
        </div>
      </section>

      <section style={{ paddingTop: 0 }}>
        <div className="container">
          <Reveal className="cta-band">
            <h2>Un souci sur votre PC Windows, maintenant ?</h2>
            <p>Décrivez-le via le formulaire de contact : je reviens vers vous avec la formule adaptée, avant toute intervention.</p>
            <Link to="/contact" className="btn btn-primary btn-lg">Demander de l'aide</Link>
          </Reveal>
        </div>
      </section>

      <section className="alt">
        <div className="container" style={{ maxWidth: 720 }}>
          <NewsletterSignup source="home" />
        </div>
      </section>
    </>
  )
}
