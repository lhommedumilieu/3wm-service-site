import { useEffect } from 'react'

const SITE_NAME = '3WM Service'
const DEFAULT_TITLE = `${SITE_NAME} — Dépannage Windows, ebooks Linux & cybersécurité`
const DEFAULT_DESCRIPTION =
  "Assistance Windows à distance basée sur le consentement, ebooks pour apprendre Linux et la cybersécurité, et tutoriels pratiques sur le blog de 3WM Service."
const DEFAULT_IMAGE = 'https://3-wm.net/og-image.png'

function setMetaTag(attr, key, content) {
  let tag = document.querySelector(`meta[${attr}="${key}"]`)
  if (!tag) {
    tag = document.createElement('meta')
    tag.setAttribute(attr, key)
    document.head.appendChild(tag)
  }
  tag.setAttribute('content', content)
}

function setCanonical(url) {
  let link = document.querySelector('link[rel="canonical"]')
  if (!link) {
    link = document.createElement('link')
    link.setAttribute('rel', 'canonical')
    document.head.appendChild(link)
  }
  link.setAttribute('href', url)
}

function setStructuredData(data) {
  const script = document.getElementById('page-structured-data')
  if (!data) {
    if (script) script.remove()
    return
  }
  const tag = script || document.createElement('script')
  tag.type = 'application/ld+json'
  tag.id = 'page-structured-data'
  tag.textContent = JSON.stringify(data)
  if (!script) document.head.appendChild(tag)
}

/**
 * Met à jour le <title>, les balises meta (description, Open Graph,
 * Twitter Card) et les données structurées Schema.org (JSON-LD) de la page
 * courante. Aucune dépendance externe : lit/écrit directement le <head> via
 * useEffect, ce qui suffit pour une SPA servie statiquement (le HTML initial
 * garde son propre titre/description par défaut pour les robots qui
 * n'exécutent pas le JS).
 *
 * `structuredData` est un objet Schema.org (avec @context/@type) ou un
 * tableau de plusieurs objets — utile par exemple pour combiner un
 * BlogPosting et un BreadcrumbList sur un même article.
 */
export default function useDocumentMeta(title, description, path, structuredData, image) {
  useEffect(() => {
    const fullTitle = title ? `${title} | ${SITE_NAME}` : DEFAULT_TITLE
    const finalDescription = description || DEFAULT_DESCRIPTION
    const finalImage = image || DEFAULT_IMAGE

    document.title = fullTitle
    setMetaTag('name', 'description', finalDescription)
    setMetaTag('property', 'og:title', fullTitle)
    setMetaTag('property', 'og:description', finalDescription)
    setMetaTag('property', 'og:type', 'website')
    setMetaTag('property', 'og:site_name', SITE_NAME)
    setMetaTag('property', 'og:image', finalImage)
    setMetaTag('property', 'og:image:width', '1200')
    setMetaTag('property', 'og:image:height', '630')
    setMetaTag('name', 'twitter:card', 'summary_large_image')
    setMetaTag('name', 'twitter:title', fullTitle)
    setMetaTag('name', 'twitter:description', finalDescription)
    setMetaTag('name', 'twitter:image', finalImage)

    if (path) {
      const url = `https://3-wm.net${path}`
      setCanonical(url)
      setMetaTag('property', 'og:url', url)
    }

    setStructuredData(structuredData)

    return () => {
      document.title = DEFAULT_TITLE
      setStructuredData(null)
    }
  }, [title, description, path, structuredData])
}

