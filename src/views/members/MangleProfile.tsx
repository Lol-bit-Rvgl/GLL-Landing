"use client";

import { useState, useEffect, useRef, useCallback } from "react";
import type { Member } from "@/data/members";
import {
  Play,
  Pause,
  Volume2,
  VolumeX,
  Copy,
  Check,
  ExternalLink,
  Camera,
  Crosshair,
  Shield,
  Zap,
  Swords,
  BookOpen,
  ArrowLeft,
  Sparkles,
  Terminal,
  Pickaxe,
  Radio,
  RotateCcw,
  Cpu,
  Layers,
  HeartPulse,
} from "lucide-react";
import { SiDiscord, SiGithub, SiTwitch } from "react-icons/si";

/* ── Estilos CSS dinámicos (Glitches, animaciones neón y cables) ── */
const MANGLE_STYLES = `
@keyframes neon-pulse {
  0%, 100% {
    box-shadow: 0 0 25px rgba(236,72,153,0.35), 0 0 50px rgba(236,72,153,0.2);
    border-color: rgba(244,114,182,0.6);
  }
  50% {
    box-shadow: 0 0 45px rgba(236,72,153,0.7), 0 0 80px rgba(236,72,153,0.35);
    border-color: rgba(236,72,153,0.9);
  }
}

@keyframes cable-sway {
  0%, 100% { transform: rotate(0deg); }
  50% { transform: rotate(1.2deg); }
}

@keyframes audio-eq-1 {
  0%, 100% { height: 20%; }
  50% { height: 95%; }
}
@keyframes audio-eq-2 {
  0%, 100% { height: 80%; }
  50% { height: 25%; }
}
@keyframes audio-eq-3 {
  0%, 100% { height: 40%; }
  50% { height: 100%; }
}
@keyframes audio-eq-4 {
  0%, 100% { height: 60%; }
  50% { height: 35%; }
}

@keyframes reticle-spin {
  from { transform: rotate(0deg); }
  to { transform: rotate(360deg); }
}

@keyframes fnaf-static-jitter {
  0% { transform: translate(0,0) scale(1); filter: contrast(1.1); }
  20% { transform: translate(-3px, 2px) scale(1.002); filter: contrast(1.4) hue-rotate(15deg); }
  40% { transform: translate(2px, -2px) scale(0.998); filter: contrast(1.2) hue-rotate(-20deg); }
  60% { transform: translate(-2px, -1px) scale(1.001); filter: contrast(1.5) brightness(1.2); }
  80% { transform: translate(3px, 1px) scale(1); filter: contrast(1.3); }
  100% { transform: translate(0,0) scale(1); filter: contrast(1.1); }
}

@keyframes eye-glow-intense {
  0%, 100% {
    opacity: 0.95;
    filter: drop-shadow(0 0 15px #facc15) drop-shadow(0 0 35px #eab308);
    transform: scale(1.15);
  }
  50% {
    opacity: 1;
    filter: drop-shadow(0 0 25px #fde047) drop-shadow(0 0 50px #ca8a04);
    transform: scale(1.25);
  }
}

@keyframes spark-flash {
  0%, 85%, 100% { opacity: 0; }
  86%, 89% { opacity: 0.9; }
  90% { opacity: 0.1; }
  92%, 94% { opacity: 1; }
}

.animate-neon-pulse { animation: neon-pulse 3s ease-in-out infinite; }
.animate-cable { animation: cable-sway 6s ease-in-out infinite alternate; transform-origin: top center; }
.animate-reticle-slow { animation: reticle-spin 20s linear infinite; }
.animate-fnaf-glitch { animation: fnaf-static-jitter 0.22s steps(2) infinite; }
.animate-eyes-online { animation: eye-glow-intense 1.8s ease-in-out infinite; }
.animate-spark { animation: spark-flash 4s ease-in-out infinite; }

.minecraft-grid {
  background-image:
    linear-gradient(rgba(16, 185, 129, 0.08) 1px, transparent 1px),
    linear-gradient(90deg, rgba(16, 185, 129, 0.08) 1px, transparent 1px);
  background-size: 24px 24px;
}

.radar-sweep {
  background: conic-gradient(from 0deg, transparent 0deg, transparent 300deg, rgba(236, 72, 153, 0.25) 360deg);
  animation: reticle-spin 4s linear infinite;
}
`;

/* ── Web Audio API: Chasquido metálico y chispazo al acoplar una pieza ── */
function playMetalSnap() {
  try {
    const AudioCtx =
      window.AudioContext ||
      (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
    if (!AudioCtx) return;
    const ctx = new AudioCtx();

    // 1. Clack metálico con resonancia rápida
    const osc = ctx.createOscillator();
    const oscGain = ctx.createGain();
    osc.type = "triangle";
    osc.frequency.setValueAtTime(360, ctx.currentTime);
    osc.frequency.exponentialRampToValueAtTime(70, ctx.currentTime + 0.09);
    oscGain.gain.setValueAtTime(0.35, ctx.currentTime);
    oscGain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.09);
    osc.connect(oscGain);
    oscGain.connect(ctx.destination);
    osc.start();
    osc.stop(ctx.currentTime + 0.09);

    // 2. Chispazo eléctrico / ruido de fricción de engranajes
    const bufferSize = Math.floor(ctx.sampleRate * 0.12);
    const buffer = ctx.createBuffer(1, bufferSize, ctx.sampleRate);
    const data = buffer.getChannelData(0);
    for (let i = 0; i < bufferSize; i++) {
      data[i] = (Math.random() * 2 - 1) * Math.exp(-i / (ctx.sampleRate * 0.025));
    }
    const noise = ctx.createBufferSource();
    noise.buffer = buffer;
    const filter = ctx.createBiquadFilter();
    filter.type = "bandpass";
    filter.frequency.value = 2200;
    filter.Q.value = 3;
    const noiseGain = ctx.createGain();
    noiseGain.gain.setValueAtTime(0.28, ctx.currentTime);
    noiseGain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.12);
    noise.connect(filter);
    filter.connect(noiseGain);
    noiseGain.connect(ctx.destination);
    noise.start();
  } catch {
    /* Silencioso en navegadores sin interacción previa */
  }
}

