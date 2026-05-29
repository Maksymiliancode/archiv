// Jednorazowy skrypt do uzyskania refresh_token z Allegro (device_code flow).
// Uruchom: node scripts/allegro-auth.mjs
// Wynik: wklej ALLEGRO_REFRESH_TOKEN=... do .env.local

import { readFileSync } from 'fs'
import { join } from 'path'

const envText = readFileSync(join(process.cwd(), '.env.local'), 'utf-8')
const env = {}
for (const line of envText.split('\n')) {
  const t = line.trim()
  if (!t || t.startsWith('#')) continue
  const idx = t.indexOf('=')
  if (idx === -1) continue
  env[t.slice(0, idx)] = t.slice(idx + 1)
}

const CLIENT_ID     = env.ALLEGRO_CLIENT_ID
const CLIENT_SECRET = env.ALLEGRO_CLIENT_SECRET

if (!CLIENT_ID || !CLIENT_SECRET) {
  console.error('Brak ALLEGRO_CLIENT_ID lub ALLEGRO_CLIENT_SECRET w .env.local')
  process.exit(1)
}

const credentials = Buffer.from(`${CLIENT_ID}:${CLIENT_SECRET}`).toString('base64')

// Krok 1 — pobierz device code
const deviceRes = await fetch('https://allegro.pl/auth/oauth/device', {
  method: 'POST',
  headers: {
    Authorization: `Basic ${credentials}`,
    'Content-Type': 'application/x-www-form-urlencoded',
  },
  body: `client_id=${CLIENT_ID}`,
})

if (!deviceRes.ok) {
  console.error('Błąd:', await deviceRes.text())
  process.exit(1)
}

const device = await deviceRes.json()

console.log('\n========================================')
console.log('Otwórz ten adres w przeglądarce:\n')
console.log(device.verification_uri_complete ?? device.verification_uri)
if (!device.verification_uri_complete) {
  console.log('\nKod do wpisania:', device.user_code)
}
console.log('\n========================================')
console.log('Zaloguj się i zatwierdź dostęp, a skrypt automatycznie wychwyci token...\n')

// Krok 2 — polluj aż użytkownik zatwierdzi
const pollInterval = (device.interval ?? 5) * 1000
const expiresAt    = Date.now() + device.expires_in * 1000

while (Date.now() < expiresAt) {
  await new Promise(r => setTimeout(r, pollInterval))

  const tokenRes = await fetch('https://allegro.pl/auth/oauth/token', {
    method: 'POST',
    headers: {
      Authorization: `Basic ${credentials}`,
      'Content-Type': 'application/x-www-form-urlencoded',
    },
    body: `grant_type=urn:ietf:params:oauth:grant-type:device_code&device_code=${device.device_code}`,
  })

  const token = await tokenRes.json()

  if (token.refresh_token) {
    console.log('Autoryzacja udana!\n')
    console.log('Wklej to do .env.local:')
    console.log(`\nALLEGRO_REFRESH_TOKEN=${token.refresh_token}\n`)
    process.exit(0)
  }

  if (token.error === 'access_denied') {
    console.error('Autoryzacja odrzucona przez użytkownika.')
    process.exit(1)
  }

  // authorization_pending lub slow_down — czekamy dalej
  process.stdout.write('.')
}

console.error('\nTimeout — spróbuj ponownie.')
process.exit(1)
