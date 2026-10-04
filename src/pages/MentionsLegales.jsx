import { useState } from 'react'
import useDocumentMeta from '../hooks/useDocumentMeta.js'

const CLE_STATS = '3wm-stats-refusees'

// Permet au visiteur de refuser la mesure d'audience (condition de l'exemption CNIL).
function ChoixStatistiques() {
  const lire = () => {
    try {
      return localStorage.getItem(CLE_STATS) === '1'
    } catch {
      return false
    }
  }
  const [refuse, setRefuse] = useState(lire)

  function basculer() {
    try {
      if (refuse) localStorage.removeItem(CLE_STATS)
      else localStorage.setItem(CLE_STATS, '1')
      setRefuse(!refuse)
    } catch {
      /* stockage indisponible (navigation privée) : rien n'est enregistré de toute façon */
    }
  }

  return (
    <div className="card" style={{ marginTop: 28 }}>
      <h2 className="mt-0" style={{ fontSize: '1.15rem' }}>Mesure d’audience</h2>
      <p>
        {refuse
          ? 'Vous avez refusé la mesure d’audience : vos visites ne sont plus comptées sur ce navigateur.'
          : 'Vos visites sont comptées de façon anonyme pour les statistiques du site. Vous pouvez refuser à tout moment.'}
      </p>
      <button type="button" className={`btn ${refuse ? 'btn-outline' : 'btn-primary'}`} onClick={basculer}>
        {refuse ? 'Accepter à nouveau la mesure d’audience' : 'Ne plus être compté dans les statistiques'}
      </button>
    </div>
  )
}

export default function MentionsLegales() {
  useDocumentMeta(
    'Mentions légales',
    "Mentions légales de 3WM Service : identité de l'entreprise, hébergement, propriété intellectuelle et traitement des données personnelles (RGPD).",
    '/mentions-legales'
  )

  const rows = [
    ["Éditeur du site", '3WM Service, entrepreneur individuel (micro-entreprise)'],
    ['SIRET', '822 840 518 00010'],
    ['Adresse e-mail', <a href="mailto:service@3-wm.net">service@3-wm.net</a>],
    ['Directeur de la publication', 'Le responsable de 3WM Service'],
    ['TVA', 'TVA non applicable, art. 293 B du CGI (franchise en base)'],
    ["Hébergement", "Serveur exploité par l'éditeur (auto-hébergé), en France. Diffusion et protection du site via Cloudflare, Inc., 101 Townsend Street, San Francisco, CA 94107, États-Unis."],
    ['Paiements en ligne', 'Stripe Payments Europe, Ltd., 1 Grand Canal Street Lower, Grand Canal Dock, Dublin, D02 H210, Irlande. 3WM Service n’a jamais accès aux données de carte bancaire.'],
    ['Conditions de vente', <a href="/cgv">Conditions générales de vente</a>],
    ['Propriété intellectuelle', "L'ensemble des contenus de ce site (textes, images, ebooks) est la propriété de 3WM Service, sauf mention contraire. Toute reproduction sans autorisation est interdite."],
    ['Clause de non-responsabilité', "Les informations fournies sur ce site (articles, contenus des ebooks) le sont à titre indicatif. Les prestations vendues sont régies par les conditions générales de vente."],
    ['Données personnelles (RGPD)', "Les données collectées (formulaire de contact, compte membre, avis, commandes) servent uniquement à répondre aux demandes, gérer les comptes, publier les avis, exécuter les prestations et établir les factures. Elles ne sont ni revendues ni partagées, hors prestataires techniques nécessaires (base de données Supabase, paiement Stripe). Vous pouvez demander l'accès, la rectification ou la suppression de vos données à service@3-wm.net, et introduire une réclamation auprès de la CNIL (cnil.fr)."],
    ['Cookies et traceurs', "Ce site n'utilise ni publicité, ni outil de suivi tiers, ni réseau social intégré. Il enregistre uniquement dans votre navigateur les éléments nécessaires à son fonctionnement : votre connexion à l'espace membre et votre choix de thème (clair ou sombre). Une mesure d'audience interne, sans cookie tiers, compte les pages consultées et les visiteurs présents : ces données servent uniquement aux statistiques du site, ne sont jamais partagées et ne permettent pas de vous suivre sur d'autres sites. Ces éléments étant strictement nécessaires ou exemptés de consentement selon les recommandations de la CNIL, aucun bandeau n'est affiché ; vous pouvez refuser la mesure d'audience ci-dessous. Le paiement est réalisé sur la page sécurisée de Stripe, qui applique sa propre politique de cookies."],
  ]

  return (
    <>
      <div className="page-header">
        <div className="container">
          <p className="eyebrow">Informations légales</p>
          <h1>Mentions légales</h1>
        </div>
      </div>

      <section>
        <div className="container" style={{ maxWidth: 800 }}>
          <table className="legal-table">
            <tbody>
              {rows.map(([label, value], i) => (
                <tr key={i}>
                  <th>{label}</th>
                  <td>{value}</td>
                </tr>
              ))}
            </tbody>
          </table>
          <ChoixStatistiques />
        </div>
      </section>
    </>
  )
}
