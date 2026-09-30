import { SUPABASE_URL, SUPABASE_ANON_KEY, isSupabaseConfigured } from './config.js'
import { getSession } from './supabaseAuth.js'

// Appels réservés à l'administrateur du site (page /admin) : gestion des
// comptes membres (liste, création, bannissement) et présence en direct.
// Les actions sensibles (créer/bannir un compte) passent par la fonction
// Supabase "admin-users", qui vérifie elle-même côté serveur que l'appelant
// est bien service@3-wm.net avant d'utiliser la clé service_role — cette
// clé n'existe jamais dans le code du site, uniquement dans la fonction.

function requireConfig() {
  if (!isSupabaseConfigured) {
    throw new Error("Supabase n'est pas configuré.")
  }
}

function accessToken() {
  const session = getSession()
  if (!session?.access_token) throw new Error('Vous devez être connecté.')
  return session.access_token
}

async function appelerFonctionAdmin(action, params = {}) {
  requireConfig()
  const res = await fetch(`${SUPABASE_URL}/functions/v1/admin-users`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      apikey: SUPABASE_ANON_KEY,
      Authorization: `Bearer ${accessToken()}`,
    },
    body: JSON.stringify({ action, ...params }),
  })
  const body = await res.json().catch(() => ({}))
  if (!res.ok) throw new Error(body?.error || 'Une erreur est survenue.')
  return body
}

export function listerComptes() {
  return appelerFonctionAdmin('list')
}

export function creerCompte(email, password) {
  return appelerFonctionAdmin('create', { email, password })
}

export function bannirCompte(userId) {
  return appelerFonctionAdmin('ban', { userId })
}

export function reactiverCompte(userId) {
  return appelerFonctionAdmin('unban', { userId })
}

export function supprimerCompte(userId) {
  return appelerFonctionAdmin('delete', { userId })
}

// Présence en direct (table site_presence) : lecture directe via PostgREST,
// autorisée par la policy RLS admin (auth.email() = service@3-wm.net) — il
// faut donc envoyer le jeton de connexion de l'admin, pas la clé anonyme.
export async function listerPresence() {
  requireConfig()
  const res = await fetch(`${SUPABASE_URL}/rest/v1/site_presence?select=*&order=last_seen.desc`, {
    headers: {
      apikey: SUPABASE_ANON_KEY,
      Authorization: `Bearer ${accessToken()}`,
    },
  })
  if (!res.ok) throw new Error('Impossible de charger la présence en direct.')
  return res.json()
}

// Lecture générique d'une table admin, protégée par la même policy RLS
// (auth.email() = service@3-wm.net) sur chacune des tables listées
// ci-dessous — jamais accessible avec la seule clé anonyme.
async function listerTable(table, order, limite) {
  requireConfig()
  const params = new URLSearchParams({ select: '*' })
  if (order) params.set('order', order)
  if (limite) params.set('limit', String(limite))
  const res = await fetch(`${SUPABASE_URL}/rest/v1/${table}?${params.toString()}`, {
    headers: {
      apikey: SUPABASE_ANON_KEY,
      Authorization: `Bearer ${accessToken()}`,
    },
  })
  if (!res.ok) throw new Error(`Impossible de charger « ${table} ».`)
  return res.json()
}

// Nombre de lignes d'une table, via l'en-tête Prefer: count=exact (pas de
// téléchargement des lignes elles-mêmes) — utilisé pour les compteurs du
// tableau de bord.
export async function compterLignes(table) {
  requireConfig()
  const res = await fetch(`${SUPABASE_URL}/rest/v1/${table}?select=id&limit=1`, {
    headers: {
      apikey: SUPABASE_ANON_KEY,
      Authorization: `Bearer ${accessToken()}`,
      Prefer: 'count=exact',
    },
  })
  if (!res.ok) return null
  const plage = res.headers.get('content-range') // ex: "0-0/123"
  if (!plage) return null
  const total = plage.split('/')[1]
  return total === '*' ? null : Number(total)
}

export function listerErreurs() {
  return listerTable('client_errors', 'created_at.desc', 100)
}

export function listerVentes() {
  return listerTable('ventes', 'created_at.desc')
}

export function listerMessagesContact() {
  return listerTable('contact_messages', 'created_at.desc', 200)
}

export function listerMessagesChat() {
  return listerTable('chat_messages', 'created_at.desc', 300)
}
