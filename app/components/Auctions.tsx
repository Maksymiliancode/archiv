import { getActiveOffers, type AllegroOffer } from '@/lib/allegro'
import { AuctionsPager } from './AuctionsPager'

const FALLBACK_LOTS: AllegroOffer[] = [
  { id: "f1", title: "Bagnet wz. 28 z pochwą, skóra",       price: "—", timeText: "wkrótce na allegro", urgent: false, imageUrl: null, offerUrl: "", format: null },
  { id: "f2", title: "Manierka aluminiowa w suknie, PRL",    price: "—", timeText: "wkrótce na allegro", urgent: false, imageUrl: null, offerUrl: "", format: null },
  { id: "f3", title: "Kompas Bezard, mosiądz, lata 60.",     price: "—", timeText: "wkrótce na allegro", urgent: false, imageUrl: null, offerUrl: "", format: null },
  { id: "f4", title: "Plecak desantowy, brezent, demobil",   price: "—", timeText: "wkrótce na allegro", urgent: false, imageUrl: null, offerUrl: "", format: null },
]

interface AuctionsProps {
  allegroUrl: string
}

export async function Auctions({ allegroUrl }: AuctionsProps) {
  const { offers, totalCount } = await getActiveOffers()
  const lots = offers.length > 0 ? offers : FALLBACK_LOTS
  const count = offers.length > 0 ? totalCount : 0

  return (
    <section id="aukcje" className="av-section av-section-dark av-grain av-grain-dark">
      <div className="av-wrap av-fade" style={{ position: "relative", zIndex: 2 }} suppressHydrationWarning>
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "flex-end",
            flexWrap: "wrap",
            gap: 16,
            marginBottom: 12,
          }}
        >
          <div>
            <div className="av-eyebrow" style={{ color: "var(--gold)" }}>
              MANIFEST ŁADUNKU · SYGN. AS–2026
            </div>
            <h2 className="av-sechead">TERAZ NA ALLEGRO</h2>
          </div>
          <div className="av-stencil">
            {lots.length > 0 ? `POZ. 1–${lots.length}` : "POZ. —"}
          </div>
        </div>

        <hr className="av-rule" style={{ margin: "20px 0 44px" }} />

        <AuctionsPager offers={lots} totalCount={count} allegroUrl={allegroUrl} />

        <div className="av-banner" style={{ marginTop: 48 }}>
          <div style={{ fontFamily: "var(--f-quote)", fontStyle: "italic", fontSize: 24 }}>
            Nie widzisz tu tego, czego szukasz?
          </div>
          <a className="av-btn av-btn-ink" href="#meldunek">
            ZŁÓŻ MELDUNEK →
          </a>
        </div>

        <div style={{ textAlign: "center", marginTop: 32 }}>
          <a
            className="av-btn av-btn-ghost"
            href={allegroUrl}
            target="_blank"
            rel="noopener noreferrer"
          >
            WSZYSTKIE AUKCJE NA ALLEGRO →
          </a>
        </div>
      </div>
    </section>
  )
}
