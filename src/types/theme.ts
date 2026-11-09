import type { MemberFaction } from "./member";

/**
 * Tokens globales del sistema visual GLL.
 * Estos se usan en todas las vistas para mantener coherencia.
 */
export interface GllTokens {
  /* Background system */
  background: string;
  surface: string;
  surfaceElevated: string;
  border: string;
  borderSubtle: string;

  /* Text */
  text: string;
  textMuted: string;
  textStrong: string;

  /* Spacing */
  spacing: {
    xs: string;
    sm: string;
    md: string;
    lg: string;
    xl: string;
    "2xl": string;
  };

  /* Shadows */
  shadow: {
    sm: string;
    md: string;
    lg: string;
    glow: string;
  };

  /* Transitions */
  transition: {
    fast: string;
    normal: string;
    slow: string;
  };

  /* Radius */
  radius: {
    sm: string;
    md: string;
    lg: string;
    full: string;
  };
}

/**
 * Colores de facción para identificar visualmente el roster.
 */
export interface FactionColors {
  archive: string;
  combat: string;
  void: string;
}

/**
 * Tokens por facción - para usar en filtros y badges.
 */
export const FactionTheme: Record<MemberFaction, { label: string; css: string }> = {
  ARCHIVE: {
    label: "ARCHIVE",
    css: "bg-cyan-500/10 border-cyan-500/40 text-cyan-300",
  },
  COMBAT: {
    label: "COMBAT",
    css: "bg-pink-500/10 border-pink-500/40 text-pink-300",
  },
  VOID: {
    label: "VOID",
    css: "bg-red-500/10 border-red-500/40 text-red-300",
  },
  SOLAR: {
    label: "SOLAR",
    css: "bg-amber-500/10 border-amber-500/40 text-amber-300",
  },
  LUNAR: {
    label: "LUNAR",
    css: "bg-blue-500/10 border-blue-500/40 text-blue-300",
  },
  NEBULA: {
    label: "NEBULA",
    css: "bg-purple-500/10 border-purple-500/40 text-purple-300",
  },
  CHRONO: {
    label: "CHRONO",
    css: "bg-green-500/10 border-green-500/40 text-green-300",
  },
};

/**
 * Theme object global.
 */
export const gllTokens: GllTokens = {
  background: "#050507",
  surface: "rgba(255, 255, 255, 0.03)",
  surfaceElevated: "rgba(255, 255, 255, 0.06)",
  border: "rgba(255, 255, 255, 0.08)",
  borderSubtle: "rgba(255, 255, 255, 0.12)",

  text: "#e7e4de",
  textMuted: "#a1a1aa",
  textStrong: "#f8fafc",

  spacing: {
    xs: "0.25rem",
    sm: "0.5rem",
    md: "1rem",
    lg: "1.5rem",
    xl: "2rem",
    "2xl": "3rem",
  },

  shadow: {
    sm: "0 1px 2px rgba(0, 0, 0, 0.3)",
    md: "0 4px 6px rgba(0, 0, 0, 0.4), 0 2px 4px rgba(0, 0, 0, 0.2)",
    lg: "0 8px 12px rgba(0, 0, 0, 0.5), 0 4px 6px rgba(0, 0, 0, 0.3)",
    glow: "0 0 20px",
  },

  transition: {
    fast: "150ms ease-in-out",
    normal: "250ms ease-in-out",
    slow: "400ms ease-in-out",
  },

  radius: {
    sm: "0.25rem",
    md: "0.5rem",
    lg: "1rem",
    full: "9999px",
  },
};

/**
 * Función helper para obtener el CSS de facción basado en MemberFaction.
 */
export function factionBadgeClass(faction: MemberFaction): string {
  return FactionTheme[faction].css;
}

/**
 * Colores primarios de GLL (del tema original).
 */
export const GLL_PRIMARY = {
  pink: "#ec4899",
  amber: "#f59e0b",
  cyan: "#38bdf8",
  red: "#dc2626",
  emerald: "#10b981",
};