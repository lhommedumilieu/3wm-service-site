import { useState } from 'react'
import { getSession } from '../../lib/supabaseAuth.js'
import { SUPABASE_URL, SUPABASE_ANON_KEY } from '../../lib/config.js'
import { FORMULES_VENTE } from '../../lib/boutique.js'
import { Erreur, Panneau, Pastille, StatCard, Vide, euros, formatDate, useListe } from './ui.jsx'

const STATUTS = {
  payee: { libelle: 'Payée — à planifier', ton: 'orange' },
  session_planifiee: { libelle: 'Session planifiée', ton: 'bleu' },
  terminee: { libelle: 'Terminée', ton: 'vert' },
  remboursee: { libelle: 'Remboursée', ton: 'gris' },
  abonnement_actif: { libelle: 'Forfait actif', ton: 'vert' },
  abonnement_resilie: { libelle: 'Forfait résilié', ton: 'gris' },
}

async function rest(chemin, options = {}) {
  const jeton = getSession()?.access_token
  const res = await fetch(`${SUPABASE_URL}/rest/v1/${chemin}`, {
    ...options,
    headers: { apikey: SUPABASE_ANON_KEY, Authorization: `Bearer ${jeton}`, 'Content-Type': 'application/json', ...options.headers },
  })
  if (!res.ok) throw new Error('Opération impossible sur les commandes.')
  return res.status === 204 ? null : res.json()
}
const lister = () => rest('commandes?select=*&order=created_at.desc&limit=300')
const changerStatut = (id, statut) =>
  rest(`commandes?id=eq.${id}`, { method: 'PATCH', headers: { Prefer: 'return=minimal' }, body: JSON.stringify({ statut, updated_at: new Date().toISOString() }) })

export default function Commandes() {
  const commandes = useListe(lister)
  const [erreur, setErreur] = useState('')
  const liste = commandes.donnees || []
  const reelles = liste.filter((c) => c.livemode)
  const ca = reelles.filter((c) => c.statut !== 'remboursee').reduce((s, c) => s + c.montant_centimes, 0) / 100

  async function maj(c, statut) {
    setErreur('')
    try {
      await changerStatut(c.id, statut)
      await commandes.recharger()
    } catch (e) {
      setErreur(e.message)
    }
  }

  return (
    <div className="admin-onglet">
      <div className="admin-stats">
        <StatCard label="À planifier" valeur={liste.filter((c) => c.statut === 'payee').length} ton="orange" />
        <StatCard label="Forfaits actifs" valeur={liste.filter((c) => c.statut === 'abonnement_actif' && c.livemode).length} />
        <StatCard label="Encaissé (réel)" valeur={euros(ca)} aide="Hors remboursements et paiements de test" />
      </div>
      <p className="small">
        Remboursements, factures et détails de paiement : <a href="https://dashboard.stripe.com" target="_blank" rel="noopener noreferrer">tableau de bord Stripe</a>.
      </p>

      <Erreur>{erreur || commandes.erreur}</Erreur>

      <Panneau titre={`Commandes (${liste.length})`}>
        {commandes.donnees === null ? (
          <Vide>Chargement…</Vide>
        ) : liste.length === 0 ? (
          <Vide>Aucune commande pour le moment.</Vide>
        ) : (
          <ul className="inbox">
            {liste.map((c) => {
              const st = STATUTS[c.statut] || { libelle: c.statut, ton: 'gris' }
              return (
                <li key={c.id} className="inbox-item ouvert">
                  <div className="modere-ligne">
                    <div>
                      <strong>{FORMULES_VENTE[c.formule]?.nom || c.formule}</strong> · {euros(c.montant_centimes / 100)}{' '}
                      <Pastille ton={st.ton}>{st.libelle}</Pastille>{!c.livemode && <> <Pastille>TEST</Pastille></>}
                      <small>
                        {formatDate(c.created_at)} · {c.client_nom || '—'} ·{' '}
                        {c.client_email ? <a href={`mailto:${c.client_email}`}>{c.client_email}</a> : '—'}
                      </small>
                      {c.description_probleme && <p className="modere-texte">{c.description_probleme}</p>}
                    </div>
                    <div className="avis-actions" style={{ marginTop: 0 }}>
                      {c.statut === 'payee' && (
                        <button type="button" className="btn btn-outline btn-sm" onClick={() => maj(c, 'session_planifiee')}>Session planifiée</button>
                      )}
                      {(c.statut === 'payee' || c.statut === 'session_planifiee') && (
                        <button type="button" className="btn btn-primary btn-sm" onClick={() => maj(c, 'terminee')}>✓ Terminée</button>
                      )}
                    </div>
                  </div>
                </li>
              )
            })}
          </ul>
        )}
      </Panneau>
    </div>
  )
}
