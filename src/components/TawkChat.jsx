import { useEffect } from 'react'
import { TAWK_PROPERTY_ID, TAWK_WIDGET_ID, isTawkConfigured } from '../lib/config.js'

// Injecte le widget de chat Tawk.to une seule fois, seulement si les
// identifiants ont été renseignés dans src/lib/config.js.
export default function TawkChat() {
  useEffect(() => {
    if (!isTawkConfigured) return
    if (document.getElementById('tawk-script')) return

    const script = document.createElement('script')
    script.id = 'tawk-script'
    script.async = true
    script.src = `https://embed.tawk.to/${TAWK_PROPERTY_ID}/${TAWK_WIDGET_ID}`
    script.charset = 'UTF-8'
    script.setAttribute('crossorigin', '*')
    document.body.appendChild(script)
  }, [])

  return null
}
