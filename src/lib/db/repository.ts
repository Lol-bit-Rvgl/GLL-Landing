/**
 * MEMBER REPOSITORY - Capa de acceso a datos
 *
 * Esta capa abstrae el origen de datos para permitir migraciones futuras.
 *
 * Environment Selection Strategy:
 * - Development (NODE_ENV=development): JSON permitido como fallback
 * - Preview (VERCEL && !VERCEL_ENV=production): PostgreSQL de pruebas recomendado
 * - Production (VERCEL_ENV=production): PostgreSQL OBLIGATORIO, error si no configurado
 *
 * La detección automática de PostgreSQL se hace verificando:
 * - POSTGRES_URL (pooler connection string)
 * - NEXT_PUBLIC_SUPABASE_URL (Supabase project URL)
 */

import type { Member, MemberFaction, MemberLink, MemberSeo } from "@/types/member";
import type { MemberIntegrations } from "@/types/member";
import { members as staticMembers } from "@/data/members";
import { writeFile, readFile } from "fs/promises";
import { join } from "path";

// ============================================================
// CONFIGURACIÓN DE ENTORNO (lazy evaluation)
// ============================================================

function checkPostgresConfig(): { isProduction: boolean; hasPostgresConfig: boolean } {
  const isProduction = process.env.VERCEL_ENV === "production";
  const hasPostgresConfig = Boolean(
    process.env.POSTGRES_URL ||
    process.env.NEXT_PUBLIC_SUPABASE_URL
  );
  return { isProduction, hasPostgresConfig };
}

// ============================================================
// CONSTANTES Y UTILIDADES COMPARTIDAS
// ============================================================

const MEMBERS_JSON_PATH = join(process.cwd(), "data", "members.json");

const MEMBER_ALIASES: Record<string, string> = {
  "mangle-drake": "mangle",
  darth: "darth10",
};

function resolveMemberSlug(slug: string): string {
  return MEMBER_ALIASES[slug] ?? slug;
}

function getDefaultTheme(): Member["theme"] {
  return {
    primary: "#ec4899",
    secondary: "#f59e0b",
    background: "#050507",
    foreground: "#e7e4de",
    muted: "#a1a1aa",
    border: "rgba(255, 255, 255, 0.08)",
    glow: "#ec4899",
    font: "mono" as const,
    radius: "0.5rem",
    texture: "none" as const,
    effects: {
      scanlines: false,
      noise: false,
      glitch: false,
      glow: "none" as const,
    },
    card: {
      accent: "#ec4899",
      tag: "ARCHIVE",
      tagClass: "border-cyan-500/40 bg-cyan-500/10 text-cyan-300",
      statusColor: "#10b981",
    },
  };
}

// ============================================================
// JSON REPOSITORY (Desarrollo/Local)
// ============================================================

class JSONRepository {
  private async loadMembers(): Promise<Member[]> {
    try {
      const data = await readFile(MEMBERS_JSON_PATH, "utf-8");
      const parsed = JSON.parse(data);
      return parsed.map((m: Member) => ({
        ...m,
        theme: m.theme || getDefaultTheme(),
      }));
    } catch {
      return staticMembers.map((m) => ({
        ...m,
        theme: m.theme || getDefaultTheme(),
      }));
    }
  }

  private async saveMembers(members: Member[]): Promise<void> {
    const data = JSON.stringify(members, null, 2);
    await writeFile(MEMBERS_JSON_PATH, data, "utf-8");
  }

  private async initializeIfNeeded(): Promise<void> {
    try {
      await readFile(MEMBERS_JSON_PATH, "utf-8");
    } catch {
      await this.saveMembers(staticMembers);
    }
  }

  async getAll(): Promise<Member[]> {
    const members = await this.loadMembers();
    return members.filter((m) => m.visible !== false);
  }

  async getBySlug(slug: string): Promise<Member | null> {
    const resolvedSlug = resolveMemberSlug(slug);
    const members = await this.loadMembers();
    return members.find((m) => m.slug === resolvedSlug) || null;
  }

