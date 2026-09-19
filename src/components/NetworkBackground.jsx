import { useEffect, useRef } from 'react'
import * as THREE from 'three'
import { prefersReducedMotion } from '../lib/motion.js'

/**
 * Subtle animated "network" canvas: drifting nodes connected by lines when
 * close enough to each other. Sits behind the hero copy as a decorative,
 * on-theme (cybersecurity / network) backdrop. Renders one static frame
 * instead of animating when the visitor prefers reduced motion.
 */
export default function NetworkBackground({ nodeCount = 46 }) {
  const mountRef = useRef(null)

  useEffect(() => {
    const container = mountRef.current
    if (!container) return

    let width = container.clientWidth
    let height = container.clientHeight
    const reduced = prefersReducedMotion()

    const accentColor = getComputedStyle(document.documentElement)
      .getPropertyValue('--accent')
      .trim() || '#0E7C86'

    const scene = new THREE.Scene()
    const camera = new THREE.OrthographicCamera(0, width, 0, height, 0.1, 100)
    camera.position.z = 10

    const renderer = new THREE.WebGLRenderer({ alpha: true, antialias: true })
    renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 2))
    renderer.setSize(width, height)
    container.appendChild(renderer.domElement)

    // Nodes
    const nodes = Array.from({ length: nodeCount }, () => ({
      x: Math.random() * width,
      y: Math.random() * height,
      vx: (Math.random() - 0.5) * 0.18,
      vy: (Math.random() - 0.5) * 0.18,
    }))

    const color = new THREE.Color(accentColor)

    const pointsGeometry = new THREE.BufferGeometry()
    const pointsPositions = new Float32Array(nodeCount * 3)
    pointsGeometry.setAttribute('position', new THREE.BufferAttribute(pointsPositions, 3))
    const pointsMaterial = new THREE.PointsMaterial({ color, size: 3.2, transparent: true, opacity: 0.85 })
    const points = new THREE.Points(pointsGeometry, pointsMaterial)
    scene.add(points)

    const maxLines = nodeCount * 8
    const lineGeometry = new THREE.BufferGeometry()
    const linePositions = new Float32Array(maxLines * 2 * 3)
    lineGeometry.setAttribute('position', new THREE.BufferAttribute(linePositions, 3))
    const lineMaterial = new THREE.LineBasicMaterial({ color, transparent: true, opacity: 0.18 })
    const lines = new THREE.LineSegments(lineGeometry, lineMaterial)
    scene.add(lines)

    const linkDistance = Math.max(width, height) * 0.11

    function layout() {
      const posAttr = pointsGeometry.attributes.position
      for (let i = 0; i < nodeCount; i++) {
        posAttr.array[i * 3] = nodes[i].x
        posAttr.array[i * 3 + 1] = height - nodes[i].y
        posAttr.array[i * 3 + 2] = 0
      }
      posAttr.needsUpdate = true

      let segIndex = 0
      const linePosArr = lineGeometry.attributes.position.array
      for (let i = 0; i < nodeCount && segIndex < maxLines; i++) {
        for (let j = i + 1; j < nodeCount && segIndex < maxLines; j++) {
          const dx = nodes[i].x - nodes[j].x
          const dy = nodes[i].y - nodes[j].y
          const dist = Math.sqrt(dx * dx + dy * dy)
          if (dist < linkDistance) {
            const base = segIndex * 6
            linePosArr[base] = nodes[i].x
            linePosArr[base + 1] = height - nodes[i].y
            linePosArr[base + 2] = 0
            linePosArr[base + 3] = nodes[j].x
            linePosArr[base + 4] = height - nodes[j].y
            linePosArr[base + 5] = 0
            segIndex++
          }
        }
      }
      lineGeometry.setDrawRange(0, segIndex * 2)
      lineGeometry.attributes.position.needsUpdate = true
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
      layout()
    }

    let frameId
    function animate() {
      step()
      renderer.render(scene, camera)
      frameId = requestAnimationFrame(animate)
    }

    layout()
    renderer.render(scene, camera)
    if (!reduced) {
      frameId = requestAnimationFrame(animate)
    }

    function handleResize() {
      width = container.clientWidth
      height = container.clientHeight
      camera.right = width
      camera.bottom = height
      camera.updateProjectionMatrix()
      renderer.setSize(width, height)
      layout()
      if (reduced) renderer.render(scene, camera)
    }
    window.addEventListener('resize', handleResize)

    return () => {
      if (frameId) cancelAnimationFrame(frameId)
      window.removeEventListener('resize', handleResize)
      pointsGeometry.dispose()
      pointsMaterial.dispose()
      lineGeometry.dispose()
      lineMaterial.dispose()
      renderer.dispose()
      if (container.contains(renderer.domElement)) {
        container.removeChild(renderer.domElement)
      }
    }
  }, [nodeCount])

  return <div ref={mountRef} className="hero-canvas" aria-hidden="true" />
}
