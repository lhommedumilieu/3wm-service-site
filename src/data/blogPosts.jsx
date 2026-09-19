import { Link } from 'react-router-dom'

// Chaque article : slug (utilisé dans l'URL /blog/<slug>), titre, catégorie,
// résumé (affiché sur l'index du blog), et Body (le contenu JSX de l'article).
// Pour ajouter un nouveau tuto : dupliquer une entrée, changer le slug/titre/
// catégorie/résumé, et écrire le Body. Rien d'autre à toucher : l'index du
// blog et le routage se mettent à jour automatiquement.

export const blogPosts = [
  {
    slug: 'premiers-pas-terminal-linux',
    title: 'Premiers pas dans le terminal Linux : les commandes à connaître',
    category: 'Prise en main',
    excerpt: "Un tour d'horizon des commandes essentielles pour ne plus avoir peur du terminal.",
    Body: () => (
      <>
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
      </>
    ),
  },
  {
    slug: '5-reflexes-cybersecurite-quotidien',
    title: '5 réflexes de cybersécurité à adopter au quotidien',
    category: 'Cybersécurité',
    excerpt: "Des gestes simples et efficaces pour réduire considérablement les risques, sans être expert.",
    Body: () => (
      <>
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
      </>
    ),
  },
  {
    slug: 'windows-lent-verifications-avant-depannage',
    title: 'Windows lent : 7 vérifications à faire avant d\'appeler un dépanneur',
    category: 'Dépannage Windows',
    excerpt: "Un PC qui traîne n'est pas toujours synonyme de panne grave. Voici les vérifications simples à faire en premier.",
    Body: () => (
      <>
        <p>Un ordinateur Windows qui ralentit d'un coup inquiète — mais la cause est souvent bénigne et se corrige en quelques minutes. Avant de contacter un dépanneur, voici sept points à vérifier soi-même.</p>

        <h2>1. Redémarrer, tout simplement</h2>
        <p>Après plusieurs jours sans redémarrage, la mémoire vive se sature de processus qui ne se ferment jamais vraiment. Un redémarrage complet (pas juste une mise en veille) règle une bonne partie des lenteurs du quotidien.</p>

        <h2>2. Regarder ce qui démarre avec Windows</h2>
        <p>Ouvrez le Gestionnaire des tâches (<code>Ctrl+Maj+Échap</code>), onglet « Démarrage ». Désactivez les logiciels que vous n'utilisez pas au quotidien : chaque programme lancé automatiquement ralentit le démarrage et consomme des ressources en arrière-plan.</p>

        <h2>3. Vérifier l'espace disque disponible</h2>
        <p>Un disque système rempli à plus de 90 % ralentit fortement Windows, en particulier sur un SSD. Dans l'Explorateur de fichiers, clic droit sur le disque <code>C:</code> → Propriétés, pour voir l'espace restant.</p>

        <h2>4. Laisser les mises à jour se terminer</h2>
        <p>Une mise à jour Windows en cours d'installation en arrière-plan peut ralentir la machine pendant plusieurs heures. Vérifiez dans Paramètres → Windows Update qu'aucune installation n'est en attente d'un redémarrage.</p>

        <h2>5. Faire une analyse antivirus</h2>
        <p>Un programme malveillant en arrière-plan est une cause fréquente de ralentissement. Windows Defender, déjà intégré, suffit pour une analyse complète : Paramètres → Confidentialité et sécurité → Sécurité Windows → Analyse complète.</p>

        <h2>6. Vérifier l'état du disque dur</h2>
        <p>Sur un ordinateur plus ancien équipé d'un disque dur mécanique (et non d'un SSD), une baisse progressive des performances peut signaler un disque en fin de vie. C'est un point qu'un dépanneur peut diagnostiquer rapidement si le problème persiste après les étapes précédentes.</p>

        <h2>7. Un dépoussiérage ne fait jamais de mal</h2>
        <p>Sur un ordinateur qui chauffe, le processeur ralentit volontairement ses performances pour se protéger (le « thermal throttling »). Un nettoyage des grilles d'aération, surtout sur un ordinateur portable, peut suffire à retrouver des performances normales.</p>

        <h2>Et si rien de tout ça ne suffit ?</h2>
        <p>Si le problème persiste après ces vérifications, il s'agit probablement d'une cause plus profonde (disque en fin de vie, logiciel corrompu, Windows à réinitialiser). C'est là qu'une <Link to="/services">assistance à distance</Link> devient utile : un diagnostic précis évite de changer une pièce ou de réinstaller le système pour rien.</p>
      </>
    ),
  },
  {
    slug: 'securiser-windows-gratuitement',
    title: 'Sécuriser son PC Windows sans rien dépenser',
    category: 'Sécurité Windows',
    excerpt: "Windows intègre déjà de quoi bien se protéger. Voici comment en tirer parti, sans acheter le moindre logiciel.",
    Body: () => (
      <>
        <p>Beaucoup pensent qu'il faut acheter un antivirus payant pour être bien protégé sous Windows. Ce n'est plus vraiment le cas : Windows intègre aujourd'hui des outils de sécurité solides, à condition de les activer et de les utiliser correctement.</p>

        <h2>Laisser Windows Defender actif</h2>
        <p>Windows Defender, intégré à Windows depuis Windows 8, obtient régulièrement de bons résultats face aux menaces courantes. Sauf besoin spécifique, il n'est pas nécessaire d'installer un antivirus tiers qui, en plus d'être payant, peut ralentir la machine et créer des conflits.</p>

        <h2>Activer les mises à jour automatiques</h2>
        <p>La grande majorité des attaques exploitent des failles déjà corrigées. Dans Paramètres → Windows Update, vérifiez que les mises à jour automatiques sont actives, et ne repoussez pas indéfiniment un redémarrage en attente.</p>

        <h2>Utiliser un compte standard au quotidien</h2>
        <p>Un compte administrateur permet d'installer n'importe quel logiciel sans confirmation supplémentaire — y compris un programme malveillant. Utiliser un compte « standard » pour les tâches courantes, et ne passer en administrateur que lorsque c'est nécessaire, limite les dégâts en cas d'erreur ou de mauvaise manipulation.</p>

        <h2>Activer le pare-feu Windows</h2>
        <p>Le pare-feu intégré (Sécurité Windows → Pare-feu et protection réseau) est actif par défaut sur la plupart des installations. Il mérite néanmoins d'être vérifié, en particulier après une réinstallation ou l'usage d'un logiciel tiers qui aurait pu le désactiver.</p>

        <h2>Faire des sauvegardes régulières</h2>
        <p>Aucune protection n'est efficace à 100 %. Une sauvegarde régulière des fichiers importants — sur un disque externe ou un service cloud — reste la meilleure assurance contre un ransomware, une panne matérielle ou une erreur humaine.</p>

        <h2>Se méfier des logiciels « gratuits »</h2>
        <p>Beaucoup de programmes malveillants s'installent via des logiciels gratuits téléchargés en dehors des sources officielles. Télécharger uniquement depuis les sites des éditeurs ou le Microsoft Store réduit fortement ce risque.</p>

        <h2>Pour aller plus loin</h2>
        <p>Ces bases suffisent à couvrir l'essentiel des menaces courantes. Pour approfondir la logique derrière ces protections — et découvrir comment les mêmes principes s'appliquent sous Linux — le <Link to="/boutique">Tome 1 — Linux pour débutants, fondamentaux cybersécurité</Link> pose des bases solides, accessibles sans prérequis technique.</p>
      </>
    ),
  },
  {
    slug: 'pourquoi-essayer-linux-quand-on-vient-de-windows',
    title: "Pourquoi (et comment) essayer Linux quand on vient de Windows",
    category: 'Découverte Linux',
    excerpt: "Pas besoin de tout changer d'un coup : voici les façons les plus simples de découvrir Linux sans risque.",
    Body: () => (
      <>
        <p>Beaucoup d'utilisateurs de Windows sont curieux de Linux, notamment pour progresser en cybersécurité, mais hésitent par peur de « casser » leur ordinateur. Bonne nouvelle : il existe plusieurs façons d'essayer Linux sans rien risquer sur sa machine actuelle.</p>

        <h2>Pourquoi s'y intéresser</h2>
        <p>Linux est la base de la plupart des outils et méthodologies utilisés en cybersécurité (Kali Linux en est un exemple direct). Comprendre son fonctionnement — la ligne de commande, les permissions, la gestion des paquets — donne une compréhension plus fine de l'informatique en général, y compris pour mieux sécuriser ses machines Windows au quotidien.</p>

        <h2>Option 1 : une clé USB « live », sans rien installer</h2>
        <p>Une clé USB « live » permet de démarrer temporairement sur Linux sans toucher au disque dur de l'ordinateur. Une fois l'ordinateur redémarré normalement, Windows retrouve son état initial, inchangé. C'est la façon la plus simple et la plus sûre de se faire une première impression.</p>

        <h2>Option 2 : une machine virtuelle</h2>
        <p>Un logiciel de virtualisation (gratuit) permet de faire tourner Linux dans une fenêtre, comme une application, pendant que Windows continue de fonctionner normalement à côté. C'est l'option la plus confortable pour s'exercer régulièrement sans double démarrage.</p>

        <h2>Option 3 : WSL, Linux directement dans Windows</h2>
        <p>Windows propose depuis plusieurs années un sous-système Linux intégré (WSL), installable en une seule commande depuis un terminal Windows. Il permet d'utiliser un vrai terminal Linux directement depuis Windows, sans machine virtuelle ni redémarrage — pratique pour s'entraîner à la ligne de commande au quotidien.</p>

        <h2>Et le double démarrage (dual boot) ?</h2>
        <p>Installer Linux à côté de Windows sur le même disque est possible, mais c'est l'option la plus technique et la seule qui modifie réellement la configuration de l'ordinateur. Elle est à réserver à ceux qui sont déjà à l'aise avec les trois options précédentes.</p>

        <h2>Par où commencer concrètement</h2>
        <p>Le <Link to="/boutique">Tome 1 — Linux pour débutants</Link> accompagne pas à pas l'installation (avec la méthode la plus sûre pour débuter) et la prise en main du terminal, sans prérequis technique. Une fois les bases posées, le <Link to="/boutique">Tome 2 — Kali Linux &amp; Méthodologie Pentest</Link> prend le relais pour progresser vers la cybersécurité offensive.</p>
      </>
    ),
  },
]

export function getBlogPost(slug) {
  return blogPosts.find((post) => post.slug === slug)
}
