import { Link } from 'react-router-dom'
import useDocumentMeta from '../hooks/useDocumentMeta.js'
import { FORMULES_VENTE, MEDIATEUR, PORTAIL_CLIENT_URL, VENDEUR, euros } from '../lib/boutique.js'

const MAJ = '4 octobre 2026'

function Article({ n, titre, children }) {
  return (
    <section className="cgv-article">
      <h2>Article {n} — {titre}</h2>
      {children}
    </section>
  )
}

export default function CGV() {
  useDocumentMeta(
    'Conditions générales de vente',
    'Conditions générales de vente des prestations de dépannage informatique à distance de 3WM Service.',
    '/cgv'
  )

  return (
    <>
      <div className="page-header">
        <div className="container">
          <p className="eyebrow">Informations légales</p>
          <h1>Conditions générales de vente</h1>
          <p className="small">Dernière mise à jour : {MAJ}</p>
        </div>
      </div>

      <section>
        <div className="container cgv" style={{ maxWidth: 820 }}>
          <Article n={1} titre="Vendeur">
            <p>
              Les présentes conditions générales de vente (CGV) s’appliquent aux prestations vendues sur le site
              3-wm.net par {VENDEUR.nom}, exerçant sous le nom commercial {VENDEUR.enseigne}, {VENDEUR.statut},
              SIRET {VENDEUR.siret}, dont l’adresse est {VENDEUR.adresse}. Contact : <a href={`mailto:${VENDEUR.email}`}>{VENDEUR.email}</a>.
            </p>
          </Article>

          <Article n={2} titre="Objet et champ d’application">
            <p>
              Les CGV régissent la vente à des particuliers (consommateurs) de prestations d’assistance et de dépannage
              informatique réalisées à distance sur des ordinateurs fonctionnant sous Microsoft Windows. Toute commande
              implique l’acceptation des CGV en vigueur au jour de la commande, que le client reconnaît avoir lues en
              cochant la case prévue à cet effet. Les demandes des professionnels (Pack entreprise) font l’objet d’un
              devis séparé.
            </p>
          </Article>

          <Article n={3} titre="Prestations et prix">
            <ul>
              {Object.values(FORMULES_VENTE).map((f) => (
                <li key={f.nom}><strong>{f.nom}</strong> : {euros(f.prix)}{f.suffixe} — {f.resume}</li>
              ))}
            </ul>
            <p>
              Les prix sont indiqués en euros, toutes taxes comprises. {VENDEUR.tva}. Le prix applicable est celui
              affiché au moment de la commande.
            </p>
            <p>
              Le <strong>Forfait mensuel</strong> couvre un seul ordinateur Windows appartenant au client ou à son
              foyer, pour un usage personnel. Le nombre de sessions n’est pas limité, dans le cadre d’un usage normal :
              les sessions sont planifiées d’un commun accord, selon les disponibilités du prestataire.
            </p>
            <p>
              Sont exclus de toutes les formules : les pannes matérielles nécessitant une intervention physique, la
              récupération de données sur un support endommagé, et toute intervention sur un logiciel dont le client
              ne détient pas une licence valide.
            </p>
          </Article>

          <Article n={4} titre="Commande">
            <p>
              Le client choisit sa formule sur la page Services, puis clique sur « Commander ». Il peut décrire son
              problème, coche l’acceptation des CGV et la demande d’exécution immédiate (article 7), puis valide sa
              commande avec obligation de paiement. Il est alors redirigé vers la page de paiement sécurisée de
              notre prestataire Stripe. La commande est définitive une fois le paiement accepté. Une confirmation,
              un reçu et une facture sont envoyés par e-mail.
            </p>
          </Article>

          <Article n={5} titre="Paiement">
            <p>
              Le paiement s’effectue en ligne, au moment de la commande, par carte bancaire ou par les moyens proposés
              sur la page de paiement (Apple Pay, Google Pay…). Le paiement est traité par Stripe, prestataire de
              services de paiement agréé ; 3WM Service n’a jamais accès aux données bancaires du client.
            </p>
            <p>
              Pour le Forfait mensuel, le montant est prélevé automatiquement chaque mois à la date anniversaire de la
              souscription, jusqu’à résiliation.
            </p>
          </Article>

          <Article n={6} titre="Exécution de la prestation">
            <p>
              Après le paiement, le prestataire contacte le client par e-mail pour convenir d’une date de session, en
              principe dans les 5 jours ouvrés. La session se déroule à distance, au moyen d’un logiciel de prise en
              main à distance que le client autorise lui-même sur son écran. Le client peut suivre toute l’intervention
              en direct et l’interrompre à tout moment.
            </p>
            <p>
              Avant toute session, le client est invité à sauvegarder ses données importantes. Le prestataire est tenu
              d’une obligation de moyens : il met en œuvre son savoir-faire pour résoudre le problème, sans pouvoir
              garantir un résultat lorsque la cause est matérielle ou extérieure à l’ordinateur.
            </p>
            <p>
              Si le problème ne peut pas être traité à distance ou relève des exclusions de l’article 3, le
              prestataire en informe le client et le rembourse intégralement si aucune intervention utile n’a été réalisée.
            </p>
          </Article>

          <Article n={7} titre="Droit de rétractation">
            <p>
              Le client consommateur dispose d’un délai de 14 jours à compter de la conclusion du contrat pour se
              rétracter, sans avoir à se justifier (articles L221-18 et suivants du Code de la consommation).
            </p>
            <p>
              En cochant la case prévue lors de la commande, le client demande expressément que la prestation commence
              avant la fin de ce délai. Conformément aux articles L221-25 et L221-28 du Code de la consommation :
            </p>
            <ul>
              <li>s’il se rétracte après le début de la prestation, il paie un montant proportionnel au service déjà fourni ;</li>
              <li>une fois la prestation entièrement exécutée, il ne peut plus exercer son droit de rétractation.</li>
            </ul>
            <p>
              Pour se rétracter, le client envoie une déclaration claire à <a href={`mailto:${VENDEUR.email}`}>{VENDEUR.email}</a> ou
              par courrier à l’adresse de l’article 1, par exemple avec le formulaire ci-dessous. Le remboursement est
              effectué dans les 14 jours suivant la réception de la demande, avec le même moyen de paiement.
            </p>
            <div className="card cgv-formulaire">
              <h3 className="mt-0">Formulaire de rétractation</h3>
              <p className="small">(À compléter et renvoyer uniquement si vous souhaitez vous rétracter.)</p>
              <p>
                À l’attention de {VENDEUR.nom} — {VENDEUR.enseigne}, {VENDEUR.adresse}, {VENDEUR.email} :<br />
                Je vous notifie par la présente ma rétractation du contrat portant sur la prestation de services
                ci-dessous :<br />
                Commandée le : …………… <br />
                Nom du client : …………… <br />
                Adresse du client : …………… <br />
                Signature du client (uniquement en cas de notification sur papier) : …………… <br />
                Date : ……………
              </p>
            </div>
          </Article>

          <Article n={8} titre="Durée et résiliation du Forfait mensuel">
            <p>
              Le Forfait mensuel est sans engagement de durée. Il est reconduit chaque mois jusqu’à résiliation. Le
              client peut le résilier à tout moment, en quelques clics, depuis son <a href={PORTAIL_CLIENT_URL} target="_blank" rel="noopener noreferrer">espace de facturation en ligne</a> (accès
              par un code envoyé à son adresse e-mail), ou en écrivant à <a href={`mailto:${VENDEUR.email}`}>{VENDEUR.email}</a>.
              La résiliation prend effet à la fin de la période mensuelle en cours, déjà payée ; aucun nouveau
              prélèvement n’a lieu ensuite.
            </p>
          </Article>

          <Article n={9} titre="Responsabilité">
            <p>
              Le prestataire n’est pas responsable des dommages résultant d’une panne préexistante, d’une défaillance
              matérielle, d’une absence de sauvegarde ou d’une utilisation de l’ordinateur non conforme à ses
              recommandations. Sa responsabilité est limitée au montant payé pour la prestation concernée, sauf faute
              lourde ou dommage corporel. Le client reste seul responsable des logiciels et licences installés sur son
              ordinateur.
            </p>
          </Article>

          <Article n={10} titre="Garanties légales">
            <p>
              Le client bénéficie des garanties prévues par la loi, notamment la garantie légale de conformité
              applicable aux services numériques (articles L224-25-12 et suivants du Code de la consommation). Pour
              toute réclamation, il contacte le prestataire à <a href={`mailto:${VENDEUR.email}`}>{VENDEUR.email}</a>.
            </p>
          </Article>

          <Article n={11} titre="Données personnelles">
            <p>
              Les données collectées lors de la commande (nom, e-mail, téléphone, adresse de facturation, description
              du problème) servent uniquement à exécuter la prestation, à établir la facture et à respecter les
              obligations comptables. Elles ne sont ni vendues ni cédées. Les données de paiement sont traitées par
              Stripe. Le client peut exercer ses droits d’accès, de rectification et de suppression à{' '}
              <a href={`mailto:${VENDEUR.email}`}>{VENDEUR.email}</a>. Pendant une session à distance, le prestataire
              n’accède qu’aux éléments nécessaires à l’intervention, sous le regard du client.
            </p>
          </Article>

          <Article n={12} titre="Réclamations et médiation">
            <p>
              En cas de litige, le client adresse d’abord une réclamation écrite à <a href={`mailto:${VENDEUR.email}`}>{VENDEUR.email}</a>.
              À défaut de solution, il peut recourir gratuitement au médiateur de la consommation
              {MEDIATEUR.nom ? (
                <> : <strong>{MEDIATEUR.nom}</strong>{MEDIATEUR.adresse && <>, {MEDIATEUR.adresse}</>}
                  {MEDIATEUR.site && <> — <a href={MEDIATEUR.site} target="_blank" rel="noopener noreferrer">{MEDIATEUR.site}</a></>}.</>
              ) : (
                <> dont les coordonnées figureront ici.</>
              )}
            </p>
          </Article>

          <Article n={13} titre="Droit applicable">
            <p>
              Les présentes CGV sont soumises au droit français. À défaut d’accord amiable, le litige est porté devant
              les juridictions compétentes selon les règles de droit commun.
            </p>
          </Article>

          <p className="small">Voir aussi les <Link to="/mentions-legales">mentions légales</Link>.</p>
        </div>
      </section>
    </>
  )
}
