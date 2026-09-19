import { useRef, useLayoutEffect } from 'react'
import { ensureGsap, ScrollTrigger, prefersReducedMotion } from '../lib/motion.js'

/**
 * Wraps children and fades/slides them in as they scroll into view.
 * Skips animation entirely (content stays visible) if the user prefers
 * reduced motion, or if anything goes wrong with GSAP init.
 */
export default function Reveal({ as: Tag = 'div', y = 20, delay = 0, className = '', children, ...rest }) {
  const ref = useRef(null)

  useLayoutEffect(() => {
    const el = ref.current
    if (!el || prefersReducedMotion()) return

    const gsap = ensureGsap()
    const ctx = gsap.context(() => {
      gsap.fromTo(
        el,
        { opacity: 0, y },
        {
          opacity: 1,
          y: 0,
          duration: 0.7,
          delay,
          ease: 'power2.out',
          scrollTrigger: {
            trigger: el,
            start: 'top 88%',
            once: true,
          },
        }
      )
    }, ref)

    return () => ctx.revert()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  return (
    <Tag ref={ref} className={className} {...rest}>
      {children}
    </Tag>
  )
}

export function refreshScrollTrigger() {
  ScrollTrigger.refresh()
}
