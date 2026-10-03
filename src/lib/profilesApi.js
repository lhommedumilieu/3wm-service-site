import { SUPABASE_URL, SUPABASE_ANON_KEY, isSupabaseConfigured } from './config.js'
import { getSession } from './supabaseAuth.js'

// Gestion des pseudos (table profiles). La lecture est publique ; chacun ne
// peut créer/modifier que son propre pseudo (RLS). Le pseudo doit être
// unique (insensible à la casse), 3 à 20 caractères, sans espace.

function enteteLecture() {
  return {
    apikey: SUPABASE_ANON_KEY,
    Authorization: `Bearer ${SUPABASE_ANON_KEY}`,
  }
}

function enteteEcriture() {
  const session = getSession()
  if (!session?.access_token) throw new Error('Vous devez être connecté.')
  return {
    'Content-Type': 'application/json',
    apikey: SUPABASE_ANON_KEY,
    Authorization: `Bearer ${session.access_token}`,
  }
}

// Pseudo actuel du membre connecté (null s'il n'en a pas encore choisi).
export async function getMonPseudo(userId) {
  if (!isSupabaseConfigured || !userId) return null
  const res = await fetch(`${SUPABASE_URL}/rest/v1/profiles?id=eq.${userId}&select=pseudo`, {
    headers: enteteLecture(),
  })
  if (!res.ok) return null
  const lignes = await res.json().catch(() => [])
  return lignes[0]?.pseudo || null
}

// Définit ou change le pseudo du membre connecté (création à la volée).
export async function definirPseudo(userId, pseudo) {
  if (!userId) throw new Error('Vous devez être connecté.')
  const res = await fetch(`${SUPABASE_URL}/rest/v1/profiles?on_conflict=id`, {
    method: 'POST',
    headers: { ...enteteEcriture(), Prefer: 'resolution=merge-duplicates,return=representation' },
    body: JSON.stringify({ id: userId, pseudo, updated_at: new Date().toISOString() }),
  })
  if (!res.ok) {
    const b = await res.json().catch(() => ({}))
    // 23505 = violation d'unicité (pseudo déjà pris)
    if (b?.code === '23505') throw new Error('Ce pseudo est déjà pris, choisissez-en un autre.')
    throw new Error(b?.message || "Impossible d'enregistrer le pseudo.")
  }
}

// Récupère les pseudos pour une liste d'identifiants d'auteurs, sous forme
// de dictionnaire { id: pseudo }. Sert à afficher le pseudo courant partout
// sur le forum (y compris sur d'anciens messages).
export async function mapPseudos(ids) {
  const uniques = [...new Set((ids || []).filter(Boolean))]
  if (!uniques.length || !isSupabaseConfigured) return {}
  const liste = uniques.map(encodeURIComponent).join(',')
  const res = await fetch(`${SUPABASE_URL}/rest/v1/profiles?id=in.(${liste})&select=id,pseudo`, {
    headers: enteteLecture(),
  })
  if (!res.ok) return {}
  const lignes = await res.json().catch(() => [])
  const m = {}
  for (const l of lignes) m[l.id] = l.pseudo
  return m
}
