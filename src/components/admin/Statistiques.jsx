import { useEffect, useState } from 'react'
import { listerPresence, statsSite } from '../../lib/adminApi.js'
import { Erreur, Panneau, StatCard, Vide } from './ui.jsx'

const FENETRE_EN_LIGNE_MS = 45_000
const PERIODES = [7, 30, 90]

function jourCourt(iso) {
  const [, m, j] = iso.split('-')
  return `${j}/${m}`
}

// Histogramme SVG simple : une seule série, une couleur, barres fines,
// info-bulle au survol et alternative en tableau pour l'accessibilité.
function Histogramme({ donnees }) {
  const [actif, setActif] = useState(null)
  const [tableau, setTableau] = useState(false)
  const max = Math.max(1, ...donnees.map((d) => d.vues))
  const L = 720
  const H = 220
  const marge = { g: 34, d: 8, h: 14, b: 26 }
  const largeur = (L - marge.g - marge.d) / donnees.length
  const barre = Math.max(2, Math.min(22, largeur - 3))
  const graduations = [0, Math.ceil(max / 2), max]
  const pas = Math.ceil(donnees.length / 8)

  return (
    <div className="graphe">
      <div className="graphe-barre">
        <span className="small">Vues de page par jour</span>
        <button type="button" className="lien-btn" onClick={() => setTableau((t) => !t)}>
          {tableau ? 'Afficher le graphique' : 'Afficher en tableau'}
        </button>
      </div>
      {tableau ? (
        <div className="admin-table-wrap" style={{ maxHeight: 260 }}>
          <table className="admin-table">
            <thead><tr><th>Jour</th><th>Vues</th></tr></thead>
            <tbody>
              {[...donnees].reverse().map((d) => (
                <tr key={d.jour}><td>{d.jour.split('-').reverse().join('/')}</td><td>{d.vues}</td></tr>
              ))}
            </tbody>
          </table>
        </div>
      ) : (
        <div className="graphe-zone">
          <svg viewBox={`0 0 ${L} ${H}`} role="img" aria-label={`Histogramme des vues de page sur ${donnees.length} jours`} onMouseLeave={() => setActif(null)}>
            {graduations.map((g) => {
              const y = marge.h + (H - marge.h - marge.b) * (1 - g / max)
              return (
                <g key={g}>
                  <line x1={marge.g} x2={L - marge.d} y1={y} y2={y} className="graphe-grille" />
                  <text x={marge.g - 6} y={y + 4} textAnchor="end" className="graphe-axe">{g}</text>
                </g>
              )
            })}
            {donnees.map((d, i) => {
              const h = (H - marge.h - marge.b) * (d.vues / max)
              const x = marge.g + i * largeur + (largeur - barre) / 2
              const y = H - marge.b - h
              return (
                <g key={d.jour} onMouseEnter={() => setActif(i)} onFocus={() => setActif(i)} tabIndex={0}>
                  <rect x={marge.g + i * largeur} y={marge.h} width={largeur} height={H - marge.h - marge.b} fill="transparent" />
                  {d.vues > 0 && <rect x={x} y={y} width={barre} height={h} rx={Math.min(4, barre / 2)} className={`graphe-barre-rect${actif === i ? ' actif' : ''}`} />}
                  {i % pas === 0 && (
                    <text x={x + barre / 2} y={H - 8} textAnchor="middle" className="graphe-axe">{jourCourt(d.jour)}</text>
                  )}
                </g>
              )
            })}
            {actif !== null && (
              <g pointerEvents="none">
                {(() => {
                  const d = donnees[actif]
                  const cx = marge.g + actif * largeur + largeur / 2
                  const bx = Math.min(Math.max(cx - 56, marge.g), L - 120)
                  return (
                    <>
                      <rect x={bx} y={0} width={112} height={34} rx={8} className="graphe-bulle" />
                      <text x={bx + 56} y={14} textAnchor="middle" className="graphe-bulle-t1">{d.jour.split('-').reverse().join('/')}</text>
                      <text x={bx + 56} y={28} textAnchor="middle" className="graphe-bulle-t2">{d.vues} vue{d.vues > 1 ? 's' : ''}</text>
                    </>
                  )
                })()}
              </g>
            )}
          </svg>
        </div>
      )}
    </div>
  )
}

