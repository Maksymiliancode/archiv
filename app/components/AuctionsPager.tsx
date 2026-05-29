"use client"

import { useState } from "react"
import type { AllegroOffer } from "@/lib/allegro"

const PAGE_SIZE = 8

interface AuctionsPagerProps {
  offers: AllegroOffer[]
  totalCount: number
  allegroUrl: string
}

export function AuctionsPager({ offers, totalCount, allegroUrl }: AuctionsPagerProps) {
  const [page, setPage] = useState(0)

  const totalPages = Math.ceil(offers.length / PAGE_SIZE)
  const visible    = offers.slice(page * PAGE_SIZE, (page + 1) * PAGE_SIZE)

  const isLive = totalCount > 0

  return (
    <>
      <div className="av-cards">
        {visible.map((lot) => (
          <article className="av-card" key={lot.id}>
            <div className="av-photo av-photo-sepia av-card-photo">
              {lot.imageUrl ? (
                // eslint-disable-next-line @next/next/no-img-element
                <img
                  src={lot.imageUrl}
                  alt={lot.title}
                  style={{ width: "100%", height: "100%", objectFit: "cover" }}
                />
              ) : (
                <span>FOTO · {lot.id.slice(-4).toUpperCase()}</span>
              )}
            </div>
            <div className="av-card-body">
              <div className="av-card-sig">
                {isLive ? `LOT #${lot.id.slice(-6)}` : `LOT ${lot.id}`}
              </div>
              <div className="av-card-title">{lot.title}</div>
              <div className="av-card-meta">
                <span className="av-card-price">{lot.price}</span>
                {lot.timeText && (
                  <span className={`av-card-time${lot.urgent ? " urgent" : ""}`}>
                    {lot.timeText}
                  </span>
                )}
              </div>
              <a
                className="av-card-cta"
                href={lot.offerUrl || allegroUrl}
                target="_blank"
                rel="noopener noreferrer"
              >
                {lot.format === 'AUCTION' ? 'LICYTUJ →' : 'KUP TERAZ →'}
              </a>
            </div>
          </article>
        ))}
      </div>

      {totalPages > 1 && (
        <div
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            gap: 24,
            marginTop: 44,
            fontFamily: "var(--f-mono)",
          }}
        >
          <button
            onClick={() => setPage((p) => p - 1)}
            disabled={page === 0}
            className="av-btn av-btn-ghost"
            style={{ opacity: page === 0 ? 0.3 : 1, cursor: page === 0 ? "default" : "pointer", minWidth: 0, padding: "10px 20px" }}
          >
            ← POPRZEDNIA
          </button>

          <span
            style={{
              fontSize: 13,
              letterSpacing: "0.22em",
              color: "var(--gold)",
              whiteSpace: "nowrap",
            }}
          >
            STRONA {page + 1} / {totalPages}
            {totalCount > offers.length && (
              <span style={{ color: "var(--faded)", fontSize: 11, display: "block", textAlign: "center", marginTop: 4 }}>
                łącznie {totalCount} aukcji
              </span>
            )}
          </span>

          <button
            onClick={() => setPage((p) => p + 1)}
            disabled={page === totalPages - 1}
            className="av-btn av-btn-ghost"
            style={{ opacity: page === totalPages - 1 ? 0.3 : 1, cursor: page === totalPages - 1 ? "default" : "pointer", minWidth: 0, padding: "10px 20px" }}
          >
            NASTĘPNA →
          </button>
        </div>
      )}
    </>
  )
}
