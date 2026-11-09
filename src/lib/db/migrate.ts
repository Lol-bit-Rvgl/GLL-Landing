/**
 * Script de migración de datos
 *
 * Importa los datos actuales de members.ts y site-settings a PostgreSQL.
 * Ejecutar manualmente: npm run db:migrate
 *
 * Este script es idempotente - no crea duplicados.
 */

// Cargar variables de entorno desde .env.local
import dotenv from 'dotenv';
dotenv.config({ path: '.env.local' });

import { members } from "@/data/members";
import { getSupabaseServiceClient, isSupabaseConfigured } from "./supabase";

// Settings por defecto
const defaultSettings = {
  siteName: "GLL • Gods Live Longer.™",
  slogan: "Digital Archive • Signal Network",
  description: "GLL is a digital archive and signal network for the community.",
  discord: "JFwbkEbfAH",
};

/**
 * Mapeo de faction (formato viejo → nuevo)
 * ARCHIVE → SOLAR, COMBAT → LUNAR, VOID → VOID
 */
const mapFaction = (oldFaction: string | undefined): string => {
  const validFactions = ["SOLAR", "LUNAR", "NEBULA", "VOID", "CHRONO"];
  const factionMap: Record<string, string> = {
    ARCHIVE: "SOLAR",
    COMBAT: "LUNAR",
    VOID: "VOID",
  };

  if (!oldFaction) return "VOID";
  if (validFactions.includes(oldFaction)) return oldFaction;
  return factionMap[oldFaction] || "VOID";
};

/**
 * Validación básica de miembro (runtime validation)
 */
const validateMember = (member: any): string[] => {
  const errors: string[] = [];

  if (!member.slug || typeof member.slug !== "string") {
    errors.push("slug is required and must be a string");
  }

  if (!member.displayName && !member.name) {
    errors.push("displayName or name is required");
  }

  if (!member.role && !member.faction) {
    errors.push("role is required");
  }

  return errors;
};

/**
 * Validación de settings
 */
const validateSettings = (settings: Record<string, unknown>): string[] => {
  const errors: string[] = [];

  if (settings.siteName && typeof settings.siteName !== "string") {
    errors.push("siteName must be a string");
  }

  if (settings.slogan && typeof settings.slogan !== "string") {
    errors.push("slogan must be a string");
  }

  if (settings.description && typeof settings.description !== "string") {
    errors.push("description must be a string");
  }

  if (settings.discord && typeof settings.discord !== "string") {
    errors.push("discord must be a string");
  }

  return errors;
};

/**
 * Sanitiza y construye el payload limpio para PostgreSQL
 * Solo incluye columnas que existen en el esquema oficial
 */
function sanitizeMember(member: any): Record<string, any> {
  const avatarSrc = typeof member.avatar === 'string' 
    ? member.avatar 
    : (member.avatar?.src || '');

  const cleanPayload = {
    slug: member.slug,
    name: member.name || member.displayName || member.slug,
    role: member.role || 'Member',
    bio: member.bio || member.description || null,
    avatar: { src: avatarSrc, alt: member.avatar?.alt || '' },
    faction: mapFaction(member.faction),
    card_size: ['NORMAL', 'WIDE', 'TALL', 'LARGE'].includes(member.card_size) 
      ? member.card_size 
      : 'NORMAL',
    experience: typeof member.experience === 'number' ? member.experience : 0,
    social_links: {
      ...(member.social_links || {}),
      ...(member.discord ? { discord: member.discord } : {}),
      ...(member.links ? { custom_links: member.links } : {}),
      ...(member.theme ? { theme: member.theme } : {}),
      ...(member.seo ? { seo: member.seo } : {}),
    },
    skills: Array.isArray(member.skills) ? member.skills : [],
  };

  return cleanPayload;
}

/**
 * Migrar miembros a PostgreSQL
 */
async function migrateMembers(client: any): Promise<{ imported: number; skipped: number; errors: number }> {
  let imported = 0;
  let skipped = 0;
  let errors = 0;

  console.log(`[Migrate] Iniciando migración de ${members.length} miembros...`);

  for (const member of members) {
    const validationErrors = validateMember(member);
    if (validationErrors.length > 0) {
      console.error(`[Migrate] Validación fallida para ${member.slug}:`, validationErrors.join(", "));
      errors++;
      continue;
    }

    try {
      // Verificar si ya existe
      const { data: existing, error: checkError } = await client
        .from("members")
        .select("slug")
        .eq("slug", member.slug)
        .single();

      if (existing && !checkError) {
        console.log(`[Migrate] Saltando ${member.slug} (ya existe)`);
        skipped++;
        continue;
      }

      // Sanitizar payload - solo columnas válidas
      const cleanPayload = sanitizeMember(member);

      const { error } = await client.from("members").insert(cleanPayload);

      if (error) {
        console.error(`[Migrate] Error migrando ${member.slug}:`, error.message);
        errors++;
      } else {
        console.log(`[Migrate] Importado ${member.slug}`);
        imported++;
      }
    } catch (e) {
      console.error(`[Migrate] Error procesando ${member.slug}:`, e);
      errors++;
    }
  }

  console.log(`[Migrate] Miembros: ${imported} importados, ${skipped} saltados, ${errors} errores`);
  return { imported, skipped, errors };
}

