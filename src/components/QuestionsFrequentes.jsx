import { Link } from 'react-router-dom'
import '../faq.css'

// Questions fréquentes : répond aux doutes avant la commande (accueil + Services).
// Les réponses suivent les CGV (articles 6, 7, 8, 9 et 11).
const QUESTIONS = [
  {
    q: 'Est-ce sûr de vous laisser accéder à mon PC ?',
    r: 'Oui. Rien ne démarre sans votre accord : une demande d’autorisation s’affiche sur votre écran. Vous voyez tout ce qui se passe en direct, et un bouton vous permet d’arrêter la session à tout moment. La connexion est chiffrée.',
  },
  {
    q: 'Et si le problème n’est pas résolu ?',
    r: 'Si la panne ne peut pas être réglée à distance (par exemple une pièce matérielle à changer) et qu’aucune intervention utile n’a été réalisée, vous êtes remboursé intégralement.',
  },
  {
    q: 'Combien de temps faut-il pour être dépanné ?',
    r: 'Après votre commande, on vous contacte par e-mail pour fixer un rendez-vous, en principe sous 5 jours ouvrés. La durée de la session dépend du problème : on vous en donne une idée avant de commencer.',
  },
  {
    q: 'Que dois-je préparer avant la session ?',
    r: 'Un PC Windows allumé et connecté à Internet, et si possible une sauvegarde de vos fichiers importants. C’est tout : on vous guide pour le reste, sans jargon.',
  },
  {
    q: 'Mes données restent-elles privées ?',
    r: 'Oui. On n’accède qu’à ce qui est nécessaire pour régler le problème, sous vos yeux. Vos informations ne sont ni vendues ni partagées, et le paiement est géré par Stripe : on n’a jamais accès à votre carte bancaire.',
  },
  {
    q: 'Le Forfait mensuel est-il vraiment sans engagement ?',
    r: 'Oui. Vous le résiliez quand vous voulez, en quelques clics depuis votre espace de facturation. Il s’arrête à la fin du mois déjà payé, sans frais. Il inclut aussi 50 Go de cloud pour sauvegarder vos fichiers.',
  },
]

export default function QuestionsFrequentes() {
  return (
    <section className="faq-bloc">
      <div className="container" style={{ maxWidth: 820 }}>
        <h2 className="section-title">Questions fréquentes</h2>
        <p className="section-sub">Les réponses aux questions qu’on nous pose le plus souvent avant un dépannage.</p>
        <div className="faq-liste">
          {QUESTIONS.map((item) => (
            <details key={item.q} className="faq-item">
              <summary>{item.q}</summary>
              <p>{item.r}</p>
            </details>
          ))}
        </div>
        <p className="faq-suite">
          Une autre question ? Posez-la sur le <Link to="/forum">forum</Link> ou <Link to="/contact">contactez-nous</Link>.
          {' '}Tous les détails sont aussi dans les <Link to="/cgv">conditions générales de vente</Link>.
        </p>
      </div>
    </section>
  )
}
