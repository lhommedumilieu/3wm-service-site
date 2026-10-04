import { SUPABASE_URL, SUPABASE_ANON_KEY } from './config.js'

// ---------------------------------------------------------------------------
// Réglages de la vente en ligne
// ---------------------------------------------------------------------------

// Médiateur de la consommation (obligatoire pour vendre à des particuliers).
// Tant que ce nom est vide, les boutons « Commander » restent cachés sur le site.
export const MEDIATEUR = {
  nom: 'CM2C (Centre de la Médiation de la Consommation de Conciliateurs de Justice)',
  adresse: '49 rue de Ponthieu, 75008 Paris',
  site: 'https://www.cm2c.net',
}
export const VENTE_ACTIVE = Boolean(MEDIATEUR.nom)

// Lien du portail client Stripe (résilier le forfait, télécharger ses factures).
export const PORTAIL_CLIENT_URL = 'https://billing.stripe.com/p/login/eVq00jaNecRzc6j48UfEk00'

export const VENDEUR = {
  nom: 'Otman El Bataoui',
  enseigne: '3WM Service',
  statut: 'Entrepreneur individuel (micro-entreprise)',
  siret: '822 840 518 00010',
  adresse: '8 B rue du Chemin Vert, 95610 Éragny',
  email: 'service@3-wm.net',
  tva: 'TVA non applicable, art. 293 B du CGI',
}

export const FORMULES_VENTE = {
  ponctuel: {
    nom: 'Dépannage ponctuel',
    prix: 29,
    suffixe: '',
    resume: '1 problème identifié sur un PC Windows, traité lors d’une session à distance.',
    inclus: ['Diagnostic et correction d’un problème précis', 'Session à distance avec votre accord, sous vos yeux', 'Explications sur ce qui a été fait'],
  },
  approfondi: {
    nom: 'Dépannage approfondi',
    prix: 49,
    suffixe: '',
    resume: 'Plusieurs problèmes traités dans la même session à distance.',
    inclus: ['Plusieurs problèmes dans la même session', 'Mises à jour, pilotes, imprimante, Wi-Fi, lenteurs…', 'Conseils pour éviter que ça revienne'],
  },
  mensuel: {
    nom: 'Forfait mensuel',
    prix: 19,
    suffixe: '/mois',
    resume: 'Assistance Windows à distance sans compter les sessions, résiliable à tout moment en ligne.',
    inclus: ['Sessions d’assistance à distance illimitées*', 'Un seul ordinateur Windows couvert', 'Sans engagement : résiliation en ligne en quelques clics'],
  },
}

export const euros = (n) => `${Number(n).toLocaleString('fr-FR')} €`

// Demande à Supabase de créer la page de paiement Stripe, puis renvoie son adresse.
export async function creerPaiement({ formule, probleme, accepteCgv, demandeExecutionImmediate }) {
  const res = await fetch(`${SUPABASE_URL}/functions/v1/creer-paiement`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      apikey: SUPABASE_ANON_KEY,
      Authorization: `Bearer ${SUPABASE_ANON_KEY}`,
    },
    body: JSON.stringify({ formule, probleme, accepteCgv, demandeExecutionImmediate }),
  })
  const corps = await res.json().catch(() => ({}))
  if (!res.ok || !corps.url) throw new Error(corps.erreur || 'Le paiement est momentanément indisponible.')
  return corps.url
}
