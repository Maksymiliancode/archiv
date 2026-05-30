"use server"

import { supabase } from "@/lib/supabase"

export interface MeldunekResult {
  success: boolean
  error?: string
}

async function sendBrevoEmail(data: {
  type: string
  description: string | null
  quantity: number
  name: string
  email: string
  phone: string | null
  newsletter: boolean
}) {
  const BREVO_API_KEY = process.env.BREVO_API_KEY
  const NOTIFY_EMAIL = process.env.NOTIFY_EMAIL

  if (!BREVO_API_KEY || !NOTIFY_EMAIL) {
    console.warn("Brevo: brak konfiguracji (BREVO_API_KEY lub NOTIFY_EMAIL)")
    return
  }

  const body = {
    sender: { name: "ARCHIV", email: NOTIFY_EMAIL },
    to: [{ email: NOTIFY_EMAIL }],
    subject: `ARCHIV — nowy meldunek: ${data.type}`,
    textContent: [
      `Rodzaj: ${data.type}`,
      `Opis: ${data.description || "—"}`,
      `Ilość: ${data.quantity}`,
      `Imię: ${data.name}`,
      `Email: ${data.email}`,
      `Telefon: ${data.phone || "—"}`,
      `Newsletter: ${data.newsletter ? "TAK" : "NIE"}`,
      `Data: ${new Date().toLocaleString("pl-PL")}`,
    ].join("\n"),
  }

  const res = await fetch("https://api.brevo.com/v3/smtp/email", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "api-key": BREVO_API_KEY,
    },
    body: JSON.stringify(body),
  })

  if (!res.ok) {
    const text = await res.text()
    console.error("Brevo error:", res.status, text)
  }
}

export async function submitMeldunek(formData: FormData): Promise<MeldunekResult> {
  const type = formData.get("typ") as string
  const description = (formData.get("opis") as string) || null
  const quantity = Number(formData.get("ilosc")) || 1
  const name = formData.get("imie") as string
  const email = formData.get("email") as string
  const phone = (formData.get("telefon") as string) || null
  const newsletter = formData.get("newsletter") === "on"

  if (!name || !email || !type) {
    return { success: false, error: "Wypełnij wymagane pola." }
  }

  const { error } = await supabase.from("meldunki").insert({
    type,
    description,
    quantity,
    name,
    email,
    phone,
    newsletter,
  })

  if (error) {
    console.error("Supabase insert error:", JSON.stringify(error))
    return { success: false, error: "Błąd zapisu. Spróbuj ponownie." }
  }

  await sendBrevoEmail({ type, description, quantity, name, email, phone, newsletter }).catch(
    (e) => console.error("Brevo fetch error:", e)
  )

  return { success: true }
}
