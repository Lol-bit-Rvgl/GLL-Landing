#!/usr/bin/env node
/**
 * Ejecuta migración con límites de memoria optimizados para Windows
 */

// Establecer límites de memoria altos
process.env.NODE_OPTIONS = '--max-old-space-size=4096';

// Cargar dotenv
const fs = require('fs');
const path = require('path');

try {
  require('dotenv').config({ path: path.resolve('.env.local') });
} catch (e) {
  console.log('[Migrate] Advertencia: dotenv no disponible');
}

// Verificar variables
const required = ['NEXT_PUBLIC_SUPABASE_URL', 'NEXT_PUBLIC_SUPABASE_ANON_KEY', 'SUPABASE_SERVICE_ROLE_KEY'];
const missing = required.filter(k => !process.env[k]);

if (missing.length > 0) {
  console.error('[Migrate] ERROR: Variables faltantes:', missing.join(', '));
  process.exit(1);
}

// Importar Supabase
const { createClient } = require('@supabase/supabase-js');

const client = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY,
  { auth: { persistSession: false, autoRefreshToken: false } }
);

// Datos de site settings
const defaultSettings = {
  siteName: "GLL • Gods Live Longer.™",
  slogan: "Digital Archive • Signal Network",
  description: "GLL is a digital archive and signal network for the community.",
  discord: "JFwbkEbfAH",
};

async function main() {
  console.log('\n========================================');
  console.log('[Migrate] INICIANDO MIGRACIÓN A POSTGRESQL');
  console.log('========================================\n');
  
  console.log('[Migrate] Supabase URL:', process.env.NEXT_PUBLIC_SUPABASE_URL);
  console.log('[Migrate] Verificando conexión...\n');
  
  // Insertar settings
  console.log('[Migrate] Inserte site_settings...');
  const { error: settingsErr } = await client.from('site_settings').insert({ settings: defaultSettings });
  
  if (settingsErr) {
    console.error('[Migrate] Error site_settings:', settingsErr.message);
  } else {
    console.log('[Migrate] Site settings insertado correctamente');
  }
  
  // Importar los miembros desde el archivo TypeScript
  console.log('\n[Migrate] Para migrar miembros, ejecuta:');
  console.log('  1. Ejecuta las migraciones SQL en el editor de Supabase');
  console.log('  2. Luego corre el script de migración de datos');
  
  console.log('\n========================================');
  console.log('[Migrate] COMPLETADO');
  console.log('========================================\n');
}

main().catch(e => {
  console.error('[Migrate] Error:', e);
  process.exit(1);
});