function Classement({ lignes, libelle, vide }) {
  if (!lignes?.length) return <Vide>{vide}</Vide>
  const max = Math.max(...lignes.map((l) => l.vues))
  return (
    <ol className="classement">
      {lignes.map((l) => (
        <li key={l[libelle]}>
          <span className="classement-fond" style={{ width: `${Math.max(4, (l.vues / max) * 100)}%` }} />
          <span className="classement-nom">{l[libelle] || '/'}</span>
          <span className="classement-n">{l.vues}</span>
        </li>
      ))}
    </ol>
  )
}

export default function Statistiques() {
  const [jours, setJours] = useState(30)
  const [stats, setStats] = useState(null)
  const [presence, setPresence] = useState([])
  const [erreur, setErreur] = useState('')

  useEffect(() => {
    let annule = false
    setStats(null)
    statsSite(jours)
      .then((s) => !annule && setStats(s))
      .catch((e) => !annule && setErreur(e.message))
    return () => {
      annule = true
    }
  }, [jours])

  useEffect(() => {
    let annule = false
    async function charger() {
      try {
        const p = await listerPresence()
        if (!annule) setPresence(p || [])
      } catch {
        /* le compteur en direct est un confort : on reste silencieux */
      }
    }
    charger()
    const t = setInterval(charger, 15000)
    return () => {
      annule = true
      clearInterval(t)
    }
  }, [])

  const enLigne = presence.filter((p) => Date.now() - new Date(p.last_seen).getTime() < FENETRE_EN_LIGNE_MS && !(p.path || '').startsWith('/admin'))
  const aujourdhui = stats?.par_jour?.[stats.par_jour.length - 1]?.vues ?? 0
  const moyenne = stats ? Math.round(stats.periode / jours) : 0

  return (
    <div className="admin-onglet">
      <div className="admin-stats">
        <StatCard label="En ligne maintenant" valeur={enLigne.length} ton="vert" aide="Mise à jour toutes les 15 s" />
        <StatCard label="Vues aujourd'hui" valeur={stats ? aujourdhui : '—'} />
        <StatCard label={`Vues sur ${jours} jours`} valeur={stats ? stats.periode : '—'} aide={stats ? `≈ ${moyenne} par jour` : ''} />
        <StatCard label="Vues depuis le début" valeur={stats ? stats.total : '—'} />
      </div>

      <Erreur>{erreur}</Erreur>

      <Panneau
        titre="Fréquentation"
        actions={
          <div className="segment" role="group" aria-label="Période">
            {PERIODES.map((p) => (
              <button key={p} type="button" className={jours === p ? 'actif' : ''} onClick={() => setJours(p)}>{p} j</button>
            ))}
          </div>
        }
      >
        {!stats ? <Vide>Chargement…</Vide> : <Histogramme donnees={stats.par_jour} />}
      </Panneau>

      <div className="admin-deux-colonnes egal">
        <Panneau titre="Pages les plus vues">
          {!stats ? <Vide>Chargement…</Vide> : <Classement lignes={stats.pages} libelle="path" vide="Pas encore de données." />}
        </Panneau>
        <Panneau titre="D'où viennent les visiteurs">
          {!stats ? <Vide>Chargement…</Vide> : <Classement lignes={stats.sources} libelle="source" vide="Pas encore de données." />}
        </Panneau>
      </div>

      <Panneau titre="Visiteurs actifs en ce moment">
        {enLigne.length === 0 ? (
          <Vide>Personne sur le site à cet instant (hors vous si votre onglet est ouvert ailleurs).</Vide>
        ) : (
          <ul className="admin-liste compact">
            {enLigne.map((p) => (
              <li key={p.visitor_id} className="admin-presence">
                <span className="point-vert" aria-hidden="true" />
                <strong>{p.path || '/'}</strong>
                <small>{p.referrer ? `depuis ${p.referrer.replace(/^https?:\/\/(www\.)?/, '').split('/')[0]}` : 'accès direct'}</small>
              </li>
            ))}
          </ul>
        )}
      </Panneau>
    </div>
  )
}
