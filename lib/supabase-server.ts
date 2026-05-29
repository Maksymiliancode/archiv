import { createClient } from "@supabase/supabase-js"

let _admin: ReturnType<typeof createClient> | null = null

// Lazy init — nie crashuje przy imporcie jeśli klucz nie jest ustawiony.
export function getSupabaseAdmin() {
  if (!_admin) {
    _admin = createClient(
      process.env.SUPABASE_URL!,
      process.env.SUPABASE_SERVICE_ROLE_KEY!
    )
  }
  return _admin
}
