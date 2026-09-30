import { SUPABASE_URL, SUPABASE_ANON_KEY, isSupabaseConfigured } from './config.js'
import { getVisitorId } from './analytics.js'

// Petites fonctions d'enregistrement "best effort" : elles ne doivent
// jamais bloquer ni casser l'action de l'utilisateur (envoi du formulaire
// de contact, discussion avec l'assistant). En cas d'échec (réseau,
// Supabase indisponible...), on reste silencieux. Les tables ne permettent
// que l'INSERT depuis le site (RLS) — seul le compte admin peut les lire,
// depuis la page /admin.

function poster(table, corps) {
  if (!isSupabaseConfigured) return
  try {
    fetch(`${SUPABASE_URL}/rest/v1/${table}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        apikey: SUPABASE_ANON_KEY,
        Authorization: `Bearer ${SUPABASE_ANON_KEY}`,
      },
      body: JSON.stringify(corps),
      keepalive: true,
    }).catch(() => {})
  } catch {
    // idem : ne jamais faire remonter d'erreur
  }
}

// Copie chaque message de la conversation avec l'assistant "Cams" dans
// Supabase, pour que l'admin puisse relire l'historique des échanges
// depuis /admin (et repérer d'éventuelles tentatives d'abus).
export function logChatMessage(role, content) {
  if (!content) return
  poster('chat_messages', {
    visitor_id: getVisitorId(),
    role,
    content: String(content).slice(0, 4000),
  })
}

// Copie le message du formulaire de contact dans Supabase, en plus de
// l'envoi habituel via Netlify Forms (qui gère toujours la notification
// par e-mail) — pour que l'admin le voie aussi directement dans /admin.
export function logContactMessage({ name, email, sujet, message }) {
  poster('contact_messages', {
    name: name || null,
    email: email || null,
    sujet: sujet || null,
    message: message || null,
  })
}
