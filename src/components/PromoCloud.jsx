import { useEffect, useState } from 'react'
import { Link, useLocation } from 'react-router-dom'
import { VENTE_ACTIVE } from '../lib/boutique.js'
import '../promo.css'

// Mise en avant du cloud 50 Go inclus dans le Forfait mensuel.
// - BandeauCloud : fine barre en haut du site (fermable, le choix est mémorisé).
// - EncartCloud  : bloc visuel pour la page Services (et ailleurs si besoin).

const CLE_FERME = '3wm-bandeau-cloud-ferme'
// Pages où le bandeau serait gênant (achat en cours, pages légales, admin)
const PAGES_SANS_BANDEAU = ['/commander', '/commande', '/admin', '/cgv', '/mentions-legales']

function dejaFerme() {
  try {
    return localStorage.getItem(CLE_FERME) === '1'
  } catch {
    return false
  }
}

export function BandeauCloud() {
  const { pathname } = useLocation()
  const [ferme, setFerme] = useState(dejaFerme)
  if (!VENTE_ACTIVE || ferme || PAGES_SANS_BANDEAU.some((p) => pathname.startsWith(p))) return null

  function fermer() {
    setFerme(true)
    try {
      localStorage.setItem(CLE_FERME, '1')
    } catch {
      /* navigateur sans stockage : le bandeau reviendra à la prochaine visite */
    }
  }

  return (
    <div className="bandeau-cloud" role="region" aria-label="Offre du moment">
      <p>
        <span aria-hidden="true">☁️</span> <strong>Nouveau :</strong> le Forfait mensuel inclut
        <strong> 50 Go de cloud</strong> pour mettre vos fichiers à l’abri.{' '}
        <Link to="/services#cloud">Découvrir</Link>
      </p>
      <button type="button" onClick={fermer} aria-label="Fermer ce message">×</button>
    </div>
  )
}

function IllustrationCloud() {
  return (
    <svg viewBox="0 0 220 160" className="cloud-illu" role="img" aria-label="Un nuage protégé par un bouclier">
      <path
        d="M58 118h112a34 34 0 0 0 4-67.8A46 46 0 0 0 86 38a34 34 0 0 0-30 18A31 31 0 0 0 58 118z"
        className="cloud-illu-nuage"
      />
      <path d="M110 66l26 10v18c0 17-11 30-26 36-15-6-26-19-26-36V76z" className="cloud-illu-bouclier" />
      <path d="M98 97l9 9 17-19" className="cloud-illu-coche" />
    </svg>
  )
}

const ATOUTS = [
  { ico: '💾', titre: '50 Go rien que pour vous', texte: 'Photos, papiers, documents : de quoi garder l’essentiel en sécurité.' },
  { ico: '🌙', titre: 'Sauvegardé chaque nuit', texte: '14 jours d’historique : un fichier effacé par erreur peut être récupéré.' },
  { ico: '📍', titre: 'Hébergé en France', texte: 'Sur un serveur que je gère moi-même. Vos fichiers ne sont ni lus ni revendus.' },
  { ico: '📱', titre: 'PC et téléphone', texte: 'Accès par le navigateur ou l’application gratuite Nextcloud, synchronisation automatique.' },
]

export function EncartCloud() {
  const { hash } = useLocation()
  // Lien « Découvrir » du bandeau : on descend jusqu'à l'encart
  useEffect(() => {
    if (hash !== '#cloud') return undefined
    const id = setTimeout(() => document.getElementById('cloud')?.scrollIntoView({ behavior: 'smooth' }), 300)
    return () => clearTimeout(id)
  }, [hash])

  return (
    <section id="cloud" className="encart-cloud">
      <div className="container encart-cloud-grille">
        <div>
          <p className="eyebrow">Inclus dans le Forfait mensuel</p>
          <h2>Votre PC dépanné… et vos fichiers à l’abri</h2>
          <p className="lead">
            Un disque dur qui lâche, un virus, un ordinateur volé : vos fichiers ne devraient jamais disparaître
            avec. Avec le Forfait mensuel, vous profitez de l’assistance Windows illimitée <strong>et</strong> d’un
            espace de stockage en ligne de 50 Go, prêt dès votre abonnement.
          </p>
          <ul className="encart-cloud-atouts">
            {ATOUTS.map((a) => (
              <li key={a.titre}>
                <span aria-hidden="true">{a.ico}</span>
                <span>
                  <strong>{a.titre}</strong>
                  <small>{a.texte}</small>
                </span>
              </li>
            ))}
          </ul>
          <div className="btn-row">
            {VENTE_ACTIVE ? (
              <Link to="/commander/mensuel" className="btn btn-primary btn-lg">Je m’abonne — 19 €/mois</Link>
            ) : (
              <Link to="/contact" className="btn btn-primary btn-lg">En savoir plus</Link>
            )}
            <a href="#formules" className="btn btn-outline btn-lg">Comparer les formules</a>
          </div>
          <p className="small">
            Sans engagement, résiliable en ligne en quelques clics. Comment ça marche ? Voir le{' '}
            <Link to="/guide-cloud">guide du cloud</Link>. Détails à l’article 9 des <Link to="/cgv">CGV</Link>.
          </p>
        </div>
        <IllustrationCloud />
      </div>
    </section>
  )
}
