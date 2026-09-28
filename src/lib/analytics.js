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

// Présence en direct : signale que ce visiteur est actuellement sur le
// site (chemin visité), pour l'écran "En ligne maintenant" du logiciel de
// suivi client. Un identifiant anonyme (aléatoire, stocké dans le
// localStorage du navigateur, jamais relié à une identité) sert de clé —
// aucun cookie de suivi, aucune donnée personnelle. La table `site_presence`
// n'autorise en lecture que le compte admin du logiciel (RLS).
let cachedVisitorId = null
function getVisitorId() {
  if (cachedVisitorId) return cachedVisitorId
  try {
    cachedVisitorId = localStorage.getItem('3wm_vid')
    if (!cachedVisitorId) {
      cachedVisitorId =
        typeof crypto !== 'undefined' && crypto.randomUUID
          ? crypto.randomUUID()
          : `${Date.now()}-${Math.random().toString(16).slice(2)}`
      localStorage.setItem('3wm_vid', cachedVisitorId)
    }
  } catch {
    cachedVisitorId = `${Date.now()}-${Math.random().toString(16).slice(2)}`
  }
  return cachedVisitorId
}

export function pingPresence(path) {
  if (!isSupabaseConfigured) return
  if (typeof navigator !== 'undefined' && (navigator.doNotTrack === '1' || navigator.doNotTrack === 'yes')) return

  try {
    fetch(`${SUPABASE_URL}/rest/v1/site_presence?on_conflict=visitor_id`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        apikey: SUPABASE_ANON_KEY,
        Authorization: `Bearer ${SUPABASE_ANON_KEY}`,
        Prefer: 'resolution=merge-duplicates',
      },
      body: JSON.stringify({
        visitor_id: getVisitorId(),
        path,
        referrer: document.referrer || null,
        last_seen: new Date().toISOString(),
      }),
      keepalive: true,
    }).catch(() => {
      // Silencieux : la présence ne doit jamais gêner la navigation.
    })
  } catch {
    // idem
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
