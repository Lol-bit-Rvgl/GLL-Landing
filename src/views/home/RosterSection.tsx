"use client";

import { useState } from "react";
import Link from "next/link";
import {
  FACTION_FILTERS,
  getMemberDiscord,
  getRosterMembers,
} from "@/data/members";
import type { Member, MemberFaction } from "@/types/member";
import { MemberCard } from "./MemberCard";

/**
 * ROSTER SECTION - Digital Archive Roster
 *
 * Grid de integrantes visualizados como entradas de archivo digital.
 * Cada miembro conserva su identidad visual personalizada.
 */
export function RosterSection() {
  const [filter, setFilter] = useState<"ALL" | MemberFaction>("ALL");
  const [query, setQuery] = useState("");
  const [copied, setCopied] = useState<string | null>(null);

  const roster = getRosterMembers();

  const matches = (member: Member) => {
    const factionOk = filter === "ALL" || member.faction === filter;
    const q = query.trim().toLowerCase();
    const queryOk =
      q === "" || `${member.displayName} ${member.role}`.toLowerCase().includes(q);
    return factionOk && queryOk;
  };
  const filtered = roster.filter(matches);

  const copyDiscord = async (e: React.MouseEvent, slug: string) => {
    e.preventDefault();
    e.stopPropagation();
    const tag = getMemberDiscord(slug);
    if (!tag) return;
    try {
      await navigator.clipboard.writeText(tag);
      setCopied(slug);
      setTimeout(() => setCopied((c) => (c === slug ? null : c)), 2000);
    } catch {
      /* Portapapeles no disponible */
    }
  };

  // Determine card span based on cardSize
  const cardSpan = (m: Member) =>
    m.cardSize === "wide" ? "col-span-1 sm:col-span-2 lg:col-span-2" : "col-span-1";

  return (
    <section className="relative z-10 mx-auto mt-16 w-full max-w-7xl px-4 py-8 sm:px-6">
      {/* === ENCABEZADO DEL ARCHIVO === */}
      <div className="text-center">
        <div className="inline-block border-y border-red-600/40 py-2">
          <h2 className="font-mono text-xl font-black tracking-widest text-zinc-100 sm:text-2xl lg:text-3xl">
            [ ✦ ARCHIVE // DIGITAL ROSTER ✦ ]
          </h2>
        </div>
        <p className="mt-3 font-mono text-[11px] tracking-[0.3em] text-zinc-400">
          BIOMETRIC RECORD // SIGNAL ID: GLL-001
        </p>
      </div>

      {/* === CONTROLES DE FILTRADO === */}
      <div className="mt-8 flex flex-wrap items-center justify-between gap-3 border-y border-white/10 py-3">
        {/* Faction Filter Tags */}
        <div className="flex flex-wrap items-center gap-2">
          {FACTION_FILTERS.map((f) => {
            const isAll = f === "ALL";
            const factionClasses = {
              ALL: "border-red-400/50 bg-red-600/20 text-red-300",
              ARCHIVE: "border-cyan-400/50 bg-cyan-400/20 text-cyan-300",
              COMBAT: "border-pink-400/50 bg-pink-400/20 text-pink-300",
              VOID: "border-red-400/50 bg-red-400/20 text-red-300",
              SOLAR: "border-amber-400/50 bg-amber-400/20 text-amber-300",
              LUNAR: "border-blue-400/50 bg-blue-400/20 text-blue-300",
              NEBULA: "border-purple-400/50 bg-purple-400/20 text-purple-300",
              CHRONO: "border-green-400/50 bg-green-400/20 text-green-300",
            };
            return (
              <button
                key={f}
                onClick={() => setFilter(f)}
                className={`border px-3 py-1.5 font-mono text-[10px] tracking-[0.2em] transition ${
                  filter === f
                    ? "bg-red-600/25 text-white shadow-[0_0_12px_rgba(220,38,38,0.4)]"
                    : `border-white/10 bg-white/5 text-zinc-400 hover:border-white/30 hover:text-white ${factionClasses[f]}`
                  }`}
              >
                <span className={isAll ? "text-red-400" : "text-pink-300"}>{f}</span>
              </button>
            );
          })}
        </div>

        {/* Search + Count */}
        <div className="flex flex-1 items-center justify-end gap-3 sm:flex-initial">
          <div className="relative flex-1 sm:w-64">
            <input
              type="text"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="FILTRAR // nombre, rol..."
              aria-label="Buscar integrantes"
              className="w-full border border-white/10 bg-white/5 px-3 py-1.5 font-mono text-xs text-zinc-200 outline-none transition focus:border-red-500 rounded"
            />
            <svg
              className="absolute right-2 top-1/2 -translate-y-1/2 h-4 w-4 text-zinc-500"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-4.35-4.35m0 0A7.5 7.5 0 1116.65 16.65z" />
            </svg>
          </div>
          <span className="shrink-0 font-mono text-[10px] tracking-wider text-zinc-400">
            [<strong className="text-red-400">{filtered.length}</strong>/{roster.length}]
          </span>
        </div>
      </div>

      {/* === GRID DE ROSTRO === */}
      <div className="mt-8 grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4 auto-rows-[280px]">
        {filtered.map((m) => (
          <Link
            key={m.slug}
            href={`/gll/${m.slug}`}
            className={`group block h-full w-full ${cardSpan(m)}`}
          >
            <MemberCard m={m} t={m.theme.card} copied={copied} onCopy={copyDiscord} />
          </Link>
        ))}
      </div>

      {/* === EMPTY STATE === */}
      {filtered.length === 0 && (
        <div className="mt-12 rounded-xl border border-dashed border-white/10 p-12 text-center font-mono text-xs tracking-widest text-zinc-500">
          NO SIGNAL DETECTED // CLEAR FILTER OR SEARCH
        </div>
      )}
    </section>
  );
}