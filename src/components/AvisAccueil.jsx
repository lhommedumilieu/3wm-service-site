import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { listerAvisPublies, resumeAvis } from '../lib/avisApi.js'
import { Etoiles } from '../pages/Avis.jsx'
import '../avis.css'

// Bloc « Avis clients » pour la page d'accueil.
// Il reste invisible tant qu'aucun avis n'a été validé.
export default function AvisAccueil() {
  const [resume, setResume] = useState(null)
  const [avis, setAvis] = useState([])

  useEffect(() => {
    Promise.all([resumeAvis(), listerAvisPublies(0, 3)])
      .then(([r, l]) => { setResume(r); setAvis(l) })
      .catch(() => {})
  }, [])

  if (!resume?.nombre) return null

  return (
    <section>
      <div className="container">
        <div className="avis-liste-tete">
          <div>
            <p className="eyebrow">Avis clients</p>
            <h2 className="mt-0">Ils m'ont fait confiance</h2>
            <p className="small">
              <Etoiles note={resume.moyenne} /> {String(resume.moyenne).replace('.', ',')}/5 · {resume.nombre} avis
            </p>
          </div>
          <Link to="/avis" className="btn btn-outline">Voir tous les avis →</Link>
        </div>
        <div className="avis-grille-accueil">
          {avis.map((a) => (
            <div key={a.id} className="card">
              <Etoiles note={a.note} />
              <p className="avis-texte">{a.contenu.length > 180 ? `${a.contenu.slice(0, 180)}…` : a.contenu}</p>
              <strong className="small">— {a.author_name}</strong>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
