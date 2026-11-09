/**
 * Validadores de esquema para API routes
 * Usa validación básica sin dependencias externas
 * Para validación avanzada, considerar Zod
 */

import type { MemberFaction, MemberCardSize, MemberLink, MemberSeo, MemberTheme, MemberLinkKind } from "@/types/member";

// ============================================================
// Tipos de validación
// ============================================================

export type MemberUpdateData = Partial<{
  displayName: string;
  role: string;
  status: string;
  quote: string;
  isLeader: boolean;
  discord: string;
  avatar: { src: string; alt?: string; frame?: string };
  description: string;
  tags: string[];
  faction: MemberFaction;
  order: number;
  cardSize: MemberCardSize;
  visible: boolean;
  theme: MemberTheme;
  links: MemberLink[];
  seo: MemberSeo;
}>;

export type MemberThemeData = Partial<MemberTheme>;

export type SiteSettingsData = {
  siteName?: string;
  slogan?: string;
  description?: string;
  discord?: string;
};

// ============================================================
// Validadores
// ============================================================

export function validateMemberUpdate(data: unknown): { valid: boolean; errors: string[]; values?: MemberUpdateData } {
  const errors: string[] = [];
  
  if (typeof data !== "object" || data === null) {
    return { valid: false, errors: ["Data must be an object"] };
  }

  const obj = data as Record<string, unknown>;
  const values: MemberUpdateData = {};

  // Campos de texto
  if (obj.displayName !== undefined) {
    if (typeof obj.displayName !== "string" || obj.displayName.trim().length === 0) {
      errors.push("displayName must be a non-empty string");
    } else if (obj.displayName.length > 255) {
      errors.push("displayName must be at most 255 characters");
    } else {
      values.displayName = obj.displayName.trim();
    }
  }

  if (obj.role !== undefined) {
    if (typeof obj.role !== "string" || obj.role.trim().length === 0) {
      errors.push("role must be a non-empty string");
    } else if (obj.role.length > 500) {
      errors.push("role must be at most 500 characters");
    } else {
      values.role = obj.role.trim();
    }
  }

  if (obj.status !== undefined) {
    if (typeof obj.status !== "string") {
      errors.push("status must be a string");
    } else if (obj.status.length > 500) {
      errors.push("status must be at most 500 characters");
    } else {
      values.status = obj.status.trim();
    }
  }

  if (obj.quote !== undefined) {
    if (typeof obj.quote !== "string") {
      errors.push("quote must be a string");
    } else if (obj.quote.length > 500) {
      errors.push("quote must be at most 500 characters");
    } else {
      values.quote = obj.quote.trim();
    }
  }

  // Campos booleanos
  if (obj.isLeader !== undefined) {
    if (typeof obj.isLeader !== "boolean") {
      errors.push("isLeader must be a boolean");
    } else {
      values.isLeader = obj.isLeader;
    }
  }

  if (obj.visible !== undefined) {
    if (typeof obj.visible !== "boolean") {
      errors.push("visible must be a boolean");
    } else {
      values.visible = obj.visible;
    }
  }

  if (obj.discord !== undefined) {
    const disc = obj.discord;
    if (disc !== null && typeof disc !== "string") {
      errors.push("discord must be a string or null");
    } else if (typeof disc === "string" && disc.length > 100) {
      errors.push("discord must be at most 100 characters");
    } else {
      values.discord = typeof disc === "string" ? disc : undefined;
    }
  }

  // Arrays
  if (obj.tags !== undefined) {
    if (!Array.isArray(obj.tags)) {
      errors.push("tags must be an array");
    } else if (obj.tags.some((t: unknown) => typeof t !== "string")) {
      errors.push("tags must contain only strings");
    } else if (obj.tags.length > 20) {
      errors.push("tags must have at most 20 items");
    } else {
      values.tags = obj.tags as string[];
    }
  }

  if (obj.links !== undefined) {
    if (!Array.isArray(obj.links)) {
      errors.push("links must be an array");
    } else {
      const validLinks: MemberLink[] = [];
      let linksValid = true;
      for (let i = 0; i < obj.links.length; i++) {
        const link = obj.links[i];
        if (typeof link !== "object" || link === null) {
          linksValid = false;
          break;
        }
        const l = link as Record<string, unknown>;
        if (typeof l.kind !== "string" || typeof l.label !== "string" || typeof l.href !== "string") {
          linksValid = false;
          break;
        }
        if (!["discord", "github", "twitch", "spotify", "email", "website", "other"].includes(l.kind as MemberLinkKind)) {
          linksValid = false;
          break;
        }
        validLinks.push({
          kind: l.kind as MemberLinkKind,
          label: l.label as string,
          href: l.href as string,
          external: typeof l.external === "boolean" ? l.external : undefined,
        });
      }
      if (!linksValid) {
        errors.push("links must contain valid link objects");
      } else if (validLinks.length > 20) {
        errors.push("links must have at most 20 items");
      } else {
        values.links = validLinks;
      }
    }
  }

  // Enums
  if (obj.faction !== undefined) {
    if (typeof obj.faction !== "string" || !["ARCHIVE", "COMBAT", "VOID"].includes(obj.faction)) {
      errors.push("faction must be ARCHIVE, COMBAT, or VOID");
    } else {
      values.faction = obj.faction as MemberFaction;
    }
  }

  if (obj.cardSize !== undefined) {
    if (typeof obj.cardSize !== "string" || !["compact", "wide"].includes(obj.cardSize)) {
      errors.push("cardSize must be compact or wide");
    } else {
      values.cardSize = obj.cardSize as MemberCardSize;
    }
  }

  // Números
  if (obj.order !== undefined) {
    if (typeof obj.order !== "number" || !Number.isInteger(obj.order) || obj.order < 0) {
      errors.push("order must be a non-negative integer");
    } else {
      values.order = obj.order;
    }
  }

  // Objetos JSONB
  if (obj.avatar !== undefined) {
    if (typeof obj.avatar !== "object" || obj.avatar === null) {
      errors.push("avatar must be an object");
    } else if (typeof (obj.avatar as Record<string, unknown>).src !== "string") {
      errors.push("avatar.src must be a string");
    } else {
      values.avatar = obj.avatar as { src: string; alt?: string; frame?: string };
    }
  }

  if (obj.theme !== undefined) {
    if (typeof obj.theme !== "object" || obj.theme === null) {
      errors.push("theme must be an object");
    } else {
      values.theme = obj.theme as MemberTheme;
    }
  }

  if (obj.seo !== undefined) {
    if (typeof obj.seo !== "object" || obj.seo === null) {
      errors.push("seo must be an object");
    } else if (typeof (obj.seo as Record<string, unknown>).title !== "string") {
      errors.push("seo.title must be a string");
    } else if (typeof (obj.seo as Record<string, unknown>).description !== "string") {
      errors.push("seo.description must be a string");
    } else {
      values.seo = obj.seo as MemberSeo;
    }
  }

  if (obj.description !== undefined) {
    if (typeof obj.description !== "string") {
      errors.push("description must be a string");
    } else if (obj.description.length > 10000) {
      errors.push("description must be at most 10000 characters");
    } else {
      values.description = obj.description;
    }
  }

  return {
    valid: errors.length === 0,
    errors,
    values: errors.length === 0 ? values : undefined,
  };
}

