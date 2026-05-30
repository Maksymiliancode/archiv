import { getActiveOffers, getEndedDesantOffers, type AllegroOffer } from "@/lib/allegro"
import { config } from "@/config/archiv"
import { DesantArchive } from "@/app/components/DesantArchive"

export const metadata = {
  title: "Archiwum Desantów — ARCHIV",
}

export default async function DesantPage() {
  const [{ offers: active }, { offers: ended }] = await Promise.all([
    getActiveOffers(),
    getEndedDesantOffers(),
  ])

  const desantActive = active.filter((o) => o.desantCrate !== undefined)
  const allDesant: AllegroOffer[] = [...desantActive, ...ended]
  const crates = [...new Set(allDesant.map((o) => o.desantCrate as number))].sort((a, b) => a - b)

  return (
    <main>
      <section className="av-section av-section-dark av-grain av-grain-dark">
        <div className="av-wrap" style={{ position: "relative", zIndex: 2 }}>
          <div style={{ marginBottom: 16 }}>
            <div className="av-eyebrow" style={{ color: "var(--gold)" }}>
              ARCHIV
            </div>
            <h1 className="av-sechead">ARCHIWUM DESANTÓW</h1>
          </div>

          <hr className="av-rule" style={{ margin: "20px 0 44px" }} />

          {allDesant.length === 0 ? (
            <p style={{ fontFamily: "var(--f-quote)", fontStyle: "italic", fontSize: 22, color: "var(--faded)", textAlign: "center", padding: "60px 0" }}>
              Pierwszy desant startuje 1 września 2026.
            </p>
          ) : (
            <DesantArchive offers={allDesant} crates={crates} allegroUrl={config.allegroProfileUrl} />
          )}
        </div>
      </section>
    </main>
  )
}
