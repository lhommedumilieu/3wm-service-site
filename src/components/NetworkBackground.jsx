import { useEffect, useRef } from 'react'
import { prefersReducedMotion } from '../lib/motion.js'

/**
 * Subtle animated "network" canvas: drifting nodes connected by lines when
 * close enough to each other. Sits behind the hero copy as a decorative,
 * on-theme (cybersecurity / network) backdrop. Renders one static frame
 * instead of animating when the visitor prefers reduced motion.
 *
 * Dessiné en Canvas 2D natif (pas de dépendance externe) : l'effet ne
 * nécessite ni WebGL ni moteur 3D — juste des points et des segments —
 * donc plus besoin de Three.js ici, ce qui retire ~527 Ko du bundle.
 */
export default function NetworkBackground({ nodeCount = 46 }) {
  const canvasRef = useRef(null)

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return
    const ctx = canvas.getContext('2d')
    if (!ctx) return

    const reduced = prefersReducedMotion()
    const dpr = Math.min(window.devicePixelRatio || 1, 2)

    const accentColor = getComputedStyle(document.documentElement)
      .getPropertyValue('--accent')
      .trim() || '#0E7C86'

    let width = canvas.clientWidth
    let height = canvas.clientHeight

    function resizeCanvas() {
      width = canvas.clientWidth
      height = canvas.clientHeight
      canvas.width = Math.max(1, Math.round(width * dpr))
      canvas.height = Math.max(1, Math.round(height * dpr))
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0)
    }
    resizeCanvas()

    const nodes = Array.from({ length: nodeCount }, () => ({
      x: Math.random() * width,
      y: Math.random() * height,
      vx: (Math.random() - 0.5) * 0.18,
      vy: (Math.random() - 0.5) * 0.18,
    }))

    let linkDistance = Math.max(width, height) * 0.11

    function draw() {
      ctx.clearRect(0, 0, width, height)

      ctx.strokeStyle = accentColor
      ctx.lineWidth = 1
      ctx.globalAlpha = 0.18
      for (let i = 0; i < nodeCount; i++) {
        for (let j = i + 1; j < nodeCount; j++) {
          const dx = nodes[i].x - nodes[j].x
          const dy = nodes[i].y - nodes[j].y
          const dist = Math.sqrt(dx * dx + dy * dy)
          if (dist < linkDistance) {
            ctx.beginPath()
            ctx.moveTo(nodes[i].x, nodes[i].y)
            ctx.lineTo(nodes[j].x, nodes[j].y)
            ctx.stroke()
          }
        }
      }

      ctx.fillStyle = accentColor
      ctx.globalAlpha = 0.85
      for (const n of nodes) {
        ctx.beginPath()
        ctx.arc(n.x, n.y, 1.6, 0, Math.PI * 2)
        ctx.fill()
      }
      ctx.globalAlpha = 1
    }

    function step() {
      for (const n of nodes) {
        n.x += n.vx
        n.y += n.vy
        if (n.x < 0 || n.x > width) n.vx *= -1
        if (n.y < 0 || n.y > height) n.vy *= -1
        n.x = Math.min(Math.max(n.x, 0), width)
        n.y = Math.min(Math.max(n.y, 0), height)
      }
    }

    let frameId
    function animate() {
      step()
      draw()
      frameId = requestAnimationFrame(animate)
    }

    draw()
    if (!reduced) {
      frameId = requestAnimationFrame(animate)
    }

    function handleResize() {
      resizeCanvas()
      linkDistance = Math.max(width, height) * 0.11
      draw()
    }
    window.addEventListener('resize', handleResize)

    return () => {
      if (frameId) cancelAnimationFrame(frameId)
      window.removeEventListener('resize', handleResize)
    }
  }, [nodeCount])

  return <canvas ref={canvasRef} className="hero-canvas" aria-hidden="true" />
}
