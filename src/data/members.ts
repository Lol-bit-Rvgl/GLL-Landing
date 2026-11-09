import type { Member, MemberFaction } from "@/types/member";

/**
 * Fuente única de contenido del roster.
 *
 * Aquí viven identidad, clasificación, avatar, Discord, orden, tamaño de card,
 * tema, enlaces, SEO, integraciones y la documentación de la experiencia
 * individual. La home y las vistas de perfil consumen este archivo en lugar de
 * mantener mapas paralelos.
 */
export const members: Member[] = [
  {
    slug: "lolbit",
    displayName: "— Lolbit",
    role: "Autonomous Runtime // Ethical Dev",
    status: "SYS.ONLINE // PORT 0x7F",
    quote: "SYSTEM ONLINE. Playtime is over.",
    isLeader: true,
    discord: "imaginebeinglolbit",
    avatar: { src: "/images/members/lolbit/avatars.jpeg", alt: "Lolbit" },
    description:
      "Runtime autónomo del archivo GLL. Dev ético, terminal viva y nodo maestro de la señal.",
    tags: ["dev", "terminal", "liquid-glass", "founder"],
    faction: "ARCHIVE",
    order: 1,
    cardSize: "wide",
    visible: true,
    theme: {
      primary: "#f97316",
      secondary: "#fbbf24",
      background: "#050507",
      foreground: "#fef3c7",
      muted: "#a16207",
      border: "rgba(245, 158, 11, 0.2)",
      glow: "#f59e0b",
      font: "mono",
      radius: "1rem",
      texture: "scanlines",
      effects: { scanlines: true, noise: false, glitch: true, glow: "strong" },
      card: {
        accent: "#f97316",
        tag: "[ DEV // PORT 0x7F ]",
        tagClass: "border-[#f97316]/40 text-[#fb923c] bg-[#f97316]/10",
        statusColor: "text-[#f97316]",
      },
    },
    links: [
      {
        kind: "email",
        label: "imaginebeinglolbit@gmail.com",
        href: "mailto:imaginebeinglolbit@gmail.com",
      },
      {
        kind: "github",
        label: "Lol-bit-Rvgl",
        href: "https://github.com/Lol-bit-Rvgl",
        external: true,
      },
    ],
    seo: {
      title: "— Lolbit // GLL",
      description:
        "Autonomous Runtime // Ethical Dev. SYSTEM ONLINE. Playtime is over.",
    },
    integrations: { lanyardUserId: "1066501844177797171" },
    experience: {
      component: "LolbitProfile",
      kind: "editorial",
      capabilities: [
        "chat",
        "lanyard",
        "audio",
        "projects",
        "telemetry",
        "spotify",
        "canvas",
        "clock",
        "editorial",
      ],
    },
  },
  {
    slug: "nothing",
    displayName: "Nothing",
    role: "Cyber City Dump // Spamton's Shop",
    status: "OPEN // 100K KROMER",
    quote: "ARE YOU A [BIG SHOT]?",
    discord: "nothingwork",
    avatar: { src: "/images/members/nothing/avatar.jpg", alt: "Nothing" },
    description:
      "Tienda ambulante del Cyber City Dump. Neo-brutalismo, KROMER y ofertas que no deberían existir.",
    tags: ["store", "deltarune", "brutalism"],
    faction: "VOID",
    order: 2,
    cardSize: "wide",
    visible: true,
    theme: {
      primary: "#facc15",
      secondary: "#f472b6",
      background: "#000000",
      foreground: "#fef9c3",
      muted: "#a16207",
      border: "rgba(250, 204, 21, 0.5)",
      glow: "#facc15",
      font: "mono",
      radius: "0px",
      texture: "none",
      effects: { scanlines: false, noise: false, glitch: false, glow: "none" },
      card: {
        accent: "#facc15",
        tag: "[ BIG SHOT // SHOP ]",
        tagClass: "border-yellow-400/40 text-yellow-300 bg-yellow-400/10",
        statusColor: "text-yellow-400",
      },
    },
    links: [],
    seo: {
      title: "Nothing // GLL",
      description:
        "Cyber City Dump // Spamton's Shop. ARE YOU A [BIG SHOT]?",
    },
    experience: {
      component: "NothingProfile",
      kind: "interactive",
      capabilities: ["store", "audio", "desktop"],
    },
  },
  {
    slug: "valkiria",
    displayName: "Valkiria Walten",
    role: "The Gospel of the Lost",
    status: "ACTIVE // ON PATROL",
    quote: "The lost don't kneel.",
    discord: "valkiria0769",
    avatar: { src: "/images/members/valkiria/avatar.jpg", alt: "Valkiria Walten" },
    description:
      "El gospel de los perdidos. Cristal sacro, halo dorado y una patrulla que no se detiene.",
    tags: ["gospel", "sacred", "glass"],
    faction: "COMBAT",
    order: 3,
    cardSize: "compact",
    visible: true,
    theme: {
      primary: "#f59e0b",
      secondary: "#fde68a",
      background: "#0a0805",
      foreground: "#fef3c7",
      muted: "#a16207",
      border: "rgba(251, 191, 36, 0.3)",
      glow: "#f59e0b",
      font: "serif",
      radius: "1rem",
      texture: "none",
      effects: { scanlines: false, noise: false, glitch: false, glow: "soft" },
      card: {
        accent: "#f59e0b",
        tag: "[ HOLY // GOSPEL ]",
        tagClass: "border-amber-400/40 text-amber-200 bg-amber-400/10",
        statusColor: "text-amber-400",
      },
    },
    links: [],
    seo: {
      title: "Valkiria Walten // GLL",
      description: "The Gospel of the Lost. The lost don't kneel.",
    },
    experience: {
      component: "ValkiriaProfile",
      kind: "editorial",
      capabilities: ["audio", "editorial"],
    },
  },
  {
    slug: "sleepy",
    displayName: "Sleepy &",
    role: "The Climber // Alt Grunge",
    status: "ONLINE // ASLEEP",
    quote: "dibujando historias que se niegan a terminar.",
    discord: "sleepydreams2000",
    avatar: { src: "/images/members/sleepy/avatar.jpg", alt: "Sleepy" },
    description:
      "Alt grunge, escritorio retro y cómics que se niegan a terminar.",
    tags: ["grunge", "desktop", "comic"],
    faction: "ARCHIVE",
    order: 4,
    cardSize: "compact",
    visible: true,
    theme: {
      primary: "#b91c1c",
      secondary: "#f87171",
      background: "#120709",
      foreground: "#f5f5f4",
      muted: "#78716c",
      border: "rgba(153, 27, 27, 0.8)",
      glow: "#dc2626",
      font: "sans",
      radius: "0px",
      texture: "none",
      effects: { scanlines: false, noise: false, glitch: false, glow: "soft" },
      card: {
        accent: "#b91c1c",
        tag: "[ GRUNGE // CLIMB ]",
        tagClass: "border-red-700/40 text-red-200 bg-red-900/20",
        statusColor: "text-red-400",
      },
    },
    links: [],
    seo: {
      title: "Sleepy & // GLL",
      description:
        "The Climber // Alt Grunge. dibujando historias que se niegan a terminar.",
    },
    experience: {
      component: "SleepyProfile",
      kind: "immersive",
      capabilities: [
        "three",
        "desktop",
        "gallery",
        "clock",
        "audio",
        "chat",
      ],
    },
  },
  {
    slug: "hater",
    displayName: "𝐇𝖆𝖙𝖊𝖗",
    role: "The Corrupted Echo // Lord of Sinister Minds",
    status: "ONLINE",
    quote: "HELLO. DO YOU WANT TO PLAY WITH ME?",
    discord: "hatersito",
    avatar: { src: "/images/members/hater/vinyl-cover.jpg", alt: "Hater" },
    description:
      "Eco corrupto, cinta analógica y el señor de las Sinister Minds.",
    tags: ["vhs", "corrupt", "vinyl"],
    faction: "VOID",
    order: 5,
    cardSize: "wide",
    visible: true,
    theme: {
      primary: "#dc2626",
      secondary: "#22d3ee",
      background: "#000000",
      foreground: "#fee2e2",
      muted: "#7f1d1d",
      border: "rgba(127, 29, 29, 1)",
      glow: "#dc2626",
      font: "serif",
      radius: "0px",
      texture: "vhs",
      effects: { scanlines: true, noise: true, glitch: true, glow: "strong" },
      card: {
        accent: "#dc2626",
        tag: "[ CORRUPT // VHS ]",
        tagClass: "border-red-600/40 text-red-300 bg-red-600/10",
        statusColor: "text-red-500",
      },
    },
    links: [
      {
        kind: "spotify",
        label: "Sinister Minds",
        href: "https://open.spotify.com/album/335oq3WJCd1U5GQJBwdmkd",
        external: true,
      },
    ],
    seo: {
      title: "Hater // GLL",
      description:
        "The Corrupted Echo // Lord of Sinister Minds. HELLO. DO YOU WANT TO PLAY WITH ME?",
    },
    integrations: {
      spotifyEmbedUrl:
        "https://open.spotify.com/embed/album/335oq3WJCd1U5GQJBwdmkd?utm_source=generator&theme=0",
    },
    experience: {
      component: "HaterProfile",
      kind: "immersive",
      capabilities: ["spotify", "audio", "gallery", "editorial"],
    },
  },
  {
    slug: "mangle",
    displayName: "Mangle Drake",
    role: "Kids' Cove // Tactical Animatronic",
    status: "READY // CAM_12 ACTIVE",
    quote: "Tactical. Loyal. Still hungry.",
    discord: "im_stilll_standing",
    avatar: { src: "/images/members/Mangle/avatar.jpg", alt: "Mangle Drake" },
    description:
      "Animatrónico táctico de Kids' Cove. Radar, CCTV y un minijuego que no perdona.",
    tags: ["tactical", "animatronic", "radar"],
    faction: "COMBAT",
    order: 6,
    cardSize: "wide",
    visible: true,
    theme: {
      primary: "#ec4899",
      secondary: "#f9a8d4",
      background: "#050507",
      foreground: "#fce7f3",
      muted: "#9d174d",
      border: "rgba(236, 72, 153, 0.3)",
      glow: "#ec4899",
      font: "mono",
      radius: "0px",
      texture: "grid",
      effects: { scanlines: true, noise: false, glitch: false, glow: "soft" },
      card: {
        accent: "#ec4899",
        tag: "[ MEG // RECON ]",
        tagClass: "border-pink-500/40 text-pink-300 bg-pink-500/10",
        statusColor: "text-[#ec4899]",
      },
    },
    links: [
      {
        kind: "github",
        label: "MangleDrake",
        href: "https://github.com/MangleDrake",
        external: true,
      },
      {
        kind: "twitch",
        label: "mangledrake",
        href: "https://m.twitch.tv/mangledrake",
        external: true,
      },
    ],
    seo: {
      title: "Mangle Drake // GLL",
      description:
        "Kids' Cove // Tactical Animatronic. Tactical. Loyal. Still hungry.",
    },
    experience: {
      component: "MangleProfile",
      kind: "interactive",
      capabilities: [
        "minigame",
        "audio",
        "cctv",
        "crash",
        "store",
        "clock",
      ],
    },
  },
  {
    slug: "stark",
    displayName: "STAR/K",
    role: "Iron Will // Ghost of Tsushima",
    status: "HONOR // IN EXILE",
    quote: "Cut your own fate.",
    discord: "starkhateseveryone",
    avatar: { src: "/images/members/stark/avatar.jpg", alt: "STAR/K" },
    description:
      "Ronin de acero, 3D, galería y una disciplina que corta su propio destino.",
    tags: ["ronin", "steel", "three"],
    faction: "COMBAT",
    order: 7,
    cardSize: "compact",
    visible: true,
    theme: {
      primary: "#e4e4e7",
      secondary: "#ef4444",
      background: "#0a090b",
      foreground: "#fafafa",
      muted: "#71717a",
      border: "rgba(63, 63, 70, 1)",
      glow: "#ef4444",
      font: "serif",
      radius: "0px",
      texture: "none",
      effects: { scanlines: false, noise: false, glitch: false, glow: "soft" },
      card: {
        accent: "#e4e4e7",
        tag: "[ RONIN // STEEL ]",
        tagClass: "border-zinc-500/40 text-zinc-300 bg-zinc-500/10",
        statusColor: "text-zinc-300",
      },
    },
    links: [],
    seo: {
      title: "STAR/K // GLL",
      description:
        "Iron Will // Ghost of Tsushima. Cut your own fate.",
    },
    experience: {
      component: "StarkProfile",
      kind: "immersive",
      capabilities: ["three", "canvas", "gallery", "drag", "clock"],
    },
  },
  {
    slug: "darky",
    displayName: "DARKY",
    role: "Abyssal VHS // Spectral Hands",
    status: "HAUNTED // NO SIGNAL",
    quote: "Just... make me yours...~♡",
    discord: "darky0354_07740",
    avatar: { src: "/images/members/Darky/avatar.jpg", alt: "DARKY" },
    description:
      "Retrato abisal, manos espectrales y una señal que nunca termina de llegar.",
    tags: ["abyss", "spectral", "vhs"],
    faction: "VOID",
    order: 8,
    cardSize: "compact",
    visible: true,
    theme: {
      primary: "#991b1b",
      secondary: "#f43f5e",
      background: "#0c0406",
      foreground: "#ffe4e6",
      muted: "#881337",
      border: "rgba(127, 29, 29, 0.6)",
      glow: "#be123c",
      font: "serif",
      radius: "0px",
      texture: "vhs",
      effects: { scanlines: false, noise: true, glitch: false, glow: "soft" },
      card: {
        accent: "#991b1b",
        tag: "[ ABYSS // SPIRIT ]",
        tagClass: "border-red-800/40 text-rose-300 bg-red-950/40",
        statusColor: "text-rose-400",
      },
    },
    links: [],
    seo: {
      title: "DARKY // GLL",
      description:
        "Abyssal VHS // Spectral Hands. Just... make me yours...~♡",
    },
    experience: {
      component: "DarkyProfile",
      kind: "immersive",
      capabilities: ["canvas", "audio", "gallery"],
    },
  },
  {
    slug: "dramatic",
    displayName: "Dramatic",
    role: "Ethereal Sky // Lost Connection",
    status: "SYNC // ANALOG DRIFT",
    quote: "Por fin te encontré.",
    avatar: { src: "/images/members/dramatic/avatar.jpeg", alt: "Dramatic" },
    description:
      "Deriva etérea, conexión perdida y una sincronización analógica que siempre vuelve.",
    tags: ["sky", "drift", "analog"],
    faction: "ARCHIVE",
    order: 9,
    cardSize: "wide",
    visible: true,
    theme: {
      primary: "#38bdf8",
      secondary: "#7dd3fc",
      background: "#04121f",
      foreground: "#e0f2fe",
      muted: "#0369a1",
      border: "rgba(56, 189, 248, 0.3)",
      glow: "#38bdf8",
      font: "sans",
      radius: "0px",
      texture: "none",
      effects: { scanlines: false, noise: false, glitch: false, glow: "soft" },
      card: {
        accent: "#38bdf8",
        tag: "[ SKY // DRIFT ]",
        tagClass: "border-sky-400/40 text-sky-300 bg-sky-400/10",
        statusColor: "text-sky-400",
      },
    },
    links: [],
    seo: {
      title: "Dramatic // GLL",
      description:
        "Ethereal Sky // Lost Connection. Por fin te encontré.",
    },
    experience: {
      component: "DramaticProfile",
      kind: "editorial",
      capabilities: ["audio", "clock", "poem"],
    },
  },
  {
    slug: "darth10",
    displayName: "DARTH.10",
    role: "Lazy Gamer // Otaku Specialist",
    status: "AFK // WATCHING ANIME",
    quote: "Lazy days, lucky stars.",
    discord: "darth.10",
    avatar: { src: "/images/members/darth/avatar.jpg", alt: "DARTH.10" },
    description:
      "Gamer perezoso, especialista otaku y ventanas que se arrastran por la pantalla.",
    tags: ["otaku", "gamer", "windows"],
    faction: "ARCHIVE",
    order: 10,
    cardSize: "wide",
    visible: true,
    theme: {
      primary: "#06b6d4",
      secondary: "#22d3ee",
      background: "#040c12",
      foreground: "#cffafe",
      muted: "#0e7490",
      border: "rgba(6, 182, 212, 0.3)",
      glow: "#06b6d4",
      font: "mono",
      radius: "0px",
      texture: "none",
      effects: { scanlines: false, noise: false, glitch: false, glow: "soft" },
      card: {
        accent: "#06b6d4",
        tag: "[ OTAKU // AFK ]",
        tagClass: "border-cyan-400/40 text-cyan-300 bg-cyan-400/10",
        statusColor: "text-cyan-400",
      },
    },
    links: [
      {
        kind: "spotify",
        label: "Darth.10 Playlist",
        href: "https://open.spotify.com/playlist/6r0mw8mYkDRCyiDL4YVVC2",
        external: true,
      },
    ],
    seo: {
      title: "DARTH.10 // GLL",
      description:
        "Lazy Gamer // Otaku Specialist. Lazy days, lucky stars.",
    },
    integrations: {
      spotifyEmbedUrl:
        "https://open.spotify.com/embed/playlist/6r0mw8mYkDRCyiDL4YVVC2?utm_source=generator&theme=0",
    },
    experience: {
      component: "Darth10Profile",
      kind: "interactive",
      capabilities: ["spotify", "drag", "reboot", "desktop", "clock"],
    },
  },
];

