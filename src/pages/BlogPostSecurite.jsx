import { Link } from 'react-router-dom'

export default function BlogPostSecurite() {
  return (
    <>
      <div className="page-header">
        <div className="container">
          <h1>5 réflexes de cybersécurité à adopter au quotidien</h1>
          <p className="post-meta">Par L'Homme-du-Milieu · Cybersécurité</p>
        </div>
      </div>

      <section>
        <div className="container">
          <article className="post-body" style={{ maxWidth: 720, margin: '0 auto' }}>
            <p>Pas besoin d'être expert pour se protéger efficacement. La majorité des incidents viennent de quelques négligences évitables. Voici cinq réflexes simples, expliqués plus en détail dans nos ebooks.</p>

            <h2>1. Un gestionnaire de mots de passe</h2>
            <p>Réutiliser le même mot de passe partout est l'une des failles les plus exploitées. Un gestionnaire de mots de passe génère et retient des mots de passe uniques et robustes pour chaque service, pour un seul mot de passe maître à retenir.</p>

            <h2>2. La double authentification (2FA)</h2>
            <p>Même avec un mot de passe volé, la double authentification (code envoyé par SMS ou application dédiée) bloque la grande majorité des tentatives d'intrusion. À activer en priorité sur les comptes e-mail et bancaires.</p>

            <h2>3. Les mises à jour, sans les repousser</h2>
            <p>La plupart des failles exploitées sont déjà corrigées par un correctif disponible. Activer les mises à jour automatiques du système et des logiciels ferme la porte à une grande partie des attaques automatisées.</p>

            <h2>4. Se méfier des liens et pièces jointes inattendus</h2>
            <p>Le phishing reste la porte d'entrée numéro un. Avant de cliquer, on vérifie l'expéditeur, on survole le lien sans cliquer pour voir la vraie destination, et en cas de doute, on contacte l'organisme directement par un autre canal.</p>

            <h2>5. Des sauvegardes régulières</h2>
            <p>Face à une panne, un vol ou un ransomware, une sauvegarde récente (idéalement hors ligne ou sur un service séparé) transforme un désastre en simple contrariété.</p>

            <h2>Pour aller plus loin</h2>
            <p>Ces réflexes sont détaillés, avec des exemples concrets, dans le <Link to="/boutique">Tome 1 — Linux pour débutants, fondamentaux cybersécurité</Link>. Et si vous préférez une assistance directe, 3WM Service propose du <Link to="/services">dépannage informatique à distance</Link>.</p>
          </article>
        </div>
      </section>
    </>
  )
}
