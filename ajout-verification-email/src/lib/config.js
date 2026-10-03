// Réglages des services externes (comptes utilisateurs, etc.).
// Ces valeurs sont volontairement vides tant qu'elles ne sont pas
// renseignées : les pages de compte affichent un message "bientôt
// disponible" au lieu de planter. Il suffit de coller les bonnes valeurs
// ci-dessous puis de redéployer.

// Supabase : Project Settings → API.
export const SUPABASE_URL = 'https://dnpnxgnlilnwnhhnibti.supabase.co'
export const SUPABASE_ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImRucG54Z25saWxud25oaG5pYnRpIiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODk4MTI0NzgsImV4cCI6MjEwNTM4ODQ3OH0.ywpTWGlLGc5cvAYf__d-kwGSE3Sni27srVqtotP6Q2I'

// Assistant IA (auto-hébergé, gratuit — voir dossier /server).
// Chemin relatif : la requête part vers le même nom de domaine (3-wm.net),
// nginx redirige ensuite vers le petit service qui interroge l'IA locale.
export const CHAT_API_URL = 'https://chat.3-wm.net/api/chat'

// Verification des fuites de donnees de l'adresse e-mail d'un membre
// (meme service auto-heberge que le chat, voir server/chat-proxy.js).
export const FUITES_API_URL = 'https://chat.3-wm.net/api/fuites'

export const isSupabaseConfigured = Boolean(SUPABASE_URL && SUPABASE_ANON_KEY)
