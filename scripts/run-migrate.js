#!/usr/bin/env node
/**
 * Script wrapper para migración que carga .env.local correctamente
 */

const path = require('path');
const { execSync } = require('child_process');

// Cargar variables de entorno desde .env.local (si existe)
try {
  require('dotenv').config({ path: path.resolve('.env.local') });
} catch (e) {
  console.log('[Migrate] dotenv no disponible');
}

// Verificar que las variables necesarias estén presentes
const required = ['NEXT_PUBLIC_SUPABASE_URL', 'NEXT_PUBLIC_SUPABASE_ANON_KEY', 'SUPABASE_SERVICE_ROLE_KEY'];
const missing = required.filter(k => !process.env[k]);

if (missing.length > 0) {
  console.error('[Migrate] ERROR: Variables de entorno faltantes:', missing.join(', '));
  process.exit(1);
}

console.log('[Migrate] Variables de entorno cargadas correctamente');
console.log('[Migrate] Supabase URL:', process.env.NEXT_PUBLIC_SUPABASE_URL);

// Ejecutar el script de migración usando npx tsx (compatible con Windows)
try {
  execSync('npx tsx src/lib/db/migrate.ts', { stdio: 'inherit', env: process.env });
} catch (e) {
  process.exit(e.status || 1);
}