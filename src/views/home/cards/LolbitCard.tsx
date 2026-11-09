"use client";

import { MemberAvatar } from "@/components/primitives/MemberAvatar";
import { DiscordChip } from "@/components/primitives/DiscordChip";
import { useLanyard } from "@/lib/lanyard";
import type { MemberCardProps } from "./types";

/* ── Lolbit: Terminal Deconstruida Hacker // Liquid Glass ── */
export function LolbitCard({ m, copied, onCopy }: MemberCardProps) {
  const { data: lanyardData } = useLanyard(m.integrations?.lanyardUserId);

  const isLive = lanyardData?.discord_status && lanyardData.discord_status !== "offline";
  const otherActivity = lanyardData?.activities?.find(
    (a) => a.type !== 2 && a.name !== "Spotify" && a.name !== "Custom Status" && a.type !== 4
  );

  return (
    <div className="quartz-glitch lolbit-glitch relative flex h-full flex-col overflow-hidden rounded-2xl border border-amber-500/20 bg-white/[0.03] p-5 shadow-[inset_0_1px_1px_rgba(255,255,255,0.1),0_8px_32px_rgba(0,0,0,0.5)] backdrop-blur-xl transition-all duration-300 hover:border-amber-400/50 hover:shadow-[inset_0_1px_2px_rgba(255,255,255,0.2),0_12px_40px_rgba(245,158,11,0.25)]">
      {/* Reflejo superior */}
      <span
        aria-hidden
        className="pointer-events-none absolute inset-x-0 top-0 h-32"
        style={{
          background:
            "linear-gradient(180deg, rgba(255,255,255,0.12) 0%, rgba(245,158,11,0.03) 45%, transparent 100%)",
        }}
      />

      {/* Scanlines sutiles */}
      <span aria-hidden className="scanlines pointer-events-none absolute inset-0 opacity-20" />
      <span
        aria-hidden
        className="pointer-events-none absolute inset-0 opacity-15"
        style={{
          backgroundImage:
            "linear-gradient(rgba(245,158,11,0.1) 1px, transparent 1px), linear-gradient(90deg, rgba(245,158,11,0.1) 1px, transparent 1px)",
          backgroundSize: "24px 24px",
        }}
      />

      {/* Header superior: telemetría */}
      <div className="relative flex items-center justify-between font-mono text-[10px] tracking-widest text-amber-400">
        <span className="text-amber-300">◢ MASTER NODE // 0x7F</span>
        <div className="flex items-center gap-2">
          <DiscordChip member={m} copied={copied} onCopy={onCopy} />
          {lanyardData ? (
            <span className="flex items-center gap-1.5 font-mono text-[10px] font-bold text-emerald-400">
              <span className="relative flex h-2 w-2">
                <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-emerald-400 opacity-75" />
                <span className="relative inline-flex h-2 w-2 rounded-full bg-emerald-400" />
              </span>
              LIVE
            </span>
          ) : (
            <span className="flex items-center gap-1.5 font-mono text-[10px] text-neutral-400/80">
              <span className="h-1.5 w-1.5 rounded-full bg-neutral-600" />
              OFFLINE
            </span>
          )}
        </div>
      </div>

      {/* Avatar + Identidad */}
      <div className="relative mt-4 flex items-center gap-3">
        <MemberAvatar member={m} />
        <div>
          <h3 className="gll-aberration font-mono text-2xl font-black text-amber-100">
            {m.displayName}
          </h3>
          <p className="font-mono text-xs text-amber-400/80">{m.role}</p>
        </div>
      </div>

      {/* Actividad en vivo */}
      {lanyardData?.listening_to_spotify && lanyardData.spotify ? (
        <div className="relative mt-4 flex items-center justify-between gap-3 overflow-hidden rounded-xl border border-emerald-500/30 bg-black/60 p-2.5 font-mono">
          <div className="flex items-center gap-2.5 min-w-0">
            {lanyardData.spotify.album_art_url && (
              /* eslint-disable-next-line @next/next/no-img-element */
              <img
                src={lanyardData.spotify.album_art_url}
                alt={lanyardData.spotify.album ?? "Album"}
                className="h-10 w-10 shrink-0 rounded-lg object-cover border border-emerald-500/30 shadow-sm"
              />
            )}
            <div className="min-w-0">
              <div className="flex items-center gap-1.5 text-[9px] font-bold uppercase tracking-widest text-emerald-400">
                <span className="text-xs">♫</span>
                <span>LISTENING</span>
              </div>
              <p className="truncate text-xs font-medium text-emerald-100">
                {lanyardData.spotify.song}{" "}
                <span className="text-emerald-400/70">— {lanyardData.spotify.artist}</span>
              </p>
            </div>
          </div>
          <div className="flex h-4 items-end gap-0.5 shrink-0 pr-1" aria-hidden>
            {Array.from({ length: 4 }, (_, i) => (
              <span
                key={i}
                className="eq-mini w-1 rounded-sm bg-emerald-400"
                style={{ animationDelay: `${(i % 4) * 0.18}s` }}
              />
            ))}
          </div>
        </div>
      ) : isLive && otherActivity ? (
        <div className="relative mt-4 flex items-center gap-2.5 overflow-hidden rounded-xl border border-amber-500/30 bg-black/60 px-3 py-2.5 font-mono">
          <span className="text-amber-400 text-xs shrink-0">▶</span>
          <div className="min-w-0 truncate text-xs">
            <span className="font-semibold text-amber-200">{otherActivity.name}</span>
            {(otherActivity.details || otherActivity.state) && (
              <span className="text-amber-400/80">
                : {otherActivity.details || otherActivity.state}
              </span>
            )}
          </div>
        </div>
      ) : (
        <div className="relative mt-4 rounded-xl border border-white/10 bg-black/60 px-3 py-2.5 font-mono">
          <span className="text-[10px] text-neutral-500">$ STATUS: STANDBY</span>
        </div>
      )}

      {/* Ecualizador inferior */}
      <div className="relative mt-auto pt-4">
        <div className="flex h-5 items-end gap-1" aria-hidden>
          {Array.from({ length: 16 }, (_, i) => (
            <span
              key={i}
              className={`eq-mini w-full ${isLive ? "bg-amber-500/80" : "bg-neutral-600/50"}`}
              style={{ animationDelay: `${(i % 5) * 0.15}s` }}
            />
          ))}
        </div>
        <div className="mt-1 flex items-center justify-between font-mono text-[9px] tracking-wider text-amber-500/80">
          <span>FREQ // 84.2MHz</span>
          <span>{lanyardData ? (isLive ? "SYS.ONLINE" : "SYS.STANDBY") : "SYS.STANDBY"}</span>
        </div>
      </div>
      <span aria-hidden className="gll-tear" />
    </div>
  );
}