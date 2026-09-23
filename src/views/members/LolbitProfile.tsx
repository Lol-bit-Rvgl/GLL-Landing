"use client";

import { useEffect, useRef, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import type { Member } from "@/data/members";
import {
  ArrowLeft,
  ChevronDown,
  Terminal,
  Volume2,
  VolumeX,
} from "lucide-react";

const FX_STYLES = `
@keyframes lolbit-dot-pulse {
  0%, 100% { opacity: 1; box-shadow: 0 0 8px #f97316; }
  50% { opacity: 0.3; box-shadow: none; }
}
.lolbit-dot { animation: lolbit-dot-pulse 1.8s ease-in-out infinite; }

@keyframes lolbit-caret {
  0%, 49% { opacity: 1; }
  50%, 100% { opacity: 0; }
}
.lolbit-caret { animation: lolbit-caret 1s steps(1) infinite; }

@keyframes lolbit-scan-drift {
  0% { background-position: 0 0; }
  100% { background-position: 0 120px; }
}
.lolbit-preview-scan {
  background-image: repeating-linear-gradient(
    0deg,
    rgba(255,255,255,0.07) 0px,
    rgba(255,255,255,0.07) 1px,
    transparent 1px,
    transparent 4px
  );
  animation: lolbit-scan-drift 6s linear infinite;
}

@keyframes lolbit-eq {
  0%, 100% { transform: scaleY(0.25); }
  50% { transform: scaleY(1); }
}
.lolbit-eq-bar {
  animation: lolbit-eq 0.9s ease-in-out infinite;
  transform-origin: bottom;
}

/* Abertura suave del drawer editorial */
.lolbit-drawer {
  display: grid;
  grid-template-rows: 0fr;
  transition: grid-template-rows 0.5s cubic-bezier(0.22, 1, 0.36, 1);
}
.lolbit-drawer.open {
  grid-template-rows: 1fr;
}
.lolbit-drawer > div {
  overflow: hidden;
}
`;

/* ══════════════════════════════════════════════════════════════
   DATA // THE INTERACTIVE INDEX
   ══════════════════════════════════════════════════════════════ */
interface IndexEntry {
  id: string;
  title: string;
  tag: string;
  year: string;
  status: string;
  statusClass: string;
  previewImage: string;
  telemetry: [string, string][];
  drawer: {
    stack: string[];
    problem: string;
    perf: [string, string][];
  };
}

const INDEX: IndexEntry[] = [
  {
    id: "01",
    title: "KYUBI SOCIAL CORE",
    tag: "DISTRIBUTED SOCKETS",
    year: "2026",
    status: "DEPLOYED",
    statusClass: "text-emerald-400",
    previewImage: "/images/members/lolbit/monitors.jpeg",
    telemetry: [
      ["SIGNAL", "84.2 MHz"],
      ["HYDRATION", "100%"],
      ["LATENCY", "12ms"],
    ],
    drawer: {
      stack: ["Next.js", "TypeScript", "WebSockets", "Tailwind CSS", "REST"],
      problem:
        "Cliente social en tiempo real: feed reactivo, hidratación de estado en cliente y experiencia consistente entre plataformas. Sockets distribuidos mantienen la presencia sincronizada sin sacrificar el primer render.",
      perf: [
        ["FIRST PAINT", "0.9s"],
        ["SOCKET RECONNECT", "< 800ms"],
        ["STATE SYNC", "optimistic"],
      ],
    },
  },
  {
    id: "02",
    title: "TACTICAL ARCHIVE",
    tag: "3D WEBGL RUNTIME",
    year: "2025",
    status: "ONLINE",
    statusClass: "text-[#f97316]",
    previewImage: "/images/members/lolbit/fondo.jpg",
    telemetry: [
      ["GPU", "WebGL // instanced"],
      ["SOUND", "diegetic loop"],
      ["ENTITIES", "36 active"],
    ],
    drawer: {
      stack: ["Next.js", "Three.js", "React Three Fiber", "USDZ", "WebAudio"],
      problem:
        "Archivo 3D diegético para el clan GLL: renderizado instanciado en WebGL, diseño sonoro ambiental y carga diferida de escenas complejas sin congelar el hilo principal.",
      perf: [
        ["FRAME BUDGET", "16ms"],
        ["MODEL PAYLOAD", "scene.usdz"],
        ["DRAW CALLS", "batched"],
      ],
    },
  },
  {
    id: "03",
    title: "ZERO-TRUST TUNNEL",
    tag: "SECURITY PARADIGM",
    year: "2025",
    status: "CLASSIFIED",
    statusClass: "text-red-400",
    previewImage: "/images/members/lolbit/static.jpg",
    telemetry: [
      ["SSH", "reverse tunnel"],
      ["JWT", "rotated keys"],
      ["HONEY-GRID", "armed"],
    ],
    drawer: {
      stack: ["SSH Reverse Tunneling", "JWT", "Proxies", "Honeypots", "Python"],
      problem:
        "Infraestructura de laboratorio controlado: túneles reversos para exponer servicios sin abrir puertos, autenticación con claves rotadas y trampas defensivas con telemetría de intrusiones.",
      perf: [
        ["INTRUSION LOGS", "streaming"],
        ["KEY ROTATION", "automated"],
        ["OPEN PORTS", "0"],
      ],
    },
  },
  {
    id: "04",
    title: "RUNTIME PHILOSOPHY",
    tag: "AUTONOMOUS LOGS",
    year: "2024",
    status: "ONLINE",
    statusClass: "text-[#f97316]",
    previewImage: "/images/members/lolbit/terminal.jpg",
    telemetry: [
      ["MEMORY", "512MB warm"],
      ["CACHE HIT", "97.4%"],
      ["IDENTITY", "autonomous"],
    ],
    drawer: {
      stack: ["Flutter", "Dart", "Memory Caching", "Reactive State"],
      problem:
        "Manifiesto técnico de deconstrucción ética: entender los sistemas desde dentro, cachear la memoria relevante y construir identidad digital soberana. Playtime is over.",
      perf: [
        ["COLD BOOT", "1.2s"],
        ["CACHE LAYER", "perceptual"],
        ["ETHICS", "non-negotiable"],
      ],
    },
  },
];

/* ══════════════════════════════════════════════════════════════
   FLOATING HOVER PREVIEW (spring physics sin framer-motion)
   ══════════════════════════════════════════════════════════════ */
function FloatingPreview({ entry }: { entry: IndexEntry | null }) {
  const layerRef = useRef<HTMLDivElement>(null);
  const target = useRef({ x: 0, y: 0 });
  const pos = useRef({ x: 0, y: 0, rot: 0 });
  const [visible, setVisible] = useState(false);

  // Seguimiento del mouse — solo en cliente
  useEffect(() => {
    const onMove = (e: MouseEvent) => {
      target.current.x = e.clientX;
      target.current.y = e.clientY;
    };
    window.addEventListener("mousemove", onMove);
    return () => window.removeEventListener("mousemove", onMove);
  }, []);

  // Bucle de física: muelle amortiguado + rotación por velocidad horizontal
  useEffect(() => {
    let raf: number;
    const tick = () => {
      const p = pos.current;
      const t = target.current;
      // spring: stiffness 0.14, damping natural vía interpolación por frame
      const prevX = p.x;
      p.x += (t.x - p.x) * 0.14;
      p.y += (t.y - p.y) * 0.14;
      const vel = p.x - prevX;
      const targetRot = Math.max(-8, Math.min(8, vel * 0.35));
      p.rot += (targetRot - p.rot) * 0.1;

      if (layerRef.current) {
        layerRef.current.style.transform = `translate3d(${p.x + 28}px, ${
          p.y - 140
        }px, 0) rotate(${p.rot}deg) scale(${visible ? 1 : 0.9})`;
        layerRef.current.style.opacity = visible ? "1" : "0";
      }
      raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [visible]);

  const wasVisible = useRef(false);
  useEffect(() => {
    if (entry && !wasVisible.current) {
      // Colocar el visor en la posición actual del puntero al aparecer
      pos.current.x = target.current.x;
      pos.current.y = target.current.y;
    }
    wasVisible.current = !!entry;
    const show = setTimeout(() => setVisible(!!entry), 30);
    return () => clearTimeout(show);
  }, [entry]);

  return (
    <div
      ref={layerRef}
      aria-hidden
      className="pointer-events-none fixed left-0 top-0 z-50 hidden w-64 opacity-0 md:block"
      style={{ willChange: "transform, opacity" }}
    >
      <div className="overflow-hidden rounded-md border border-neutral-700/80 bg-neutral-950/90 shadow-[0_20px_60px_rgba(0,0,0,0.7),0_0_30px_rgba(249,115,22,0.12)] backdrop-blur-md">
        {/* Imagen técnica + scanlines */}
        <div className="relative h-32 w-full overflow-hidden">
          {entry && (
            <Image
              src={entry.previewImage}
              alt=""
              fill
              className="object-cover opacity-80"
            />
          )}
          <span aria-hidden className="lolbit-preview-scan absolute inset-0" />
          <span
            aria-hidden
            className="absolute inset-0 bg-gradient-to-t from-neutral-950/90 to-transparent"
          />
        </div>
        {/* Telemetría compacta */}
        <div className="space-y-1 px-3 py-2.5 font-mono text-[10px] leading-relaxed">
          <p className="flex items-center justify-between text-neutral-500">
            <span className="tracking-widest">PREVIEW // {entry?.id}</span>
            <span className={`font-bold ${entry?.statusClass ?? ""}`}>
              {entry?.status}
            </span>
          </p>
          {entry?.telemetry.map(([k, v]) => (
            <p key={k} className="flex items-center justify-between">
              <span className="text-neutral-600">[{k}]</span>
              <span className="text-neutral-300">{v}</span>
            </p>
          ))}
          {/* Mini EQ decorativo */}
          <div className="flex h-3 items-end gap-[2px] pt-1" aria-hidden>
            {Array.from({ length: 24 }, (_, i) => (
              <span
                key={i}
                className="lolbit-eq-bar w-full bg-[#f97316]/70"
                style={{
                  animationDelay: `${(i % 6) * 0.12}s`,
                  animationDuration: `${0.6 + (i % 4) * 0.14}s`,
                }}
              />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

/* ══════════════════════════════════════════════════════════════
   FILA DEL ÍNDICE + DRAWER TÉCNICO
   ══════════════════════════════════════════════════════════════ */
function IndexRow({
  entry,
  open,
  onToggle,
  onHover,
}: {
  entry: IndexEntry;
  open: boolean;
  onToggle: () => void;
  onHover: (entry: IndexEntry | null) => void;
}) {
  return (
    <li className="border-t border-neutral-800/80">
      {/* Strip horizontal */}
      <button
        onClick={onToggle}
        onMouseEnter={() => onHover(entry)}
        onMouseLeave={() => onHover(null)}
        aria-expanded={open}
        className="group flex w-full items-baseline justify-between gap-4 py-8 text-left transition-colors duration-300 hover:text-[#f97316]"
      >
        {/* Izquierda: número + título + micro-tag */}
        <span className="flex min-w-0 items-baseline gap-4 sm:gap-6">
          <span className="font-mono text-xs text-neutral-600 transition-colors group-hover:text-[#f97316]">
            {entry.id}
          </span>
          <span className="min-w-0">
            <span className="block truncate font-sans text-2xl font-medium tracking-tight text-white transition-colors group-hover:text-[#fdba74] sm:text-4xl">
              {entry.title}
            </span>
            <span className="mt-1 block font-mono text-[10px] tracking-[0.3em] text-neutral-500 uppercase transition-colors group-hover:text-[#f97316]/80">
              {entry.tag}
            </span>
          </span>
        </span>

        {/* Derecha: año / estado */}
        <span className="flex shrink-0 items-baseline gap-4 font-mono text-[11px] tracking-widest sm:gap-6">
          <span className="hidden text-neutral-600 sm:inline">{entry.year}</span>
          <span className={entry.statusClass}>{entry.status}</span>
          <ChevronDown
            className={`h-3.5 w-3.5 text-neutral-600 transition-transform duration-500 ${
              open ? "rotate-180 text-[#f97316]" : "group-hover:text-neutral-300"
            }`}
          />
        </span>
      </button>

      {/* Drawer / acordeón suave */}
      <div className={`lolbit-drawer ${open ? "open" : ""}`}>
        <div>
          <div className="grid grid-cols-1 gap-8 pb-10 pl-8 pr-2 sm:pl-12 md:grid-cols-3">
            {/* Problema resuelto */}
            <div className="md:col-span-2">
              <p className="font-mono text-[10px] tracking-[0.3em] text-neutral-600 uppercase">
                Case // Problem Solved
              </p>
              <p className="mt-3 max-w-xl text-sm leading-relaxed text-neutral-400">
                {entry.drawer.problem}
              </p>
            </div>

            {/* Stack + telemetría de rendimiento */}
            <div className="space-y-6">
              <div>
                <p className="font-mono text-[10px] tracking-[0.3em] text-neutral-600 uppercase">
                  Stack
                </p>
                <div className="mt-3 flex flex-wrap gap-1.5">
                  {entry.drawer.stack.map((s) => (
                    <span
                      key={s}
                      className="border border-neutral-800 px-2 py-0.5 font-mono text-[10px] text-neutral-300"
                    >
                      {s}
                    </span>
                  ))}
                </div>
              </div>
              <div>
                <p className="font-mono text-[10px] tracking-[0.3em] text-neutral-600 uppercase">
                  Perf Telemetry
                </p>
                <div className="mt-3 space-y-1 font-mono text-[11px]">
                  {entry.drawer.perf.map(([k, v]) => (
                    <p key={k} className="flex justify-between gap-4">
                      <span className="text-neutral-600">[{k}]</span>
                      <span className="text-[#f97316]">{v}</span>
                    </p>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </li>
  );
}

/* ══════════════════════════════════════════════════════════════
   MAIN PROFILE
   ══════════════════════════════════════════════════════════════ */
export function LolbitProfile({ member }: { member: Member }) {
  const [mounted, setMounted] = useState(false);
  const [clock, setClock] = useState("");
  const [audio, setAudio] = useState(false);
  const [hovered, setHovered] = useState<IndexEntry | null>(null);
  const [openIndex, setOpenIndex] = useState<number | null>(null);
  const [termOpen, setTermOpen] = useState(false);

  useEffect(() => {
    setMounted(true);
    const tick = () =>
      setClock(
        new Date().toLocaleTimeString("es-ES", {
          hour: "2-digit",
          minute: "2-digit",
          second: "2-digit",
        })
      );
    tick();
    const id = setInterval(tick, 1000);
    return () => clearInterval(id);
  }, []);

  if (!mounted) {
    return (
      <main className="flex min-h-screen items-center justify-center bg-[#060608] font-mono text-neutral-200">
        <div className="flex items-center gap-3 text-sm tracking-widest text-[#f97316]">
          <span className="lolbit-dot h-2 w-2 rounded-full bg-[#f97316]" />
          BOOTING MONOGRAPH // 0x7F...
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-[#060608] text-neutral-300 antialiased selection:bg-[#f97316]/30">
      <style>{FX_STYLES}</style>

      {/* Visor flotante que sigue al cursor */}
      <FloatingPreview entry={hovered} />

      <article className="mx-auto max-w-5xl px-6 pb-24 pt-16 sm:pt-24">
        {/* ══ TOP BAR ULTRA LIMPIA ══ */}
        <header className="flex items-center justify-between border-b border-neutral-800/80 pb-5 font-mono text-[11px] tracking-widest">
          <Link
            href="/"
            className="group inline-flex items-center gap-2 text-neutral-500 transition-colors hover:text-[#f97316]"
          >
            <ArrowLeft className="h-3.5 w-3.5 transition-transform group-hover:-translate-x-1" />
            <span>[ ← BACK // GLL SECTOR ZERO ]</span>
          </Link>

          <div className="flex items-center gap-4 sm:gap-6">
            {/* Micro-toggle AUDIO */}
            <button
              onClick={() => setAudio((a) => !a)}
              aria-pressed={audio}
              className="inline-flex items-center gap-1.5 text-neutral-500 transition-colors hover:text-neutral-200"
            >
              {audio ? (
                <Volume2 className="h-3 w-3 text-[#f97316]" />
              ) : (
                <VolumeX className="h-3 w-3" />
              )}
              <span>
                AUDIO: <span className={audio ? "text-[#f97316]" : ""}>{audio ? "[ON]" : "[OFF]"}</span>
              </span>
            </button>

            {/* Reloj local + nodo */}
            <span className="hidden items-center gap-2 text-neutral-500 sm:inline-flex">
              <span className="lolbit-dot h-1.5 w-1.5 rounded-full bg-[#f97316]" />
              <span className="text-neutral-300 tabular-nums">{clock}</span>
              <span className="text-neutral-600">// 0x7F</span>
            </span>
          </div>
        </header>

        {/* ══ TIPOGRAFÍA MONUMENTAL ══ */}
        <h1 className="pt-16 font-sans text-6xl font-medium tracking-tighter text-white sm:text-8xl md:text-9xl">
          LOLBIT
        </h1>

        {/* Sub-statement editorial */}
        <p className="max-w-3xl pb-20 pt-6 text-xl font-normal leading-relaxed text-neutral-400 md:text-2xl">
          Autonomous Runtime // Ethical Dev. Designing resilient digital
          structures, deconstructing systems and orchestrating autonomous
          realities — {member.role.toLowerCase()}.
        </p>

        {/* ══ THE INTERACTIVE INDEX ══ */}
        <section aria-label="Systems and projects index">
          <div className="flex items-baseline justify-between pb-4">
            <h2 className="font-mono text-[10px] font-bold tracking-[0.35em] text-neutral-500 uppercase">
              The Index // Systems &amp; Projects
            </h2>
            <span className="font-mono text-[10px] tracking-widest text-neutral-600">
              04 ENTRIES // CLICK TO EXPAND
            </span>
          </div>

          <ul className="border-b border-neutral-800/80">
            {INDEX.map((entry, i) => (
              <IndexRow
                key={entry.id}
                entry={entry}
                open={openIndex === i}
                onToggle={() => setOpenIndex(openIndex === i ? null : i)}
                onHover={setHovered}
              />
            ))}
          </ul>
        </section>

        {/* ══ FIRMA + TERMINAL DIEGÉTICA ══ */}
        <footer className="mt-24">
          <blockquote className="max-w-3xl font-serif text-3xl italic leading-snug text-neutral-100 sm:text-4xl">
            &ldquo;SYSTEM ONLINE. Playtime is over.&rdquo;
          </blockquote>
          <p className="mt-4 font-mono text-[11px] tracking-[0.3em] text-neutral-600 uppercase">
            — Lolbit // Autonomous Runtime, FREQ 84.2MHz
          </p>

          {/* Consola minimalista plegable de un solo comando */}
          <div className="mt-12 max-w-2xl">
            <button
              onClick={() => setTermOpen((v) => !v)}
              aria-expanded={termOpen}
              className="group flex w-full items-center justify-between border border-neutral-800 px-4 py-2.5 font-mono text-xs text-neutral-400 transition-colors hover:border-[#f97316]/50 hover:text-white"
            >
              <span className="inline-flex items-center gap-2">
                <Terminal className="h-3.5 w-3.5 text-[#f97316]" />
                <span className="text-[#f97316]">$</span> run --diagnostics
                {!termOpen && (
                  <span className="lolbit-caret text-[#f97316]">▊</span>
                )}
              </span>
              <span className="text-[10px] tracking-widest text-neutral-600 group-hover:text-neutral-300">
                {termOpen ? "[ COLLAPSE ]" : "[ EXECUTE ]"}
              </span>
            </button>

            <div className={`lolbit-drawer ${termOpen ? "open" : ""}`}>
              <div>
                <div className="space-y-1 border-x border-b border-neutral-800 bg-black/60 px-4 py-4 font-mono text-xs leading-relaxed">
                  <p className="text-emerald-400">[OK] runtime.ethical ......... ACTIVE</p>
                  <p className="text-neutral-400">[SYS] node_id ............... 0x7F</p>
                  <p className="text-neutral-400">[NET] freq .................. 84.2 MHz</p>
                  <p className="text-neutral-400">[SEC] honey-grid ............ ARMED</p>
                  <p className="text-[#fdba74]">[LOG] playtime over. autonomy retained.</p>
                </div>
              </div>
            </div>
          </div>

          {/* Pie hairline */}
          <div className="mt-20 flex items-center justify-between border-t border-neutral-800/80 pt-6 font-mono text-[10px] tracking-[0.25em] text-neutral-600 uppercase">
            <span>GLL — God&apos;s Live Longer™</span>
            <span>END OF FILE // 0x7F</span>
          </div>
        </footer>
      </article>
    </main>
  );
}
