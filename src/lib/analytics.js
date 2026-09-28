import { SUPABASE_URL, SUPABASE_ANON_KEY, isSupabaseConfigured } from './config.js'

// Suivi de fréquentation minimal et anonyme : une ligne (chemin + referrer)
// insérée dans la table Supabase `page_views` à chaque changement de page.
// Aucun cookie, aucun identifiant, aucune donnée personnelle. La table
// n'autorise que l'INSERT depuis le site (RLS) — personne ne peut lire ces
// données avec la clé publique.
export function trackPageView(path) {
  if (!isSupabaseConfigured) return
  if (typeof navigator !== 'undefined' && (navigator.doNotTrack === '1' || navigator.doNotTrack === 'yes')) return

  try {
    fetch(`${SUPABASE_URL}/rest/v1/page_views`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        apikey: SUPABASE_ANON_KEY,
        Authorization: `Bearer ${SUPABASE_ANON_KEY}`,
      },
      body: JSON.stringify({
        path,
        referrer: document.referrer || null,
      }),
      keepalive: true,
    }).catch(() => {
      // Le suivi ne doit jamais faire échouer la navigation.
    })
  } catch {
    // idem, on reste silencieux en cas de souci (ex. navigateur qui bloque fetch)
  }
}

// Suivi des actions de conversion (clic "Acheter sur Etsy", envoi du
// formulaire de contact, etc.). Réutilise la même table `page_views` (donc
// la même policy RLS "INSERT only") pour éviter une migration de base de
// données : l'événement est stocké comme un chemin préfixé `/__event/...`,
// facilement filtrable dans les requêtes d'analyse plus tard.
export function trackEvent(name, detail) {
  if (!isSupabaseConfigured) return
  if (typeof navigator !== 'undefined' && (navigator.doNotTrack === '1' || navigator.doNotTrack === 'yes')) return

  try {
    fetch(`${SUPABASE_URL}/rest/v1/page_views`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        apikey: SUPABASE_ANON_KEY,
        Authorization: `Bearer ${SUPABASE_ANON_KEY}`,
      },
      body: JSON.stringify({
        path: `/__event/${name}`,
        referrer: detail || (typeof window !== 'undefined' ? window.location.pathname : null) || null,
      }),
      keepalive: true,
    }).catch(() => {
      // Le suivi ne doit jamais faire échouer l'action de l'utilisateur.
    })
  } catch {
    // idem
  }
}
