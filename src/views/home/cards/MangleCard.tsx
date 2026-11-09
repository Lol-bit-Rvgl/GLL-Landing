import { MemberAvatar } from "@/components/primitives/MemberAvatar";
import { DiscordChip } from "@/components/primitives/DiscordChip";
import type { MemberCardProps } from "./types";

/* ── Mangle: Signal Radar // Pink Tactical ────────────────────── */
export function MangleCard({ m, copied, onCopy }: MemberCardProps) {
  return (
    <div className="quartz-glitch relative flex h-full flex-col overflow-hidden rounded-2xl border border-pink-500/30 bg-white/[0.03] p-5 shadow-[inset_0_1px_1px_rgba(255,255,255,0.1),0_8px_32px_rgba(0,0,0,0.5)] backdrop-blur-xl transition-all duration-300 hover:border-pink-400/60 hover:shadow-[inset_0_1px_2px_rgba(255,255,255,0.2),0_12px_40px_rgba(236,72,153,0.35)]">
      {/* Reflejo superior */}
      <span
        aria-hidden
        className="pointer-events-none absolute inset-x-0 top-0 h-32"
        style={{
          background: "linear-gradient(180deg, rgba(255,255,255,0.1) 0%, rgba(236,72,153,0.08) 50%, transparent 100%)",
        }}
      />

      {/* Tela de red táctica */}
      <span
        aria-hidden
        className="pointer-events-none absolute inset-0 opacity-25"
        style={{
          backgroundImage:
            "linear-gradient(rgba(236,72,153,0.15) 1px, transparent 1px), linear-gradient(90deg, rgba(236,72,153,0.15) 1px, transparent 1px)",
          backgroundSize: "20px 20px",
        }}
      />

      {/* Header superior: telemetría */}
      <div className="relative flex items-center justify-between font-mono text-[10px] tracking-widest text-pink-400">
        <span className="text-pink-300">◢ KIDS&apos; COVE // RECON</span>
        <div className="flex items-center gap-2">
          <DiscordChip member={m} copied={copied} onCopy={onCopy} />
          <span className="flex items-center gap-1.5 font-mono text-[10px] font-bold text-emerald-400">
            <span className="relative flex h-2 w-2">
              <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-emerald-400 opacity-75" />
              <span className="relative inline-flex h-2 w-2 rounded-full bg-emerald-400" />
            </span>
            LIVE
          </span>
        </div>
      </div>

      {/* Avatar + Identidad */}
      <div className="relative mt-4 flex items-center gap-3.5">
        <MemberAvatar member={m} />
        <div className="min-w-0">
          <h3 className="font-mono text-2xl font-black tracking-wide text-pink-200 drop-shadow-[0_0_12px_rgba(236,72,153,0.5)]">
            {m.displayName}
          </h3>
          <p className="font-mono text-xs text-pink-300/80">{m.role}</p>
        </div>
      </div>

      {/* Cita táctica */}
      <div className="relative my-1 border-l-2 border-pink-500/60 bg-pink-950/20 px-3 py-1.5">
        <p className="font-serif text-xs italic text-pink-100/90 leading-snug drop-shadow-[0_1px_2px_rgba(0,0,0,0.5)]">
          {"\u201C" + m.quote + "\u201D"}
        </p>
      </div>

      {/* Radar táctico */}
      <div className="relative mt-auto pt-4">
        <div className="flex items-center justify-between gap-4">
          {/* Radar compacto */}
          <div className="relative flex h-16 w-16 items-center justify-center overflow-hidden rounded-full border border-pink-400/60 bg-black/70 shadow-[0_0_15px_rgba(236,72,153,0.25)]">
            <span className="radar-sweep absolute inset-0" />
            <span className="absolute left-1/2 top-1/2 h-1.5 w-1.5 -translate-x-1/2 -translate-y-1/2 rounded-full bg-pink-200 shadow-[0_0_8px_#ec4899]" />
            <span className="absolute inset-x-0 top-1/2 h-px -translate-y-1/2 bg-pink-400/30" />
            <span className="absolute inset-y-0 left-1/2 w-px -translate-x-1/2 bg-pink-400/30" />
          </div>
          <div className="font-mono text-[9px] tracking-wider text-pink-400/80">
            {m.status ?? "CAM_12 ACTIVE"}
          </div>
        </div>
        <div className="mt-1 text-right font-mono text-[9px] tracking-wider text-pink-400/70">
          RADAR // CAM_12
        </div>
      </div>
      <span aria-hidden className="gll-tear" />
    </div>
  );
}