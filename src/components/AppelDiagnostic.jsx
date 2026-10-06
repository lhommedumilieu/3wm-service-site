import { Link } from 'react-router-dom'
import '../diagnostic.css'

// Petit encart qui invite à faire le diagnostic gratuit
export default function AppelDiagnostic() {
  return (
    <div className="diag-appel">
      <p>
        <strong>🩺 Vous hésitez ?</strong> Faites le diagnostic gratuit : 8 questions, 2 minutes, et vous savez
        quelle formule vous convient.
      </p>
      <Link to="/diagnostic" className="btn btn-primary">Faire le diagnostic gratuit</Link>
    </div>
  )
}
