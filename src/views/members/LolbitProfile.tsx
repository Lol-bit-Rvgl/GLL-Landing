"use client";

import { useEffect, useRef, useState, useCallback } from "react";
import Image from "next/image";
import Link from "next/link";
import type { Member } from "@/data/members";
import {
  ArrowLeft,
  ChevronDown,
  Volume2,
  VolumeX,
  Copy,
  Check,
  ExternalLink,
  Zap,
  Send,
  X,
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
  onPlayClick,
}: {
  entry: IndexEntry;
  open: boolean;
  onToggle: () => void;
  onHover: (entry: IndexEntry | null) => void;
  onPlayClick?: (freq?: number, duration?: number) => void;
}) {
  return (
    <li className="border-t border-neutral-800/80">
      {/* Strip horizontal */}
      <div
        onMouseEnter={() => {
          onHover(entry);
          onPlayClick?.(920, 0.015);
        }}
        onMouseLeave={() => onHover(null)}
        className="group flex w-full items-baseline justify-between gap-3 py-8 text-left transition-colors duration-300 sm:gap-6"
      >
        {/* Clickable area for expanding accordion */}
        <button
          onClick={() => {
            onToggle();
            onPlayClick?.(open ? 650 : 820, 0.025);
          }}
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
            onClick={() => onPlayClick?.(1100, 0.025)}
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
                    onClick={() => onPlayClick?.(1100, 0.025)}
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
   POLY AI / CHARACTER.AI CONVERSATIONAL MODAL
   ══════════════════════════════════════════════════════════════ */
interface ChatMessage {
  role: "user" | "assistant";
  content: string;
}

interface LolbitChatModalProps {
  isOpen: boolean;
  onClose: () => void;
  onPlayClick?: (freq?: number, duration?: number) => void;
}

function LolbitChatModal({ isOpen, onClose, onPlayClick }: LolbitChatModalProps) {
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      role: "assistant",
      content:
        "Runtime activo. Frecuencia sintonizada. ¿Qué necesitas consultar?",
    },
  ]);
  const [inputVal, setInputVal] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (isOpen) {
      const timer = setTimeout(() => inputRef.current?.focus(), 80);
      return () => clearTimeout(timer);
    }
  }, [isOpen]);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages, isLoading]);

  const handleSend = async (textToSend?: string) => {
    const raw = (textToSend ?? inputVal).trim();
    if (!raw || isLoading) return;

    onPlayClick?.(860, 0.025);
    const newHistory: ChatMessage[] = [...messages, { role: "user", content: raw }];
    setMessages(newHistory);
    setInputVal("");
    setIsLoading(true);

    try {
      const res = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ messages: newHistory }),
      });
      const data = await res.json();
      setMessages((prev) => [
        ...prev,
        {
          role: "assistant",
          content:
            data.reply ||
            "Se recibió un paquete vacío desde el núcleo neural.",
        },
      ]);
    } catch {
      setMessages((prev) => [
        ...prev,
        {
          role: "assistant",
          content:
            "Interferencia en la conexión con el subsistema de chat de Groq.",
        },
      ]);
    } finally {
      setIsLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div
      onClick={onClose}
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-in fade-in duration-200"
    >
      <div
        onClick={(e) => e.stopPropagation()}
        className="relative flex flex-col w-full max-w-xl rounded-2xl border border-neutral-800 bg-neutral-950/95 shadow-2xl backdrop-blur-xl overflow-hidden h-[580px] max-h-[90vh]"
      >
        {/* Header diegético */}
        <div className="flex items-center justify-between border-b border-neutral-800/80 px-5 py-3.5 bg-neutral-900/60">
          <div className="flex items-center gap-3">
            <div className="relative flex h-8 w-8 items-center justify-center rounded-full border border-amber-500/40 bg-amber-500/10 text-amber-500">
              <Zap className="h-4 w-4" />
              <span className="absolute -bottom-0.5 -right-0.5 h-2 w-2 rounded-full bg-emerald-400 ring-2 ring-neutral-950" />
            </div>
            <div>
              <h3 className="font-mono text-sm font-bold text-white tracking-tight">
                LOLBIT // D-AVAR
              </h3>
              <p className="font-mono text-[10px] text-neutral-400 tracking-wider">
                Dark Autonomous Virtual Assistant Runtime // v2.6
              </p>
            </div>
          </div>
          <button
            onClick={() => {
              onPlayClick?.(580, 0.025);
              onClose();
            }}
            className="flex items-center gap-1.5 rounded-lg border border-neutral-800 bg-neutral-900/60 px-2.5 py-1 font-mono text-xs text-neutral-400 transition-colors hover:border-neutral-600 hover:text-white"
          >
            <span>ESC</span>
            <X className="h-3 w-3" />
          </button>
        </div>

        {/* Historial de Mensajes */}
        <div
          ref={scrollRef}
          className="flex-1 overflow-y-auto p-4 sm:p-5 space-y-4 font-sans text-sm scroll-smooth"
        >
          {messages.map((msg, idx) => (
            <div
              key={idx}
              className={`flex flex-col ${
                msg.role === "user" ? "items-end" : "items-start"
              }`}
            >
              <span className="mb-1 font-mono text-[10px] tracking-wider uppercase text-neutral-500">
                {msg.role === "user" ? "Tú // Operativo" : "Lolbit // Core"}
              </span>
              <div
                className={`max-w-[85%] rounded-2xl px-4 py-2.5 leading-relaxed ${
                  msg.role === "user"
                    ? "rounded-tr-sm bg-[#f97316]/15 border border-[#f97316]/30 text-white shadow-sm"
                    : "rounded-tl-sm bg-neutral-900/90 border border-neutral-800/90 text-neutral-200"
                }`}
              >
                <p className="whitespace-pre-wrap">{msg.content}</p>
              </div>
            </div>
          ))}

          {/* Indicador de Carga */}
          {isLoading && (
            <div className="flex flex-col items-start">
              <span className="mb-1 font-mono text-[10px] tracking-wider uppercase text-neutral-500">
                Lolbit // Core
              </span>
              <div className="rounded-2xl rounded-tl-sm bg-neutral-900/90 border border-neutral-800/90 px-4 py-2.5 text-xs font-mono text-[#f97316] flex items-center gap-2">
                <span className="h-2 w-2 rounded-full bg-[#f97316] animate-ping" />
                <span>Lolbit está procesando...</span>
              </div>
            </div>
          )}
        </div>

        {/* Chips de Sugerencias Iniciales */}
        {messages.length <= 2 && !isLoading && (
          <div className="px-4 pb-2 flex flex-wrap gap-1.5">
            {[
              "¿Qué onda con Kyubi Social?",
              "¿Quién eres?",
              "¿Cómo te contacto?",
            ].map((chip) => (
              <button
                key={chip}
                onClick={() => handleSend(chip)}
                className="rounded-full border border-neutral-800 bg-neutral-900/80 px-3 py-1 font-mono text-[11px] text-neutral-400 transition-colors hover:border-[#f97316] hover:bg-[#f97316]/10 hover:text-white"
              >
                {chip}
              </button>
            ))}
          </div>
        )}

        {/* Input Bar */}
        <form
          onSubmit={(e) => {
            e.preventDefault();
            handleSend();
          }}
          className="border-t border-neutral-800/80 p-3 bg-neutral-900/30 flex items-center gap-2"
        >
          <input
            ref={inputRef}
            type="text"
            value={inputVal}
            onChange={(e) => setInputVal(e.target.value)}
            placeholder="Escribe un mensaje a Lolbit..."
            disabled={isLoading}
            className="flex-1 rounded-xl border border-neutral-800 bg-neutral-950 px-4 py-2.5 font-sans text-sm text-neutral-100 placeholder-neutral-500 outline-none transition-colors focus:border-[#f97316]/60 focus:ring-1 focus:ring-[#f97316]/60 disabled:opacity-50"
          />
          <button
            type="submit"
            disabled={!inputVal.trim() || isLoading}
            className="inline-flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-[#f97316] text-black transition-transform hover:scale-105 hover:bg-[#ea580c] disabled:opacity-40 disabled:hover:scale-100"
          >
            <Send className="h-4 w-4" />
          </button>
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
  const [isChatOpen, setIsChatOpen] = useState(false);
  const [mousePos, setMousePos] = useState({ x: -1000, y: -1000 });
  const [scrollProgress, setScrollProgress] = useState(0);

  const audioCtxRef = useRef<AudioContext | null>(null);

  const telemetry = useDeviceTelemetry();
  const { data: lanyardData } = useLanyard("1066501844177797171");
  const lanyardIsLive = mounted && lanyardData?.discord_status && lanyardData.discord_status !== "offline";

  const activeGameOrCode = lanyardData?.activities?.find(
    (a) => a.type !== 2 && a.name !== "Spotify" && a.name !== "Custom Status" && a.type !== 4
  );

  // Micro-audio sintetizado táctico (Web Audio API pura, cero archivos externos)
  const playClick = useCallback(
    (freq = 800, duration = 0.025) => {
      if (!audio) return;
      try {
        const AudioCtx =
          window.AudioContext ||
          (window as unknown as { webkitAudioContext: typeof AudioContext })
            .webkitAudioContext;
        if (!AudioCtx) return;
        if (!audioCtxRef.current || audioCtxRef.current.state === "closed") {
          audioCtxRef.current = new AudioCtx();
        }
        const ctx = audioCtxRef.current;
        if (ctx.state === "suspended") {
          ctx.resume();
        }
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();

        osc.type = "sine";
        osc.frequency.setValueAtTime(freq, ctx.currentTime);
        osc.frequency.exponentialRampToValueAtTime(
          freq * 0.45,
          ctx.currentTime + duration
        );

        gain.gain.setValueAtTime(0.04, ctx.currentTime);
        gain.gain.exponentialRampToValueAtTime(
          0.0001,
          ctx.currentTime + duration
        );

        osc.connect(gain);
        gain.connect(ctx.destination);

        osc.start();
        osc.stop(ctx.currentTime + duration);
      } catch {
        // Ignorar si el navegador bloquea audio antes de interacción
      }
    },
    [audio]
  );

  const toggleAudio = useCallback(() => {
    setAudio((prev) => {
      const next = !prev;
      if (next) {
        setTimeout(() => {
          try {
            const AudioCtx =
              window.AudioContext ||
              (window as unknown as { webkitAudioContext: typeof AudioContext })
                .webkitAudioContext;
            if (AudioCtx) {
              if (!audioCtxRef.current) audioCtxRef.current = new AudioCtx();
              const ctx = audioCtxRef.current;
              ctx.resume().then(() => {
                const osc = ctx.createOscillator();
                const gain = ctx.createGain();
                osc.type = "sine";
                osc.frequency.setValueAtTime(950, ctx.currentTime);
                gain.gain.setValueAtTime(0.05, ctx.currentTime);
                gain.gain.exponentialRampToValueAtTime(
                  0.0001,
                  ctx.currentTime + 0.04
                );
                osc.connect(gain);
                gain.connect(ctx.destination);
                osc.start();
                osc.stop(ctx.currentTime + 0.04);
              });
            }
          } catch {}
        }, 30);
      }
      return next;
    });
  }, []);

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

  // Ambient mouse spotlight listener
  useEffect(() => {
    if (!mounted) return;
    const handleMouseMove = (e: MouseEvent) => {
      setMousePos({ x: e.clientX, y: e.clientY });
    };
    window.addEventListener("mousemove", handleMouseMove, { passive: true });
    return () => window.removeEventListener("mousemove", handleMouseMove);
  }, [mounted]);

  // Scroll indicator hairline listener
  useEffect(() => {
    if (!mounted) return;
    const handleScroll = () => {
      const total = document.documentElement.scrollHeight - window.innerHeight;
      if (total > 0) {
        setScrollProgress(Math.min(1, Math.max(0, window.scrollY / total)));
      }
    };
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, [mounted]);

  // Listener global de teclado (Ctrl+K / Cmd+K y Escape) — solo tras montar
  useEffect(() => {
    if (!mounted) return;
    const handleGlobalKey = (e: KeyboardEvent) => {
      if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === "k") {
        e.preventDefault();
        setIsChatOpen((prev) => {
          const next = !prev;
          playClick(next ? 1000 : 600, 0.025);
          return next;
        });
      } else if (e.key === "Escape") {
        setIsChatOpen((prev) => {
          if (prev) playClick(550, 0.025);
          return false;
        });
      }
    };
    window.addEventListener("keydown", handleGlobalKey);
    return () => window.removeEventListener("keydown", handleGlobalKey);
  }, [mounted, playClick]);

  const copyText = useCallback(
    (text: string, key: string) => {
      if (typeof navigator !== "undefined" && navigator.clipboard) {
        navigator.clipboard.writeText(text);
        setCopiedKey(key);
        playClick(1200, 0.035);
        setTimeout(() => setCopiedKey(null), 2000);
      }
    },
    [playClick]
  );

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
    <main className="relative min-h-screen bg-[#060608] text-neutral-300 antialiased selection:bg-[#f97316]/30 overflow-x-hidden">
      <style>{FX_STYLES}</style>

      {/* ══ SCROLL PROGRESS HAIRLINE ══ */}
      <div
        aria-hidden="true"
        className="fixed top-0 left-0 right-0 z-50 h-[1.5px] bg-neutral-900/40 pointer-events-none"
      >
        <div
          className="h-full bg-gradient-to-r from-[#f97316]/60 via-[#f97316] to-amber-400 origin-left transition-transform duration-75 ease-out"
          style={{ transform: `scaleX(${scrollProgress})` }}
        />
      </div>

      {/* ══ NOISE OVERLAY CINEMATOGRÁFICO ══ */}
      <div
        aria-hidden="true"
        className="pointer-events-none fixed inset-0 z-40 opacity-[0.025] mix-blend-screen"
        style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.8' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter)'/%3E%3C/svg%3E")`,
        }}
      />

      {/* ══ AMBIENT MOUSE SPOTLIGHT ══ */}
      <div
        aria-hidden="true"
        className="pointer-events-none fixed inset-0 z-0 transition-opacity duration-300"
        style={{
          background: `radial-gradient(600px circle at ${mousePos.x}px ${mousePos.y}px, rgba(245, 158, 11, 0.035), transparent 80%)`,
        }}
      />

      {/* Visor flotante que sigue al cursor */}
      <FloatingPreview entry={hovered} />

      <article className="relative z-10 mx-auto max-w-5xl px-6 pb-24 pt-16 sm:pt-24">
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
              onClick={toggleAudio}
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
                onPlayClick={playClick}
              />
            ))}
          </ul>
        </section>

        {/* ══ FOOTER EDITORIAL ESTILO RAINBOW WU ══ */}
        <footer className="mt-28 border-t border-neutral-800/80 pt-16">
          {/* Header sutil */}
          <p className="text-xs tracking-[0.2em] text-neutral-500 font-mono mb-4 uppercase">
            HABLEMOS.
          </p>

          {/* Display Email Masivo con botón de copiado */}
          <div className="flex flex-wrap items-baseline gap-4 sm:gap-6">
            <a
              href="mailto:gdlolbit005@gmail.com"
              className="text-4xl sm:text-6xl md:text-7xl font-sans font-medium text-white tracking-tighter hover:text-amber-500 transition-colors inline-block"
            >
              gdlolbit005@gmail.com
            </a>

            <button
              onClick={() => copyText("gdlolbit005@gmail.com", "email")}
              className="inline-flex items-center gap-1.5 rounded-full border border-neutral-800 bg-neutral-900/80 px-3.5 py-1.5 font-mono text-xs text-neutral-400 transition-all hover:border-amber-500 hover:text-white"
              title="Copiar email"
            >
              {copiedKey === "email" ? (
                <>
                  <Check className="h-3.5 w-3.5 text-emerald-400" />
                  <span className="text-emerald-400 font-bold text-[10px]">COPIED!</span>
                </>
              ) : (
                <>
                  <Copy className="h-3.5 w-3.5" />
                  <span className="text-[10px] tracking-wider uppercase">COPIAR</span>
                </>
              )}
            </button>
          </div>

          {/* Sub-barra inferior */}
          <div className="border-t border-neutral-800/60 mt-16 pt-6 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between text-xs font-mono text-neutral-500">
            {/* Izquierda: Discord + GitHub + Lanyard status */}
            <div className="flex flex-wrap items-center gap-5 sm:gap-6">
              {/* Discord con copiado */}
              <button
                onClick={() => copyText("imaginebeinglolbit", "discord")}
                className="group flex items-center gap-1.5 text-neutral-400 transition-colors hover:text-white"
                title="Copiar Discord tag"
              >
                <span>DISCORD:</span>
                <span className="text-neutral-200">@imaginebeinglolbit</span>
                {copiedKey === "discord" ? (
                  <span className="text-emerald-400 font-bold text-[10px]">[COPIED!]</span>
                ) : (
                  <Copy className="h-3 w-3 text-neutral-500 group-hover:text-amber-500 transition-colors" />
                )}
              </button>

              {/* GitHub */}
              <a
                href="https://github.com/Lol-bit-Rvgl"
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-1.5 text-neutral-400 transition-colors hover:text-white"
              >
                <span>GITHUB</span>
                <ExternalLink className="h-3 w-3 text-neutral-500" />
              </a>

              {/* Lanyard status indicator */}
              <span className="flex items-center gap-2">
                <span
                  className={`h-2 w-2 rounded-full ${
                    lanyardIsLive ? "bg-emerald-400 animate-pulse" : "bg-neutral-600"
                  }`}
                />
                <span
                  className={`font-semibold tracking-wider ${
                    lanyardIsLive ? "text-emerald-400" : "text-neutral-500"
                  }`}
                >
                  {lanyardIsLive ? "● LIVE" : "○ OFFLINE"}
                </span>
                {lanyardData?.listening_to_spotify && lanyardData.spotify && (
                  <span className="hidden md:inline text-neutral-400 truncate max-w-xs">
                    (♫ {lanyardData.spotify.song})
                  </span>
                )}
              </span>
            </div>

            {/* Derecha: Copyright / Brand */}
            <div className="shrink-0 text-neutral-600 tracking-widest uppercase">
              © 2026 LOLBIT // GOD&apos;S LIVE LONGER™
            </div>
          </div>
        </footer>
      </article>

      {/* ══ PÍLDORA FLOTANTE DIEGÉTICA (FIXED BOTTOM RIGHT) ══ */}
      <button
        onClick={() => {
          playClick(1000, 0.025);
          setIsChatOpen(true);
        }}
        className="fixed bottom-6 right-6 z-50 inline-flex items-center gap-2.5 rounded-full bg-neutral-950/80 border border-neutral-800 hover:border-amber-500/40 text-neutral-300 text-xs font-mono py-2 px-3.5 shadow-2xl backdrop-blur-md transition-all hover:text-white"
        title="Transmitir señal (Ctrl+K / ⌘K)"
      >
        <Zap className="h-3.5 w-3.5 text-amber-500" />
        <span>Transmitir señal</span>
        <kbd className="ml-1 rounded border border-neutral-800 bg-neutral-900/90 px-1.5 py-0.5 text-[10px] font-sans font-semibold text-neutral-400">
          ⌘K
        </kbd>
      </button>

      {/* ══ MODAL CONVERSACIONAL POLY AI ══ */}
      <LolbitChatModal
        isOpen={isChatOpen}
        onClose={() => {
          playClick(580, 0.025);
          setIsChatOpen(false);
        }}
        onPlayClick={playClick}
      />
    </main>
  );
}
