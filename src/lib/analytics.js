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
