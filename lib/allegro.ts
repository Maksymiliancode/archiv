import { cacheLife, cacheTag } from 'next/cache'
import { getSupabaseAdmin } from './supabase-server'

const API      = 'https://api.allegro.pl'
const AUTH_URL = 'https://allegro.pl/auth/oauth/token'
const ACCEPT   = 'application/vnd.allegro.public.v1+json'
// Osobny klucz dla dev i prod — żeby lokalne env nie inwalidowało produkcyjnego tokenu
const KV_KEY   = process.env.NODE_ENV === 'production'
  ? 'allegro_refresh_token'
  : 'allegro_refresh_token_dev'

let tokenState: {
  accessToken: string
  refreshToken: string
  accessExpiresAt: number
} | null = null

// Mutex — jedno odświeżenie tokenu na raz, żeby uniknąć race condition
let refreshingPromise: Promise<string> | null = null

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

async function clearSupabaseToken(): Promise<void> {
  try {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    await (getSupabaseAdmin().from('kv_store') as any).delete().eq('key', KV_KEY)
  } catch {}
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
async function tryRefresh(refreshToken: string): Promise<Record<string, any> | null> {
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
  if (!res.ok) return null
  return res.json()
}

async function doRefresh(): Promise<string> {
  const now = Date.now()
  const currentToken = tokenState?.refreshToken ?? await loadRefreshToken()
  let data = await tryRefresh(currentToken)

  if (!data) {
    // Token z Supabase nieważny — usuń go i spróbuj env var jako fallback
    console.warn('[Allegro] token nieważny, próbuję env var jako fallback')
    await clearSupabaseToken()
    tokenState = null
    const envToken = process.env.ALLEGRO_REFRESH_TOKEN
    if (envToken && envToken !== currentToken) {
      data = await tryRefresh(envToken)
    }
  }

  if (!data) {
    throw new Error('Wszystkie tokeny Allegro nieważne — uruchom: node scripts/allegro-auth.mjs')
  }

  const newRefreshToken = data.refresh_token ?? currentToken
  tokenState = {
    accessToken:     data.access_token,
    refreshToken:    newRefreshToken,
    accessExpiresAt: now + (data.expires_in ?? 43_200) * 1000,
  }

  await saveRefreshToken(newRefreshToken)
  return tokenState.accessToken
}

async function getAccessToken(): Promise<string> {
  const now = Date.now()
  if (tokenState && tokenState.accessExpiresAt > now + 120_000) return tokenState.accessToken
  if (refreshingPromise) return refreshingPromise
  refreshingPromise = doRefresh().finally(() => { refreshingPromise = null })
  return refreshingPromise
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

// Elastyczny parser — łapie 0/30, [0/30], (0/30) gdziekolwiek w tytule
const DESANT_RE = /[\[\(]?(\d{1,2})\/30[\]\)]?/

function parseDesantCrate(title: string): number | null {
  const m = DESANT_RE.exec(title)
  return m ? parseInt(m[1], 10) : null
}

function stripDesantTag(title: string): string {
  return title.replace(/\s*[\[\(]?\d{1,2}\/30[\]\)]?\s*/g, '').trim()
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
  desantCrate?: number
  sold?: boolean
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
      const crate  = parseDesantCrate(o.name)
      const amount = o.sellingMode?.price?.amount ?? o.sellingMode?.startingPrice?.amount
      const price  = amount ? `${Number(amount).toFixed(0)} zł` : '—'
      const { text: timeText, urgent } = timeLabel(o.publication?.endingAt ?? null)
      const cleanTitle = crate !== null ? stripDesantTag(o.name) : o.name

      return {
        id:       o.id,
        title:    cleanTitle,
        price,
        timeText,
        urgent,
        imageUrl: o.primaryImage?.url ?? null,
        offerUrl: `https://allegro.pl/oferta/${slugify(cleanTitle)}-${o.id}`,
        format:   o.sellingMode?.format ?? null,
        ...(crate !== null && { desantCrate: crate }),
      }
    })

    return { offers: mapped, totalCount: totalCount ?? mapped.length }
  } catch (err) {
    console.error('[Allegro] getActiveOffers error:', err)
    return { offers: [], totalCount: 0 }
  }
}

export async function getEndedDesantOffers(): Promise<AllegroResult> {
  'use cache'
  cacheLife('hours')
  cacheTag('allegro-ended-desant')

  try {
    const token = await getAccessToken()

    const res = await fetch(
      `${API}/sale/offers?publication.status=ENDED&limit=1000&sort=-endingAt`,
      { headers: { Authorization: `Bearer ${token}`, Accept: ACCEPT } }
    )

    if (!res.ok) {
      console.error('[Allegro] ended offers fetch failed:', res.status, await res.text())
      return { offers: [], totalCount: 0 }
    }

    const { offers = [] } = await res.json()

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const mapped = offers.reduce((acc: AllegroOffer[], o: any) => {
      const crate = parseDesantCrate(o.name)
      if (crate === null) return acc
      const amount   = o.sellingMode?.price?.amount ?? o.sellingMode?.startingPrice?.amount
      const price    = amount ? `${Number(amount).toFixed(0)} zł` : '—'
      const cleanTitle = stripDesantTag(o.name)
      acc.push({
        id:          o.id,
        title:       cleanTitle,
        price,
        timeText:    'zakończona',
        urgent:      false,
        imageUrl:    o.primaryImage?.url ?? null,
        offerUrl:    `https://allegro.pl/oferta/${slugify(cleanTitle)}-${o.id}`,
        format:      o.sellingMode?.format ?? null,
        desantCrate: crate,
        sold:        true,
      })
      return acc
    }, [])

    return { offers: mapped, totalCount: mapped.length }
  } catch (err) {
    console.error('[Allegro] getEndedDesantOffers error:', err)
    return { offers: [], totalCount: 0 }
  }
}
