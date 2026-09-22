"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import type { Member } from "@/data/members";
import { ArrowLeft, Terminal, ChevronDown } from "lucide-react";

const FX_STYLES = `
@keyframes lolbit-badge-ping {
  0%, 100% { opacity: 1; }
  50% { opacity: 0.25; }
}
.lolbit-badge-dot { animation: lolbit-badge-ping 1.6s ease-in-out infinite; }

@keyframes lolbit-caret {
  0%, 49% { opacity: 1; }
  50%, 100% { opacity: 0; }
}
.lolbit-caret { animation: lolbit-caret 1s steps(1) infinite; }

@keyframes lolbit-term-flicker {
  0%, 96%, 100% { opacity: 1; }
  97% { opacity: 0.92; }
  98% { opacity: 0.98; }
  99% { opacity: 0.94; }
}
.lolbit-term { animation: lolbit-term-flicker 7s linear infinite; }

/* Línea del Highlight Reel en hover: resplandor ámbar suave */
.lolbit-reel-item {
  transition: color 0.35s ease;
}
.lolbit-reel-item:hover {
  color: #fff7ed;
}
.lolbit-reel-item:hover .lolbit-reel-title {
  text-shadow: 0 0 24px rgba(249, 115, 22, 0.45);
  color: #fdba74;
}
.lolbit-reel-item:hover .lolbit-reel-rule {
  border-color: rgba(249, 115, 22, 0.5);
  box-shadow: 0 0 18px rgba(249, 115, 22, 0.25);
}
.lolbit-reel-badge {
  opacity: 0;
  transform: translateX(8px);
  transition: opacity 0.35s ease, transform 0.35s ease;
}
.lolbit-reel-item:hover .lolbit-reel-badge {
  opacity: 1;
  transform: translateX(0);
}
`;

/* ══ 2. THE HIGHLIGHT REEL // Registro de Sistemas y Proyectos ══ */
const REEL_ITEMS: {
  id: string;
  title: string;
  description: string;
  year: string;
  badge: string;
  badgeClass: string;
}[] = [
  {
    id: "01",
    title: "KYUBI SOCIAL CORE",
    description:
      "Distributed real-time sockets, client state hydration & cross-platform UX.",
    year: "2026",
    badge: "[DEPLOYED]",
    badgeClass: "border-emerald-500/50 bg-emerald-500/10 text-emerald-300",
  },
  {
    id: "02",
    title: "TACTICAL ARCHIVE ENGINE",
    description:
      "Next.js hybrid architecture, diegetic sound design & 3D WebGL runtimes.",
    year: "2025",
    badge: "[ONLINE]",
    badgeClass: "border-[#f97316]/50 bg-[#f97316]/10 text-[#fdba74]",
  },
  {
    id: "03",
    title: "ZERO-TRUST TUNNEL INFRASTRUCTURE",
    description:
      "SSH reverse tunneling, JWT security paradigms & defensive honey-grids.",
    year: "2025",
    badge: "[CLASSIFIED]",
    badgeClass: "border-red-500/50 bg-red-500/10 text-red-300",
  },
  {
    id: "04",
    title: "AUTONOMOUS RUNTIME LOGS",
    description:
      "Philosophy of ethical deconstruction, memory caching & digital identity.",
    year: "2024",
    badge: "[ONLINE]",
    badgeClass: "border-[#f97316]/50 bg-[#f97316]/10 text-[#fdba74]",
  },
];

const CORE_CAPABILITIES = [
  "Flutter",
  "Dart",
  "Next.js",
  "TypeScript",
  "Network Security",
  "Reverse Proxies",
];

