"use client"

import { useState, useEffect } from "react"

function calcTime(targetDate: string) {
  const diff = Math.max(0, new Date(targetDate).getTime() - Date.now())
  const s = Math.floor(diff / 1000)
  return {
    d: Math.floor(s / 86400),
    h: Math.floor((s % 86400) / 3600),
    m: Math.floor((s % 3600) / 60),
    s: s % 60,
  }
}

interface CountdownProps {
  targetDate: string   // ISO string
  size?:      "large" | "small"
  label?:     string   // opcjonalny napis nad licznikiem
}

export function Countdown({ targetDate, size = "large", label }: CountdownProps) {
  const [t, setT] = useState<ReturnType<typeof calcTime> | null>(null)

  useEffect(() => {
    setT(calcTime(targetDate))
    const id = setInterval(() => setT(calcTime(targetDate)), 1000)
    return () => clearInterval(id)
  }, [targetDate])

  const pad = (n: number) => String(n).padStart(2, "0")
  const blocks: [string, string][] = t
    ? [[String(t.d), "DNI"], [pad(t.h), "GODZ"], [pad(t.m), "MIN"], [pad(t.s), "SEK"]]
    : [["--", "DNI"],        ["--", "GODZ"],      ["--", "MIN"],     ["--", "SEK"]]

  if (size === "small") {
    return (
      <div style={{ textAlign: "center" }}>
        {label && (
          <div style={{
            fontFamily: "var(--f-stamp)", fontSize: 10,
            letterSpacing: "0.34em", color: "var(--faded)", marginBottom: 10,
          }}>
            {label}
          </div>
        )}
        <div style={{ display: "flex", gap: 8, justifyContent: "center" }}>
          {blocks.map(([n, l]) => (
            <div key={l} style={{
              textAlign: "center", padding: "10px 14px 8px",
              background: "rgba(28,26,20,0.04)", border: "1px solid rgba(139,58,42,0.2)",
              minWidth: 58,
            }}>
              <div style={{ fontFamily: "var(--f-stamp)", fontSize: 22, color: "rgba(139,58,42,0.6)", lineHeight: 1 }}>{n}</div>
              <div style={{ fontFamily: "var(--f-stamp)", fontSize: 9, letterSpacing: "0.28em", color: "rgba(138,127,107,0.6)", marginTop: 5 }}>{l}</div>
            </div>
          ))}
        </div>
      </div>
    )
  }

  return (
    <div style={{ textAlign: "center" }}>
      {label && (
        <div style={{
          fontFamily: "var(--f-stamp)", fontSize: 11,
          letterSpacing: "0.34em", color: "var(--faded)", marginBottom: 18,
        }}>
          {label}
        </div>
      )}
      <div className="av-count" style={{ maxWidth: 760, margin: "0 auto" }}>
        {blocks.map(([n, l]) => (
          <div className="av-count-block av-crate" key={l}>
            <div className="av-count-num">{n}</div>
            <div className="av-count-lab">{l}</div>
          </div>
        ))}
      </div>
    </div>
  )
}
