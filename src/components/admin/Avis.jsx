import { useState } from 'react'
import { listerAvisAdmin, majAvis, marquerRemercie, moisAnnee, supprimerAvis, urlPhoto } from '../../lib/avisApi.js'
import { Erreur, Panneau, Pastille, StatCard, Vide, confirmer, formatDate, useListe } from './ui.jsx'

// Modèle de l'e-mail de remerciement (s'ouvre dans votre messagerie, prêt à envoyer)
function lienRemerciement(a) {
  const sujet = 'Merci pour votre avis sur 3WM Service'
  const corps = [
    'Bonjour,',
    '',
    `Merci beaucoup d'avoir pris le temps de laisser un avis sur 3WM Service${a.date_intervention ? ` à propos de votre dépannage de ${moisAnnee(a.date_intervention)}` : ''}.`,
    "Il est maintenant en ligne sur https://3-wm.net/avis et aidera d'autres personnes à franchir le pas.",
    '',
    "Si votre ordinateur vous joue encore des tours, je reste disponible : répondez simplement à ce message.",
    "Et si vous souhaitez être accompagné(e) toute l'année, le forfait mensuel d'assistance est présenté ici : https://3-wm.net/services",
    '',
    'Encore merci et à bientôt,',
    'Otman — 3WM Service',
    'https://3-wm.net',
  ].join('\n')
  return `mailto:${a.email}?subject=${encodeURIComponent(sujet)}&body=${encodeURIComponent(corps)}`
}

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
        <small> · {formatDate(a.created_at)}{a.date_intervention && <> · dépannage de {moisAnnee(a.date_intervention)}</>}</small>
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
          {a.statut === 'publie' && a.email && (
            <a
              href={lienRemerciement(a)}
              className="btn btn-outline btn-sm"
              onClick={() => onAction(() => marquerRemercie(a.id))}
            >
              ✉️ {a.remercie_at ? `Remercié le ${formatDate(a.remercie_at)} — renvoyer` : 'Envoyer un remerciement'}
            </a>
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