export function validateTheme(data: unknown): { valid: boolean; errors: string[]; values?: MemberThemeData } {
  const errors: string[] = [];
  
  if (typeof data !== "object" || data === null) {
    return { valid: false, errors: ["Theme data must be an object"] };
  }

  const obj = data as Record<string, unknown>;
  const values: MemberThemeData = {};

  // Colores (strings)
  const stringFields = ["primary", "secondary", "background", "foreground", "muted", "border", "glow", "radius"];
  for (const field of stringFields) {
    if (obj[field] !== undefined) {
      if (typeof obj[field] !== "string") {
        errors.push(`${field} must be a string`);
      } else {
        (values as Record<string, string>)[field] = obj[field] as string;
      }
    }
  }

  // Font enum
  if (obj.font !== undefined) {
    if (typeof obj.font !== "string" || !["sans", "serif", "mono", "display"].includes(obj.font)) {
      errors.push("font must be sans, serif, mono, or display");
    } else {
      values.font = obj.font as "sans" | "serif" | "mono" | "display";
    }
  }

  // Texture enum
  if (obj.texture !== undefined) {
    if (typeof obj.texture !== "string" || !["none", "scanlines", "grid", "static", "vhs"].includes(obj.texture)) {
      errors.push("texture must be none, scanlines, grid, static, or vhs");
    } else {
      values.texture = obj.texture as "none" | "scanlines" | "grid" | "static" | "vhs";
    }
  }

  // Glow enum
  if (obj.glow !== undefined) {
    if (typeof obj.glow !== "string" || !["none", "soft", "strong"].includes(obj.glow)) {
      errors.push("glow must be none, soft, or strong");
    } else {
      values.glow = obj.glow as "none" | "soft" | "strong";
    }
  }

  // Effects object
  if (obj.effects !== undefined) {
    if (typeof obj.effects !== "object" || obj.effects === null) {
      errors.push("effects must be an object");
    } else {
      const effects = obj.effects as Record<string, unknown>;
      const effectsObj: {
        scanlines: boolean;
        noise: boolean;
        glitch: boolean;
        glow: "none" | "soft" | "strong";
      } = {
        scanlines: false,
        noise: false,
        glitch: false,
        glow: "none",
      };
      
      if (effects.scanlines !== undefined) {
        if (typeof effects.scanlines !== "boolean") {
          errors.push("effects.scanlines must be a boolean");
        } else {
          effectsObj.scanlines = effects.scanlines as boolean;
        }
      }
      
      if (effects.noise !== undefined) {
        if (typeof effects.noise !== "boolean") {
          errors.push("effects.noise must be a boolean");
        } else {
          effectsObj.noise = effects.noise as boolean;
        }
      }
      
      if (effects.glitch !== undefined) {
        if (typeof effects.glitch !== "boolean") {
          errors.push("effects.glitch must be a boolean");
        } else {
          effectsObj.glitch = effects.glitch as boolean;
        }
      }
      
      if (effects.glow !== undefined) {
        if (typeof effects.glow !== "string" || !["none", "soft", "strong"].includes(effects.glow)) {
          errors.push("effects.glow must be none, soft, or strong");
        } else {
          effectsObj.glow = effects.glow as "none" | "soft" | "strong";
        }
      }
      
      values.effects = effectsObj;
    }
  }

  // Card object
  if (obj.card !== undefined) {
    if (typeof obj.card !== "object" || obj.card === null) {
      errors.push("card must be an object");
    } else {
      const card = obj.card as Record<string, unknown>;
      const cardObj: MemberTheme["card"] = {
        accent: "#ec4899",
        tag: "ARCHIVE",
        tagClass: "border-cyan-500/40 bg-cyan-500/10 text-cyan-300",
        statusColor: "#10b981",
      };
      
      if (card.accent !== undefined) {
        if (typeof card.accent !== "string") {
          errors.push("card.accent must be a string");
        } else {
          cardObj.accent = card.accent as string;
        }
      }
      
      if (card.tag !== undefined) {
        if (typeof card.tag !== "string") {
          errors.push("card.tag must be a string");
        } else {
          cardObj.tag = card.tag as string;
        }
      }
      
      if (card.tagClass !== undefined) {
        if (typeof card.tagClass !== "string") {
          errors.push("card.tagClass must be a string");
        } else {
          cardObj.tagClass = card.tagClass as string;
        }
      }
      
      if (card.statusColor !== undefined) {
        if (typeof card.statusColor !== "string") {
          errors.push("card.statusColor must be a string");
        } else {
          cardObj.statusColor = card.statusColor as string;
        }
      }
      
      values.card = cardObj;
    }
  }

  return {
    valid: errors.length === 0,
    errors,
    values: errors.length === 0 ? values : undefined,
  };
}

