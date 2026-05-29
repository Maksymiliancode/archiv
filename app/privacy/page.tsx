import type { Metadata } from "next"

export const metadata: Metadata = {
  title: "Polityka Prywatności — ARCHIV · Army Shop Bielsko-Biała",
  description: "Informacje o przetwarzaniu danych osobowych przez ARCHIV / Army Shop Bielsko-Biała.",
}

export default function PrivacyPage() {
  return (
    <main className="av-section av-section-paper av-grain" style={{ minHeight: "80vh" }}>
      <div
        className="av-wrap av-fade"
        style={{ position: "relative", zIndex: 2, maxWidth: 760 }}
      >
        <div className="av-eyebrow">DOKUMENT · RODO</div>
        <h1 className="av-sechead" style={{ color: "var(--ink)", marginBottom: 8, fontSize: "clamp(36px,5vw,64px)" }}>
          POLITYKA<br />PRYWATNOŚCI
        </h1>
        <p style={{ fontFamily: "var(--f-mono)", fontSize: 11, letterSpacing: "0.22em", color: "var(--faded)", marginBottom: 56 }}>
          OBOWIĄZUJE OD · 2026
        </p>

        <div style={{ fontFamily: "var(--f-body)", fontSize: 17, lineHeight: 1.75, color: "var(--ink)", display: "flex", flexDirection: "column", gap: 40 }}>

          <Section nr="01" head="ADMINISTRATOR DANYCH">
            <p>Administratorem danych osobowych jest Arkadiusz Pawłowski prowadzący działalność gospodarczą pod nazwą <strong>Army Shop</strong>, z siedzibą w Bielsku-Białej.</p>
            <p>Kontakt: <a href="mailto:archive.arek@gmail.com" style={{ color: "var(--rust)" }}>archive.arek@gmail.com</a></p>
          </Section>

          <Section nr="02" head="JAKIE DANE ZBIERAMY">
            <p>Zbieramy wyłącznie dane, które sam nam podajesz:</p>
            <ul style={{ paddingLeft: 24, display: "flex", flexDirection: "column", gap: 8, margin: "12px 0 0" }}>
              <li><strong>Formularz Meldunek</strong> — imię, adres e-mail, numer telefonu (opcjonalnie), treść wiadomości, rodzaj zgłoszenia, liczba sztuk.</li>
              <li><strong>Grupa Taktyczna (newsletter)</strong> — adres e-mail.</li>
            </ul>
          </Section>

          <Section nr="03" head="CEL I PODSTAWA PRZETWARZANIA">
            <p>Dane z formularza Meldunek przetwarzamy w celu odpowiedzi na Twoje zgłoszenie (art. 6 ust. 1 lit. b RODO — wykonanie umowy lub działania przed jej zawarciem).</p>
            <p>Adres e-mail podany w Grupie Taktycznej przetwarzamy w celu wysyłki powiadomień o desantach ARCHIV na podstawie Twojej zgody (art. 6 ust. 1 lit. a RODO).</p>
          </Section>

          <Section nr="04" head="OKRES PRZECHOWYWANIA">
            <p>Dane z formularza Meldunek przechowujemy przez czas niezbędny do obsługi zgłoszenia, nie dłużej niż 2 lata od ostatniego kontaktu.</p>
            <p>Adresy e-mail z newslettera przechowujemy do momentu wycofania zgody.</p>
          </Section>

          <Section nr="05" head="ODBIORCY DANYCH">
            <p>Dane są przetwarzane przy użyciu narzędzi:</p>
            <ul style={{ paddingLeft: 24, display: "flex", flexDirection: "column", gap: 8, margin: "12px 0 0" }}>
              <li><strong>Supabase</strong> — baza danych (serwery w UE).</li>
              <li><strong>Brevo</strong> — wysyłka e-mail (serwery w UE).</li>
            </ul>
            <p style={{ marginTop: 12 }}>Nie sprzedajemy ani nie udostępniamy Twoich danych osobom trzecim w celach marketingowych.</p>
          </Section>

          <Section nr="06" head="TWOJE PRAWA">
            <p>Przysługuje Ci prawo do:</p>
            <ul style={{ paddingLeft: 24, display: "flex", flexDirection: "column", gap: 8, margin: "12px 0 0" }}>
              <li>dostępu do swoich danych,</li>
              <li>sprostowania danych,</li>
              <li>usunięcia danych („prawo do bycia zapomnianym"),</li>
              <li>ograniczenia przetwarzania,</li>
              <li>wycofania zgody w dowolnym momencie (bez wpływu na zgodność z prawem przetwarzania przed wycofaniem),</li>
              <li>wniesienia skargi do Prezesa Urzędu Ochrony Danych Osobowych (uodo.gov.pl).</li>
            </ul>
            <p style={{ marginTop: 12 }}>Aby skorzystać z tych praw, napisz na: <a href="mailto:archive.arek@gmail.com" style={{ color: "var(--rust)" }}>archive.arek@gmail.com</a></p>
          </Section>

          <Section nr="07" head="PLIKI COOKIES">
            <p>Strona nie używa plików cookies do celów marketingowych ani śledzenia. Pliki sesyjne mogą być używane wyłącznie do poprawnego działania formularzy.</p>
          </Section>

          <Section nr="08" head="ZMIANY POLITYKI">
            <p>Zastrzegamy sobie prawo do aktualizacji niniejszej polityki. O istotnych zmianach poinformujemy poprzez aktualizację daty w nagłówku dokumentu.</p>
          </Section>

        </div>
      </div>
    </main>
  )
}

function Section({ nr, head, children }: { nr: string; head: string; children: React.ReactNode }) {
  return (
    <div>
      <div style={{ display: "flex", alignItems: "baseline", gap: 16, marginBottom: 16 }}>
        <span style={{ fontFamily: "var(--f-mono)", fontSize: 10, letterSpacing: "0.28em", color: "var(--rust)", flexShrink: 0 }}>
          NR {nr}
        </span>
        <h2 style={{ fontFamily: "var(--f-stamp)", fontSize: 22, letterSpacing: "0.06em", color: "var(--ink)", fontWeight: 400, margin: 0 }}>
          {head}
        </h2>
      </div>
      <div style={{ borderLeft: "2px solid rgba(139,58,42,0.2)", paddingLeft: 24, display: "flex", flexDirection: "column", gap: 12 }}>
        {children}
      </div>
    </div>
  )
}
