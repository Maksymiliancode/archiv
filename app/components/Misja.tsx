export function Misja() {
  return (
    <section
      className="av-section av-section-dark av-grain av-grain-dark"
      style={{
        paddingTop: 36,
        paddingBottom: 40,
        borderTop: "1px solid rgba(212,175,55,0.08)",
        borderBottom: "1px solid rgba(212,175,55,0.08)",
      }}
    >
      <div
        className="av-wrap"
        style={{
          position: "relative",
          zIndex: 2,
          display: "flex",
          alignItems: "baseline",
          gap: 40,
          maxWidth: 860,
        }}
      >
        <div
          style={{
            fontFamily: "var(--f-mono)",
            fontSize: 10,
            letterSpacing: "0.38em",
            color: "var(--rust)",
            whiteSpace: "nowrap",
            flexShrink: 0,
            paddingTop: 3,
          }}
        >
          IDEA<br />PRZEWODNIA
        </div>
        <div
          style={{
            width: 1,
            alignSelf: "stretch",
            background: "rgba(212,175,55,0.2)",
            flexShrink: 0,
            minHeight: 48,
          }}
        />
        <p
          style={{
            fontFamily: "var(--f-quote)",
            fontStyle: "italic",
            fontSize: "clamp(16px,1.55vw,19px)",
            color: "var(--gold)",
            lineHeight: 1.7,
            margin: 0,
          }}
        >
          Na każdym targu wojskowym jest jedno stoisko, przy którym zatrzymujesz się najdłużej.{" "}
          <span style={{ fontStyle: "normal", color: "var(--cream)" }}>
            Archiv to to stoisko — przeniesione online, otwarte dla każdego, bez kurzu i kolejki.
          </span>{" "}
          Co miesiąc nowa skrzynia z kolekcji: unikaty zbierane przez trzydzieści lat,
          które jak na każdym dobrym targu — znikają pierwsze.
        </p>
      </div>
    </section>
  )
}