export function validateSiteSettings(data: unknown): { valid: boolean; errors: string[]; values?: SiteSettingsData } {
  const errors: string[] = [];
  
  if (typeof data !== "object" || data === null) {
    return { valid: false, errors: ["Settings data must be an object"] };
  }

  const obj = data as Record<string, unknown>;
  const values: SiteSettingsData = {};

  if (obj.siteName !== undefined) {
    if (typeof obj.siteName !== "string") {
      errors.push("siteName must be a string");
    } else if (obj.siteName.length > 255) {
      errors.push("siteName must be at most 255 characters");
    } else {
      values.siteName = obj.siteName.trim();
    }
  }

  if (obj.slogan !== undefined) {
    if (typeof obj.slogan !== "string") {
      errors.push("slogan must be a string");
    } else if (obj.slogan.length > 500) {
      errors.push("slogan must be at most 500 characters");
    } else {
      values.slogan = obj.slogan.trim();
    }
  }

  if (obj.description !== undefined) {
    if (typeof obj.description !== "string") {
      errors.push("description must be a string");
    } else if (obj.description.length > 5000) {
      errors.push("description must be at most 5000 characters");
    } else {
      values.description = obj.description.trim();
    }
  }

  if (obj.discord !== undefined) {
    if (typeof obj.discord !== "string") {
      errors.push("discord must be a string");
    } else if (obj.discord.length > 100) {
      errors.push("discord must be at most 100 characters");
    } else {
      values.discord = obj.discord.trim();
    }
  }

  return {
    valid: errors.length === 0,
    errors,
    values: errors.length === 0 ? values : undefined,
  };
}