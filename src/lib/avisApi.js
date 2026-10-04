import { SUPABASE_URL, SUPABASE_ANON_KEY, isSupabaseConfigured } from './config.js'
import { getSession } from './supabaseAuth.js'

// Avis clients (table « avis » + photos dans le bucket Storage « avis-photos »).
// Sécurité côté base (RLS) :
//  - tout le monde lit les avis PUBLIÉS ; un membre voit aussi le sien en attente ;
//  - un membre connecté peut publier UN avis, qui part toujours « en_attente » ;
//  - seul service@3-wm.net peut valider / refuser / répondre.

const BUCKET = 'avis-photos'

function verifierConfig() {
  if (!isSupabaseConfigured) throw new Error("Supabase n'est pas configuré.")
}

function entetes({ connecte = false, json = true } = {}) {
  const jeton = getSession()?.access_token
  if (connecte && !jeton) throw new Error('Vous devez être connecté.')
  return {
    apikey: SUPABASE_ANON_KEY,
    Authorization: `Bearer ${jeton || SUPABASE_ANON_KEY}`,
    ...(json ? { 'Content-Type': 'application/json' } : {}),
  }
}

async function rest(chemin, options = {}, connecte = false) {
  verifierConfig()
  const res = await fetch(`${SUPABASE_URL}/rest/v1/${chemin}`, { ...options, headers: { ...entetes({ connecte }), ...options.headers } })
  if (!res.ok) {
    const detail = await res.json().catch(() => ({}))
    const err = new Error(detail?.message || 'Une erreur est survenue.')
    err.code = detail?.code
    throw err
  }
  return res.status === 204 ? null : res.json()
}

const CHAMPS = 'id,user_id,author_name,note,titre,contenu,photos,statut,reponse,created_at'

export const urlPhoto = (chemin) => `${SUPABASE_URL}/storage/v1/object/public/${BUCKET}/${chemin}`

// Moyenne, nombre et répartition des notes (avis publiés uniquement)
export const resumeAvis = () => rest('rpc/avis_resume', { method: 'POST', body: '{}' })

export const listerAvisPublies = (page = 0, parPage = 10) =>
  rest(`avis?select=${CHAMPS}&statut=eq.publie&order=created_at.desc&offset=${page * parPage}&limit=${parPage}`)

export async function monAvis(userId) {
  if (!userId) return null
  const lignes = await rest(`avis?select=${CHAMPS}&user_id=eq.${userId}`, {}, true)
  return lignes[0] || null
}

// Réduit la photo (1600 px max, WebP) : envoi plus rapide, et retire les
// métadonnées de l'appareil (dont la position GPS).
function compresser(fichier) {
  return new Promise((ok, ko) => {
    const img = new Image()
    const url = URL.createObjectURL(fichier)
    img.onload = () => {
      const r = Math.min(1, 1600 / Math.max(img.width, img.height))
      const cv = document.createElement('canvas')
      cv.width = Math.round(img.width * r)
      cv.height = Math.round(img.height * r)
      cv.getContext('2d').drawImage(img, 0, 0, cv.width, cv.height)
      URL.revokeObjectURL(url)
      cv.toBlob((b) => (b ? ok(b) : ko(new Error('Conversion impossible'))), 'image/webp', 0.85)
    }
    img.onerror = () => ko(new Error('Image illisible'))
    img.src = url
  })
}

async function envoyerPhoto(userId, fichier) {
  const blob = await compresser(fichier)
  const chemin = `${userId}/${crypto.randomUUID()}.webp`
  const res = await fetch(`${SUPABASE_URL}/storage/v1/object/${BUCKET}/${chemin}`, {
    method: 'POST',
    headers: { ...entetes({ connecte: true, json: false }), 'Content-Type': 'image/webp' },
    body: blob,
  })
  if (!res.ok) throw new Error("L'envoi d'une photo a échoué.")
  return chemin
}

export async function supprimerPhotos(chemins) {
  if (!chemins?.length) return
  await fetch(`${SUPABASE_URL}/storage/v1/object/${BUCKET}`, {
    method: 'DELETE',
    headers: entetes({ connecte: true }),
    body: JSON.stringify({ prefixes: chemins }),
  }).catch(() => {})
}

export async function publierAvis(userId, { note, titre, contenu, fichiers }) {
  const chemins = []
  try {
    for (const f of fichiers) chemins.push(await envoyerPhoto(userId, f))
    const [avis] = await rest(
      'avis',
      {
        method: 'POST',
        headers: { Prefer: 'return=representation' },
        // author_name et statut sont imposés par la base (trigger)
        body: JSON.stringify({ user_id: userId, author_name: '-', note, titre: titre || null, contenu, photos: chemins }),
      },
      true
    )
    return avis
  } catch (e) {
    await supprimerPhotos(chemins)
    throw e
  }
}

export async function supprimerAvis(avis) {
  await rest(`avis?id=eq.${avis.id}`, { method: 'DELETE' }, true)
  await supprimerPhotos(avis.photos)
}

// --- Administration ---------------------------------------------------------
export const listerAvisAdmin = () => rest(`avis?select=${CHAMPS}&order=created_at.desc&limit=500`, {}, true)
export const majAvis = (id, valeurs) =>
  rest(`avis?id=eq.${id}`, { method: 'PATCH', body: JSON.stringify(valeurs) }, true)
