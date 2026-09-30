// Après chaque mise à jour du site, Vite génère de nouveaux fichiers JS
// (noms avec un hash différent) et les anciens sont supprimés du serveur.
// Un visiteur qui avait déjà la page ouverte (ou dont le navigateur a mis
// en cache l'ancienne page) AVANT le déploiement essaie alors de charger
// un fichier qui n'existe plus dès qu'il navigue vers une page chargée à
// la demande (ex. /admin, /espace-membre) : le navigateur lève une erreur
// "Failed to fetch dynamically imported module" et React ne peut plus
// rien afficher → écran blanc. C'est très probablement la cause du
// plantage rencontré sur téléphone après les mises à jour du site.
//
// On détecte précisément ce type d'erreur et on recharge la page une
// seule fois (garde-fou avec sessionStorage pour éviter une boucle) : le
// visiteur récupère alors directement la version à jour du site au lieu
// de rester sur un écran blanc.

function estErreurDeModuleObsolete(message) {
  return (
    typeof message === 'string' &&
    (/failed to fetch dynamically imported module/i.test(message) ||
      /error loading dynamically imported module/i.test(message) ||
      /importing a module script failed/i.test(message))
  )
}

export function installerRechargementSiNouvelleVersion() {
  if (typeof window === 'undefined') return

  function gerer(message) {
    if (!estErreurDeModuleObsolete(message)) return
    try {
      if (sessionStorage.getItem('3wm_reload_apres_maj')) return // déjà tenté cette session, éviter une boucle
      sessionStorage.setItem('3wm_reload_apres_maj', '1')
    } catch {
      // si sessionStorage est indisponible, on tente quand même le rechargement une fois
    }
    window.location.reload()
  }

  window.addEventListener('error', (e) => gerer(e?.message))
  window.addEventListener('unhandledrejection', (e) => gerer(e?.reason?.message || String(e?.reason || '')))
}
