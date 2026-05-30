import { getActiveOffers, getEndedDesantOffers } from "@/lib/allegro"
import { Countdown } from "./Countdown"
import { DesantCarousel } from "./DesantCarousel"
import { config } from "@/config/archiv"

export async function DesantSection({ allegroUrl }: { allegroUrl: string }) {
  const [{ offers: active }, { offers: ended }] = await Promise.all([
    getActiveOffers(),
    getEndedDesantOffers(),
  ])
  const activeDesant = active.filter((o) => o.desantCrate !== undefined)
  const activeCrate  = activeDesant.length > 0
    ? Math.max(...activeDesant.map((o) => o.desantCrate!))
    : null
  const nextCrate    = activeCrate !== null && activeCrate > 0 ? activeCrate + 1 : 1

  // Aktywne + zakończone (SOLD) z tej samej skrzyni — sortuj: aktywne pierwsze
  const currentCrate  = activeCrate ?? 0
  const endedCurrent  = ended.filter((o) => o.desantCrate === currentCrate)
  const desantOffers  = [...activeDesant, ...endedCurrent]

  return (
    <section id="desant" className="av-section av-section-paper av-grain">
      <div className="av-wrap av-fade" style={{ textAlign: "center", position: "relative", zIndex: 2 }}>
        <div className="av-stamp" style={{ marginBottom: 30 }}>
          DESANT NR {nextCrate} / 30
        </div>

        <Countdown />

        {desantOffers.length > 0 && (
          <>
            <hr className="av-rule" style={{ margin: "0 auto 44px", maxWidth: 760 }} />
            <DesantCarousel offers={desantOffers} allegroUrl={allegroUrl} />
          </>
        )}

        <div style={{ display: "flex", gap: 14, justifyContent: "center", flexWrap: "wrap", marginTop: 44 }}>
          <a href="/desant" className="av-btn av-btn-rust">
            ARCHIWUM DESANTÓW →
          </a>
          <a
            className="av-btn av-btn-ghost"
            href={allegroUrl}
            target="_blank"
            rel="noopener noreferrer"
          >
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
