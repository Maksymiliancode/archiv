import { cacheLife, cacheTag } from 'next/cache'
import { getSupabaseAdmin } from './supabase-server'

const API      = 'https://api.allegro.pl'
const AUTH_URL = 'https://allegro.pl/auth/oauth/token'
const ACCEPT   = 'application/vnd.allegro.public.v1+json'
const KV_KEY   = 'allegro_refresh_token'

// In-memory token state — przeżywa między cache miss'ami.
// Trwałe źródło prawdy: Supabase kv_store (fallback: .env.local ALLEGRO_REFRESH_TOKEN).
let tokenState: {
  accessToken: string
  refreshToken: string
  accessExpiresAt: number
} | null = null

async function loadRefreshToken(): Promise<string> {
  // Próbuj Supabase najpierw — przeżywa restarty serwera
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const { data } = await (getSupabaseAdmin().from('kv_store') as any)
    .select('value')
    .eq('key', KV_KEY)
    .single() as { data: { value: string } | null }

  if (data?.value) return data.value

  // Fallback na .env.local (pierwsze uruchomienie)
  const envToken = process.env.ALLEGRO_REFRESH_TOKEN
  if (!envToken) throw new Error('Brak ALLEGRO_REFRESH_TOKEN w .env.local i Supabase')
  return envToken
}

async function saveRefreshToken(token: string): Promise<void> {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const { error } = await (getSupabaseAdmin().from('kv_store') as any).upsert({
    key: KV_KEY,
    value: token,
    updated_at: new Date().toISOString(),
  })
  if (error) console.error('[Allegro] saveRefreshToken failed:', error.message)
}

async function getAccessToken(): Promise<string> {
  const now = Date.now()

  if (tokenState && tokenState.accessExpiresAt > now + 120_000) {
    return tokenState.accessToken
  }

  const refreshToken = tokenState?.refreshToken ?? await loadRefreshToken()

  const credentials = Buffer.from(
    `${process.env.ALLEGRO_CLIENT_ID}:${process.env.ALLEGRO_CLIENT_SECRET}`
  ).toString('base64')

  const res = await fetch(AUTH_URL, {
    method: 'POST',
    headers: {
      Authorization: `Basic ${credentials}`,
      'Content-Type': 'application/x-www-form-urlencoded',
    },
    body: `grant_type=refresh_token&refresh_token=${encodeURIComponent(refreshToken)}`,
  })

  if (!res.ok) {
    const body = await res.text()
    throw new Error(`Allegro token refresh failed: ${res.status} — ${body}`)
  }

  const data = await res.json()
  const newRefreshToken = data.refresh_token ?? refreshToken

  tokenState = {
    accessToken:     data.access_token,
    refreshToken:    newRefreshToken,
    accessExpiresAt: now + (data.expires_in ?? 43_200) * 1000,
  }

  // Zapisz rotowany token — przeżyje restart serwera
  await saveRefreshToken(newRefreshToken)

  return tokenState.accessToken
}

function slugify(text: string): string {
  return text
    .toLowerCase()
    .normalize('NFD')
    .replace(/ł/g, 'l')
    .replace(/[̀-ͯ]/g, '')
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-|-$/g, '')
}

function timeLabel(endingAt: string | null): { text: string; urgent: boolean } {
  if (!endingAt) return { text: '', urgent: false }
  const ms = new Date(endingAt).getTime() - Date.now()
  if (ms <= 0) return { text: 'zakończona', urgent: false }
  const h = Math.floor(ms / 3_600_000)
  if (h < 24) return { text: `kończy się za ${h} godz`, urgent: true }
  const d = Math.floor(h / 24)
  return { text: `kończy się za ${d} dni`, urgent: d <= 3 }
}

export type AllegroOffer = {
  id: string
  title: string
  price: string
  timeText: string
  urgent: boolean
  imageUrl: string | null
  offerUrl: string
  format: 'BUY_NOW' | 'AUCTION' | 'ADVERTISEMENT' | null
}

export type AllegroResult = {
  offers: AllegroOffer[]
  totalCount: number
}

export async function getActiveOffers(limit = 1000): Promise<AllegroResult> {
  'use cache'
  cacheLife('hours')
  cacheTag('allegro-offers')

  try {
    const token = await getAccessToken()

    const res = await fetch(
      `${API}/sale/offers?publication.status=ACTIVE&limit=${limit}&sort=-endingAt`,
      { headers: { Authorization: `Bearer ${token}`, Accept: ACCEPT } }
    )

    if (!res.ok) {
      console.error('[Allegro] offers fetch failed:', res.status, await res.text())
      return { offers: [], totalCount: 0 }
    }

    const { offers = [], totalCount = 0 } = await res.json()

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const mapped: AllegroOffer[] = offers.map((o: any) => {
      const amount = o.sellingMode?.price?.amount ?? o.sellingMode?.startingPrice?.amount
      const price  = amount ? `${Number(amount).toFixed(0)} zł` : '—'
      const { text: timeText, urgent } = timeLabel(o.publication?.endingAt ?? null)

      return {
        id:       o.id,
        title:    o.name,
        price,
        timeText,
        urgent,
        imageUrl: o.primaryImage?.url ?? null,
        offerUrl: `https://allegro.pl/oferta/${slugify(o.name)}-${o.id}`,
        format:   o.sellingMode?.format ?? null,
      }
    })

    return { offers: mapped, totalCount: totalCount ?? mapped.length }
  } catch (err) {
    console.error('[Allegro] getActiveOffers error:', err)
    return { offers: [], totalCount: 0 }
  }
}
