import { MemberAvatar } from "@/components/primitives/MemberAvatar";
import { DiscordChip } from "@/components/primitives/DiscordChip";
import type { MemberCardProps } from "./types";

/* ── Darth10: Console HUD // Anime Specialist ───────────────────── */
export function DarthCard({ m, t, copied, onCopy }: MemberCardProps) {
  return (
    <div className="relative flex h-full flex-col overflow-hidden rounded-2xl border border-cyan-500/30 bg-black p-5 shadow-[0_8px_32px_rgba(6,182,212,0.2)] transition-all duration-300 hover:border-cyan-400/60 hover:shadow-[0_8px_40px_rgba(6,182,212,0.35)]">
      {/* Fondo con patron anime */}
      <div
        aria-hidden
        className="absolute inset-0 opacity-5"
        style={{
          background: `radial-gradient(circle at 20% 30%, rgba(6,182,212,0.1) 0%, transparent 30%),
                      radial-gradient(circle at 80% 70%, rgba(167,139,250,0.08) 0%, transparent 40%)`,
        }}
      />

      {/* Header HUD */}
      <div className="relative flex items-center justify-between font-mono text-[9px] tracking-widest text-cyan-400/80">
        <span className="text-cyan-300 drop-shadow-[0_1px_3px_rgba(0,0,0,0.8)]">CONSOLE HUD // ANIME SPECIALIST</span>
        <div className="flex items-center gap-2">
          <span className={`rounded border border-cyan-400/30 bg-cyan-400/10 px-1.5 py-0.5 text-xs text-cyan-200`}>
            {t.tag}
          </span>
          <DiscordChip member={m} copied={copied} onCopy={onCopy} />
        </div>
      </div>

      {/* Avatar + Identidad */}
      <div className="relative mt-4 flex items-center gap-3.5">
        <MemberAvatar member={m} />
        <div className="min-w-0">
          <h3 className="font-sans text-2xl font-bold tracking-wide text-cyan-100 drop-shadow-[0_0_12px_rgba(6,182,212,0.5)]">
            {m.displayName}
          </h3>
          <p className="font-mono text-xs text-cyan-300/70">{m.role}</p>
        </div>
      </div>

      {/* Cita */}
      <div className="relative my-1 border-l-2 border-cyan-500/50 bg-cyan-950/20 px-3 py-1.5">
        <p className="font-serif text-xs italic text-cyan-200/90 leading-snug drop-shadow-[0_1px_2px_rgba(0,0,0,0.5)]">
          {"\u201C" + m.quote + "\u201D"}
        </p>
      </div>

      {/* Status */}
      <div className="relative mt-auto pt-4">
        <div className="flex items-center justify-between font-mono text-[9px] tracking-widest text-cyan-400/80">
          <span className="flex items-center gap-1.5">
            <span className="h-1.5 w-1.5 rounded-full bg-cyan-400 animate-pulse" />
            STATUS: AFK // LUCKY STARS
          </span>
          <span>{m.status ?? "AFK"}</span>
        </div>
      </div>
      <span aria-hidden className="gll-tear" />
    </div>
  );
}