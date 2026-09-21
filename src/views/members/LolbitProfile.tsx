"use client";

import { useEffect, useRef, useState, useCallback } from "react";
import type { Member } from "@/data/members";
import Image from "next/image";
import { Share_Tech_Mono } from "next/font/google";
import {
  Radio,
  Activity,
  Cpu,
  Volume2,
  TerminalSquare,
  ArrowLeft,
  ExternalLink,
  Copy,
  Check,
  Code2,
  Smartphone,
  Shield,
  Layers,
} from "lucide-react";
import { SiGithub, SiDiscord, SiInstagram, SiTiktok } from "react-icons/si";
import { ModelViewer, SoundButton } from "@/components/fx";

const techMono = Share_Tech_Mono({
  weight: "400",
  subsets: ["latin"],
  display: "swap",
});

interface LogLine {
  text: string;
  kind: "info" | "ok" | "warn" | "cmd" | "accent";
  link?: string;
}

const AUTO_LOGS = [
  "[SEC_CHK] Ping a CAM-07... OK (12ms)",
  "[SIGNAL] Interferencia en canal 84.2 MHz detectada",
  "[AI_NODE] Subrutina Lolbit: transmitiendo paquete de datos",
  "[PWR] Consumo de batería auxiliar: óptimo",
  "[NET] Sincronizando reloj con nodo central... OK",
  "[AUDIO] Voz: descompresión de flujo completada",
];

const HELP_LINES: LogLine[] = [
  { text: "COMANDOS DISPONIBLES EN SISTEMA:", kind: "accent" },
  { text: "  projects", kind: "ok" },
  { text: "    → listar repositorios y proyectos destacados con hipervínculos", kind: "info" },
  { text: "  skills", kind: "ok" },
  { text: "    → mostrar resumen del stack tecnológico y entornos", kind: "info" },
  { text: "  standby", kind: "info" },
  { text: "    → activar interrupción PLEASE STAND BY (1.2s)", kind: "info" },
  { text: "  glitch", kind: "info" },
  { text: "    → inyectar perturbación de señal durante 2s", kind: "info" },
  { text: "  scan", kind: "info" },
  { text: "    → rastreo de nodos y entidades animatrónicas", kind: "info" },
  { text: "  clear / cls", kind: "info" },
  { text: "    → limpiar el historial de la terminal", kind: "info" },
  { text: "  shutdown now / exit / quit", kind: "info" },
  { text: "    → secuencia de desconexión del sistema", kind: "info" },
  { text: "  help", kind: "info" },
  { text: "    → este listado de directivas", kind: "info" },
];

const PROJECTS_DATA = [
  {
    title: "Kyubi Social Frontend",
    type: "Proyecto Individual // Frontend App",
    description:
      "Cliente frontend para plataforma social enfocado en dinamismo de feed, reactividad en tiempo real y arquitectura de componentes desacoplada.",
    tags: ["React", "Next.js", "TypeScript", "REST API", "Tailwind CSS"],
    repo: "https://github.com/Lol-bit-Rvgl/Kyubi-Social-Frontend",
    accent: "orange",
  },
  {
    title: "Honey Cybersecurity",
    type: "Colaboración // Seguridad Ofensiva & Defensiva",
    description:
      "Participación en el desarrollo de herramientas e infraestructura de simulación de amenazas, honeypots y análisis de tráfico para la mitigación de vectores de ataque.",
    tags: ["Cybersecurity", "Honeypots", "Network Analysis", "Python / Scripts"],
    repo: "https://github.com/SpringtraphackkZ/Honey-Cybersecurity",
    accent: "purple",
  },
  {
    title: "Pandly Landing",
    type: "Proyecto en Equipo // Landing Page",
    description:
      "Landing comercial orientada a la conversión y presentación visual atractiva para una aplicación social, con optimización web y microinteracciones de marca.",
    tags: ["Frontend", "UI/UX", "Responsive Design", "Performance"],
    repo: "https://github.com/Lol-bit-Rvgl/Pandly_Landing",
    accent: "orange",
  },
];

const MEMORY_MODULES = [
  {
    addr: "0x10",
    name: "FRONTEND",
    description:
      "Interfaces modernas y reactivas; componentes desacoplados de alto rendimiento.",
    skills: ["React", "Next.js", "TypeScript", "Tailwind CSS"],
    tint: "orange" as const,
  },
  {
    addr: "0x20",
    name: "MOBILE_ARCH",
    description:
      "Desarrollo cross-platform con arquitectura modular y estados predecibles.",
    skills: ["Flutter", "Dart", "Manejo de Estado", "Interfaces Adaptativas"],
    tint: "purple" as const,
  },
  {
    addr: "0x30",
    name: "SECURITY_VECTORS",
    description:
      "Simulación de vectores de ataque, honeypots y túneles seguros en entornos controlados.",
    skills: ["Web Security Testing", "Proxies", "SSH Tunneling", "Honeypots"],
    tint: "emerald" as const,
  },
];

