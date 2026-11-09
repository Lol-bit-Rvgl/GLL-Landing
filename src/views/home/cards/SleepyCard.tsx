import Image from "next/image";
import { MemberAvatar } from "@/components/primitives/MemberAvatar";
import { DiscordChip } from "@/components/primitives/DiscordChip";
import type { MemberCardProps } from "./types";

/* ── Sleepy: Alt Grunge .EXE ─────────────────────────────── */
export function SleepyCard({ m, t, copied, onCopy }: MemberCardProps) {
  return (
    <div className="relative flex h-full flex-col overflow-hidden rounded-2xl border border-red-900/60 bg-[#120709] p-5 transition-all duration-300 hover:border-red-600/70 hover:shadow-[0_0_30px_rgba(220,38,38,0.4)]">
      {/* Fondo cómic grunge */}
      <div className="absolute inset-0 overflow-hidden">
        <Image
          src="/images/members/sleepy/comic-strip.jpg"
          alt=""
          fill
          className="absolute object-cover opacity-15 grayscale transition-transform duration-700 group-hover:scale-105"
        />
        {/* Overlay oscuro */}
        <span
          aria-hidden
          className="absolute inset-0 bg-gradient-to-t from-[#120709] via-[#120709]/80 to-transparent"
        />
      </div>

      {/* Scanlines VHS */}
      <span aria-hidden className="pointer-events-none absolute inset-0 opacity-30" />

      {/* Header .EXE */}
      <div className="relative flex items-center justify-between font-mono text-[9px] tracking-[0.3em] text-red-400">
        <span className="text-red-300 drop-shadow-[0_1px_3px_rgba(0,0,0,0.8)]">sleepy.exe</span>
        <div className="flex gap-1" aria-hidden>
          <span className="border border-red-400/40 px-1 text-[8px]">_</span>
          <span className="border border-red-400/40 px-1 text-[8px]">□</span>
          <span className="border border-red-400/40 px-1 text-[8px]">✕</span>
        </div>
      </div>

      {/* Avatar + Info */}
      <div className="relative mt-4 flex items-center gap-3.5">
        <MemberAvatar member={m} />
        <div className="min-w-0">
          <h3 className="font-sans text-2xl font-bold tracking-wide text-red-100 drop-shadow-[0_0_12px_rgba(220,38,38,0.5)]">
            {m.displayName}
          </h3>
          <p className="font-mono text-xs text-red-300/70">{m.role}</p>
        </div>
      </div>

      {/* Cita */}
      <p className="relative my-2 font-serif text-xs italic text-red-200/90 leading-snug drop-shadow-[0_1px_4px_rgba(0,0,0,0.6)]">
        {"\u201C" + m.quote + "\u201D"}
      </p>

      {/* Footer con Discord y status */}
      <div className="relative mt-auto pt-4">
        <div className="flex items-center justify-between font-mono text-[9px] tracking-wider text-red-400/80">
          <DiscordChip member={m} copied={copied} onCopy={onCopy} />
          <span>{t.tag} • {m.status ?? "ONLINE"}</span>
        </div>
      </div>
      <span aria-hidden className="gll-tear" />
    </div>
  );
}