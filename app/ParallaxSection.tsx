'use client'

import { CSSProperties, ReactNode, useEffect, useRef } from 'react'

type ParallaxSectionProps = {
  id?: string
  className: string
  image: string
  overlay: string
  children: ReactNode
}

export default function ParallaxSection({
  id,
  className,
  image,
  overlay,
  children,
}: ParallaxSectionProps) {
  const sectionRef = useRef<HTMLElement>(null)
  const bgRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const section = sectionRef.current
    const bg = bgRef.current

    if (!section || !bg) {
      return
    }

    const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)')
    let frame = 0

    const update = () => {
      frame = 0

      if (reduceMotion.matches) {
        bg.style.transform = 'scale(1.08)'
        return
      }

      const rect = section.getBoundingClientRect()
      const viewport = window.innerHeight || 1
      const sectionCenter = rect.top + rect.height / 2
      const viewportCenter = viewport / 2
      const distance = (sectionCenter - viewportCenter) / viewport
      const y = Math.max(-72, Math.min(72, distance * -42))

      bg.style.transform = `translate3d(0, ${y}px, 0) scale(1.08)`
    }

    const requestUpdate = () => {
      if (frame) {
        return
      }

      frame = window.requestAnimationFrame(update)
    }

    update()
    window.addEventListener('scroll', requestUpdate, { passive: true })
    window.addEventListener('resize', requestUpdate)
    reduceMotion.addEventListener('change', requestUpdate)

    return () => {
      if (frame) {
        window.cancelAnimationFrame(frame)
      }

      window.removeEventListener('scroll', requestUpdate)
      window.removeEventListener('resize', requestUpdate)
      reduceMotion.removeEventListener('change', requestUpdate)
    }
  }, [])

  return (
    <section id={id} ref={sectionRef} className={`${className} parallax-section`}>
      <div
        ref={bgRef}
        className="parallax-bg"
        style={
          {
            '--parallax-image': `url('${image}')`,
            '--parallax-overlay': overlay,
          } as CSSProperties
        }
      />
      <div className="parallax-content">{children}</div>
    </section>
  )
}
