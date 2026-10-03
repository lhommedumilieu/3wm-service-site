import { FUITES_API_URL } from './config.js'
import { getSession } from './supabaseAuth.js'

// Demande au serveur du site si l'adresse e-mail du membre connecté apparaît
// dans des fuites de données connues. Le serveur vérifie lui-même à qui
// appartient le jeton de connexion : on ne peut tester que SA propre adresse.
// Renvoie { email, total, fuites: [{ nom, annee, enregistrements, donnees }] }.
export async function verifierMonEmail() {
  const session = getSession()
  if (!session?.access_token) throw new Error('Vous devez être connecté.')

  let reponse
  try {
    reponse = await fetch(FUITES_API_URL, {
      method: 'POST',
      headers: { Authorization: `Bearer ${session.access_token}` },
    })
  } catch {
    throw new Error('Impossible de joindre le service de vérification. Réessayez dans un instant.')
  }

  if (reponse.ok) return reponse.json()

  const erreur = (await reponse.json().catch(() => ({}))).error
  const messages = {
    connexion_requise: 'Votre connexion a expiré : déconnectez-vous puis reconnectez-vous.',
    email_non_confirme: "Confirmez d'abord votre adresse e-mail (lien reçu à l'inscription) pour pouvoir la vérifier.",
    trop_de_requetes: 'Vous avez déjà lancé plusieurs vérifications récemment. Réessayez dans une heure.',
    quota_atteint: "Le service gratuit de vérification a atteint sa limite pour le moment. Réessayez plus tard (demain au plus tard).",
    service_indisponible: 'Le service de vérification est momentanément indisponible. Réessayez dans un instant.',
  }
  throw new Error(messages[erreur] || 'La vérification a échoué. Réessayez dans un instant.')
}

// Noms français des types de données les plus courants (le service les
// renvoie en anglais). Les autres sont affichés tels quels.
const TRADUCTIONS = {
  'email addresses': 'Adresses e-mail',
  passwords: 'Mots de passe',
  'password hints': 'Indices de mot de passe',
  usernames: 'Pseudos',
  'ip addresses': 'Adresses IP',
  'phone numbers': 'Numéros de téléphone',
  names: 'Noms',
  'physical addresses': 'Adresses postales',
  'dates of birth': 'Dates de naissance',
  genders: 'Genres',
  'security questions and answers': 'Questions de sécurité',
  'social media profiles': 'Profils de réseaux sociaux',
  'credit cards': 'Cartes bancaires',
  'geographic locations': 'Localisations',
  'auth tokens': "Jetons d'authentification",
}

export function traduireDonnee(nom) {
  return TRADUCTIONS[String(nom).toLowerCase()] || nom
}

// Une fuite qui expose des mots de passe est la plus urgente à traiter.
export function exposeMotsDePasse(fuite) {
  return fuite.donnees.some((d) => /password/i.test(d) && !/hint/i.test(d))
}
