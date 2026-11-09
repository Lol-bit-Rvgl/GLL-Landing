"use client";

import { Check } from "lucide-react";
import { SiDiscord } from "react-icons/si";
import type { Member } from "@/types/member";

interface DiscordChipProps {
  member: Member;
  copied: string | null;
  onCopy: (e: React.MouseEvent, slug: string) => void;
}

/**
 * Badge copiable de Discord. El tag viene de `member.discord`; si el miembro no
 * tiene tag, no renderiza nada.
 */
export function DiscordChip({ member, copied, onCopy }: DiscordChipProps) {
  const tag = member.discord;
  if (!tag) return null;
  const isCopied = copied === member.slug;

  return (
    <button
      onClick={(e) => onCopy(e, member.slug)}
      title={`Copiar Discord: ${tag}`}
      className="inline-flex items-center gap-1.5 rounded-md border border-white/15 bg-black/60 px-2.5 py-1 font-mono text-xs font-medium text-zinc-200 backdrop-blur-sm transition hover:bg-black/90 hover:text-white hover:border-white/30"
    >
      <SiDiscord className="h-3.5 w-3.5 text-[#5865F2]" />
      <span>{isCopied ? "COPIED!" : `@${tag}`}</span>
      {isCopied && <Check className="h-3.5 w-3.5 text-emerald-400" />}
    </button>
  );
}
