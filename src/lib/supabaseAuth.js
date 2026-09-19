// Client d'authentification maison, en appelant directement l'API REST
// "Auth" de Supabase (GoTrue) avec fetch(). Pas de dépendance npm ajoutée
// exprès : le fichier package-lock.json de ce dépôt ne peut pas être mis à
// jour facilement via l'éditeur web de GitHub, donc on reste en JS natif.
//
// Toutes les fonctions ci-dessous lancent une erreur avec un message lisible
// si SUPABASE_URL / SUPABASE_ANON_KEY ne sont pas encore configurés dans
// src/lib/config.js.

import { SUPABASE_URL, SUPABASE_ANON_KEY, isSupabaseConfigured } from './config.js'

const STORAGE_KEY = '3wm_session'

function authUrl(path) {
  return `${SUPABASE_URL}/auth/v1${path}`
}

function requireConfig() {
  if (!isSupabaseConfigured) {
    throw new Error("La création de compte n'est pas encore activée sur ce site.")
  }
}

function saveSession(data) {
  if (data && data.access_token) {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(data))
    window.dispatchEvent(new Event('3wm-auth-change'))
  }
}

export function getSession() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY)
    return raw ? JSON.parse(raw) : null
  } catch {
    return null
  }
}

export function clearSession() {
  localStorage.removeItem(STORAGE_KEY)
  window.dispatchEvent(new Event('3wm-auth-change'))
}

async function parseAuthResponse(res) {
  const body = await res.json().catch(() => ({}))
  if (!res.ok) {
    const message = body?.error_description || body?.msg || body?.error || "Une erreur est survenue."
    throw new Error(message)
  }
  return body
}

export async function signUp(email, password) {
  requireConfig()
  const res = await fetch(authUrl('/signup'), {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      apikey: SUPABASE_ANON_KEY,
    },
    body: JSON.stringify({ email, password }),
  })
  const body = await parseAuthResponse(res)
  if (body.access_token) saveSession(body)
  return body
}

export async function signIn(email, password) {
  requireConfig()
  const res = await fetch(authUrl('/token?grant_type=password'), {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      apikey: SUPABASE_ANON_KEY,
    },
    body: JSON.stringify({ email, password }),
  })
  const body = await parseAuthResponse(res)
  saveSession(body)
  return body
}

export async function signOut() {
  const session = getSession()
  if (session?.access_token && isSupabaseConfigured) {
    await fetch(authUrl('/logout'), {
      method: 'POST',
      headers: {
        apikey: SUPABASE_ANON_KEY,
        Authorization: `Bearer ${session.access_token}`,
      },
    }).catch(() => {})
  }
  clearSession()
}

export async function requestPasswordReset(email) {
  requireConfig()
  const res = await fetch(authUrl('/recover'), {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      apikey: SUPABASE_ANON_KEY,
    },
    body: JSON.stringify({ email }),
  })
  await parseAuthResponse(res)
}

export async function getCurrentUser() {
  const session = getSession()
  if (!session?.access_token || !isSupabaseConfigured) return null
  const res = await fetch(authUrl('/user'), {
    headers: {
      apikey: SUPABASE_ANON_KEY,
      Authorization: `Bearer ${session.access_token}`,
    },
  })
  if (!res.ok) {
    clearSession()
    return null
  }
  return res.json()
}
