"use client"

import { useActionState } from "react"
import { subscribeNewsletter } from "@/app/actions/newsletter"

const initialState = { success: false, error: undefined as string | undefined }

export function GrupaTaktyczna() {
  const [state, action, pending] = useActionState(subscribeNewsletter, initialState)

  return (
    <section id="newsletter" className="av-section av-section-dark av-grain av-grain-dark" style={{ padding: "80px 0" }}>
      <div className="av-wrap av-fade" style={{ position: "relative", zIndex: 2 }}>
        <div style={{ maxWidth: 680, margin: "0 auto", textAlign: "center" }}>

          <div className="av-eyebrow" style={{ color: "var(--gold)" }}>LISTA WTAJEMNICZONYCH</div>
          <h2 className="av-sechead" style={{ marginBottom: 20, lineHeight: 1 }}>
            GRUPA<br />TAKTYCZNA
          </h2>
          <p
            style={{
              fontFamily: "var(--f-quote)",
              fontStyle: "italic",
              fontSize: "clamp(17px,1.8vw,21px)",
              lineHeight: 1.6,
              color: "var(--gold)",
              margin: "0 0 36px",
            }}
          >
            Zapisz się i otrzymaj sygnał 48h przed każdym desantem —
            wcześniejszy dostęp do skrzyni, zanim zobaczy to reszta.
          </p>

          {state.success ? (
            <div
              className="av-crate"
              style={{
                padding: "32px 40px",
                border: "1px solid rgba(184,151,90,0.4)",
                display: "inline-block",
              }}
            >
              <div
                style={{
                  fontFamily: "var(--f-stamp)",
                  fontSize: 22,
                  letterSpacing: "0.06em",
                  color: "var(--gold)",
                  marginBottom: 10,
                }}
              >
                MELDUNEK PRZYJĘTY
              </div>
              <p
                style={{
                  fontFamily: "var(--f-body)",
                  fontSize: 16,
                  color: "var(--faded)",
                  margin: 0,
                }}
              >
                Czekaj na sygnał przed 1 września 2026.
              </p>
            </div>
          ) : (
            <form action={action} style={{ display: "flex", gap: 12, justifyContent: "center", flexWrap: "wrap" }}>
              <input
                type="email"
                name="email"
                required
                placeholder="twój@email.pl"
                style={{
                  fontFamily: "var(--f-mono)",
                  fontSize: 14,
                  letterSpacing: "0.1em",
                  background: "rgba(232,223,200,0.06)",
                  border: "1px solid rgba(184,151,90,0.35)",
                  color: "var(--light)",
                  padding: "16px 22px",
                  outline: "none",
                  width: "clamp(220px, 40vw, 340px)",
                }}
              />
              <button
                type="submit"
                disabled={pending}
                className="av-btn av-btn-rust"
                style={{ opacity: pending ? 0.6 : 1 }}
              >
                {pending ? "WYSYŁANIE…" : "DOŁĄCZ DO GRUPY →"}
              </button>
            </form>
          )}

          {state.error && !state.success && (
            <p
              style={{
                fontFamily: "var(--f-mono)",
                fontSize: 12,
                letterSpacing: "0.2em",
                color: "var(--rust)",
                marginTop: 14,
              }}
            >
              {state.error}
            </p>
          )}

        </div>
      </div>
    </section>
  )
}
