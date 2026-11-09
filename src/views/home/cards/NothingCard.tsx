import Image from "next/image";
import { MemberAvatar } from "@/components/primitives/MemberAvatar";
import { DiscordChip } from "@/components/primitives/DiscordChip";
import type { MemberCardProps } from "./types";

/* ── Nothing: Neo-brutalismo Deltarune ────────────────────── */
export function NothingCard({ m, copied, onCopy }: MemberCardProps) {
  return (
    <div className="jitter-hover relative flex h-full flex-col overflow-hidden rounded-2xl border-2 border-yellow-400/50 bg-black p-5 shadow-[0_8px_32px_0_rgba(0,0,0,0.6)] transition-all hover:border-yellow-300/70 hover:shadow-[0_0_30px_rgba(255,205,86,0.4)]">
      {/* Cinta diagonal de peligro amarillo/negro */}
      <span
        aria-hidden
        className="pointer-events-none absolute -top-6 -left-6 block h-2.5 w-full rotate-[-45deg]"
        style={{
          backgroundImage: "repeating-linear-gradient(45deg, #facc15 0 8px, #000 8px 16px)",
        }}
      />

      {/* Banner Spamton */}
      <div className="relative mt-3 h-14 w-full overflow-hidden rounded-xl border border-yellow-300/50 bg-yellow-950/30">
        <Image
          src="/images/members/nothing/banner.png"
          alt=""
          fill
          className="object-cover"
          style={{ imageRendering: "pixelated" }}
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent" />
      </div>

      {/* Avatar + Info */}
      <div className="mt-3 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <MemberAvatar member={m} />
          <div>
            <h3 className="font-mono text-xl font-black tracking-wide text-yellow-300 drop-shadow-[2px_2px_0_#713f12]">
              {m.displayName}
            </h3>
            <p className="font-mono text-[10px] text-yellow-200/70">{m.role}</p>
          </div>
        </div>
        <span className="inline-flex -rotate-2 items-center justify-center bg-yellow-400 px-2 py-0.5 font-mono text-[9px] font-black tracking-wider text-black shadow-md shadow-yellow-600/30">
          [100K KROMER]
        </span>
      </div>

      {/* Cita */}
      <div className="relative my-2 border-l-2 border-yellow-400/60 bg-yellow-950/20 px-3 py-1.5">
        <p className="font-mono text-xs font-bold text-yellow-100 leading-snug">
          {"\u201C" + m.quote + "\u201D"}
        </p>
      </div>

      {/* Footer */}
      <div className="mt-auto pt-4 flex items-center justify-between font-mono text-[9px] tracking-wider text-yellow-400/80">
        <DiscordChip member={m} copied={copied} onCopy={onCopy} />
        <span className="text-red-400">{m.status ?? "SPAMTON.NET"}</span>
      </div>
    </div>
  );
}