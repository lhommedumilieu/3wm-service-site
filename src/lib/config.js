// Réglages des services externes (chat + comptes utilisateurs).
// Ces valeurs sont volontairement vides pour l'instant : tant qu'elles ne
// sont pas renseignées, le widget de chat ne s'affiche pas et les pages de
// compte affichent un message "bientôt disponible" au lieu de planter.
// Il suffit de coller les bonnes valeurs ci-dessous puis de redéployer.

// Tawk.to : Administration → Canaux de chat → Propriété du site.
// Le code d'intégration Tawk.to ressemble à :
//   https://embed.tawk.to/<TAWK_PROPERTY_ID>/<TAWK_WIDGET_ID>
export const TAWK_PROPERTY_ID = ''
export const TAWK_WIDGET_ID = ''

// Supabase : Project Settings → API.
export const SUPABASE_URL = ''
export const SUPABASE_ANON_KEY = ''

export const isSupabaseConfigured = Boolean(SUPABASE_URL && SUPABASE_ANON_KEY)
export const isTawkConfigured = Boolean(TAWK_PROPERTY_ID && TAWK_WIDGET_ID)
