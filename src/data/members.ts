export interface Member {
  slug: string;
  displayName: string;
  role: string;
  status?: string;
  quote?: string;
  isLeader?: boolean;
  discord?: string;
}

export const members: Member[] = [
  {
    slug: "lolbit",
    displayName: "— Lolbit",
    role: "Autonomous Runtime // Ethical Dev",
    status: "SYS.ONLINE // PORT 0x7F",
    quote: "SYSTEM ONLINE. Playtime is over.",
    isLeader: true,
    discord: "imaginebeinglolbit",
  },
  {
    slug: "hater",
    displayName: "𝐇𝖆𝖙𝖊𝖗",
    role: "The Corrupted Echo // Lord of Sinister Minds",
    status: "ONLINE",
    quote: "HELLO. DO YOU WANT TO PLAY WITH ME?",
    discord: "hatersito",
  },
  {
    slug: "valkiria",
    displayName: "Valkiria Walten",
    role: "The Gospel of the Lost",
    status: "ACTIVE // ON PATROL",
    quote: "The lost don't kneel.",
    discord: "valkiria0769",
  },
  {
    slug: "nothing",
    displayName: "Nothing",
    role: "Cyber City Dump // Spamton's Shop",
    status: "OPEN // 100K KROMER",
    quote: "ARE YOU A [BIG SHOT]?",
  },
  {
    slug: "stark",
    displayName: "STAR/K",
    role: "Iron Will // Ghost of Tsushima",
    status: "HONOR // IN EXILE",
    quote: "Cut your own fate.",
    discord: "starkhateseveryone",
  },
  {
    slug: "dramatic",
    displayName: "Dramatic",
    role: "Ethereal Sky // Lost Connection",
    status: "SYNC // ANALOG DRIFT",
    quote: "Por fin te encontré.",
  },
  {
    slug: "darky",
    displayName: "DARKY",
    role: "Abyssal VHS // Spectral Hands",
    status: "HAUNTED // NO SIGNAL",
    quote: "Just... make me yours...~♡",
  },
  {
    slug: "darth10",
    displayName: "DARTH.10",
    role: "Lazy Gamer // Otaku Specialist",
    status: "AFK // WATCHING ANIME",
    quote: "Lazy days, lucky stars.",
    discord: "darth.10",
  },
  {
    slug: "mangle",
    displayName: "Mangle Drake",
    role: "Kids' Cove // Tactical Animatronic",
    status: "READY // CAM_12 ACTIVE",
    quote: "Tactical. Loyal. Still hungry.",
    discord: "im_stilll_standing",
  },
  {
    slug: "sleepy",
    displayName: "Sleepy &",
    role: "The Climber // Alt Grunge",
    status: "ONLINE // ASLEEP",
    quote: "dibujando historias que se niegan a terminar.",
    discord: "sleepydreams2000",
  },
];

export function getMemberBySlug(slug: string): Member | undefined {
  if (slug === "mangle-drake") {
    return members.find((m) => m.slug === "mangle");
  }
  if (slug === "darth") {
    return members.find((m) => m.slug === "darth10");
  }
  return members.find((m) => m.slug === slug);
}

export function getAllSlugs(): string[] {
  return members.map((m) => m.slug);
}
