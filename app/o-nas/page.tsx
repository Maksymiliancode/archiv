import Image from "next/image"
import { GrupaTaktyczna } from "../components/GrupaTaktyczna"
import { config } from "@/config/archiv"

export const metadata = {
  title: "O nas",
  description:
    "Prawie trzydzieści lat na targach Europy i Stanów. Historia Arka — kolekcjonera, który przenosi wiedzę i pasję do świata online. To jest ARCHIV.",
  openGraph: {
    title: "O nas — ARCHIV",
    description:
      "Prawie trzydzieści lat na targach Europy i Stanów. Historia Arka — kolekcjonera, który przenosi wiedzę i pasję do świata online. To jest ARCHIV.",
  },
}

export default function ONasPage() {
  return (
    <main>
      <AboutIntro />
      <History />
      <Idea />
      <HowItWorks />
      <Acknowledgments />
      <GrupaTaktyczna />
      <AboutCTA />
    </main>
  )
}

/* ── INTRO ───────────────────────────────────────────────────────── */
function AboutIntro() {
  return (
    <header
      className="av-section av-section-dark av-grain av-grain-dark"
      style={{ paddingTop: 70, paddingBottom: 80 }}
    >
      <div
        className="av-wrap av-fade about-intro-grid"
        style={{
          position: "relative",
          zIndex: 2,
          display: "grid",
          gridTemplateColumns: "minmax(0,1.2fr) minmax(0,0.8fr)",
          gap: 56,
          alignItems: "center",
        }}
      >
        <div>
          <div className="av-eyebrow">AKTA · O NAS</div>
          <h1
            className="av-sechead"
            style={{ fontSize: "clamp(46px,7vw,92px)", lineHeight: 0.92 }}
          >
            PASJA.<br />WIEDZA.<br />
            <span style={{ color: "var(--rust)" }}>ARCHIV.</span>
          </h1>
          <p
            style={{
              fontFamily: "var(--f-quote)",
              fontStyle: "italic",
              fontSize: "clamp(18px,2vw,22px)",
              lineHeight: 1.6,
              color: "var(--gold)",
              maxWidth: 520,
              margin: "32px 0 0",
            }}
          >
            Arek od ponad trzydziestu lat jeździ po targach Europy i Stanów
            w poszukiwaniu rzeczy, których nigdzie indziej nie ma — Ciney,
            pchle targi pod Hamburgiem, Houten, Praga, sutereny i magazyny
            od Atlantyku po Pacyfik. ARCHIV to ta wiedza i pasja,
            dostępna dla każdego.
          </p>
        </div>

        <div
          className="av-crate"
          style={{
            padding: 24,
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            gap: 20,
          }}
        >
          <Image
            src="/army-shop-logo.png"
            alt="Army Shop — logo z bulldogiem"
            width={260}
            height={104}
            style={{ filter: "invert(1)", opacity: 0.78, objectFit: "contain", height: "auto" }}
          />
          <hr className="av-rule" style={{ width: "100%", opacity: 0.3 }} />
          <div
            style={{
              fontFamily: "var(--f-mono)",
              fontSize: 11,
              letterSpacing: "0.28em",
              color: "var(--faded)",
              textAlign: "center",
              lineHeight: 2,
            }}
          >
            BIELSKO-BIAŁA · CIESZYN<br />
            OD 1997 · MILITARIA · DEMOBIL<br />
            II WOJNA ŚWIATOWA
          </div>
          <div
            style={{
              fontFamily: "var(--f-stamp)",
              fontSize: 13,
              letterSpacing: "0.22em",
              color: "var(--rust)",
            }}
          >
            30 LAT NA RYNKU
          </div>
        </div>
      </div>
    </header>
  )
}

