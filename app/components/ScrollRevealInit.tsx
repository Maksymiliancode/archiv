"use client"

import { useEffect } from "react"

export function ScrollRevealInit() {
  useEffect(() => {
    // Defer until after React hydration completes — two rAF frames guarantee we're past
    // the concurrent hydration pass where layout effects fire before page components finish.
    let raf1: number, raf2: number, fallback: ReturnType<typeof setTimeout>
    let io: IntersectionObserver | null = null

    raf1 = requestAnimationFrame(() => {
      raf2 = requestAnimationFrame(() => {
        const els = [...document.querySelectorAll<HTMLElement>(".av-fade")]
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
        els.forEach((el) => io!.observe(el))

        fallback = setTimeout(() => {
          els.forEach((el) => {
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
