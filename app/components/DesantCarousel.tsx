"use client"

import { useRef, useState, useCallback, useEffect } from "react"
import type { AllegroOffer } from "@/lib/allegro"

const CARD_W = 300
const GAP = 20

export function DesantCarousel({ offers, allegroUrl }: { offers: AllegroOffer[]; allegroUrl: string }) {
  const crateNum = offers.length > 0 ? (offers[0].desantCrate ?? 0) : 0
  const ref = useRef<HTMLDivElement>(null)
  const [canLeft, setCanLeft] = useState(false)
  const [canRight, setCanRight] = useState(false)

  const sync = useCallback(() => {
    const el = ref.current
    if (!el) return
    setCanLeft(el.scrollLeft > 4)
    setCanRight(el.scrollLeft < el.scrollWidth - el.clientWidth - 4)
  }, [])

  useEffect(() => { sync() }, [sync])

  const slide = (dir: -1 | 1) =>
    ref.current?.scrollBy({ left: dir * (CARD_W + GAP), behavior: "smooth" })

  return (
    <>
      <style>{`.dsc::-webkit-scrollbar{display:none}`}</style>

      {/* Nagłówek + strzałki */}
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          marginBottom: 24,
          textAlign: "left",
        }}
      >
        <div className="av-stamp" style={{
            fontSize: 13, transform: "rotate(-2deg)",
            ...(crateNum === 0 && { borderColor: "var(--gold)", color: "var(--gold)" }),
          }}>
          {crateNum === 0 ? "EARLY ACCESS · SKRZYNIA 0/30" : `SKRZYNIA ${crateNum}/30`}
        </div>
        <div style={{ display: "flex", gap: 6 }}>
          <button
            onClick={() => slide(-1)}
            className="av-btn av-btn-ghost"
            style={{
              padding: "7px 16px",
              fontSize: 18,
              lineHeight: 1,
              opacity: canLeft ? 1 : 0.22,
              cursor: canLeft ? "pointer" : "default",
              transition: "opacity .2s",
            }}
            aria-label="W lewo"
          >
            ←
          </button>
          <button
            onClick={() => slide(1)}
            className="av-btn av-btn-ghost"
            style={{
              padding: "7px 16px",
              fontSize: 18,
              lineHeight: 1,
              opacity: canRight ? 1 : 0.22,
              cursor: canRight ? "pointer" : "default",
              transition: "opacity .2s",
            }}
            aria-label="W prawo"
          >
            →
          </button>
        </div>
      </div>

      {/* Scroll strip — scrollbar ukryty, peek przez brak padding-right */}
      <div
        ref={ref}
        onScroll={sync}
        className="dsc"
        style={{
          display: "flex",
          gap: GAP,
          overflowX: "auto",
          scrollbarWidth: "none",
          paddingBottom: 6,
          textAlign: "left",
        } as React.CSSProperties}
      >
        {offers.map((offer) => (
          <article
            key={offer.id}
            className="av-card"
            style={{
              width: CARD_W, minWidth: CARD_W, flexShrink: 0,
              position: "relative",
              border: "1px solid rgba(201,149,42,0.55)",
              boxShadow: "0 0 24px -6px rgba(212,168,40,0.28), 0 14px 30px -16px rgba(0,0,0,0.7)",
            }}
          >
            {/* Metaliczna linia u góry — gradient z blaskiem */}
            <div style={{
              position: "absolute", top: 0, left: 0, right: 0, height: 5, zIndex: 10,
              background: "linear-gradient(90deg, transparent, #5A3F08 4%, #C9952A 18%, #D4A840 38%, #E8CC60 50%, #D4A840 62%, #C9952A 82%, #5A3F08 96%, transparent)",
              boxShadow: "0 0 8px rgba(200,160,30,0.3), 0 0 2px rgba(200,160,20,0.4)",
            }} />

            <div className="av-photo av-photo-sepia av-card-photo" style={{ position: "relative" }}>
              {/* Corner vignette */}
              <div style={{
                position: "absolute", inset: 0, zIndex: 3, pointerEvents: "none",
                background: "radial-gradient(ellipse at center, transparent 45%, rgba(0,0,0,0.32) 100%)",
              }} />

              {/* Metaliczny stempel — zewnętrzny ring jako gradient, środek ciemny */}
              <div style={{ position: "absolute", top: 10, right: 10, zIndex: 6, transform: "rotate(-12deg)" }}>
                <div style={{
                  width: 64, height: 64, borderRadius: "50%",
                  background: "linear-gradient(145deg, #3D2800, #C9952A, #A87020, #DDB840, #7A5210, #C9952A, #3D2800)",
                  display: "flex", alignItems: "center", justifyContent: "center",
                  boxShadow: "0 2px 12px rgba(160,110,10,0.4), inset 0 1px 2px rgba(220,190,80,0.35)",
                }}>
                  <div style={{
                    width: 58, height: 58, borderRadius: "50%",
                    background: "radial-gradient(circle at 38% 32%, #1e1b10, #0c0a06)",
                    display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center",
                    lineHeight: 1.35, textAlign: "center",
                  }}>
                    <span style={{
                      fontFamily: "var(--f-stamp)", fontSize: 8, letterSpacing: "0.14em", display: "block",
                      background: "linear-gradient(180deg, #D4A840, #8B6010)",
                      WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent", backgroundClip: "text",
                    }}>SERIA</span>
                    <span style={{
                      fontFamily: "var(--f-stamp)", fontSize: 15, letterSpacing: "0.04em", display: "block",
                      background: "linear-gradient(180deg, #DDB840 0%, #C9952A 50%, #8B6010 100%)",
                      WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent", backgroundClip: "text",
                    }}>{crateNum}/30</span>
                  </div>
                </div>
              </div>

              {offer.sold && (
                <div style={{
                  position: "absolute", inset: 0, display: "flex", alignItems: "center",
                  justifyContent: "center", background: "rgba(0,0,0,0.40)", zIndex: 7,
                }}>
                  <span style={{
                    fontFamily: "var(--f-stamp)", fontSize: 20, letterSpacing: "0.18em",
                    color: "var(--rust)", border: "2.5px solid var(--rust)", padding: "6px 14px",
                    transform: "rotate(-12deg)", display: "inline-block", opacity: 0.92,
                  }}>SPRZEDANO</span>
                </div>
              )}
              {offer.imageUrl ? (
                // eslint-disable-next-line @next/next/no-img-element
                <img
                  src={offer.imageUrl}
                  alt={offer.title}
                  style={{ width: "100%", height: "100%", objectFit: "cover" }}
                />
              ) : (
                <span>FOTO · {offer.id.slice(-4).toUpperCase()}</span>
              )}
            </div>
            <div className="av-card-body">
              <div className="av-card-sig" style={{ color: crateNum === 0 ? "var(--gold)" : "var(--rust)" }}>
                {crateNum === 0 ? `EARLY ACCESS · SKRZYNIA ${offer.desantCrate}/30` : `SKRZYNIA ${offer.desantCrate}/30`}
              </div>
              <div className="av-card-title">{offer.title}</div>
              <div className="av-card-meta">
                <span className="av-card-price">{offer.price}</span>
                {offer.timeText && !offer.sold && (
                  <span className={`av-card-time${offer.urgent ? " urgent" : ""}`}>
                    {offer.timeText}
                  </span>
                )}
              </div>
              {offer.sold ? (
                <div className="av-card-cta" style={{
                  background: "rgba(139,58,42,0.25)", color: "var(--faded)",
                  cursor: "default", display: "flex", justifyContent: "center",
                  padding: "13px", fontFamily: "var(--f-mono)", fontSize: 12, letterSpacing: "0.2em",
                }}>SPRZEDANO</div>
              ) : (
              <a
                className="av-card-cta"
                href={offer.offerUrl || allegroUrl}
                target="_blank"
                rel="noopener noreferrer"
              >
                {offer.format === "AUCTION" ? "LICYTUJ →" : "KUP TERAZ →"}
              </a>
              )}
            </div>
          </article>
        ))}
      </div>
    </>
  )
}
