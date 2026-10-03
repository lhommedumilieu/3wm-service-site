import { useMemo, useState } from 'react'
import {
  listerClients,
  creerClient,
  majClient,
  supprimerClient,
  listerInterventions,
  creerIntervention,
  majIntervention,
  supprimerIntervention,
  listerVentes,
  creerVente,
  supprimerVente,
} from '../../lib/adminApi.js'
import { Erreur, Panneau, Pastille, StatCard, Vide, confirmer, euros, formatDateCourte, useListe } from './ui.jsx'

export const STATUTS = [
  { valeur: 'diagnostic', libelle: 'Diagnostic', ton: 'bleu' },
  { valeur: 'en_cours', libelle: 'En cours', ton: 'orange' },
  { valeur: 'termine', libelle: 'Terminé', ton: 'vert' },
  { valeur: 'paye', libelle: 'Payé', ton: 'vert-fonce' },
]
const statutInfo = (v) => STATUTS.find((s) => s.valeur === v) || { libelle: v || '—', ton: 'gris' }

const TOMES = [
  'Tome 1 — Linux pour débutants',
  'Tome 2 — Kali Linux & Pentest',
  'Tome 3 — Windows avancé',
  'Tome 4 — Cybersécurité avancée',
  'Tome 5 — VPN & vie privée',
  'Tome 6 — Réseaux & Wi-Fi',
]

const CLIENT_VIDE = { nom: '', email: '', telephone: '', notes: '' }

