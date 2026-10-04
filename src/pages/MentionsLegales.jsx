import useDocumentMeta from '../hooks/useDocumentMeta.js'

export default function MentionsLegales() {
  useDocumentMeta(
    'Mentions légales',
    "Mentions légales de 3WM Service : identité de l'entreprise, hébergement, propriété intellectuelle et traitement des données personnelles (RGPD).",
    '/mentions-legales'
  )

  const rows = [
    ["Éditeur du site", 'Otman El Bataoui, entrepreneur individuel (micro-entreprise), nom commercial 3WM Service'],
    ['Adresse', '8 B rue du Chemin Vert, 95610 Éragny, France'],
    ['SIRET', '822 840 518 00010'],
    ['Adresse e-mail', <a href="mailto:service@3-wm.net">service@3-wm.net</a>],
    ['Directeur de la publication', 'Otman El Bataoui'],
    ['TVA', 'TVA non applicable, art. 293 B du CGI (franchise en base)'],
    ["Hébergement", "Serveur exploité par l'éditeur (auto-hébergé), à l'adresse ci-dessus. Diffusion et protection du site via Cloudflare, Inc., 101 Townsend Street, San Francisco, CA 94107, États-Unis."],
    ['Paiements en ligne', 'Stripe Payments Europe, Ltd., 1 Grand Canal Street Lower, Grand Canal Dock, Dublin, D02 H210, Irlande. 3WM Service n’a jamais accès aux données de carte bancaire.'],
    ['Conditions de vente', <a href="/cgv">Conditions générales de vente</a>],
    ['Propriété intellectuelle', "L'ensemble des contenus de ce site (textes, images, ebooks) est la propriété de 3WM Service, sauf mention contraire. Toute reproduction sans autorisation est interdite."],
    ['Clause de non-responsabilité', "Les informations fournies sur ce site (articles, contenus des ebooks) le sont à titre indicatif. Les prestations vendues sont régies par les conditions générales de vente."],
    ['Traitement des données personnelles (RGPD) et cookies', "Les données collectées (formulaire de contact, compte membre, commandes) servent uniquement à répondre aux demandes, gérer les comptes, exécuter les prestations et établir les factures. Elles ne sont ni revendues ni partagées, hors prestataires techniques nécessaires (hébergement de la base de données Supabase, paiement Stripe). Ce site utilise uniquement des cookies et stockages techniques nécessaires à son fonctionnement. Vous pouvez demander l'accès, la rectification ou la suppression de vos données à service@3-wm.net."],
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
        </div>
      </section>
    </>
  )
}
