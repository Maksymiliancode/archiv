import Image from "next/image"
import { config } from "@/config/archiv"

export function Hero() {
  return (
    <header
      className="av-section av-section-dark av-grain av-grain-dark"
      style={{ paddingTop: 0, minHeight: "92vh", display: "flex", flexDirection: "column" }}
    >
      <div
        className="av-wrap"
        style={{
          flex: 1,
          display: "flex",
          alignItems: "center",
          position: "relative",
          zIndex: 2,
          paddingTop: 60,
          paddingBottom: 60,
        }}
      >
        <div
          style={{
            width: "100%",
            display: "grid",
            gridTemplateColumns: "minmax(0,1fr) auto",
            gap: 40,
            alignItems: "center",
          }}
        >
          {/* Lewa kolumna — tekst */}
          <div className="av-fade">
            <div className="av-eyebrow">SKRZYNIA NR 01 — OTWARTA PO 29 LATACH</div>
            <h1
              className="av-sechead"
              style={{ fontSize: "clamp(56px,9vw,128px)", lineHeight: 0.9 }}
            >
              NOWY
              <br />
              ROZDZIAŁ.
            </h1>
            <div
              className="av-sechead"
              style={{
                fontSize: "clamp(56px,9vw,128px)",
                color: "var(--rust)",
                lineHeight: 0.9,
                marginTop: 4,
              }}
            >
              ARCHIV.
            </div>
            <p
              style={{
                fontFamily: "var(--f-quote)",
                fontStyle: "italic",
                fontSize: "clamp(19px,2vw,24px)",
                lineHeight: 1.55,
                color: "var(--gold)",
                maxWidth: 560,
                margin: "34px 0 40px",
              }}
            >
              Prawie trzydzieści lat kolekcjonowania. Teraz po raz pierwszy dostępne —
              dla każdego, kto wie, czego szuka, i dla tych, którzy dopiero zaczynają.
            </p>
            <div style={{ display: "flex", gap: 18, flexWrap: "wrap" }}>
              <a className="av-btn av-btn-rust" href="#desant">
                DESANT NR 01 · 1 WRZEŚNIA 2026
              </a>
              <a
                className="av-btn av-btn-ghost"
                href={config.allegroProfileUrl}
                target="_blank"
                rel="noopener noreferrer"
              >
                AKTUALNE AUKCJE NA ALLEGRO →
              </a>
            </div>
          </div>

          {/* Prawa kolumna — oznaczenia skrzyni */}
          <div
            className="av-crate"
            style={{
              padding: "34px 30px",
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              gap: 20,
              width: 280,
            }}
          >
            <div className="av-thisway">↑↑&nbsp;&nbsp;GÓRA&nbsp;&nbsp;↑↑</div>
            <Image
              src="/stamp-us-army.png"
              alt="Stempel — U.S. Army Military Surplus"
              width={190}
              height={190}
              style={{ transform: "rotate(-4deg)", opacity: 0.94 }}
            />
            <div
              style={{
                fontFamily: "var(--f-stamp)",
                fontSize: 14,
                letterSpacing: "0.14em",
                color: "var(--gold)",
                textAlign: "center",
              }}
            >
              MILITARY · US ARMY
            </div>
            <hr className="av-rule" style={{ width: 130, margin: "2px 0", opacity: 0.45 }} />
            <div style={{ textAlign: "center", fontFamily: "var(--f-mono)" }}>
              <div
                style={{ fontSize: 12, letterSpacing: "0.3em", color: "var(--gold)", marginBottom: 8 }}
              >
                ŁADUNEK
              </div>
              <div
                style={{ fontSize: 11, letterSpacing: "0.24em", color: "var(--faded)", lineHeight: 1.9 }}
              >
                MILITARIA · NOŻE
              </div>
              <div
                style={{ fontSize: 11, letterSpacing: "0.24em", color: "var(--faded)", lineHeight: 1.9 }}
              >
                DEMOBIL · SURVIVAL
              </div>
            </div>
            <hr className="av-rule" style={{ width: 130, margin: "2px 0", opacity: 0.45 }} />
            <div
              style={{
                fontFamily: "var(--f-stamp)",
                fontSize: 13,
                letterSpacing: "0.22em",
                color: "var(--rust)",
                textAlign: "center",
              }}
            >
              SKRZ. 1/30
            </div>
          </div>
        </div>
      </div>

      {/* Scroll indicator */}
      <div
        style={{
          textAlign: "center",
          paddingBottom: 32,
          fontFamily: "var(--f-mono)",
          fontSize: 11,
          letterSpacing: "0.3em",
          color: "var(--faded)",
          position: "relative",
          zIndex: 2,
        }}
      >
        ↓
      </div>
    </header>
  )
}
