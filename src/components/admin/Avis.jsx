import { useState } from 'react'
import { listerAvisAdmin, majAvis, supprimerAvis, urlPhoto } from '../../lib/avisApi.js'
import { Erreur, Panneau, Pastille, StatCard, Vide, confirmer, formatDate, useListe } from './ui.jsx'

const ONGLETS = [
  { id: 'en_attente', libelle: 'En attente' },
  { id: 'publie', libelle: 'Publiés' },
  { id: 'refuse', libelle: 'Refusés' },
]

function LigneAvis({ a, onAction }) {
  const [reponse, setReponse] = useState(a.reponse || '')
  const rep = reponse.trim() || null
  return (
    <li className="inbox-item ouvert">
      <div>
        <strong>{a.author_name}</strong>{' '}
        <span className="avis-etoiles" aria-label={`${a.note} sur 5`}>{'★'.repeat(a.note)}<span className="vide">{'★'.repeat(5 - a.note)}</span></span>
        <small> · {formatDate(a.created_at)}</small>
        {a.titre && <p className="modere-texte"><strong>{a.titre}</strong></p>}
        <p className="modere-texte">{a.contenu}</p>
        {a.photos?.length > 0 && (
          <div className="avis-photos">
            {a.photos.map((p) => (
              <a key={p} href={urlPhoto(p)} target="_blank" rel="noopener noreferrer"><img src={urlPhoto(p)} alt="Photo de l'avis" /></a>
            ))}
          </div>
        )}
        <textarea
          className="avis-admin-reponse"
          placeholder="Votre réponse publique (facultatif)"
          value={reponse}
          onChange={(e) => setReponse(e.target.value)}
        />
        <div className="avis-actions">
          {a.statut !== 'publie' && (
            <button type="button" className="btn btn-primary btn-sm" onClick={() => onAction(() => majAvis(a.id, { statut: 'publie', reponse: rep }))}>✓ Publier</button>
          )}
          {a.statut === 'publie' && (
            <button type="button" className="btn btn-outline btn-sm" onClick={() => onAction(() => majAvis(a.id, { reponse: rep }))}>Enregistrer la réponse</button>
          )}
          {a.statut !== 'refuse' && (
            <button type="button" className="btn btn-outline btn-sm" onClick={() => onAction(() => majAvis(a.id, { statut: 'refuse' }))}>✗ Refuser</button>
          )}
          <button
            type="button"
            className="btn btn-outline btn-sm danger"
            onClick={() => confirmer('Supprimer cet avis et ses photos ?') && onAction(() => supprimerAvis(a))}
          >Supprimer</button>
        </div>
      </div>
    </li>
  )
}

export default function AvisAdmin() {
  const avis = useListe(listerAvisAdmin)
  const [filtre, setFiltre] = useState('en_attente')
  const [erreur, setErreur] = useState('')
  const tous = avis.donnees || []
  const publies = tous.filter((a) => a.statut === 'publie')
  const moyenne = publies.length ? (publies.reduce((s, a) => s + a.note, 0) / publies.length).toFixed(1).replace('.', ',') : '–'
  const visibles = tous.filter((a) => a.statut === filtre)

  async function action(fn) {
    setErreur('')
    try {
      await fn()
      await avis.recharger()
    } catch (e) {
      setErreur(e.message)
    }
  }

  return (
    <div className="admin-onglet">
      <div className="admin-stats">
        <StatCard label="En attente" valeur={tous.filter((a) => a.statut === 'en_attente').length} ton="orange" />
        <StatCard label="Publiés" valeur={publies.length} />
        <StatCard label="Note moyenne" valeur={`${moyenne} / 5`} />
      </div>

      <Erreur>{erreur || avis.erreur}</Erreur>

      <Panneau
        titre="Avis clients"
        actions={ONGLETS.map((o) => (
          <button
            key={o.id}
            type="button"
            className={`btn btn-sm ${filtre === o.id ? 'btn-primary' : 'btn-outline'}`}
            onClick={() => setFiltre(o.id)}
          >
            {o.libelle} <Pastille>{tous.filter((a) => a.statut === o.id).length}</Pastille>
          </button>
        ))}
      >
        {avis.donnees === null ? (
          <Vide>Chargement…</Vide>
        ) : visibles.length === 0 ? (
          <Vide>Aucun avis ici.</Vide>
        ) : (
          <ul className="inbox">
            {visibles.map((a) => <LigneAvis key={`${a.id}-${a.statut}`} a={a} onAction={action} />)}
          </ul>
        )}
      </Panneau>
    </div>
  )
}
