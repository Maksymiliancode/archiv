"use client"

import { useEffect, useRef } from "react"

const REVIEWS = [
  { author: "Kodi K.",    date: "2 lata temu",      text: "Od lat najlepiej zaopatrzone miejsce we wszystko co jest związane z militariami. Profesjonaliści którzy zjedli zęby na tym temacie. Jeżeli szukacie wojskowego szpeju, militariów lub po prostu odzieży dla aktywnych — wpadajcie." },
  { author: "P. N.",      date: "6 lat temu",        text: "Profesjonalny sklep. Ogromny asortyment. Duży wybór artykułów i odzieży harcerskiej. Jest przymierzalnia. Zawsze dobrze doradzą. Miła obsługa. Super, że mamy taki sklep w Bielsku-Białej." },
  { author: "Damian T.",  date: "6 lat temu",        text: "Najlepszy sprzęt z demobilu i nie tylko, prowadzony przez ludzi z pasją. Gdy czegoś nie mają, to zawsze postarają się załatwić. Potrafię iść choćby po to, by zapytać co słychać." },
  { author: "Rudolf K.",  date: "3 lata temu",       text: "Dobre produkty i fachowe doradztwo. Kurtka N2B wytrzymała 9 lat. Kupiłem kolejną. Szeroki asortyment ubrań i wyposażenia." },
  { author: "Jacek T.",   date: "8 lat temu",        text: "Super uprzejma obsługa, a do tego dobrze zaopatrzony sklep. To, na co w Warszawie czekałem od ponad tygodnia i się nie doczekałem, w tym miejscu kupiłem od ręki — i mogłem jeszcze wybierać w rozmiarach i modelach." },
  { author: "Mateusz M.", date: "8 miesięcy temu",   text: "Fantastyczna załoga, kupuję wiele sprzętu od wielu lat. Polecam — najlepszy sklep z tego typu sprzętem na Śląsku." },
  { author: "Darek P.",   date: "2 lata temu",       text: "Polecam, super obsługa. Ale również można się czegoś nowego dowiedzieć. Panowie mają czas dla każdego klienta, poświęcają go tyle ile trzeba, a i na jakąś dobrą radę można liczyć." },
  { author: "Daniel K.",  date: "5 lat temu",        text: "Super sklep z militariami. Naprawdę bardzo duży wybór. Jak się zakręcić to, jak nie mają, to postarają się ściągnąć specjalnie dla Ciebie." },
  { author: "Maria H.",   date: "2 lata temu",       text: "Super sklep, a Pan Tadeusz rewelacyjny doradca, świetny fachowiec w każdym calu! Polecam z czystym sumieniem." },
  { author: "Paul D.",    date: "4 lata temu",       text: "Niesamowite miejsce, odwiedziłem to będąc przejazdem i na pewno wrócę, bo wybór jest bardzo duży, a obsługa bardzo przyjazna i udzielająca dobrych rad. Takie miejsca lubię." },
  { author: "tadeosh",    date: "7 lat temu",        text: "Mnóstwo wyposażenia i ciuchów — wybór duży. A szef się na rzeczy zna i doradzi zawsze coś. Sam fakt, że ten sklep jest tu prawie od zawsze (minimum 15 lat) o czymś świadczy." },
  { author: "Adam S.",    date: "4 lata temu",       text: "Najlepszy sklep w południowej Polsce. Pan T. niezwykle kompetentny. Polecam!" },
  { author: "Kamykus",    date: "8 lat temu",        text: "Mój ulubiony sklep na terenie województwa śląskiego. Dużo towaru, spoko ceny, a i zniżki można wyłapać przy większych zakupach. Miła i pomocna obsługa." },
  { author: "Natalia",    date: "5 lat temu",        text: "Bardzo dobra obsługa. Przyszłam tylko po gaz pieprzowy, a Panowie którzy pracują wszystko profesjonalnie wytłumaczyli. Naprawdę świetne miejsce." },
  { author: "ToJa",       date: "6 lat temu",        text: "Profesjonalna obsługa i szeroka oferta przy umiarkowanych cenach. Sklep dla miłośników militariów oraz ludzi szukających przygody w przyrodzie." },
  { author: "Dawid J.",   date: "6 miesięcy temu",   text: "Bardzo profesjonalni i sympatyczni panowie z obsługi, a sklep? Zatrzęsienie rzeczy z demobilu amerykańskiego, brytyjskiego, holenderskiego, niemieckiego i innych." },
]

