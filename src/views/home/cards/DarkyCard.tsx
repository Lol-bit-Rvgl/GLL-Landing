import Image from "next/image";
import { MemberAvatar } from "@/components/primitives/MemberAvatar";
import { DiscordChip } from "@/components/primitives/DiscordChip";
import { DUST_MOTES } from "../home-styles";
import type { MemberCardProps } from "./types";

/* ── Darky: Retrato Abisal VHS ───────────────────────────── */
export function DarkyCard({ m, copied, onCopy }: MemberCardProps) {
  return (
    <div className="relative flex h-full flex-col overflow-hidden rounded-2xl border border-rose-900/60 bg-[#0c0406] p-5 transition-all duration-300 hover:border-rose-600/70 hover:shadow-[0_0_30px_rgba(220,38,38,0.4)]">
      {/* Fondo abisal */}
      <div className="absolute inset-0 overflow-hidden">
        <Image
          src={m.avatar.src}
          alt=""
          fill
          className="object-cover opacity-20 grayscale transition-transform duration-700 group-hover:scale-105"
        />
        {/* Overlay oscuro */}
        <span
          aria-hidden
          className="absolute inset-0 bg-gradient-to-t from-black via-black/80 to-transparent"
        />
      </div>

      {/* Partículas abisales */}
      {DUST_MOTES.map((d, idx) => (
        <span
          key={idx}
          className="gll-ember"
          style={{
            left: `${d.left}%`,
            top: `${d.top}%`,
            fontSize: `${d.size}px`,
            "--dur": `${d.dur}s`,
            "--delay": `${d.delay}s`,
            "--opacity": d.opacity,
          } as React.CSSProperties}
        />
      ))}

      {/* Estática VHS sutil */}
      <span aria-hidden className="tv-static pointer-events-none absolute inset-0 opacity-30" />

      {/* Header */}
      <div className="relative flex items-center justify-between font-mono text-[9px] text-rose-400/80">
        <span className="text-rose-300 drop-shadow-[0_1px_3px_rgba(0,0,0,0.8)]">ABYSSAL SPECTRAL</span>
        <DiscordChip member={m} copied={copied} onCopy={onCopy} />
      </div>

      {/* Contenido */}
      <div className="relative mt-auto pt-4">
        <MemberAvatar member={m} />
        <h3 className="mt-2 font-serif text-2xl font-bold text-rose-100">DARKY</h3>
        <p className="text-xs text-rose-300/70 font-mono">{m.role}</p>
        <p className="mt-2 font-serif text-xs italic text-rose-200/90 drop-shadow-[0_1px_4px_rgba(0,0,0,0.6)]">
          {"\u201C" + m.quote + "\u201D"}
        </p>
        <div className="mt-3 font-mono text-[9px] text-rose-400/80">
          {m.status ?? "NO SIGNAL"}
        </div>
      </div>
    </div>
  );
}