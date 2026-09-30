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
