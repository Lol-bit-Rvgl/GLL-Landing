import Image from "next/image";
import { MemberAvatar } from "@/components/primitives/MemberAvatar";
import { DiscordChip } from "@/components/primitives/DiscordChip";
import type { MemberCardProps } from "./types";

/* ── Stark: Ronin Steel // Ghost of Tsushima ────────────────── */
export function StarkCard({ m, t, copied, onCopy }: MemberCardProps) {
  return (
    <div className="relative flex h-full flex-col overflow-hidden bg-[#0a090b] border border-zinc-800 p-5 transition-colors duration-300 hover:border-zinc-500">
      {/* Fondo cinemático */}
      <div className="absolute inset-0 overflow-hidden">
        <Image
          src="/images/members/stark/banner.gif"
          alt=""
          fill
          className="object-cover object-center transition-transform duration-500 ease-out group-hover:scale-105"
        />
        {/* Overlay oscuro para contraste */}
        <span
          aria-hidden
          className="absolute inset-0 bg-gradient-to-t from-[#09090b] via-[#09090b]/80 to-[#09090b]/40 backdrop-blur-[1px]"
        />
      </div>

      {/* Kanji de fondo: 武士 (Bushido) */}
      <span
        aria-hidden
        className="pointer-events-none absolute right-3 top-1/2 z-10 -translate-y-1/2 select-none font-serif text-7xl font-black text-white/[0.04]"
        style={{ writingMode: "vertical-rl" }}
      >
        武士
      </span>

      {/* Trazo de katana */}
      <span
        aria-hidden
        className="pointer-events-none absolute left-0 top-1/2 z-10 h-[1.5px] w-full scale-x-0 bg-gradient-to-r from-transparent via-red-500/80 to-transparent transition-transform duration-700 group-hover:scale-x-100"
        style={{ transformOrigin: "left" }}
      />

      {/* Header */}
      <div className="relative z-10 flex items-center justify-between gap-2 font-mono text-[9px] tracking-[0.4em] text-zinc-400">
        <span className="text-zinc-300 drop-shadow-[0_1px_3px_rgba(0,0,0,0.9)]">
          [ RONIN // STEEL ]
        </span>
        <div className="flex items-center gap-2">
          <span className={`rounded border ${t.tagClass.split(" ")[0]} ${t.tagClass.split(" ")[1]} ${t.tagClass.split(" ")[2]} px-1.5 py-0.5 text-zinc-300 drop-shadow-[0_1px_3px_rgba(0,0,0,0.9)]`}>
            {t.tag}
          </span>
          <DiscordChip member={m} copied={copied} onCopy={onCopy} />
        </div>
      </div>

      {/* Contenido */}
      <div className="relative z-10 mt-auto pt-6">
        <div className="flex items-center gap-3">
          <MemberAvatar member={m} />
          <div>
            <h3 className="font-serif text-xl font-bold tracking-wider text-white drop-shadow-[0_2px_10px_rgba(0,0,0,0.85)]">
              {m.displayName}
            </h3>
            <p className="text-xs text-zinc-300 drop-shadow-[0_1px_3px_rgba(0,0,0,0.9)]">
              {m.role}
            </p>
          </div>
        </div>

        <p className="mt-4 font-serif text-sm italic text-zinc-100 drop-shadow-[0_1px_6px_rgba(0,0,0,0.9)]">
          “{m.quote}”
        </p>
        <div className="mt-4 flex items-center justify-between font-mono text-[9px] text-zinc-300 drop-shadow-[0_1px_3px_rgba(0,0,0,0.9)]">
          <span>KATANA // DISCIPLINE</span>
          <span className="text-red-400">{m.status ?? "HONOR"}</span>
        </div>
      </div>
    </div>
  );
}