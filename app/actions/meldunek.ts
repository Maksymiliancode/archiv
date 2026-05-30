"use server"

import { supabase } from "@/lib/supabase"

export interface MeldunekResult {
  success: boolean
  error?: string
}

async function brevoSend(apiKey: string, payload: object) {
  const res = await fetch("https://api.brevo.com/v3/smtp/email", {
    method: "POST",
    headers: { "Content-Type": "application/json", "api-key": apiKey },
    body: JSON.stringify(payload),
  })
  if (!res.ok) console.error("[Brevo] error:", res.status, await res.text())
}

async function sendBrevoEmail(data: {
  type: string
  description: string | null
  quantity: number
  name: string
  email: string
  phone: string | null
  newsletter: boolean
  newsletterAlreadyExists?: boolean
}) {
  const BREVO_API_KEY = process.env.BREVO_API_KEY
  const NOTIFY_EMAIL = process.env.NOTIFY_EMAIL

  if (!BREVO_API_KEY || !NOTIFY_EMAIL) {
    console.warn("Brevo: brak konfiguracji (BREVO_API_KEY lub NOTIFY_EMAIL)")
    return
  }

  const sends = [
    // Potwierdzenie meldunku dla klienta
    brevoSend(BREVO_API_KEY, {
      sender: { name: "ARCHIV", email: NOTIFY_EMAIL },
      to: [{ email: data.email }],
      subject: "ARCHIV — meldunek złożony",
      textContent: [
        "MELDUNEK ZŁOŻONY.",
        "",
        `Rodzaj: ${data.type}`,
        data.description ? `Opis: ${data.description}` : null,
        `Ilość: ${data.quantity}`,
        "",
        "— ARCHIV · Army Shop Bielsko-Biała · od 1997",
      ].filter(Boolean).join("\n"),
    }),
    // Powiadomienie dla Arka o meldunku
    brevoSend(BREVO_API_KEY, {
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
    }),
  ]

  if (data.newsletter && !data.newsletterAlreadyExists) {
    sends.push(
      // Potwierdzenie wcielenia do GT dla klienta
      brevoSend(BREVO_API_KEY, {
        sender: { name: "ARCHIV", email: NOTIFY_EMAIL },
        to: [{ email: data.email }],
        subject: "ARCHIV — wcielony do Grupy Taktycznej",
        textContent: [
          "WCIELONY DO GRUPY TAKTYCZNEJ.",
          "",
          "Dostaniesz cynk 48 godzin przed każdym desantem — zanim trafi na Allegro i zanim zobaczą to wszyscy.",
          "",
          "Pierwsza skrzynia (1/30) startuje 1 września 2026.",
          "",
          "— ARCHIV · Army Shop Bielsko-Biała · od 1997",
        ].join("\n"),
      }),
      // Powiadomienie dla Arka o nowym subskrybencie
      brevoSend(BREVO_API_KEY, {
        sender: { name: "ARCHIV", email: NOTIFY_EMAIL },
        to: [{ email: NOTIFY_EMAIL }],
        subject: "ARCHIV — nowy zapis do Grupy Taktycznej",
        textContent: `Nowy subscriber (przez meldunek): ${data.email}\nImię: ${data.name}\nData: ${new Date().toLocaleString("pl-PL")}`,
      })
    )
  }

  await Promise.all(sends)
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

  let newsletterAlreadyExists = false
  if (newsletter) {
    const { error: nlError } = await supabase
      .from("newsletter")
      .insert({ email: email.trim().toLowerCase() })
    newsletterAlreadyExists = nlError?.code === "23505"
    if (nlError && nlError.code !== "23505") {
      console.error("Newsletter insert error:", nlError)
    }
  }

  await sendBrevoEmail({ type, description, quantity, name, email, phone, newsletter, newsletterAlreadyExists }).catch(
    (e) => console.error("Brevo fetch error:", e)
  )

  return { success: true }
}
