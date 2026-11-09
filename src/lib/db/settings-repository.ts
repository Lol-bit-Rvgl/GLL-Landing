/**
 * Site Settings Repository
 *
 * Maneja la configuración global del sitio en PostgreSQL.
 */

import { getSupabaseServiceClient, isSupabaseConfigured } from "./supabase";

export interface SiteSettingsData {
  siteName?: string;
  slogan?: string;
  description?: string;
  discord?: string;
}

export class SettingsRepository {
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
   * Obtener configuración del sitio
   */
  async getSettings(): Promise<SiteSettingsData> {
    try {
      const client = this.ensureClient();
      const { data, error } = await client
        .from("site_settings")
        .select("value")
        .eq("key", "main_config")
        .single();

      if (error) {
        console.error("[Settings] Error obteniendo configuración:", error.message);
        return {};
      }

      return data?.value || {};
    } catch (e) {
      console.error("[Settings] Error obteniendo configuración:", e);
      return {};
    }
  }

  /**
   * Guardar configuración del sitio
   */
  async saveSettings(settings: SiteSettingsData): Promise<boolean> {
    try {
      const client = this.ensureClient();

      // Verificar si existe main_config
      const { data: existing } = await client
        .from("site_settings")
        .select("key")
        .eq("key", "main_config")
        .single();

      if (existing?.key) {
        // Actualizar existente
        const { error } = await client
          .from("site_settings")
          .update({ value: settings })
          .eq("key", "main_config");

        if (error) {
          console.error("[Settings] Error guardando configuración:", error.message);
          return false;
        }
      } else {
        // Crear nuevo registro
        const { error } = await client
          .from("site_settings")
          .insert({ key: "main_config", value: settings });

        if (error) {
          console.error("[Settings] Error creando configuración:", error.message);
          return false;
        }
      }

      return true;
    } catch (e) {
      console.error("[Settings] Error guardando configuración:", e);
      return false;
    }
  }

  /**
   * Actualizar campo específico
   */
  async updateSetting(key: keyof SiteSettingsData, value: string): Promise<boolean> {
    try {
      const client = this.ensureClient();

      // Obtener configuración actual
      const { data: existing } = await client
        .from("site_settings")
        .select("key, value")
        .eq("key", "main_config")
        .single();

      if (existing?.key) {
        const currentSettings = existing.value || {};
        const { error } = await client
          .from("site_settings")
          .update({ value: { ...currentSettings, [key]: value } })
          .eq("key", "main_config");

        if (error) {
          console.error(`[Settings] Error actualizando ${key}:`, error.message);
          return false;
        }
      } else {
        const { error } = await client
          .from("site_settings")
          .insert({ key: "main_config", value: { [key]: value } });

        if (error) {
          console.error(`[Settings] Error creando setting ${key}:`, error.message);
          return false;
        }
      }

      return true;
    } catch (e) {
      console.error("[Settings] Error actualizando setting:", e);
      return false;
    }
  }
}

// Instancia singleton
export const settingsRepository = new SettingsRepository();