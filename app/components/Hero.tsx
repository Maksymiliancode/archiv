import Image from "next/image"
import { config } from "@/config/archiv"

// DD.MM.YYYY bez new Date() — string operations tylko
function formatDate(crateNum: number): string | null {
  if (crateNum <= 0) return null
  const [datePart] = config.firstDesant.date.split('T')
  const [y, m, d] = datePart.split('-').map(Number)
  if (crateNum === 1) return `${d}.${String(m).padStart(2, '0')}.${y}`
  const monthOffset = m - 1 + (crateNum - 1)
  const mo = monthOffset % 12
  const yr = y + Math.floor(monthOffset / 12)
  return `7.${String(mo + 1).padStart(2, '0')}.${yr}`
}

export function Hero({ currentCrate }: { currentCrate: number | null }) {
  // Pokazujemy NASTĘPNY desant — crate 0 to demo, więc next = 1
  const nextCrate = currentCrate !== null && currentCrate > 0 ? currentCrate + 1 : 1
  const nextStr   = `${nextCrate}/30`
  const nextDate  = formatDate(nextCrate)

  return (
    <header
      className="av-section av-section-dark av-grain av-grain-dark"
      style={{ paddingTop: 0, minHeight: "92vh", display: "flex", flexDirection: "column" }}
    >
      <div
        className="av-wrap"
        style={{ flex: 1, display: "flex", alignItems: "center", position: "relative", zIndex: 2, paddingTop: 60, paddingBottom: 60 }}
      >
        <div className="hero-grid" style={{ width: "100%", display: "grid", gridTemplateColumns: "minmax(0,1fr) auto", gap: 40, alignItems: "center" }}>

          {/* Lewa kolumna */}
          <div className="av-fade">
            <div className="av-eyebrow">SKRZYNIA NR {String(nextCrate).padStart(2, "0")} — OTWARTA PO 30 LATACH</div>
            <h1 className="av-sechead" style={{ fontSize: "clamp(56px,9vw,128px)", lineHeight: 0.9 }}>
              NOWY<br />ROZDZIAŁ.
            </h1>
            <div className="av-sechead" style={{ fontSize: "clamp(56px,9vw,128px)", color: "var(--rust)", lineHeight: 0.9, marginTop: 4 }}>
              ARCHIV.
            </div>
            <p style={{ fontFamily: "var(--f-quote)", fontStyle: "italic", fontSize: "clamp(19px,2vw,24px)", lineHeight: 1.55, color: "var(--gold)", maxWidth: 560, margin: "34px 0 40px" }}>
              Trzydzieści lat kolekcjonowania. Teraz po raz pierwszy dostępne —
              dla każdego, kto wie, czego szuka, i dla tych, którzy dopiero zaczynają.
            </p>
            <div className="btn-row" style={{ display: "flex", gap: 18, flexWrap: "wrap" }}>
              <a className="av-btn av-btn-rust" href="#desant">
                DESANT NR {String(nextCrate).padStart(2, "0")} · {nextDate ?? "1 WRZEŚNIA 2026"}
              </a>
              <a className="av-btn av-btn-ghost" href={config.allegroProfileUrl} target="_blank" rel="noopener noreferrer">
                AKTUALNE AUKCJE NA ALLEGRO →
              </a>
            </div>

            <div style={{ marginTop: 36, paddingTop: 28, borderTop: "1px solid rgba(212,175,55,0.12)", maxWidth: 560 }}>
              <div style={{ fontFamily: "var(--f-mono)", fontSize: 10, letterSpacing: "0.38em", color: "var(--rust)", marginBottom: 14 }}>
                IDEA
              </div>
              <p style={{ fontFamily: "var(--f-body)", fontSize: 15, lineHeight: 1.8, color: "var(--faded)", margin: 0 }}>
                Na każdym targu wojskowym jest jedno stoisko, przy którym zatrzymujesz się najdłużej.
                ARCHIV to to stoisko — przeniesione online, otwarte dla każdego, bez kurzu i kolejki.
                Co miesiąc nowa skrzynia z kolekcji: unikaty zbierane przez trzydzieści lat,
                które jak na każdym dobrym targu — znikają pierwsze.
              </p>
            </div>
          </div>

          {/* Prawa kolumna — skrzynia (ukryta na mobile) */}
          <div className="av-crate hero-crate" style={{ padding: "34px 30px", display: "flex", flexDirection: "column", alignItems: "center", gap: 16, width: 280 }}>
            <div className="av-thisway">↑↑&nbsp;&nbsp;GÓRA&nbsp;&nbsp;↑↑</div>
            <Image
              src="/stamp-us-army.png"
              alt="Stempel — U.S. Army Military Surplus"
              width={190}
              height={190}
              loading="eager"
              style={{ transform: "rotate(-4deg)", opacity: 0.94 }}
            />
            <div style={{ fontFamily: "var(--f-stamp)", fontSize: 14, letterSpacing: "0.14em", color: "var(--gold)", textAlign: "center" }}>
              MILITARY · US ARMY
            </div>
            <hr className="av-rule" style={{ width: 130, margin: "2px 0", opacity: 0.45 }} />
            <div style={{ textAlign: "center", fontFamily: "var(--f-mono)" }}>
              <div style={{ fontSize: 12, letterSpacing: "0.3em", color: "var(--gold)", marginBottom: 8 }}>ŁADUNEK</div>
              <div style={{ fontSize: 11, letterSpacing: "0.24em", color: "var(--faded)", lineHeight: 1.9 }}>MILITARIA · NOŻE</div>
              <div style={{ fontSize: 11, letterSpacing: "0.24em", color: "var(--faded)", lineHeight: 1.9 }}>DEMOBIL · SURVIVAL</div>
            </div>
            <hr className="av-rule" style={{ width: 130, margin: "2px 0", opacity: 0.45 }} />
            <div style={{ textAlign: "center" }}>
              <div style={{ fontFamily: "var(--f-stamp)", fontSize: 13, letterSpacing: "0.22em", color: "var(--rust)" }}>
                SKRZ. {nextStr}
              </div>
              {nextDate && (
                <div style={{ fontFamily: "var(--f-mono)", fontSize: 10, letterSpacing: "0.2em", color: "var(--faded)", marginTop: 6 }}>
                  {nextDate}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      <div style={{ textAlign: "center", paddingBottom: 32, fontFamily: "var(--f-mono)", fontSize: 11, letterSpacing: "0.3em", color: "var(--faded)", position: "relative", zIndex: 2 }}>
        ↓
      </div>
    </header>
  )
}
