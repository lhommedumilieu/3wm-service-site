import { Link } from 'react-router-dom'
import useDocumentMeta from '../hooks/useDocumentMeta.js'
import { PORTAIL_CLIENT_URL, VENDEUR } from '../lib/boutique.js'
import '../promo.css'

export default function CommandeMerci() {
  useDocumentMeta('Merci pour votre commande', 'Confirmation de commande 3WM Service.', '/commande/merci')
  return (
    <section className="page-hero page-hero-simple">
      <div className="container" style={{ maxWidth: 760 }}>
        <p className="eyebrow">Commande confirmée</p>
        <h1>Merci, votre paiement <span className="hl">est bien reçu</span> !</h1>
        <p className="lead">
          Vous allez recevoir par e-mail votre reçu et votre facture. Je vous contacte très vite à l’adresse indiquée
          pour fixer ensemble le moment de la session à distance.
        </p>
        <div className="card" style={{ marginTop: 24 }}>
          <ol className="mini-steps">
            <li>Gardez votre PC Windows allumé et connecté à Internet le jour de la session.</li>
            <li>Au début, une demande d’autorisation s’affiche sur votre écran : rien ne démarre sans votre accord.</li>
            <li>Vous pouvez tout arrêter d’un clic à tout moment.</li>
          </ol>
          <p className="small">
            Factures, carte bancaire ou résiliation du forfait mensuel : <a href={PORTAIL_CLIENT_URL} target="_blank" rel="noopener noreferrer">votre espace de facturation</a>.
            Une question ? <a href={`mailto:${VENDEUR.email}`}>{VENDEUR.email}</a>
          </p>
        </div>
        <div className="guide-aide">
          <span aria-hidden="true">☁️</span>
          <p>
            <strong>Vous avez choisi le Forfait mensuel ?</strong> Votre espace de cloud de 50 Go est déjà créé :
            vous allez recevoir un e-mail « Bienvenue » pour choisir votre mot de passe.{' '}
            <Link to="/guide-cloud">Suivez le guide du cloud</Link> pour bien démarrer.
          </p>
        </div>
        <p style={{ marginTop: 24 }}><Link to="/" className="btn btn-outline">Retour à l’accueil</Link></p>
      </div>
    </section>
  )
}
