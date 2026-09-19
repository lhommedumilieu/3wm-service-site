import { Link } from 'react-router-dom'
import Reveal from '../components/Reveal.jsx'
import useDocumentMeta from '../hooks/useDocumentMeta.js'

export default function Services() {
  useDocumentMeta(
    'Dépannage Windows à distance',
    "Formules de dépannage Windows à distance dès 29 € : PC lent, virus, Windows Update bloqué, imprimante, Wi-Fi. Session basée sur le consentement explicite.",
    '/services'
  )

  return (
    <>
      <div className="page-header">
        <div className="container">
          <p className="eyebrow eyebrow-ps">Assistance Windows à distance</p>
          <h1>Dépannage Windows à distance</h1>
          <p>Une assistance basée sur le consentement explicite : rien ne démarre sans votre accord, et vous gardez à tout moment le contrôle de la session.</p>
        </div>
      </div>

      <section>
        <div className="container">
          <h2 className="section-title">Comment ça se passe</h2>
          <div className="grid grid-3">
            <Reveal className="card">
              <h3>1. Vous décrivez le problème</h3>
              <p>Via le <Link to="/contact">formulaire de contact</Link>, expliquez ce qui ne va pas sur votre PC Windows. Vous recevez une réponse avec la formule la plus adaptée.</p>
            </Reveal>
            <Reveal className="card" delay={0.08}>
              <h3>2. Session à distance</h3>
              <p>Une fois d'accord, une session d'assistance est lancée sur votre PC Windows. Vous voyez tout ce qui se passe et pouvez l'interrompre instantanément.</p>
            </Reveal>
            <Reveal className="card" delay={0.16}>
              <h3>3. Problème résolu</h3>
              <p>Diagnostic, correction et explications claires sur ce qui a été fait — pour éviter que le souci ne revienne.</p>
            </Reveal>
          </div>
        </div>
      </section>

      <section>
        <div className="container">
          <h2 className="section-title">Les pannes Windows les plus fréquentes</h2>
          <p className="section-sub">Si vous reconnaissez l'un de ces soucis, c'est le bon endroit.</p>
          <div className="grid grid-3">
            <Reveal className="card">
              <h3>Lenteur &amp; démarrage</h3>
              <p className="small">PC qui rame, démarrage interminable, programmes qui se lancent tout seuls.</p>
            </Reveal>
            <Reveal className="card" delay={0.06}>
              <h3>Virus &amp; sécurité</h3>
              <p className="small">Suspicion de virus, pop-up publicitaires, antivirus à configurer.</p>
            </Reveal>
            <Reveal className="card" delay={0.12}>
              <h3>Windows Update</h3>
              <p className="small">Mise à jour bloquée, écran bleu après une mise à jour, Windows qui ne démarre plus.</p>
            </Reveal>
            <Reveal className="card" delay={0.18}>
              <h3>Imprimante &amp; périphériques</h3>
              <p className="small">Imprimante non détectée, pilotes manquants, périphérique USB qui ne fonctionne pas.</p>
            </Reveal>
            <Reveal className="card" delay={0.24}>
              <h3>Wi-Fi &amp; réseau</h3>
              <p className="small">Connexion instable, Wi-Fi qui se déconnecte, partage de fichiers entre PC.</p>
            </Reveal>
            <Reveal className="card" delay={0.3}>
              <h3>Emails &amp; logiciels</h3>
              <p className="small">Configuration d'Outlook ou Mail, installation et dépannage de logiciels du quotidien.</p>
            </Reveal>
          </div>
        </div>
      </section>

      <section className="alt">
        <div className="container">
          <h2 className="section-title">Nos formules</h2>
          <p className="section-sub">Des tarifs simples, sans surprise. Paiement précisé lors de la prise de contact.</p>
          <div className="grid grid-4">
            <Reveal className="card">
              <h3>Dépannage ponctuel</h3>
              <p className="small">1 problème identifié</p>
              <div className="price">29 €</div>
              <p className="small">Idéal pour un souci précis sur Windows : PC lent, virus, écran bleu, panne logicielle, configuration.</p>
            </Reveal>
            <Reveal className="card" delay={0.06}>
              <h3>Dépannage approfondi</h3>
              <p className="small">Plusieurs problèmes</p>
              <div className="price">49 €</div>
              <p className="small">Pour un PC Windows qui cumule plusieurs soucis (mises à jour, pilotes, imprimante, Wi-Fi…) à traiter dans la même session.</p>
            </Reveal>
            <Reveal className="card" delay={0.12}>
              <h3>Forfait mensuel</h3>
              <p className="small">Assistance illimitée</p>
              <div className="price">19 € <small>/mois</small></div>
              <p className="small">Pour ceux qui veulent une assistance Windows récurrente sans compter les sessions.</p>
            </Reveal>
            <Reveal className="card" delay={0.18}>
              <h3>Pack entreprise</h3>
              <p className="small">Plusieurs postes</p>
              <div className="price">79 €</div>
              <p className="small">Pour les petites structures avec plusieurs postes Windows à suivre.</p>
            </Reveal>
          </div>
          <p className="center" style={{ marginTop: 32 }}>
            <Link to="/contact" className="btn btn-primary">Demander un dépannage</Link>
          </p>
        </div>
      </section>

      <section>
        <div className="container">
          <h2 className="section-title">Le logiciel utilisé</h2>
          <p className="section-sub">La confiance et la transparence avant tout.</p>
          <Reveal className="card" style={{ maxWidth: 720, margin: '0 auto' }}>
            <p>Les sessions d'assistance reposent sur un principe simple : <strong>rien ne se passe sans consentement explicite et visible</strong>.</p>
            <ul>
              <li>Avant toute chose, une demande d'autorisation claire s'affiche sur votre écran.</li>
              <li>Une bannière reste visible pendant toute la session, avec un bouton pour tout arrêter immédiatement.</li>
              <li>Le trafic de la session est chiffré de bout en bout.</li>
            </ul>
            <p className="small">Pour un usage professionnel ou répété, des outils établis et audités (RustDesk, AnyDesk, TeamViewer) peuvent également être utilisés selon le cas.</p>
          </Reveal>
        </div>
      </section>
    </>
  )
}
