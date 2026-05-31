import { Suspense } from "react"
import { Hero } from "./components/Hero"
import { DesantSection } from "./components/DesantSection"
import { Auctions } from "./components/Auctions"
import { Meldunek } from "./components/Meldunek"
import { Opinie } from "./components/Opinie"
import { GrupaTaktyczna } from "./components/GrupaTaktyczna"
import { Misja } from "./components/Misja"
import { getActiveOffers } from "@/lib/allegro"
import { config } from "@/config/archiv"

export default async function Page() {
  const { offers } = await getActiveOffers()
  const desantOffers = offers.filter((o) => o.desantCrate !== undefined)
  const currentCrate = desantOffers.length > 0
    ? Math.max(...desantOffers.map((o) => o.desantCrate!))
    : null

  return (
    <main>
      <Hero currentCrate={currentCrate} />
      <Misja />
      <Suspense fallback={null}>
        <DesantSection allegroUrl={config.allegroProfileUrl} />
      </Suspense>
      <Suspense fallback={<AuctionsSkeleton />}>
        <Auctions allegroUrl={config.allegroProfileUrl} />
      </Suspense>
      <Meldunek />
      <Opinie />
      <Suspense fallback={null}>
        <GrupaTaktyczna />
      </Suspense>
    </main>
  )
}

function AuctionsSkeleton() {
  return (
    <section id="aukcje" className="av-section av-section-dark av-grain av-grain-dark">
      <div className="av-wrap" style={{ position: "relative", zIndex: 2 }}>
        <div className="av-eyebrow" style={{ color: "var(--gold)" }}>MANIFEST ŁADUNKU · SYGN. AS–2026</div>
        <h2 className="av-sechead">DODATKOWO NA ALLEGRO</h2>
        <hr className="av-rule" style={{ margin: "20px 0 44px" }} />
        <div className="av-cards">
          {[1, 2, 3, 4].map((i) => (
            <article className="av-card" key={i} style={{ opacity: 0.4 }}>
              <div className="av-photo av-photo-sepia av-card-photo"><span>ŁADOWANIE…</span></div>
              <div className="av-card-body">
                <div className="av-card-sig">LOT · · ·</div>
                <div className="av-card-title">—</div>
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>
  )
}
