import { Link } from 'react-router-dom'
import useDocumentMeta from '../hooks/useDocumentMeta.js'
import { VENDEUR } from '../lib/boutique.js'
import '../promo.css'

const CLOUD = 'https://cloud.3-wm.net'

function Etape({ n, titre, children }) {
  return (
    <section className="card guide-etape" aria-labelledby={`etape-${n}`}>
      <span className="guide-num" aria-hidden="true">{n}</span>
      <div>
        <h2 id={`etape-${n}`}>{titre}</h2>
        {children}
      </div>
    </section>
  )
}

const FAQ = [
  {
    q: 'Je n’ai pas reçu l’e-mail de bienvenue',
    r: 'Regardez dans vos courriers indésirables (spam). Il arrive en quelques minutes après le paiement, de la part de service@3-wm.net. Toujours rien ? Écrivez-moi, je vous le renvoie.',
  },
  {
    q: 'J’ai oublié mon mot de passe',
    r: `Sur ${CLOUD.replace('https://', '')}, cliquez sur « Mot de passe oublié ? » et indiquez votre adresse e-mail : vous recevez un lien pour en choisir un nouveau.`,
  },
  {
    q: 'Comment savoir combien de place il me reste ?',
    r: 'Dans « Fichiers », l’espace utilisé est indiqué en bas à gauche (par exemple « 3,2 Go sur 50 Go »). Quand les 50 Go sont atteints, l’ajout de nouveaux fichiers est bloqué : il suffit d’en supprimer.',
  },
  {
    q: 'Mes fichiers sont-ils en sécurité ?',
    r: 'Ils sont stockés en France, sur un serveur que je gère moi-même, et sauvegardés chaque nuit (14 jours d’historique). Je n’ouvre pas vos fichiers, sauf si vous me le demandez. Pensez quand même à garder une copie de vos documents les plus précieux ailleurs.',
  },
  {
    q: 'Que deviennent mes fichiers si je résilie ?',
    r: 'Votre compte est désactivé à la fin du mois déjà payé. Vos fichiers sont gardés 30 jours : vous pouvez vous réabonner pour tout retrouver, ou me demander une copie. Ensuite, ils sont supprimés définitivement.',
  },
]

