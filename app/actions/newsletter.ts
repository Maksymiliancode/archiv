"use server"

import { supabase } from "@/lib/supabase"

export interface NewsletterResult {
  success: boolean
  error?: string
}

export async function subscribeNewsletter(_prev: NewsletterResult, formData: FormData): Promise<NewsletterResult> {
  const email = (formData.get("email") as string | null)?.trim().toLowerCase()

  if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
    return { success: false, error: "Podaj poprawny adres e-mail." }
  }

  const { error } = await supabase.from("newsletter").insert({ email })

  if (error) {
    if (error.code === "23505") {
      return { success: false, error: "Ten adres jest już w bazie. Czekaj na sygnał." }
    }
    console.error("Newsletter insert error:", error)
    return { success: false, error: "Błąd zapisu. Spróbuj ponownie." }
  }

  const BREVO_API_KEY = process.env.BREVO_API_KEY
  const NOTIFY_EMAIL  = process.env.NOTIFY_EMAIL

  if (BREVO_API_KEY && NOTIFY_EMAIL) {
    const brevo = async (label: string, payload: object) => {
      try {
        const res = await fetch("https://api.brevo.com/v3/smtp/email", {
          method: "POST",
          headers: { "Content-Type": "application/json", "api-key": BREVO_API_KEY },
          body: JSON.stringify(payload),
        })
        const body = await res.json()
        console.log(`[Brevo][${label}] status=${res.status}`, JSON.stringify(body))
      } catch (e) {
        console.error(`[Brevo][${label}] fetch error:`, e)
      }
    }

    await Promise.all([
      // Potwierdzenie dla subskrybenta
      brevo("subscriber", {
        sender: { name: "ARCHIV", email: NOTIFY_EMAIL },
        to: [{ email }],
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
      // Powiadomienie dla Arka
      brevo("arek", {
        sender: { name: "ARCHIV", email: NOTIFY_EMAIL },
        to: [{ email: NOTIFY_EMAIL }],
        subject: "ARCHIV — nowy zapis do Grupy Taktycznej",
        textContent: `Nowy subscriber: ${email}\nData: ${new Date().toLocaleString("pl-PL")}`,
      }),
    ])
  }

  return { success: true }
}