/** Filtros visibles del roster. */
export const FACTION_FILTERS: ("ALL" | MemberFaction)[] = [
  "ALL",
  "ARCHIVE",
  "COMBAT",
  "VOID",
  "SOLAR",
  "LUNAR",
  "NEBULA",
  "CHRONO",
];

/** Alias históricos de URL que deben seguir resolviendo. */
export const MEMBER_ALIASES: Record<string, string> = {
  "mangle-drake": "mangle",
  darth: "darth10",
};

/** Resuelve un alias de URL al slug canónico. */
export function resolveMemberSlug(slug: string): string {
  return MEMBER_ALIASES[slug] ?? slug;
}

/** Miembros visibles en el roster, en orden de presentación. */
export function getRosterMembers(): Member[] {
  return members
    .filter((member) => member.visible)
    .sort((a, b) => a.order - b.order);
}

export function getMemberBySlug(slug: string): Member | undefined {
  const canonical = resolveMemberSlug(slug);
  return members.find((member) => member.slug === canonical);
}

export function getMemberDiscord(slug: string): string | undefined {
  return getMemberBySlug(slug)?.discord;
}

export function getAllSlugs(): string[] {
  return getRosterMembers().map((member) => member.slug);
}

export type {
  Member,
  MemberAvatar,
  MemberCapability,
  MemberCardSize,
  MemberCardTheme,
  MemberExperience,
  MemberFaction,
  MemberIntegrations,
  MemberLink,
  MemberLinkKind,
  MemberSeo,
  MemberTheme,
  MemberThemeEffects,
  MemberThemeFont,
  MemberThemeGlow,
  MemberThemeTexture,
} from "@/types/member";
