import { useState } from 'react'
import { Link, useParams, useSearchParams } from 'react-router-dom'
import useDocumentMeta from '../hooks/useDocumentMeta.js'
import { FORMULES_VENTE, PORTAIL_CLIENT_URL, VENDEUR, creerPaiement, euros } from '../lib/boutique.js'

export default function Commander() {
  const { formule: cle } = useParams()
  const [params] = useSearchParams()
  const f = FORMULES_VENTE[cle]
  const [probleme, setProbleme] = useState('')
  const [cgv, setCgv] = useState(false)
  const [immediat, setImmediat] = useState(false)
  const [envoi, setEnvoi] = useState(false)
  const [erreur, setErreur] = useState('')

  useDocumentMeta(f ? `Commander : ${f.nom}` : 'Commander', 'Commande et paiement sécurisé d’une formule de dépannage Windows à distance.', `/commander/${cle}`)

  if (!f) {
    return (
      <section className="page-hero page-hero-simple">
        <div className="container">
          <h1>Formule introuvable</h1>
          <p className="lead"><Link to="/services#formules">Voir les formules disponibles</Link></p>
        </div>
      </section>
    )
  }

  async function payer(e) {
    e.preventDefault()
    setErreur('')
    if (!cgv || !immediat) return setErreur('Merci de cocher les deux cases pour continuer.')
    setEnvoi(true)
    try {
      window.location.href = await creerPaiement({ formule: cle, probleme, accepteCgv: cgv, demandeExecutionImmediate: immediat })
    } catch (err) {
      setErreur(err.message)
      setEnvoi(false)
    }
  }

  return (
    <>
      <section className="page-hero page-hero-simple">
        <div className="container">
          <p className="eyebrow">Commande</p>
          <h1>{f.nom} — <span className="hl">{euros(f.prix)}{f.suffixe}</span></h1>
          <p className="lead">{f.resume}</p>
        </div>
      </section>

      <section>
        <div className="container contact-layout">
          <form className="card contact-form" onSubmit={payer} style={{ maxWidth: 'none', margin: 0 }}>
            {params.get('annule') && (
              <p className="form-error" role="status">Paiement annulé : aucun montant n’a été débité. Vous pouvez réessayer quand vous voulez.</p>
            )}

            <div>
              <label htmlFor="probleme">Votre problème en quelques mots <span className="small">(facultatif)</span></label>
              <textarea id="probleme" maxLength={450} value={probleme} onChange={(e) => setProbleme(e.target.value)}
                placeholder="Ex. : mon PC met 10 minutes à démarrer depuis la dernière mise à jour…" />
            </div>

            <label className="case-legale">
              <input type="checkbox" checked={cgv} onChange={(e) => setCgv(e.target.checked)} />
              <span>J’ai lu et j’accepte les <Link to="/cgv" target="_blank">conditions générales de vente</Link>.</span>
            </label>

            <label className="case-legale">
              <input type="checkbox" checked={immediat} onChange={(e) => setImmediat(e.target.checked)} />
              <span>
                Je demande que le dépannage commence avant la fin du délai de rétractation de 14 jours. Je reconnais
                qu’une fois la prestation entièrement réalisée, je perds mon droit de rétractation
                (article L221-28 du Code de la consommation).
              </span>
            </label>

            {erreur && <p className="form-error" role="alert">{erreur}</p>}

            <button type="submit" className="btn btn-primary btn-lg" disabled={envoi}>
              {envoi ? 'Redirection vers le paiement…' : `Commander avec obligation de paiement — ${euros(f.prix)}${f.suffixe}`}
            </button>
            <p className="small">
              Paiement sécurisé par Stripe (carte bancaire, Apple Pay, Google Pay). 3WM Service n’a jamais accès à vos
              numéros de carte. {VENDEUR.tva}.
            </p>
          </form>

          <aside className="contact-side">
            <div className="card">
              <h3 className="mt-0">✅ Ce qui est inclus</h3>
              <ul className="mini-steps">
                {f.inclus.map((i) => <li key={i}>{i}</li>)}
              </ul>
              {cle === 'mensuel' && (
                <p className="small">
                  * Dans le cadre d’un usage personnel normal, voir les <Link to="/cgv">CGV</Link>. Résiliation à tout
                  moment depuis votre <a href={PORTAIL_CLIENT_URL} target="_blank" rel="noopener noreferrer">espace de facturation</a>.
                </p>
              )}
            </div>
            <div className="card">
              <h3 className="mt-0">🤝 Après le paiement</h3>
              <ol className="mini-steps">
                <li>Vous recevez un reçu et une facture par e-mail.</li>
                <li>Je vous contacte pour fixer le jour et l’heure de la session.</li>
                <li>Le jour J, rien ne démarre sans votre accord sur votre écran.</li>
              </ol>
            </div>
          </aside>
        </div>
      </section>
    </>
  )
}
