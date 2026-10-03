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

// --- Accès générique REST (lecture / écriture) ------------------------------
// Toutes les tables ci-dessous sont protégées par des policies RLS réservées à
// auth.email() = service@3-wm.net : sans le jeton de l'administrateur, la base
// refuse la requête, même si quelqu'un connaissait ces URL.
async function rest(table, { method = 'GET', query = {}, body, retour = false } = {}) {
  requireConfig()
  const params = new URLSearchParams(query)
  const res = await fetch(`${SUPABASE_URL}/rest/v1/${table}${params.toString() ? `?${params}` : ''}`, {
    method,
    headers: {
      'Content-Type': 'application/json',
      apikey: SUPABASE_ANON_KEY,
      Authorization: `Bearer ${accessToken()}`,
      Prefer: retour ? 'return=representation' : 'return=minimal',
    },
    body: body ? JSON.stringify(body) : undefined,
  })
  if (!res.ok) {
    const detail = await res.json().catch(() => ({}))
    throw new Error(detail?.message || `Opération impossible sur « ${table} ».`)
  }
  if (!retour && method !== 'GET') return null
  return res.json()
}

const lire = (table, order, limit) =>
  rest(table, { query: { select: '*', ...(order ? { order } : {}), ...(limit ? { limit: String(limit) } : {}) } })
const modifier = (table, id, valeurs) => rest(table, { method: 'PATCH', query: { id: `eq.${id}` }, body: valeurs })
const supprimer = (table, id) => rest(table, { method: 'DELETE', query: { id: `eq.${id}` } })

// Clients, dépannages, ventes
export const listerClients = () => lire('clients', 'created_at.desc')
export const creerClient = (c) => rest('clients', { method: 'POST', body: c, retour: true })
export const majClient = (id, v) => modifier('clients', id, { ...v, updated_at: new Date().toISOString() })
export const supprimerClient = (id) => supprimer('clients', id)

export const listerInterventions = () => lire('interventions', 'created_at.desc')
export const creerIntervention = (i) => rest('interventions', { method: 'POST', body: i, retour: true })
export const majIntervention = (id, v) => modifier('interventions', id, { ...v, updated_at: new Date().toISOString() })
export const supprimerIntervention = (id) => supprimer('interventions', id)

export const creerVente = (v) => rest('ventes', { method: 'POST', body: v, retour: true })
export const supprimerVente = (id) => supprimer('ventes', id)

// Boîte de réception
export const majMessageContact = (id, v) => modifier('contact_messages', id, v)
export const supprimerMessageContact = (id) => supprimer('contact_messages', id)
export const listerChatLeads = () => lire('chat_leads', 'created_at.desc', 200)
export const majChatLead = (id, v) => modifier('chat_leads', id, v)
export const supprimerChatLead = (id) => supprimer('chat_leads', id)
export const listerNewsletter = () => lire('newsletter_subscribers', 'created_at.desc', 500)
export const supprimerAbonne = (id) => supprimer('newsletter_subscribers', id)

// Modération
export const listerSujetsForum = () => lire('forum_topics', 'created_at.desc', 200)
export const listerReponsesForum = () => lire('forum_posts', 'created_at.desc', 300)
export const supprimerSujetForum = (id) => supprimer('forum_topics', id)
export const supprimerReponseForum = (id) => supprimer('forum_posts', id)
export const listerCommentaires = () => lire('comments', 'created_at.desc', 300)
export const supprimerCommentaire = (id) => supprimer('comments', id)

// Statistiques agrégées côté base (fonction réservée à l'admin)
export async function statsSite(jours = 30) {
  requireConfig()
  const res = await fetch(`${SUPABASE_URL}/rest/v1/rpc/admin_stats_site`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      apikey: SUPABASE_ANON_KEY,
      Authorization: `Bearer ${accessToken()}`,
    },
    body: JSON.stringify({ jours }),
  })
  if (!res.ok) throw new Error('Impossible de charger les statistiques.')
  return res.json()
}
