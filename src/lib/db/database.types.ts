// Tipos para la base de datos Supabase
// Nota: Estos tipos coinciden con el esquema real de PostgreSQL
// pero para la API de Supabase usamos any para evitar errores de tipado complejos

export type Json = string | number | boolean | null | Json[] | { [key: string]: unknown };

export type MemberFaction = "ARCHIVE" | "COMBAT" | "VOID";
export type MemberCardSize = "compact" | "wide";
export type MemberThemeFont = "sans" | "serif" | "mono" | "display";
export type MemberThemeTexture = "none" | "scanlines" | "grid" | "static" | "vhs";
export type MemberThemeGlow = "none" | "soft" | "strong";

export interface MemberCardTheme {
  accent: string;
  tag: string;
  tagClass: string;
  statusColor: string;
}

export interface MemberThemeEffects {
  scanlines: boolean;
  noise: boolean;
  glitch: boolean;
  glow: MemberThemeGlow;
}

export interface MemberTheme {
  primary: string;
  secondary: string;
  background: string;
  foreground: string;
  muted: string;
  border: string;
  glow: string;
  font: MemberThemeFont;
  radius: string;
  texture: MemberThemeTexture;
  effects: MemberThemeEffects;
  card: MemberCardTheme;
}

export interface MemberAvatar {
  src: string;
  alt?: string;
  frame?: string;
}

export type MemberLinkKind = "discord" | "github" | "twitch" | "spotify" | "email" | "website" | "other";

export interface MemberLink {
  kind: MemberLinkKind;
  label: string;
  href: string;
  external?: boolean;
}

export interface MemberSeo {
  title: string;
  description: string;
  ogImage?: string;
}

export type MemberCapability =
  | "chat"
  | "lanyard"
  | "audio"
  | "projects"
  | "telemetry"
  | "minigame"
  | "cctv"
  | "crash"
  | "gallery"
  | "canvas"
  | "three"
  | "spotify"
  | "desktop"
  | "drag"
  | "reboot"
  | "editorial"
  | "store"
  | "clock"
  | "poem";

export interface MemberExperience {
  component: string;
  kind: "editorial" | "interactive" | "immersive";
  capabilities: MemberCapability[];
}

export interface MemberIntegrations {
  lanyardUserId?: string;
  spotifyEmbedUrl?: string;
}

// Row type from database
export interface MemberRow {
  id: number;
  slug: string;
  display_name: string;
  role: string;
  status: string | null;
  quote: string | null;
  is_leader: boolean | null;
  discord: string | null;
  avatar: MemberAvatar;
  description: string | null;
  tags: string[] | null;
  faction: MemberFaction;
  sort_order: number;
  card_size: MemberCardSize;
  visible: boolean;
  theme: MemberTheme;
  links: MemberLink[];
  seo: MemberSeo;
  integrations: MemberIntegrations | null;
  experience: MemberExperience;
  created_at: string | null;
  updated_at: string | null;
}

// Site settings row type
export interface SiteSettingsRow {
  id: number;
  settings: {
    siteName?: string;
    slogan?: string;
    description?: string;
    discord?: string;
  };
  created_at: string | null;
  updated_at: string | null;
}

// Use 'any' for Database type to avoid complex type errors with Supabase client
// eslint-disable-next-line @typescript-eslint/no-explicit-any
export type Database = any;