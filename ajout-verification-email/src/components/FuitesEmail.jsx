import { useState } from 'react'
import { Link } from 'react-router-dom'
import { verifierMonEmail, traduireDonnee, exposeMotsDePasse } from '../lib/fuitesEmail.js'

function formaterNombre(n) {
  return n.toLocaleString('fr-FR')
}

export default function FuitesEmail({ email }) {
  const [chargement, setChargement] = useState(false)
  const [resultat, setResultat] = useState(null)
  const [erreur, setErreur] = useState('')

  async function lancer() {
    setChargement(true)
    setErreur('')
    setResultat(null)
    try {
      setResultat(await verifierMonEmail())
    } catch (e) {
      setErreur(e.message)
    } finally {
      setChargement(false)
    }
  }

  return (
    <div style={{ display: 'grid', gap: 20 }}>
      <div className="card">
        <h3 className="mt-0">Mon adresse e-mail a-t-elle fuité ?</h3>
        <p>
          Lors de piratages de sites, des listes d'adresses e-mail (parfois avec les mots de passe
          associés) se retrouvent en circulation. Vérifiez gratuitement si l'adresse de votre compte,{' '}
          <strong>{email}</strong>, figure dans l'une de ces fuites connues.
        </p>
        <p className="small">
          Pour votre sécurité, seule l'adresse de votre propre compte peut être vérifiée. Le résultat
          n'est pas enregistré sur ce site.
        </p>
        <button type="button" className="btn btn-primary" onClick={lancer} disabled={chargement}>
          {chargement ? 'Vérification…' : 'Vérifier mon adresse e-mail'}
        </button>
      </div>

      <div aria-live="polite">
        {erreur && (
          <div className="card" role="alert">
            <p style={{ margin: 0 }}>{erreur}</p>
          </div>
        )}

        {resultat && resultat.total === 0 && (
          <div className="card" style={{ borderColor: '#2e7d32', borderWidth: 2, borderStyle: 'solid' }}>
            <h3 style={{ marginTop: 0 }}>✅ Aucune fuite connue</h3>
            <p style={{ marginBottom: 0 }}>
              Cette adresse ne figure dans aucune fuite référencée par le service. Cela ne veut pas dire
              qu'elle n'a jamais été exposée : seules les fuites rendues publiques sont connues. Gardez
              de bons réflexes (mots de passe uniques, double authentification).
            </p>
          </div>
        )}

        {resultat && resultat.total > 0 && (
          <div style={{ display: 'grid', gap: 12 }}>
            <div className="card" style={{ borderColor: '#e5484d', borderWidth: 2, borderStyle: 'solid' }}>
              <h3 style={{ marginTop: 0 }}>
                ⚠️ Adresse trouvée dans {resultat.total} fuite{resultat.total > 1 ? 's' : ''}
              </h3>
              <p style={{ marginBottom: 8 }}>
                Ça ne veut pas dire que votre compte est piraté aujourd'hui, mais que des informations
                liées à cette adresse ont déjà circulé. <strong>À faire :</strong>
              </p>
              <ul style={{ paddingLeft: 20, margin: 0, display: 'grid', gap: 6 }}>
                <li>Changez le mot de passe des sites concernés, et de tout autre site où vous l'aviez réutilisé.</li>
                <li>Activez la double authentification partout où c'est possible, en priorité sur votre messagerie.</li>
                <li>
                  Testez vos mots de passe avec l'
                  <Link to="/verifier-mot-de-passe">outil de vérification de mot de passe</Link>.
                </li>
                <li>Méfiez-vous des e-mails ou SMS inattendus : ils peuvent exploiter ces données (hameçonnage).</li>
              </ul>
            </div>

            {resultat.fuites.map((f) => (
              <div className="card" key={f.nom}>
                <div style={{ display: 'flex', justifyContent: 'space-between', gap: 12, flexWrap: 'wrap' }}>
                  <strong>{f.nom}</strong>
                  <span className="small" style={{ opacity: 0.7 }}>
                    {f.annee ? `Fuite de ${f.annee}` : 'Date inconnue'}
                    {f.enregistrements ? ` · ${formaterNombre(f.enregistrements)} comptes touchés` : ''}
                  </span>
                </div>
                {f.donnees.length > 0 && (
                  <p className="small" style={{ margin: '8px 0 0' }}>
                    Données exposées : {f.donnees.map(traduireDonnee).join(', ')}
                  </p>
                )}
                {exposeMotsDePasse(f) && (
                  <p className="small" style={{ margin: '8px 0 0', color: '#e5484d', fontWeight: 600 }}>
                    Mots de passe exposés : changez-le en priorité sur ce site.
                  </p>
                )}
              </div>
            ))}
          </div>
        )}

        {resultat && (
          <p className="small" style={{ marginTop: 16, opacity: 0.7 }}>
            Source des données : <a href="https://xposedornot.com" target="_blank" rel="noopener noreferrer">XposedOrNot</a>.
          </p>
        )}
      </div>
    </div>
  )
}
