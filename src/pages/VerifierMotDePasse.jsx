import { useState } from 'react'
import { Link } from 'react-router-dom'
import useDocumentMeta from '../hooks/useDocumentMeta.js'
import { verifierMotDePasse } from '../lib/motDePasseCompromis.js'

function formaterNombre(n) {
  return n.toLocaleString('fr-FR')
}

export default function VerifierMotDePasse() {
  useDocumentMeta(
    'Votre mot de passe a-t-il fuité ?',
    "Vérifiez gratuitement si un mot de passe figure dans des fuites de données connues. Votre mot de passe ne quitte jamais votre appareil.",
    '/verifier-mot-de-passe'
  )

  const [motDePasse, setMotDePasse] = useState('')
  const [visible, setVisible] = useState(false)
  const [chargement, setChargement] = useState(false)
  const [resultat, setResultat] = useState(null)
  const [erreur, setErreur] = useState('')

  async function handleSubmit(e) {
    e.preventDefault()
    setChargement(true)
    setErreur('')
    setResultat(null)
    try {
      setResultat(await verifierMotDePasse(motDePasse))
    } catch (err) {
      setErreur(err.message)
    } finally {
      setChargement(false)
    }
  }

  function effacer() {
    setMotDePasse('')
    setResultat(null)
    setErreur('')
  }

  return (
    <>
      <div className="page-header">
        <div className="container">
          <p className="eyebrow">Cybersécurité</p>
          <h1>Votre mot de passe a-t-il fuité ?</h1>
          <p>
            Des milliards de mots de passe ont été volés lors de piratages et circulent sur Internet.
            Testez gratuitement si l'un des vôtres en fait partie.
          </p>
        </div>
      </div>

      <section>
        <div className="container" style={{ maxWidth: 640 }}>
          <form className="contact-form card" onSubmit={handleSubmit} style={{ margin: 0, maxWidth: "none", padding: 28 }}>
            <div>
              <label htmlFor="mdp">Mot de passe à vérifier</label>
              <div style={{ display: 'flex', gap: 8 }}>
                <input
                  id="mdp"
                  type={visible ? 'text' : 'password'}
                  value={motDePasse}
                  onChange={(e) => {
                    setMotDePasse(e.target.value)
                    setResultat(null)
                  }}
                  autoComplete="off"
                  autoCorrect="off"
                  autoCapitalize="off"
                  spellCheck={false}
                  required
                />
                <button
                  type="button"
                  className="btn btn-outline"
                  onClick={() => setVisible((v) => !v)}
                  aria-pressed={visible}
                >
                  {visible ? 'Masquer' : 'Afficher'}
                </button>
              </div>
            </div>
            <div style={{ display: 'flex', gap: 10, flexWrap: 'wrap' }}>
              <button type="submit" className="btn btn-primary" disabled={chargement || !motDePasse}>
                {chargement ? 'Vérification…' : 'Vérifier'}
              </button>
              {(motDePasse || resultat) && (
                <button type="button" className="btn btn-outline" onClick={effacer}>
                  Effacer
                </button>
              )}
            </div>
          </form>

          <div aria-live="polite" style={{ marginTop: 24 }}>
            {erreur && (
              <div className="card" role="alert">
                <p style={{ margin: 0 }}>{erreur}</p>
              </div>
            )}

            {resultat && resultat.compromis && (
              <div className="card" style={{ borderColor: '#e5484d', borderWidth: 2, borderStyle: 'solid' }}>
                <h3 style={{ marginTop: 0 }}>⚠️ Ce mot de passe a fuité</h3>
                <p>
                  Il apparaît <strong>{formaterNombre(resultat.occurrences)} fois</strong> dans des fuites de
                  données connues. Les pirates testent en priorité ce type de mots de passe : ne l'utilisez
                  plus nulle part.
                </p>
                <p>
                  <strong>À faire maintenant :</strong> changez-le sur tous les sites où vous l'avez utilisé,
                  en commençant par votre messagerie et votre banque, et choisissez un mot de passe différent
                  pour chaque site.
                </p>
              </div>
            )}

            {resultat && !resultat.compromis && (
              <div className="card" style={{ borderColor: '#2e7d32', borderWidth: 2, borderStyle: 'solid' }}>
                <h3 style={{ marginTop: 0 }}>✅ Aucune fuite connue pour ce mot de passe</h3>
                <p>
                  Il ne figure pas dans les fuites référencées. Attention, ça ne prouve pas qu'il soit
                  solide : il peut ne pas avoir encore fuité, ou être simplement trop facile à deviner. Un
                  bon mot de passe est long (12 caractères minimum) et unique pour chaque site.
                </p>
              </div>
            )}
          </div>

          <div className="card" style={{ marginTop: 32 }}>
            <h3 style={{ marginTop: 0 }}>🔒 Votre mot de passe reste chez vous</h3>
            <p>
              La vérification se fait dans votre navigateur. Votre mot de passe est transformé en une
              empreinte, et seuls <strong>5 caractères</strong> de cette empreinte sont envoyés au service
              gratuit Have I Been Pwned, qui renvoie une liste de correspondances que votre navigateur
              compare ensuite lui-même. Ni ce site ni le service ne peuvent connaître le mot de passe testé,
              et rien n'est enregistré.
            </p>
            <p>
              Par précaution, évitez malgré tout de saisir un mot de passe que vous utilisez actuellement
              sur un appareil qui ne vous appartient pas.
            </p>
          </div>

          <div className="card" style={{ marginTop: 20 }}>
            <h3 style={{ marginTop: 0 }}>Les bons réflexes</h3>
            <p>
              Un mot de passe unique par site, un gestionnaire de mots de passe pour ne plus avoir à les
              retenir, et la double authentification partout où elle existe : c'est ce qui protège le mieux
              en cas de fuite. Découvrez{' '}
              <Link to="/recommandations">les outils que je recommande</Link> ou lisez{' '}
              <Link to="/blog/5-reflexes-cybersecurite-quotidien">les 5 réflexes de cybersécurité au quotidien</Link>.
            </p>
          </div>
        </div>
      </section>
    </>
  )
}
