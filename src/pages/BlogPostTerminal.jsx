import { Link } from 'react-router-dom'

export default function BlogPostTerminal() {
  return (
    <>
      <div className="page-header">
        <div className="container">
          <h1>Premiers pas dans le terminal Linux : les commandes à connaître</h1>
          <p className="post-meta">Par L'Homme-du-Milieu · Prise en main</p>
        </div>
      </div>

      <section>
        <div className="container">
          <article className="post-body" style={{ maxWidth: 720, margin: '0 auto' }}>
            <p>Le terminal fait peur à beaucoup de débutants — à tort. Quelques commandes suffisent pour se sentir à l'aise dans 90 % des situations du quotidien. Voici les bases, celles que l'on retrouve dès les premiers chapitres du <Link to="/boutique">Tome 1 — Linux pour débutants</Link>.</p>

            <h2>Se repérer dans les dossiers</h2>
            <p>Trois commandes suffisent pour naviguer :</p>
            <pre><code>{`pwd     # affiche le dossier actuel
ls      # liste les fichiers du dossier
cd nom_du_dossier   # se déplacer dans un dossier`}</code></pre>

            <h2>Manipuler des fichiers</h2>
            <pre><code>{`touch fichier.txt      # créer un fichier vide
mkdir nouveau_dossier  # créer un dossier
cp source destination  # copier
mv source destination  # déplacer / renommer
rm fichier.txt         # supprimer (prudence, pas de corbeille !)`}</code></pre>

            <h2>Comprendre les droits (permissions)</h2>
            <p>Sous Linux, chaque fichier a des permissions de lecture, écriture et exécution. La commande <code>ls -l</code> les affiche, et <code>chmod</code> permet de les modifier. C'est un concept central pour comprendre la sécurité du système — abordé en détail dans le Tome 1.</p>

            <h2>Installer des logiciels</h2>
            <p>Selon la distribution :</p>
            <pre><code>{`# Debian / Ubuntu
sudo apt update && sudo apt install nom_du_paquet

# Fedora
sudo dnf install nom_du_paquet`}</code></pre>

            <h2>Le mot de la fin</h2>
            <p>Le terminal n'est pas là pour intimider : c'est l'outil le plus direct pour comprendre ce que fait réellement votre système. Une fois ces quelques commandes en main, la suite vient naturellement.</p>

            <p>Pour aller plus loin, méthodiquement et sans jargon inutile, retrouvez le <Link to="/boutique">Tome 1 — Linux pour débutants</Link> dans la boutique. Et si vous préférez qu'on s'en charge pour vous, 3WM Service propose aussi du <Link to="/services">dépannage à distance</Link>.</p>
          </article>
        </div>
      </section>
    </>
  )
}