const FX_STYLES = `
@keyframes lolbit-neon-flicker {
  0%, 18%, 21%, 23%, 25%, 54%, 56%, 100% {
    text-shadow:
      0 0 12px rgba(249,115,22,0.65),
      0 0 26px rgba(168,85,247,0.45),
      0 0 45px rgba(249,115,22,0.3);
    color: #ffffff;
  }
  19%, 24%, 55% {
    text-shadow: none;
    color: rgba(245,245,245,0.7);
  }
}
@keyframes rgb-glitch-hover {
  0%, 100% {
    transform: translate(0, 0);
    filter: none;
  }
  20% {
    transform: translate(-3px, 1px);
    filter: drop-shadow(3px 0 0 #f97316) drop-shadow(-3px 0 0 #a855f7) contrast(1.2);
  }
  40% {
    transform: translate(2px, -2px);
    filter: drop-shadow(-2px 0 0 #f97316) drop-shadow(2px 0 0 #9333ea) contrast(1.3);
  }
  60% {
    transform: translate(-2px, -1px);
    filter: drop-shadow(2px 0 0 #a855f7) drop-shadow(-2px 0 0 #f97316) contrast(1.1);
  }
  80% {
    transform: translate(2px, 1px);
    filter: drop-shadow(-1px 0 0 #f97316) contrast(1.25);
  }
}
@keyframes glitch-shift {
  0%   { clip-path: inset(0 0 92% 0); transform: translate(-2px, -1px); }
  20%  { clip-path: inset(28% 0 56% 0); transform: translate(2px, 1px); }
  40%  { clip-path: inset(62% 0 18% 0); transform: translate(-2px, 0); }
  60%  { clip-path: inset(12% 0 74% 0); transform: translate(2px, -1px); }
  80%  { clip-path: inset(44% 0 40% 0); transform: translate(-1px, 1px); }
  100% { clip-path: inset(80% 0 8% 0); transform: translate(1px, 2px); }
}
@keyframes crt-flicker {
  0%, 100% { opacity: 1; }
  97%      { opacity: 1; }
  98%      { opacity: 0.94; }
  99%      { opacity: 0.98; }
}
@keyframes cursor-blink {
  0%, 49% { opacity: 1; }
  50%, 100% { opacity: 0; }
}
@keyframes poweroff {
  0%   { transform: scaleY(1); opacity: 1; }
  35%  { transform: scaleY(0.004); opacity: 1; }
  50%  { transform: scaleY(0.004); opacity: 1; }
  100% { transform: scaleY(0.001); opacity: 0; }
}
@keyframes shake-glitch {
  0%, 100% { transform: translate(0,0); filter: none; }
  10% { transform: translate(-3px, 1px); filter: drop-shadow(3px 0 0 #f97316) drop-shadow(-3px 0 0 #a855f7); }
  30% { transform: translate(3px, -1px); filter: drop-shadow(-3px 0 0 #f97316) drop-shadow(3px 0 0 #a855f7); }
  50% { transform: translate(-2px, 2px); filter: drop-shadow(2px 0 0 #f97316) drop-shadow(-2px 0 0 #a855f7); }
  70% { transform: translate(2px, -2px); filter: drop-shadow(-2px 0 0 #f97316) drop-shadow(2px 0 0 #a855f7); }
}
@keyframes vhs-bars {
  0% { transform: translateY(0); }
  50% { transform: translateY(-3px); }
  100% { transform: translateY(0); }
}
@keyframes row-glitch {
  0%, 100% {
    transform: translateX(0);
    filter: none;
  }
  25% {
    transform: translateX(-3px);
    filter: drop-shadow(2px 0 0 rgba(249,115,22,0.8)) drop-shadow(-2px 0 0 rgba(168,85,247,0.8));
  }
  50% {
    transform: translateX(3px);
    filter: drop-shadow(-2px 0 0 rgba(249,115,22,0.8)) drop-shadow(2px 0 0 rgba(168,85,247,0.8));
  }
  75% {
    transform: translateX(-1px);
    filter: none;
  }
}
@keyframes signal-pulse {
  0%, 100% { opacity: 1; box-shadow: 0 0 7px currentColor; }
  50% { opacity: 0.3; box-shadow: none; }
}

.lolbit-neon-title { animation: lolbit-neon-flicker 4.5s infinite; }
.glitch-hover:hover { animation: rgb-glitch-hover 0.35s steps(2) infinite; }
.vhs-jitter { animation: vhs-bars 0.1s steps(2) infinite; }
.glitch-layer { position: absolute; inset: 0; pointer-events: none; }
.glitch-orange { color: #f97316; animation: glitch-shift 1.4s steps(2) infinite; }
.glitch-purple { color: #a855f7; animation: glitch-shift 1.4s steps(2) infinite reverse; }
.crt-flicker { animation: crt-flicker 6s linear infinite; }
.screen-off { animation: poweroff 1s ease-in forwards; }
.screen-shake { animation: shake-glitch 0.28s steps(2) 7; }
.caret-blink { animation: cursor-blink 1s steps(1) infinite; }
.daemon-row { transition: background 0.25s ease; }
.daemon-row:hover { background: rgba(249,115,22,0.1); }
.daemon-row:hover .daemon-row-inner { animation: row-glitch 0.32s steps(2) infinite; }
.signal-dot { animation: signal-pulse 1.7s ease-in-out infinite; }
.term-scroll::-webkit-scrollbar { width: 5px; }
.term-scroll::-webkit-scrollbar-track { background: transparent; }
.term-scroll::-webkit-scrollbar-thumb { background: rgba(249,115,22,0.3); border-radius: 3px; }
.term-scroll { scrollbar-width: thin; scrollbar-color: rgba(249,115,22,0.35) transparent; }
`;

/* ── Web Audio API: Síntesis de ruido y estática para glitch ── */
function playGlitchBurst() {
  try {
    const AudioCtx =
      window.AudioContext ||
      (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
    if (!AudioCtx) return;
    const ctx = new AudioCtx();
    const duration = 0.35;
    const sampleRate = ctx.sampleRate;
    const bufferSize = Math.floor(sampleRate * duration);
    const noiseBuffer = ctx.createBuffer(1, bufferSize, sampleRate);
    const output = noiseBuffer.getChannelData(0);
    for (let i = 0; i < bufferSize; i++) {
      output[i] = (Math.random() * 2 - 1) * Math.exp(-i / (sampleRate * 0.1));
    }
    const noise = ctx.createBufferSource();
    noise.buffer = noiseBuffer;
    const bandpass = ctx.createBiquadFilter();
    bandpass.type = "bandpass";
    bandpass.frequency.setValueAtTime(1400, ctx.currentTime);
    bandpass.Q.setValueAtTime(4, ctx.currentTime);
    const gain = ctx.createGain();
    gain.gain.setValueAtTime(0.28, ctx.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + duration);
    noise.connect(bandpass);
    bandpass.connect(gain);
    gain.connect(ctx.destination);
    noise.start();
  } catch {
    /* Silencioso */
  }
}

/* ── 2. DESCARGAS ELÉCTRICAS GLITCH LATERALES (CANVAS PROCEDURAL 60FPS) ── */
function ArcLightning({
  side,
  intense,
}: {
  side: "left" | "right";
  intense: boolean;
}) {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let animId: number;
    let timeoutId: ReturnType<typeof setTimeout>;
    let isDisposed = false;

    const resize = () => {
      if (!canvas) return;
      canvas.width = canvas.offsetWidth || 96;
      canvas.height = window.innerHeight;
    };
    resize();
    window.addEventListener("resize", resize);

    interface Bolt {
      points: { x: number; y: number }[];
      alpha: number;
      color: string;
      glowColor: string;
      width: number;
    }

    const activeBolts: Bolt[] = [];

    const spawnBolt = () => {
      const w = canvas.width;
      const h = canvas.height;
      if (w === 0 || h === 0) return;

      const isLeft = side === "left";
      const startX = isLeft ? 0 : w;
      const startY = Math.random() * (h * 0.9) + h * 0.05;
      const segments = 4 + Math.floor(Math.random() * 4);
      const points = [{ x: startX, y: startY }];

      let currX = startX;
      let currY = startY;
      const inwardDir = isLeft ? 1 : -1;
      const maxReach = 35 + Math.random() * 55;

      for (let i = 0; i < segments; i++) {
        currX += inwardDir * (maxReach / segments) + (Math.random() * 12 - 6);
        currY += Math.random() * 32 - 16;
        points.push({ x: currX, y: currY });
      }

      const isPurple = Math.random() < 0.25;
      const color = isPurple ? "#c084fc" : Math.random() < 0.5 ? "#f97316" : "#ffedd5";
      const glowColor = isPurple ? "#a855f7" : "#f97316";

      activeBolts.push({
        points,
        alpha: 1,
        color,
        glowColor,
        width: 1.2 + Math.random() * 1.6,
      });

      // Ráfaga secundaria de alto voltaje
      if (Math.random() < 0.4) {
        setTimeout(() => {
          if (!isDisposed) spawnBolt();
        }, 45);
      }
    };

    const scheduleNext = () => {
      if (isDisposed) return;
      const delay = intense
        ? 60 + Math.random() * 120
        : 1500 + Math.random() * 1500; // 1.5s - 3s en modo normal

      timeoutId = setTimeout(() => {
        spawnBolt();
        scheduleNext();
      }, delay);
    };

    const loop = () => {
      if (isDisposed) return;
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      for (let i = activeBolts.length - 1; i >= 0; i--) {
        const b = activeBolts[i];
        ctx.save();
        ctx.strokeStyle = b.color;
        ctx.lineWidth = b.width;
        ctx.globalAlpha = Math.max(0, b.alpha);
        ctx.shadowColor = b.glowColor;
        ctx.shadowBlur = 10;
        ctx.lineCap = "round";
        ctx.lineJoin = "bevel";

        ctx.beginPath();
        b.points.forEach((pt, idx) => {
          if (idx === 0) ctx.moveTo(pt.x, pt.y);
          else ctx.lineTo(pt.x, pt.y);
        });
        ctx.stroke();
        ctx.restore();

        b.alpha -= 0.12;
        if (b.alpha <= 0) {
          activeBolts.splice(i, 1);
        }
      }

      animId = requestAnimationFrame(loop);
    };

    scheduleNext();
    loop();

    return () => {
      isDisposed = true;
      window.removeEventListener("resize", resize);
      cancelAnimationFrame(animId);
      clearTimeout(timeoutId);
    };
  }, [side, intense]);

  return (
    <canvas
      ref={canvasRef}
      className={`fixed inset-y-0 ${side === "left" ? "left-0" : "right-0"} w-24 h-full pointer-events-none z-20`}
    />
  );
}

