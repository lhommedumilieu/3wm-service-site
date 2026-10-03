import { SUPABASE_URL, SUPABASE_ANON_KEY, isSupabaseConfigured } from './config.js'
import { getSession } from './supabaseAuth.js'

// Client du forum communautaire. La lecture est publique (clé anonyme) ;
// l'écriture (créer un sujet, répondre, marquer une solution, supprimer)
// nécessite d'être connecté : on envoie alors le jeton de session du membre.
// L'auteur et le pseudo sont fixés côté serveur (trigger), impossible donc
// d'écrire sous l'identité d'un autre.

export const CATEGORIES = [
  'Dépannage Windows',
  'Linux & Cybersécurité',
  'Discussion générale',
]

function requireConfig() {
  if (!isSupabaseConfigured) {
    throw new Error("Le forum n'est pas encore activé sur ce site.")
  }
}

function enteteLecture() {
  return {
    apikey: SUPABASE_ANON_KEY,
    Authorization: `Bearer ${SUPABASE_ANON_KEY}`,
  }
}

function enteteEcriture() {
  const session = getSession()
  if (!session?.access_token) throw new Error('Vous devez être connecté pour écrire sur le forum.')
  return {
    'Content-Type': 'application/json',
    apikey: SUPABASE_ANON_KEY,
    Authorization: `Bearer ${session.access_token}`,
  }
}

async function lire(url) {
  requireConfig()
  const res = await fetch(`${SUPABASE_URL}/rest/v1/${url}`, { headers: enteteLecture() })
  if (!res.ok) throw new Error('Impossible de charger le forum pour le moment.')
  return res.json()
}

// Liste des sujets, le plus actif en premier. Chaque sujet contient le
// nombre de messages (forum_posts(count)).
export async function listerSujets(categorie) {
  const params = new URLSearchParams({
    select: '*,forum_posts(count)',
    order: 'last_activity_at.desc',
  })
  if (categorie) params.set('category', `eq.${categorie}`)
  const lignes = await lire(`forum_topics?${params.toString()}`)
  return lignes.map((s) => ({
    ...s,
    nbMessages: Array.isArray(s.forum_posts) && s.forum_posts[0] ? s.forum_posts[0].count : 0,
  }))
}

export async function getSujet(id) {
  const lignes = await lire(`forum_topics?id=eq.${id}&select=*`)
  return lignes[0] || null
}

export async function listerMessages(topicId) {
  return lire(`forum_posts?topic_id=eq.${topicId}&select=*&order=created_at.asc`)
}

// Crée un sujet + son premier message (le message d'ouverture).
export async function creerSujet(titre, categorie, message) {
  const headers = enteteEcriture()
  const resSujet = await fetch(`${SUPABASE_URL}/rest/v1/forum_topics`, {
    method: 'POST',
    headers: { ...headers, Prefer: 'return=representation' },
    body: JSON.stringify({ title: titre, category: categorie }),
  })
  const corpsSujet = await resSujet.json().catch(() => [])
  if (!resSujet.ok || !corpsSujet[0]) {
    throw new Error(corpsSujet?.message || "Impossible de créer le sujet.")
  }
  const sujet = corpsSujet[0]

  const resMsg = await fetch(`${SUPABASE_URL}/rest/v1/forum_posts`, {
    method: 'POST',
    headers,
    body: JSON.stringify({ topic_id: sujet.id, content: message }),
  })
  if (!resMsg.ok) {
    const b = await resMsg.json().catch(() => ({}))
    throw new Error(b?.message || "Le sujet a été créé mais le message n'a pas pu être envoyé.")
  }
  return sujet
}

export async function repondre(topicId, message) {
  const res = await fetch(`${SUPABASE_URL}/rest/v1/forum_posts`, {
    method: 'POST',
    headers: enteteEcriture(),
    body: JSON.stringify({ topic_id: topicId, content: message }),
  })
  if (!res.ok) {
    const b = await res.json().catch(() => ({}))
    throw new Error(b?.message || "Impossible d'envoyer votre réponse.")
  }
}

export async function marquerSolution(topicId, postId) {
  const res = await fetch(`${SUPABASE_URL}/rest/v1/forum_topics?id=eq.${topicId}`, {
    method: 'PATCH',
    headers: enteteEcriture(),
    body: JSON.stringify({ solution_post_id: postId }),
  })
  if (!res.ok) throw new Error("Impossible de marquer la solution.")
}

export async function supprimerMessage(postId) {
  const res = await fetch(`${SUPABASE_URL}/rest/v1/forum_posts?id=eq.${postId}`, {
    method: 'DELETE',
    headers: enteteEcriture(),
  })
  if (!res.ok) throw new Error("Impossible de supprimer ce message.")
}

export async function supprimerSujet(topicId) {
  const res = await fetch(`${SUPABASE_URL}/rest/v1/forum_topics?id=eq.${topicId}`, {
    method: 'DELETE',
    headers: enteteEcriture(),
  })
  if (!res.ok) throw new Error("Impossible de supprimer ce sujet.")
}
