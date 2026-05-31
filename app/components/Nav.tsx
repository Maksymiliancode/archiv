"use client"

import { useState, useEffect } from "react"

const LINKS = [
  { href: "/#desant",     label: "DESANT"   },
  { href: "/desant",      label: "ARCHIWUM" },
  { href: "/o-nas",       label: "O NAS"    },
  { href: "/#meldunek",   label: "KONTAKT"  },
  { href: "/#newsletter", label: "SYGNAŁ"   },
]

export function Nav() {
  const [open, setOpen]         = useState(false)
  const [scrolled, setScrolled] = useState(false)

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 8)
    onScroll()
    window.addEventListener("scroll", onScroll, { passive: true })
    return () => window.removeEventListener("scroll", onScroll)
  }, [])

  // Zamknij menu przy kliknięciu poza nim
  useEffect(() => {
    if (!open) return
    const onClick = (e: MouseEvent) => {
      const root = document.getElementById("av-nav-root")
      if (root && !root.contains(e.target as Node)) setOpen(false)
    }
    document.addEventListener("mousedown", onClick)
    return () => document.removeEventListener("mousedown", onClick)
  }, [open])

  return (
    <div id="av-nav-root">
      <nav
        className="av-nav av-grain av-grain-dark"
        style={{
          position: "fixed",
          top: 0, left: 0, right: 0,
          zIndex: 200,
          background: "var(--bg-dark)",
          boxShadow: scrolled ? "0 2px 28px rgba(0,0,0,0.6)" : "none",
          transition: "box-shadow .3s",
        }}
      >
        <a href="/" className="av-nav-logo">
          <b>ARCHIV</b>
          <span>BIELSKO-BIAŁA — OD 1997</span>
        </a>

        {/* Desktop — widoczne od 641px */}
        <div className="av-nav-menu av-nav-desktop">
          {LINKS.map(l => <a key={l.href} href={l.href}>{l.label}</a>)}
        </div>

        {/* Hamburger — widoczny do 640px */}
        <button
          className="av-hamburger"
          onClick={() => setOpen(o => !o)}
          aria-label={open ? "Zamknij menu" : "Otwórz menu"}
          aria-expanded={open}
        >
          <span className={`av-ham${open ? " is-open" : ""}`}>
            <span /><span /><span />
          </span>
        </button>
      </nav>

      {/* Mobile menu */}
      <div className={`av-mob-menu${open ? " is-open" : ""}`} aria-hidden={!open}>
        {LINKS.map(l => (
          <a key={l.href} href={l.href} className="av-mob-link" onClick={() => setOpen(false)}>
            {l.label}
          </a>
        ))}
      </div>
    </div>
  )
}