/* ── Web Audio API: Sonido de radio animatrónica de Mangle (100% ensamblada) ── */
function playMangleRadioStatic() {
  try {
    const AudioCtx =
      window.AudioContext ||
      (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
    if (!AudioCtx) return;
    const ctx = new AudioCtx();
    const duration = 2.6;
    const sampleRate = ctx.sampleRate;
    const bufferSize = Math.floor(sampleRate * duration);
    const noiseBuffer = ctx.createBuffer(1, bufferSize, sampleRate);
    const output = noiseBuffer.getChannelData(0);

    for (let i = 0; i < bufferSize; i++) {
      const burst = Math.sin(i * 0.02) * Math.cos(i * 0.003);
      output[i] = (Math.random() * 2 - 1) * (0.35 + 0.65 * Math.abs(burst));
    }

    const whiteNoise = ctx.createBufferSource();
    whiteNoise.buffer = noiseBuffer;

    const bandpass = ctx.createBiquadFilter();
    bandpass.type = "bandpass";
    bandpass.frequency.setValueAtTime(1400, ctx.currentTime);
    bandpass.Q.setValueAtTime(3.5, ctx.currentTime);

    const osc = ctx.createOscillator();
    osc.type = "sawtooth";
    osc.frequency.setValueAtTime(85, ctx.currentTime);
    osc.frequency.exponentialRampToValueAtTime(320, ctx.currentTime + duration);

    const oscGain = ctx.createGain();
    oscGain.gain.setValueAtTime(0.22, ctx.currentTime);
    oscGain.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + duration);

    const mainGain = ctx.createGain();
    mainGain.gain.setValueAtTime(0.3, ctx.currentTime);
    mainGain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + duration);

    whiteNoise.connect(bandpass);
    bandpass.connect(mainGain);

    osc.connect(oscGain);
    oscGain.connect(mainGain);

    mainGain.connect(ctx.destination);

    whiteNoise.start();
    osc.start();

    whiteNoise.stop(ctx.currentTime + duration);
    osc.stop(ctx.currentTime + duration);
  } catch {
    /* Silencioso */
  }
}

/* ── Definición de piezas clave de Mangle para el Puzzle ── */
interface ManglePiece {
  id: string;
  name: string;
  slotName: string;
  description: string;
  icon: typeof Cpu;
}

const MANGLE_PIECES: ManglePiece[] = [
  {
    id: "endo-head",
    name: "Cabeza Endoesqueleto",
    slotName: "Bahía 01 // Base Craneal",
    description: "Cráneo secundario de aleación con cableado óptico.",
    icon: Cpu,
  },
  {
    id: "mask",
    name: "Máscara Blanca/Rosa",
    slotName: "Bahía 02 // Carcasa Toy Foxy",
    description: "Rostro cosmético blanco y mejillas rosa neón.",
    icon: Sparkles,
  },
  {
    id: "arm",
    name: "Brazo Mecánico con Cableado",
    slotName: "Bahía 03 // Articulación Superior",
    description: "Mecanismo hidráulico con haces de cables expuestos.",
    icon: Zap,
  },
  {
    id: "spine",
    name: "Columna Expuesta",
    slotName: "Bahía 04 // Chasis Central",
    description: "Eje vertebral articulado y conductos de transmisión.",
    icon: Layers,
  },
  {
    id: "leg",
    name: "Pata Animatrónica",
    slotName: "Bahía 05 // Soporte de Tracción",
    description: "Extremidad inferior reforzada con vigas de acero.",
    icon: Terminal,
  },
];