export function LolbitProfile({ member }: { member: Member }) {
  // Bandera mounted para protección total contra hydration mismatch en Turbopack
  const [mounted, setMounted] = useState(false);
  const [now, setNow] = useState<string>("");
  const [afk, setAfk] = useState(true);
  const [standbyActive, setStandbyActive] = useState(false);
  const [shaking, setShaking] = useState(false);
  const [shutdown, setShutdown] = useState(false);
  const [input, setInput] = useState("");
  const [dcCopied, setDcCopied] = useState(false);
  const [isGlitchHover, setIsGlitchHover] = useState(false);
  const [expandedDaemon, setExpandedDaemon] = useState<number | null>(null);

  const [logs, setLogs] = useState<LogLine[]>([
    { text: "Fazbear OS v2.7.1 // Secure Kernel Node initialized", kind: "accent" },
    { text: "> Identity: Lolbit (Reversing, Reactive Dev & Sec Explorer)", kind: "ok" },
    { text: "> Redireccionando telemetría de nodo a Cam 07...", kind: "info" },
    { text: "Escribe 'projects' para repositorios o 'help' para directivas.", kind: "info" },
  ]);

  const logRef = useRef<HTMLDivElement>(null);
  const audioRef = useRef<HTMLAudioElement | null>(null);

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    if (!mounted) return;
    const tick = () =>
      setNow(
        new Date().toLocaleTimeString("es-ES", {
          hour: "2-digit",
          minute: "2-digit",
          second: "2-digit",
        })
      );
    tick();
    const id = setInterval(tick, 1000);
    return () => clearInterval(id);
  }, [mounted]);

  useEffect(() => {
    if (!mounted) return;
    let idx = 0;
    const pushAuto = () => {
      const line = AUTO_LOGS[idx % AUTO_LOGS.length];
      appendLog({ text: line, kind: "info" });
      idx++;
    };
    const id = setInterval(() => pushAuto(), 6000 + Math.random() * 3000);
    return () => clearInterval(id);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [mounted]);

  useEffect(() => {
    if (logRef.current) {
      logRef.current.scrollTop = logRef.current.scrollHeight;
    }
  }, [logs]);

  const appendLog = (line: LogLine) => {
    setLogs((prev) => [...prev, line]);
  };

  const playSound = (src: string) => {
    try {
      if (!audioRef.current) {
        audioRef.current = new Audio();
      }
      audioRef.current.src = src;
      audioRef.current.volume = 0.25;
      audioRef.current.currentTime = 0;
      audioRef.current.play().catch(() => {});
    } catch {
      /* Silencioso si no existe el audio */
    }
  };

  const handleBackToClan = useCallback(() => {
    if (typeof window !== "undefined") {
      window.location.href = "/";
    }
  }, []);

  /* ── Mecánica 'PLEASE STAND BY' (1.2s de interrupción diegética) ── */
  const triggerStandbyInterrupt = useCallback(() => {
    if (standbyActive) return;
    setStandbyActive(true);
    playGlitchBurst();
    playSound("/sounds/glitch.mp3");

    appendLog({
      text: "[ALERT] Byte interrupt triggered: broadcast channel overridden.",
      kind: "accent",
    });

    setTimeout(() => {
      setStandbyActive(false);
    }, 1200);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [standbyActive]);

  const runShutdown = () => {
    appendLog({ text: "Iniciando secuencia de apagado del nodo...", kind: "warn" });
    playSound("/sounds/shutdown.mp3");
    setShutdown(true);
    setTimeout(() => {
      if (typeof window !== "undefined") {
        window.location.href = "/";
      }
    }, 1200);
  };

  const runScan = () => {
    appendLog({ text: "[SCAN] Rastreo de nodos y entidades iniciado...", kind: "accent" });
    const lines: LogLine[] = [
      { text: "  N-01 \"Kyubi Social\"     [ONLINE // HTTPS] 100%", kind: "ok" },
      { text: "  N-02 \"Honey Sec-Lab\"    [ACTIVE // DEFENSE] 98%", kind: "ok" },
      { text: "  N-03 \"Pandly Gateway\"   [READY // CONVERSION] 95%", kind: "info" },
      { text: "  F-03 \"Animatronic Core\" [████████░░] 84.2 MHz", kind: "warn" },
    ];
    setTimeout(() => appendLog(lines[0]), 200);
    setTimeout(() => appendLog(lines[1]), 500);
    setTimeout(() => appendLog(lines[2]), 800);
    setTimeout(() => appendLog(lines[3]), 1100);
  };

  const printProjectsInTerminal = () => {
    appendLog({ text: "── REPOSITORIOS Y PROYECTOS DESTACADOS ──", kind: "accent" });
    PROJECTS_DATA.forEach((p, index) => {
      appendLog({
        text: `${index + 1}. [${p.title}] — ${p.type}`,
        kind: "ok",
        link: p.repo,
      });
      appendLog({
        text: `   > Repo: ${p.repo}`,
        kind: "info",
        link: p.repo,
      });
    });
  };

  const copyDiscord = async () => {
    try {
      await navigator.clipboard.writeText("imaginebeinglolbit");
      playSound("/sounds/click.mp3");
      setDcCopied(true);
      setTimeout(() => setDcCopied(false), 2200);
    } catch {
      /* clipboard fallback */
    }
  };

  const handleCommand = (raw: string) => {
    const cmd = raw.trim();
    if (!cmd) return;

    appendLog({ text: `root@fazbear-node:~# ${cmd}`, kind: "cmd" });

    const lower = cmd.toLowerCase();

    if (lower === "shutdown now" || lower === "exit" || lower === "quit") {
      runShutdown();
    } else if (lower === "projects") {
      printProjectsInTerminal();
    } else if (lower === "skills") {
      appendLog({ text: "── STACK TECNOLÓGICO ACTIVO ──", kind: "accent" });
      appendLog({ text: "Frontend: React, Next.js, TypeScript, Tailwind CSS", kind: "ok" });
      appendLog({ text: "Móvil: Flutter, Dart, Manejo de Estado, UI Adaptativa", kind: "ok" });
      appendLog({ text: "Seguridad: Web Security Testing, Proxies, SSH, Honeypots", kind: "ok" });
    } else if (lower === "standby") {
      triggerStandbyInterrupt();
    } else if (lower === "glitch") {
      appendLog({ text: "Inyectando perturbación de señal de video...", kind: "warn" });
      playSound("/sounds/glitch.mp3");
      setShaking(true);
      setTimeout(() => setShaking(false), 2000);
    } else if (lower === "scan") {
      runScan();
    } else if (lower === "clear" || lower === "cls") {
      setLogs([]);
    } else if (lower === "help") {
      HELP_LINES.forEach((line) => appendLog(line));
    } else {
      appendLog({
        text: `Comando no reconocido: "${cmd}". Escribe "help" para ver las opciones.`,
        kind: "warn",
      });
    }
  };

  const onKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      handleCommand(input);
      setInput("");
    }
  };

  const isHighVoltage = standbyActive || shaking || isGlitchHover;

  // Hydration safety: renderizar skeleton seguro hasta montar
  if (!mounted) {
    return (
      <main className="min-h-screen bg-neutral-950 text-neutral-200 flex items-center justify-center font-mono">
        <div className="flex items-center gap-3 text-orange-400 text-sm tracking-widest">
          <span className="size-2 rounded-full bg-orange-500 animate-ping" />
          INICIALIZANDO PORTAFOLIO TÉCNICO // LOLBIT...
        </div>
      </main>
    );
  }

  return (
    <main
      className={`crt-flicker relative min-h-screen overflow-x-hidden bg-neutral-950 text-neutral-200 selection:bg-orange-500/30 selection:text-orange-200 font-sans ${
        shaking ? "screen-shake" : ""
      } ${shutdown ? "screen-off" : ""}`}
    >
      <style>{FX_STYLES}</style>

      {/* ── 2. DESCARGAS ELÉCTRICAS GLITCH LATERALES (ORANGE ARC LIGHTNING) ── */}
      <ArcLightning side="left" intense={isHighVoltage} />
      <ArcLightning side="right" intense={isHighVoltage} />

      {/* ── Overlay de apagado CRT ─────────────────────── */}
      {shutdown && (
        <div className="pointer-events-none fixed inset-0 z-[60] flex items-center justify-center bg-black">
          <div className="h-[2px] w-full bg-[#F0EDE6] shadow-[0_0_20px_4px_rgba(240,237,230,0.6)]" />
        </div>
      )}

      {/* ── 3. OVERLAY SUTIL DE SCANLINES CRT / TEXTURA ──── */}
      <div
        aria-hidden="true"
        className="opacity-[0.03] pointer-events-none fixed inset-0 z-10"
        style={{
          backgroundImage:
            "repeating-linear-gradient(0deg, #fff 0px, #fff 1px, transparent 1px, transparent 3px)",
        }}
      />

      {/* Fondo sutil y textura de malla */}
      <div className="pointer-events-none fixed inset-0 z-0 opacity-40">
        <div
          className="absolute inset-0"
          style={{
            backgroundImage:
              "radial-gradient(rgba(249,115,22,0.06) 1px, transparent 1px), radial-gradient(rgba(168,85,247,0.04) 1px, transparent 1px)",
            backgroundSize: "32px 32px",
            backgroundPosition: "0 0, 16px 16px",
          }}
        />
        <div className="absolute inset-0 bg-gradient-to-b from-transparent via-neutral-950/80 to-neutral-950" />
      </div>

      {/* ── 4. PLACA DIEGÉTICA DE AJUSTE: PLEASE STAND BY (1.2s) ── */}
      {standbyActive && (
        <div
          role="status"
          aria-live="assertive"
          className="fixed inset-0 z-[100] flex flex-col items-center justify-center bg-black overflow-hidden pointer-events-auto select-none"
        >
          {/* Barras de color CRT diegéticas estilo SMPTE */}
          <div className="absolute inset-0 grid grid-cols-7 opacity-85 vhs-jitter">
            <div className="bg-[#e5e5e5]" />
            <div className="bg-[#eab308]" />
            <div className="bg-[#06b6d4]" />
            <div className="bg-[#22c55e]" />
            <div className="bg-[#a855f7]" />
            <div className="bg-[#ef4444]" />
            <div className="bg-[#3b82f6]" />
          </div>

          {/* Scanlines y sombreado sobre las barras */}
          <div
            aria-hidden="true"
            className="absolute inset-0 bg-black/40"
            style={{
              backgroundImage:
                "repeating-linear-gradient(0deg, rgba(0,0,0,0.6) 0px, rgba(0,0,0,0.6) 2px, transparent 2px, transparent 4px)",
            }}
          />

          {/* Placa central PLEASE STAND BY */}
          <div className="relative z-10 mx-4 border-4 border-black bg-white px-8 py-6 text-center shadow-[0_0_60px_rgba(0,0,0,0.95)] max-w-lg">
            <div className="border-2 border-black p-5 bg-neutral-100">
              <p
                className={`${techMono.className} text-2xl sm:text-3xl md:text-4xl font-black tracking-[0.3em] text-black uppercase mb-1.5`}
              >
                PLEASE STAND BY
              </p>
              <p className="text-[11px] font-mono font-bold tracking-widest text-neutral-600">
                FAZBEAR ENTERTAINMENT // BROADCAST INTERRUPT [84.2 MHz]
              </p>
            </div>
          </div>
        </div>
      )}

      {/* ── BARRA SUPERIOR DE NAVEGACIÓN Y STATUS ─────── */}
      <header className="relative z-30 max-w-6xl mx-auto px-4 pt-6 pb-3 flex flex-wrap items-center justify-between gap-4 border-b border-neutral-800/80">
        <button
          onClick={handleBackToClan}
          className="group inline-flex items-center gap-2 px-3 py-1.5 rounded-md border border-neutral-800 bg-neutral-900/60 backdrop-blur-md text-xs font-mono tracking-wider text-neutral-300 hover:text-white hover:border-orange-500/60 hover:shadow-[0_0_15px_rgba(249,115,22,0.25)] transition-all cursor-pointer"
        >
          <ArrowLeft className="size-3.5 transition-transform group-hover:-translate-x-1 text-orange-400" />
          <span>GLL // CLAN ROSTER</span>
        </button>

        {/* 1. Badge superior de estado: técnico y críptico */}
        <div className="flex items-center gap-2.5 px-3.5 py-1 rounded-full border border-neutral-800 bg-neutral-900/70 text-xs font-mono">
          <span className="size-2 rounded-full bg-orange-500 animate-ping shadow-[0_0_8px_#f97316]" />
          <span className="text-neutral-200 font-bold tracking-wide">
            AUTONOMOUS RUNTIME // SYS.GEN-18 // ETHICAL RESEARCH &amp; DEV
          </span>
        </div>

        {/* Live feed info y botón Standby */}
        <div className="flex items-center gap-3">
          <div className="hidden md:flex items-center gap-2 text-[11px] font-mono text-neutral-400">
            <Radio className="size-3 text-orange-500 animate-pulse" />
            <span>CAM_07 // {now || "--:--:--"}</span>
          </div>

          <button
            onClick={triggerStandbyInterrupt}
            title="Haz clic para activar interrupción PLEASE STAND BY"
            className="text-[11px] font-mono px-2.5 py-1 rounded border border-neutral-800 bg-neutral-900/40 text-neutral-400 hover:text-orange-300 hover:border-orange-500/50 hover:shadow-[0_0_12px_rgba(249,115,22,0.3)] transition-all cursor-pointer"
          >
            [ STANDBY ]
          </button>
        </div>
      </header>

      {/* ── SECCIÓN 1: HERO & PRESENTACIÓN PERSONAL (abierto, asimétrico) ── */}
      <section className="relative z-20 max-w-6xl mx-auto px-4 py-20">
        {/* Coordenadas de nodo de terminal — línea fina, sin caja */}
        <div className="flex items-center justify-between font-mono text-[10px] text-neutral-700 select-none pb-4 border-b border-neutral-800/40">
          <span>NODE_ID // 0x7F</span>
          <span className="hidden sm:inline">FREQ // 84.2MHz</span>
          <span className="hidden sm:inline">CH // CAM_07</span>
          <span className="text-orange-500/60 font-semibold">[ SEC_MODE: ETHICAL_RESEARCH ]</span>
        </div>

        <div className="mt-12 flex flex-col md:flex-row items-center md:items-start gap-10 md:gap-14">
          {/* Avatar flotante — sin marco, leve rotación asimétrica */}
          <div
            onClick={triggerStandbyInterrupt}
            onMouseEnter={() => setIsGlitchHover(true)}
            onMouseLeave={() => setIsGlitchHover(false)}
            title="Haz clic para test de señal // PLEASE STAND BY"
            className="glitch-hover shrink-0 relative group cursor-pointer -rotate-2 md:mt-4 md:ml-4"
          >
            <div className="absolute -inset-1.5 rounded-2xl bg-gradient-to-tr from-orange-500/30 via-purple-600/20 to-orange-400/30 blur-md opacity-70 group-hover:opacity-100 transition-opacity" />
            <div className="relative size-32 sm:size-40 rounded-2xl overflow-hidden border-2 border-neutral-800 group-hover:border-orange-500/60 bg-neutral-900 p-1 shadow-[0_0_25px_rgba(249,115,22,0.15)] transition-colors">
              <Image
                src="/images/members/lolbit/avatars.jpeg"
                alt={member.displayName}
                fill
                priority
                className="object-cover rounded-xl"
              />
            </div>
            {/* Tag fundador */}
            <span className="absolute -bottom-2 -right-2 px-2 py-0.5 rounded text-[10px] font-mono font-bold bg-neutral-950 border border-purple-500/50 text-purple-300 shadow-[0_0_10px_rgba(168,85,247,0.3)]">
              FOUNDER
            </span>
          </div>

          {/* Información principal del dev — desplazada para asimetría */}
          <div className="flex-1 text-center md:text-left min-w-0 md:pl-10 md:pt-2">
            <div className="flex flex-wrap items-center justify-center md:justify-start gap-3 mb-3 font-mono">
              <span className="text-xs text-orange-400 tracking-widest font-bold uppercase">
                ↳᭄۞⃟𝐆𝐋Լೄ // FOUNDER &amp; CREATOR
              </span>
              <span className="text-neutral-700">/</span>
              <span className="text-xs text-neutral-400 tracking-wider">
                SECURITY &amp; SYSTEM EXPLORER
              </span>
            </div>

            {/* Nombre Lolbit con tipografía cyberpunk, parpadeo de neón naranja/púrpura y clic interactivo */}
            <h1
              onClick={triggerStandbyInterrupt}
              onMouseEnter={() => setIsGlitchHover(true)}
              onMouseLeave={() => setIsGlitchHover(false)}
              title="Haz clic para interrupción PLEASE STAND BY"
              className={`${techMono.className} lolbit-neon-title glitch-hover relative inline-block text-4xl sm:text-5xl lg:text-6xl font-black tracking-wider uppercase text-white mb-4 cursor-pointer select-none`}
            >
              <span className="glitch-layer glitch-purple opacity-40 select-none" aria-hidden>
                {member.displayName}
              </span>
              <span className="glitch-layer glitch-orange opacity-40 select-none" aria-hidden>
                {member.displayName}
              </span>
              <span className="relative">Lolbit</span>
            </h1>

            {/* 1. Subtítulo y Texto Secundario (Enfoque en arquitectura y reversing) */}
            <p className="text-base sm:text-lg text-neutral-200 font-medium mb-3 leading-snug">
              “Ingeniería inversa, desarrollo reactivo y exploración de entornos ofensivos/defensivos.”
            </p>

            <p className="text-sm text-neutral-400 leading-relaxed max-w-2xl font-normal mb-8">
              “Desmontando arquitecturas para entender su lógica interna. Interfaces móviles, sistemas web modernos y experimentación con vectores de red en entornos controlados.”
            </p>

            {/* Badges de acceso rápido minimalistas */}
            <div className="flex flex-wrap items-center justify-center md:justify-start gap-2.5">
              {/* GitHub */}
              <a
                href="https://github.com/Lol-bit-Rvgl"
                target="_blank"
                rel="noopener noreferrer"
                className="group flex items-center gap-2 px-3 py-1.5 rounded-lg border border-neutral-800 bg-neutral-900/60 hover:bg-neutral-800/80 hover:border-orange-500/50 text-xs font-mono text-neutral-300 hover:text-white transition-all"
              >
                <SiGithub className="size-3.5 text-neutral-400 group-hover:text-orange-400 transition-colors" />
                <span>GitHub</span>
                <ExternalLink className="size-3 text-neutral-500 group-hover:text-neutral-300 transition-colors" />
              </a>

              {/* Discord con copiado interactivo */}
              <button
                onClick={copyDiscord}
                title="Copiar tag de Discord"
                className="group flex items-center gap-2 px-3 py-1.5 rounded-lg border border-neutral-800 bg-neutral-900/60 hover:bg-neutral-800/80 hover:border-orange-500/50 text-xs font-mono text-neutral-300 hover:text-white transition-all cursor-pointer"
              >
                <SiDiscord className="size-3.5 text-[#5865F2] group-hover:text-orange-400 transition-colors" />
                <span>Discord</span>
                {dcCopied ? (
                  <span className="text-[10px] text-emerald-400 font-bold flex items-center gap-1">
                    <Check className="size-3" /> [ COPIADO ]
                  </span>
                ) : (
                  <Copy className="size-3 text-neutral-500 group-hover:text-neutral-300 transition-colors" />
                )}
              </button>

              {/* Instagram */}
              <a
                href="https://www.instagram.com/z_lolbit"
                target="_blank"
                rel="noopener noreferrer"
                className="group flex items-center gap-2 px-3 py-1.5 rounded-lg border border-neutral-800 bg-neutral-900/60 hover:bg-neutral-800/80 hover:border-orange-500/50 text-xs font-mono text-neutral-300 hover:text-white transition-all"
              >
                <SiInstagram className="size-3.5 text-neutral-400 group-hover:text-orange-400 transition-colors" />
                <span>Instagram</span>
                <ExternalLink className="size-3 text-neutral-500 group-hover:text-neutral-300 transition-colors" />
              </a>

              {/* TikTok */}
              <a
                href="https://www.tiktok.com/@z_lolbit"
                target="_blank"
                rel="noopener noreferrer"
                className="group flex items-center gap-2 px-3 py-1.5 rounded-lg border border-neutral-800 bg-neutral-900/60 hover:bg-neutral-800/80 hover:border-orange-500/50 text-xs font-mono text-neutral-300 hover:text-white transition-all"
              >
                <SiTiktok className="size-3.5 text-neutral-400 group-hover:text-orange-400 transition-colors" />
                <span>TikTok</span>
                <ExternalLink className="size-3 text-neutral-500 group-hover:text-neutral-300 transition-colors" />
              </a>
            </div>
          </div>
        </div>
      </section>

      {/* ── SECCIÓN 2: LABORATORIO INTERACTIVO (PANEL DE INSTRUMENTACIÓN) ── */}
      <section className="relative z-20 max-w-6xl mx-auto my-28 px-4">
        <div className="mb-4 flex items-center justify-between border-b border-neutral-800 pb-2 font-mono">
          <div className={`${techMono.className} flex items-center gap-2 text-sm tracking-wider text-orange-400 font-bold uppercase`}>
            <TerminalSquare className="size-4" />
            <span>LABORATORIO DIEGÉTICO // VIEWPORT &amp; KERNEL CONSOLE</span>
          </div>
          <span className="text-[10px] text-neutral-500">FAZBEAR_SUBSYSTEMS_ACTIVE</span>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
          {/* Cámara de contención 3D — esquinas abiertas, sin caja cerrada */}
          <div className="lg:col-span-4 relative">
            {/* Header del Viewport */}
            <div className="flex items-center justify-between px-1 py-2 font-mono text-xs text-neutral-400">
              <span className="flex items-center gap-1.5 text-neutral-300 font-semibold">
                <Activity className="size-3.5 text-orange-400" />
                3D_RENDER // ANIMATRONIC
              </span>
              <span className="text-[10px] text-orange-400 font-mono">USDZ_VIEWER</span>
            </div>

            {/* Contención: esquinas abiertas + scanlines transparentes */}
            <div className="relative h-72 sm:h-80 w-full flex items-center justify-center overflow-hidden">
              {/* retícula de fondo tenue */}
              <div
                className="absolute inset-0 pointer-events-none opacity-25"
                style={{
                  backgroundImage:
                    "linear-gradient(rgba(249,115,22,0.12) 1px, transparent 1px), linear-gradient(90deg, rgba(249,115,22,0.12) 1px, transparent 1px)",
                  backgroundSize: "28px 28px",
                }}
              />
              <ModelViewer
                url="/images/members/lolbit/scene.usdz"
                className="h-full w-full cursor-grab active:cursor-grabbing"
                keyLight="#f97316"
                accentLight="#a855f7"
              />
              {/* scanlines transparentes sobre la cámara */}
              <div
                aria-hidden="true"
                className="absolute inset-0 pointer-events-none opacity-30"
                style={{
                  backgroundImage:
                    "repeating-linear-gradient(0deg, rgba(255,255,255,0.5) 0px, rgba(255,255,255,0.5) 1px, transparent 1px, transparent 4px)",
                }}
              />
              {/* Esquinas abiertas de contención */}
              <span className="absolute top-0 left-0 h-6 w-6 border-t-2 border-l-2 border-orange-500/70 pointer-events-none" />
              <span className="absolute top-0 right-0 h-6 w-6 border-t-2 border-r-2 border-orange-500/70 pointer-events-none" />
              <span className="absolute bottom-0 left-0 h-6 w-6 border-b-2 border-l-2 border-orange-500/70 pointer-events-none" />
              <span className="absolute bottom-0 right-0 h-6 w-6 border-b-2 border-r-2 border-orange-500/70 pointer-events-none" />
            </div>

            {/* Telemetría inferior */}
            <div className="grid grid-cols-3 gap-2 py-3 font-mono text-[10px] text-neutral-400 text-center border-b border-neutral-800/60">
              <div className="flex items-center justify-center gap-1.5">
                <Cpu className="size-3 text-orange-400" />
                <span>CPU: 34%</span>
              </div>
              <div className="flex items-center justify-center gap-1.5">
                <Activity className="size-3 text-emerald-400" />
                <span>MEM: 512MB</span>
              </div>
              <div className="flex items-center justify-center gap-1.5">
                <Volume2 className="size-3 text-purple-400" />
                <span>AUDIO: 84.2MHz</span>
              </div>
            </div>
          </div>

          {/* Consola — protagonismo visual, panel de instrumentación */}
          <div className="lg:col-span-8 flex flex-col border border-neutral-800 bg-neutral-900/60 backdrop-blur-md rounded-xl overflow-hidden shadow-[0_0_40px_rgba(249,115,22,0.07)]">
            {/* Header de la consola */}
            <div className="flex items-center justify-between border-b border-neutral-800 px-4 py-2.5 font-mono text-xs text-neutral-400 bg-neutral-950/60">
              <div className="flex items-center gap-2 text-purple-400 font-semibold">
                <TerminalSquare className="size-3.5 text-orange-400" />
                <span>FAZBEAR_TERMINAL // NODE_INTERACTIVE</span>
              </div>
              <div className="flex items-center gap-2 text-[10px] text-neutral-500">
                <span>UTF-8</span>
                <span>•</span>
                <span className="text-emerald-400">ONLINE</span>
              </div>
            </div>

            {/* Logs interactivos con auto-scroll */}
            <div
              ref={logRef}
              className="term-scroll h-72 sm:h-80 overflow-y-auto p-4 space-y-1 font-mono text-[11px] leading-relaxed bg-neutral-950"
            >
              {logs.map((line, i) => (
                <div key={i}>
                  {line.link ? (
                    <a
                      href={line.link}
                      target="_blank"
                      rel="noopener noreferrer"
                      className={`inline-flex items-center gap-1 underline underline-offset-2 transition-colors ${
                        line.kind === "ok"
                          ? "text-emerald-400 hover:text-emerald-300 font-bold"
                          : line.kind === "accent"
                          ? "text-purple-400 hover:text-purple-300"
                          : "text-orange-400 hover:text-orange-300"
                      }`}
                    >
                      <span>{line.text}</span>
                      <ExternalLink className="size-2.5 shrink-0" />
                    </a>
                  ) : (
                    <p
                      className={
                        line.kind === "cmd"
                          ? "text-white font-semibold"
                          : line.kind === "ok"
                          ? "text-emerald-400"
                          : line.kind === "warn"
                          ? "text-orange-400"
                          : line.kind === "accent"
                          ? "text-purple-400 font-bold"
                          : "text-neutral-400"
                      }
                    >
                      {line.text}
                    </p>
                  )}
                </div>
              ))}
            </div>

            {/* Input de comandos */}
            <div className="flex items-center gap-2 border-t border-neutral-800 px-4 py-2.5 bg-neutral-950/90 font-mono text-xs">
              <span className="shrink-0 text-orange-500 font-bold">
                root@fazbear-node:~#
              </span>
              <input
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={onKeyDown}
                spellCheck={false}
                autoComplete="off"
                placeholder="Escribe 'projects', 'help' o 'standby'..."
                aria-label="Línea de comandos Fazbear"
                className="min-w-0 flex-1 bg-transparent text-neutral-200 caret-orange-400 outline-none placeholder:text-neutral-600 text-xs"
              />
              <span className="caret-blink text-orange-400 font-bold">▊</span>
            </div>
          </div>
        </div>
      </section>

      {/* ── SECCIÓN 3: PROC_ID // DAEMON LIST ── */}
      <section className="relative z-20 max-w-6xl mx-auto my-28 px-4">
        <div className="mb-2 flex items-center justify-between border-b border-neutral-800 pb-3">
          <div>
            <h2 className={`${techMono.className} text-xl sm:text-2xl font-black text-white tracking-wider uppercase flex items-center gap-2`}>
              <Code2 className="size-5 text-orange-400" />
              PROC_ID // Daemon List
            </h2>
            <p className="text-xs text-neutral-400 font-mono mt-1">
              Repositorios y proyectos destacados corriendo como procesos del sistema.
            </p>
          </div>
          <span className="text-[11px] font-mono text-neutral-500 hidden sm:inline">
            3 DAEMONS // MEM_RESIDENT
          </span>
        </div>

        {/* Cabecera de columnas */}
        <div className="hidden md:grid grid-cols-[130px_1fr_auto] gap-4 px-4 pt-4 pb-2 font-mono text-[10px] tracking-[0.2em] text-neutral-600 uppercase">
          <span>Estado</span>
          <span>Proceso / Categoría</span>
          <span className="text-right">Inspección</span>
        </div>

        <div className="border-t border-neutral-800/70">
          {PROJECTS_DATA.map((proj, i) => {
            const isOrange = proj.accent === "orange";
            const expanded = expandedDaemon === i;
            return (
              <div key={proj.title} className="daemon-row border-b border-neutral-800/70">
                <div
                  role="button"
                  tabIndex={0}
                  onClick={() => setExpandedDaemon(expanded ? null : i)}
                  onKeyDown={(e) => {
                    if (e.key === "Enter" || e.key === " ") {
                      e.preventDefault();
                      setExpandedDaemon(expanded ? null : i);
                    }
                  }}
                  className="daemon-row-inner grid grid-cols-1 md:grid-cols-[130px_1fr_auto] gap-2 md:gap-4 items-center px-2 sm:px-4 py-4 cursor-pointer"
                >
                  {/* Estado */}
                  <span
                    className={`font-mono text-[11px] font-bold tracking-wider ${
                      isOrange ? "text-orange-400" : "text-purple-400"
                    }`}
                  >
                    [ACTIVE // 0x0{i + 1}]
                  </span>

                  {/* Nombre + categoría + pills */}
                  <span className="min-w-0">
                    <span className={`${techMono.className} block text-sm sm:text-base font-bold text-white uppercase tracking-wide truncate`}>
                      {proj.title}
                    </span>
                    <span className="block font-mono text-[11px] text-neutral-500 truncate mt-0.5">
                      {proj.type}
                    </span>
                    <span className="mt-2 flex flex-wrap gap-1.5">
                      {proj.tags.map((t) => (
                        <span
                          key={t}
                          className="font-mono text-[10px] px-1.5 py-px border border-neutral-800 text-neutral-400"
                        >
                          {t}
                        </span>
                      ))}
                    </span>
                  </span>

                  {/* Inspección */}
                  <span className="flex items-center gap-2 justify-start md:justify-end">
                    <span className="font-mono text-[10px] text-neutral-500 hidden lg:inline">
                      {expanded ? "[-] COLAPSAR" : "[+] EXPANDIR"}
                    </span>
                    <a
                      href={proj.repo}
                      target="_blank"
                      rel="noopener noreferrer"
                      title="Ver código fuente en GitHub"
                      onClick={(e) => e.stopPropagation()}
                      className="inline-flex items-center gap-1.5 px-2.5 py-1.5 border border-neutral-700 text-neutral-300 hover:text-white hover:border-orange-500/60 hover:shadow-[0_0_12px_rgba(249,115,22,0.25)] transition-all font-mono text-[11px]"
                    >
                      <SiGithub className="size-3.5" />
                      <span className="hidden sm:inline">CÓDIGO</span>
                      <ExternalLink className="size-3" />
                    </a>
                  </span>
                </div>

                {/* Descripción técnica desplegable */}
                {expanded && (
                  <div className="px-2 sm:px-4 pb-5 md:pl-[162px]">
                    <p className="font-mono text-xs text-neutral-400 leading-relaxed border-l-2 border-orange-500/50 pl-3 max-w-3xl">
                      <span className="text-orange-400 font-bold">$ cat README — </span>
                      {proj.description}
                    </p>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </section>

      {/* ── SECCIÓN 4: SUBSYSTEM TREE // MEMORY MAP ────── */}
      <section className="relative z-20 max-w-6xl mx-auto my-28 px-4">
        <div className="mb-8 flex items-center justify-between border-b border-neutral-800 pb-3">
          <div>
            <h2 className={`${techMono.className} text-xl sm:text-2xl font-black text-white tracking-wider uppercase flex items-center gap-2`}>
              <Layers className="size-5 text-purple-400" />
              Subsystem Tree // Memory Map
            </h2>
            <p className="text-xs text-neutral-400 font-mono mt-1">
              Módulos cargados en memoria — capacidades y stack en tiempo de ejecución.
            </p>
          </div>
          <span className="text-[11px] font-mono text-neutral-500 hidden sm:inline">
            root@fazbear-node:~/memory $ lsmod
          </span>
        </div>

        <div className="font-mono max-w-4xl">
          {MEMORY_MODULES.map((mod, mi) => {
            const isLast = mi === MEMORY_MODULES.length - 1;
            const tintText =
              mod.tint === "orange"
                ? "text-orange-400"
                : mod.tint === "purple"
                  ? "text-purple-400"
                  : "text-emerald-400";
            const ModuleIcon =
              mod.tint === "orange" ? Code2 : mod.tint === "purple" ? Smartphone : Shield;
            return (
              <div key={mod.addr} className="flex gap-3 sm:gap-4">
                {/* Guía vertical del árbol */}
                <div className="flex flex-col items-center select-none" aria-hidden>
                  <span className={`signal-dot mt-2 size-2 rounded-full ${tintText} bg-current`} />
                  {!isLast && <span className="w-px flex-1 bg-neutral-800" />}
                </div>

                <div className={`pb-10 ${isLast ? "pb-2" : ""} min-w-0 flex-1`}>
                  {/* Bloque de dirección + módulo */}
                  <div className="flex flex-wrap items-center gap-x-3 gap-y-1">
                    <span className="text-[11px] font-bold tracking-widest text-neutral-500">
                      [{mod.addr}_{mod.name}]
                    </span>
                    <span className={`flex items-center gap-1.5 text-sm font-bold text-white uppercase tracking-wider ${techMono.className}`}>
                      <ModuleIcon className={`size-4 ${tintText}`} />
                      {mod.name}
                    </span>
                    <span className="text-[10px] text-emerald-400 tracking-widest">
                      [LOADED]
                    </span>
                  </div>
                  <p className="mt-1.5 text-xs text-neutral-400 leading-relaxed max-w-2xl">
                    {mod.description}
                  </p>

                  {/* Subrutinas hijas con conectores ASCII */}
                  <div className="mt-3 space-y-1.5">
                    {mod.skills.map((skill, si) => {
                      const lastLeaf = si === mod.skills.length - 1;
                      return (
                        <div key={skill} className="flex items-center gap-2 text-xs sm:text-[13px]">
                          <span className="text-neutral-600 select-none">
                            {lastLeaf ? "└──" : "├──"}
                          </span>
                          <span className="text-neutral-200">{skill}</span>
                          <span className="hidden sm:inline text-neutral-700">················</span>
                          <span className={`text-[10px] tracking-widest ${tintText} opacity-80`}>
                            OK
                          </span>
                        </div>
                      );
                    })}
                  </div>
                </div>
              </div>
            );
          })}
          <p className="font-mono text-[11px] text-neutral-600 mt-2">
            <span className="text-orange-500/70">3 módulos</span> residentes // 12 subrutinas vinculadas // 0 fugas detectadas
          </p>
        </div>
      </section>

      {/* ── FOOTER DISCRETO ──────────────────────────────── */}
      <footer className="relative z-20 max-w-6xl mx-auto px-4 py-10 border-t border-neutral-900 text-center font-mono text-xs text-neutral-500 flex flex-col sm:flex-row items-center justify-between gap-3">
        <p>© {new Date().getFullYear()} LOLBIT // FAZBEAR ENTERTAINMENT &amp; GLL CLAN</p>
        <p className="text-[11px] text-neutral-600">
          PROPIEDAD PRIVADA DE SISTEMA // SECURE NODE
        </p>
      </footer>

      {/* ── WIDGET FLOTANTE: STATUS DEL CREADOR ──────────── */}
      <SoundButton
        soundSrc="/sounds/click.mp3"
        onClick={() => setAfk((v) => !v)}
        className="fixed bottom-5 right-5 z-50 flex items-center gap-3 border border-neutral-800 bg-neutral-950/90 px-3.5 py-2 shadow-[0_0_20px_rgba(0,0,0,0.8)] backdrop-blur-md rounded-xl transition-all hover:border-orange-500/50 sm:bottom-6 sm:right-6"
      >
        <div className="relative size-10 overflow-hidden rounded-full border border-purple-500/40">
          <Image
            src="/images/members/lolbit/sleepy.jpeg"
            alt="Status del creador"
            fill
            className="object-cover"
          />
        </div>
        <div className="text-left font-mono">
          <p className="text-[9px] tracking-wider text-neutral-400">
            STATUS CREADOR
          </p>
          <p
            className={`text-xs font-bold tracking-wide ${
              afk ? "text-orange-400" : "text-emerald-400"
            }`}
          >
            {afk ? "AFK / STANDBY" : "ONLINE // ACTIVE"}
          </p>
        </div>
        <span
          className={`size-2 rounded-full ${
            afk ? "bg-orange-400" : "bg-emerald-400 animate-pulse shadow-[0_0_8px_#34d399]"
          }`}
        />
      </SoundButton>
    </main>
  );
}

export default LolbitProfile;