// Réglages des services externes (chat + comptes utilisateurs).
// Ces valeurs sont volontairement vides pour l'instant : tant qu'elles ne
// sont pas renseignées, le widget de chat ne s'affiche pas et les pages de
// compte affichent un message "bientôt disponible" au lieu de planter.
// Il suffit de coller les bonnes valeurs ci-dessous puis de redéployer.

// Tawk.to : Administration → Canaux de chat → Propriété du site.
// Le code d'intégration Tawk.to ressemble à :
//   https://embed.tawk.to/<TAWK_PROPERTY_ID>/<TAWK_WIDGET_ID>
export const TAWK_PROPERTY_ID = '6aae74b8208490345262755b'
export const TAWK_WIDGET_ID = '1k2snfsfk'

// Supabase : Project Settings → API.
export const SUPABASE_URL = 'https://dnpnxgnlilnwnhhnibti.supabase.co'
export const SUPABASE_ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImRucG54Z25saWxud25oaG5pYnRpIiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODk4MTI0NzgsImV4cCI6MjEwNTM4ODQ3OH0.ywpTWGlLGc5cvAYf__d-kwGSE3Sni27srVqtotP6Q2I'

// Assistant IA (auto-hébergé, gratuit — voir dossier /server).
// Chemin relatif : la requête part vers le même nom de domaine (3-wm.net),
// nginx redirige ensuite vers le petit service qui interroge l'IA locale.
export const CHAT_API_URL = '/api/chat'

export const isSupabaseConfigured = Boolean(SUPABASE_URL && SUPABASE_ANON_KEY)
export const isTawkConfigured = Boolean(TAWK_PROPERTY_ID && TAWK_WIDGET_ID)