/* ── HISTORIA / TIMELINE ─────────────────────────────────────────── */
const TIMELINE = [
  {
    year: "1997",
    head: "FILIP · ZAPALNIK",
    body: "Gdy Arek trzymał w rękach nowo narodzonego Filipa — swojego pierworodnego syna — wiedział jedno: czas wziąć się za swoje. Sklep ruszył jeszcze tego samego roku. Szybko okazało się, że klienci potrafią wyczuć różnicę: ten, kto stoi za ladą, zbiera militaria odkąd pamięta. Wiedział, dlaczego kurtka lotnicza z 1968 roku jest warta trzy razy więcej od nowej repliki — i nie musiał tego tłumaczyć.",
  },
  {
    year: "1997–2026",
    head: "EUROPA · STANY · TEREN",
    body: "Ciney w Belgii o poranku — kilka hal, tysiące stoisk, Arek jak w domu. Pchle targi pod Berlinem o szóstej rano, kiedy większość sprzedawców jeszcze śpi — właśnie wtedy trafiają się rzeczy, których nie ma na żadnym zdjęciu w internecie. Houten, Praga, zloty jak Operacja Południe i D-Day Hel. Kontenery ze Stanów: Wietnam, Korea, druga wojna, Iran. Setki kilometrów busem w każdą stronę, przerzucane kartony na parkingach o świcie, transakcje udane i takie mniej. Nauczony odróżniać oryginał od kopii — to lekcja, której nie ma w żadnym podręczniku. Na oddzielanie biznesu od rodziny nie było za wiele czasu — ale były plusy: Haribo z Niemiec, gadżety których w Polsce jeszcze nie było, i pierwszy porządny rower w domu oczywiście stamtąd — kupiony legalnie, za gotówkę, osobiście. Nie przez eBay i nie tak jak niektórzy Polacy wracają z Niemiec. Sklep rósł razem z ludźmi — Tadziu czyli Borsuk: twarz sklepu i nieodłączny element wyposażenia; Axel: chodzące kompendium wiedzy wojskowej i bezużytecznej, co do joty; Paweł: jedyny prawdziwy IT guy w ekipie, który ogarnął Allegro, bo starsi nie bardzo potrafili. Przez te trzy dekady Arek zbierał najlepsze egzemplarze i chował głębiej niż inne towary. Wiedział, że kiedyś przyjdzie na nie czas.",
  },
  {
    year: "2022",
    head: "UKRAINA · WOLONTARIAT",
    body: "Wybuch pełnoskalowej inwazji przyniósł zupełnie inny rodzaj wyzwania. Fundacje, organizacje i wolontariusze nagle szukali kogoś, kto wie jak kupić dobry sprzęt — nie podróbkę, nie towar przeszacowany przez trzech pośredników. Arek działał wtedy przede wszystkim charytatywnie: dzielił się wiedzą, pomagał organizować zaopatrzenie, był prawdziwym łącznikiem między chętnymi do pomocy a sprawdzonymi dostawcami jakościowego wyposażenia. Nieprzespane noce, nowe znajomości z całego kraju i Europy, zamówienia innej skali niż dotychczas. Trudny czas — ale też dowód na to, że trzydzieści lat w terenie to coś znacznie więcej niż pasja.",
  },
  {
    year: "2026",
    head: "MAKS · ARCHIV",
    body: "Drugi syn Maks pewnego dnia pokazał Arekowi, co można zrobić z tym wszystkim online. Efekt: ARCHIV. Nie wyprzedaż, nie likwidacja — zwieńczenie. Platforma, która daje każdemu kolekcjonerowi — nawet temu, który nie ma czasu jeździć po Europie — dostęp do dokładnie tych przedmiotów, które Arek latami odkładał dla siebie. Co miesiąc nowa skrzynia. Raz ląduje, raz znika. Jak na targu — tylko bez wstawania o szóstej rano pod Hamburgiem.",
  },
]

function History() {
  return (
    <section className="av-section av-section-paper av-grain">
      <div className="av-wrap av-fade" style={{ position: "relative", zIndex: 2 }}>
        <div className="av-eyebrow">PRZEBIEG SŁUŻBY</div>
        <h2 className="av-sechead" style={{ color: "var(--ink)", marginBottom: 52 }}>
          HISTORIA
        </h2>

        {/* Timeline */}
        <div
          className="about-timeline"
          style={{
            display: "flex",
            flexDirection: "column",
            gap: 0,
            borderLeft: "2px solid rgba(139,58,42,0.35)",
            paddingLeft: 44,
            marginBottom: 72,
          }}
        >
          {TIMELINE.map(({ year, head, body }, i) => (
            <div
              key={i}
              style={{ position: "relative", paddingBottom: i < TIMELINE.length - 1 ? 50 : 0 }}
            >
              <span
                className="about-timeline-dot"
                style={{
                  position: "absolute",
                  left: -53,
                  top: 8,
                  width: 14,
                  height: 14,
                  background: "var(--rust)",
                  borderRadius: "50%",
                  boxShadow: "0 0 0 4px var(--paper)",
                }}
              />
              <div
                style={{
                  fontFamily: "var(--f-stamp)",
                  fontSize: 34,
                  color: "var(--rust)",
                  letterSpacing: "0.04em",
                  lineHeight: 1,
                }}
              >
                {year}
              </div>
              <div
                style={{
                  fontFamily: "var(--f-mono)",
                  fontSize: 12,
                  letterSpacing: "0.28em",
                  color: "var(--faded)",
                  margin: "10px 0 14px",
                }}
              >
                {head}
              </div>
              <p
                style={{
                  fontFamily: "var(--f-body)",
                  fontSize: 18,
                  lineHeight: 1.65,
                  color: "#3a3327",
                  maxWidth: 660,
                  margin: 0,
                }}
              >
                {body}
              </p>
            </div>
          ))}
        </div>

      </div>
    </section>
  )
}

