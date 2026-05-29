"use client"

import { useEffect } from "react"

export function ScrollRevealInit() {
  useEffect(() => {
    // Defer until after React hydration completes — two rAF frames guarantee we're past
    // the concurrent hydration pass where layout effects fire before page components finish.
    let raf1: number, raf2: number, fallback: ReturnType<typeof setTimeout>
    let io: IntersectionObserver | null = null

    const observe = () => {
      document.querySelectorAll<HTMLElement>(".av-fade").forEach((el) => {
        if (!io) return
        io.observe(el)
      })
    }

    raf1 = requestAnimationFrame(() => {
      raf2 = requestAnimationFrame(() => {
        io = new IntersectionObserver(
          (entries) =>
            entries.forEach((e) => {
              if (e.isIntersecting) {
                e.target.classList.add("av-in")
                io!.unobserve(e.target)
              }
            }),
          { threshold: 0.12 }
        )
        observe()

        // fallback re-queries DOM — łapie elementy dodane przez Suspense po montażu
        fallback = setTimeout(() => {
          document.querySelectorAll<HTMLElement>(".av-fade").forEach((el) => {
            el.classList.add("av-in")
            el.style.transition = "none"
            el.style.opacity = "1"
            el.style.transform = "none"
          })
        }, 1800)
      })
    })

    return () => {
      cancelAnimationFrame(raf1)
      cancelAnimationFrame(raf2)
      io?.disconnect()
      clearTimeout(fallback)
    }
  }, [])
  return null
}
