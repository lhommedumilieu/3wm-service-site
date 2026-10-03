import { useMemo, useState } from 'react'
import {
  listerSujetsForum,
  listerReponsesForum,
  supprimerSujetForum,
  supprimerReponseForum,
  listerCommentaires,
  supprimerCommentaire,
} from '../../lib/adminApi.js'
import { Erreur, Panneau, StatCard, Vide, confirmer, formatDate, useListe } from './ui.jsx'

export default function Moderation() {
  const sujets = useListe(listerSujetsForum)
  const reponses = useListe(listerReponsesForum)
  const commentaires = useListe(listerCommentaires)
  const [erreur, setErreur] = useState('')

  const listeSujets = sujets.donnees || []
  const listeReponses = reponses.donnees || []
  const listeCom = commentaires.donnees || []

  const reponsesParSujet = useMemo(() => {
    const m = new Map()
    for (const r of listeReponses) m.set(r.topic_id, [...(m.get(r.topic_id) || []), r])
    return m
  }, [listeReponses])

  async function executer(fn, rechargements) {
    setErreur('')
    try {
      await fn()
      await Promise.all(rechargements.map((r) => r()))
    } catch (e) {
      setErreur(e.message)
    }
  }

  const retirerSujet = (s) =>
    confirmer(`Supprimer le sujet « ${s.title} » et toutes ses réponses ?`) &&
    executer(() => supprimerSujetForum(s.id), [sujets.recharger, reponses.recharger])

  const retirerReponse = (r) =>
    confirmer('Supprimer cette réponse ?') &&
    executer(() => supprimerReponseForum(r.id), [reponses.recharger, sujets.recharger])

  const retirerCommentaire = (c) =>
    confirmer('Supprimer ce commentaire ?') && executer(() => supprimerCommentaire(c.id), [commentaires.recharger])

  const titreSujet = (id) => listeSujets.find((s) => s.id === id)?.title || '(sujet supprimé)'

  return (
    <div className="admin-onglet">
      <div className="admin-stats">
        <StatCard label="Sujets du forum" valeur={listeSujets.length} />
        <StatCard label="Réponses du forum" valeur={listeReponses.length} />
        <StatCard label="Commentaires du blog" valeur={listeCom.length} />
      </div>

      <Erreur>{erreur || sujets.erreur || reponses.erreur || commentaires.erreur}</Erreur>

      <Panneau titre={`Sujets du forum (${listeSujets.length})`}>
        {sujets.donnees === null ? (
          <Vide>Chargement…</Vide>
        ) : listeSujets.length === 0 ? (
          <Vide>Aucun sujet pour le moment.</Vide>
        ) : (
          <ul className="inbox">
            {listeSujets.map((s) => (
              <li key={s.id} className="inbox-item ouvert">
                <div className="modere-ligne">
                  <div>
                    <strong>{s.title}</strong>
                    <small>
                      {s.category} · par {s.author_name} · {formatDate(s.created_at)} · {(reponsesParSujet.get(s.id) || []).length} réponse(s)
                    </small>
                    <a href={`/forum/${s.id}`} className="small" target="_blank" rel="noopener noreferrer">Voir sur le site ↗</a>
                  </div>
                  <button type="button" className="btn btn-outline btn-sm danger" onClick={() => retirerSujet(s)}>Supprimer</button>
                </div>
              </li>
            ))}
          </ul>
        )}
      </Panneau>

      <Panneau titre={`Réponses du forum (${listeReponses.length})`}>
        {listeReponses.length === 0 ? (
          <Vide>Aucune réponse pour le moment.</Vide>
        ) : (
          <ul className="inbox">
            {listeReponses.map((r) => (
              <li key={r.id} className="inbox-item ouvert">
                <div className="modere-ligne">
                  <div>
                    <small>Dans « {titreSujet(r.topic_id)} » · par {r.author_name} · {formatDate(r.created_at)}</small>
                    <p className="modere-texte">{r.content}</p>
                  </div>
                  <button type="button" className="btn btn-outline btn-sm danger" onClick={() => retirerReponse(r)}>Supprimer</button>
                </div>
              </li>
            ))}
          </ul>
        )}
      </Panneau>

      <Panneau titre={`Commentaires du blog (${listeCom.length})`}>
        {listeCom.length === 0 ? (
          <Vide>Aucun commentaire pour le moment.</Vide>
        ) : (
          <ul className="inbox">
            {listeCom.map((c) => (
              <li key={c.id} className="inbox-item ouvert">
                <div className="modere-ligne">
                  <div>
                    <small>Article « {c.post_slug} » · {c.author_email} · {formatDate(c.created_at)}</small>
                    <p className="modere-texte">{c.content}</p>
                  </div>
                  <button type="button" className="btn btn-outline btn-sm danger" onClick={() => retirerCommentaire(c)}>Supprimer</button>
                </div>
              </li>
            ))}
          </ul>
        )}
      </Panneau>
    </div>
  )
}
