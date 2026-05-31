import { config } from '@/config/archiv'

export type DesantState = 0 | 1 | 2

const FRESH_DAYS = 7

/** Data desantu numer `n`. Crate 0 → data pierwszego desantu (używane do countdown w State 0). */
export function getDesantDate(crateNum: number): Date {
  const first = new Date(config.firstDesant.date)
  if (crateNum <= 1) return first
  // Desant 2 = month(first)+1, day 7; Desant N = month(first)+(N-1), day 7
  return new Date(first.getFullYear(), first.getMonth() + (crateNum - 1), config.regularDesantDay)
}

/** Który desant jest aktualnie "ostatnim który wystąpił". 0 = żaden (przed pierwszym). */
export function getCurrentDesantNum(now = new Date()): number {
  const first = new Date(config.firstDesant.date)
  if (now < first) return 0

  const monthsSinceFirst =
    (now.getFullYear() - first.getFullYear()) * 12 + (now.getMonth() - first.getMonth())

  if (monthsSinceFirst === 0) return 1 // w miesiącu pierwszego desantu, desant już był

  // W kolejnych miesiącach: sprawdzamy czy 7. dnia już minął
  const day7 = new Date(now.getFullYear(), now.getMonth(), config.regularDesantDay)
  return now >= day7 ? monthsSinceFirst + 1 : monthsSinceFirst
}

/** Stan layoutu sekcji: 0 = pre-launch, 1 = świeży (≤7 dni po desancie), 2 = odliczanie */
export function getDesantState(now = new Date()): DesantState {
  const first = new Date(config.firstDesant.date)
  if (now < first) return 0

  const currentNum  = getCurrentDesantNum(now)
  const currentDate = getDesantDate(currentNum)
  const daysSince   = (now.getTime() - currentDate.getTime()) / 86_400_000
  return daysSince <= FRESH_DAYS ? 1 : 2
}

/** Data następnego (nadchodzącego) desantu. */
export function getNextDesantDate(now = new Date()): Date {
  const currentNum = getCurrentDesantNum(now)
  return getDesantDate(currentNum + 1)
}

/** Format DD.MM.YY */
export function fmtDate(d: Date): string {
  const dd = String(d.getDate()).padStart(2, '0')
  const mm = String(d.getMonth() + 1).padStart(2, '0')
  const yy = String(d.getFullYear()).slice(2)
  return `${dd}.${mm}.${yy}`
}
