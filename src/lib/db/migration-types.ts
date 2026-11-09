/**
 * Tipos para migración de datos
 */

export interface MigrationOptions {
  dryRun?: boolean;
  clearExisting?: boolean;
  updateExisting?: boolean;
}

export interface MigrationResult {
  total: number;
  imported: number;
  skipped: number;
  updated: number;
  errors: string[];
}

export interface MemberForMigration {
  slug: string;
  display_name: string;
  role: string;
  status?: string;
  quote?: string;
  is_leader?: boolean;
  discord?: string;
  avatar: { src: string; alt?: string; frame?: string };
  description?: string;
  tags?: string[];
  faction: "ARCHIVE" | "COMBAT" | "VOID";
  sort_order: number;
  card_size: "compact" | "wide";
  visible: boolean;
  theme: {
    primary: string;
    secondary: string;
    background: string;
    foreground: string;
    muted: string;
    border: string;
    glow: string;
    font: "sans" | "serif" | "mono" | "display";
    radius: string;
    texture: "none" | "scanlines" | "grid" | "static" | "vhs";
    effects: {
      scanlines: boolean;
      noise: boolean;
      glitch: boolean;
      glow: "none" | "soft" | "strong";
    };
    card: {
      accent: string;
      tag: string;
      tagClass: string;
      statusColor: string;
    };
  };
  links: Array<{
    kind: "discord" | "github" | "twitch" | "spotify" | "email" | "website" | "other";
    label: string;
    href: string;
    external?: boolean;
  }>;
  seo: {
    title: string;
    description: string;
    ogImage?: string;
  };
  integrations?: {
    lanyardUserId?: string;
    spotifyEmbedUrl?: string;
  };
  experience: {
    component: string;
    kind: "editorial" | "interactive" | "immersive";
    capabilities: string[];
  };
}

export interface SiteSettingsForMigration {
  siteName?: string;
  slogan?: string;
  description?: string;
  discord?: string;
}