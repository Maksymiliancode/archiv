"use client"

import { useState, useTransition } from "react"
import { submitMeldunek } from "@/app/actions/meldunek"

type TypMeldunku = "SZUKAM" | "SPRZEDAJĘ" | "HURT"

const OPISY: Record<TypMeldunku, string> = {
  SZUKAM: "Opisz czego szukasz — epoka, typ, stan, kraj pochodzenia",
  SPRZEDAJĘ: "Opisz co masz — epoka, typ, stan, historia przedmiotu",
  HURT: "Opisz zapotrzebowanie — rodzaj sprzętu, ilości, termin",
}

const ILOSCI: Record<TypMeldunku, string> = {
  SZUKAM: "Ile sztuk?",
  SPRZEDAJĘ: "Ile sztuk masz?",
  HURT: "Szacowana ilość?",
}

export function Meldunek() {
  const [sent, setSent] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [typ, setTyp] = useState<TypMeldunku>("SZUKAM")
  const [isPending, startTransition] = useTransition()

  return (
    <section id="meldunek" className="av-section av-section-paper av-grain">
      <div
        className="av-wrap av-fade"
        style={{ position: "relative", zIndex: 2, maxWidth: 920 }}
      >
        <div className="av-eyebrow">DRUK MLD-01 · WYPEŁNIĆ CZYTELNIE</div>
        <h2 className="av-sechead">MELDUNEK</h2>
        <p
          style={{
            fontFamily: "var(--f-quote)",
            fontStyle: "italic",
            fontSize: 22,
            lineHeight: 1.55,
            color: "#4a4332",
            maxWidth: 600,
            margin: "18px 0 46px",
          }}
        >
          Szukasz czegoś konkretnego? Interesuje cię niedostępny już przedmiot — opisz go, a sprawdzimy w magazynie.
          Chcesz sprzedać przedmiot z kolekcji? Napisz — odpiszemy każdemu.
        </p>

        {sent ? (
          <div
            className="av-crate"
            style={{ padding: "60px 40px", textAlign: "center" }}
          >
            <div className="av-stamp" style={{ fontSize: 22, transform: "rotate(-4deg)" }}>
              MELDUNEK PRZYJĘTO
            </div>
            <p
              style={{
                fontFamily: "var(--f-body)",
                fontSize: 18,
                color: "#4a4332",
                marginTop: 22,
              }}
            >
              Odpiszemy najszybciej jak się da. Dziękujemy.
            </p>
          </div>
        ) : (
          <form
            className="av-form"
            onSubmit={(e) => {
              e.preventDefault()
              const formData = new FormData(e.currentTarget)
              formData.set("typ", typ)
              setError(null)
              startTransition(async () => {
                const result = await submitMeldunek(formData)
                if (result.success) {
                  setSent(true)
                } else {
                  setError(result.error ?? "Coś poszło nie tak.")
                }
              })
            }}
          >
            {/* Rodzaj meldunku */}
            <div className="av-field av-field-full">
              <span className="av-label">Rodzaj zgłoszenia</span>
              <div className="av-radio">
                {(["SZUKAM", "SPRZEDAJĘ", "HURT"] as TypMeldunku[]).map((opt) => (
                  <label key={opt} className={typ === opt ? "is-checked" : ""}>
                    <input
                      type="radio"
                      name="typ"
                      checked={typ === opt}
                      onChange={() => setTyp(opt)}
                    />
                    {opt}
                  </label>
                ))}
              </div>
            </div>

            {/* Opis */}
            <div className="av-field av-field-full">
              <span className="av-label">Opis</span>
              <textarea className="av-textarea" name="opis" placeholder={OPISY[typ]} />
            </div>

            {/* Ilość */}
            <div className="av-field">
              <span className="av-label">{ILOSCI[typ]}</span>
              <input className="av-input" type="number" name="ilosc" min={1} defaultValue={1} />
            </div>

            {/* Imię */}
            <div className="av-field">
              <span className="av-label">Imię</span>
              <input
                className="av-input"
                type="text"
                name="imie"
                required
                placeholder="Jak się zwracać"
              />
            </div>

            {/* Email */}
            <div className="av-field">
              <span className="av-label">E-mail</span>
              <input
                className="av-input"
                type="email"
                name="email"
                required
                placeholder="adres@poczta.pl"
              />
            </div>

            {/* Telefon */}
            <div className="av-field">
              <span className="av-label">Telefon (opcjonalnie)</span>
              <input className="av-input" type="tel" name="telefon" placeholder="+48 ___ ___ ___" />
            </div>

            {/* Newsletter */}
            <div className="av-field av-field-full">
              <label className="av-check">
                <input type="checkbox" name="newsletter" defaultChecked />
                Tak — chcę wiedzieć o desantach 48h przed wszystkimi
              </label>
            </div>

            {/* Błąd */}
            {error && (
              <div
                className="av-field-full"
                style={{
                  fontFamily: "var(--f-mono)",
                  fontSize: 13,
                  letterSpacing: "0.14em",
                  color: "var(--rust)",
                  padding: "10px 0",
                }}
              >
                {error}
              </div>
            )}

            {/* Submit */}
            <div className="av-field av-field-full">
              <button
                className="av-btn av-btn-rust"
                type="submit"
                disabled={isPending}
                style={{ opacity: isPending ? 0.7 : 1 }}
              >
                {isPending ? "WYSYŁANIE…" : "WYŚLIJ MELDUNEK"}
              </button>
            </div>
          </form>
        )}
      </div>
    </section>
  )
}