export function LolbitProfile({ member }: { member: Member }) {
  // Protección de hidratación SSR/Turbopack
  const [mounted, setMounted] = useState(false);
  const [termOpen, setTermOpen] = useState(false);
  const [now, setNow] = useState("");

  useEffect(() => {
    setMounted(true);
    const tick = () =>
      setNow(new Date().toLocaleTimeString("es-ES", { hour12: false }));
    tick();
    const id = setInterval(tick, 1000);
    return () => clearInterval(id);
  }, []);

  if (!mounted) {
    return (
      <main className="flex min-h-screen items-center justify-center bg-[#060608] font-mono text-neutral-200">
        <div className="flex items-center gap-3 text-sm tracking-widest text-[#f97316]">
          <span className="lolbit-badge-dot h-2 w-2 rounded-full bg-[#f97316]" />
          LOADING MONOGRAPH // 0x7F...
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-[#060608] text-neutral-300 antialiased selection:bg-[#f97316]/30">
      <style>{FX_STYLES}</style>

      {/* ══ 1. HERO EDITORIAL MONUMENTAL (MONOGRAPH HEADER) ══ */}
      <article className="mx-auto max-w-5xl px-6 pt-24 pb-16">
        {/* Cabecera: retorno diegético + micro-badge de runtime */}
        <header className="flex flex-wrap items-center justify-between gap-4 border-t border-neutral-800/60 pt-8">
          <Link
            href="/"
            className="group inline-flex items-center gap-2 font-mono text-xs tracking-widest text-neutral-500 transition-colors hover:text-[#f97316]"
          >
            <ArrowLeft className="h-3.5 w-3.5 transition-transform group-hover:-translate-x-1" />
            <span>[ ← GLL // SECTOR ZERO ]</span>
          </Link>

          <div className="inline-flex items-center gap-2.5 rounded-full border border-[#f97316]/30 bg-[#f97316]/5 px-3.5 py-1 font-mono text-[11px] tracking-widest text-[#f97316]">
            <span className="lolbit-badge-dot h-1.5 w-1.5 rounded-full bg-[#f97316] shadow-[0_0_8px_#f97316]" />
            <span>● 0x7F // ETHICAL RUNTIME // FREQ 84.2MHz</span>
          </div>
        </header>

        {/* Título tipográfico imponente + avatar con máscara técnica */}
        <div className="mt-16 flex flex-col items-start gap-8 sm:flex-row sm:items-end sm:justify-between">
          <h1 className="font-sans text-7xl font-black leading-none tracking-tighter text-neutral-50 sm:text-8xl lg:text-9xl">
            LOLBIT
          </h1>

          {/* Avatar circular con máscara técnica y halo ámbar tenue */}
          <div className="relative shrink-0">
            <span
              aria-hidden
              className="pointer-events-none absolute -inset-6 rounded-full"
              style={{
                background:
                  "radial-gradient(circle, rgba(249,115,22,0.18) 0%, transparent 70%)",
              }}
            />
            <div className="relative h-28 w-28 overflow-hidden rounded-full ring-1 ring-[#f97316]/40 sm:h-32 sm:w-32">
              <Image
                src="/images/members/lolbit/avatars.jpeg"
                alt={member.displayName}
                fill
                priority
                className="object-cover"
              />
            </div>
            {/* Ticks de mira técnico */}
            <span aria-hidden className="absolute -top-2 left-1/2 h-2 w-px -translate-x-1/2 bg-[#f97316]/60" />
            <span aria-hidden className="absolute -bottom-2 left-1/2 h-2 w-px -translate-x-1/2 bg-[#f97316]/60" />
            <span aria-hidden className="absolute -left-2 top-1/2 h-px w-2 -translate-y-1/2 bg-[#f97316]/60" />
            <span aria-hidden className="absolute -right-2 top-1/2 h-px w-2 -translate-y-1/2 bg-[#f97316]/60" />
          </div>
        </div>

        {/* Statement editorial de gran escala */}
        <p className="mt-12 max-w-3xl font-sans text-2xl font-medium leading-snug tracking-tight text-neutral-100 sm:text-4xl">
          Designing resilient digital structures, deconstructing systems, and
          orchestrating autonomous realities.
        </p>

        <p className="mt-6 font-mono text-xs tracking-[0.25em] text-neutral-500 uppercase">
          Autonomous Runtime // Ethical Dev — {member.role}
        </p>

        {/* ══ 2. THE HIGHLIGHT REEL // REGISTRO DE SISTEMAS ══ */}
        <section className="mt-24 border-t border-neutral-800/60 pt-14">
          <div className="mb-2 flex items-baseline justify-between">
            <h2 className="font-mono text-xs font-bold tracking-[0.3em] text-neutral-500 uppercase">
              The Highlight Reel
            </h2>
            <span className="font-mono text-[10px] tracking-widest text-neutral-600">
              04 ENTRIES // SYSTEM LOG
            </span>
          </div>

          <ul>
            {REEL_ITEMS.map((item) => (
              <li
                key={item.id}
                className="lolbit-reel-item group border-b border-neutral-800/50 py-7"
              >
                <div className="lolbit-reel-rule -mx-2 flex flex-wrap items-baseline gap-x-6 gap-y-1 border-l-2 border-transparent px-2 transition-all duration-300">
                  <span className="font-mono text-xs text-neutral-600">
                    {item.id}.
                  </span>
                  <h3 className="lolbit-reel-title font-sans text-lg font-bold tracking-tight text-neutral-200 sm:text-xl">
                    {item.title}
                  </h3>
                  <span className="hidden flex-1 md:block" />
                  <span className="font-mono text-[10px] tracking-widest text-neutral-600">
                    {item.year}
                  </span>
                  <span
                    className={`lolbit-reel-badge inline-block border px-2 py-0.5 font-mono text-[10px] font-bold tracking-widest ${item.badgeClass}`}
                  >
                    {item.badge}
                  </span>
                </div>
                <p className="mt-1.5 pl-10 font-mono text-xs leading-relaxed text-neutral-500 sm:text-[13px]">
                  {item.description}
                </p>
              </li>
            ))}
          </ul>
        </section>

        {/* ══ 3. FICHA TÉCNICA MODULAR (DESIGN & SYSTEM SPECS) ══ */}
        <section className="mt-24 border-t border-neutral-800/60 pt-14">
          <h2 className="mb-10 font-mono text-xs font-bold tracking-[0.3em] text-neutral-500 uppercase">
            Design &amp; System Specs
          </h2>

          {/* Módulo A: Core Capabilities */}
          <div className="border-b border-neutral-800/50 pb-10">
            <p className="font-mono text-[10px] tracking-[0.3em] text-[#f97316]/80 uppercase">
              Module A // Core Capabilities
            </p>
            <div className="mt-4 flex flex-wrap gap-2">
              {CORE_CAPABILITIES.map((cap) => (
                <span
                  key={cap}
                  className="border border-neutral-800 bg-neutral-900/40 px-3 py-1.5 font-mono text-xs text-neutral-300 transition-colors hover:border-[#f97316]/50 hover:text-[#fdba74]"
                >
                  {cap}
                </span>
              ))}
            </div>
          </div>

          {/* Módulo B: System Philosophy */}
          <div className="border-b border-neutral-800/50 py-10">
            <p className="font-mono text-[10px] tracking-[0.3em] text-[#f97316]/80 uppercase">
              Module B // System Philosophy
            </p>
            <blockquote className="mt-5 max-w-3xl font-serif text-2xl italic leading-snug text-neutral-100 sm:text-3xl">
              &ldquo;SYSTEM ONLINE. Playtime is over.&rdquo;
            </blockquote>
            <p className="mt-3 font-mono text-[11px] tracking-widest text-neutral-600">
              — LOLBIT // AUTONOMOUS RUNTIME
            </p>
          </div>

          {/* Módulo C: Interactive Terminal Console (plegable) */}
          <div className="py-10">
            <button
              onClick={() => setTermOpen((v) => !v)}
              aria-expanded={termOpen}
              className="group flex w-full items-center justify-between text-left"
            >
              <span className="inline-flex items-center gap-2 font-mono text-[10px] tracking-[0.3em] text-[#f97316]/80 uppercase transition-colors group-hover:text-[#f97316]">
                <Terminal className="h-3.5 w-3.5" />
                Module C // Interactive Terminal Console
              </span>
              <span className="inline-flex items-center gap-2 font-mono text-[10px] tracking-widest text-neutral-500 transition-colors group-hover:text-neutral-300">
                {termOpen ? "[ COLLAPSE ]" : "[ EXPAND ]"}
                <ChevronDown
                  className={`h-3.5 w-3.5 transition-transform duration-300 ${
                    termOpen ? "rotate-180" : ""
                  }`}
                />
              </span>
            </button>

            {termOpen && (
              <div className="lolbit-term mt-4 overflow-hidden rounded-lg border border-neutral-800 bg-black/80 shadow-[0_0_40px_rgba(249,115,22,0.08)]">
                {/* Barra de consola */}
                <div className="flex items-center justify-between border-b border-neutral-800 bg-neutral-950 px-4 py-2 font-mono text-[10px] tracking-widest text-neutral-500">
                  <span>lolbit@runtime:~$</span>
                  <span className="text-emerald-400">● LIVE // {now}</span>
                </div>

                {/* Salida de $ exec --status */}
                <div className="space-y-1 px-4 py-4 font-mono text-xs leading-relaxed">
                  <p className="text-neutral-400">
                    <span className="text-[#f97316]">$</span> exec --status
                    <span className="lolbit-caret ml-1 text-[#f97316]">▊</span>
                  </p>
                  <p className="text-emerald-400">
                    [OK] runtime.ethical .......... ACTIVE
                  </p>
                  <p className="text-neutral-400">
                    [SYS] node_id ................ 0x7F
                  </p>
                  <p className="text-neutral-400">
                    [NET] freq ................... 84.2 MHz
                  </p>
                  <p className="text-neutral-400">
                    [MEM] cache .................. 512MB // warm
                  </p>
                  <p className="text-neutral-400">
                    [SEC] honey-grid ............. ARMED
                  </p>
                  <p className="text-[#fdba74]">
                    [LOG] playtime over. autonomy retained.
                  </p>
                </div>
              </div>
            )}
          </div>
        </section>

        {/* Pie del monograph */}
        <footer className="mt-16 flex items-center justify-between border-t border-neutral-800/60 pt-6 font-mono text-[10px] tracking-[0.25em] text-neutral-600 uppercase">
          <span>GLL // GOD&apos;S LIVE LONGER™</span>
          <span>0x7F // END OF FILE</span>
        </footer>
      </article>
    </main>
  );
}