export function MangleProfile({ member }: { member?: Member }) {
  // Bandera mounted para evitar discrepancias de hidratación SSR en Next.js Turbopack
  const [mounted, setMounted] = useState(false);

  // Reproductor de música
  const [isPlaying, setIsPlaying] = useState(false);
  const [isMuted, setIsMuted] = useState(false);
  const [copiedDiscord, setCopiedDiscord] = useState(false);

  // FNAF Minijuego "Reconstruct Mangle"
  const [assembledPieces, setAssembledPieces] = useState<string[]>([]);
  const [camGlitch, setCamGlitch] = useState(false);
  const [camLogsOpen, setCamLogsOpen] = useState(false);
  const [camTimestamp, setCamTimestamp] = useState("02:48:19 AM");

  const audioRef = useRef<HTMLAudioElement | null>(null);

  useEffect(() => {
    setMounted(true);
  }, []);

  // Reloj de seguridad CAM 12
  useEffect(() => {
    if (!mounted) return;
    const interval = setInterval(() => {
      const d = new Date();
      setCamTimestamp(
        d.toLocaleTimeString("en-US", {
          hour: "2-digit",
          minute: "2-digit",
          second: "2-digit",
          hour12: true,
        })
      );
    }, 1000);
    return () => clearInterval(interval);
  }, [mounted]);

  // Manejo del reproductor musical
  useEffect(() => {
    if (!mounted) return;
    const audio = new Audio("/images/members/mangle/audio.mp3");
    audio.loop = true;
    audio.volume = 0.4;
    audioRef.current = audio;

    return () => {
      audio.pause();
      audio.src = "";
    };
  }, [mounted]);

  const togglePlay = useCallback(() => {
    const audio = audioRef.current;
    if (!audio) return;

    if (isPlaying) {
      audio.pause();
      setIsPlaying(false);
    } else {
      audio
        .play()
        .then(() => {
          setIsPlaying(true);
        })
        .catch(() => {
          // Bloqueo de autoplay por navegador
        });
    }
  }, [isPlaying]);

  const toggleMute = useCallback(() => {
    const audio = audioRef.current;
    if (!audio) return;
    audio.muted = !isMuted;
    setIsMuted(!isMuted);
  }, [isMuted]);

  const copyDiscordTag = useCallback(async () => {
    try {
      await navigator.clipboard.writeText("mangledrake");
      setCopiedDiscord(true);
      setTimeout(() => setCopiedDiscord(false), 2200);
    } catch {
      // Fallback si el portapapeles está bloqueado
    }
  }, []);

  /* ── Mecánica del Ensamble 'Reconstruct Mangle' ── */
  const attachPiece = useCallback(
    (pieceId: string) => {
      if (assembledPieces.includes(pieceId)) return;

      playMetalSnap();
      const updated = [...assembledPieces, pieceId];
      setAssembledPieces(updated);

      // Si se completa la última pieza (5/5), disparar el glitch completo
      if (updated.length === MANGLE_PIECES.length) {
        setCamGlitch(true);
        setCamLogsOpen(true);
        playMangleRadioStatic();
        setTimeout(() => {
          setCamGlitch(false);
        }, 2200);
      }
    },
    [assembledPieces]
  );

  const disassembleMangle = useCallback(() => {
    playMetalSnap();
    setAssembledPieces([]);
    setCamGlitch(false);
    setCamLogsOpen(false);
  }, []);

  const handleBackToClan = useCallback(() => {
    if (typeof window !== "undefined") {
      window.location.href = "/";
    }
  }, []);

  // Hydration safety: renderizar un contenedor idéntico hasta montar en cliente
  if (!mounted) {
    return (
      <main className="min-h-screen bg-[#080509] text-white flex items-center justify-center font-sans">
        <div className="flex items-center gap-3 text-pink-400 font-mono text-sm tracking-widest">
          <span className="inline-block w-2.5 h-2.5 rounded-full bg-pink-500 animate-ping" />
          CARGANDO SISTEMAS DE MANGLE DRAKE...
        </div>
      </main>
    );
  }

  const isFullyAssembled = assembledPieces.length === MANGLE_PIECES.length;

  return (
    <main className="relative min-h-screen w-full bg-[#080509] text-white font-sans overflow-x-hidden selection:bg-pink-500/40 selection:text-pink-100">
      <style>{MANGLE_STYLES}</style>

      {/* ── 1. FONDO NATIVO CON <img> Y EFECTOS ÓPTICOS ── */}
      <div className="fixed inset-0 z-0 pointer-events-none overflow-hidden">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src="/images/members/mangle/bg.jpg"
          alt="Cielo Estrellado Nocturno"
          className="w-full h-full object-cover object-center opacity-75 scale-[1.02]"
        />
        {/* Tinte violáceo sutil */}
        <div className="absolute inset-0 bg-gradient-to-b from-[#180b22]/70 via-[#100718]/85 to-[#060308]/95 mix-blend-multiply" />
        <div className="absolute inset-0 bg-[#2d0938]/20 mix-blend-color" />

        {/* Viñeta radial dramática en los bordes */}
        <div
          className="absolute inset-0"
          style={{
            background:
              "radial-gradient(ellipse at center, transparent 35%, rgba(6,3,8,0.7) 70%, rgba(3,1,4,0.98) 100%)",
          }}
        />

        {/* Rejilla de líneas de scanlines muy sutil */}
        <div
          aria-hidden="true"
          className="absolute inset-0 opacity-[0.06]"
          style={{
            backgroundImage:
              "repeating-linear-gradient(0deg, #fff 0px, #fff 1px, transparent 1px, transparent 4px)",
          }}
        />

        {/* Cableado expuesto decorativo superior SVG */}
        <svg
          className="absolute -top-6 left-0 w-full h-36 opacity-30 text-zinc-600 animate-cable"
          viewBox="0 0 1200 120"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            d="M-20,0 C180,95 380,45 600,85 C820,125 1040,55 1220,15"
            stroke="currentColor"
            strokeWidth="3.5"
            strokeLinecap="round"
          />
          <path
            d="M-40,10 C220,110 440,30 720,100 C980,60 1140,90 1240,30"
            stroke="#ec4899"
            strokeWidth="1.8"
            strokeDasharray="4 6"
            className="opacity-40"
          />
          <path
            d="M30,-5 C260,60 520,115 840,40 C1020,80 1160,35 1250,5"
            stroke="#71717a"
            strokeWidth="2.5"
          />
        </svg>
      </div>

      {/* ── BARRA SUPERIOR DE NAVEGACIÓN Y STATUS ── */}
      <header className="relative z-30 max-w-6xl mx-auto px-5 pt-6 flex items-center justify-between">
        <button
          onClick={handleBackToClan}
          className="group inline-flex items-center gap-2 px-3.5 py-1.5 rounded-md border border-pink-500/25 bg-black/50 backdrop-blur-md text-xs font-mono tracking-widest text-pink-200 hover:text-white hover:border-pink-400 hover:shadow-[0_0_15px_rgba(236,72,153,0.35)] transition-all cursor-pointer"
        >
          <ArrowLeft className="size-3.5 transition-transform group-hover:-translate-x-1 text-pink-400" />
          <span>GLL // CLAN ROSTER</span>
        </button>

        <div className="flex items-center gap-2.5 px-3 py-1 rounded-full border border-white/10 bg-black/40 backdrop-blur-sm text-[11px] font-mono text-zinc-300">
          <span className="size-2 rounded-full bg-pink-500 animate-ping" />
          <span className="text-pink-300 font-semibold">GLL CLAN</span>
          <span className="text-zinc-500">|</span>
          <span className="tracking-wider uppercase">PROFILE: {member?.displayName ?? "MANGLE"}</span>
        </div>
      </header>

      {/* ── 1. HERO, BIO Y BADGES ESTILIZADOS ── */}
      <section className="relative z-20 max-w-4xl mx-auto pt-10 pb-6 px-4 text-center">
        {/* Contenedor Avatar con aura pulsante rosa neón */}
        <div className="relative inline-block mb-6 group">
          {/* Anillos de luz y resplandor neón */}
          <div className="absolute -inset-2 rounded-full bg-gradient-to-r from-pink-500/30 via-purple-600/20 to-pink-400/30 blur-xl opacity-80 group-hover:opacity-100 transition-opacity" />

          <div className="relative size-36 sm:size-44 mx-auto rounded-full overflow-hidden p-1 border-2 border-pink-400/50 shadow-[0_0_35px_rgba(236,72,153,0.4)] animate-neon-pulse bg-zinc-950/80">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src="/images/members/mangle/avatar.jpg"
              alt="Mangle Drake Avatar"
              className="w-full h-full object-cover rounded-full transition-transform duration-500 group-hover:scale-105"
            />
            {/* Brillo reflectivo de cristal líquido */}
            <div className="absolute inset-0 rounded-full bg-gradient-to-tr from-transparent via-white/10 to-pink-300/20 pointer-events-none" />
          </div>

          {/* Badge flotante animado de estado */}
          <span className="absolute bottom-1 right-2 inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[10px] font-mono font-bold bg-black/80 border border-pink-400/70 text-pink-300 shadow-[0_0_12px_rgba(236,72,153,0.6)] backdrop-blur-md">
            <span className="size-1.5 rounded-full bg-pink-400 animate-pulse" />
            ONLINE
          </span>
        </div>

        {/* Nombre Principal + Alias Destacado MEG */}
        <div className="flex flex-col sm:flex-row items-center justify-center gap-2 sm:gap-3 mb-4">
          <h1 className="text-4xl sm:text-5xl md:text-6xl font-extrabold tracking-tight text-white drop-shadow-[0_2px_15px_rgba(255,255,255,0.35)]">
            Mangle Drake
          </h1>
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-pink-500/20 border border-pink-400/60 text-pink-300 text-xs sm:text-sm font-mono font-bold tracking-widest shadow-[0_0_16px_rgba(236,72,153,0.4)] backdrop-blur-md">
            <Sparkles className="size-3.5 text-pink-400" />
            ALIAS: <span className="text-white underline decoration-pink-400 decoration-2">MEG</span>
          </div>
        </div>

        {/* Chips de Rol / Habilidades Estilizados */}
        <div className="flex flex-wrap items-center justify-center gap-2.5 max-w-2xl mx-auto mb-6">
          {[
            { label: "Francotiradora de Élite", icon: Crosshair, color: "border-pink-500/40 text-pink-200" },
            { label: "Roleplayer Veterana", icon: BookOpen, color: "border-purple-400/40 text-purple-200" },
            { label: "Hardcore Gamer", icon: Zap, color: "border-fuchsia-400/40 text-fuchsia-200" },
            { label: "Reservada // Silenciosa", icon: Shield, color: "border-zinc-400/40 text-zinc-300" },
          ].map((chip) => {
            const Icon = chip.icon;
            return (
              <span
                key={chip.label}
                className={`inline-flex items-center gap-1.5 px-3.5 py-1 rounded-md text-xs font-mono font-semibold tracking-wider bg-black/60 backdrop-blur-md border ${chip.color} shadow-[0_0_14px_rgba(0,0,0,0.6)] hover:border-pink-400 hover:shadow-[0_0_18px_rgba(236,72,153,0.3)] hover:scale-105 transition-all duration-300`}
              >
                <Icon className="size-3.5 text-pink-400" />
                [ {chip.label} ]
              </span>
            );
          })}
        </div>

        {/* Bio Principal en Inglés Estilizado con Sutil Resplandor Blanco */}
        <p className="max-w-2xl mx-auto text-base sm:text-lg text-white/95 font-medium leading-relaxed drop-shadow-[0_0_8px_rgba(255,255,255,0.6)] mb-8 px-4">
          “I&apos;m Mangle Drake, but you can call me Meg. Lethal precision, roleplay enthusiast, experienced across battlefields, and naturally reserved.”
        </p>

        {/* Social Links con Efecto Liquid Glass */}
        <div className="flex flex-wrap items-center justify-center gap-3 sm:gap-4 max-w-xl mx-auto">
          {/* Discord Copiable */}
          <button
            onClick={copyDiscordTag}
            title="Copiar tag de Discord"
            className="group flex items-center gap-2.5 px-4 py-2 rounded-lg backdrop-blur-md bg-white/[0.05] border border-pink-500/30 text-xs font-mono font-medium text-zinc-200 hover:text-white hover:border-pink-400 hover:bg-pink-500/10 hover:shadow-[0_0_20px_rgba(236,72,153,0.45)] transition-all duration-300 active:scale-95 cursor-pointer"
          >
            <SiDiscord className="size-4 text-[#5865F2] group-hover:text-pink-400 transition-colors" />
            <span>DISCORD: <strong className="text-white">mangledrake</strong></span>
            {copiedDiscord ? (
              <span className="inline-flex items-center gap-1 text-[11px] text-green-400 font-bold bg-green-950/60 px-1.5 py-0.5 rounded border border-green-500/40">
                <Check className="size-3" /> [ COPIADO ]
              </span>
            ) : (
              <Copy className="size-3.5 text-zinc-400 group-hover:text-pink-300 transition-colors" />
            )}
          </button>

          {/* GitHub */}
          <a
            href="https://github.com/MangleDrake"
            target="_blank"
            rel="noopener noreferrer"
            className="group flex items-center gap-2.5 px-4 py-2 rounded-lg backdrop-blur-md bg-white/[0.05] border border-pink-500/30 text-xs font-mono font-medium text-zinc-200 hover:text-white hover:border-pink-400 hover:bg-pink-500/10 hover:shadow-[0_0_20px_rgba(236,72,153,0.45)] transition-all duration-300"
          >
            <SiGithub className="size-4 text-zinc-300 group-hover:text-pink-400 transition-colors" />
            <span>GITHUB</span>
            <ExternalLink className="size-3 text-zinc-400 group-hover:text-pink-300 transition-colors" />
          </a>

          {/* Twitch */}
          <a
            href="https://m.twitch.tv/mangledrake"
            target="_blank"
            rel="noopener noreferrer"
            className="group flex items-center gap-2.5 px-4 py-2 rounded-lg backdrop-blur-md bg-white/[0.05] border border-pink-500/30 text-xs font-mono font-medium text-zinc-200 hover:text-white hover:border-pink-400 hover:bg-pink-500/10 hover:shadow-[0_0_20px_rgba(236,72,153,0.45)] transition-all duration-300"
          >
            <SiTwitch className="size-4 text-[#9146FF] group-hover:text-pink-400 transition-colors" />
            <span>TWITCH</span>
            <ExternalLink className="size-3 text-zinc-400 group-hover:text-pink-300 transition-colors" />
          </a>
        </div>
      </section>

      {/* ── 2. GRID CUADRANTE 2x2 — INFORMACIÓN REAL Y AUTÉNTICA (SIN MOCK DATA) ── */}
      <section className="relative z-20 max-w-5xl mx-auto my-12 px-4">
        <div className="mb-4 flex items-center justify-between border-b border-pink-500/20 pb-2">
          <div className="flex items-center gap-2 font-mono text-xs tracking-widest text-pink-300 uppercase">
            <Terminal className="size-3.5 text-pink-400" />
            DIMENSIONES DE COMBATE & ESPECIALIDADES
          </div>
          <span className="text-[10px] font-mono text-zinc-500">MANGLE_ARCHIVE_VERIFIED</span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* CUADRANTE 1: ROLEPLAY HUB */}
          <div className="group relative rounded-xl p-6 backdrop-blur-md bg-black/60 border border-pink-500/20 hover:border-pink-400/60 transition-all duration-300 hover:scale-[1.01] overflow-hidden flex flex-col justify-between">
            {/* Símbolos textuales sutiles */}
            <div className="absolute top-2.5 right-3 text-[10px] font-mono text-pink-400/40 tracking-[0.3em] select-none">
              ⟡ ✦ ✧ ◈ ⟐ 📜 ⟡
            </div>

            <div>
              <div className="flex items-center gap-3 mb-4">
                <div className="size-10 rounded-lg bg-pink-500/10 border border-pink-500/30 flex items-center justify-center text-pink-400 shadow-[0_0_12px_rgba(236,72,153,0.2)] shrink-0">
                  <BookOpen className="size-5" />
                </div>
                <div>
                  <h3 className="text-base font-bold text-white tracking-wide">
                    Roleplay Hub
                  </h3>
                  <div className="inline-block mt-0.5 px-2 py-0.5 rounded bg-pink-900/40 text-pink-300 text-[10px] font-mono font-semibold border border-pink-500/30">
                    4 AÑOS DE EXPERIENCIA
                  </div>
                </div>
              </div>

              <div className="space-y-3 text-xs leading-relaxed text-zinc-300">
                <p className="text-zinc-200">
                  Especializada en la <strong className="text-pink-300 font-semibold">interpretación de personajes inmersivos</strong>,
                  construcción de narrativa profunda y una marcada versatilidad adaptativa en cualquier escenario dramático.
                </p>

                <div className="p-3 rounded-lg bg-white/[0.02] border border-white/5 space-y-1.5 font-mono text-[11px]">
                  <div className="flex items-center gap-2 text-zinc-400">
                    <span className="size-1.5 rounded-full bg-pink-400" />
                    <span>Construcción de historias con trasfondo psicológico complejo.</span>
                  </div>
                  <div className="flex items-center gap-2 text-zinc-400">
                    <span className="size-1.5 rounded-full bg-purple-400" />
                    <span>Improvisación natural y cohesión colaborativa con el elenco.</span>
                  </div>
                </div>
              </div>
            </div>

            <div className="mt-4 pt-3 border-t border-pink-500/15 flex items-center justify-between font-mono text-[10px] text-pink-400/80">
              <span>DISCIPLINA: ROLEPLAY NARRATIVO</span>
              <span>TRAYECTORIA ACTIVA</span>
            </div>
          </div>

          {/* CUADRANTE 2: MINECRAFT VAULT */}
          <div className="group relative rounded-xl p-6 backdrop-blur-md bg-black/60 border border-pink-500/20 hover:border-pink-400/60 transition-all duration-300 hover:scale-[1.01] overflow-hidden minecraft-grid flex flex-col justify-between">
            {/* Partículas de chispas verdes / cubos tenues */}
            <div className="absolute inset-0 pointer-events-none overflow-hidden">
              <span className="absolute top-4 right-8 size-1.5 bg-emerald-400/40 rounded-none shadow-[0_0_8px_#34d399] animate-pulse" />
              <span className="absolute bottom-6 left-12 size-2 bg-purple-500/30 rounded-none shadow-[0_0_10px_#a855f7] animate-bounce" />
              <span className="absolute top-1/2 right-1/4 size-1 bg-emerald-300/30 rounded-none" />
            </div>

            <div className="relative z-10">
              <div className="flex items-center gap-3 mb-4">
                <div className="size-10 rounded-lg bg-emerald-500/10 border border-emerald-500/30 flex items-center justify-center text-emerald-400 shadow-[0_0_12px_rgba(16,185,129,0.2)] shrink-0">
                  <Pickaxe className="size-5" />
                </div>
                <div>
                  <h3 className="text-base font-bold text-white tracking-wide">
                    Minecraft Vault
                  </h3>
                  <div className="inline-block mt-0.5 px-2 py-0.5 rounded bg-emerald-950/50 text-emerald-300 text-[10px] font-mono font-semibold border border-emerald-500/30">
                    JUGADORA TÉCNICA & SUPERVIVENCIA
                  </div>
                </div>
              </div>

              <div className="space-y-3 text-xs leading-relaxed text-zinc-300">
                <p className="text-zinc-200">
                  Enfoque centrado en la <strong className="text-emerald-300 font-semibold">construcción de granjas industriales</strong>,
                  optimización metódica de recursos, dominio de sistemas lógicos de <strong className="text-purple-300 font-semibold">redstone</strong> y diseño de arquitectura funcional.
                </p>

                <div className="p-3 rounded-lg bg-black/60 border border-emerald-500/20 space-y-1.5 font-mono text-[11px]">
                  <div className="flex items-center gap-2 text-zinc-300">
                    <span className="size-1.5 rounded-full bg-emerald-400" />
                    <span>Automatización de granjas y clasificación masiva de ítems.</span>
                  </div>
                  <div className="flex items-center gap-2 text-zinc-300">
                    <span className="size-1.5 rounded-full bg-purple-400" />
                    <span>Bases subterráneas autosuficientes y fortalezas de obsidiana.</span>
                  </div>
                </div>
              </div>
            </div>

            <div className="relative z-10 mt-4 pt-3 border-t border-emerald-500/20 flex items-center justify-between font-mono text-[10px] text-emerald-400/80">
              <span>ENFOQUE: TÉCNICO & FUNCIONAL</span>
              <span>SURVIVAL OPTIMIZADO</span>
            </div>
          </div>

          {/* CUADRANTE 3: GOD OF WAR SANCTUARY */}
          <div className="group relative rounded-xl p-6 backdrop-blur-md bg-black/60 border border-pink-500/20 hover:border-pink-400/60 transition-all duration-300 hover:scale-[1.01] overflow-hidden flex flex-col justify-between">
            {/* Runas grabadas sutiles nórdicas */}
            <div className="absolute top-2.5 right-3 text-xs font-serif text-amber-500/40 tracking-[0.4em] select-none">
              ᚠ ᚢ ᚦ ᚨ ᚱ ᚲ ᚷ ᚹ ᛉ
            </div>

            <div>
              <div className="flex items-center gap-3 mb-4">
                <div className="size-10 rounded-lg bg-amber-500/10 border border-amber-500/30 flex items-center justify-center text-amber-400 shadow-[0_0_12px_rgba(245,158,11,0.2)] shrink-0">
                  <Swords className="size-5" />
                </div>
                <div>
                  <h3 className="text-base font-bold text-white tracking-wide">
                    God of War Sanctuary
                  </h3>
                  <div className="inline-block mt-0.5 px-2 py-0.5 rounded bg-amber-950/50 text-amber-300 text-[10px] font-mono font-semibold border border-amber-500/30">
                    JUGADORA EXPERIMENTADA
                  </div>
                </div>
              </div>

              <div className="space-y-3 text-xs leading-relaxed text-zinc-300">
                <p className="text-zinc-200">
                  Dominio exhaustivo de <strong className="text-amber-300 font-semibold">combos fluidos y combate visceral</strong> en
                  dificultades altas, con maestría sincronizada tanto en el <strong className="text-cyan-300 font-semibold">Hacha Leviatán</strong> como en las devastadoras <strong className="text-amber-400 font-semibold">Espadas del Caos</strong>.
                </p>

                <div className="p-3 rounded-lg bg-amber-500/[0.04] border border-amber-500/20 space-y-1.5 font-mono text-[11px]">
                  <div className="flex items-center gap-2 text-zinc-300">
                    <span className="size-1.5 rounded-full bg-cyan-400" />
                    <span>Control de masas y parries precisos con escarcha nórdica.</span>
                  </div>
                  <div className="flex items-center gap-2 text-zinc-300">
                    <span className="size-1.5 rounded-full bg-amber-400" />
                    <span>Ruptura de posturas enemigas y ejecución implacable en combate.</span>
                  </div>
                </div>
              </div>
            </div>

            <div className="mt-4 pt-3 border-t border-amber-500/20 flex items-center justify-between font-mono text-[10px] text-amber-400/80">
              <span>ESTILO: COMBATE SIN ERRORES</span>
              <span>DIFICULTAD: GIVE ME GOD OF WAR</span>
            </div>
          </div>

          {/* CUADRANTE 4: BATTLEFIELD RECON & SUPPORT */}
          <div className="group relative rounded-xl p-6 backdrop-blur-md bg-black/60 border border-pink-500/20 hover:border-pink-400/60 transition-all duration-300 hover:scale-[1.01] overflow-hidden flex flex-col justify-between">
            {/* Retícula HUD de fondo */}
            <div className="absolute -right-10 -bottom-10 size-44 rounded-full border border-pink-500/10 pointer-events-none flex items-center justify-center opacity-40">
              <div className="size-32 rounded-full border border-dashed border-pink-400/20 animate-reticle-slow" />
              <div className="absolute inset-0 radar-sweep rounded-full" />
            </div>

            <div className="relative z-10">
              <div className="flex items-center gap-3 mb-4">
                <div className="size-10 rounded-lg bg-pink-500/10 border border-pink-500/30 flex items-center justify-center text-pink-400 shadow-[0_0_12px_rgba(236,72,153,0.2)] shrink-0">
                  <Crosshair className="size-5 animate-pulse" />
                </div>
                <div>
                  <h3 className="text-base font-bold text-white tracking-wide">
                    Battlefield Recon & Support
                  </h3>
                  <div className="inline-block mt-0.5 px-2 py-0.5 rounded bg-pink-950/60 text-pink-300 text-[10px] font-mono font-semibold border border-pink-500/40">
                    MÉDICO DE ESCUADRÓN & FRANCOTIRADORA
                  </div>
                </div>
              </div>

              <div className="space-y-3 text-xs leading-relaxed text-zinc-300">
                <p className="text-zinc-200">
                  Especialista dual: proporciona <strong className="text-pink-300 font-semibold">soporte vital y reanimaciones críticas</strong> al
                  escuadrón bajo fuego intenso, combinándolo con la <strong className="text-pink-200 font-semibold">eliminación táctica y quirúrgica</strong> de amenazas a larga distancia.
                </p>

                <div className="p-3 rounded-lg bg-white/[0.02] border border-pink-500/20 space-y-1.5 font-mono text-[11px]">
                  <div className="flex items-center gap-2 text-zinc-300">
                    <HeartPulse className="size-3.5 text-rose-400 shrink-0" />
                    <span>Reanimación bajo cobertura y distribución de suministros médicos.</span>
                  </div>
                  <div className="flex items-center gap-2 text-zinc-300">
                    <Crosshair className="size-3.5 text-pink-400 shrink-0" />
                    <span>Neutralización certera de posiciones enemigas y reconocimiento HUD.</span>
                  </div>
                </div>
              </div>
            </div>

            <div className="relative z-10 mt-4 pt-3 border-t border-pink-500/20 flex items-center justify-between font-mono text-[10px] text-pink-400/80">
              <span>ROL EN EL CLAN: MÉDICO // RECON</span>
              <span>COBERTURA TOTAL DE EQUIPO</span>
            </div>
          </div>
        </div>
      </section>

      {/* ── 3. MINIJUEGO INTERACTIVO FNAF: 'RECONSTRUCT MANGLE' (TAKE APART AND PUT BACK TOGETHER) ── */}
      <section className="relative z-20 max-w-5xl mx-auto mt-16 mb-24 px-4">
        <div
          className={`relative rounded-2xl border border-pink-500/30 bg-[#07040a]/95 backdrop-blur-xl p-6 sm:p-8 overflow-hidden shadow-[0_0_40px_rgba(0,0,0,0.9)] transition-all duration-300 ${
            camGlitch ? "animate-fnaf-glitch border-pink-400 shadow-[0_0_60px_rgba(236,72,153,0.5)]" : ""
          }`}
        >
          {/* Header de Cámara CCTV */}
          <div className="flex flex-wrap items-center justify-between gap-3 border-b border-pink-500/20 pb-4 mb-6">
            <div className="flex items-center gap-2.5 font-mono text-xs text-pink-300">
              <Camera className="size-4 text-pink-400 animate-pulse" />
              <span className="font-bold tracking-widest text-white">CAM 12</span>
              <span className="text-zinc-500">—</span>
              <span className="text-pink-400/90 tracking-wider">
                KID&apos;S COVE [ ATTRACTION: TAKE APART & PUT BACK TOGETHER ]
              </span>
            </div>

            <div className="flex items-center gap-3 text-xs font-mono">
              <span className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded bg-rose-950/60 border border-rose-500/50 text-rose-300 font-bold">
                <span className="size-2 rounded-full bg-rose-500 animate-ping" />
                ● REC
              </span>
              <span className="text-zinc-400">{camTimestamp}</span>
            </div>
          </div>

          {/* Área Principal de la Cámara con Slots de Ensamble y Ojos Animatrónicos */}
          <div className="relative rounded-xl bg-gradient-to-b from-black/90 via-[#0d0713] to-black border border-pink-500/30 p-6 sm:p-8 overflow-hidden">
            {/* Rejilla CRT e interferencia de fondo */}
            <div
              className="absolute inset-0 pointer-events-none opacity-25"
              style={{
                backgroundImage:
                  "repeating-linear-gradient(0deg, rgba(236,72,153,0.15) 0px, rgba(236,72,153,0.15) 1px, transparent 1px, transparent 3px)",
              }}
            />

            {/* Cables colgantes SVG en la cámara */}
            <svg
              className="absolute top-0 inset-x-0 w-full h-36 pointer-events-none text-zinc-700 opacity-60"
              viewBox="0 0 800 140"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                d="M50,0 C120,80 200,40 280,110 C340,160 400,30 480,90 C560,150 680,20 750,0"
                stroke="currentColor"
                strokeWidth="3"
              />
              <path
                d="M120,0 C180,120 260,60 380,130 C450,170 520,40 640,100 C700,130 750,50 800,0"
                stroke="#ec4899"
                strokeWidth="1.5"
                strokeDasharray="5 7"
                className="opacity-50"
              />
            </svg>

            {/* Chispas animadas de cables sueltos */}
            <div className="absolute top-12 left-1/4 size-1 bg-yellow-300 rounded-full animate-spark shadow-[0_0_10px_#fde047]" />
            <div className="absolute top-20 right-1/4 size-1 bg-pink-400 rounded-full animate-spark shadow-[0_0_8px_#ec4899]" />

            {/* Ojos animatrónicos en el centro */}
            <div className="relative z-10 flex flex-col items-center justify-center mb-6">
              <div className="flex items-center gap-12 sm:gap-16 my-2">
                {/* Ojo izquierdo */}
                <div
                  className={`relative size-8 sm:size-10 rounded-full bg-yellow-400/90 transition-all duration-500 flex items-center justify-center ${
                    isFullyAssembled
                      ? "animate-eyes-online"
                      : "opacity-40 shadow-[0_0_12px_#ca8a04]"
                  }`}
                >
                  <div className="size-3 rounded-full bg-black shadow-inner" />
                  {isFullyAssembled && (
                    <span className="absolute inset-0 rounded-full border-2 border-yellow-200 animate-ping opacity-60" />
                  )}
                </div>

                {/* Ojo derecho */}
                <div
                  className={`relative size-8 sm:size-10 rounded-full bg-yellow-400/90 transition-all duration-500 flex items-center justify-center ${
                    isFullyAssembled
                      ? "animate-eyes-online"
                      : "opacity-40 shadow-[0_0_12px_#ca8a04]"
                  }`}
                >
                  <div className="size-3 rounded-full bg-black shadow-inner" />
                  {isFullyAssembled && (
                    <span className="absolute inset-0 rounded-full border-2 border-yellow-200 animate-ping opacity-60" />
                  )}
                </div>
              </div>

              {/* Estado del ensamble */}
              <div className="text-center font-mono mt-3">
                {isFullyAssembled ? (
                  <div className="space-y-1">
                    <p className="text-sm sm:text-base font-extrabold tracking-[0.25em] text-pink-300 drop-shadow-[0_0_16px_rgba(236,72,153,0.9)] animate-pulse">
                      [ SYSTEM RESTORED // THE MANGLE ONLINE ]
                    </p>
                    <p className="text-xs text-green-400 font-semibold tracking-wider">
                      ✔ TODOS LOS MÓDULOS MECÁNICOS ACOPLADOS SATISFACTORIAMENTE
                    </p>
                  </div>
                ) : (
                  <div>
                    <p className="text-xs sm:text-sm font-bold tracking-widest text-zinc-300">
                      ESTRUCTURA DESENSAMBLADA // ACOPLA LAS 5 PIEZAS CLAVE
                    </p>
                    <p className="text-[11px] text-pink-400/80 mt-0.5">
                      PROGRESO: {assembledPieces.length} DE {MANGLE_PIECES.length} PIEZAS CONECTADAS
                    </p>
                  </div>
                )}
              </div>
            </div>

            {/* Bahías o Slots Conectores de la Estructura (Representación visual) */}
            <div className="relative z-10 grid grid-cols-2 sm:grid-cols-5 gap-2.5 my-6">
              {MANGLE_PIECES.map((piece, index) => {
                const isAttached = assembledPieces.includes(piece.id);
                const Icon = piece.icon;
                return (
                  <div
                    key={piece.id}
                    className={`relative rounded-lg p-3 border transition-all duration-300 font-mono flex flex-col items-center text-center ${
                      isAttached
                        ? "bg-pink-950/40 border-pink-400/80 shadow-[0_0_16px_rgba(236,72,153,0.3)] text-white"
                        : "bg-black/60 border-dashed border-pink-500/25 text-zinc-500 opacity-60"
                    }`}
                  >
                    <div
                      className={`size-8 rounded-full flex items-center justify-center mb-2 transition-colors ${
                        isAttached
                          ? "bg-pink-500/20 text-pink-300 shadow-[0_0_10px_rgba(236,72,153,0.5)]"
                          : "bg-white/[0.03] text-zinc-600"
                      }`}
                    >
                      <Icon className="size-4" />
                    </div>
                    <span className="text-[9px] uppercase tracking-wider text-pink-400/80 font-bold block mb-1">
                      Slot 0{index + 1}
                    </span>
                    <span className="text-[11px] font-semibold leading-tight block truncate w-full">
                      {piece.name}
                    </span>
                    <span
                      className={`mt-2 text-[9px] font-bold px-1.5 py-0.5 rounded ${
                        isAttached
                          ? "bg-pink-500/30 text-pink-200 border border-pink-400/40"
                          : "bg-white/5 text-zinc-500 border border-white/5"
                      }`}
                    >
                      {isAttached ? "[ CONECTADO ]" : "[ VACÍO ]"}
                    </span>
                  </div>
                );
              })}
            </div>

            {/* Panel de Piezas Sueltas para Ensamblar */}
            <div className="relative z-10 border-t border-pink-500/20 pt-5">
              <div className="flex items-center justify-between mb-3">
                <span className="font-mono text-xs text-zinc-300 flex items-center gap-2">
                  <Terminal className="size-3.5 text-pink-400" />
                  BANCO DE PIEZAS SUELTAS (HAZ CLIC PARA ACOPLAR):
                </span>

                {/* Botón Discreto para Desmontar / Reiniciar */}
                <button
                  onClick={disassembleMangle}
                  className="group inline-flex items-center gap-1.5 px-3 py-1 rounded bg-black/80 border border-pink-500/30 hover:border-rose-400 text-[10px] font-mono tracking-widest text-zinc-400 hover:text-rose-300 transition-all cursor-pointer"
                  title="Reiniciar y desarmar a Mangle"
                >
                  <RotateCcw className="size-3 text-pink-400 group-hover:rotate-180 transition-transform duration-500" />
                  <span>[ DESMONTAR ]</span>
                </button>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-2.5">
                {MANGLE_PIECES.map((piece) => {
                  const isAttached = assembledPieces.includes(piece.id);
                  const Icon = piece.icon;
                  return (
                    <button
                      key={piece.id}
                      onClick={() => attachPiece(piece.id)}
                      disabled={isAttached}
                      className={`p-3 rounded-lg border text-left font-mono transition-all flex items-start gap-3 cursor-pointer ${
                        isAttached
                          ? "bg-black/30 border-white/5 opacity-40 cursor-default"
                          : "bg-white/[0.04] border-pink-500/30 hover:border-pink-400 hover:bg-pink-500/10 hover:shadow-[0_0_15px_rgba(236,72,153,0.3)] text-zinc-200 active:scale-95"
                      }`}
                    >
                      <div className="size-8 rounded bg-pink-500/10 border border-pink-500/30 flex items-center justify-center text-pink-400 shrink-0 mt-0.5">
                        <Icon className="size-4" />
                      </div>
                      <div className="min-w-0 flex-1">
                        <div className="flex items-center justify-between">
                          <span className="text-xs font-bold text-white truncate">
                            {piece.name}
                          </span>
                          {isAttached ? (
                            <span className="text-[9px] text-green-400 font-bold">✔ ACOPLADO</span>
                          ) : (
                            <span className="text-[9px] text-pink-300 font-bold">ACOPLAR ➔</span>
                          )}
                        </div>
                        <p className="text-[10px] text-zinc-400 line-clamp-1 mt-0.5">
                          {piece.description}
                        </p>
                      </div>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Esquinas industriales CCTV */}
            <div className="absolute top-2 left-2 size-3 border-t-2 border-l-2 border-pink-400/70 pointer-events-none" />
            <div className="absolute top-2 right-2 size-3 border-t-2 border-r-2 border-pink-400/70 pointer-events-none" />
            <div className="absolute bottom-2 left-2 size-3 border-b-2 border-l-2 border-pink-400/70 pointer-events-none" />
            <div className="absolute bottom-2 right-2 size-3 border-b-2 border-r-2 border-pink-400/70 pointer-events-none" />
          </div>

          {/* Transcripción de la llamada de Phone Guy (revelada al completar el ensamble) */}
          {camLogsOpen && (
            <div className="mt-4 p-4 rounded-xl bg-black/80 border border-pink-500/30 font-mono text-xs text-zinc-300 space-y-2 animate-in fade-in duration-300">
              <div className="flex items-center gap-2 text-pink-400 font-bold border-b border-pink-500/20 pb-2">
                <Radio className="size-4 animate-pulse" />
                <span>TRANSCRIPCIÓN DE AUDIO // FAZBEAR ARCHIVE NIGHT 3:</span>
              </div>
              <p className="text-zinc-300 leading-relaxed italic text-[11px] sm:text-xs">
                &ldquo;Uh, hello? Hello, hello? ... They tried to remake Foxy, ya know? They thought the first one was too scary, so they redesigned him to be more kid-friendly... Eventually they just got tired of putting him back together after every shift and left him as an attraction: a &lsquo;take apart and put back together&rsquo; attraction... Now he&apos;s just a mess of parts. I think the workers just started calling him &lsquo;The Mangle&rsquo;.&rdquo;
              </p>
              <div className="text-[10px] text-pink-400/70 pt-1 flex items-center justify-between">
                <span>ESTADO: SEÑAL DE RADIO SINTONIZADA (84.2 MHz)</span>
                <span className="text-zinc-500">FAZBEAR_ENT_SECURITY</span>
              </div>
            </div>
          )}
        </div>
      </section>

      {/* ── REPRODUCTOR MUSICAL FLOTANTE INTEGRADO (CLASH OF WORLDS) ── */}
      <div className="fixed bottom-4 right-4 sm:bottom-6 sm:right-6 z-50">
        <div className="flex items-center gap-3 px-4 py-2.5 rounded-2xl backdrop-blur-xl bg-black/80 border border-pink-500/40 shadow-[0_0_25px_rgba(236,72,153,0.35)] hover:border-pink-400 transition-all duration-300">
          {/* Botón Play/Pause */}
          <button
            onClick={togglePlay}
            aria-label={isPlaying ? "Pausar música" : "Reproducir música"}
            className="size-10 rounded-full bg-pink-500 hover:bg-pink-400 text-black flex items-center justify-center shadow-[0_0_15px_rgba(236,72,153,0.6)] hover:scale-105 active:scale-95 transition-all cursor-pointer"
          >
            {isPlaying ? (
              <Pause className="size-4 fill-black" />
            ) : (
              <Play className="size-4 fill-black ml-0.5" />
            )}
          </button>

          {/* Info de la pista */}
          <div className="min-w-0 pr-1">
            <div className="flex items-center gap-1.5">
              <span className="size-1.5 rounded-full bg-pink-400 animate-ping" />
              <p className="text-xs font-mono font-bold text-white truncate max-w-[130px] sm:max-w-[170px]">
                Clash of Worlds
              </p>
            </div>
            <p className="text-[10px] font-mono text-pink-300/80 truncate">
              Mangle Theme // OST
            </p>
          </div>

          {/* Espectro Rosa Neón Animado */}
          <div className="flex items-end gap-1 h-6 px-2">
            {[
              "animate-[audio-eq-1_0.9s_ease-in-out_infinite]",
              "animate-[audio-eq-2_0.7s_ease-in-out_infinite]",
              "animate-[audio-eq-3_1.1s_ease-in-out_infinite]",
              "animate-[audio-eq-4_0.8s_ease-in-out_infinite]",
              "animate-[audio-eq-1_1.0s_ease-in-out_infinite]",
              "animate-[audio-eq-3_0.75s_ease-in-out_infinite]",
            ].map((anim, i) => (
              <span
                key={i}
                className={`w-1 rounded-full bg-gradient-to-t from-pink-600 to-pink-300 shadow-[0_0_6px_#ec4899] transition-all duration-300 ${
                  isPlaying ? anim : "h-1 opacity-40"
                }`}
                style={{ height: isPlaying ? undefined : "3px" }}
              />
            ))}
          </div>

          {/* Mute toggle */}
          <button
            onClick={toggleMute}
            aria-label={isMuted ? "Desactivar silencio" : "Silenciar"}
            className="text-zinc-400 hover:text-pink-300 p-1 transition-colors cursor-pointer"
          >
            {isMuted ? <VolumeX className="size-4 text-rose-400" /> : <Volume2 className="size-4" />}
          </button>
        </div>
      </div>

      {/* ── FOOTER DISCRETO ── */}
      <footer className="relative z-20 py-8 text-center text-xs font-mono text-zinc-500 border-t border-white/5">
        <p>© {new Date().getFullYear()} GLL CLAN — MANGLE DRAKE (MEG) // TODOS LOS DERECHOS RESERVADOS</p>
      </footer>
    </main>
  );
}

export default MangleProfile;
