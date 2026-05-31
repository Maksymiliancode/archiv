import { connection } from "next/server"
import { getActiveOffers, getEndedDesantOffers } from "@/lib/allegro"
import { Countdown } from "./Countdown"
import { DesantCarousel } from "./DesantCarousel"
import { DesantTimeline } from "./DesantTimeline"
import {
  getDesantState,
  getNextDesantDate,
  getDesantDate,
  getCurrentDesantNum,
  fmtDate,
} from "@/lib/desantState"

export async function DesantSection({ allegroUrl }: { allegroUrl: string }) {
  await connection()
  const [{ offers: active }, { offers: ended }] = await Promise.all([
    getActiveOffers(),
    getEndedDesantOffers(),
  ])

  const now   = new Date()
  const state = getDesantState(now)

  // activeCrate: z Allegro jeśli dostępne, fallback z daty
  const activeDesant   = active.filter((o) => o.desantCrate !== undefined)
  const allegroActive  = activeDesant.length > 0
    ? Math.max(...activeDesant.map((o) => o.desantCrate!))
    : null
  const activeCrate    = allegroActive ?? (state === 0 ? 0 : getCurrentDesantNum(now))

  const nextCrate      = activeCrate + 1
  const nextDate       = getNextDesantDate(now)
  const nextDateISO    = nextDate.toISOString()

  // Oferty do karuzeli: aktywne + zakończone z tej samej skrzyni
  const endedCurrent = ended.filter((o) => o.desantCrate === activeCrate)
  const desantOffers = [...activeDesant, ...endedCurrent]

  // Data i opis bieżącej skrzyni (State 1)
  const crateDate    = getDesantDate(activeCrate)
  const crateDateStr = fmtDate(crateDate)

  return (
    <section id="desant" className="av-section av-section-paper av-grain">
      <div className="av-wrap av-fade" style={{ position: "relative", zIndex: 2 }}>

        {/* ── OŚ CZASU ─────────────────────────────────────────── */}
        <DesantTimeline state={state} activeCrate={activeCrate} />

        {/* ═══ STATE 0 — EARLY ACCESS (przed 1 września) ══════════ */}
        {state === 0 && (
          <>
            <div style={{ textAlign: "center", marginBottom: 36 }}>
              <div className="av-stamp" style={{ marginBottom: 26 }}>
                DESANT 1 / 30 · 1 WRZEŚNIA 2026
              </div>
              <Countdown targetDate={nextDateISO} size="large" />
              <MysteryStrip crateNum={1} />
              <p style={{
                fontFamily: "var(--f-quote)", fontStyle: "italic",
                fontSize: 22, lineHeight: 1.6, color: "#4a4332",
                maxWidth: 660, margin: "32px auto 0",
              }}>
                1 września pierwsze przedmioty z kolekcji Archiv lądują na Allegro — militaria,
                noże, demobil i sprzęt survivalowy w limitowanym czasie i dobrej cenie.
                Później każdego 7. dnia miesiąca.
              </p>
            </div>

            {desantOffers.length > 0 && (
              <>
                <hr className="av-rule" style={{ margin: "44px auto", maxWidth: 760 }} />
                <DesantCarousel offers={desantOffers} allegroUrl={allegroUrl} />
                <p style={{
                  marginTop: 20, fontFamily: "var(--f-quote)", fontStyle: "italic",
                  fontSize: 14, color: "var(--faded)", textAlign: "center", opacity: 0.85,
                }}>
                  Skrzynia 0 to specjalna oferta dla pierwszych klientów Archiv.
                  Znika gdy pojawi się Desant nr 1 — 1 września 2026.
                </p>
              </>
            )}
          </>
        )}

        {/* ═══ STATE 1 — ŚWIEŻY DESANT (dni 1–7 po lądowaniu) ══════ */}
        {state === 1 && (
          <>
            <div style={{ textAlign: "center", marginBottom: 36 }}>
              <div className="av-stamp" style={{ marginBottom: 16 }}>
                DESANT NR {activeCrate} / 30
              </div>
              <div style={{
                fontFamily: "var(--f-stamp)",
                fontSize: "clamp(26px, 4vw, 46px)",
                letterSpacing: "0.06em",
                color: "var(--rust)",
                lineHeight: 1,
                margin: "12px 0 8px",
              }}>
                SKRZYNIA WŁAŚNIE WYLĄDOWAŁA
              </div>
              <div style={{
                fontFamily: "var(--f-stamp)", fontSize: 11,
                letterSpacing: "0.3em", color: "var(--faded)",
              }}>
                {crateDateStr} · 30 PRZEDMIOTÓW · ŻADEN NIE WRACA
              </div>
            </div>

            {desantOffers.length > 0 && (
              <DesantCarousel offers={desantOffers} allegroUrl={allegroUrl} />
            )}

            <div style={{
              marginTop: 32, paddingTop: 28,
              borderTop: "1px solid rgba(139,58,42,0.15)",
              textAlign: "center",
            }}>
              <Countdown targetDate={nextDateISO} size="small" label="DO NASTĘPNEGO DESANTU" />
              <div style={{ marginTop: 14 }}>
                <MysteryStrip crateNum={nextCrate} />
              </div>
            </div>
          </>
        )}

        {/* ═══ STATE 2 — ODLICZANIE (dni 8–30 przed desantem) ══════ */}
        {state === 2 && (
          <>
            <div style={{ textAlign: "center", marginBottom: 40 }}>
              <div className="av-stamp" style={{ marginBottom: 26 }}>
                NASTĘPNY DESANT NR {nextCrate} / 30
              </div>
              <Countdown targetDate={nextDateISO} size="large" />
              <MysteryStrip crateNum={nextCrate} />
              <p style={{
                fontFamily: "var(--f-quote)", fontStyle: "italic",
                fontSize: 22, lineHeight: 1.6, color: "#4a4332",
                maxWidth: 660, margin: "32px auto 0",
              }}>
                Każdego 7. dnia miesiąca nowa skrzynia z militariami, demobilem i sprzętem
                survivalowym. Gdy pojawi się kolejna, ta znika na zawsze.
              </p>
            </div>

            {desantOffers.length > 0 && (
              <>
                <hr className="av-rule" style={{ margin: "44px auto", maxWidth: 760 }} />
                <DesantCarousel offers={desantOffers} allegroUrl={allegroUrl} />
                <p style={{
                  marginTop: 20, fontFamily: "var(--f-quote)", fontStyle: "italic",
                  fontSize: 14, color: "var(--faded)", textAlign: "center", opacity: 0.85,
                }}>
                  Gdy pojawi się desant nr {nextCrate}, ta skrzynia znika na zawsze.
                  Żaden przedmiot nie wraca drugi raz.
                </p>
              </>
            )}
          </>
        )}

        {/* ── CTA ─────────────────────────────────────────────────── */}
        <div className="btn-row" style={{
          display: "flex", gap: 14, justifyContent: "center",
          flexWrap: "wrap", marginTop: 44,
        }}>
          <a href="/desant" className="av-btn av-btn-rust">
            ARCHIWUM DESANTÓW →
          </a>
          <a className="av-btn av-btn-ghost" href={allegroUrl} target="_blank" rel="noopener noreferrer">
            OBSERWUJ KONTO ALLEGRO →
          </a>
          <a className="av-btn av-btn-ghost" href="/#newsletter">
            ZAPISZ SIĘ BY NIE PRZEGAPIĆ →
          </a>
        </div>

      </div>
    </section>
  )
}

// ─── MysteryStrip ─────────────────────────────────────────────────────────────

function MysteryStrip({ crateNum }: { crateNum: number }) {
  return (
    <div style={{
      display: "inline-flex", alignItems: "center", gap: 10, marginTop: 20,
      padding: "9px 18px",
      border: "1.5px dashed rgba(139,58,42,0.35)",
      background: "rgba(139,58,42,0.04)",
    }}>
      <span style={{ fontFamily: "var(--f-stamp)", fontSize: 18, color: "rgba(139,58,42,0.45)", lineHeight: 1 }}>?</span>
      <span style={{ fontFamily: "var(--f-stamp)", fontSize: 11, letterSpacing: "0.22em", color: "rgba(139,58,42,0.6)" }}>
        ZAWARTOŚĆ SKRZYNI NR {crateNum} — NIEZNANA
      </span>
      <span style={{ fontFamily: "var(--f-stamp)", fontSize: 18, color: "rgba(139,58,42,0.45)", lineHeight: 1 }}>?</span>
    </div>
  )
}
