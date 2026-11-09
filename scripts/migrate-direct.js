#!/usr/bin/env node
/**
 * Script de migración directo en JavaScript
 * Carga .env.local y ejecuta la migración contra Supabase
 */

const path = require('path');

// Cargar .env.local manualmente
const fs = require('fs');
const dotenv = require('dotenv');

const envPath = path.resolve('.env.local');
if (fs.existsSync(envPath)) {
  const result = dotenv.config({ path: envPath });
  if (result.error) {
    console.log('[Migrate] Error cargando .env.local:', result.error.message);
  } else {
    console.log('[Migrate] Variables de entorno cargadas desde .env.local');
  }
}

// Verificar variables requeridas
const required = ['NEXT_PUBLIC_SUPABASE_URL', 'NEXT_PUBLIC_SUPABASE_ANON_KEY', 'SUPABASE_SERVICE_ROLE_KEY'];
const missing = required.filter(k => !process.env[k]);

if (missing.length > 0) {
  console.error('[Migrate] ERROR: Variables de entorno faltantes:', missing.join(', '));
  console.error('[Migrate] Asegúrate de que .env.local exista y tenga estas variables');
  process.exit(1);
}

console.log('[Migrate] Supabase URL:', process.env.NEXT_PUBLIC_SUPABASE_URL);

// Ahora necesitamos importar el cliente Supabase
// Vamos a crear una versión que funcione sin tsx

const { createClient } = require('@supabase/supabase-js');

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

const client = createClient(supabaseUrl, supabaseServiceKey, {
  auth: {
    persistSession: false,
    autoRefreshToken: false,
  },
});

console.log('[Migrate] Cliente Supabase creado');

// Datos de ejemplo - site settings
const defaultSettings = {
  siteName: "GLL • Gods Live Longer.™",
  slogan: "Digital Archive • Signal Network",
  description: "GLL is a digital archive and signal network for the community.",
  discord: "JFwbkEbfAH",
};

async function migrateSettings() {
  console.log('[Migrate] Verificando site settings...');
  
  const { data: existing, error: existingError } = await client
    .from('site_settings')
    .select('id')
    .limit(1)
    .single();
  
  if (existing && 'id' in existing && !existingError) {
    console.log('[Migrate] Actualizando settings existentes...');
    const { error } = await client
      .from('site_settings')
      .update({ settings: defaultSettings })
      .eq('id', existing.id);
    
    if (error) {
      console.error('[Migrate] Error actualizando settings:', error.message);
      return { created: false, updated: false, errors: 1 };
    }
    return { created: true, updated: true, errors: 0 };
  }
  
  const { error } = await client.from('site_settings').insert({ settings: defaultSettings });
  
  if (error) {
    console.error('[Migrate] Error creando settings:', error.message);
    return { created: false, updated: false, errors: 1 };
  }
  
  console.log('[Migrate] Site settings creado');
  return { created: true, updated: false, errors: 0 };
}

async function migrateMembers() {
  console.log('[Migrate] Nota: Los miembros deben ser migrados manualmente o mediante script transpilado.');
  console.log('[Migrate] La tabla members necesita los datos de src/data/members.ts');
  console.log('[Migrate] Por ahora migrando solo site_settings...');
  return { imported: 0, skipped: 0, errors: 0 };
}

async function verifyMigration() {
  console.log('[Migrate] Verificando migración...');
  
  const { data: settings } = await client.from('site_settings').select('settings, created_at, updated_at').limit(1);
  
  if (settings && settings.length > 0) {
    console.log('[Migrate] Settings encontrados:');
    console.log('  - Nombre:', settings[0].settings?.siteName);
    console.log('  - Creado:', settings[0].created_at);
  } else {
    console.log('[Migrate] Settings NO encontrados');
  }
  
  try {
    const { data: membersData, error } = await client
      .from('members')
      .select('slug, visible')
      .order('sort_order');
    
    if (error) {
      console.log('[Migrate] Tabla members vacía o sin datos:', error.message);
    } else {
      console.log('[Migrate] Miembros en base:', membersData?.length || 0);
    }
  } catch (e) {
    console.log('[Migrate] Tabla members:', e.message);
  }
}

async function runMigration() {
  console.log('\n========================================');
  console.log('[Migrate] INICIANDO MIGRACIÓN A POSTGRESQL');
  console.log('========================================\n');
  
  const settingsResult = await migrateSettings();
  
  console.log('\n[Migration] VERIFICACIÓN FINAL');
  await verifyMigration();
  
  console.log('\n========================================');
  console.log('[Migrate] MIGRACIÓN COMPLETA');
  console.log('========================================\n');
  
  return {
    members: await migrateMembers(),
    settings: settingsResult,
  };
}

runMigration()
  .then(() => process.exit(0))
  .catch((e) => {
    console.error('[Migrate] Error fatal:', e);
    process.exit(1);
  });