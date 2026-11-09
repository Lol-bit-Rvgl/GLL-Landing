import { createClient, SupabaseClient } from "@supabase/supabase-js";
import type { Database } from "./database.types";

// Variables de entorno se leen dinámicamente desde process.env
const getEnv = (key: string): string => {
  return process.env[key] || "";
};

/**
 * Verifica si Supabase está configurado
 */
export function isSupabaseConfigured(): boolean {
  return Boolean(
    getEnv("NEXT_PUBLIC_SUPABASE_URL") &&
    getEnv("NEXT_PUBLIC_SUPABASE_ANON_KEY") &&
    getEnv("SUPABASE_SERVICE_ROLE_KEY")
  );
}

// Singleton client instances
let _readClient: SupabaseClient<Database> | null = null;
let _serviceClient: SupabaseClient<Database> | null = null;

/**
 * Cliente Supabase para operaciones de lectura (seguro para cliente)
 */
export function getSupabaseReadClient(): SupabaseClient<Database> | null {
  const supabaseUrl = getEnv("NEXT_PUBLIC_SUPABASE_URL");
  const supabaseAnonKey = getEnv("NEXT_PUBLIC_SUPABASE_ANON_KEY");
  
  if (!supabaseUrl || !supabaseAnonKey) {
    return null;
  }
  if (!_readClient) {
    _readClient = createClient<Database>(supabaseUrl, supabaseAnonKey, {
      auth: {
        persistSession: false,
        autoRefreshToken: false,
      },
    });
  }
  return _readClient;
}

/**
 * Cliente Supabase con service role (operaciones administrativas)
 */
export function getSupabaseServiceClient(): SupabaseClient<Database> | null {
  const supabaseUrl = getEnv("NEXT_PUBLIC_SUPABASE_URL");
  const supabaseServiceKey = getEnv("SUPABASE_SERVICE_ROLE_KEY");
  
  if (!supabaseUrl || !supabaseServiceKey) {
    return null;
  }
  if (!_serviceClient) {
    _serviceClient = createClient<Database>(supabaseUrl, supabaseServiceKey, {
      auth: {
        persistSession: false,
        autoRefreshToken: false,
      },
    });
  }
  return _serviceClient;
}

// Alias para compatibilidad con código existente
export const getServiceClient = getSupabaseServiceClient;