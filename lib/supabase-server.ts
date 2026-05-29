import { createClient } from "@supabase/supabase-js"

// Service role client — używany wyłącznie server-side (token storage, kv_store).
// Nigdy nie importować w komponentach klienckich.
export const supabaseAdmin = createClient(
  process.env.SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
)
