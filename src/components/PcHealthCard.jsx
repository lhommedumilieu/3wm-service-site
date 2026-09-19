import { useLayoutEffect, useRef } from 'react'
import { ensureGsap, prefersReducedMotion } from '../lib/motion.js'

const SCORE = 94
const RADIUS = 54
const CIRCUMFERENCE = 2 * Math.PI * RADIUS

const CHECKS = [
  { label: 'Antivirus', value: 'à jour' },
  { label: 'Mises à jour Windows', value: 'installées' },
  { label: 'Démarrage', value: '2 min 40 → 18 sec' },
  { label: 'Espace disque libéré', value: '8,4 Go' },
]

export default function PcHealthCard() {
  const numberRef = useRef(null)
  const circleRef = useRef(null)
  const rowsRef = useRef([])
  const startedRef = useRef(false)

  useLayoutEffect(() => {
    if (startedRef.current) return
    startedRef.current = true

    const circle = circleRef.current
    const numberEl = numberRef.current
    const rows = rowsRef.current.filter(Boolean)

    if (prefersReducedMotion()) {
      if (circle) circle.style.strokeDashoffset = String(CIRCUMFERENCE * (1 - SCORE / 100))
      if (numberEl) numberEl.textContent = String(SCORE)
      rows.forEach((row) => {
        row.style.opacity = '1'
        row.style.transform = 'none'
      })
      return
    }

    const gsap = ensureGsap()
    const tl = gsap.timeline({ delay: 0.3 })
    const counter = { value: 0 }

    tl.to(
      circle,
      {
        strokeDashoffset: CIRCUMFERENCE * (1 - SCORE / 100),
        duration: 1.4,
        ease: 'power2.out',
      },
      0
    )

    tl.to(
      counter,
      {
        value: SCORE,
        duration: 1.4,
        ease: 'power2.out',
        onUpdate: () => {
          if (numberEl) numberEl.textContent = String(Math.round(counter.value))
        },
      },
      0
    )

    tl.fromTo(
      rows,
      { opacity: 0, x: -10 },
      { opacity: 1, x: 0, duration: 0.45, stagger: 0.18, ease: 'power2.out' },
      0.5
    )

    return () => tl.kill()
  }, [])

  return (
    <div className="term-window health-card">
      <div className="term-titlebar">
        <div className="term-tab">
          <span className="term-path">Diagnostic PC — 3WM Service</span>
        </div>
        <div className="term-caption" aria-hidden="true">
          <span className="term-cap-btn">─</span>
          <span className="term-cap-btn">▢</span>
          <span className="term-cap-btn close">✕</span>
        </div>
      </div>
      <div className="health-body">
        <div className="health-gauge">
          <svg viewBox="0 0 120 120" width="128" height="128">
            <circle cx="60" cy="60" r={RADIUS} className="health-gauge-track" />
            <circle
              ref={circleRef}
              cx="60"
              cy="60"
              r={RADIUS}
              className="health-gauge-value"
              style={{
                strokeDasharray: CIRCUMFERENCE,
                strokeDashoffset: CIRCUMFERENCE,
              }}
            />
          </svg>
          <div className="health-gauge-label">
            <span ref={numberRef} className="health-score">0</span>
            <span className="health-score-suffix">/100</span>
            <span className="health-score-caption">Santé du PC</span>
          </div>
        </div>
        <ul className="health-checks">
          {CHECKS.map((item, i) => (
            <li key={item.label} ref={(el) => (rowsRef.current[i] = el)}>
              <svg
                className="health-check-icon"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <path d="M20 6L9 17l-5-5" />
              </svg>
              <span className="health-check-label">{item.label}</span>
              <span className="health-check-value">{item.value}</span>
            </li>
          ))}
        </ul>
      </div>
    </div>
  )
}
