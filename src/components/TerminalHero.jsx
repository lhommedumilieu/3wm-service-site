import { useLayoutEffect, useRef } from 'react'
import { ensureGsap, prefersReducedMotion } from '../lib/motion.js'

const LINES = [
  { text: 'PS C:\\Users\\Client> Diagnostic-PC', cls: 'p' },
  { text: 'Antivirus : à jour   Windows Update : à jour', cls: 'out' },
  { text: '', cls: '' },
  { text: 'PS C:\\Users\\Client> dir Services\\', cls: 'p' },
  { text: 'Depannage.ps1   Ebooks\\   Blog\\', cls: 'out' },
  { text: '', cls: '' },
  { text: 'PS C:\\Users\\Client> .\\Depannage.ps1 -Demarrer', cls: 'p' },
  { text: '[OK] Session sécurisée. Consentement requis avant toute action.', cls: 'ok' },
]

export default function TerminalHero() {
  const bodyRef = useRef(null)
  const doneRef = useRef(false)

  useLayoutEffect(() => {
    const el = bodyRef.current
    if (!el || doneRef.current) return

    if (prefersReducedMotion()) {
      el.innerHTML = renderStatic()
      doneRef.current = true
      return
    }

    doneRef.current = true
    const gsap = ensureGsap()
    el.innerHTML = ''
    const tl = gsap.timeline({ delay: 0.3 })

    LINES.forEach((line) => {
      const div = document.createElement('div')
      if (line.cls) div.className = line.cls
      el.appendChild(div)
      if (!line.text) {
        div.innerHTML = '&nbsp;'
        return
      }
      const chars = line.text.split('')
      tl.to(
        {},
        {
          duration: Math.max(chars.length * 0.018, 0.1),
          ease: 'none',
          onUpdate: function () {
            const progress = this.progress()
            const count = Math.round(progress * chars.length)
            div.textContent = chars.slice(0, count).join('')
          },
        }
      )
    })

    tl.call(() => {
      const cursor = document.createElement('span')
      cursor.className = 'term-cursor'
      const promptLine = document.createElement('div')
      promptLine.innerHTML = '<span class="p">PS C:\\Users\\Client&gt;</span> '
      promptLine.appendChild(cursor)
      el.appendChild(promptLine)
    })

    return () => tl.kill()
  }, [])

  function renderStatic() {
    return (
      LINES.map((l) => `<div class="${l.cls}">${l.text || '&nbsp;'}</div>`).join('') +
      '<div><span class="p">PS C:\\Users\\Client&gt;</span> <span class="term-cursor"></span></div>'
    )
  }

  return (
    <div className="term-window">
      <div className="term-titlebar">
        <span className="term-dot red"></span>
        <span className="term-dot yellow"></span>
        <span className="term-dot green"></span>
        <span className="term-path">Assistance à distance — 3WM Service</span>
      </div>
      <div className="term-body" ref={bodyRef}></div>
    </div>
  )
}