/**
 * Migrar Site Settings (formato key/value)
 */
async function migrateSettings(client: any): Promise<{ created: boolean; updated: boolean; errors: number }> {
  let errors = 0;
  console.log(`[Migrate] Verificando site settings...`);

  const settingsErrors = validateSettings(defaultSettings);
  if (settingsErrors.length > 0) {
    console.error(`[Migrate] Validación de settings fallida:`, settingsErrors.join(", "));
    return { created: false, updated: false, errors: 1 };
  }

  // Verificar si ya existe configuración (key = 'main_config')
  const { data: existing, error: existingError } = await client
    .from("site_settings")
    .select("key")
    .eq("key", "main_config")
    .single();

  if (existing && "key" in existing && !existingError) {
    console.log(`[Migrate] Site settings ya existe, actualizando...`);
    const { error } = await client
      .from("site_settings")
      .update({ value: defaultSettings })
      .eq("key", "main_config");

    if (error) {
      console.error(`[Migrate] Error actualizando settings:`, error.message);
      errors++;
      return { created: false, updated: false, errors };
    }
    return { created: true, updated: true, errors };
  }

  // Crear nuevo (key/value format)
  const { error } = await client.from("site_settings").insert({
    key: "main_config",
    value: defaultSettings
  });

  if (error) {
    console.error(`[Migrate] Error creando settings:`, error.message);
    errors++;
    return { created: false, updated: false, errors };
  }

  console.log(`[Migrate] Site settings creado`);
  return { created: true, updated: false, errors: 0 };
}

/**
 * Verificar integridad de datos
 */
async function verifyMigration(client: any): Promise<void> {
  console.log(`[Migrate] Verificando migración...`);

  const { data: membersData, error } = await client
    .from("members")
    .select("slug, name, faction, social_links")
    .order("id");

  if (error) {
    console.error(`[Migrate] Error verificando miembros:`, error.message);
    return;
  }

  console.log(`[Migrate] Miembros en base: ${(membersData as any[])?.length || 0}`);
  if ((membersData as any[])?.length > 0) {
    console.log(`[Migrate] Primer miembro:`, {
      slug: (membersData as any)[0].slug,
      name: (membersData as any)[0].name,
      faction: (membersData as any)[0].faction
    });
  }

  const { data: settings } = await client.from("site_settings").select("key, value, created_at, updated_at").eq("key", "main_config");

  if (settings && (settings as any[]).length > 0) {
    const s = (settings as any[])[0];
    console.log(`[Migrate] Settings encontrados:`);
    console.log(`  - Nombre: ${s.value?.siteName}`);
    console.log(`  - Creado: ${s.created_at}`);
    console.log(`  - Actualizado: ${s.updated_at}`);
  } else {
    console.log(`[Migrate] Settings NO encontrados`);
  }
}

/**
 * Ejecutar migración completa
 */
export async function runMigration(): Promise<{
  members: { imported: number; skipped: number; errors: number };
  settings: { created: boolean; updated: boolean; errors: number };
}> {
  console.log(`\n========================================`);
  console.log(`[Migrate] INICIANDO MIGRACIÓN A POSTGRESQL`);
  console.log(`========================================\n`);

  if (!isSupabaseConfigured()) {
    throw new Error("Supabase no configurado. Set NEXT_PUBLIC_SUPABASE_URL y SUPABASE_SERVICE_ROLE_KEY");
  }

  const client = getSupabaseServiceClient();
  if (!client) {
    throw new Error("No se pudo crear cliente Supabase");
  }

  const membersResult = await migrateMembers(client);
  const settingsResult = await migrateSettings(client);

  console.log(`\n[Migration] VERIFICACIÓN FINAL`);
  await verifyMigration(client);

  console.log(`\n========================================`);
  console.log(`[Migrate] MIGRACIÓN COMPLETA`);
  console.log(`========================================\n`);

  return {
    members: membersResult,
    settings: settingsResult,
  };
}

// Si ejecutado directamente
if (require.main === module) {
  runMigration()
    .then(() => process.exit(0))
    .catch((e) => {
      console.error(`[Migrate] Error fatal:`, e);
      process.exit(1);
    });
}