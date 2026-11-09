import Image from "next/image";
import { MemberAvatar } from "@/components/primitives/MemberAvatar";
import { DiscordChip } from "@/components/primitives/DiscordChip";
import type { MemberCardProps } from "./types";

/* ── Valkiria: Sacred Archive // Liquid Glass ─────────────────── */
export function ValkiriaCard({ m, t, copied, onCopy }: MemberCardProps) {
  return (
    <div className="relative flex h-full flex-col overflow-hidden rounded-2xl border border-amber-400/30 bg-gradient-to-b from-white/[0.08] via-amber-950/20 to-black/90 p-5 shadow-[0_8px_32px_0_rgba(245,158,11,0.2)] backdrop-blur-xl transition-all duration-500 hover:border-amber-400/60 hover:shadow-[0_8px_40px_0_rgba(245,158,11,0.35)]">
      {/* Fondo sagrado */}
      <div className="absolute inset-0 -z-0 overflow-hidden">
        <Image
          src={m.avatar.src}
          alt=""
          fill
          className="absolute object-cover opacity-25 transition-transform duration-700 group-hover:scale-105"
        />
      </div>

      {/* Halo sagrado */}
      <span
        aria-hidden
        className="halo-pulse pointer-events-none absolute left-1/2 top-10 h-44 w-44 -translate-x-1/2 rounded-full"
        style={{
          background: "radial-gradient(circle, rgba(255,191,36,0.3) 0%, transparent 70%)",
        }}
      />

      {/* Reflejo de cristal */}
      <span
        aria-hidden
        className="pointer-events-none absolute inset-x-0 top-0 h-1/2"
        style={{
          background: "linear-gradient(135deg, rgba(255,255,255,0.12) 0%, transparent 50%)",
        }}
      />

      {/* Header con tag y Discord */}
      <div className="relative flex items-center justify-between gap-2 font-mono text-[10px] tracking-widest text-amber-300">
        <span className="text-amber-200">✦ SACRED ARCHIVE ✦</span>
        <div className="flex items-center gap-2">
          <span className={`rounded border border-amber-400/40 bg-amber-400/10 px-1.5 py-0.5 text-xs text-amber-200`}>
            {t.tag}
          </span>
          <DiscordChip member={m} copied={copied} onCopy={onCopy} />
        </div>
      </div>

      {/* Avatar y Nombre */}
      <div className="relative mt-auto flex flex-col items-center pt-4 text-center">
        <div className="mx-auto">
          <MemberAvatar member={m} />
        </div>
        <h3 className="mt-2 font-serif text-xl font-bold tracking-wide text-amber-100 drop-shadow-[0_2px_15px_rgba(0,0,0,0.8)] sm:text-2xl">
          {m.displayName}
        </h3>
        <p className="mt-0.5 text-xs text-amber-200/70 font-mono">{m.role}</p>
        <p className="mt-2 font-serif text-xs italic text-amber-100/90 leading-snug drop-shadow-[0_1px_4px_rgba(0,0,0,0.6)]">
          {"\u201C" + m.quote + "\u201D"}
        </p>
        <div className="mt-3 flex items-center justify-center gap-2 font-mono text-[9px] text-amber-300">
          <span className="h-1.5 w-1.5 rounded-full bg-amber-400 animate-pulse" />
          <span>{m.status ?? "HOLY // PATROL"}</span>
        </div>
      </div>
    </div>
  );
}