import { useState } from 'react'
import { Link } from 'react-router-dom'
import { useAuth } from '../context/AuthContext.jsx'

const TIPS = [
  {
    title: 'Avant la session',
    text: "Fermez les documents ou fenêtres contenant des informations sensibles : le technicien voit votre écran pendant toute la durée de la prise en main.",
  },
  {
    title: 'Restez branché',
    text: 'Si vous êtes sur un ordinateur portable, branchez-le sur secteur avant de démarrer — une coupure de batterie interrompt la session.',
  },
  {
    title: "L'adresse AnyDesk",
    text: "Gardez la fenêtre AnyDesk ouverte à l'écran : le technicien vous demandera de lui communiquer les 9 chiffres affichés pour se connecter.",
  },
  {
    title: 'Vous gardez le contrôle',
    text: "Vous voyez en direct tout ce que fait le technicien sur votre écran et vous pouvez fermer AnyDesk à tout moment pour couper la connexion.",
  },
]

function OutilsEtAstuces() {
  return (
    <>
      <div className="card">
        <h3 className="mt-0">AnyDesk — prise en main à distance</h3>
        <p>
          C'est l'outil que 3WM Service utilise pour les sessions de dépannage à distance. Léger et
          gratuit pour un usage ponctuel, il ne nécessite pas d'installation : vous pouvez le lancer
          directement après téléchargement.
        </p>
        <p>
          <a
            href="https://anydesk.com/fr/downloads/windows"
            target="_blank"
            rel="noopener noreferrer"
            className="btn btn-primary"
          >
            Télécharger AnyDesk (site officiel)
          </a>
        </p>

        <h4 style={{ marginTop: 28, marginBottom: 12 }}>Comment ça se passe</h4>
        <ol className="small" style={{ paddingLeft: 20, display: 'grid', gap: 10 }}>
          <li>Cliquez sur le bouton ci-dessus pour ouvrir le site officiel d'AnyDesk et téléchargez le programme.</li>
          <li>Lancez le fichier téléchargé : une fenêtre s'ouvre avec votre adresse AnyDesk (une suite de 9 chiffres).</li>
          <li>Communiquez cette adresse au technicien 3WM Service au moment convenu pour la session (chat, téléphone ou email).</li>
          <li>Acceptez la demande de connexion qui apparaît à l'écran — rien ne se passe sur votre PC sans votre accord explicite.</li>
          <li>À la fin de l'intervention, fermez simplement la fenêtre AnyDesk pour couper la connexion.</li>
        </ol>
      </div>

      <div className="card" style={{ marginTop: 24 }}>
        <h3 className="mt-0">Diagnostic-PC.exe — analyse automatique</h3>
        <p>
          Un outil signé 3WM Service qui analyse votre PC en lecture seule (antivirus, mises à jour,
          espace disque, démarrage...) et calcule un score de santé sur 100. Il ne modifie rien sur
          votre machine — c'est un diagnostic, pas une réparation.
        </p>
        <p>
          <a href="/downloads/Diagnostic-PC.exe" className="btn btn-primary" download>
            Télécharger Diagnostic-PC.exe
          </a>
        </p>

        <h4 style={{ marginTop: 28, marginBottom: 12 }}>Comment l'utiliser</h4>
        <ol className="small" style={{ paddingLeft: 20, display: 'grid', gap: 10 }}>
          <li>Téléchargez le fichier ci-dessus, puis double-cliquez dessus pour le lancer.</li>
          <li>Une fenêtre demande de confirmer le lancement du diagnostic : c'est le moment de vérifier que le client est d'accord.</li>
          <li>L'analyse se déroule automatiquement (antivirus, mises à jour, disque, démarrage, mémoire...).</li>
          <li>Un rapport texte horodaté est enregistré sur le Bureau, avec le score de santé final.</li>
        </ol>
        <p className="small" style={{ marginTop: 12 }}>
          Windows peut afficher un avertissement SmartScreen la première fois (outil peu téléchargé) :
          cliquez sur « Informations complémentaires » puis « Exécuter quand même ».
        </p>
      </div>

      <h3 style={{ marginTop: 40, marginBottom: 16 }}>Astuces avant une session</h3>
      <div className="grid grid-2">
        {TIPS.map((tip) => (
          <div className="card" key={tip.title}>
            <h3 className="mt-0" style={{ fontSize: '1rem' }}>{tip.title}</h3>
            <p className="small" style={{ marginBottom: 0 }}>{tip.text}</p>
          </div>
        ))}
      </div>
    </>
  )
}

export default function EspaceMembre() {
  const { user, loading, isConfigured, signOut } = useAuth()
  const [tab, setTab] = useState('compte')

  if (!isConfigured) {
    return (
      <div className="page-header">
        <div className="container">
          <h1>Espace membre</h1>
          <p>Les comptes utilisateurs arrivent bientôt sur 3WM Service. Revenez un peu plus tard !</p>
        </div>
      </div>
    )
  }

  if (loading) {
    return (
      <div className="page-header">
        <div className="container">
          <p>Chargement…</p>
        </div>
      </div>
    )
  }

  if (!user) {
    return (
      <div className="page-header">
        <div className="container">
          <h1>Espace membre</h1>
          <p>Vous devez être connecté pour accéder à cette page.</p>
          <Link to="/connexion" className="btn btn-primary">Se connecter</Link>
        </div>
      </div>
    )
  }

  return (
    <>
      <div className="page-header">
        <div className="container">
          <p className="eyebrow">cd ~</p>
          <h1>Bienvenue, {user.email}</h1>
          <p>Votre espace membre 3WM Service.</p>
        </div>
      </div>

      <section>
        <div className="container">
          <div className="member-tabs" role="tablist">
            <button
              type="button"
              role="tab"
              aria-selected={tab === 'compte'}
              className={`member-tab${tab === 'compte' ? ' active' : ''}`}
              onClick={() => setTab('compte')}
            >
              Mon compte
            </button>
            <button
              type="button"
              role="tab"
              aria-selected={tab === 'outils'}
              className={`member-tab${tab === 'outils' ? ' active' : ''}`}
              onClick={() => setTab('outils')}
            >
              Outils &amp; astuces
            </button>
          </div>

          {tab === 'compte' ? (
            <div className="grid grid-2">
              <div className="card">
                <h3 className="mt-0">Contenu réservé aux membres</h3>
                <p>Un premier extrait exclusif du Tome 2 — Kali Linux &amp; Méthodologie Pentest, réservé aux membres inscrits.</p>
                <p className="small">« Avant de lancer le moindre scan, la méthodologie de pentest impose une phase de reconnaissance passive : comprendre la cible sans jamais interagir directement avec elle. C'est cette discipline qui distingue un audit professionnel d'un simple test au hasard… »</p>
              </div>
              <div className="card">
                <h3 className="mt-0">Vos informations</h3>
                <p className="small">Email : {user.email}</p>
                <p className="small">Compte créé le : {new Date(user.created_at).toLocaleDateString('fr-FR')}</p>
                <button type="button" className="btn btn-outline" onClick={signOut}>Se déconnecter</button>
              </div>
            </div>
          ) : (
            <OutilsEtAstuces />
          )}
        </div>
      </section>
    </>
  )
}