  async create(data: Omit<Member, "slug"> & { slug: string }): Promise<Member> {
    await this.initializeIfNeeded();
    const members = await this.loadMembers();
    const maxOrder = Math.max(...members.map((m) => m.order), 0);

    const newMember: Member = {
      ...data,
      order: maxOrder + 1,
      visible: true,
      links: [],
      seo: {
        title: `${data.displayName} // GLL`,
        description: "Member of GLL",
      },
      theme: data.theme || getDefaultTheme(),
      experience: data.experience || {
        component: "default",
        kind: "interactive",
        capabilities: [],
      },
    };

    if (members.some((m) => m.slug === newMember.slug)) {
      throw new Error("DUPLICATE_SLUG");
    }

    const updated = [...members, newMember];
    await this.saveMembers(updated);
    return newMember;
  }

  async update(slug: string, data: Partial<Member>): Promise<Member | null> {
    await this.initializeIfNeeded();
    const members = await this.loadMembers();
    const index = members.findIndex((m) => m.slug === slug);

    if (index === -1) {
      return null;
    }

    const protectedFields = ["experience", "slug"];
    const safeData = { ...data };
    for (const field of protectedFields) {
      delete (safeData as Record<string, unknown>)[field];
    }

    members[index] = { ...members[index], ...safeData };
    await this.saveMembers(members);
    return members[index];
  }

  async delete(slug: string): Promise<boolean> {
    await this.initializeIfNeeded();
    const members = await this.loadMembers();
    const index = members.findIndex((m) => m.slug === slug);

    if (index === -1) {
      return false;
    }

    members[index].visible = false;
    await this.saveMembers(members);
    return true;
  }

  async restore(slug: string): Promise<boolean> {
    const member = await this.getBySlug(slug);
    if (!member) return false;
    return this.update(slug, { visible: true })
      .then(() => true)
      .catch(() => false);
  }

  async getStats(): Promise<{
    total: number;
    visible: number;
    hidden: number;
    factions: Record<MemberFaction, number>;
  }> {
    const members = await this.loadMembers();

    return {
      total: members.length,
      visible: members.filter((m) => m.visible !== false).length,
      hidden: members.filter((m) => m.visible === false).length,
      factions: {
        ARCHIVE: members.filter((m) => m.faction === "ARCHIVE").length,
        COMBAT: members.filter((m) => m.faction === "COMBAT").length,
        VOID: members.filter((m) => m.faction === "VOID").length,
        SOLAR: members.filter((m) => m.faction === "SOLAR").length,
        LUNAR: members.filter((m) => m.faction === "LUNAR").length,
        NEBULA: members.filter((m) => m.faction === "NEBULA").length,
        CHRONO: members.filter((m) => m.faction === "CHRONO").length,
      },
    };
  }

  async search(query: string): Promise<Member[]> {
    const q = query.trim().toLowerCase();
    const members = await this.loadMembers();
    return members.filter(
      (m) =>
        m.visible !== false &&
        `${m.displayName} ${m.role}`.toLowerCase().includes(q),
    );
  }

  getDefaultTheme() {
    return getDefaultTheme();
  }

  async saveTheme(slug: string, theme: Member["theme"]): Promise<boolean> {
    const member = await this.getBySlug(slug);
    if (!member) return false;
    return this.update(slug, { theme })
      .then(() => true)
      .catch(() => false);
  }
}

// Singleton JSON repo
const jsonRepo = new JSONRepository();

// ============================================================
// POSTGRESQL REPOSITORY (Producción)
// ============================================================

class PostgreSQLRepository {
  private client: any = null;

