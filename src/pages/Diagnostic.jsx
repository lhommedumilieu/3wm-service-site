import { useState } from 'react'
import { Link } from 'react-router-dom'
import useDocumentMeta from '../hooks/useDocumentMeta.js'
import { FORMULES_VENTE, VENTE_ACTIVE, euros } from '../lib/boutique.js'
import '../diagnostic.css'

// Diagnostic gratuit « Mon PC est-il en bonne santé ? »
// Tout est calculé dans le navigateur : aucune réponse n'est envoyée ni enregistrée.

const QUESTIONS = [
  {
    id: 'age',
    question: 'Quel âge a votre ordinateur ?',
    reponses: [
      { texte: 'Moins de 2 ans', points: 0 },
      { texte: 'Entre 2 et 5 ans', points: 1 },
      { texte: 'Plus de 5 ans', points: 2 },
      { texte: 'Je ne sais pas', points: 1 },
    ],
  },
  {
    id: 'demarrage',
    question: 'Combien de temps met-il à démarrer, jusqu’à pouvoir l’utiliser ?',
    reponses: [
      { texte: 'Moins d’une minute', points: 0 },
      { texte: 'Entre 1 et 3 minutes', points: 1 },
      { texte: 'Plus de 3 minutes', points: 2 },
    ],
  },
  {
    id: 'lenteur',
    question: 'Au quotidien, votre PC rame-t-il (programmes lents, ventilateur bruyant) ?',
    reponses: [
      { texte: 'Jamais', points: 0 },
      { texte: 'De temps en temps', points: 1 },
      { texte: 'Souvent', points: 2 },
    ],
  },
  {
    id: 'virus',
    question: 'Voyez-vous des publicités étranges, des fenêtres qui s’ouvrent seules ou des alertes inquiétantes ?',
    reponses: [
      { texte: 'Non, jamais', points: 0 },
      { texte: 'Parfois', points: 2 },
      { texte: 'Souvent', points: 3 },
    ],
  },
  {
    id: 'maj',
    question: 'Les mises à jour Windows se passent-elles bien ?',
    reponses: [
      { texte: 'Oui, mon PC est à jour', points: 0 },
      { texte: 'Je ne sais pas', points: 1 },
      { texte: 'Non : erreurs, blocages ou mise à jour qui recommence', points: 2 },
    ],
  },
  {
    id: 'plantage',
    question: 'Avez-vous des écrans bleus, des plantages ou des redémarrages surprises ?',
    reponses: [
      { texte: 'Jamais', points: 0 },
      { texte: 'Rarement', points: 1 },
      { texte: 'Souvent', points: 3 },
    ],
  },
  {
    id: 'sauvegarde',
    question: 'Vos photos et documents importants sont-ils sauvegardés ailleurs que sur le PC ?',
    reponses: [
      { texte: 'Oui, régulièrement', points: 0 },
      { texte: 'Parfois, pas tout', points: 1 },
      { texte: 'Non, jamais', points: 2 },
    ],
  },
  {
    id: 'antivirus',
    question: 'Votre PC est-il protégé par un antivirus à jour (Windows Defender compte) ?',
    reponses: [
      { texte: 'Oui', points: 0 },
      { texte: 'Je ne sais pas', points: 1 },
      { texte: 'Non, ou il a expiré', points: 2 },
    ],
  },
]

const MAX = QUESTIONS.reduce((s, q) => s + Math.max(...q.reponses.map((r) => r.points)), 0)

const CONSEILS = {
  age: 'Un PC de plus de 5 ans peut encore très bien servir : un nettoyage et quelques réglages lui redonnent souvent de la vitesse.',
  demarrage: 'Un démarrage lent vient souvent de programmes qui se lancent tout seuls : on peut les désactiver sans rien perdre.',
  lenteur: 'Des lenteurs régulières peuvent venir d’un disque plein, de logiciels inutiles ou d’un programme indésirable.',
  virus: 'Publicités et fenêtres qui s’ouvrent seules sont des signes typiques de logiciels indésirables : mieux vaut ne saisir aucun mot de passe en attendant.',
  maj: 'Les mises à jour corrigent des failles de sécurité : une mise à jour bloquée doit être débloquée rapidement.',
  plantage: 'Des écrans bleus fréquents peuvent venir d’un pilote, d’une mise à jour ratée ou du matériel : un diagnostic permet d’y voir clair.',
  sauvegarde: 'Sans sauvegarde, une panne de disque ou un virus peut faire disparaître vos photos et documents pour toujours.',
  antivirus: 'Windows Defender, gratuit et intégré à Windows, suffit pour la plupart des gens… à condition qu’il soit bien activé.',
}

function analyser(reponses) {
  const points = QUESTIONS.reduce((s, q) => s + (reponses[q.id]?.points ?? 0), 0)
  const score = Math.round(100 - (points / MAX) * 100)
  // Points « à corriger » : les réponses les plus défavorables
  const soucis = QUESTIONS.filter((q) => (reponses[q.id]?.points ?? 0) >= 2).map((q) => q.id)
  const pannes = soucis.filter((id) => id !== 'sauvegarde' && id !== 'age')

  let niveau
  if (score >= 80) niveau = { titre: 'Votre PC est en bonne santé', classe: 'bon', texte: 'Rien d’alarmant : quelques bons réflexes suffisent pour qu’il le reste.' }
  else if (score >= 50) niveau = { titre: 'Votre PC mérite un petit coup de pouce', classe: 'moyen', texte: 'Quelques points à corriger avant qu’ils ne deviennent de vraies pannes.' }
  else niveau = { titre: 'Votre PC a besoin d’aide', classe: 'faible', texte: 'Plusieurs signaux d’alerte : un dépannage lui ferait le plus grand bien.' }

  let formule
  if (pannes.length >= 3 || score < 50) formule = 'approfondi'
  else if (pannes.length >= 1) formule = 'ponctuel'
  else formule = 'mensuel'
  const proposerCloud = soucis.includes('sauvegarde')

  return { score, niveau, soucis, formule, proposerCloud }
}

