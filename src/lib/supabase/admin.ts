import { createClient as createSupabaseClient } from "@supabase/supabase-js";

/**
 * Admin client com service_role key.
 * NUNCA usar no lado do cliente.
 * Bypass RLS — usar apenas para operações do sistema:
 * - Processar ELO
 * - Inserir elo_history
 * - Operações admin
 */
export function createAdminClient() {
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

  if (!supabaseUrl || !serviceRoleKey) {
    throw new Error(
      "Missing NEXT_PUBLIC_SUPABASE_URL or SUPABASE_SERVICE_ROLE_KEY"
    );
  }

  return createSupabaseClient(supabaseUrl, serviceRoleKey, {
    auth: {
      autoRefreshToken: false,
      persistSession: false,
    },
  });
}
