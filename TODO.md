# PRZED PUBLIKACJĄ — lista rzeczy do zrobienia

## Konfiguracja (obowiązkowe)

- [ ] `config/archiv.ts` — uzupełnij placeholder'y:
  - `allegroUsername` → `"army-bb"` (sprawdź login na Allegro)
  - `allegroProfileUrl` → `"https://allegro.pl/uzytkownik/army-bb"`
  - `whatsappNumber` → prawdziwy numer (format `48XXXXXXXXX`)
  - `email` → prawdziwy adres email Arka

## Allegro / tokeny

- [x] Supabase kv_store — token rotuje się automatycznie po każdym odświeżeniu
- [x] supabase-server.ts — service_role key do zapisów (omija RLS)
- [ ] Sprawdzić czy zdjęcia z Allegro wyświetlają się poprawnie na kartach aukcji

## Przed deploymentem na Vercel

- [ ] Dodać zmienne środowiskowe w Vercel Dashboard (Settings → Environment Variables):
  - `SUPABASE_URL`
  - `SUPABASE_ANON_KEY`
  - `SUPABASE_SERVICE_ROLE_KEY`  ← nowe, obowiązkowe
  - `BREVO_API_KEY`
  - `NOTIFY_EMAIL`
  - `ALLEGRO_CLIENT_ID`
  - `ALLEGRO_CLIENT_SECRET`
  - `ALLEGRO_REFRESH_TOKEN`  ← wygeneruj świeży tuż przed deployem
- [ ] Strona /privacy (wymagana prawnie — RODO, Allegro może wymagać)
- [ ] Deploy na Vercel

## Opcjonalne / nice-to-have

- [ ] OG image (podgląd przy udostępnieniu w social media)
- [ ] Google Analytics lub Umami
- [ ] Favicon — finalna wersja
