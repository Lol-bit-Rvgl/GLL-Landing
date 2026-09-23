"use client";

import { useEffect, useRef, useState, useCallback } from "react";
import Image from "next/image";
import Link from "next/link";
import type { Member } from "@/data/members";
import {
  ArrowLeft,
  ChevronDown,
  Terminal as TerminalIcon,
  Volume2,
  VolumeX,
  Copy,
  Check,
  ExternalLink,
  Cpu,
  Monitor,
  Wifi,
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
  repoUrl: string;
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
    title: "KYUBI SOCIAL BACKEND",
    tag: "API & INFRASTRUCTURE",
    year: "2026",
    status: "DEPLOYED",
    statusClass: "text-emerald-400",
    repoUrl: "https://github.com/Lol-bit-Rvgl/Kyubi-Social-Backend",
    previewImage: "/images/projects/kiwi-back.jpg",
    telemetry: [
      ["RUNTIME", "Node.js / Express"],
      ["DATABASE", "PostgreSQL"],
      ["REALTIME", "WebSockets"],
    ],
    drawer: {
      stack: [
        "Node.js",
        "Express",
        "PostgreSQL",
        "JWT Auth",
        "WebSockets",
        "REST APIs",
      ],
      problem:
        "Núcleo backend para la red social Kyubi. Gestión de sesiones, persistencia en base de datos, encriptación, endpoints RESTful y canales de sockets en tiempo real.",
      perf: [
        ["LATENCY", "< 25ms RTT"],
        ["AUTH", "Stateless JWT"],
        ["EVENTS", "Real-time Sockets"],
      ],
    },
  },
  {
    id: "02",
    title: "KYUBI SOCIAL FRONTEND",
    tag: "MOBILE CLIENT",
    year: "2026",
    status: "ACTIVE",
    statusClass: "text-[#f97316]",
    repoUrl: "https://github.com/Lol-bit-Rvgl/Kyubi-Social-Frontend",
    previewImage: "/images/projects/kiwi-front.jpg",
    telemetry: [
      ["CORE", "Flutter / Dart"],
      ["STATE", "Riverpod"],
      ["LAYOUT", "CustomScrollView Slivers"],
    ],
    drawer: {
      stack: [
        "Flutter",
        "Dart",
        "Riverpod",
        "CustomScrollView Slivers",
        "REST Integration",
      ],
      problem:
        "Aplicación móvil multiplataforma para Kyubi Social. Manejo de estado desacoplado, layout defensivo contra desbordes de viewport y consumo optimizado de microservicios.",
      perf: [
        ["FRAME RATE", "60 / 120 FPS"],
        ["CACHE LAYER", "In-Memory State"],
        ["VIEWPORT", "Defensive Safe-Bounds"],
      ],
    },
  },
  {
    id: "03",
    title: "KYUBI SOCIAL LANDING",
    tag: "WEB PLATFORM",
    year: "2026",
    status: "ONLINE",
    statusClass: "text-emerald-400",
    repoUrl: "https://github.com/Lol-bit-Rvgl/Kyubi-Social-landing",
    previewImage: "/images/projects/kiwi-landing.jpg",
    telemetry: [
      ["STACK", "Next.js / TypeScript"],
      ["STYLE", "Tailwind CSS"],
      ["RENDER", "Static / SSG"],
    ],
    drawer: {
      stack: [
        "Next.js",
        "TypeScript",
        "Tailwind CSS",
        "Framer Motion",
        "SSG",
      ],
      problem:
        "Portal oficial y presentación web para el ecosistema Kyubi Social. Enfoque editorial responsivo, animaciones dinámicas aceleradas por hardware y prerenderizado estático.",
      perf: [
        ["LIGHTHOUSE", "99+ Perf"],
        ["HYDRATION", "Instant SSG"],
        ["MOTION", "Hardware GPU"],
      ],
    },
  },
  {
    id: "04",
    title: "PANDLY LANDING",
    tag: "SHOWCASE & PRODUCT",
    year: "2025",
    status: "STABLE",
    statusClass: "text-cyan-400",
    repoUrl: "https://github.com/Lol-bit-Rvgl/Pandly_Landing",
    previewImage: "/images/projects/pandley.jpg",
    telemetry: [
      ["CORE", "Next.js / React"],
      ["STYLE", "Tailwind CSS"],
      ["FOCUS", "Interactive UX"],
    ],
    drawer: {
      stack: [
        "Next.js",
        "React",
        "Tailwind CSS",
        "Responsive Design",
        "Interactive UX",
      ],
      problem:
        "Plataforma web de exhibición para Pandly, con interfaces modernas, alto rendimiento de carga y optimización de conversión.",
      perf: [
        ["LOAD TIME", "< 0.8s"],
        ["RESPONSIVE", "Fluid Grid"],
        ["UX CONTRAST", "AAA Standard"],
      ],
    },
  },
  {
    id: "05",
    title: "HONEY CYBERSECURITY",
    tag: "SECURITY & TELEMETRY",
    year: "2026",
    status: "LAB // DEFENSE",
    statusClass: "text-purple-400",
    repoUrl: "https://github.com/SpringtraphackkZ/Honey-Cybersecurity",
    previewImage: "/images/projects/honey.jpg",
    telemetry: [
      ["DOMAIN", "Network Security"],
      ["TUNNEL", "Reverse SSH"],
      ["DEFENSE", "Honeypot Traps"],
    ],
    drawer: {
      stack: [
        "Network Security",
        "Reverse Tunneling",
        "Honeypot Traps",
        "Telemetry",
        "Forensic Logging",
      ],
      problem:
        "Entorno defensivo de ciberseguridad perimetral y honeypots. Detección proactiva de intrusiones no autorizadas, análisis de vectores de ataque y recolección forense de tráfico de red.",
      perf: [
        ["LOGGING", "Real-time Forensics"],
        ["INGRESS", "Zero Open Ports"],
        ["DECOYS", "Active Traps"],
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
        <div className="relative h-32 w-full overflow-hidden bg-gradient-to-br from-neutral-900 via-neutral-950 to-[#080506] flex items-center justify-center">
          {entry && (
            /* eslint-disable-next-line @next/next/no-img-element */
            <img
              src={entry.previewImage}
              alt={entry.title}
              onError={(e) => {
                (e.target as HTMLElement).style.display = "none";
              }}
              className="absolute inset-0 h-full w-full object-cover opacity-75"
            />
          )}
          {/* Fallback gráfico / placeholder si el asset aún no se ha subido */}
          <div className="pointer-events-none flex flex-col items-center justify-center p-4 text-center select-none">
            <span className="font-mono text-xl font-black tracking-widest text-[#f97316]/40">
              {entry?.id} // GLL
            </span>
            <span className="font-mono text-[9px] tracking-[0.2em] text-neutral-500 uppercase mt-1">
              {entry?.tag}
            </span>
          </div>
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
      <div
        onMouseEnter={() => onHover(entry)}
        onMouseLeave={() => onHover(null)}
        className="group flex w-full items-baseline justify-between gap-3 py-8 text-left transition-colors duration-300 sm:gap-6"
      >
        {/* Clickable area for expanding accordion */}
        <button
          onClick={onToggle}
          aria-expanded={open}
          className="flex min-w-0 flex-1 items-baseline justify-between gap-4 text-left transition-colors hover:text-[#f97316]"
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

        {/* Micro-icono ↗ a la derecha para acceso directo a GitHub */}
        {entry.repoUrl && (
          <a
            href={entry.repoUrl}
            target="_blank"
            rel="noopener noreferrer"
            title={`View ${entry.title} on GitHub`}
            className="flex shrink-0 items-center justify-center rounded p-1 text-neutral-600 transition-colors hover:text-[#f97316]"
          >
            <ExternalLink className="h-4 w-4" />
          </a>
        )}
      </div>

      {/* Drawer / acordeón suave */}
      <div className={`lolbit-drawer ${open ? "open" : ""}`}>
        <div>
          <div className="grid grid-cols-1 gap-8 pb-10 pl-8 pr-2 sm:pl-12 md:grid-cols-3">
            {/* Problema resuelto + Botón de acceso a GitHub */}
            <div className="md:col-span-2 flex flex-col justify-between">
              <div>
                <p className="font-mono text-[10px] tracking-[0.3em] text-neutral-600 uppercase">
                  Case // Problem Solved
                </p>
                <p className="mt-3 max-w-xl text-sm leading-relaxed text-neutral-400">
                  {entry.drawer.problem}
                </p>
              </div>

              {entry.repoUrl && (
                <div className="mt-6 pt-2">
                  <a
                    href={entry.repoUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-2 rounded-lg border border-neutral-800 bg-neutral-900/80 px-4 py-2 font-mono text-xs font-semibold text-[#f97316] transition-all hover:border-[#f97316] hover:bg-[#f97316]/10 hover:text-white"
                  >
                    <span>VIEW REPOSITORY ON GITHUB</span>
                    <ExternalLink className="h-3.5 w-3.5" />
                  </a>
                </div>
              )}
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
   LANYARD LIVE PRESENCE HOOK
   ══════════════════════════════════════════════════════════════ */
interface LanyardSpotify {
  track_id: string;
  song: string;
  artist: string;
  album_art_url: string;
  album?: string;
}

interface LanyardActivity {
  type: number;
  name: string;
  state?: string;
  details?: string;
  id?: string;
}

interface LanyardData {
  discord_status: "online" | "idle" | "dnd" | "offline";
  activities: LanyardActivity[];
  listening_to_spotify: boolean;
  spotify: LanyardSpotify | null;
}

function useLanyard(userId: string) {
  const [data, setData] = useState<LanyardData | null>(null);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    let active = true;

    const fetchPresence = async () => {
      try {
        const res = await fetch(`https://api.lanyard.rest/v1/users/${userId}`);
        if (!res.ok) return;
        const json = await res.json();
        if (active && json.success && json.data) {
          setData(json.data);
        }
      } catch {
        // Fallback en caso de error
      }
    };

    fetchPresence();
    const id = setInterval(fetchPresence, 15000);
    return () => {
      active = false;
      clearInterval(id);
    };
  }, [userId]);

  return { data, mounted };
}

/* ══════════════════════════════════════════════════════════════
   REAL VISITOR HARDWARE & NETWORK TELEMETRY
   ══════════════════════════════════════════════════════════════ */
interface DeviceTelemetry {
  os: string;
  resolution: string;
  viewport: string;
  pixelRatio: number;
  cores: number;
  memory: string;
  gpu: string;
  latencyMs: number | null;
}

function useDeviceTelemetry() {
  const [telemetry, setTelemetry] = useState<DeviceTelemetry>({
    os: "Detecting...",
    resolution: "---",
    viewport: "---",
    pixelRatio: 1,
    cores: 4,
    memory: "N/A",
    gpu: "WebGL Accelerator",
    latencyMs: null,
  });

  useEffect(() => {
    if (typeof window === "undefined") return;

    // 1. Detectar OS / Plataforma real
    const ua = navigator.userAgent;
    let detectedOs = "Unknown OS";
    if (/windows phone/i.test(ua)) detectedOs = "Windows Phone";
    else if (/win/i.test(ua)) detectedOs = "Windows";
    else if (/android/i.test(ua)) detectedOs = "Android";
    else if (/iphone|ipad|ipod/i.test(ua)) detectedOs = "iOS";
    else if (/mac/i.test(ua)) detectedOs = "macOS";
    else if (/linux/i.test(ua)) detectedOs = "Linux";

    // 2. Resolución de pantalla y Viewport
    const resolution = `${window.screen.width}x${window.screen.height}`;
    const viewport = `${window.innerWidth}x${window.innerHeight}`;
    const pixelRatio = window.devicePixelRatio ? Math.round(window.devicePixelRatio * 100) / 100 : 1;

    // 3. Cores de CPU y Memoria
    const cores = navigator.hardwareConcurrency || 4;
    const mem = (navigator as unknown as { deviceMemory?: number }).deviceMemory;
    const memory = mem ? `${mem} GB` : "Standard";

    // 4. Renderizador GPU real vía WebGL
    let gpu = "WebGL Accelerator";
    try {
      const canvas = document.createElement("canvas");
      const gl = canvas.getContext("webgl") || canvas.getContext("experimental-webgl");
      if (gl) {
        const ext = (gl as WebGLRenderingContext).getExtension("WEBGL_debug_renderer_info");
        if (ext) {
          const unmasked = (gl as WebGLRenderingContext).getParameter(ext.UNMASKED_RENDERER_WEBGL);
          if (unmasked) {
            gpu = String(unmasked)
              .replace(/ANGLE \((.+)\)/, "$1")
              .replace(/Direct3D.+/, "")
              .trim();
          }
        }
      }
    } catch {
      // fallback
    }

    setTelemetry((prev) => ({
      ...prev,
      os: detectedOs,
      resolution,
      viewport,
      pixelRatio,
      cores,
      memory,
      gpu,
    }));

    // 5. Medición real de latencia contra asset local
    const start = performance.now();
    fetch("/favicon.ico", { method: "HEAD", cache: "no-store" })
      .then(() => {
        const ping = Math.max(1, Math.round(performance.now() - start));
        setTelemetry((prev) => ({ ...prev, latencyMs: ping }));
      })
      .catch(() => {
        const ping = Math.max(1, Math.round(performance.now() - start));
        setTelemetry((prev) => ({ ...prev, latencyMs: ping }));
      });
  }, []);

  return telemetry;
}

/* ══════════════════════════════════════════════════════════════
   INTERACTIVE TERMINAL (TTY)
   ══════════════════════════════════════════════════════════════ */
function InteractiveTerminal({
  telemetry,
  lanyard,
}: {
  telemetry: DeviceTelemetry;
  lanyard: { data: LanyardData | null; isLive: boolean };
}) {
  const [history, setHistory] = useState<
    { id: string; cmd: string; output: React.ReactNode }[]
  >(() => [
    {
      id: "init",
      cmd: "run --diagnostics",
      output: (
        <div className="space-y-1">
          <p className="text-emerald-400">[OK] runtime.ethical ......... ACTIVE</p>
          <p className="text-neutral-400">[SYS] node_id ............... 0x7F</p>
          <p className="text-neutral-400">[NET] freq .................. 84.2 MHz</p>
          <p className="text-neutral-400">[SEC] zero-trust ............ ARMED</p>
          <p className="text-[#fdba74]">[LOG] &ldquo;Playtime over. Autonomy retained.&rdquo;</p>
          <p className="pt-2 text-neutral-500">
            Type <span className="text-[#f97316] font-semibold">help</span> to view available directives.
          </p>
        </div>
      ),
    },
  ]);
  const [inputVal, setInputVal] = useState("");
  const [cmdHistory, setCmdHistory] = useState<string[]>([]);
  const [historyIdx, setHistoryIdx] = useState<number>(-1);
  const scrollRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [history]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const raw = inputVal.trim();
    if (!raw) return;
    const cmd = raw.toLowerCase();

    setCmdHistory((prev) => [...prev, raw]);
    setHistoryIdx(-1);
    setInputVal("");

    if (cmd === "clear") {
      setHistory([]);
      return;
    }

    let output: React.ReactNode;
    if (cmd === "help") {
      output = (
        <div className="space-y-1 text-xs text-neutral-300">
          <p className="text-neutral-500 font-semibold tracking-wider uppercase">Available directives:</p>
          <p><span className="text-[#f97316] font-bold">help</span> - Display list of available directives</p>
          <p><span className="text-[#f97316] font-bold">projects</span> - List deployed architectures and live system status</p>
          <p><span className="text-[#f97316] font-bold">status</span> - Display node integrity and live Discord presence</p>
          <p><span className="text-[#f97316] font-bold">device</span> - Run real-time client hardware &amp; WebGL telemetry</p>
          <p><span className="text-[#f97316] font-bold">contact</span> - Output direct transmission links &amp; email</p>
          <p><span className="text-[#f97316] font-bold">clear</span> - Purge screen buffer</p>
        </div>
      );
    } else if (cmd === "projects") {
      output = (
        <div className="space-y-2 text-xs text-neutral-300">
          <p className="text-[#f97316] font-semibold tracking-wider uppercase">[ DEPLOYED ARCHITECTURES &amp; REPOSITORIES ]</p>
          <div className="space-y-2.5 pl-1 font-mono text-[11px]">
            <div>
              <p>
                <span className="font-bold text-white">01. KYUBI SOCIAL BACKEND</span>{" "}
                <span className="text-emerald-400 text-[10px]">[DEPLOYED]</span> — API &amp; Infrastructure
              </p>
              <p className="text-neutral-500 text-[10px] pl-3">
                Stack: Node.js, Express, PostgreSQL, JWT Auth, WebSockets, REST APIs
              </p>
              <p className="pl-3">
                <a
                  href="https://github.com/Lol-bit-Rvgl/Kyubi-Social-Backend"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-[#f97316] hover:underline"
                >
                  github.com/Lol-bit-Rvgl/Kyubi-Social-Backend ↗
                </a>
              </p>
            </div>

            <div>
              <p>
                <span className="font-bold text-white">02. KYUBI SOCIAL FRONTEND</span>{" "}
                <span className="text-[#f97316] text-[10px]">[ACTIVE]</span> — Mobile Client
              </p>
              <p className="text-neutral-500 text-[10px] pl-3">
                Stack: Flutter, Dart, Riverpod, CustomScrollView Slivers, REST Integration
              </p>
              <p className="pl-3">
                <a
                  href="https://github.com/Lol-bit-Rvgl/Kyubi-Social-Frontend"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-[#f97316] hover:underline"
                >
                  github.com/Lol-bit-Rvgl/Kyubi-Social-Frontend ↗
                </a>
              </p>
            </div>

            <div>
              <p>
                <span className="font-bold text-white">03. KYUBI SOCIAL LANDING</span>{" "}
                <span className="text-emerald-400 text-[10px]">[ONLINE]</span> — Web Platform
              </p>
              <p className="text-neutral-500 text-[10px] pl-3">
                Stack: Next.js, TypeScript, Tailwind CSS, Framer Motion, SSG
              </p>
              <p className="pl-3">
                <a
                  href="https://github.com/Lol-bit-Rvgl/Kyubi-Social-landing"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-[#f97316] hover:underline"
                >
                  github.com/Lol-bit-Rvgl/Kyubi-Social-landing ↗
                </a>
              </p>
            </div>

            <div>
              <p>
                <span className="font-bold text-white">04. PANDLY LANDING</span>{" "}
                <span className="text-cyan-400 text-[10px]">[STABLE]</span> — Showcase &amp; Product
              </p>
              <p className="text-neutral-500 text-[10px] pl-3">
                Stack: Next.js, React, Tailwind CSS, Responsive Design, Interactive UX
              </p>
              <p className="pl-3">
                <a
                  href="https://github.com/Lol-bit-Rvgl/Pandly_Landing"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-[#f97316] hover:underline"
                >
                  github.com/Lol-bit-Rvgl/Pandly_Landing ↗
                </a>
              </p>
            </div>

            <div>
              <p>
                <span className="font-bold text-white">05. HONEY CYBERSECURITY</span>{" "}
                <span className="text-purple-400 text-[10px]">[LAB // DEFENSE]</span> — Security &amp; Telemetry
              </p>
              <p className="text-neutral-500 text-[10px] pl-3">
                Stack: Network Security, Reverse Tunneling, Honeypot Traps, Telemetry, Forensic Logging
              </p>
              <p className="pl-3">
                <a
                  href="https://github.com/SpringtraphackkZ/Honey-Cybersecurity"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-[#f97316] hover:underline"
                >
                  github.com/SpringtraphackkZ/Honey-Cybersecurity ↗
                </a>
              </p>
            </div>
          </div>
        </div>
      );
    } else if (cmd === "status") {
      const activeActivity = lanyard.data?.activities?.find(
        (a) => a.type !== 2 && a.name !== "Spotify" && a.name !== "Custom Status" && a.type !== 4
      );
      output = (
        <div className="space-y-1 text-xs text-neutral-300">
          <p className="text-emerald-400">[NODE] 0x7F // LOLBIT RUNTIME ......... ONLINE</p>
          <p className="text-neutral-400">[FREQ] 84.2 MHz // ZERO-TRUST TUNNEL ... ARMED</p>
          <p className="text-neutral-400">
            [DISCORD] Status:{" "}
            <strong className={lanyard.isLive ? "text-emerald-400" : "text-neutral-500"}>
              {lanyard.isLive ? (lanyard.data?.discord_status?.toUpperCase() ?? "ONLINE") : "OFFLINE"}
            </strong>
          </p>
          {lanyard.data?.listening_to_spotify && lanyard.data.spotify ? (
            <p className="text-emerald-300">
              [SPOTIFY] ♫ {lanyard.data.spotify.song} — {lanyard.data.spotify.artist}
            </p>
          ) : null}
          {activeActivity ? (
            <p className="text-amber-300">
              [ACTIVITY] ▶ {activeActivity.name}: {activeActivity.details || activeActivity.state || "Active"}
            </p>
          ) : null}
          <p className="text-[#fdba74]">[SYS.LOG] &ldquo;Playtime is over. Autonomy retained.&rdquo;</p>
        </div>
      );
    } else if (cmd === "device") {
      output = (
        <div className="space-y-1 text-xs text-neutral-300">
          <p className="text-[#f97316] font-semibold tracking-wider">[ VISITOR HARDWARE &amp; WEBGL REPORT ]</p>
          <p><span className="text-neutral-500">OS / Platform ......</span> <span className="text-neutral-200">{telemetry.os}</span></p>
          <p><span className="text-neutral-500">Screen Resolution ..</span> <span className="text-neutral-200">{telemetry.resolution}</span></p>
          <p><span className="text-neutral-500">Viewport Dimensions </span> <span className="text-neutral-200">{telemetry.viewport}</span></p>
          <p><span className="text-neutral-500">Device Pixel Ratio .</span> <span className="text-neutral-200">{telemetry.pixelRatio}x</span></p>
          <p><span className="text-neutral-500">Logical CPU Cores ..</span> <span className="text-neutral-200">{telemetry.cores} cores</span></p>
          <p><span className="text-neutral-500">Device Memory ......</span> <span className="text-neutral-200">{telemetry.memory}</span></p>
          <p><span className="text-neutral-500">WebGL GPU ..........</span> <span className="text-emerald-400">{telemetry.gpu}</span></p>
          <p><span className="text-neutral-500">Network Latency ....</span> <span className="text-[#f97316]">{telemetry.latencyMs !== null ? `${telemetry.latencyMs}ms` : "calculating..."}</span></p>
        </div>
      );
    } else if (cmd === "contact") {
      output = (
        <div className="space-y-1 text-xs text-neutral-300">
          <p className="text-neutral-500 font-semibold tracking-wider uppercase">[ DIRECT TRANSMISSION VECTORS ]</p>
          <p><span className="text-neutral-500">Email .....</span> <span className="text-neutral-200">gdlolbit005@gmail.com</span></p>
          <p><span className="text-neutral-500">Discord ...</span> <span className="text-neutral-200">@imaginebeinglolbit</span></p>
          <p><span className="text-neutral-500">GitHub ....</span> <a href="https://github.com/Lol-bit-Rvgl" target="_blank" rel="noopener noreferrer" className="text-[#f97316] hover:underline">https://github.com/Lol-bit-Rvgl</a></p>
        </div>
      );
    } else {
      output = (
        <p className="text-xs text-red-400">
          command not found: &quot;{raw}&quot;. Type &quot;help&quot; for a list of available directives.
        </p>
      );
    }

    setHistory((prev) => [
      ...prev,
      { id: String(Date.now() + Math.random()), cmd: raw, output },
    ]);
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "ArrowUp") {
      e.preventDefault();
      if (cmdHistory.length === 0) return;
      const nextIdx = historyIdx === -1 ? cmdHistory.length - 1 : Math.max(0, historyIdx - 1);
      setHistoryIdx(nextIdx);
      setInputVal(cmdHistory[nextIdx] ?? "");
    } else if (e.key === "ArrowDown") {
      e.preventDefault();
      if (historyIdx === -1) return;
      const nextIdx = historyIdx + 1;
      if (nextIdx >= cmdHistory.length) {
        setHistoryIdx(-1);
        setInputVal("");
      } else {
        setHistoryIdx(nextIdx);
        setInputVal(cmdHistory[nextIdx] ?? "");
      }
    }
  };

  return (
    <div
      onClick={() => inputRef.current?.focus()}
      className="cursor-text rounded-xl border border-neutral-800 bg-black/90 p-4 font-mono text-xs shadow-2xl backdrop-blur-md transition-all hover:border-neutral-700"
    >
      {/* Barra superior de terminal */}
      <div className="flex items-center justify-between border-b border-neutral-800/80 pb-3 text-[11px] text-neutral-500">
        <div className="flex items-center gap-2">
          <span className="h-2.5 w-2.5 rounded-full bg-red-500/80" />
          <span className="h-2.5 w-2.5 rounded-full bg-yellow-500/80" />
          <span className="h-2.5 w-2.5 rounded-full bg-emerald-500/80" />
          <span className="ml-2 text-neutral-400">lolbit@gll-node: ~</span>
        </div>
        <div className="flex items-center gap-1.5 text-[10px] text-neutral-600">
          <TerminalIcon className="h-3 w-3 text-[#f97316]" />
          <span>INTERACTIVE TTY</span>
        </div>
      </div>

      {/* Historial de comandos */}
      <div ref={scrollRef} className="max-h-72 overflow-y-auto pt-3 space-y-3">
        {history.map((h) => (
          <div key={h.id} className="space-y-1 leading-relaxed">
            <div className="flex items-center gap-2 text-neutral-400">
              <span className="text-[#f97316] font-bold">lolbit@gll-node:~$</span>
              <span className="text-white font-medium">{h.cmd}</span>
            </div>
            <div className="pl-4">{h.output}</div>
          </div>
        ))}

        {/* Input prompt interactivo */}
        <form onSubmit={handleSubmit} className="flex items-center gap-2 pt-1">
          <label htmlFor="terminal-prompt" className="text-[#f97316] font-bold whitespace-nowrap">
            lolbit@gll-node:~$
          </label>
          <input
            id="terminal-prompt"
            ref={inputRef}
            type="text"
            value={inputVal}
            onChange={(e) => setInputVal(e.target.value)}
            onKeyDown={handleKeyDown}
            autoComplete="off"
            spellCheck="false"
            className="flex-1 bg-transparent text-white outline-none border-none p-0 focus:ring-0 font-mono text-xs"
            placeholder="type a command (help, status, device, contact, clear)..."
          />
        </form>
      </div>
    </div>
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
  const [copiedKey, setCopiedKey] = useState<string | null>(null);

  const telemetry = useDeviceTelemetry();
  const { data: lanyardData } = useLanyard("1066501844177797171");
  const lanyardIsLive = mounted && lanyardData?.discord_status && lanyardData.discord_status !== "offline";

  const activeGameOrCode = lanyardData?.activities?.find(
    (a) => a.type !== 2 && a.name !== "Spotify" && a.name !== "Custom Status" && a.type !== 4
  );

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

  const copyText = useCallback((text: string, key: string) => {
    if (typeof navigator !== "undefined" && navigator.clipboard) {
      navigator.clipboard.writeText(text);
      setCopiedKey(key);
      setTimeout(() => setCopiedKey(null), 2000);
    }
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

        {/* ══ TIPOGRAFÍA MONUMENTAL EDITORIAL ══ */}
        <div className="pt-14 sm:pt-20">
          <div className="flex items-center gap-2 font-mono text-[11px] tracking-[0.35em] text-[#f97316] uppercase mb-3">
            <span className="lolbit-dot h-2 w-2 rounded-full bg-[#f97316]" />
            <span>AUTONOMOUS RUNTIME // SYS.GEN-18</span>
          </div>
          <h1 className="font-[family-name:var(--font-bricolage)] font-black tracking-[-0.06em] text-white text-7xl sm:text-9xl md:text-[10rem] lg:text-[11.5rem] leading-[0.85] select-none uppercase drop-shadow-[0_10px_35px_rgba(0,0,0,0.8)]">
            LOLBIT<span className="text-[#f97316]">.</span>
          </h1>
        </div>

        {/* Sub-statement editorial */}
        <p className="max-w-3xl pb-8 pt-6 text-xl font-normal leading-relaxed text-neutral-400 md:text-2xl">
          Autonomous Runtime // Ethical Dev. Designing resilient digital
          structures, deconstructing systems and orchestrating autonomous
          realities — {member.role.toLowerCase()}.
        </p>

        {/* ══ TELEMETRÍA REAL DEL DISPOSITIVO DEL VISITANTE (HUD) ══ */}
        <div className="mb-16 rounded-xl border border-neutral-800/80 bg-black/60 p-4 font-mono text-xs shadow-lg backdrop-blur-md">
          <div className="flex flex-wrap items-center justify-between gap-2 border-b border-neutral-800/80 pb-3">
            <span className="flex items-center gap-2 text-[10px] tracking-widest text-[#f97316] uppercase font-bold">
              <span className="h-1.5 w-1.5 rounded-full bg-[#f97316] animate-pulse" />
              CLIENT TELEMETRY // REAL HARDWARE FEED
            </span>
            <span className="text-[10px] text-neutral-500 tracking-wider">
              ZERO MOCK DATA • VERIFIED HARDWARE
            </span>
          </div>
          <div className="grid grid-cols-2 gap-3 pt-3 text-[11px] sm:grid-cols-4 md:grid-cols-5">
            <div>
              <p className="text-[9px] text-neutral-500 uppercase tracking-widest">Platform / OS</p>
              <p className="font-semibold text-white truncate">{telemetry.os}</p>
            </div>
            <div>
              <p className="text-[9px] text-neutral-500 uppercase tracking-widest">Display</p>
              <p className="font-semibold text-white truncate">
                {telemetry.resolution} <span className="text-neutral-500 font-normal">@{telemetry.pixelRatio}x</span>
              </p>
            </div>
            <div>
              <p className="text-[9px] text-neutral-500 uppercase tracking-widest">CPU Cores</p>
              <p className="font-semibold text-white">{telemetry.cores} Logic Cores</p>
            </div>
            <div>
              <p className="text-[9px] text-neutral-500 uppercase tracking-widest">Memory</p>
              <p className="font-semibold text-white">{telemetry.memory}</p>
            </div>
            <div className="col-span-2 sm:col-span-4 md:col-span-1">
              <p className="text-[9px] text-neutral-500 uppercase tracking-widest">Latency / Ping</p>
              <p className="font-semibold text-[#f97316]">
                {telemetry.latencyMs !== null ? `${telemetry.latencyMs}ms (Asset RTT)` : "Measuring..."}
              </p>
            </div>
          </div>
          <div className="mt-2.5 pt-2.5 border-t border-neutral-900 flex items-center justify-between text-[10px] text-neutral-500">
            <span className="truncate max-w-full">
              GPU: <span className="text-emerald-400/90">{telemetry.gpu}</span>
            </span>
            <span className="shrink-0 pl-2">VP: {telemetry.viewport}</span>
          </div>
        </div>

        {/* ══ THE HIGHLIGHT REEL ══ */}
        <section aria-label="Systems and projects index">
          <div className="flex items-baseline justify-between pb-4">
            <h2 className="font-mono text-[10px] font-bold tracking-[0.35em] text-neutral-500 uppercase">
              The Highlight Reel // Real-World Systems
            </h2>
            <span className="font-mono text-[10px] tracking-widest text-neutral-600">
              05 ENTRIES // CLICK TO EXPAND
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

        {/* ══ FIRMA + TERMINAL DIEGÉTICA INTERACTIVA ══ */}
        <footer className="mt-24">
          <blockquote className="max-w-3xl font-serif text-3xl italic leading-snug text-neutral-100 sm:text-4xl">
            &ldquo;SYSTEM ONLINE. Playtime is over.&rdquo;
          </blockquote>
          <p className="mt-4 font-mono text-[11px] tracking-[0.3em] text-neutral-600 uppercase">
            — Lolbit // Autonomous Runtime, FREQ 84.2MHz
          </p>

          {/* Consola interactiva totalmente funcional */}
          <div className="mt-12 max-w-3xl">
            <InteractiveTerminal
              telemetry={telemetry}
              lanyard={{ data: lanyardData, isLive: !!lanyardIsLive }}
            />
          </div>

          {/* ══ SECCIÓN DE CONTACTO & PRESENCIA EN VIVO (FOOTER EDITORIAL) ══ */}
          <section className="mt-20 border-t border-neutral-800/80 pt-12" aria-label="Contact and live presence">
            <div className="flex flex-col gap-6 md:flex-row md:items-start md:justify-between">
              <div>
                <h3 className="font-mono text-xs font-bold tracking-[0.35em] text-neutral-500 uppercase">
                  Live Presence &amp; Vectors
                </h3>
                <p className="mt-1 font-sans text-2xl font-bold tracking-tight text-white sm:text-3xl">
                  Conectar &amp; Colaborar
                </p>
              </div>

              {/* Badge de Presencia Lanyard en Vivo */}
              <div className="w-full max-w-md rounded-xl border border-neutral-800 bg-neutral-950/80 p-4 shadow-xl backdrop-blur-md">
                <div className="flex items-center justify-between text-xs font-mono mb-2">
                  <span className="flex items-center gap-2 text-neutral-400">
                    <span
                      className={`h-2 w-2 rounded-full ${
                        lanyardIsLive ? "bg-emerald-400 animate-ping" : "bg-neutral-600"
                      }`}
                    />
                    <span>DISCORD PRESENCE</span>
                  </span>
                  <span
                    className={`font-bold uppercase tracking-wider ${
                      lanyardIsLive ? "text-emerald-400" : "text-neutral-500"
                    }`}
                  >
                    {lanyardIsLive ? "● LIVE" : "○ OFFLINE"}
                  </span>
                </div>

                {/* Actividad en vivo */}
                {lanyardData?.listening_to_spotify && lanyardData.spotify ? (
                  <div className="flex items-center gap-3 pt-1">
                    {lanyardData.spotify.album_art_url && (
                      /* eslint-disable-next-line @next/next/no-img-element */
                      <img
                        src={lanyardData.spotify.album_art_url}
                        alt=""
                        className="h-11 w-11 shrink-0 rounded-lg border border-emerald-500/40 object-cover shadow-sm"
                      />
                    )}
                    <div className="min-w-0 flex-1 font-mono">
                      <p className="text-[10px] text-emerald-400 uppercase tracking-widest font-semibold flex items-center gap-1.5">
                        <span>♫</span> LISTENING // SPOTIFY
                      </p>
                      <p className="truncate text-xs font-medium text-white">
                        {lanyardData.spotify.song}
                      </p>
                      <p className="truncate text-[11px] text-neutral-400">
                        {lanyardData.spotify.artist}
                      </p>
                    </div>
                  </div>
                ) : activeGameOrCode ? (
                  <div className="pt-1 font-mono">
                    <p className="text-[10px] text-amber-400 uppercase tracking-widest font-semibold flex items-center gap-1.5">
                      <span>▶</span> CURRENT ACTIVITY
                    </p>
                    <p className="text-xs font-medium text-white">
                      {activeGameOrCode.name}
                    </p>
                    {(activeGameOrCode.details || activeGameOrCode.state) && (
                      <p className="truncate text-[11px] text-neutral-400">
                        {activeGameOrCode.details || activeGameOrCode.state}
                      </p>
                    )}
                  </div>
                ) : (
                  <div className="pt-1 font-mono text-xs text-neutral-500">
                    {lanyardIsLive ? (
                      <p className="text-emerald-400/80">$ exec &ldquo;SYSTEM ONLINE. Playtime is over.&rdquo;</p>
                    ) : (
                      <p>$ exec --standby // RUNTIME SLEEP</p>
                    )}
                  </div>
                )}
              </div>
            </div>

            {/* Canales de Enlace */}
            <div className="mt-8 grid grid-cols-1 gap-4 sm:grid-cols-3">
              {/* Email */}
              <div className="flex flex-col justify-between rounded-xl border border-neutral-800/80 bg-neutral-950/60 p-5 backdrop-blur-md transition-all hover:border-[#f97316]/50">
                <div>
                  <span className="font-mono text-[10px] tracking-[0.25em] text-neutral-500 uppercase">
                    Direct Vector
                  </span>
                  <p className="mt-2 font-mono text-sm font-semibold text-neutral-200 truncate">
                    gdlolbit005@gmail.com
                  </p>
                </div>
                <button
                  onClick={() => copyText("gdlolbit005@gmail.com", "email")}
                  className="mt-4 inline-flex items-center justify-center gap-2 rounded-lg border border-neutral-800 bg-neutral-900 px-3 py-2 font-mono text-xs text-neutral-300 transition-all hover:border-[#f97316] hover:bg-[#f97316]/10 hover:text-white"
                >
                  {copiedKey === "email" ? (
                    <>
                      <Check className="h-3.5 w-3.5 text-emerald-400" />
                      <span className="text-emerald-400 font-bold">COPIED!</span>
                    </>
                  ) : (
                    <>
                      <Copy className="h-3.5 w-3.5 text-neutral-400" />
                      <span>COPY EMAIL</span>
                    </>
                  )}
                </button>
              </div>

              {/* Discord */}
              <div className="flex flex-col justify-between rounded-xl border border-neutral-800/80 bg-neutral-950/60 p-5 backdrop-blur-md transition-all hover:border-[#5865F2]/50">
                <div>
                  <span className="font-mono text-[10px] tracking-[0.25em] text-neutral-500 uppercase">
                    Discord Identity
                  </span>
                  <p className="mt-2 font-mono text-sm font-semibold text-neutral-200">
                    @imaginebeinglolbit
                  </p>
                </div>
                <button
                  onClick={() => copyText("imaginebeinglolbit", "discord")}
                  className="mt-4 inline-flex items-center justify-center gap-2 rounded-lg border border-neutral-800 bg-neutral-900 px-3 py-2 font-mono text-xs text-neutral-300 transition-all hover:border-[#5865F2] hover:bg-[#5865F2]/10 hover:text-white"
                >
                  {copiedKey === "discord" ? (
                    <>
                      <Check className="h-3.5 w-3.5 text-emerald-400" />
                      <span className="text-emerald-400 font-bold">COPIED!</span>
                    </>
                  ) : (
                    <>
                      <Copy className="h-3.5 w-3.5 text-neutral-400" />
                      <span>COPY TAG</span>
                    </>
                  )}
                </button>
              </div>

              {/* GitHub */}
              <div className="flex flex-col justify-between rounded-xl border border-neutral-800/80 bg-neutral-950/60 p-5 backdrop-blur-md transition-all hover:border-neutral-500">
                <div>
                  <span className="font-mono text-[10px] tracking-[0.25em] text-neutral-500 uppercase">
                    Open Source
                  </span>
                  <p className="mt-2 font-mono text-sm font-semibold text-neutral-200">
                    github.com/Lol-bit-Rvgl
                  </p>
                </div>
                <a
                  href="https://github.com/Lol-bit-Rvgl"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="mt-4 inline-flex items-center justify-center gap-2 rounded-lg border border-neutral-800 bg-neutral-900 px-3 py-2 font-mono text-xs text-neutral-300 transition-all hover:border-neutral-500 hover:bg-white/5 hover:text-white"
                >
                  <ExternalLink className="h-3.5 w-3.5 text-neutral-400" />
                  <span>OPEN GITHUB ↗</span>
                </a>
              </div>
            </div>
          </section>

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
