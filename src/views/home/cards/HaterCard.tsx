import Image from "next/image";
import { MemberAvatar } from "@/components/primitives/MemberAvatar";
import { DiscordChip } from "@/components/primitives/DiscordChip";
import type { MemberCardProps } from "./types";

/* ── Hater: Corrupted Echo // VHS Static ─────────────────────── */
export function HaterCard({ m, copied, onCopy }: MemberCardProps) {
  return (
    <div className="relative flex h-full flex-col overflow-hidden border border-red-950 bg-black p-5 shadow-[0_0_20px_rgba(220,38,38,0.15)] transition-all duration-500 hover:border-red-600/70 hover:shadow-[0_0_40px_rgba(220,38,38,0.5)]">
      {/* Fondo fracturado */}
      <div className="absolute inset-0">
        <Image
          src={m.avatar.src}
          alt=""
          fill
          className="object-cover opacity-35 transition-transform duration-700 group-hover:scale-105"
        />
      </div>

      {/* Estática y scanlines */}
      <span aria-hidden className="tv-static pointer-events-none absolute inset-0 opacity-45" />
      <span aria-hidden className="scanlines pointer-events-none absolute inset-0 opacity-50" />
      <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-black via-black/80 to-transparent" />

      {/* Header VHS */}
      <div className="relative flex items-center justify-between font-mono text-[9px] tracking-[0.3em] text-red-600">
        <span className="text-red-500">ANALOG TAPE // CORRUPT</span>
        <DiscordChip member={m} copied={copied} onCopy={onCopy} />
      </div>

      {/* Contenido inferior */}
      <div className="relative mt-auto pt-4">
        <MemberAvatar member={m} />
        <h3 className="hater-name mt-2 font-serif text-3xl font-bold tracking-tight text-red-100 drop-shadow-[0_0_15px_rgba(220,38,38,0.8)] sm:text-4xl">
          {m.displayName}
        </h3>
        <p className="mt-1 text-xs text-red-400/80 font-mono">{m.role}</p>
        <p className="mt-3 border-l-2 border-red-600/80 pl-3 font-serif text-sm italic text-red-100/90 leading-snug">
          “{m.quote}”
        </p>
        <div className="mt-4 flex items-center justify-between font-mono text-[9px] tracking-wider text-red-500">
          <span>SINISTER MINDS</span>
          <span>{m.status ?? "ONLINE"}</span>
        </div>
      </div>
      <span aria-hidden className="gll-tear" />
    </div>
  );
}