// lekki przechył każdej kartki — cykl żeby nie powtarzał się wzorzec
const TILTS = ["-1.1deg", "0.8deg", "0deg", "-0.7deg", "1.3deg", "0.4deg", "-0.5deg", "1deg"]

const SPEED   = 0.35          // px/frame ≈ 21 px/s przy 60 fps
const CARD_W  = 320           // szerokość karty
const GAP     = 28
const STEP    = CARD_W + GAP  // 348 px

export function Opinie() {
  const trackRef  = useRef<HTMLDivElement>(null)
  const offsetRef = useRef(0)
  const pausedRef = useRef(false)
  const rafRef    = useRef<number>(0)

  const doubled   = [...REVIEWS, ...REVIEWS]
  const halfWidth = REVIEWS.length * STEP   // punkt resetu

  useEffect(() => {
    const track = trackRef.current
    if (!track) return

    const tick = () => {
      if (!pausedRef.current) {
        offsetRef.current += SPEED
        if (offsetRef.current >= halfWidth) offsetRef.current -= halfWidth
        track.style.transform = `translateX(-${offsetRef.current}px)`
      }
      rafRef.current = requestAnimationFrame(tick)
    }

    rafRef.current = requestAnimationFrame(tick)
    return () => cancelAnimationFrame(rafRef.current)
  }, [halfWidth])

  const jump = (dir: 1 | -1) => {
    offsetRef.current = ((offsetRef.current + dir * STEP) % halfWidth + halfWidth) % halfWidth
    if (trackRef.current) {
      trackRef.current.style.transform = `translateX(-${offsetRef.current}px)`
    }
  }

  return (
    <section
      className="av-section av-section-dark av-grain av-grain-dark"
      style={{ paddingBottom: 90 }}
    >
      {/* nagłówek wewnątrz wrapa */}
      <div className="av-wrap av-fade" style={{ position: "relative", zIndex: 2, marginBottom: 48 }}>
        <div className="av-eyebrow" style={{ color: "var(--gold)" }}>ZAPISKI Z DZIENNIKA · GOOGLE MAPS ★★★★★</div>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-end", flexWrap: "wrap", gap: 16 }}>
          <h2 className="av-sechead">SPRAWDZENI W BOJU</h2>
          <div style={{ display: "flex", gap: 10, paddingBottom: 6 }}>
            <button
              className="av-btn av-btn-ghost"
              onClick={() => jump(-1)}
              aria-label="Poprzednia opinia"
              style={{ padding: "10px 20px", fontSize: 18, lineHeight: 1 }}
            >←</button>
            <button
              className="av-btn av-btn-ghost"
              onClick={() => jump(1)}
              aria-label="Następna opinia"
              style={{ padding: "10px 20px", fontSize: 18, lineHeight: 1 }}
            >→</button>
          </div>
        </div>
      </div>

      {/* track — wychodzi poza wrap żeby krawędziowo się ucinał */}
      <div style={{ overflow: "hidden", paddingBottom: 18 }}>
        <div
          ref={trackRef}
          style={{
            display: "flex",
            gap: GAP,
            width: "max-content",
            paddingLeft: 56,          // wyrównanie z av-wrap
            paddingBottom: 18,        // miejsce na cień kart
            willChange: "transform",
          }}
        >
          {doubled.map((r, i) => (
            <div
              key={i}
              className="av-review av-crate"
              style={{
                width: CARD_W,
                flexShrink: 0,
                transform: `rotate(${TILTS[i % TILTS.length]})`,
              }}
              onMouseEnter={() => { pausedRef.current = true }}
              onMouseLeave={() => { pausedRef.current = false }}
            >
              <div className="av-review-stars">★★★★★</div>
              <p className="av-review-q">„{r.text}"</p>
              <div className="av-review-by">{r.author} · {r.date} · Google Maps</div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
