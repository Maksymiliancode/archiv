import { config } from "@/config/archiv"

export function Footer() {
  return (
    <footer className="av-footer av-grain av-grain-dark">
      <div className="av-wrap" style={{ position: "relative", zIndex: 2 }}>

        <div
          className="footer-grid"
          style={{
            display: "grid",
            gridTemplateColumns: "1fr 1fr 1fr",
            gap: "0 48px",
            alignItems: "start",
          }}
        >
          {/* ── BRAND ── */}
          <div>
            <div className="av-nav-logo" style={{ marginBottom: 20, paddingTop: 6 }}>
              <b style={{ fontSize: 22 }}>ARCHIV</b>
              <span>BIELSKO-BIAŁA — OD 1997</span>
            </div>
            <p
              style={{
                fontFamily: "var(--f-body)",
                fontSize: 15,
                color: "var(--faded)",
                lineHeight: 1.65,
                maxWidth: 280,
                margin: 0,
              }}
            >
              Militaria, demobil, noże wojskowe i sprzęt survivalowy. Army Shop Bielsko-Biała — skup i sprzedaż od 1997.
            </p>
          </div>

          {/* ── STRONA ── */}
          <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
            <span
              style={{
                fontFamily: "var(--f-mono)",
                fontSize: 10,
                letterSpacing: "0.28em",
                color: "var(--faded)",
                marginBottom: 4,
              }}
            >
              STRONA
            </span>
            <a href="/#desant">DESANT</a>
            <a href="/#aukcje">AUKCJE</a>
            <a href="/#meldunek">KONTAKT</a>
            <a href="/#newsletter">SYGNAŁ</a>
            <a href="/o-nas">O NAS</a>
          </div>

          {/* ── ZEWNĘTRZNE ── */}
          <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
            <span
              style={{
                fontFamily: "var(--f-mono)",
                fontSize: 10,
                letterSpacing: "0.28em",
                color: "var(--faded)",
                marginBottom: 4,
              }}
            >
              ZEWNĘTRZNE
            </span>
            <a href={config.allegroProfileUrl} target="_blank" rel="noopener noreferrer">ALLEGRO</a>
            <a href={`https://wa.me/${config.whatsappNumber}`} target="_blank" rel="noopener noreferrer">WHATSAPP</a>
            <a href={`mailto:${config.email}`}>E-MAIL</a>
            <a href="/privacy">POLITYKA PRYWATNOŚCI</a>
          </div>
        </div>

        <hr className="av-rule" style={{ margin: "48px 0 24px", opacity: 0.4 }} />

        <div
          style={{
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            fontFamily: "var(--f-mono)",
            fontSize: 11,
            letterSpacing: "0.2em",
            color: "var(--faded)",
          }}
        >
          <span>© {config.foundingYear}–2026 ARCHIV · ARMY SHOP BIELSKO-BIAŁA</span>
        </div>

      </div>
    </footer>
  )
}