/* ── CZYM JEST ARCHIV ────────────────────────────────────────────── */
function Idea() {
  return (
    <section className="av-section av-section-dark av-grain av-grain-dark">
      <div className="av-wrap av-fade" style={{ position: "relative", zIndex: 2 }}>
        <div
          className="about-idea-grid"
          style={{
            display: "grid",
            gridTemplateColumns: "minmax(0,0.7fr) minmax(0,1.3fr)",
            gap: 64,
            alignItems: "center",
          }}
        >
          <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 18 }}>
            <Image
              src="/stamp-us-army.png"
              alt="Stempel — U.S. Army Military Surplus"
              width={190}
              height={190}
              style={{ transform: "rotate(-4deg)", opacity: 0.92 }}
            />
            <div
              style={{
                fontFamily: "var(--f-stamp)",
                fontSize: 13,
                letterSpacing: "0.16em",
                color: "var(--gold)",
                textAlign: "center",
              }}
            >
              MILITARY · US ARMY
            </div>
          </div>

          <div>
            <div className="av-eyebrow" style={{ color: "var(--gold)" }}>DEFINICJA</div>
            <h2 className="av-sechead" style={{ marginBottom: 28 }}>CZYM JEST ARCHIV</h2>
            <p
              style={{
                fontFamily: "var(--f-body)",
                fontSize: 19,
                lineHeight: 1.7,
                color: "var(--light)",
                maxWidth: 580,
                margin: "0 0 28px",
              }}
            >
              To nie kolejny sklep z militariami. To najlepsze stoisko
              z każdego targu — zebrane razem, dostępne dla każdego,
              raz w miesiącu. Przedmioty z historią, zebrane przez lata
              z całego świata. Ciche, unikalne, oryginalne.
            </p>
            <p
              style={{
                fontFamily: "var(--f-quote)",
                fontStyle: "italic",
                fontSize: 21,
                lineHeight: 1.52,
                color: "var(--gold)",
                maxWidth: 520,
                margin: 0,
              }}
            >
              „Przez trzydzieści lat wiedziałem, że te rzeczy zasługują
              na lepszy dom. Teraz go mają."
            </p>
          </div>
        </div>
      </div>
    </section>
  )
}

/* ── JAK TO DZIAŁA ───────────────────────────────────────────────── */
const HOW = [
  {
    nr: "01",
    head: "DESANT",
    body: "Każdego 7. dnia miesiąca nowa partia z kolekcji ląduje na Allegro. Skrzynki numerowane 1/30 — każda to osobna historia, każda dostępna raz i tylko raz. Jak na polu bitwy: kto pierwszy, ten lepszy. Przedmioty znikają szybko, nie wracają. Licytacje i kup teraz — bez drugiej szansy. Pierwszy desant — 1 września 2026.",
  },
  {
    nr: "02",
    head: "MELDUNEK",
    body: "Szukasz czegoś konkretnego? Chcesz sprzedać sprzęt militarny lub survival? Interesujesz się zakupem hurtowym? Mamy spore doświadczenie w zaopatrzeniu sklepów, placówek, a nawet jednostek wojskowych. Złóż meldunek — odpisujemy każdemu.",
  },
  {
    nr: "03",
    head: "PODSTAWY",
    body: "Dwie rzeczy, na których stoi ARCHIV. Pierwsza: wiedza — za każdym przedmiotem stoi ktoś, kto zna go z historii i z ręki, doradzi, opowie, sprawdzi autentyczność. Bo ARCHIV to lata w terenie, nie katalog z magazynu. Druga: stała oferta na Allegro — ci, którzy ją znają, wiedzą, że sama w sobie była już dość wyszukana i specyficzna. To nie przypadkowy asortyment.",
  },
]

