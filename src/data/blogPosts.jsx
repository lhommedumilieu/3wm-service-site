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
  {
    slug: 'windows-ne-demarre-plus-guide-etape-par-etape',
    title: "Windows ne démarre plus : le guide étape par étape avant de paniquer",
    category: 'Dépannage Windows',
    excerpt: "Écran noir, boucle de redémarrage, message d'erreur au démarrage : la marche à suivre, dans l'ordre, avant d'envisager le pire.",
    Body: () => (
      <>
        <p>Un ordinateur qui refuse de démarrer est l'une des pannes les plus stressantes — parce qu'on a l'impression d'avoir tout perdu d'un coup. Dans la grande majorité des cas pourtant, rien n'est perdu : il s'agit d'un blocage logiciel qui se résout en suivant quelques étapes, dans l'ordre.</p>

        <h2>Étape 1 : un redémarrage forcé, proprement</h2>
        <p>Maintenez le bouton d'alimentation enfoncé pendant une dizaine de secondes pour forcer l'extinction complète, attendez quelques secondes, puis rallumez normalement. Cela règle à lui seul une bonne partie des blocages liés à un composant qui n'a pas répondu correctement à l'arrêt précédent.</p>

        <h2>Étape 2 : débrancher les périphériques USB</h2>
        <p>Une clé USB, un disque externe ou même certains claviers/souris peuvent, dans de rares cas, perturber le démarrage si Windows tente de démarrer dessus par erreur. Débranchez tout ce qui n'est pas indispensable (clavier et souris mis à part) avant de rallumer.</p>

        <h2>Étape 3 : accéder au mode sans échec</h2>
        <p>Si l'écran reste noir ou boucle, il faut atteindre les options de récupération. La méthode la plus fiable : forcer l'extinction pendant le démarrage de Windows, à trois reprises consécutives. Windows détecte l'échec répété et lance automatiquement l'environnement de récupération (« Options de démarrage avancées »).</p>
        <p>Depuis cet écran : <em>Dépannage → Options avancées → Paramètres de démarrage → Redémarrer</em>, puis choisissez le mode sans échec (touche 4 ou F4). Si Windows démarre normalement en mode sans échec, le problème vient très probablement d'un pilote ou d'un logiciel récemment installé, pas du matériel.</p>

        <h2>Étape 4 : la réparation au démarrage</h2>
        <p>Depuis le même écran d'options avancées, <em>Réparation du démarrage</em> analyse et corrige automatiquement les erreurs les plus courantes (fichiers de démarrage corrompus, configuration de démarrage endommagée). C'est souvent la première chose à essayer avant d'aller plus loin.</p>

        <h2>Étape 5 : revenir en arrière avec un point de restauration</h2>
        <p>Si le problème est apparu après l'installation d'un programme ou d'une mise à jour, <em>Restauration du système</em> (accessible depuis les mêmes options avancées) permet de ramener Windows à un état antérieur fonctionnel, sans toucher aux documents personnels.</p>

        <h2>Quand s'inquiéter davantage</h2>
        <p>Si aucune de ces étapes n'aboutit, ou si l'ordinateur émet des bips répétés, des bruits de cliquetis, ou ne s'allume même plus du tout (aucun voyant, aucun ventilateur), la piste matérielle devient plus probable : disque dur en fin de vie, mémoire défectueuse, ou alimentation en cause. Un diagnostic à distance permet souvent d'identifier précisément la cause avant de remplacer quoi que ce soit inutilement.</p>

        <h2>Le mot de la fin</h2>
        <p>Dans l'immense majorité des cas, un Windows qui ne démarre plus se répare sans perte de données et sans réinstallation complète. Si malgré ces étapes la situation reste bloquée, 3WM Service propose un <Link to="/services">dépannage à distance</Link> pour diagnostiquer et résoudre le problème sans déplacement.</p>
      </>
    ),
  },
  {
    slug: 'reconnaitre-un-email-de-phishing',
    title: 'Reconnaître un email de phishing : les signaux qui ne trompent pas',
    category: 'Cybersécurité',
    excerpt: "Les emails frauduleux sont de plus en plus convaincants. Voici les vérifications simples, en moins d'une minute, pour ne pas se faire piéger.",
    Body: () => (
      <>
        <p>Le phishing (hameçonnage) reste la porte d'entrée numéro un des attaques informatiques, parce qu'il ne vise pas une faille technique mais l'attention de la personne derrière l'écran. Bonne nouvelle : quelques vérifications simples suffisent à repérer la grande majorité des tentatives.</p>

        <h2>1. Vérifier l'adresse d'expéditeur, pas juste le nom affiché</h2>
        <p>Un email peut afficher « Votre Banque » alors que l'adresse réelle derrière est incohérente (une suite de caractères aléatoires, un domaine qui ressemble mais n'est pas exactement le bon). Cliquez ou survolez le nom de l'expéditeur pour voir l'adresse complète avant de faire confiance au message.</p>

        <h2>2. Survoler les liens avant de cliquer</h2>
        <p>Sur ordinateur, le fait de survoler un lien (sans cliquer) affiche généralement sa vraie destination en bas de la fenêtre. Si le texte dit « moncompte-banque.fr » mais que le lien pointe vers une adresse totalement différente, c'est un signal d'alerte immédiat.</p>

        <h2>3. Se méfier de l'urgence et de la menace</h2>
        <p>« Votre compte sera suspendu dans 24h », « Activité suspecte détectée », « Dernier rappel avant blocage » : créer un sentiment d'urgence est une technique délibérée pour pousser à agir vite, sans réfléchir. Une organisation sérieuse ne demande jamais de saisir un mot de passe ou des données bancaires dans l'urgence via un simple email.</p>

        <h2>4. Se méfier des pièces jointes inattendues</h2>
        <p>Une facture, un « colis en attente » ou un CV que vous n'attendiez pas est une pièce jointe à ne pas ouvrir, surtout si le message insiste pour que vous l'ouvriez rapidement. En cas de doute, contactez l'expéditeur supposé par un autre canal pour confirmer qu'il s'agit bien de lui.</p>

        <h2>5. Fautes, mise en page approximative, logos flous</h2>
        <p>Les tentatives les moins sophistiquées se trahissent encore par des fautes d'orthographe, une mise en forme qui ne correspond pas à l'identité visuelle habituelle de l'organisme, ou un logo de mauvaise qualité. Ce signal devient toutefois moins fiable : les campagnes les plus récentes sont souvent parfaitement imitées.</p>

        <h2>Que faire en cas de doute</h2>
        <p>Ne cliquez sur rien et ne répondez pas. Contactez l'organisme concerné directement, via son site officiel tapé à la main dans le navigateur ou son numéro de téléphone habituel — jamais via les coordonnées données dans l'email suspect.</p>

        <h2>Et si vous avez déjà cliqué ?</h2>
        <p>Si des identifiants ont été saisis par erreur sur une fausse page, changez le mot de passe du compte concerné immédiatement, activez la double authentification si ce n'est pas déjà fait, et surveillez l'activité du compte dans les jours qui suivent. Si un fichier a été ouvert, une analyse antivirus complète s'impose sans attendre.</p>

        <h2>Pour aller plus loin</h2>
        <p>Ce réflexe fait partie des bases couvertes dans le <Link to="/boutique">Tome 1 — Linux pour débutants, fondamentaux cybersécurité</Link>. En cas de doute sur une machine potentiellement compromise, 3WM Service peut faire un <Link to="/services">diagnostic complet à distance</Link>.</p>
      </>
    ),
  },
  {
    slug: 'liberer-espace-disque-windows',
    title: "Libérer de l'espace disque sous Windows sans rien supprimer d'important",
    category: 'Dépannage Windows',
    excerpt: "Un disque C: presque plein ralentit tout le système. Voici comment récupérer plusieurs gigaoctets en toute sécurité.",
    Body: () => (
      <>
        <p>Un disque système rempli à plus de 90 % ralentit fortement Windows, en particulier sur un SSD, et peut même bloquer certaines mises à jour. La bonne nouvelle : il existe presque toujours plusieurs gigaoctets à récupérer sans toucher à un seul document personnel.</p>

        <h2>Le nettoyage de disque intégré</h2>
        <p>Windows embarque un outil dédié, souvent sous-utilisé. Recherchez « Nettoyage de disque » dans le menu Démarrer, sélectionnez le disque <code>C:</code>, puis cliquez sur « Nettoyer les fichiers système ». Cochez notamment les fichiers temporaires, la corbeille, et surtout <strong>les anciennes installations de Windows</strong> (dossier <code>Windows.old</code>), qui peuvent à eux seuls représenter 10 à 20 Go après une mise à niveau majeure.</p>

        <h2>Activer Storage Sense</h2>
        <p>Dans <em>Paramètres → Système → Stockage</em>, l'option « Storage Sense » (Assistant stockage) automatise ce nettoyage : elle supprime régulièrement les fichiers temporaires et vide la corbeille après un délai que vous choisissez. Une fois activée, plus besoin d'y penser.</p>

        <h2>Vider le dossier Téléchargements</h2>
        <p>C'est souvent le plus gros oubli : le dossier « Téléchargements » accumule des années d'installateurs, de PDF et de fichiers ouverts une seule fois puis jamais supprimés. Un tri rapide, trié par taille de fichier dans l'Explorateur, permet d'identifier immédiatement les plus gros éléments à supprimer.</p>

        <h2>Désinstaller les logiciels inutilisés</h2>
        <p>Dans <em>Paramètres → Applications</em>, triez la liste par taille pour repérer les logiciels volumineux installés il y a longtemps et jamais réellement utilisés. Une désinstallation propre libère l'espace immédiatement, contrairement à une simple suppression du raccourci.</p>

        <h2>Le dossier WinSxS et l'hibernation</h2>
        <p>Deux éléments techniques prennent souvent plus de place qu'on ne l'imagine : le dossier <code>WinSxS</code> (composants système, nécessaire au bon fonctionnement de Windows — à ne jamais supprimer manuellement, seul l'outil de nettoyage système sait le faire proprement) et le fichier d'hibernation <code>hiberfil.sys</code>, qui peut représenter plusieurs gigaoctets si la mise en veille prolongée n'est pas utilisée.</p>

        <h2>Déporter les gros fichiers</h2>
        <p>Photos, vidéos et archives volumineuses gagnent à être déplacées vers un disque externe ou un service de stockage en ligne, en particulier sur un ordinateur portable équipé d'un SSD de petite capacité (128 ou 256 Go).</p>

        <h2>Si le disque se remplit encore vite après tout ça</h2>
        <p>Un disque qui se remplit anormalement vite malgré ce nettoyage peut indiquer un problème plus profond (journal système qui grossit sans fin, logiciel malveillant qui télécharge en arrière-plan). Un <Link to="/services">diagnostic à distance</Link> permet d'identifier précisément la cause.</p>
      </>
    ),
  },
  {
    slug: 'permissions-fichiers-linux-chmod-chown',
    title: 'Les permissions de fichiers sous Linux expliquées simplement',
    category: 'Approfondir Linux',
    excerpt: "rwx, chmod, chown : ce que ces lettres et ces commandes veulent vraiment dire, sans jargon inutile.",
    Body: () => (
      <>
        <p>Les permissions sont l'un des concepts les plus centraux de Linux — et l'un de ceux qui intimident le plus au début. En réalité, une fois les bases posées (voir <Link to="/blog/premiers-pas-terminal-linux">premiers pas dans le terminal</Link>), c'est d'une logique assez simple.</p>

        <h2>Lire une ligne <code>ls -l</code></h2>
        <p>La commande <code>ls -l</code> affiche le détail de chaque fichier, permissions comprises :</p>
        <pre><code>{`-rw-r--r-- 1 utilisateur groupe 4096 18 sept. 14:32 rapport.txt`}</code></pre>
        <p>Les dix premiers caractères décrivent les permissions. Le premier indique le type (<code>-</code> pour un fichier normal, <code>d</code> pour un dossier). Les neuf suivants se lisent par groupes de trois : propriétaire, groupe, puis tout le monde.</p>

        <h2>Comprendre read, write, execute</h2>
        <p>Chaque groupe de trois lettres correspond à trois droits possibles :</p>
        <pre><code>{`r = read (lecture)
w = write (écriture / modification)
x = execute (exécution, ou accès à un dossier)`}</code></pre>
        <p>Dans l'exemple ci-dessus, <code>rw-r--r--</code> signifie : le propriétaire peut lire et écrire, le groupe peut seulement lire, et tout le monde peut seulement lire.</p>

        <h2>Modifier les permissions avec <code>chmod</code></h2>
        <p>La commande <code>chmod</code> change ces droits. Elle s'utilise le plus souvent avec une notation en chiffres, où chaque droit a une valeur : lecture = 4, écriture = 2, exécution = 1. On additionne les valeurs souhaitées pour chaque catégorie :</p>
        <pre><code>{`chmod 644 fichier.txt   # propriétaire: lecture+écriture (6) / groupe: lecture (4) / autres: lecture (4)
chmod 755 script.sh     # propriétaire: tout (7) / groupe: lecture+exécution (5) / autres: lecture+exécution (5)
chmod +x script.sh      # ajouter uniquement le droit d'exécution, plus simple à retenir`}</code></pre>

        <h2>Changer le propriétaire avec <code>chown</code></h2>
        <p>Quand un fichier appartient au mauvais utilisateur (après une copie depuis une clé USB par exemple), <code>chown</code> permet de corriger cela :</p>
        <pre><code>{`sudo chown utilisateur:groupe fichier.txt`}</code></pre>
        <p>Le <code>sudo</code> est généralement nécessaire, car changer le propriétaire d'un fichier est une opération sensible réservée à l'administrateur du système.</p>

        <h2>Pourquoi c'est important pour la sécurité</h2>
        <p>Une mauvaise gestion des permissions est une cause fréquente de failles : un fichier de configuration lisible par tout le monde peut exposer des mots de passe, un script exécutable par n'importe qui peut être détourné. Comprendre et vérifier régulièrement les permissions de ses fichiers sensibles est un réflexe de base, aussi bien pour un usage personnel que pour la cybersécurité au sens large.</p>

        <h2>Pour aller plus loin</h2>
        <p>Ce sujet est développé avec davantage d'exemples pratiques dans le <Link to="/boutique">Tome 1 — Linux pour débutants</Link>, qui pose les bases nécessaires avant d'aborder Kali Linux dans le Tome 2.</p>
      </>
    ),
  },
  {
    slug: 'vpn-a-quoi-ca-sert-vraiment',
    title: "VPN : à quoi ça sert vraiment (et quand on peut s'en passer)",
    category: 'Cybersécurité',
    excerpt: "Entre le marketing agressif de certaines publicités et la réalité technique, voici ce qu'un VPN protège vraiment — et ce qu'il ne protège pas.",
    Body: () => (
      <>
        <p>Le VPN (réseau privé virtuel) est souvent présenté comme une protection quasi magique contre tous les dangers d'internet. La réalité est plus nuancée : c'est un outil utile, mais pour des usages précis, pas une solution de sécurité universelle.</p>

        <h2>Ce qu'un VPN fait réellement</h2>
        <p>Un VPN crée un tunnel chiffré entre votre appareil et un serveur intermédiaire. Concrètement, cela empêche les personnes situées sur le même réseau local (par exemple un Wi-Fi public) de voir le contenu de votre trafic, et masque votre adresse IP réelle vis-à-vis des sites que vous visitez, qui ne voient que celle du serveur VPN.</p>

        <h2>Les cas où c'est réellement utile</h2>
        <p>Sur un Wi-Fi public (café, aéroport, hôtel), un VPN protège efficacement contre l'interception de trafic non chiffré. Il permet aussi d'accéder à des contenus limités géographiquement, ou simplement de réduire ce que votre fournisseur d'accès internet peut voir de votre navigation.</p>

        <h2>Ce qu'un VPN ne protège pas</h2>
        <p>Un VPN ne protège ni contre le phishing, ni contre un logiciel malveillant déjà téléchargé, ni contre un mot de passe faible ou réutilisé. Il ne rend pas non plus anonyme : dès qu'on se connecte à un compte personnel (email, réseau social), le site sait exactement qui navigue, VPN ou non. Sur la plupart des sites en HTTPS (le cadenas dans la barre d'adresse), le contenu échangé est déjà chiffré, avec ou sans VPN.</p>

        <h2>Bien choisir son fournisseur</h2>
        <p>Un VPN déplace la confiance : au lieu de faire confiance à votre fournisseur d'accès internet, vous faites confiance au fournisseur du VPN, qui voit potentiellement tout votre trafic. Une politique de non-conservation des journaux (« no-log ») vérifiée par un audit indépendant, et une juridiction claire, sont les critères les plus importants — bien plus que le prix ou le nombre de serveurs annoncés.</p>

        <h2>Et au quotidien, à la maison ?</h2>
        <p>Sur un réseau domestique de confiance, avec des sites en HTTPS, l'intérêt d'un VPN activé en permanence est plus limité qu'on ne le pense. Il reste néanmoins pertinent en déplacement, sur les réseaux publics, ou pour qui souhaite simplement limiter ce que son fournisseur d'accès peut observer.</p>

        <h2>Pour aller plus loin</h2>
        <p>Le VPN n'est qu'une pièce du puzzle : les réflexes essentiels de cybersécurité au quotidien sont détaillés dans <Link to="/blog/5-reflexes-cybersecurite-quotidien">cet article</Link> et développés dans le <Link to="/boutique">Tome 1 — Linux pour débutants, fondamentaux cybersécurité</Link>.</p>
      </>
    ),
  },
  {
    slug: 'creer-cle-usb-bootable-linux',
    title: 'Créer une clé USB bootable pour essayer Linux : le guide complet',
    category: 'Découverte Linux',
    excerpt: "La méthode la plus sûre pour découvrir Linux sans rien changer sur son PC, expliquée pas à pas.",
    Body: () => (
      <>
        <p>Comme évoqué dans <Link to="/blog/pourquoi-essayer-linux-quand-on-vient-de-windows">l'article sur les façons d'essayer Linux</Link>, la clé USB « live » est la méthode la plus sûre pour se faire une première impression : rien n'est installé sur le disque dur, et l'ordinateur retrouve Windows intact au redémarrage suivant. Voici comment procéder concrètement.</p>

        <h2>Ce qu'il faut avant de commencer</h2>
        <p>Une clé USB d'au moins 8 Go (elle sera entièrement reformatée, donc à vider de tout fichier important au préalable), et le fichier image (« ISO ») d'une distribution Linux adaptée aux débutants, comme Ubuntu ou Linux Mint, téléchargé depuis le site officiel de la distribution choisie.</p>

        <h2>Créer la clé USB bootable</h2>
        <p>Un fichier ISO ne se copie pas simplement sur la clé comme un document classique : il faut un outil dédié qui le rend « démarrable ». Deux options gratuites et fiables :</p>
        <pre><code>{`Rufus          # gratuit, uniquement sous Windows, très simple d'utilisation
balenaEtcher   # gratuit, disponible sous Windows, macOS et Linux`}</code></pre>
        <p>Dans les deux cas, le principe est identique : sélectionner le fichier ISO téléchargé, sélectionner la clé USB (en vérifiant bien qu'il s'agit de la bonne, puisqu'elle sera intégralement effacée), puis lancer la création. L'opération prend en général de 5 à 15 minutes.</p>

        <h2>Démarrer sur la clé USB</h2>
        <p>Une fois la clé prête, redémarrez l'ordinateur avec la clé branchée, et appuyez de façon répétée sur la touche permettant d'accéder au menu de démarrage (souvent <code>F12</code>, <code>F2</code>, <code>Échap</code> ou <code>Suppr</code> selon le fabricant de l'ordinateur) dès l'allumage. Sélectionnez ensuite la clé USB dans la liste des périphériques de démarrage proposés.</p>

        <h2>Essayer sans installer</h2>
        <p>La plupart des distributions proposent, au démarrage sur la clé, un choix entre « Essayer » et « Installer ». Choisissez l'option d'essai : Linux se lance alors entièrement depuis la clé USB, en mémoire, sans toucher au disque dur. Vous pouvez naviguer, ouvrir des applications, tester le terminal, en toute tranquillité.</p>

        <h2>Après le test</h2>
        <p>Il suffit d'éteindre l'ordinateur, de retirer la clé USB, et de rallumer normalement : Windows redémarre exactement comme avant, sans aucune trace de la session d'essai. Aucune installation, aucun risque, aucune modification.</p>

        <h2>Pour aller plus loin</h2>
        <p>Une fois cette première prise en main faite, le <Link to="/boutique">Tome 1 — Linux pour débutants</Link> accompagne pas à pas la suite : navigation dans le terminal, gestion des fichiers, premières bases de cybersécurité.</p>
      </>
    ),
  },
]

export function getBlogPost(slug) {
  return blogPosts.find((post) => post.slug === slug)
}
