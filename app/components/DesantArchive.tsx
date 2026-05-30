"use client"

import { useState } from "react"
import type { AllegroOffer } from "@/lib/allegro"

interface Props {
  offers: AllegroOffer[]
  crates: number[]
  allegroUrl: string
}

export function DesantArchive({ offers, crates, allegroUrl }: Props) {
  const [selected, setSelected] = useState<number | null>(
    crates.length > 0 ? crates[crates.length - 1] : null
  )

  const visible = selected === null
    ? offers
    : offers.filter((o) => o.desantCrate === selected)

  return (
    <>
      {/* Filtry skrzyń */}
      {crates.length >= 1 && (
        <div
          style={{
            display: "flex",
            gap: 10,
            flexWrap: "wrap",
            marginBottom: 40,
          }}
        >
          {crates.map((c) => {
            const active = selected === c
            return (
              <button
                key={c}
                onClick={() => setSelected(c)}
                className={active ? "av-btn av-btn-rust" : "av-btn av-btn-ghost"}
                style={{ padding: "10px 20px", fontSize: 13, letterSpacing: "0.16em" }}
              >
                SKRZYNIA {c}/30
              </button>
            )
          })}
          <button
            onClick={() => setSelected(null)}
            className={selected === null ? "av-btn av-btn-rust" : "av-btn av-btn-ghost"}
            style={{ padding: "10px 20px", fontSize: 13, letterSpacing: "0.16em" }}
          >
            WSZYSTKIE
          </button>
        </div>
      )}

      {/* Liczba pozycji */}
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          marginBottom: 28,
          flexWrap: "wrap",
          gap: 12,
        }}
      >
        <div className="av-stencil">
          POZ. 1–{visible.length} Z {visible.length}
        </div>
        <a href="/#desant" className="av-btn av-btn-ghost" style={{ padding: "8px 18px", fontSize: 12 }}>
          ← WRÓĆ DO DESANTU
        </a>
      </div>

      {/* Siatka kart */}
      <div className="av-cards">
        {visible.map((offer) => (
          <article
            className="av-card"
            key={offer.id}
            style={!offer.sold ? {
              position: "relative",
              border: "1px solid rgba(201,149,42,0.55)",
              boxShadow: "0 0 24px -6px rgba(212,168,40,0.28), 0 14px 30px -16px rgba(0,0,0,0.7)",
            } : undefined}
          >
            {!offer.sold && (
              <div style={{
                position: "absolute", top: 0, left: 0, right: 0, height: 4, zIndex: 10,
                background: "linear-gradient(90deg, transparent, #5A3F08 4%, #C9952A 18%, #D4A840 38%, #E8CC60 50%, #D4A840 62%, #C9952A 82%, #5A3F08 96%, transparent)",
                boxShadow: "0 0 8px rgba(200,160,30,0.3), 0 0 2px rgba(200,160,20,0.4)",
              }} />
            )}
            <div className="av-photo av-photo-sepia av-card-photo" style={{ position: "relative" }}>
              {!offer.sold && (
                <>
                  <div style={{
                    position: "absolute", inset: 0, zIndex: 3, pointerEvents: "none",
                    background: "radial-gradient(ellipse at center, transparent 45%, rgba(0,0,0,0.32) 100%)",
                  }} />
                  <div style={{ position: "absolute", top: 10, right: 10, zIndex: 6, transform: "rotate(-12deg)" }}>
                    <div style={{
                      width: 64, height: 64, borderRadius: "50%",
                      background: "linear-gradient(145deg, #3D2800, #C9952A, #A87020, #DDB840, #7A5210, #C9952A, #3D2800)",
                      display: "flex", alignItems: "center", justifyContent: "center",
                      boxShadow: "0 2px 16px rgba(180,130,10,0.6), inset 0 1px 3px rgba(255,245,120,0.6)",
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
                        }}>{offer.desantCrate}/30</span>
                      </div>
                    </div>
                  </div>
                </>
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

              {/* SOLD overlay */}
              {offer.sold && (
                <div
                  style={{
                    position: "absolute",
                    inset: 0,
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    background: "rgba(0,0,0,0.40)",
                    zIndex: 5,
                  }}
                >
                  <span
                    style={{
                      fontFamily: "var(--f-stamp)",
                      fontSize: 20,
                      letterSpacing: "0.18em",
                      color: "var(--rust)",
                      border: "2.5px solid var(--rust)",
                      padding: "6px 14px",
                      transform: "rotate(-12deg)",
                      display: "inline-block",
                      opacity: 0.92,
                    }}
                  >
                    SPRZEDANO
                  </span>
                </div>
              )}
            </div>

            <div className="av-card-body">
              <div className="av-card-sig" style={{ color: "var(--rust)" }}>
                SKRZYNIA {offer.desantCrate}/30
              </div>
              <div className="av-card-title">{offer.title}</div>
              <div className="av-card-meta">
                <span className="av-card-price">{offer.price}</span>
                <span className="av-card-time">{offer.timeText}</span>
              </div>
              {offer.sold ? (
                <div
                  className="av-card-cta"
                  style={{
                    background: "rgba(139,58,42,0.25)",
                    color: "var(--faded)",
                    cursor: "default",
                    justifyContent: "center",
                    display: "flex",
                    padding: "13px",
                    fontFamily: "var(--f-mono)",
                    fontSize: 12,
                    letterSpacing: "0.2em",
                  }}
                >
                  SPRZEDANO
                </div>
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