function HowItWorks() {
  return (
    <section className="av-section av-section-paper av-grain">
      <div className="av-wrap av-fade" style={{ position: "relative", zIndex: 2 }}>
        <div className="av-eyebrow">ROZKAZ DZIENNY</div>
        <h2 className="av-sechead" style={{ color: "var(--ink)", marginBottom: 50 }}>CO SIĘ TU DZIEJE</h2>
        <div className="about-how-grid" style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 28 }}>
          {HOW.map(({ nr, head, body }) => (
            <div
              key={nr}
              className="av-crate"
              style={{
                padding: "34px 30px",
                background: "rgba(28,26,20,0.04)",
                border: "1px solid rgba(139,58,42,0.18)",
              }}
            >
              <div
                style={{
                  fontFamily: "var(--f-mono)",
                  fontSize: 12,
                  letterSpacing: "0.28em",
                  color: "var(--rust)",
                  marginBottom: 14,
                }}
              >
                NR {nr}
              </div>
              <h3
                style={{
                  fontFamily: "var(--f-stamp)",
                  fontWeight: 400,
                  fontSize: 30,
                  color: "var(--ink)",
                  margin: "0 0 16px",
                  letterSpacing: "0.04em",
                }}
              >
                {head}
              </h3>
              <p
                style={{
                  fontFamily: "var(--f-body)",
                  fontSize: 17,
                  lineHeight: 1.65,
                  color: "#3a3327",
                  margin: 0,
                }}
              >
                {body}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}

/* ── PODZIĘKOWANIA ───────────────────────────────────────────────── */
function Acknowledgments() {
  return (
    <section className="av-section av-section-dark av-grain av-grain-dark">
      <div className="av-wrap av-fade" style={{ position: "relative", zIndex: 2, textAlign: "center" }}>
        <div className="av-eyebrow" style={{ color: "var(--gold)" }}>PODZIĘKOWANIA</div>
        <p
          style={{
            fontFamily: "var(--f-quote)",
            fontStyle: "italic",
            fontSize: "clamp(17px,1.8vw,20px)",
            lineHeight: 1.9,
            color: "rgba(232,223,200,0.85)",
            margin: "32px auto 0",
            maxWidth: 660,
          }}
        >
          ARCHIV nie powstałby bez ludzi.<br /><br />
          Bez Moniki — która była na targach równie często co Arek
          i handlowała równie dobrze. Bez Filipa, który — sam o tym nie wiedząc —
          zapoczątkował całą tę historię. Bez Maksa, który zamienił pasję w platformę.<br /><br />
          Bez Wojtka — partnera w drodze. Bez pracowników, którzy przez lata trzymali fort.
          Bez kontrahentów z całej Europy i świata — za każdą transakcję i każdą wskazówkę.<br /><br />
          Przede wszystkim — bez klientów, którzy zaufali i wrócili.
          Bez Was ARCHIV nie ma sensu.
        </p>
      </div>
    </section>
  )
}

/* ── CTA ─────────────────────────────────────────────────────────── */
function AboutCTA() {
  return (
    <section
      className="av-section"
      style={{ background: "var(--rust)", color: "var(--light)", padding: "84px 0" }}
    >
      <div className="av-wrap av-fade" style={{ textAlign: "center", position: "relative", zIndex: 2 }}>
        <h2
          className="av-sechead"
          style={{ color: "var(--light)", marginBottom: 22, lineHeight: 1.06 }}
        >
          GOTÓW NA<br />PIERWSZY DESANT?
        </h2>
        <p
          style={{
            fontFamily: "var(--f-quote)",
            fontStyle: "italic",
            fontSize: 22,
            color: "rgba(232,223,200,0.85)",
            margin: "0 auto 36px",
            maxWidth: 480,
          }}
        >
          Magazyn jest już otwarty. Reszta to kwestia czasu.
        </p>
        <div style={{ display: "flex", gap: 18, justifyContent: "center", flexWrap: "wrap" }}>
          <a className="av-btn av-btn-ink" href="/#desant">
            DESANT NR 01 · 1.09.2026
          </a>
          <a
            className="av-btn"
            href={config.allegroProfileUrl}
            target="_blank"
            rel="noopener noreferrer"
            style={{
              background: "transparent",
              color: "var(--light)",
              boxShadow: "inset 0 0 0 1px rgba(232,223,200,0.55)",
            }}
          >
            AUKCJE NA ALLEGRO →
          </a>
        </div>
      </div>
    </section>
  )
}
