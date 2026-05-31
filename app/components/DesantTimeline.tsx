import type { CSSProperties } from "react"
import { getDesantDate, getNextDesantDate, fmtDate, type DesantState } from "@/lib/desantState"

interface Props {
  state: DesantState
  activeCrate: number
}

export function DesantTimeline({ state, activeCrate }: Props) {
  const nextDate = getNextDesantDate()

  if (state === 0) {
    return (
      <Timeline>
        <Node type="ea"      label="EARLY ACCESS" sub="0/30"  date="TERAZ"                  status="AKTYWNY"  />
        <Line dashed />
        <Node type="mystery" label=""              sub=""      date={fmtDate(getDesantDate(1))} status="DESANT NR 1" />
      </Timeline>
    )
  }

  const showPrev   = activeCrate > 1
  const prevCrate  = activeCrate - 1
  const activeDate = getDesantDate(activeCrate)
  const prevDate   = showPrev ? getDesantDate(prevCrate) : null

  return (
    <Timeline>
      {showPrev && (
        <>
          <Node type="done" label={`${prevCrate}/30`} sub="SERIA" date={fmtDate(prevDate!)} status="ZAKOŃCZONY" />
          <Line />
        </>
      )}
      <Node type="active"  label={`${activeCrate}/30`} sub="SERIA" date={fmtDate(activeDate)} status="AKTYWNY" />
      <Line dashed />
      <Node type="mystery" label=""                    sub=""       date={fmtDate(nextDate)}   status="NIEZNANY" />
    </Timeline>
  )
}

// ─── sub-komponenty ────────────────────────────────────────────────────────────

function Timeline({ children }: { children: React.ReactNode }) {
  return (
    <div style={{
      display: "flex", alignItems: "flex-start",
      justifyContent: "center", marginBottom: 48,
    }}>
      {children}
    </div>
  )
}

function Line({ dashed }: { dashed?: boolean }) {
  return (
    <div style={{
      flex: 1, minWidth: 48, marginTop: 33,
      height: dashed ? 0 : 1.5,
      background: dashed ? "none" : "rgba(138,127,107,0.4)",
      borderTop: dashed ? "1.5px dashed rgba(139,58,42,0.25)" : "none",
    }} />
  )
}

type NodeType = "ea" | "done" | "active" | "mystery"

function Node({ type, label, sub, date, status }: {
  type:   NodeType
  label:  string
  sub:    string
  date:   string
  status: string
}) {
  const isMystery = type === "mystery"
  const isEa      = type === "ea"
  const isDone    = type === "done"
  const isActive  = type === "active"

  const SIZE = isMystery ? 78 : 68

  const circleStyle: CSSProperties = {
    width: SIZE, height: SIZE, borderRadius: "50%",
    display: "flex", flexDirection: "column",
    alignItems: "center", justifyContent: "center",
    gap: 2, position: "relative", marginBottom: 14, flexShrink: 0,
    ...(isDone    && { background: "rgba(138,127,107,0.18)", border: "2px solid rgba(138,127,107,0.45)" }),
    ...(isActive  && { background: "rgba(139,58,42,0.10)",  border: "2.5px solid var(--rust)", boxShadow: "0 0 0 5px rgba(139,58,42,0.10)" }),
    ...(isEa      && { background: "rgba(184,151,90,0.12)", border: "2.5px solid var(--gold)", boxShadow: "0 0 0 5px rgba(184,151,90,0.08)" }),
    ...(isMystery && { background: "rgba(28,26,20,0.07)",   border: "2.5px dashed rgba(139,58,42,0.45)", boxShadow: "0 0 0 5px rgba(139,58,42,0.05), 0 0 18px rgba(139,58,42,0.08)" }),
  }

  const labelColor = isDone ? "var(--faded)" : isEa ? "var(--gold)" : "var(--rust)"
  const dateColor  = isDone ? "var(--faded)" : isEa ? "var(--gold)" : isMystery ? "rgba(139,58,42,0.45)" : "var(--rust)"

  return (
    <div style={{ display: "flex", flexDirection: "column", alignItems: "center", flexShrink: 0, width: 120 }}>
      <div style={circleStyle}>
        {/* pulsujący ring dla aktywnego */}
        {isActive && (
          <div style={{
            position: "absolute", inset: -6, borderRadius: "50%",
            border: "1.5px solid rgba(139,58,42,0.22)",
            animation: "tl-ring-pulse 2.8s ease-in-out infinite",
          }} />
        )}
        {/* obracający się ring dla tajemniczego */}
        {isMystery && (
          <div style={{
            position: "absolute", inset: -10, borderRadius: "50%",
            border: "1px dashed rgba(139,58,42,0.18)",
            animation: "tl-mystery-spin 18s linear infinite",
          }} />
        )}

        {isMystery ? (
          <span style={{ fontFamily: "var(--f-stamp)", fontSize: 34, color: "rgba(139,58,42,0.50)", lineHeight: 1 }}>?</span>
        ) : (
          <>
            <span style={{
              fontFamily: "var(--f-stamp)",
              fontSize: isEa ? 11 : 17,
              letterSpacing: "0.04em",
              color: labelColor,
              lineHeight: 1.2,
              textAlign: "center",
            }}>
              {label}
            </span>
            {sub && (
              <span style={{
                fontFamily: "var(--f-stamp)", fontSize: 8, letterSpacing: "0.16em",
                color: isDone ? "rgba(138,127,107,0.6)" : isEa ? "rgba(184,151,90,0.65)" : "rgba(139,58,42,0.65)",
              }}>
                {sub}
              </span>
            )}
          </>
        )}
      </div>

      <div style={{
        fontFamily: "var(--f-stamp)", fontSize: 10, letterSpacing: "0.22em",
        textAlign: "center", lineHeight: 1.6, color: dateColor,
      }}>
        {date}<br />{status}
      </div>
    </div>
  )
}