function Jauge({ score, classe }) {
  const r = 52
  const c = 2 * Math.PI * r
  return (
    <svg viewBox="0 0 120 120" className={`diag-jauge ${classe}`} role="img" aria-label={`Score de santé : ${score} sur 100`}>
      <circle cx="60" cy="60" r={r} className="diag-jauge-fond" />
      <circle cx="60" cy="60" r={r} className="diag-jauge-valeur" strokeDasharray={c} strokeDashoffset={c * (1 - score / 100)} />
      <text x="60" y="58" textAnchor="middle" className="diag-jauge-chiffre">{score}</text>
      <text x="60" y="78" textAnchor="middle" className="diag-jauge-sur">sur 100</text>
    </svg>
  )
}

function Resultat({ reponses, recommencer }) {
  const { score, niveau, soucis, formule, proposerCloud } = analyser(reponses)
  const f = FORMULES_VENTE[formule]
  const lienCommande = VENTE_ACTIVE ? `/commander/${formule}` : '/contact'

  return (
    <div className="diag-resultat">
      <div className="card diag-score">
        <Jauge score={score} classe={niveau.classe} />
        <div>
          <h2 className="mt-0">{niveau.titre}</h2>
          <p>{niveau.texte}</p>
        </div>
      </div>

      {soucis.length > 0 && (
        <div className="card">
          <h3 className="mt-0">Ce qu’il faut surveiller</h3>
          <ul className="diag-conseils">
            {soucis.map((id) => <li key={id}>{CONSEILS[id]}</li>)}
          </ul>
        </div>
      )}

      <div className="card diag-reco">
        <p className="eyebrow">Notre recommandation</p>
        <h3 className="mt-0">{f.nom} — {euros(f.prix)}{f.suffixe}</h3>
        <p>
          {formule === 'approfondi' && 'Plusieurs soucis à traiter : une seule session à distance pour tout remettre d’aplomb.'}
          {formule === 'ponctuel' && 'Un point précis à régler : une session à distance suffit, vous suivez tout en direct.'}
          {formule === 'mensuel' && 'Votre PC va bien : pour qu’il reste en forme, l’assistance illimitée vous permet de demander de l’aide dès le moindre souci.'}
        </p>
        {proposerCloud && (
          <p className="diag-cloud">
            ☁️ <strong>Vos fichiers ne sont pas sauvegardés.</strong> Le Forfait mensuel ({euros(FORMULES_VENTE.mensuel.prix)}/mois) inclut 50 Go de cloud
            sauvegardé chaque nuit pour les mettre à l’abri. <Link to="/services#cloud">En savoir plus</Link>
          </p>
        )}
        <div className="btn-row">
          <Link to={lienCommande} className="btn btn-primary btn-lg">{VENTE_ACTIVE ? 'Commander' : 'Demander de l’aide'}</Link>
          <Link to="/contact" className="btn btn-outline btn-lg">Poser une question</Link>
        </div>
      </div>

      <p className="small center">
        Ce test donne une indication, il ne remplace pas un vrai diagnostic. Vos réponses restent sur votre appareil : rien n’est envoyé.{' '}
        <button type="button" className="diag-lien" onClick={recommencer}>Refaire le test</button>
      </p>
    </div>
  )
}

export default function Diagnostic() {
  useDocumentMeta(
    'Diagnostic gratuit : votre PC est-il en bonne santé ?',
    'Test gratuit en 8 questions pour savoir si votre PC Windows est en bonne santé : score, conseils personnalisés et solution adaptée.',
    '/diagnostic'
  )
  const [etape, setEtape] = useState(0)
  const [reponses, setReponses] = useState({})
  const fini = etape >= QUESTIONS.length
  const q = QUESTIONS[etape]

  function repondre(r) {
    setReponses((x) => ({ ...x, [q.id]: r }))
    setEtape((e) => e + 1)
  }
  function recommencer() {
    setReponses({})
    setEtape(0)
  }

  return (
    <>
      <section className="page-hero page-hero-simple">
        <div className="container" style={{ maxWidth: 760 }}>
          <p className="eyebrow">Diagnostic gratuit · 2 minutes</p>
          <h1>Votre PC est-il <span className="hl">en bonne santé ?</span></h1>
          <p className="lead">8 questions simples, sans rien installer. Vous obtenez un score, des conseils et la solution adaptée à votre situation.</p>
        </div>
      </section>

      <section style={{ paddingTop: 0 }}>
        <div className="container" style={{ maxWidth: 760 }}>
          {fini ? (
            <Resultat reponses={reponses} recommencer={recommencer} />
          ) : (
            <div className="card diag-question" aria-live="polite">
              <div className="diag-progression" aria-hidden="true">
                <div style={{ width: `${(etape / QUESTIONS.length) * 100}%` }} />
              </div>
              <p className="small">Question {etape + 1} sur {QUESTIONS.length}</p>
              <h2>{q.question}</h2>
              <div className="diag-reponses">
                {q.reponses.map((r) => (
                  <button key={r.texte} type="button" className="diag-reponse" onClick={() => repondre(r)}>{r.texte}</button>
                ))}
              </div>
              {etape > 0 && (
                <button type="button" className="diag-lien" onClick={() => setEtape((e) => e - 1)}>← Question précédente</button>
              )}
            </div>
          )}
        </div>
      </section>
    </>
  )
}