export default function GuideCloud() {
  useDocumentMeta(
    'Guide du cloud',
    'Activer et utiliser votre espace de stockage en ligne de 50 Go inclus dans le Forfait mensuel : web, PC Windows et téléphone.',
    '/guide-cloud'
  )

  return (
    <>
      <section className="page-hero page-hero-simple">
        <div className="container" style={{ maxWidth: 820 }}>
          <p className="eyebrow">Forfait mensuel · 50 Go de cloud</p>
          <h1>Guide du cloud : <span className="hl">prise en main</span></h1>
          <p className="lead">
            Votre espace de stockage en ligne s’active en 2 minutes. Ensuite, vous pouvez l’utiliser depuis votre
            navigateur, votre PC Windows ou votre téléphone. Suivez les étapes dans l’ordre.
          </p>
          <div className="guide-aide">
            <span aria-hidden="true">🤝</span>
            <p>
              <strong>Pas à l’aise avec l’informatique ?</strong> Aucun souci : je peux tout installer pour vous lors
              d’une session à distance, c’est inclus dans votre forfait. <Link to="/contact">Demandez-le ici</Link>.
            </p>
          </div>
        </div>
      </section>

      <section>
        <div className="container guide" style={{ maxWidth: 820 }}>
          <Etape n={1} titre="Activez votre compte">
            <ol>
              <li>
                Quelques minutes après votre paiement, vous recevez un e-mail <strong>« Bienvenue »</strong> envoyé par
                {' '}{VENDEUR.email}. Pensez à regarder dans les spams.
              </li>
              <li>Cliquez sur le bouton de l’e-mail pour <strong>choisir votre mot de passe</strong> (10 caractères minimum).</li>
              <li>Votre <strong>identifiant</strong> est l’adresse e-mail utilisée lors du paiement.</li>
            </ol>
            <p className="small">
              Le lien a expiré ? Allez sur <a href={CLOUD} target="_blank" rel="noopener noreferrer">cloud.3-wm.net</a> et
              cliquez sur « Mot de passe oublié ? ».
            </p>
          </Etape>

          <Etape n={2} titre="Utilisez le cloud depuis votre navigateur">
            <p>Rien à installer : c’est le plus simple pour commencer.</p>
            <ol>
              <li>Allez sur <a href={CLOUD} target="_blank" rel="noopener noreferrer"><strong>cloud.3-wm.net</strong></a> et connectez-vous.</li>
              <li>Ouvrez <strong>« Fichiers »</strong>. Pour ajouter un document, faites-le glisser dans la page, ou cliquez sur <strong>« + Nouveau »</strong> puis <strong>« Téléverser »</strong>.</li>
              <li>Pour récupérer un fichier : cliquez sur les <strong>⋯</strong> à côté de son nom, puis <strong>« Télécharger »</strong>.</li>
              <li>Pour l’envoyer à quelqu’un : cliquez sur l’icône de <strong>partage</strong>, créez un lien et copiez-le dans votre message.</li>
            </ol>
            <p className="small">Astuce : ajoutez cloud.3-wm.net à vos favoris pour le retrouver facilement.</p>
          </Etape>

          <Etape n={3} titre="Sur votre PC Windows : un dossier qui se sauvegarde tout seul (facultatif)">
            <p>Idéal pour vos documents importants : tout ce que vous mettez dans ce dossier est copié automatiquement dans le cloud.</p>
            <ol>
              <li>Téléchargez l’application gratuite <strong>Nextcloud</strong> pour ordinateur sur le site officiel <a href="https://nextcloud.com/install/" target="_blank" rel="noopener noreferrer">nextcloud.com/install</a>, puis installez-la.</li>
              <li>Au lancement, cliquez sur <strong>« Se connecter »</strong> et indiquez l’adresse du serveur : <code>https://cloud.3-wm.net</code></li>
              <li>Votre navigateur s’ouvre : connectez-vous, puis cliquez sur <strong>« Autoriser l’accès »</strong>.</li>
              <li>Validez le dossier proposé. Un dossier <strong>Nextcloud</strong> apparaît dans l’Explorateur Windows : glissez-y vos fichiers.</li>
            </ol>
          </Etape>

          <Etape n={4} titre="Sur votre téléphone : vos photos à l’abri (facultatif)">
            <ol>
              <li>Installez l’application gratuite <strong>Nextcloud</strong> depuis le Play Store (Android) ou l’App Store (iPhone).</li>
              <li>Touchez <strong>« Se connecter »</strong>, tapez l’adresse <code>cloud.3-wm.net</code>, connectez-vous et autorisez l’accès.</li>
              <li>Pour sauvegarder vos photos automatiquement : dans les paramètres de l’application, activez le <strong>téléversement automatique</strong> (ou « envoi automatique ») et choisissez le dossier Photos.</li>
            </ol>
            <p className="small">Les noms des menus peuvent varier légèrement selon votre téléphone et la version de l’application.</p>
          </Etape>

          <Etape n={5} titre="Conseillé : protégez votre compte">
            <p>
              Choisissez un mot de passe que vous n’utilisez nulle part ailleurs. Pour plus de sécurité, vous pouvez
              activer la <strong>double authentification</strong> : sur le site, cliquez sur votre avatar en haut à droite,
              puis <strong>« Paramètres personnels » › « Sécurité »</strong>. Je peux vous aider à la mettre en place.
            </p>
          </Etape>

          <h2 className="guide-faq-titre">Questions fréquentes</h2>
          <div className="guide-faq">
            {FAQ.map((f) => (
              <details key={f.q} className="card">
                <summary>{f.q}</summary>
                <p>{f.r}</p>
              </details>
            ))}
          </div>

          <div className="cta-band" style={{ marginTop: 40 }}>
            <h2>Une question, un blocage ?</h2>
            <p>Écrivez-moi : je vous réponds, ou je m’en occupe directement lors d’une session à distance.</p>
            <Link to="/contact" className="btn btn-primary btn-lg">Demander de l’aide</Link>
          </div>
        </div>
      </section>
    </>
  )
}