export default function Clients() {
  const clients = useListe(listerClients)
  const interventions = useListe(listerInterventions)
  const ventes = useListe(listerVentes)

  const [recherche, setRecherche] = useState('')
  const [selection, setSelection] = useState(null) // id du client ouvert
  const [formClient, setFormClient] = useState(null) // null | {id?, ...champs}
  const [formInter, setFormInter] = useState({ description: '', tarif: '', statut: 'diagnostic' })
  const [formVente, setFormVente] = useState({ tome: TOMES[0], prix: '', source: 'Etsy' })
  const [erreur, setErreur] = useState('')
  const [enCours, setEnCours] = useState(false)

  const listeClients = clients.donnees || []
  const listeInter = interventions.donnees || []
  const listeVentes = ventes.donnees || []

  const parClient = useMemo(() => {
    const map = new Map()
    for (const i of listeInter) {
      const m = map.get(i.client_id) || { nb: 0, total: 0 }
      m.nb += 1
      if (i.statut === 'paye') m.total += Number(i.tarif) || 0
      map.set(i.client_id, m)
    }
    return map
  }, [listeInter])

  const totalDepannages = listeInter.filter((i) => i.statut === 'paye').reduce((s, i) => s + (Number(i.tarif) || 0), 0)
  const enAttente = listeInter.filter((i) => i.statut === 'termine').reduce((s, i) => s + (Number(i.tarif) || 0), 0)
  const enCoursNb = listeInter.filter((i) => i.statut === 'en_cours' || i.statut === 'diagnostic').length
  const totalEbooks = listeVentes.reduce((s, v) => s + (Number(v.prix) || 0), 0)

  const filtres = listeClients.filter((c) => {
    const q = recherche.trim().toLowerCase()
    if (!q) return true
    return [c.nom, c.email, c.telephone].some((x) => x?.toLowerCase().includes(q))
  })

  const client = listeClients.find((c) => c.id === selection) || null
  const interClient = listeInter.filter((i) => i.client_id === selection)

  async function action(fn) {
    setEnCours(true)
    setErreur('')
    try {
      await fn()
    } catch (e) {
      setErreur(e.message)
    } finally {
      setEnCours(false)
    }
  }

  const sauverClient = (e) =>
    e.preventDefault() ||
    action(async () => {
      const { id, ...champs } = formClient
      const valeurs = {
        nom: champs.nom.trim(),
        email: champs.email.trim() || null,
        telephone: champs.telephone.trim() || null,
        notes: champs.notes.trim() || null,
      }
      if (id) await majClient(id, valeurs)
      else {
        const [cree] = await creerClient({ ...valeurs, source: 'manuel' })
        setSelection(cree?.id || null)
      }
      setFormClient(null)
      await clients.recharger()
    })

  const retirerClient = (c) =>
    confirmer(`Supprimer la fiche de ${c.nom || c.email} ? Ses dépannages seront supprimés avec elle ; ses ventes d'ebooks restent enregistrées.`) &&
    action(async () => {
      await supprimerClient(c.id)
      setSelection(null)
      await Promise.all([clients.recharger(), interventions.recharger(), ventes.recharger()])
    })

  const ajouterIntervention = (e) =>
    e.preventDefault() ||
    action(async () => {
      await creerIntervention({
        client_id: selection,
        description: formInter.description.trim() || null,
        tarif: formInter.tarif === '' ? null : Number(formInter.tarif),
        statut: formInter.statut,
      })
      setFormInter({ description: '', tarif: '', statut: 'diagnostic' })
      await interventions.recharger()
    })

  const changerStatut = (i, statut) =>
    action(async () => {
      await majIntervention(i.id, { statut })
      await interventions.recharger()
    })

  const retirerIntervention = (i) =>
    confirmer('Supprimer ce dépannage ?') &&
    action(async () => {
      await supprimerIntervention(i.id)
      await interventions.recharger()
    })

  const ajouterVente = (e) =>
    e.preventDefault() ||
    action(async () => {
      await creerVente({
        client_id: selection || null,
        tome: formVente.tome,
        prix: formVente.prix === '' ? null : Number(formVente.prix),
        source: formVente.source.trim() || null,
      })
      setFormVente((f) => ({ ...f, prix: '' }))
      await ventes.recharger()
    })

  const retirerVente = (v) =>
    confirmer('Supprimer cette vente ?') &&
    action(async () => {
      await supprimerVente(v.id)
      await ventes.recharger()
    })

  const nomClient = (id) => listeClients.find((c) => c.id === id)?.nom || '—'

  return (
    <div className="admin-onglet">
      <div className="admin-stats">
        <StatCard label="Clients" valeur={listeClients.length} />
        <StatCard label="Dépannages en cours" valeur={enCoursNb} ton="orange" />
        <StatCard label="À encaisser" valeur={euros(enAttente)} aide="Terminés, pas encore payés" ton="orange" />
        <StatCard label="Encaissé (dépannages)" valeur={euros(totalDepannages)} ton="vert" />
        <StatCard label="Ebooks vendus" valeur={listeVentes.length} aide={euros(totalEbooks)} />
      </div>

      <Erreur>{erreur || clients.erreur || interventions.erreur}</Erreur>

      <div className="admin-deux-colonnes">
        <Panneau
          titre={`Clients (${filtres.length})`}
          actions={
            <>
              <input type="search" placeholder="Rechercher…" value={recherche} onChange={(e) => setRecherche(e.target.value)} />
              <button type="button" className="btn btn-primary btn-sm" onClick={() => setFormClient({ ...CLIENT_VIDE })}>
                + Nouveau client
              </button>
            </>
          }
        >
          {formClient && (
            <form className="admin-form" onSubmit={sauverClient}>
              <input required placeholder="Nom" value={formClient.nom} onChange={(e) => setFormClient({ ...formClient, nom: e.target.value })} />
              <input type="email" placeholder="E-mail" value={formClient.email || ''} onChange={(e) => setFormClient({ ...formClient, email: e.target.value })} />
              <input placeholder="Téléphone" value={formClient.telephone || ''} onChange={(e) => setFormClient({ ...formClient, telephone: e.target.value })} />
              <textarea placeholder="Notes (matériel, habitudes, remarques…)" value={formClient.notes || ''} onChange={(e) => setFormClient({ ...formClient, notes: e.target.value })} />
              <div className="admin-form-actions">
                <button type="submit" className="btn btn-primary btn-sm" disabled={enCours}>{formClient.id ? 'Enregistrer' : 'Créer la fiche'}</button>
                <button type="button" className="btn btn-outline btn-sm" onClick={() => setFormClient(null)}>Annuler</button>
              </div>
            </form>
          )}

          {clients.donnees === null ? (
            <Vide>Chargement…</Vide>
          ) : filtres.length === 0 ? (
            <Vide>Aucun client pour le moment. Ajoutez-en un avec « + Nouveau client ».</Vide>
          ) : (
            <ul className="admin-liste">
              {filtres.map((c) => {
                const stats = parClient.get(c.id)
                return (
                  <li key={c.id}>
                    <button type="button" className={`admin-ligne${selection === c.id ? ' actif' : ''}`} onClick={() => setSelection(c.id)}>
                      <span className="admin-avatar" aria-hidden="true">{(c.nom || c.email || '?').slice(0, 1).toUpperCase()}</span>
                      <span className="admin-ligne-texte">
                        <strong>{c.nom || '(sans nom)'}</strong>
                        <small>{c.email || c.telephone || 'Pas de coordonnées'}</small>
                      </span>
                      <span className="admin-ligne-meta">
                        {stats ? `${stats.nb} dépannage${stats.nb > 1 ? 's' : ''}` : '—'}
                      </span>
                    </button>
                  </li>
                )
              })}
            </ul>
          )}
        </Panneau>

        <Panneau titre={client ? client.nom || client.email : 'Fiche client'}>
          {!client ? (
            <Vide>Choisissez un client dans la liste pour voir sa fiche et ses dépannages.</Vide>
          ) : (
            <>
              <div className="admin-fiche">
                <p><span>E-mail</span>{client.email ? <a href={`mailto:${client.email}`}>{client.email}</a> : '—'}</p>
                <p><span>Téléphone</span>{client.telephone ? <a href={`tel:${client.telephone}`}>{client.telephone}</a> : '—'}</p>
                <p><span>Origine</span>{client.source || '—'}</p>
                <p><span>Depuis le</span>{formatDateCourte(client.created_at)}</p>
                {client.notes && <p className="admin-notes"><span>Notes</span>{client.notes}</p>}
                <div className="admin-form-actions">
                  <button type="button" className="btn btn-outline btn-sm" onClick={() => setFormClient({ ...client })}>Modifier</button>
                  <button type="button" className="btn btn-outline btn-sm danger" onClick={() => retirerClient(client)}>Supprimer</button>
                </div>
              </div>

              <h4 className="admin-sous-titre">Dépannages</h4>
              {interClient.length === 0 ? (
                <Vide>Aucun dépannage enregistré pour ce client.</Vide>
              ) : (
                <ul className="admin-liste">
                  {interClient.map((i) => (
                    <li key={i.id} className="admin-inter">
                      <div>
                        <strong>{i.description || 'Sans description'}</strong>
                        <small>{formatDateCourte(i.created_at)} · {i.tarif != null ? euros(i.tarif) : 'Tarif à définir'}</small>
                      </div>
                      <div className="admin-inter-actions">
                        <select value={i.statut} onChange={(e) => changerStatut(i, e.target.value)} aria-label="Statut du dépannage">
                          {STATUTS.map((s) => <option key={s.valeur} value={s.valeur}>{s.libelle}</option>)}
                        </select>
                        <Pastille ton={statutInfo(i.statut).ton}>{statutInfo(i.statut).libelle}</Pastille>
                        <button type="button" className="admin-x" aria-label="Supprimer" onClick={() => retirerIntervention(i)}>×</button>
                      </div>
                    </li>
                  ))}
                </ul>
              )}

              <form className="admin-form inter-form" onSubmit={ajouterIntervention}>
                <input placeholder="Nouveau dépannage (ex. PC lent)" value={formInter.description} onChange={(e) => setFormInter({ ...formInter, description: e.target.value })} required />
                <input type="number" min="0" step="0.5" placeholder="Tarif €" value={formInter.tarif} onChange={(e) => setFormInter({ ...formInter, tarif: e.target.value })} />
                <select value={formInter.statut} onChange={(e) => setFormInter({ ...formInter, statut: e.target.value })}>
                  {STATUTS.map((s) => <option key={s.valeur} value={s.valeur}>{s.libelle}</option>)}
                </select>
                <button type="submit" className="btn btn-primary btn-sm" disabled={enCours}>Ajouter</button>
              </form>
              <div className="admin-raccourcis">
                {[29, 49, 19, 79].map((t) => (
                  <button type="button" key={t} className="chip-btn" onClick={() => setFormInter((f) => ({ ...f, tarif: String(t) }))}>{t} €</button>
                ))}
                <span className="small">tarifs du site</span>
              </div>
            </>
          )}
        </Panneau>
      </div>

      <Panneau titre={`Ventes d'ebooks (${listeVentes.length})`}>
        <form className="admin-form ligne" onSubmit={ajouterVente}>
          <select value={formVente.tome} onChange={(e) => setFormVente({ ...formVente, tome: e.target.value })}>
            {TOMES.map((t) => <option key={t}>{t}</option>)}
          </select>
          <input type="number" min="0" step="0.01" placeholder="Prix €" value={formVente.prix} onChange={(e) => setFormVente({ ...formVente, prix: e.target.value })} required />
          <input placeholder="Source (Etsy…)" value={formVente.source} onChange={(e) => setFormVente({ ...formVente, source: e.target.value })} />
          <button type="submit" className="btn btn-primary btn-sm" disabled={enCours}>
            Enregistrer une vente{client ? ` pour ${client.nom || 'ce client'}` : ''}
          </button>
        </form>
        {listeVentes.length === 0 ? (
          <Vide>Aucune vente enregistrée pour le moment.</Vide>
        ) : (
          <div className="admin-table-wrap">
            <table className="admin-table">
              <thead>
                <tr><th>Date</th><th>Tome</th><th>Client</th><th>Source</th><th>Prix</th><th></th></tr>
              </thead>
              <tbody>
                {listeVentes.map((v) => (
                  <tr key={v.id}>
                    <td>{formatDateCourte(v.created_at)}</td>
                    <td>{v.tome}</td>
                    <td>{v.client_id ? nomClient(v.client_id) : '—'}</td>
                    <td>{v.source || '—'}</td>
                    <td>{v.prix != null ? euros(v.prix) : '—'}</td>
                    <td><button type="button" className="admin-x" aria-label="Supprimer" onClick={() => retirerVente(v)}>×</button></td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </Panneau>
    </div>
  )
}