  /**
   * Lazy initialization - verifica PostgreSQL sólo cuando se recibe una petición
   */
  private ensureClient() {
    if (this.client) return this.client;

    const { isProduction, hasPostgresConfig } = checkPostgresConfig();

    // En producción, PostgreSQL es obligatorio - verificación lazy
    if (isProduction && !hasPostgresConfig) {
      throw new Error(
        "[MemberRepository] ERROR: PostgreSQL es obligatorio en producción. " +
        "Configurar NEXT_PUBLIC_SUPABASE_URL o SUPABASE_SERVICE_ROLE_KEY."
      );
    }

    if (!hasPostgresConfig) {
      throw new Error("Supabase no configurado");
    }

    const { getSupabaseServiceClient } = require("./supabase");
    const client = getSupabaseServiceClient();
    if (!client) {
      throw new Error("No se pudo crear cliente Supabase");
    }
    this.client = client;
    return this.client;
  }

  private toDbMember(member: Partial<Member> & { slug: string }): Record<string, any> {
    const socialLinks: Record<string, any> = {
      discord: member.discord,
      ...(member.links && member.links.length > 0 ? { links: member.links } : {}),
      ...(member.integrations ? { integrations: member.integrations } : {}),
    };

    return {
      slug: member.slug,
      name: member.displayName,
      role: member.role,
      bio: member.description,
      avatar: member.avatar,
      faction: member.faction,
      social_links: socialLinks,
      theme: member.theme,
      experience: member.experience,
      visible: member.visible !== false,
    };
  }

  private fromDbRow(row: any): Member {
    const socialLinks = row.social_links || {};

    return {
      slug: row.slug,
      displayName: row.name || row.display_name || row.slug,
      role: row.role,
      status: row.status || undefined,
      quote: socialLinks.quote,
      isLeader: socialLinks.is_leader,
      discord: socialLinks.discord,
      avatar: row.avatar,
      description: row.bio || row.description || undefined,
      tags: row.tags || undefined,
      faction: row.faction,
      order: row.sort_order,
      cardSize: row.card_size,
      visible: row.visible,
      theme: row.theme,
      links: socialLinks.links || [],
      seo: row.seo || { title: row.name || row.slug, description: "Member of GLL" },
      integrations: socialLinks.integrations || undefined,
      experience: row.experience || { component: "default", kind: "interactive", capabilities: [] },
    };
  }

  async getAll(): Promise<Member[]> {
    try {
      const client = this.ensureClient();
      const { data, error } = await client
        .from("members")
        .select("*")
        .eq("visible", true)
        .order("id", { ascending: true });

      if (error) {
        console.error("[PostgreSQL] Error cargando miembros:", error.message);
        return [];
      }

      return (data || []).map((row: { faction: MemberFaction; visible: boolean }) => this.fromDbRow(row));
    } catch (e) {
      console.error("[PostgreSQL] Error de conexión:", e);
      return [];
    }
  }

  async getBySlug(slug: string): Promise<Member | null> {
    try {
      const client = this.ensureClient();
      const { data, error } = await client
        .from("members")
        .select("*")
        .eq("slug", slug)
        .single();

      if (error) return null;
      return data ? this.fromDbRow(data) : null;
    } catch (e) {
      console.error("[PostgreSQL] Error obteniendo miembro:", e);
      return null;
    }
  }

  async create(data: Omit<Member, "slug"> & { slug: string }): Promise<Member> {
    const client = this.ensureClient();
    const { data: created, error } = await client
      .from("members")
      .insert(this.toDbMember(data))
      .select("*")
      .single();

    if (error) throw new Error(`Error creando miembro: ${error.message}`);
    if (!created) throw new Error("Sin datos devuelto");
    return this.fromDbRow(created);
  }

