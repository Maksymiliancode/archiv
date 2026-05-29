"use client"

import { useState, useEffect } from "react"
import { config } from "@/config/archiv"

function nextDesantDate(): Date {
  const now = new Date()
  const first = new Date(config.firstDesant.date)
  if (now < first) return first
  const d = new Date(now.getFullYear(), now.getMonth(), config.regularDesantDay, 0, 0, 0)
  if (d <= now) {
    return new Date(now.getFullYear(), now.getMonth() + 1, config.regularDesantDay, 0, 0, 0)
  }
  return d
}

function calcTime() {
  const diff = Math.max(0, nextDesantDate().getTime() - Date.now())
  const s = Math.floor(diff / 1000)
  return {
    d: Math.floor(s / 86400),
    h: Math.floor((s % 86400) / 3600),
    m: Math.floor((s % 3600) / 60),
    s: s % 60,
  }
}

export function Countdown({ allegroUrl }: { allegroUrl: string }) {
  const [t, setT] = useState<ReturnType<typeof calcTime> | null>(null)

  useEffect(() => {
    setT(calcTime())
    const id = setInterval(() => setT(calcTime()), 1000)
    return () => clearInterval(id)
  }, [])

  const pad = (n: number) => String(n).padStart(2, "0")
  const blocks: [string, string][] = t
    ? [[String(t.d), "DNI"], [pad(t.h), "GODZ"], [pad(t.m), "MIN"], [pad(t.s), "SEK"]]
    : [["--", "DNI"], ["--", "GODZ"], ["--", "MIN"], ["--", "SEK"]]

  const isFirst = new Date() < new Date(config.firstDesant.date)

  return (
    <section id="desant" className="av-section av-section-paper av-grain">
      <div className="av-wrap av-fade" style={{ textAlign: "center", position: "relative", zIndex: 2 }}>
        <div className="av-stamp" style={{ marginBottom: 30 }}>
          DESANT NR {config.firstDesant.number} / {config.firstDesant.year}
        </div>

        <div className="av-count" style={{ maxWidth: 760, margin: "0 auto" }}>
          {blocks.map(([n, l]) => (
            <div className="av-count-block av-crate" key={l}>
              <div className="av-count-num">{n}</div>
              <div className="av-count-lab">{l}</div>
            </div>
          ))}
        </div>

        <p
          style={{
            fontFamily: "var(--f-quote)",
            fontStyle: "italic",
            fontSize: 22,
            lineHeight: 1.6,
            color: "#4a4332",
            maxWidth: 660,
            margin: "44px auto 38px",
          }}
        >
          {isFirst
            ? `1 września 2026 pierwsze przedmioty z kolekcji lądują na Allegro.
               Militaria, noże, demobil, sprzęt survivalowy. Żaden przedmiot nie wraca drugi raz.`
            : `Każdego 7. dnia miesiąca nowa partia z kolekcji ląduje na Allegro.
               Militaria, noże, demobil, sprzęt survivalowy. Każdy znajdzie coś dla siebie —
               ale żaden przedmiot nie wraca drugi raz.`}
        </p>

        <div style={{ display: "flex", gap: 14, justifyContent: "center", flexWrap: "wrap" }}>
          <a
            className="av-btn av-btn-ghost"
            href={allegroUrl}
            target="_blank"
            rel="noopener noreferrer"
          >
            OBSERWUJ KONTO ALLEGRO →
          </a>
          <a className="av-btn av-btn-rust" href="/#newsletter">
            ZAPISZ SIĘ BY NIE PRZEGAPIĆ →
          </a>
        </div>
      </div>
    </section>
  )
}
