import { cacheLife, cacheTag } from 'next/cache'
import { getSupabaseAdmin } from './supabase-server'

const API      = 'https://api.allegro.pl'
const AUTH_URL = 'https://allegro.pl/auth/oauth/token'
const ACCEPT   = 'application/vnd.allegro.public.v1+json'
const sfx    = process.env.NODE_ENV === 'production' ? '' : '_dev'
const KV_RT  = `allegro_refresh_token${sfx}`   // refresh token (plain string, backward compat)
const KV_AT  = `allegro_token_cache${sfx}`     // pełny cache: access + refresh + expiry (JSON)

interface TokenCache { accessToken: string; refreshToken: string; expiresAt: number }

let mem: TokenCache | null = null          // in-memory (ta sama instancja serverless)
let refreshingPromise: Promise<string> | null = null  // mutex

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const kv = () => getSupabaseAdmin().from('kv_store') as any

async function readCache(): Promise<TokenCache | null> {
  try {
    const { data } = await kv().select('value').eq('key', KV_AT).single()
    if (data?.value) return JSON.parse(data.value) as TokenCache
  } catch {}
  return null
}

async function writeCache(c: TokenCache): Promise<void> {
  try {
    const now = new Date().toISOString()
    await Promise.all([
      kv().upsert({ key: KV_AT,  value: JSON.stringify(c), updated_at: now }),
      kv().upsert({ key: KV_RT,  value: c.refreshToken,    updated_at: now }),
    ])
  } catch (e) { console.error('[Allegro] writeCache failed:', e) }
}

async function clearCache(): Promise<void> {
  try { await Promise.all([kv().delete().eq('key', KV_AT), kv().delete().eq('key', KV_RT)]) } catch {}
}

async function getStoredRefreshToken(): Promise<string> {
  // Najpierw nowy format (JSON cache)
  const c = await readCache()
  if (c?.refreshToken) return c.refreshToken
  // Legacy: plain string
  const { data } = await kv().select('value').eq('key', KV_RT).single()
  if (data?.value) return data.value
  // Fallback: env var
  const env = process.env.ALLEGRO_REFRESH_TOKEN
  if (!env) throw new Error('Brak ALLEGRO_REFRESH_TOKEN')
  return env
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
async function tryRefresh(rt: string): Promise<Record<string, any> | null> {
  const creds = Buffer.from(`${process.env.ALLEGRO_CLIENT_ID}:${process.env.ALLEGRO_CLIENT_SECRET}`).toString('base64')
  const res = await fetch(AUTH_URL, {
    method: 'POST',
    headers: { Authorization: `Basic ${creds}`, 'Content-Type': 'application/x-www-form-urlencoded' },
    body: `grant_type=refresh_token&refresh_token=${encodeURIComponent(rt)}`,
  })
  if (!res.ok) return null
  return res.json()
}

async function doRefresh(): Promise<string> {
  const now = Date.now()
  const currentRT = mem?.refreshToken ?? await getStoredRefreshToken()
  let data = await tryRefresh(currentRT)

  if (!data) {
    // Refresh token już rotowany przez inną instancję serverless — poczekaj 2s i spróbuj odczytać świeży cache
    await new Promise(r => setTimeout(r, 2000))
    const fresh = await readCache()
    if (fresh && fresh.expiresAt > Date.now() + 120_000) {
      mem = fresh
      return mem.accessToken
    }
    // Ostatnia deska: env var
    console.warn('[Allegro] Supabase token nieważny, próbuję env var')
    await clearCache()
    mem = null
    const env = process.env.ALLEGRO_REFRESH_TOKEN
    if (env && env !== currentRT) data = await tryRefresh(env)
  }

  if (!data) throw new Error('Wszystkie tokeny Allegro nieważne — uruchom: node scripts/allegro-auth.mjs')

  const cache: TokenCache = {
    accessToken:  data.access_token,
    refreshToken: data.refresh_token ?? currentRT,
    expiresAt:    now + (data.expires_in ?? 43_200) * 1000,
  }
  mem = cache
  await writeCache(cache)
  return cache.accessToken
}

async function getAccessToken(): Promise<string> {
  const now = Date.now()

  // 1. Pamięć tej samej instancji serverless
  if (mem && mem.expiresAt > now + 120_000) return mem.accessToken

  // 2. Supabase cache — najważniejsze: raz na 12h, nie przy każdym żądaniu
  const cached = await readCache()
  if (cached && cached.expiresAt > now + 120_000) {
    mem = cached
    return mem.accessToken
  }

  // 3. Refresh — mutex zapobiega równoległym odświeżeniom w tej samej instancji
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