  async update(slug: string, data: Partial<Member>): Promise<Member | null> {
    const client = this.ensureClient();

    const updateData: Record<string, any> = { ...data, updated_at: new Date().toISOString() };
    delete updateData.slug;
    delete updateData.experience;

    if (updateData.displayName) {
      updateData.name = updateData.displayName;
      delete updateData.displayName;
    }

    if (updateData.cardSize !== undefined) {
      updateData.card_size = updateData.cardSize;
      delete updateData.cardSize;
    }

    if (updateData.sortOrder !== undefined) {
      updateData.sort_order = updateData.sortOrder;
      delete updateData.sortOrder;
    }

    // Manejar social_links como JSONB
    if (updateData.discord !== undefined || updateData.links !== undefined || updateData.integrations !== undefined) {
      const existing = await this.getBySlug(slug);
      const existingSocialLinks = existing?.social_links || {};

      updateData.social_links = {
        ...existingSocialLinks,
        ...(updateData.discord !== undefined ? { discord: updateData.discord } : {}),
        ...(updateData.links !== undefined ? { links: updateData.links } : {}),
        ...(updateData.integrations !== undefined ? { integrations: updateData.integrations } : {}),
      };

      delete updateData.discord;
      delete updateData.links;
      delete updateData.integrations;
    }

    if (updateData.theme !== undefined || updateData.seo !== undefined) {
      const existing = await this.getBySlug(slug);
      const existingSocialLinks = existing?.social_links || {};

      updateData.social_links = {
        ...existingSocialLinks,
        ...(updateData.theme !== undefined ? { theme: updateData.theme } : {}),
        ...(updateData.seo !== undefined ? { seo: updateData.seo } : {}),
      };

      delete updateData.theme;
      delete updateData.seo;
    }

    const { data: updated, error } = await client
      .from("members")
      .update(updateData)
      .eq("slug", slug)
      .select("*")
      .single();

    if (error) {
      console.error(`[PostgreSQL] Error actualizando ${slug}:`, error.message);
      return null;
    }

    return updated ? this.fromDbRow(updated) : null;
  }

  async delete(slug: string): Promise<boolean> {
    try {
      const client = this.ensureClient();
      const { error } = await client
        .from("members")
        .update({ visible: false, updated_at: new Date().toISOString() })
        .eq("slug", slug);
      return !error;
    } catch (e) {
      console.error("[PostgreSQL] Error:", e);
      return false;
    }
  }

  async restore(slug: string): Promise<boolean> {
    return this.update(slug, { visible: true }).then((m) => !!m);
  }

  async getStats(): Promise<{
    total: number;
    visible: number;
    hidden: number;
    factions: Record<MemberFaction, number>;
  }> {
    try {
      const client = this.ensureClient();
      const { data, error } = await client
        .from("members")
        .select("faction, visible");

      if (error) {
        return { total: 0, visible: 0, hidden: 0, factions: { ARCHIVE: 0, COMBAT: 0, VOID: 0, SOLAR: 0, LUNAR: 0, NEBULA: 0, CHRONO: 0 } };
      }

      const members = data || [];
      const factions = { ARCHIVE: 0, COMBAT: 0, VOID: 0, SOLAR: 0, LUNAR: 0, NEBULA: 0, CHRONO: 0 } as Record<MemberFaction, number>;

      members.forEach((m: { faction: MemberFaction }) => {
        if (factions[m.faction] !== undefined) {
          factions[m.faction]++;
        }
      });

      return {
        total: members.length,
        visible: members.filter((m: { visible: boolean }) => m.visible).length,
        hidden: members.filter((m: { visible: boolean }) => !m.visible).length,
        factions,
      };
    } catch (e) {
      return { total: 0, visible: 0, hidden: 0, factions: { ARCHIVE: 0, COMBAT: 0, VOID: 0, SOLAR: 0, LUNAR: 0, NEBULA: 0, CHRONO: 0 } };
    }
  }

  async search(query: string): Promise<Member[]> {
    try {
      const client = this.ensureClient();
      const { data, error } = await client
        .from("members")
        .select("*")
        .eq("visible", true)
        .ilike("name", `%${query}%`);

      if (error) return [];
      return (data || []).map((row: Record<string, unknown>) => this.fromDbRow(row));
    } catch (e) {
      console.error("[PostgreSQL] Error:", e);
      return [];
    }
  }

  getDefaultTheme(): Member["theme"] {
    return getDefaultTheme();
  }

