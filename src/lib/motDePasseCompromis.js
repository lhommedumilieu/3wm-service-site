// Vérification d'un mot de passe contre les fuites de données connues, via
// l'API gratuite "Pwned Passwords" (Have I Been Pwned), sans jamais envoyer
// le mot de passe lui-même :
//
//  1. Le mot de passe est transformé en empreinte SHA-1 DANS le navigateur.
//  2. Seuls les 5 premiers caractères de cette empreinte sont envoyés à l'API
//     (méthode "k-anonymity") : des centaines de mots de passe différents
//     partagent ces 5 caractères, l'API ne peut donc pas savoir lequel est
//     testé.
//  3. L'API renvoie la liste des fins d'empreintes qui correspondent ; la
//     comparaison avec la fin de notre empreinte se fait localement.
//
// Résultat : ni le mot de passe, ni son empreinte complète ne quittent
// l'appareil de l'utilisateur, et rien n'est enregistré sur ce site.

const URL_API = 'https://api.pwnedpasswords.com/range/'

// Empreinte SHA-1 en hexadécimal majuscule (format attendu par l'API).
export async function sha1Hex(texte) {
  const octets = new TextEncoder().encode(texte)
  const empreinte = await crypto.subtle.digest('SHA-1', octets)
  return Array.from(new Uint8Array(empreinte))
    .map((o) => o.toString(16).padStart(2, '0'))
    .join('')
    .toUpperCase()
}

// Cherche le suffixe de l'empreinte dans la réponse de l'API (lignes de la
// forme "SUFFIXE:NOMBRE"). Avec l'en-tête Add-Padding, l'API ajoute de
// fausses lignes à zéro pour masquer la taille réelle de la réponse : on les
// ignore.
export function chercherDansReponse(texteReponse, suffixe) {
  for (const ligne of texteReponse.split('\n')) {
    const [fin, nombre] = ligne.trim().split(':')
    if (fin === suffixe) {
      const occurrences = parseInt(nombre, 10)
      if (occurrences > 0) return occurrences
    }
  }
  return 0
}

// Renvoie { compromis: boolean, occurrences: number }.
export async function verifierMotDePasse(motDePasse) {
  if (!motDePasse) throw new Error('Saisissez un mot de passe à vérifier.')
  if (typeof crypto === 'undefined' || !crypto.subtle) {
    throw new Error("Votre navigateur ne permet pas cette vérification (connexion sécurisée requise).")
  }

  const empreinte = await sha1Hex(motDePasse)
  const prefixe = empreinte.slice(0, 5)
  const suffixe = empreinte.slice(5)

  let reponse
  try {
    reponse = await fetch(`${URL_API}${prefixe}`, { headers: { 'Add-Padding': 'true' } })
  } catch {
    throw new Error("Impossible de joindre le service de vérification. Vérifiez votre connexion et réessayez.")
  }
  if (!reponse.ok) {
    throw new Error("Le service de vérification est momentanément indisponible. Réessayez dans un instant.")
  }

  const occurrences = chercherDansReponse(await reponse.text(), suffixe)
  return { compromis: occurrences > 0, occurrences }
}
