/**
 * PostgreSQL Member Repository
 *
 * Implementation using Supabase client for PostgreSQL connection.
 * Compatible with Vercel serverless functions via Transaction Pooler.
 */

import type { Member, MemberFaction } from "@/types/member";
import { getSupabaseServiceClient, isSupabaseConfigured } from "./supabase";

/**
 * Mapea el tipo interno al formato de base de datos
 */
function toDbMember(member: Partial<Member> & { slug: string }): Record<string, any> {
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

/**
 * Convierte de formato de BD a modelo interno
 */
function fromDbRow(row: any): Member {
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

export class PostgreSQLMemberRepository {
  private client: any = null;

  private ensureClient() {
    if (this.client) return this.client;
    if (!isSupabaseConfigured()) {
      throw new Error("Supabase no configurado");
    }
    const client = getSupabaseServiceClient();
    if (!client) {
      throw new Error("No se pudo crear cliente Supabase");
    }
    this.client = client;
    return this.client;
  }

  /**
   * Cargar todos los miembros visibles
   */
  async getAll(): Promise<Member[]> {
    try {
      const client = this.ensureClient();
      const { data, error } = await client
        .from("members")
        .select("*")
        .eq("visible", true)
        .order("sort_order", { ascending: true });

      if (error) {
        console.error("[PostgreSQL] Error cargando miembros:", error.message);
        return [];
      }

      return (data || []).map(fromDbRow);
    } catch (e) {
      console.error("[PostgreSQL] Error de conexión:", e);
      return [];
    }
  }

  /**
   * Obtener miembro por slug
   */
  async getBySlug(slug: string): Promise<Member | null> {
    try {
      const client = this.ensureClient();
      const { data, error } = await client
        .from("members")
        .select("*")
        .eq("slug", slug)
        .single();

      if (error) return null;
      return data ? fromDbRow(data) : null;
    } catch (e) {
      console.error("[PostgreSQL] Error obteniendo miembro:", e);
      return null;
    }
  }

  /**
   * Crear nuevo miembro
   */
  async create(data: Omit<Member, "slug"> & { slug: string }): Promise<Member> {
    const client = this.ensureClient();
    const { data: created, error } = await client
      .from("members")
      .insert(toDbMember(data))
      .select("*")
      .single();

    if (error) throw new Error(`Error creando miembro: ${error.message}`);
    if (!created) throw new Error("Sin datos devuelto");
    return fromDbRow(created);
  }

  /**
   * Actualizar miembro existente
   */
  async update(slug: string, data: Partial<Member>): Promise<Member | null> {
    const client = this.ensureClient();

    const updateData: Record<string, any> = { ...data, updated_at: new Date().toISOString() };
    delete updateData.slug;
    delete updateData.experience; // Protegido: no se puede modificar

    if (updateData.displayName) {
      updateData.name = updateData.displayName;
      delete updateData.displayName;
    }

    if (updateData.description) {
      updateData.bio = updateData.description;
      delete updateData.description;
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

    return updated ? fromDbRow(updated) : null;
  }

  /**
   * Eliminar miembro (soft delete)
   */
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

  /**
   * Restaurar miembro eliminado
   */
  async restore(slug: string): Promise<boolean> {
    return this.update(slug, { visible: true }).then((m) => !!m);
  }

  /**
   * Obtener estadísticas del roster
   */
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
        visible: members.filter((m: any) => m.visible).length,
        hidden: members.filter((m: any) => !m.visible).length,
        factions,
      };
    } catch (e) {
      return { total: 0, visible: 0, hidden: 0, factions: { ARCHIVE: 0, COMBAT: 0, VOID: 0, SOLAR: 0, LUNAR: 0, NEBULA: 0, CHRONO: 0 } };
    }
  }

  /**
   * Buscar miembros por nombre
   */
  async search(query: string): Promise<Member[]> {
    try {
      const client = this.ensureClient();
      const { data, error } = await client
        .from("members")
        .select("*")
        .eq("visible", true)
        .ilike("name", `%${query}%`);

      if (error) return [];
      return (data || []).map(fromDbRow);
    } catch (e) {
      console.error("[PostgreSQL] Error:", e);
      return [];
    }
  }

  getDefaultTheme(): Member["theme"] {
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

  /**
   * Guardar tema de miembro
   */
  async saveTheme(slug: string, theme: Member["theme"]): Promise<boolean> {
    return this.update(slug, { theme }).then((m) => !!m);
  }

  /**
   * Guardar configuraciones del sitio
   */
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

  /**
   * Guardar configuraciones del sitio
   */
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

// Instancia singleton
export const postgresqlRepository = new PostgreSQLMemberRepository();