  async saveTheme(slug: string, theme: Member["theme"]): Promise<boolean> {
    return this.update(slug, { theme }).then((m) => !!m);
  }

  async getSettings(): Promise<{ siteName?: string; slogan?: string; description?: string; discord?: string }> {
    try {
      const client = this.ensureClient();
      const { data, error } = await client
        .from("site_settings")
        .select("value")
        .eq("key", "main_config")
        .single();

      if (error) return {};
      return (data?.value as any) || {};
    } catch (e) {
      console.error("[PostgreSQL] Error obteniendo settings:", e);
      return {};
    }
  }

  async saveSettings(settings: { siteName?: string; slogan?: string; description?: string; discord?: string }): Promise<boolean> {
    try {
      const client = this.ensureClient();

      const { data: existing } = await client
        .from("site_settings")
        .select("key")
        .eq("key", "main_config")
        .single();

      if (existing?.key) {
        const { error } = await client
          .from("site_settings")
          .update({ value: settings })
          .eq("key", "main_config");
        return !error;
      } else {
        const { error } = await client
          .from("site_settings")
          .insert({ key: "main_config", value: settings });
        return !error;
      }
    } catch (e) {
      console.error("[PostgreSQL] Error guardando settings:", e);
      return false;
    }
  }
}

const postgresRepo = new PostgreSQLRepository();

// ============================================================
// REPOSITORIO PRINCIPAL
// ============================================================

export class MemberRepository {
  private usePostgres: boolean;

  constructor() {
    const config = checkPostgresConfig();
    const isDevelopment = process.env.NODE_ENV === "development";
    const isPostgresRequired = config.isProduction;
    this.usePostgres = config.hasPostgresConfig || (!isPostgresRequired && isDevelopment);
  }

  async getAll(): Promise<Member[]> {
    return this.usePostgres ? postgresRepo.getAll() : jsonRepo.getAll();
  }

  async getBySlug(slug: string): Promise<Member | null> {
    return this.usePostgres ? postgresRepo.getBySlug(slug) : jsonRepo.getBySlug(slug);
  }

  async create(data: Omit<Member, "slug"> & { slug: string }): Promise<Member> {
    return this.usePostgres ? postgresRepo.create(data) : jsonRepo.create(data);
  }

  async update(slug: string, data: Partial<Member>): Promise<Member | null> {
    return this.usePostgres ? postgresRepo.update(slug, data) : jsonRepo.update(slug, data);
  }

  async delete(slug: string): Promise<boolean> {
    return this.usePostgres ? postgresRepo.delete(slug) : jsonRepo.delete(slug);
  }

  async restore(slug: string): Promise<boolean> {
    return this.usePostgres ? postgresRepo.restore(slug) : jsonRepo.restore(slug);
  }

  async getStats(): Promise<{
    total: number;
    visible: number;
    hidden: number;
    factions: Record<MemberFaction, number>;
  }> {
    return this.usePostgres ? postgresRepo.getStats() : jsonRepo.getStats();
  }

  async search(query: string): Promise<Member[]> {
    return this.usePostgres ? postgresRepo.search(query) : jsonRepo.search(query);
  }

  getDefaultTheme(): Member["theme"] {
    return postgresRepo.getDefaultTheme();
  }

  async saveTheme(slug: string, theme: Member["theme"]): Promise<boolean> {
    return this.usePostgres ? postgresRepo.saveTheme(slug, theme) : jsonRepo.saveTheme(slug, theme);
  }

  async getSettings(): Promise<{ siteName?: string; slogan?: string; description?: string; discord?: string }> {
    return this.usePostgres ? postgresRepo.getSettings() : {};
  }

  async saveSettings(settings: { siteName?: string; slogan?: string; description?: string; discord?: string }): Promise<boolean> {
    return this.usePostgres ? postgresRepo.saveSettings(settings) : false;
  }
}

// Instancia singleton
export const memberRepository = new MemberRepository();