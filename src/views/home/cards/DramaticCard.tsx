import Image from "next/image";
import { MemberAvatar } from "@/components/primitives/MemberAvatar";
import { DiscordChip } from "@/components/primitives/DiscordChip";
import type { MemberCardProps } from "./types";

/* ── Dramatic: Ethereal Sky Drift ────────────────────────── */
export function DramaticCard({ m, t, copied, onCopy }: MemberCardProps) {
  return (
    <div className="relative flex h-full flex-col justify-between overflow-hidden rounded-2xl border border-sky-500/30 bg-gradient-to-b from-sky-950/40 via-black/80 to-black p-5 shadow-[0_8px_32px_rgba(56,189,248,0.2)] transition-all duration-300 hover:border-sky-400/60 hover:shadow-[0_8px_40px_rgba(56,189,248,0.35)]">
      {/* Cielo etéreo de fondo */}
      <div className="absolute inset-0 overflow-hidden">
        <Image
          src="/images/members/dramatic/street.jpeg"
          alt=""
          fill
          className="absolute object-cover opacity-15 transition-transform duration-700 group-hover:scale-105"
        />
        {/* Gradient overlay oscuro */}
        <span
          aria-hidden
          className="absolute inset-0 bg-gradient-to-b from-black via-black/60 to-transparent"
        />
      </div>

      {/* Sky particles */}
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 opacity-20"
        style={{
          background: `radial-gradient(circle at 20% 30%, rgba(56,189,248,0.2) 0%, transparent 30%),
                      radial-gradient(circle at 80% 70%, rgba(167,139,250,0.15) 0%, transparent 40%)`,
        }}
      />

      {/* Header */}
      <div className="relative flex items-center justify-between gap-2 font-mono text-[9px] tracking-widest text-sky-400/80">
        <span className="text-sky-300 drop-shadow-[0_1px_3px_rgba(0,0,0,0.8)]">
          ETHEREAL // SKY DRIFT
        </span>
        <div className="flex items-center gap-2">
          <span className={`rounded border border-sky-400/30 bg-sky-400/10 px-1.5 py-0.5 text-xs text-sky-200`}>
            {t.tag}
          </span>
          <DiscordChip member={m} copied={copied} onCopy={onCopy} />
        </div>
      </div>

      {/* Avatar + Nombre */}
      <div className="relative my-auto flex items-center gap-3.5 pt-2">
        <div className="relative shrink-0">
          <MemberAvatar member={m} />
        </div>
        <div className="min-w-0">
          <h3 className="truncate font-sans text-2xl font-bold tracking-wide text-sky-100">
            {m.displayName}
          </h3>
          <p className="truncate font-mono text-xs text-sky-300/70">{m.role}</p>
        </div>
      </div>

      {/* Cita */}
      <p className="relative my-1 font-serif text-xs italic text-sky-200/90 leading-snug drop-shadow-[0_1px_4px_rgba(0,0,0,0.5)]">
        {"\u201C" + m.quote + "\u201D"}
      </p>

      {/* Waveform */}
      <div className="relative mt-2">
        <div className="flex h-5 items-end gap-1" aria-hidden>
          {Array.from({ length: 24 }, (_, i) => (
            <span
              key={i}
              className="eq-mini w-full bg-sky-400/80"
              style={{ animationDelay: `${i * 0.08}s` }}
            />
          ))}
        </div>
        <div className="mt-1 flex items-center justify-between font-mono text-[9px] text-sky-400/70">
          <span>AUDIO SYNC // ANALOG DRIFT</span>
          <span>{m.status ?? "ONLINE"}</span>
        </div>
      </div>
    </div>
  );
}