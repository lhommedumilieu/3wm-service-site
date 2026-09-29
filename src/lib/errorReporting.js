import { SUPABASE_URL, SUPABASE_ANON_KEY, isSupabaseConfigured } from './config.js'

// Filet de capture d'erreurs : le site plante parfois sur téléphone sans
// qu'on sache pourquoi (impossible de reproduire depuis un ordinateur).
// Ce petit module écoute les erreurs JavaScript non gérées et les envoie
// dans la table Supabase `client_errors`, pour qu'on puisse voir le
// message exact et la pile d'appels la prochaine fois que ça arrive,
// sans avoir besoin de brancher le téléphone à un ordinateur.
//
// Comme pour les autres tables de suivi (page_views, site_presence) :
// aucune donnée personnelle envoyée, uniquement le message d'erreur, la
// page concernée et le type d'appareil/navigateur. La table n'autorise
// que l'INSERT depuis le site (RLS) — personne ne peut lire ces données
// avec la clé publique.

function envoyerErreur(message, stack) {
  if (!isSupabaseConfigured) return
  try {
    fetch(`${SUPABASE_URL}/rest/v1/client_errors`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        apikey: SUPABASE_ANON_KEY,
        Authorization: `Bearer ${SUPABASE_ANON_KEY}`,
      },
      body: JSON.stringify({
        message: String(message || '').slice(0, 2000),
        stack: String(stack || '').slice(0, 4000),
        path: typeof window !== 'undefined' ? window.location.pathname : null,
        user_agent: typeof navigator !== 'undefined' ? navigator.userAgent : null,
      }),
      keepalive: true,
    }).catch(() => {
      // Si l'envoi échoue, tant pis : on ne doit surtout pas créer une
      // deuxième erreur en essayant de signaler la première.
    })
  } catch {
    // idem
  }
}

let installe = false
export function installerCaptureErreurs() {
  if (installe || typeof window === 'undefined') return
  installe = true

  window.addEventListener('error', (evenement) => {
    envoyerErreur(evenement.message, evenement.error?.stack)
  })

  window.addEventListener('unhandledrejection', (evenement) => {
    const raison = evenement.reason
    const message = raison?.message || String(raison)
    envoyerErreur(`(promesse non gérée) ${message}`, raison?.stack)
  })
}
