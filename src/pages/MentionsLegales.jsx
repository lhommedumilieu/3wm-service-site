import useDocumentMeta from '../hooks/useDocumentMeta.js'

export default function MentionsLegales() {
  useDocumentMeta(
    'Mentions légales',
    "Mentions légales de 3WM Service : identité de l'entreprise, hébergement, propriété intellectuelle et traitement des données personnelles (RGPD).",
    '/mentions-legales'
  )

  const rows = [
    ["Identité de l'entreprise", '3WM Service'],
    ["Adresse de l'entreprise", 'Entreprise individuelle — adresse postale communiquée sur demande'],
    ['Numéro de téléphone', 'Contact par e-mail uniquement'],
    ['Adresse e-mail', <a href="mailto:service@3-wm.net">service@3-wm.net</a>],
    ['Nom du propriétaire', "L'Homme-du-Milieu (3WM Service)"],
    ["Numéro d'identification TVA", 'Non applicable (franchise en base de TVA)'],
    ["Numéro d'immatriculation au RCS", 'Non applicable (entreprise individuelle, non immatriculée au RCS)'],
    ['Forme juridique et capital social', 'Entreprise individuelle (micro-entreprise)'],
    ["Identité de l'hébergeur du site", 'Netlify, Inc. (hébergement statique)'],
    ["Adresse de l'hébergeur du site", '44 Montgomery Street, Suite 300, San Francisco, CA 94104, États-Unis'],
    ["Numéro de téléphone de l'hébergeur", 'Non communiqué — support via netlify.com/support'],
    ['Propriété intellectuelle', "L'ensemble des contenus de ce site (textes, images, ebooks) est la propriété de 3WM Service, sauf mention contraire. Toute reproduction sans autorisation est interdite."],
    ['Clause de non-responsabilité', "Les informations fournies sur ce site (services de dépannage, contenus des ebooks) le sont à titre indicatif. 3WM Service ne saurait être tenu responsable des dommages résultant de leur utilisation."],
    ['Traitement des données personnelles (RGPD) et cookies', "Les données personnelles collectées via le formulaire de contact (nom, e-mail, message) servent uniquement à répondre à votre demande et ne sont ni revendues ni partagées. Ce site utilise des cookies techniques nécessaires à son fonctionnement (formulaire de contact). Vous pouvez demander l'accès, la rectification ou la suppression de vos données à service@3-wm.net."],
  ]

  return (
    <>
      <div className="page-header">
        <div className="container">
          <p className="eyebrow">cat mentions-legales.txt</p>
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
