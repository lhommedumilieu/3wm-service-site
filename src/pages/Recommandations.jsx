import Reveal from '../components/Reveal.jsx'
import useDocumentMeta from '../hooks/useDocumentMeta.js'

const outils = [
  {
    nom: 'NordVPN',
    badge: 'VPN',
    description: "VPN pour protéger votre connexion et votre vie privée en ligne, particulièrement utile en Wi-Fi public.",
    points: ['Chiffrement AES-256', 'Politique stricte de non-conservation des logs', 'Kill Switch automatique'],
    lien: 'https://go.nordvpn.net/aff_c?offer_id=15&aff_id=157035&url_id=1172',
  },
  {
    nom: 'NordPass',
    badge: 'Mots de passe',
    description: "Gestionnaire de mots de passe pour créer, stocker et remplir automatiquement des mots de passe uniques et sécurisés.",
    points: ['Chiffrement XChaCha20', 'Compatible tous les navigateurs', 'Partage sécurisé de mots de passe'],
    lien: 'https://go.nordpass.io/aff_c?offer_id=488&aff_id=157035&url_id=9356',
  },
]

export default function Recommandations() {
  useDocumentMeta(
    'Nos recommandations',
    "Les outils de sécurité informatique que 3WM Service recommande et utilise, pour protéger votre vie privée et vos mots de passe.",
    '/recommandations'
  )

  return (
    <>
      <div className="page-header">
        <div className="container">
          <p className="eyebrow">Recommandations</p>
          <h1>Nos outils recommandés</h1>
        </div>
      </div>

      <section>
        <div className="container" style={{ maxWidth: 720 }}>
          <p>
            Voici les outils de sécurité informatique que j'utilise et recommande réellement, pas une
            liste au hasard. Certains liens ci-dessous sont des <strong>liens affiliés</strong> : si vous
            achetez via ces liens, je touche une commission, sans coût supplémentaire pour vous. Cela
            n'influence pas mon avis — je ne recommande que ce que j'estime utile.
          </p>

          <div className="grid grid-2" style={{ marginTop: 32 }}>
            {outils.map((o, i) => (
              <Reveal className="card partner-card" key={o.nom} delay={i * 0.08}>
                <span className="partner-badge">{o.badge}</span>
                <h3>{o.nom}</h3>
                <p>{o.description}</p>
                <ul className="partner-points">
                  {o.points.map((pt) => (
                    <li key={pt}>{pt}</li>
                  ))}
                </ul>
                <a
                  href={o.lien}
                  target="_blank"
                  rel="sponsored noopener noreferrer"
                  className="btn btn-primary"
                >
                  Découvrir {o.nom}
                </a>
              </Reveal>
            ))}
          </div>
        </div>
      </section>
    </>
  )
}
