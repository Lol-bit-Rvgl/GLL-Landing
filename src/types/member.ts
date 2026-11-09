/**
 * Modelo de contenido y tema de GLL.
 *
 * La identidad plana (slug, displayName, role, status, quote, isLeader, discord)
 * se mantiene intacta para no romper los perfiles existentes, que leen esos
 * campos directamente. Los dominios nuevos (avatar, clasificación, roster,
 * tema, links, SEO, experiencia) se añaden como capas independientes.
 */

export type MemberFaction = "ARCHIVE" | "COMBAT" | "VOID" | "SOLAR" | "LUNAR" | "NEBULA" | "CHRONO";

export type MemberCardSize = "compact" | "wide" | "NORMAL";

export type MemberThemeFont = "sans" | "serif" | "mono" | "display";

export type MemberThemeTexture =
  | "none"
  | "scanlines"
  | "grid"
  | "static"
  | "vhs";

export type MemberThemeGlow = "none" | "soft" | "strong";

/**
 * Tokens que consumen las tarjetas del roster.
 * Se mantienen separados del resto del tema para que la home no dependa de
 * detalles visuales que todavía no usa.
 */
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

/**
 * Contrato de tema por miembro.
 * No impone una plantilla visual: solo declara los valores que una vista puede
 * leer para construir su propia dirección artística.
 */
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

export type MemberLinkKind =
  | "discord"
  | "github"
  | "twitch"
  | "spotify"
  | "email"
  | "website"
  | "other";

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

/**
 * Documentación estructurada de la experiencia individual.
 * No se consume todavía en la UI; sirve para planificar el rediseño de perfiles
 * sin perder de vista qué capacidades debe conservar cada uno.
 */
export interface MemberExperience {
  component: string;
  kind: "editorial" | "interactive" | "immersive";
  capabilities: MemberCapability[];
}

export interface MemberIntegrations {
  lanyardUserId?: string;
  spotifyEmbedUrl?: string;
}

export interface Member {
  /* ── Identidad (compatible con las vistas actuales) ─────────────── */
  slug: string;
  displayName: string;
  name?: string;  // Alias para displayName en el nuevo esquema
  role: string;
  status?: string;
  quote?: string;
  isLeader?: boolean;
  discord?: string;

  /* ── Perfil ─────────────────────────────────────────────────────── */
  avatar: MemberAvatar;
  description?: string;
  bio?: string;  // Alias para description en el nuevo esquema
  tags?: string[];
  social_links?: { [key: string]: string };  // Discord, GitHub, Twitter, etc.

  /* ── Clasificación ──────────────────────────────────────────────── */
  faction: MemberFaction;

  /* ── Roster ─────────────────────────────────────────────────────── */
  order: number;
  cardSize: MemberCardSize;
  visible: boolean;

  /* ── Tema ───────────────────────────────────────────────────────── */
  theme: MemberTheme;

  /* ── Enlaces, SEO e integraciones ───────────────────────────────── */
  links: MemberLink[];
  seo: MemberSeo;
  integrations?: MemberIntegrations;

  /* ── Experiencia individual (documentación) ─────────────────────── */
  experience: MemberExperience;
}
