"use client";

import { useState, useEffect, useRef } from "react";
import Link from "next/link";
import Image from "next/image";
import { members, type Member } from "@/data/members";
import {
  Play,
  Pause,
  Square,
  SkipBack,
  SkipForward,
  Volume2,
  VolumeX,
  Radio,
  Sparkles,
  ExternalLink,
  Shield,
  Gamepad2,
  Users,
  Music,
  Copy,
  Check,
} from "lucide-react";
import { SiDiscord } from "react-icons/si";
import { ParticlesBackground, SoundButton } from "@/components/fx";

/* ── Estilos de animación y texturas ────────────────────────── */
const FX_STYLES = `
@keyframes jitter {
  0%, 100% { transform: translate(0,0); }
  25% { transform: translate(-2px,1px); }
  50% { transform: translate(2px,-1px); }
  75% { transform: translate(-1px,-1px); }
}
@keyframes card-glitch {
  0%, 94% { filter: none; }
  95% { filter: brightness(1.4) saturate(1.5); }
  96% { filter: brightness(0.7); }
  97%, 100% { filter: none; }
}
.jitter-hover:hover { animation: jitter 0.35s steps(2) infinite; }
.lolbit-glitch:hover { animation: card-glitch 2.4s linear infinite; }
.scanlines {
  background-image: repeating-linear-gradient(0deg, rgba(0,0,0,0.3) 0px, rgba(0,0,0,0.3) 1px, transparent 1px, transparent 4px);
}

/* ── Micro-glitch en el texto del fundador ─────────────── */
@keyframes text-aberration {
  0%, 100% { text-shadow: none; }
  25% {
    text-shadow:
      -2px 0 rgba(255,122,0,0.7),
      2px 0 rgba(168,17,218,0.7);
  }
  50% {
    text-shadow:
      2px 0 rgba(168,17,218,0.7),
      -2px 0 rgba(255,122,0,0.7);
  }
  75% {
    text-shadow:
      -1px 0 rgba(168,17,218,0.5),
      1px 0 rgba(255,122,0,0.5);
  }
}
.group:hover .gll-aberration { animation: text-aberration 0.4s steps(2) infinite; }

/* ── Glitch de arranque del monograma ──────────────────── */
@keyframes boot-glitch {
  0% { text-shadow: none; transform: translate(0,0); opacity: 0.4; }
  20% { text-shadow: -4px 0 rgba(255,30,60,0.8), 4px 0 rgba(0,255,255,0.8); transform: translate(-3px,1px); opacity: 1; }
  40% { text-shadow: 3px 0 rgba(255,30,60,0.8), -3px 0 rgba(0,255,255,0.8); transform: translate(3px,-1px); }
  60% { text-shadow: none; transform: translate(0,0); }
  80% { text-shadow: -2px 0 rgba(255,30,60,0.6), 2px 0 rgba(0,255,255,0.6); transform: translate(-1px,0); }
  100% { text-shadow: none; transform: translate(0,0); }
}
.boot-glitch { animation: boot-glitch 0.7s steps(2) 1; }

/* ── Scanlines / estática en hover ──────────────────────── */
.gll-tear {
  position: absolute;
  inset: 0;
  opacity: 0;
  pointer-events: none;
  background-image: repeating-linear-gradient(
    0deg,
    rgba(255,255,255,0.08) 0px,
    rgba(255,255,255,0.08) 1px,
    transparent 1px,
    transparent 4px
  );
  mix-blend-mode: screen;
}
.group:hover .gll-tear { opacity: 1; }

/* ── Dispersión orgánica de polvo estelar ────────────────── */
@keyframes stellar-drift {
  0% { transform: translateY(0) translateX(0) scale(1); opacity: 0.15; }
  50% { transform: translateY(-40px) translateX(20px) scale(1.3); opacity: 0.6; }
  100% { transform: translateY(-80px) translateX(-15px) scale(0.8); opacity: 0.1; }
}
.dust-mote {
  position: absolute;
  border-radius: 9999px;
  background: radial-gradient(circle, #ffffff 0%, rgba(248, 113, 113, 0.5) 60%, transparent 100%);
  pointer-events: none;
  animation: stellar-drift ease-in-out infinite;
}

/* ── Partículas blancas que flotan al hacer hover ───────── */
@keyframes ember-float {
  0%   { transform: translateY(0) scale(1); opacity: 0; }
  10%  { opacity: 0.9; }
  85%  { opacity: 0.4; }
  100% { transform: translateY(-60px) scale(0.4); opacity: 0; }
}
.gll-ember {
  position: absolute;
  bottom: 20%;
  width: 3px;
  height: 3px;
  background: #E7E4DE;
  border-radius: 0;
  box-shadow: 0 0 6px #E7E4DE, 0 0 12px rgba(231,228,222,0.4);
  opacity: 0;
  animation: ember-float var(--dur) ease-out var(--delay) infinite;
}
.group:hover .gll-ember { opacity: 0.9; }

/* ── Bento: estática de TV ─────────────────────────────── */
@keyframes staticShift {
  0% { background-position: 0 0; }
  50% { background-position: -28px 14px; }
  100% { background-position: 0 0; }
}
.tv-static {
  background-image:
    repeating-linear-gradient(0deg, rgba(255,255,255,0.07) 0px, rgba(255,255,255,0.07) 1px, transparent 1px, transparent 3px),
    repeating-linear-gradient(90deg, rgba(255,0,60,0.06) 0px, rgba(255,0,60,0.06) 2px, transparent 2px, transparent 5px);
  animation: staticShift 0.45s steps(2) infinite;
}

/* ── Bento: aberración base de Hater ───────────────────── */
.hater-name {
  text-shadow: -1px 0 rgba(255,0,60,0.55), 1px 0 rgba(0,220,255,0.55);
}
.group:hover .hater-name { animation: text-aberration 0.4s steps(2) infinite; }

/* ── Bento: radar táctico ──────────────────────────────── */
@keyframes radarSpin {
  to { transform: rotate(360deg); }
}
.radar-sweep {
  background: conic-gradient(from 0deg, rgba(236,72,153,0.65), transparent 28%);
  animation: radarSpin 3s linear infinite;
}

/* ── Bento: mini ecualizadores ─────────────────────────── */
@keyframes eqBounce {
  0%, 100% { transform: scaleY(0.2); }
  50% { transform: scaleY(1); }
}
.eq-mini { animation: eqBounce 0.8s ease-in-out infinite; transform-origin: bottom; }

/* ── Halo respirante de Valkiria ───────────────────────── */
@keyframes haloPulse {
  0%, 100% { opacity: 0.45; transform: scale(1); }
  50% { opacity: 0.95; transform: scale(1.12); }
}
.halo-pulse { animation: haloPulse 3.2s ease-in-out infinite; }

/* ── Estrella pulsante central de WMP ──────────────────── */
@keyframes starPulse {
  0%, 100% { opacity: 0.7; transform: scale(1); filter: drop-shadow(0 0 15px rgba(220,38,38,0.5)); }
  50% { opacity: 1; transform: scale(1.06); filter: drop-shadow(0 0 28px rgba(220,38,38,0.85)); }
}
.star-pulse { animation: starPulse 2.4s ease-in-out infinite; }
`;

/* ── Avatares de integrantes ────────────────────────────── */
const AVATARS: Record<string, { src: string; frame?: string }> = {
  lolbit: { src: "/images/members/lolbit/avatars.jpeg" },
  nothing: { src: "/images/members/nothing/avatar.jpg" },
  darky: { src: "/images/members/Darky/avatar.jpg" },
  dramatic: { src: "/images/members/dramatic/avatar.jpeg" },
  mangle: { src: "/images/members/Mangle/avatar.jpg" },
  "mangle-drake": { src: "/images/members/Mangle/avatar.jpg" },
  sleepy: { src: "/images/members/sleepy/avatar.jpg" },
  valkiria: { src: "/images/members/valkiria/avatar.jpg" },
  darth10: { src: "/images/members/darth/avatar.jpg" },
  stark: { src: "/images/members/stark/avatar.jpg" },
  hater: { src: "/images/members/hater/vinyl-cover.jpg" },
};

/* ── Sonidos opcionales al hover ────────────────────────── */
const HOVER_SOUNDS: Record<string, string> = {
  hater: "/audio/hater/laugh.mp3",
};

/* ── Tags de Discord ────────────────────────────────────── */
const DISCORD_TAGS: Record<string, string> = {
  nothing: "nothingwork",
  darky: "darky0354_07740",
  mangle: "mangledrake",
  "mangle-drake": "mangledrake",
  lolbit: "lolbit_sys",
  hater: "hater_sinister",
  valkiria: "valkiria_walten",
};

/* ── Facciones para filtro táctico ──────────────────────── */
type Faction = "ARCHIVE" | "COMBAT" | "VOID";
const FACTIONS: Record<string, Faction> = {
  lolbit: "ARCHIVE",
  dramatic: "ARCHIVE",
  darth10: "ARCHIVE",
  sleepy: "ARCHIVE",
  valkiria: "COMBAT",
  stark: "COMBAT",
  mangle: "COMBAT",
  "mangle-drake": "COMBAT",
  hater: "VOID",
  nothing: "VOID",
  darky: "VOID",
};
const FILTERS: ("ALL" | Faction)[] = ["ALL", "ARCHIVE", "COMBAT", "VOID"];

/* ── Partículas para Darky ──────────────────────────────── */
const EMBERS = Array.from({ length: 8 }, (_, i) => ({
  left: 12 + (i * 9.5) % 78,
  dur: 1.6 + (i % 4) * 0.6,
  delay: -(i * 1.2),
}));

/* ── Motas de polvo estelar orgánicas ───────────────────── */
const DUST_MOTES = Array.from({ length: 20 }, (_, i) => ({
  top: `${(i * 17) % 94}%`,
  left: `${(i * 23) % 94}%`,
  size: 2 + (i % 3) * 1.5,
  dur: `${7 + (i % 5) * 2}s`,
  delay: `${-(i * 1.5)}s`,
  opacity: 0.25 + (i % 4) * 0.15,
}));

/* ── Temas por tarjeta ──────────────────────────────────── */
interface CardTheme {
  accent: string;
  tag: string;
  tagClass: string;
  statusColor: string;
}

function themeFor(slug: string): CardTheme {
  switch (slug) {
    case "mangle":
    case "mangle-drake":
      return {
        accent: "#ec4899",
        tag: "[ MEG // RECON ]",
        tagClass: "border-pink-500/40 text-pink-300 bg-pink-500/10",
        statusColor: "text-[#ec4899]",
      };
    case "lolbit":
      return {
        accent: "#f97316",
        tag: "[ DEV // PORT 0x7F ]",
        tagClass: "border-[#f97316]/40 text-[#fb923c] bg-[#f97316]/10",
        statusColor: "text-[#f97316]",
      };
    case "valkiria":
      return {
        accent: "#f59e0b",
        tag: "[ HOLY // GOSPEL ]",
        tagClass: "border-amber-400/40 text-amber-200 bg-amber-400/10",
        statusColor: "text-amber-400",
      };
    case "nothing":
      return {
        accent: "#facc15",
        tag: "[ BIG SHOT // SHOP ]",
        tagClass: "border-yellow-400/40 text-yellow-300 bg-yellow-400/10",
        statusColor: "text-yellow-400",
      };
    case "stark":
      return {
        accent: "#e4e4e7",
        tag: "[ RONIN // STEEL ]",
        tagClass: "border-zinc-500/40 text-zinc-300 bg-zinc-500/10",
        statusColor: "text-zinc-300",
      };
    case "hater":
      return {
        accent: "#dc2626",
        tag: "[ CORRUPT // VHS ]",
        tagClass: "border-red-600/40 text-red-300 bg-red-600/10",
        statusColor: "text-red-500",
      };
    case "darky":
      return {
        accent: "#991b1b",
        tag: "[ ABYSS // SPIRIT ]",
        tagClass: "border-red-800/40 text-rose-300 bg-red-950/40",
        statusColor: "text-rose-400",
      };
    case "dramatic":
      return {
        accent: "#38bdf8",
        tag: "[ SKY // DRIFT ]",
        tagClass: "border-sky-400/40 text-sky-300 bg-sky-400/10",
        statusColor: "text-sky-400",
      };
    case "darth10":
      return {
        accent: "#06b6d4",
        tag: "[ OTAKU // AFK ]",
        tagClass: "border-cyan-400/40 text-cyan-300 bg-cyan-400/10",
        statusColor: "text-cyan-400",
      };
    case "sleepy":
      return {
        accent: "#b91c1c",
        tag: "[ GRUNGE // CLIMB ]",
        tagClass: "border-red-700/40 text-red-200 bg-red-900/20",
        statusColor: "text-red-400",
      };
    default:
      return {
        accent: "#a1a1aa",
        tag: "[ OPERATIVE ]",
        tagClass: "border-zinc-600 text-zinc-400 bg-zinc-800/20",
        statusColor: "text-zinc-400",
      };
  }
}

/* ══════════════════════════════════════════════════════════════
   1. HERO: WINDOWS MEDIA PLAYER RETRO (XP LUNA AZUL)
   ══════════════════════════════════════════════════════════════ */
function RetroWmpHero({
  isPlaying,
  setIsPlaying,
  progress,
  setProgress,
  isMuted,
  setIsMuted,
}: {
  isPlaying: boolean;
  setIsPlaying: (v: boolean | ((prev: boolean) => boolean)) => void;
  progress: number;
  setProgress: (v: number) => void;
  isMuted: boolean;
  setIsMuted: (v: boolean | ((prev: boolean) => boolean)) => void;
}) {
  // Duración total simulada: 3:33 (213 seg)
  const totalSeconds = 213;
  const currentSeconds = Math.floor((progress / 100) * totalSeconds);
  const fmt = (s: number) => {
    const mins = Math.floor(s / 60);
    const secs = s % 60;
    return `${mins.toString().padStart(2, "0")}:${secs.toString().padStart(2, "0")}`;
  };

  return (
    <section className="relative mx-auto mt-16 mb-20 w-full max-w-2xl px-4 select-none">
      {/* Contenedor de la Ventana Windows XP Luna */}
      <div className="overflow-hidden rounded-t-xl rounded-b-lg border-2 border-[#003c9c] shadow-[0_15px_50px_rgba(0,0,0,0.8),0_0_35px_rgba(0,85,234,0.25)]">
        {/* Barra de Título XP Luna Azul */}
        <div
          className="relative flex h-8 items-center justify-between px-3 select-none"
          style={{
            background:
              "linear-gradient(180deg, #0058e6 0%, #3a93ff 8%, #0055ea 40%, #0044cc 88%, #0033aa 100%)",
            borderBottom: "1px solid #002277",
          }}
        >
          {/* Brillo especular superior XP */}
          <div className="pointer-events-none absolute inset-x-0 top-0 h-[2px] bg-white/40" />

          {/* Icono WMP y Título */}
          <div className="flex items-center gap-2">
            <div className="relative flex h-4 w-4 shrink-0 items-center justify-center rounded-full bg-gradient-to-tr from-amber-400 via-emerald-400 to-sky-400 p-[1px] shadow-sm">
              <div className="flex h-full w-full items-center justify-center rounded-full bg-[#0040be]">
                <div className="ml-0.5 h-0 w-0 border-y-[2.5px] border-y-transparent border-l-[4.5px] border-l-white" />
              </div>
            </div>
            <span
              className="truncate text-[11px] font-bold text-white drop-shadow-[0_1px_2px_rgba(0,0,0,0.8)] sm:text-xs"
              style={{ fontFamily: "Tahoma, 'Segoe UI', sans-serif" }}
            >
              Windows Media Player - GLL — God&apos;s Live Longer.™
            </span>
          </div>

          {/* Botones de Ventana XP Luna (_ □ ✕) */}
          <div className="flex items-center gap-1">
            <button
              title="Minimizar"
              className="flex h-5 w-5 items-center justify-center rounded-[3px] border border-white/40 bg-gradient-to-b from-[#3a93ff] to-[#0044cc] text-[10px] font-bold text-white shadow-sm transition hover:brightness-125"
            >
              _
            </button>
            <button
              title="Maximizar"
              className="flex h-5 w-5 items-center justify-center rounded-[3px] border border-white/40 bg-gradient-to-b from-[#3a93ff] to-[#0044cc] text-[9px] text-white shadow-sm transition hover:brightness-125"
            >
              □
            </button>
            <button
              title="Cerrar"
              className="flex h-5 w-5 items-center justify-center rounded-[3px] border border-white/40 bg-gradient-to-b from-[#ff6b6b] via-[#e81123] to-[#b30917] text-[10px] font-black text-white shadow-sm transition hover:brightness-125"
            >
              ✕
            </button>
          </div>
        </div>

        {/* Menú de Texto Vintage */}
        <div className="flex items-center gap-4 border-b border-[#aca899] bg-[#ede9d8] px-3 py-1 text-xs font-sans text-neutral-800 select-none">
          <span className="cursor-default rounded-sm px-1.5 py-0.5 hover:bg-[#316ac5] hover:text-white">
            <span className="underline">F</span>ile
          </span>
          <span className="cursor-default rounded-sm px-1.5 py-0.5 hover:bg-[#316ac5] hover:text-white">
            <span className="underline">V</span>iew
          </span>
          <span className="cursor-default rounded-sm px-1.5 py-0.5 hover:bg-[#316ac5] hover:text-white">
            <span className="underline">P</span>lay
          </span>
          <span className="cursor-default rounded-sm px-1.5 py-0.5 hover:bg-[#316ac5] hover:text-white">
            <span className="underline">T</span>ools
          </span>
          <span className="cursor-default rounded-sm px-1.5 py-0.5 hover:bg-[#316ac5] hover:text-white">
            <span className="underline">H</span>elp
          </span>
        </div>

        {/* Pantalla Visualizadora Central */}
        <div className="relative flex aspect-[16/9] max-h-[340px] w-full items-center justify-center overflow-hidden border-x-2 border-[#121620] bg-black sm:aspect-[21/9]">
          {/* Arte central recortado: zoom para eliminar la ventana WMP interna duplicada */}
          <div className="absolute inset-0 overflow-hidden">
            <Image
              src="/images/gll-player.jpg"
              alt="GLL Player Visualizer"
              fill
              priority
              className={`scale-[1.75] object-cover object-center transition-transform duration-1000 ${
                isPlaying ? "brightness-110" : "opacity-80"
              }`}
            />
          </div>

          {/* Scanlines CRT y viñeta analógica */}
          <div aria-hidden className="scanlines pointer-events-none absolute inset-0 opacity-45" />
          <div
            aria-hidden
            className="pointer-events-none absolute inset-0 bg-radial from-transparent via-black/30 to-black/90"
          />

          {/* Emblema central de estrella roja pulsante */}
          <div className="pointer-events-none absolute flex flex-col items-center justify-center">
            <div
              className={`star-pulse relative flex h-24 w-24 items-center justify-center transition-transform ${
                isPlaying ? "animate-pulse scale-110" : "scale-100 opacity-70"
              }`}
            >
              <span className="absolute text-5xl font-black text-red-600 drop-shadow-[0_0_24px_rgba(220,38,38,0.95)] select-none">
                ✦
              </span>
              <span className="absolute text-xl font-black tracking-widest text-white drop-shadow-[0_0_12px_rgba(255,255,255,0.95)]">
                GLL
              </span>
            </div>
            <p className="mt-1 font-mono text-[9px] font-bold tracking-[0.4em] text-red-400 uppercase select-none drop-shadow-[0_0_8px_rgba(220,38,38,0.8)]">
              {isPlaying ? "SIGNAL BROADCASTING" : "STANDBY READY"}
            </p>
          </div>

          {/* Badge superior izquierdo: señal en vivo en verde vivo */}
          <div className="absolute left-3 top-3 flex items-center gap-2 rounded bg-black/80 px-2.5 py-1 font-mono text-[10px] tracking-wider backdrop-blur-sm border border-white/10">
            <span className="relative flex h-2 w-2">
              <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-emerald-400 opacity-75" />
              <span className="relative inline-flex h-2 w-2 rounded-full bg-emerald-500" />
            </span>
            <span className="font-bold text-emerald-400">
              {isPlaying ? "● PLAYING // GLL ANTHEM (128 KBPS)" : "PAUSED // STANDBY"}
            </span>
          </div>

          {/* Ecualizador inferior reactivo */}
          <div
            className="absolute inset-x-0 bottom-0 flex h-8 items-end gap-[3px] px-4 pb-1"
            aria-hidden
          >
            {Array.from({ length: 32 }, (_, i) => (
              <span
                key={i}
                className={`w-full transition-opacity duration-300 ${
                  isPlaying
                    ? "eq-mini bg-gradient-to-t from-red-600 via-amber-500 to-emerald-400 opacity-85"
                    : "h-1 bg-red-900/30 opacity-30"
                }`}
                style={{
                  animationDelay: `${(i % 8) * 0.12}s`,
                  animationDuration: `${0.6 + (i % 5) * 0.15}s`,
                }}
              />
            ))}
          </div>
        </div>

        {/* Barra de Control Inferior Windows XP Luna */}
        <div
          className="relative border-t border-sky-400/40 p-3 sm:p-4 select-none"
          style={{
            background:
              "linear-gradient(180deg, #2b61b8 0%, #1a4da3 30%, #123d88 70%, #0d2f6d 100%)",
          }}
        >
          {/* Pantalla LCD de Estado y Tiempo */}
          <div className="mb-3 flex flex-wrap items-center justify-between gap-2 rounded-sm border border-[#04280f] bg-[#001407] px-3 py-1.5 font-mono shadow-[inset_0_2px_4px_rgba(0,0,0,0.8)]">
            <div className="flex items-center gap-2">
              <span
                className={`h-2 w-2 rounded-full ${
                  isPlaying ? "bg-emerald-400 shadow-[0_0_8px_#34d399] animate-pulse" : "bg-emerald-800"
                }`}
              />
              <span className="text-[11px] font-bold tracking-wider text-emerald-300">
                {isPlaying ? "● PLAYING // GLL ANTHEM (128 KBPS)" : "Ready"}
              </span>
            </div>
            <div className="text-[11px] font-bold tracking-widest text-emerald-400">
              {fmt(currentSeconds)} / {fmt(totalSeconds)}
            </div>
          </div>

          {/* Barra de Progreso XP */}
          <div className="mb-3 flex items-center gap-2">
            <div
              onClick={(e) => {
                const rect = e.currentTarget.getBoundingClientRect();
                const clickX = e.clientX - rect.left;
                const newProgress = Math.max(0, Math.min(100, (clickX / rect.width) * 100));
                setProgress(newProgress);
              }}
              className="relative h-2.5 w-full cursor-pointer rounded-full border border-[#09224f] bg-[#0c244d] shadow-[inset_0_1px_2px_rgba(0,0,0,0.7)]"
            >
              {/* Relleno de progreso */}
              <div
                className="h-full rounded-full bg-gradient-to-r from-sky-400 to-[#38bdf8]"
                style={{ width: `${progress}%` }}
              />
              {/* Knob azul XP */}
              <div
                className="absolute top-1/2 -ml-2 h-4 w-4 -translate-y-1/2 rounded-full border border-[#092960] bg-gradient-to-b from-[#7ebbff] to-[#1c64d9] shadow-[0_1px_3px_rgba(0,0,0,0.6)] hover:scale-110"
                style={{ left: `${progress}%` }}
              />
            </div>
          </div>

          {/* Controles XP: Play circular, Prev, Stop, Next, Volumen */}
          <div className="flex flex-wrap items-center justify-between gap-3">
            <div className="flex items-center gap-2 sm:gap-3">
              {/* Botón Prev */}
              <button
                onClick={() => setProgress(0)}
                title="Pista anterior"
                className="flex h-7 w-7 items-center justify-center rounded-full border border-[#092960] bg-gradient-to-b from-[#4d86d6] via-[#1a5cb8] to-[#0d3b84] text-white shadow-sm transition hover:brightness-110 active:translate-y-px"
              >
                <SkipBack className="h-3.5 w-3.5" />
              </button>

              {/* Botón Circular Metálico Azul PLAY/PAUSE */}
              <button
                onClick={() => setIsPlaying((p) => !p)}
                title={isPlaying ? "Pausar" : "Reproducir"}
                className="relative flex h-11 w-11 items-center justify-center rounded-full border-2 border-[#092960] bg-gradient-to-b from-[#6ba3f5] via-[#2463c7] to-[#0e3b85] text-white shadow-[inset_0_2px_4px_rgba(255,255,255,0.7),0_3px_6px_rgba(0,0,0,0.6)] transition-all hover:scale-105 active:scale-95"
              >
                <div className="pointer-events-none absolute inset-x-1 top-0.5 h-3 rounded-t-full bg-white/40" />
                {isPlaying ? (
                  <Pause className="h-5 w-5 fill-white" />
                ) : (
                  <Play className="ml-0.5 h-5 w-5 fill-white" />
                )}
              </button>

              {/* Botón Stop */}
              <button
                onClick={() => {
                  setIsPlaying(false);
                  setProgress(0);
                }}
                title="Detener"
                className="flex h-7 w-7 items-center justify-center rounded-full border border-[#092960] bg-gradient-to-b from-[#4d86d6] via-[#1a5cb8] to-[#0d3b84] text-white shadow-sm transition hover:brightness-110 active:translate-y-px"
              >
                <Square className="h-3 w-3 fill-white" />
              </button>

              {/* Botón Next */}
              <button
                onClick={() => setProgress(100)}
                title="Siguiente pista"
                className="flex h-7 w-7 items-center justify-center rounded-full border border-[#092960] bg-gradient-to-b from-[#4d86d6] via-[#1a5cb8] to-[#0d3b84] text-white shadow-sm transition hover:brightness-110 active:translate-y-px"
              >
                <SkipForward className="h-3.5 w-3.5" />
              </button>
            </div>

            {/* Control de Volumen */}
            <div className="flex items-center gap-2">
              <button
                onClick={() => setIsMuted((m) => !m)}
                title={isMuted ? "Activar sonido" : "Silenciar"}
                className="text-sky-200 transition hover:text-white"
              >
                {isMuted ? <VolumeX className="h-4 w-4" /> : <Volume2 className="h-4 w-4" />}
              </button>
              <input
                type="range"
                min="0"
                max="100"
                defaultValue="80"
                disabled={isMuted}
                aria-label="Volumen"
                className="h-1.5 w-20 cursor-pointer accent-sky-400"
              />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

/* ══════════════════════════════════════════════════════════════
   2. TABLÓN DEL MANIFIESTO GLL (WELCOME BOARD)
   ══════════════════════════════════════════════════════════════ */
function GllWelcomeBoard() {
  return (
    <section className="relative mx-auto mt-10 w-full max-w-5xl px-4 sm:px-6">
      {/* Marco estilizado gótico / cristalino */}
      <div className="relative overflow-hidden rounded-2xl border border-red-900/40 bg-[#08050c]/90 p-6 shadow-[0_0_60px_rgba(0,0,0,0.9),inset_0_1px_0_rgba(255,255,255,0.06)] backdrop-blur-xl transition-colors hover:border-red-600/50 sm:p-10">
        {/* Cruces de mira diegéticas en las 4 esquinas */}
        <span className="pointer-events-none absolute left-3 top-3 font-mono text-xs font-bold text-red-500/60 select-none">
          +
        </span>
        <span className="pointer-events-none absolute right-3 top-3 font-mono text-xs font-bold text-red-500/60 select-none">
          +
        </span>
        <span className="pointer-events-none absolute bottom-3 left-3 font-mono text-xs font-bold text-red-500/60 select-none">
          +
        </span>
        <span className="pointer-events-none absolute bottom-3 right-3 font-mono text-xs font-bold text-red-500/60 select-none">
          +
        </span>

        {/* Resplandor ambiental de fondo */}
        <div
          aria-hidden
          className="pointer-events-none absolute -top-24 left-1/2 h-64 w-96 -translate-x-1/2 rounded-full bg-red-600/10 blur-3xl"
        />

        {/* Título Oficial con caracteres Unicode decorativos */}
        <div className="text-center">
          <p className="font-serif text-lg font-bold tracking-wide text-zinc-100 sm:text-2xl lg:text-3xl">
            ₊‧꒰ა ✦ ໒꒱ ‧₊˚ 𝑮𝑳𝑳 — 𝐆𝐨𝐝&apos;𝐬 𝐋𝐢𝐯𝐞 𝐋𝐨𝐧𝐠𝐞𝐫.™ ˚₊‧꒰ა ✦ ໒꒱ ‧₊˚
          </p>
        </div>

        {/* Bloque Welcome y descripción comunitaria */}
        <div className="mt-6 text-center">
          <h2 className="font-serif text-2xl font-black italic tracking-wide text-red-100 sm:text-3xl">
            𝑾𝒆𝒍𝒄𝒐𝒎𝒆 𝒕𝒐 𝑮𝑳𝑳
          </h2>
          <p className="mx-auto mt-3 max-w-2xl text-sm leading-relaxed text-zinc-300 sm:text-base">
            Una comunidad para conocer personas, compartir intereses y pasarla bien.
          </p>
          <p className="mt-2 font-mono text-xs font-semibold tracking-wider text-red-400 sm:text-sm">
            &gt; ✦ Música · Videojuegos · Roleplay · Amistades ✦
          </p>
        </div>

        {/* Separador ornamental */}
        <div className="my-8 flex items-center justify-center gap-3">
          <span className="h-px flex-1 bg-gradient-to-r from-transparent via-red-800/50 to-transparent" />
          <span className="text-xs text-red-500 select-none">✦ ── ୨୧ ── ✦</span>
          <span className="h-px flex-1 bg-gradient-to-r from-transparent via-red-800/50 to-transparent" />
        </div>

        {/* Grid de 3 Columnas: Actividades, Seguridad, Comunidad */}
        <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
          {/* Columna 1: Actividades */}
          <div className="rounded-xl border border-red-950/70 bg-black/50 p-5 backdrop-blur-sm transition hover:border-red-600/40">
            <div className="mb-3 flex items-center justify-center gap-2">
              <Gamepad2 className="h-4 w-4 text-red-400" />
              <h3 className="font-serif text-base font-bold text-red-200">
                ୨୧ ── 𝑨𝒄𝒕𝒊𝒗𝒊𝒅𝒂𝒅𝒆𝒔 ── ୨୧
              </h3>
            </div>
            <ul className="space-y-2.5 text-xs text-zinc-300">
              <li className="flex items-start gap-2">
                <span className="text-red-400 font-bold">•</span>
                <span>
                  <strong className="text-zinc-100 font-medium">Roleplay:</strong> Narrativas,
                  facciones e historias comunitarias.
                </span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-red-400 font-bold">•</span>
                <span>
                  <strong className="text-zinc-100 font-medium">Videojuegos:</strong> Partidas en
                  Roblox, Minecraft, Fortnite y más.
                </span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-red-400 font-bold">•</span>
                <span>
                  <strong className="text-zinc-100 font-medium">Música y Eventos:</strong> Canales
                  de audio, radio en directo y dinámicas grupales.
                </span>
              </li>
            </ul>
          </div>

          {/* Columna 2: Seguridad */}
          <div className="rounded-xl border border-red-950/70 bg-black/50 p-5 backdrop-blur-sm transition hover:border-red-600/40">
            <div className="mb-3 flex items-center justify-center gap-2">
              <Shield className="h-4 w-4 text-red-400" />
              <h3 className="font-serif text-base font-bold text-red-200">
                ✦ 𝑺𝒆𝒈𝒖𝒓𝒊𝒅𝒂𝒅 ✦
              </h3>
            </div>
            <ul className="space-y-2.5 text-xs text-zinc-300">
              <li className="flex items-start gap-2">
                <span className="text-red-400 font-bold">•</span>
                <span>
                  <strong className="text-zinc-100 font-medium">Convivencia y Respeto:</strong>{" "}
                  Espacio moderado, seguro y libre de toxicidad.
                </span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-red-400 font-bold">•</span>
                <span>
                  <strong className="text-zinc-100 font-medium">Bienestar:</strong> Protección y
                  cuidado integral para cada miembro.
                </span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-red-400 font-bold">•</span>
                <span>
                  <strong className="text-zinc-100 font-medium">Contacto Staff:</strong> DM directo
                  y asistencia inmediata de moderación.
                </span>
              </li>
            </ul>
          </div>

          {/* Columna 3: Comunidad */}
          <div className="rounded-xl border border-red-950/70 bg-black/50 p-5 backdrop-blur-sm transition hover:border-red-600/40">
            <div className="mb-3 flex items-center justify-center gap-2">
              <Users className="h-4 w-4 text-red-400" />
              <h3 className="font-serif text-base font-bold text-red-200">
                ✦ 𝑪𝒐𝒎𝒖𝒏𝒊𝒅𝒂𝒅 ✦
              </h3>
            </div>
            <ul className="space-y-2.5 text-xs text-zinc-300">
              <li className="flex items-start gap-2">
                <span className="text-red-400 font-bold">•</span>
                <span>
                  <strong className="text-zinc-100 font-medium">Participación Libre:</strong> Sin
                  horarios forzados ni cuotas obligatorias de actividad.
                </span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-red-400 font-bold">•</span>
                <span>
                  <strong className="text-zinc-100 font-medium">Nuevas Amistades:</strong> Conecta
                  con personas que comparten tus mismos gustos.
                </span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-red-400 font-bold">•</span>
                <span>
                  <strong className="text-zinc-100 font-medium">Punto de Encuentro:</strong> Un
                  hogar digital donde ser tú mismo.
                </span>
              </li>
            </ul>
          </div>
        </div>

        {/* Call to Action Discord Retro Neón */}
        <div className="mt-10 flex flex-col items-center justify-center text-center">
          <a
            href="https://discord.gg/JFwbkEbfAH"
            target="_blank"
            rel="noopener noreferrer"
            className="group relative inline-flex items-center justify-center gap-3 overflow-hidden rounded-xl border border-red-400/50 bg-gradient-to-r from-red-600 via-purple-600 to-red-600 px-8 py-4 font-mono text-sm font-bold tracking-wider text-white shadow-[0_0_30px_rgba(220,38,38,0.4),0_0_60px_rgba(168,85,247,0.3)] transition-all duration-300 hover:scale-105 hover:border-purple-300 hover:shadow-[0_0_50px_rgba(220,38,38,0.7),0_0_80px_rgba(168,85,247,0.6)] active:scale-95 sm:text-base"
          >
            <SiDiscord className="h-5 w-5 text-white transition-transform group-hover:rotate-12" />
            <span>[ ╰┈➤ ÚNETE A GLL // DISCORD SERVER ]</span>
            <ExternalLink className="h-4 w-4 opacity-70 transition-opacity group-hover:opacity-100" />
          </a>
          <p className="mt-2 font-mono text-[10px] tracking-widest text-zinc-500 uppercase">
            Official Community Hub // Direct Gateway
          </p>
        </div>
      </div>
    </section>
  );
}

/* ══════════════════════════════════════════════════════════════
   3. DOSSIERS INDIVIDUALES CON IDENTIDAD VISUAL PROPIA
   ══════════════════════════════════════════════════════════════ */
interface DossierProps {
  m: Member;
  t: CardTheme;
  copied: string | null;
  onCopy: (e: React.MouseEvent, slug: string) => void;
}

/* Subcomponente Avatar con marco temático */
function DossierAvatar({ slug }: { slug: string }) {
  const avatar = AVATARS[slug] ?? { src: "/images/gll-player.jpg" };
  return (
    <div className="relative h-12 w-12 shrink-0 overflow-hidden rounded-full border border-white/20 shadow-md">
      <Image src={avatar.src} alt={slug} fill className="object-cover" />
    </div>
  );
}

/* Botón de copia de Discord */
function DiscordChip({
  slug,
  copied,
  onCopy,
}: {
  slug: string;
  copied: string | null;
  onCopy: (e: React.MouseEvent, slug: string) => void;
}) {
  const tag = DISCORD_TAGS[slug];
  if (!tag) return null;
  const isCopied = copied === slug;

  return (
    <button
      onClick={(e) => onCopy(e, slug)}
      title={`Copiar Discord: ${tag}`}
      className="inline-flex items-center gap-1 rounded border border-white/10 bg-white/5 px-2 py-0.5 font-mono text-[9px] text-zinc-400 transition hover:border-red-500/50 hover:text-white"
    >
      <SiDiscord className="h-2.5 w-2.5" />
      <span>{isCopied ? "COPIED" : tag}</span>
      {isCopied ? <Check className="h-2.5 w-2.5 text-emerald-400" /> : <Copy className="h-2.5 w-2.5" />}
    </button>
  );
}

/* ── Valkiria: Liquid Glass & Halo Sacro ─────────────────── */
function ValkiriaCard({ m, t }: DossierProps) {
  return (
    <div className="relative flex h-full flex-col overflow-hidden rounded-2xl border border-amber-400/30 bg-gradient-to-b from-white/[0.08] via-amber-950/20 to-black/90 p-5 shadow-[0_8px_32px_0_rgba(245,158,11,0.2)] backdrop-blur-xl transition-all duration-500 hover:border-amber-400/70 hover:shadow-[0_8px_40px_0_rgba(245,158,11,0.4)]">
      {/* Fondo de retrato celestial */}
      <div className="absolute inset-0 -z-0">
        <Image
          src="/images/members/valkiria/avatar.jpg"
          alt=""
          fill
          className="object-cover opacity-25 transition-transform duration-700 group-hover:scale-105"
        />
      </div>

      {/* Halo sacro respirante centrado */}
      <span
        aria-hidden
        className="halo-pulse pointer-events-none absolute left-1/2 top-10 h-44 w-44 -translate-x-1/2 rounded-full"
        style={{
          background: "radial-gradient(circle, rgba(251,191,36,0.3) 0%, transparent 70%)",
        }}
      />

      {/* Reflejo especular de cristal */}
      <span
        aria-hidden
        className="pointer-events-none absolute inset-x-0 top-0 h-1/2"
        style={{
          background: "linear-gradient(135deg, rgba(255,255,255,0.12) 0%, transparent 50%)",
        }}
      />

      <div className="relative flex items-center justify-between text-[10px] font-mono tracking-widest text-amber-300">
        <span>✦ SACRED ✦</span>
        <span className="rounded border border-amber-400/40 bg-amber-400/10 px-1.5 py-0.5">
          {t.tag}
        </span>
      </div>

      <div className="relative mt-auto flex flex-col items-center pt-4 text-center">
        <div className="mx-auto">
          <DossierAvatar slug={m.slug} />
        </div>
        <h3 className="mt-2 font-serif text-xl font-bold tracking-wide text-amber-100 drop-shadow-[0_2px_15px_rgba(0,0,0,0.8)] sm:text-2xl">
          {m.displayName}
        </h3>
        <p className="mt-0.5 text-xs text-amber-200/70 font-sans">{m.role}</p>
        <p className="mt-2 font-serif text-xs italic text-amber-100/90 leading-snug">
          “{m.quote}”
        </p>
        <div className="mt-3 flex items-center justify-center gap-2 font-mono text-[9px] text-amber-300">
          <span className="h-1.5 w-1.5 rounded-full bg-amber-400 animate-pulse" />
          <span>{m.status ?? "HOLY // PATROL"}</span>
        </div>
      </div>
    </div>
  );
}

/* ── Hater: Desgarro VHS / Sinister Minds ─────────────────── */
function HaterCard({ m, t, copied, onCopy }: DossierProps) {
  return (
    <div className="relative flex h-full flex-col overflow-hidden border border-red-950 bg-black p-5 shadow-[0_0_20px_rgba(220,38,38,0.15)] transition-all duration-500 hover:border-red-600/70 hover:shadow-[0_0_40px_rgba(220,38,38,0.5)]">
      {/* Fondo fracturado */}
      <div className="absolute inset-0">
        <Image
          src="/images/members/hater/vinyl-cover.jpg"
          alt=""
          fill
          className="object-cover opacity-35 transition-transform duration-700 group-hover:scale-105"
        />
      </div>

      <span aria-hidden className="tv-static pointer-events-none absolute inset-0 opacity-45" />
      <span aria-hidden className="scanlines pointer-events-none absolute inset-0 opacity-50" />
      <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-black via-black/80 to-transparent" />

      <div className="relative flex items-center justify-between font-mono text-[9px] tracking-[0.3em] text-red-600">
        <span>ANALOG TAPE // CORRUPT</span>
        <DiscordChip slug={m.slug} copied={copied} onCopy={onCopy} />
      </div>

      <div className="relative mt-auto pt-4">
        <DossierAvatar slug={m.slug} />
        <h3 className="hater-name mt-2 font-serif text-3xl font-bold tracking-tight text-red-100 drop-shadow-[0_0_15px_rgba(220,38,38,0.8)] sm:text-4xl">
          {m.displayName}
        </h3>
        <p className="mt-1 text-xs text-red-400/80 font-mono">{m.role}</p>
        <p className="mt-3 border-l-2 border-red-600/80 pl-3 font-serif text-sm italic text-red-100/90 leading-snug">
          “{m.quote}”
        </p>
        <div className="mt-4 flex items-center justify-between font-mono text-[9px] tracking-wider text-red-500">
          <span>SINISTER MINDS</span>
          <span>{m.status ?? "ONLINE"}</span>
        </div>
      </div>
      <span aria-hidden className="gll-tear" />
    </div>
  );
}

/* ── STAR/K: Minimalismo Japonés y Kanji ─────────────────── */
function StarkCard({ m, t }: DossierProps) {
  return (
    <div className="relative flex h-full flex-col overflow-hidden bg-[#0a0a0c] border border-zinc-800 p-5 transition-colors duration-300 hover:border-zinc-500">
      {/* Kanji vertical gigante de fondo: 武士 (Bushido) */}
      <span
        aria-hidden
        className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 select-none font-serif text-7xl font-black text-white/[0.04]"
        style={{ writingMode: "vertical-rl" }}
      >
        武士
      </span>

      {/* Trazo horizontal de corte katana con hover */}
      <span
        aria-hidden
        className="pointer-events-none absolute left-0 top-1/2 h-[1.5px] w-full scale-x-0 bg-gradient-to-r from-transparent via-red-500/80 to-transparent transition-transform duration-700 group-hover:scale-x-100"
        style={{ transformOrigin: "left" }}
      />

      <div className="relative flex items-center justify-between font-mono text-[9px] tracking-[0.4em] text-zinc-500">
        <span>RONIN // STEEL</span>
        <span className="rounded border border-zinc-700 px-1.5 py-0.5 text-zinc-400">
          {t.tag}
        </span>
      </div>

      <div className="relative mt-auto pt-6">
        <div className="flex items-center gap-3">
          <DossierAvatar slug={m.slug} />
          <div>
            <h3 className="font-serif text-xl font-bold tracking-wider text-zinc-100">
              {m.displayName}
            </h3>
            <p className="text-xs text-zinc-400">{m.role}</p>
          </div>
        </div>

        <p className="mt-4 font-serif text-sm italic text-zinc-300">“{m.quote}”</p>
        <div className="mt-4 flex items-center justify-between font-mono text-[9px] text-zinc-500">
          <span>KATANA // DISCIPLINE</span>
          <span className="text-red-400">{m.status ?? "HONOR"}</span>
        </div>
      </div>
    </div>
  );
}

/* ── Nothing: Neo-brutalismo Deltarune ────────────────────── */
function NothingCard({ m, copied, onCopy }: DossierProps) {
  return (
    <div className="jitter-hover relative flex h-full flex-col border-2 border-yellow-400 bg-black p-4 shadow-[5px_5px_0px_#facc15] transition-all">
      {/* Cinta diagonal de peligro amarillo/negro */}
      <span
        aria-hidden
        className="block h-2.5 w-full"
        style={{
          backgroundImage: "repeating-linear-gradient(45deg, #facc15 0 8px, #000 8px 16px)",
        }}
      />

      {/* Banner Spamton */}
      <div className="relative mt-3 h-16 w-full overflow-hidden border border-yellow-300/50">
        <Image
          src="/images/members/nothing/banner.png"
          alt=""
          fill
          className="object-cover"
          style={{ imageRendering: "pixelated" }}
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent" />
      </div>

      <div className="mt-3 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <DossierAvatar slug={m.slug} />
          <div>
            <h3 className="font-mono text-xl font-black text-yellow-300 drop-shadow-[2px_2px_0_#713f12]">
              {m.displayName}
            </h3>
            <p className="font-mono text-[10px] text-yellow-200/70">{m.role}</p>
          </div>
        </div>
        <span className="inline-block -rotate-2 bg-yellow-400 px-1.5 py-0.5 font-mono text-[9px] font-black tracking-wider text-black">
          [100K KROMER]
        </span>
      </div>

      <div className="mt-3">
        <p className="font-mono text-xs font-bold text-yellow-100">“{m.quote}”</p>
      </div>

      <div className="mt-auto pt-3 flex items-center justify-between font-mono text-[9px] text-yellow-400/80">
        <DiscordChip slug={m.slug} copied={copied} onCopy={onCopy} />
        <span>{m.status ?? "SPAMTON.NET"}</span>
      </div>
    </div>
  );
}

/* ── Lolbit: Terminal Deconstruida Hacker ─────────────────── */
function LolbitCard({ m, t, copied, onCopy }: DossierProps) {
  return (
    <div className="lolbit-glitch relative flex h-full flex-col overflow-hidden border border-orange-500/40 bg-[#080506] p-5 transition-colors duration-300 hover:border-orange-400 hover:shadow-[0_0_30px_rgba(249,115,22,0.3)]">
      <span aria-hidden className="scanlines pointer-events-none absolute inset-0 opacity-35" />
      <span
        aria-hidden
        className="pointer-events-none absolute inset-0 opacity-20"
        style={{
          backgroundImage:
            "linear-gradient(rgba(249,115,22,0.1) 1px, transparent 1px), linear-gradient(90deg, rgba(249,115,22,0.1) 1px, transparent 1px)",
          backgroundSize: "24px 24px",
        }}
      />

      <div className="relative flex items-center justify-between font-mono text-[10px] tracking-widest text-orange-400">
        <span>◢ MASTER NODE // 0x7F</span>
        <div className="flex items-center gap-2">
          <DiscordChip slug={m.slug} copied={copied} onCopy={onCopy} />
          <span className="flex items-center gap-1 text-emerald-400 font-bold">
            <span className="h-1.5 w-1.5 rounded-full bg-emerald-400 animate-ping" />
            LIVE
          </span>
        </div>
      </div>

      <div className="relative mt-4 flex items-center gap-3">
        <DossierAvatar slug={m.slug} />
        <div>
          <h3 className="gll-aberration font-mono text-2xl font-black text-orange-100">
            {m.displayName}
          </h3>
          <p className="font-mono text-xs text-orange-400/80">{m.role}</p>
        </div>
      </div>

      {/* Cita como comando ejecutable */}
      <div className="relative mt-4 border border-orange-500/40 bg-black/80 px-3 py-2 font-mono">
        <span className="text-[10px] text-orange-500/70">$ exec </span>
        <span className="text-[11px] text-orange-200">“{m.quote}”</span>
      </div>

      {/* Mini ecualizador y frecuencia */}
      <div className="relative mt-auto pt-4">
        <div className="flex h-5 items-end gap-1" aria-hidden>
          {Array.from({ length: 16 }, (_, i) => (
            <span
              key={i}
              className="eq-mini w-full bg-orange-500/80"
              style={{ animationDelay: `${(i % 5) * 0.15}s` }}
            />
          ))}
        </div>
        <div className="mt-1 flex items-center justify-between font-mono text-[9px] tracking-wider text-orange-500/80">
          <span>FREQ // 84.2MHz</span>
          <span>{m.status ?? "SYS.ONLINE"}</span>
        </div>
      </div>
      <span aria-hidden className="gll-tear" />
    </div>
  );
}

/* ── Mangle Drake: Radar Táctico Rosa ────────────────────── */
function MangleCard({ m, t, copied, onCopy }: DossierProps) {
  return (
    <div className="relative flex h-full flex-col justify-between overflow-hidden border border-pink-500/30 bg-black/80 p-5 backdrop-blur-md transition-all duration-300 hover:border-pink-400 hover:shadow-[0_0_30px_rgba(236,72,153,0.35)]">
      {/* Fondo con rejilla táctica rosa sutil */}
      <span aria-hidden className="scanlines pointer-events-none absolute inset-0 opacity-25" />
      <span
        aria-hidden
        className="pointer-events-none absolute inset-0 opacity-15"
        style={{
          backgroundImage:
            "linear-gradient(rgba(236,72,153,0.15) 1px, transparent 1px), linear-gradient(90deg, rgba(236,72,153,0.15) 1px, transparent 1px)",
          backgroundSize: "20px 20px",
        }}
      />

      {/* Barra superior de telemetría */}
      <div className="relative flex items-center justify-between font-mono text-[9px] tracking-widest text-pink-400">
        <span>◢ KIDS&apos; COVE // RECON</span>
        <div className="flex items-center gap-2">
          <DiscordChip slug={m.slug} copied={copied} onCopy={onCopy} />
          <span className="flex items-center gap-1 font-bold text-pink-300">
            <span className="h-1.5 w-1.5 rounded-full bg-pink-400 animate-ping" />
            LIVE
          </span>
        </div>
      </div>

      {/* Contenido principal: Avatar + Nombre a la izq / Radar a la der */}
      <div className="relative my-auto flex items-center justify-between gap-4 pt-1">
        <div className="flex items-center gap-3.5 min-w-0">
          <div className="relative shrink-0">
            <DossierAvatar slug={m.slug} />
            <div className="pointer-events-none absolute -inset-1 rounded-full border border-pink-400/50 shadow-[0_0_10px_rgba(236,72,153,0.4)]" />
          </div>
          <div className="min-w-0">
            <h3 className="truncate font-sans text-2xl font-bold tracking-wide text-white drop-shadow-[0_0_12px_rgba(236,72,153,0.5)]">
              {m.displayName}
            </h3>
            <p className="truncate font-mono text-xs text-pink-300/80">{m.role}</p>
          </div>
        </div>

        {/* Radar táctico animado compacto */}
        <div className="flex shrink-0 flex-col items-center">
          <span
            className="relative block h-16 w-16 overflow-hidden rounded-full border border-pink-400/60 bg-black/70 shadow-[0_0_15px_rgba(236,72,153,0.25)]"
            aria-hidden
          >
            <span className="radar-sweep absolute inset-0" />
            <span className="absolute left-1/2 top-1/2 h-1.5 w-1.5 -translate-x-1/2 -translate-y-1/2 rounded-full bg-pink-200 shadow-[0_0_8px_#ec4899]" />
            <span className="absolute inset-x-0 top-1/2 h-px -translate-y-1/2 bg-pink-400/30" />
            <span className="absolute inset-y-0 left-1/2 w-px -translate-x-1/2 bg-pink-400/30" />
          </span>
          <span className="mt-1 font-mono text-[8px] tracking-widest text-pink-400/90 uppercase">
            RADAR // CAM_12
          </span>
        </div>
      </div>

      {/* Cita táctica */}
      <div className="relative my-1 border-l-2 border-pink-500/60 bg-pink-950/20 px-3 py-1.5">
        <p className="font-serif text-xs italic text-pink-100/90 leading-snug">
          “{m.quote}”
        </p>
      </div>

      {/* Barra inferior de estado */}
      <div className="relative flex items-center justify-between font-mono text-[9px] tracking-wider text-pink-400/80">
        <span>TARGET // ACQUIRED</span>
        <span>{m.status ?? "CAM_12 ACTIVE"}</span>
      </div>
    </div>
  );
}

/* ── Darky: Retrato Abisal VHS ───────────────────────────── */
function DarkyCard({ m, copied, onCopy }: DossierProps) {
  return (
    <div className="relative flex h-full flex-col overflow-hidden border border-red-900/60 bg-[#0c0406] p-4 transition-colors hover:border-red-600/70">
      <div className="absolute inset-0">
        <Image
          src="/images/members/Darky/avatar.jpg"
          alt=""
          fill
          className="object-cover opacity-25 grayscale transition-transform duration-700 group-hover:scale-105"
        />
      </div>
      <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-black via-black/80 to-transparent" />

      {/* Ascuas flotantes */}
      {EMBERS.map((e, idx) => (
        <span
          key={idx}
          className="gll-ember"
          style={
            {
              left: `${e.left}%`,
              "--dur": `${e.dur}s`,
              "--delay": `${e.delay}s`,
            } as React.CSSProperties
          }
        />
      ))}

      <div className="relative flex items-center justify-between font-mono text-[9px] text-rose-400">
        <span>ABYSSAL SPECTRAL</span>
        <DiscordChip slug={m.slug} copied={copied} onCopy={onCopy} />
      </div>

      <div className="relative mt-auto pt-4">
        <DossierAvatar slug={m.slug} />
        <h3 className="mt-2 font-serif text-2xl font-bold text-rose-100">DARKY</h3>
        <p className="text-xs text-rose-300/70 font-mono">{m.role}</p>
        <p className="mt-2 font-serif text-xs italic text-rose-200/90">“{m.quote}”</p>
        <div className="mt-3 font-mono text-[9px] text-rose-400/80">
          {m.status ?? "NO SIGNAL"}
        </div>
      </div>
    </div>
  );
}

/* ── Dramatic: Ethereal Sky Drift ────────────────────────── */
function DramaticCard({ m, t }: DossierProps) {
  return (
    <div className="relative flex h-full flex-col justify-between overflow-hidden border border-sky-500/30 bg-gradient-to-b from-sky-950/30 via-black/80 to-black p-5 transition-all duration-300 hover:border-sky-400 hover:shadow-[0_0_25px_rgba(56,189,248,0.25)]">
      <div className="absolute inset-0">
        <Image
          src="/images/members/dramatic/street.jpeg"
          alt=""
          fill
          className="object-cover opacity-20 transition-transform duration-700 group-hover:scale-105"
        />
      </div>

      <div className="relative flex items-center justify-between font-mono text-[9px] text-sky-400">
        <span>ETHEREAL // SKY</span>
        <span className="rounded border border-sky-400/30 bg-sky-400/10 px-1.5 py-0.5">
          {t.tag}
        </span>
      </div>

      <div className="relative my-auto flex items-center gap-3.5 pt-2">
        <DossierAvatar slug={m.slug} />
        <div className="min-w-0">
          <h3 className="truncate font-sans text-2xl font-bold tracking-wide text-sky-100">
            {m.displayName}
          </h3>
          <p className="truncate font-mono text-xs text-sky-300/70">{m.role}</p>
        </div>
      </div>

      <p className="relative my-1 font-serif text-xs italic text-sky-200 leading-snug">
        “{m.quote}”
      </p>

      {/* Ecualizador cian a lo ancho */}
      <div className="relative mt-2">
        <div className="flex h-5 items-end gap-1" aria-hidden>
          {Array.from({ length: 24 }, (_, i) => (
            <span
              key={i}
              className="eq-mini w-full bg-sky-400/80"
              style={{ animationDelay: `${i * 0.08}s` }}
            />
          ))}
        </div>
        <div className="mt-1 flex items-center justify-between font-mono text-[9px] text-sky-400/80">
          <span>AUDIO SYNC // ANALOG DRIFT</span>
          <span>{m.status ?? "ONLINE"}</span>
        </div>
      </div>
    </div>
  );
}

/* ── Darth10: Otaku Specialist ───────────────────────────── */
function DarthCard({ m, t }: DossierProps) {
  return (
    <div className="relative flex h-full flex-col justify-between overflow-hidden border border-cyan-500/30 bg-[#040c12] p-5 transition-all duration-300 hover:border-cyan-400 hover:shadow-[0_0_25px_rgba(6,182,212,0.25)]">
      <div className="relative flex items-center justify-between font-mono text-[9px] text-cyan-400">
        <span>CONSOLE HUD // ANIME SPECIALIST</span>
        <span className="rounded border border-cyan-400/30 bg-cyan-400/10 px-1.5 py-0.5">
          {t.tag}
        </span>
      </div>

      <div className="relative my-auto flex items-center gap-3.5 pt-2">
        <DossierAvatar slug={m.slug} />
        <div className="min-w-0">
          <h3 className="truncate font-mono text-2xl font-bold tracking-wide text-cyan-100">
            {m.displayName}
          </h3>
          <p className="truncate font-mono text-xs text-cyan-400/80">{m.role}</p>
        </div>
      </div>

      <div className="relative my-1 border-l-2 border-cyan-500/50 bg-cyan-950/20 px-3 py-1.5">
        <p className="font-mono text-xs text-cyan-200">“{m.quote}”</p>
      </div>

      <div className="relative mt-2 flex items-center justify-between font-mono text-[9px] text-cyan-400">
        <span className="flex items-center gap-1.5">
          <span className="h-1.5 w-1.5 rounded-full bg-cyan-400 animate-pulse" />
          <span>STATUS: AFK // LUCKY STARS</span>
        </span>
        <span>{m.status ?? "AFK"}</span>
      </div>
    </div>
  );
}

/* ── Sleepy: Alt Grunge .EXE ─────────────────────────────── */
function SleepyCard({ m, t }: DossierProps) {
  return (
    <div className="relative flex h-full flex-col overflow-hidden border-2 border-red-900 bg-[#120709] transition hover:border-red-600">
      {/* Fondo viñeta / cómic ilustrado */}
      <div className="absolute inset-0">
        <Image
          src="/images/members/sleepy/comic-strip.jpg"
          alt=""
          fill
          className="object-cover opacity-20 grayscale transition-transform duration-700 group-hover:scale-105"
        />
      </div>
      <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-[#120709] via-[#120709]/80 to-transparent" />

      {/* Barra de ventana retro .exe */}
      <div className="relative flex items-center justify-between bg-gradient-to-r from-red-900 to-[#3b0808] px-2.5 py-1 text-[10px] font-bold text-red-100 select-none">
        <span>sleepy.exe</span>
        <div className="flex gap-1" aria-hidden>
          <span className="border border-red-400/40 px-1 text-[8px]">_</span>
          <span className="border border-red-400/40 px-1 text-[8px]">□</span>
          <span className="border border-red-400/40 px-1 text-[8px]">✕</span>
        </div>
      </div>

      <div className="relative flex flex-1 flex-col p-4">
        <div className="flex items-center gap-3">
          <DossierAvatar slug={m.slug} />
          <div>
            <h3 className="font-sans text-lg font-bold text-stone-100">{m.displayName}</h3>
            <p className="text-xs text-stone-400 font-mono">{m.role}</p>
          </div>
        </div>

        <p className="mt-3 font-serif text-xs italic text-stone-200 leading-relaxed">
          “{m.quote}”
        </p>

        <div className="mt-auto pt-3 flex items-center justify-between font-mono text-[9px] text-red-400">
          <span>{t.tag}</span>
          <span>{m.status ?? "ONLINE"}</span>
        </div>
      </div>
    </div>
  );
}

/* ══════════════════════════════════════════════════════════════
   COMPONENTE PRINCIPAL: HOME
   ══════════════════════════════════════════════════════════════ */
export default function Home() {
  const [mounted, setMounted] = useState(false);
  const [isPlaying, setIsPlaying] = useState(true);
  const [progress, setProgress] = useState(30);
  const [isMuted, setIsMuted] = useState(false);
  const [filter, setFilter] = useState<"ALL" | Faction>("ALL");
  const [query, setQuery] = useState("");
  const [copied, setCopied] = useState<string | null>(null);
  const [hovered, setHovered] = useState<string | null>(null);

  useEffect(() => {
    setMounted(true);
  }, []);

  // Avance automático en loop de la barra de reproducción
  useEffect(() => {
    if (!isPlaying) return;
    const timer = setInterval(() => {
      setProgress((prev) => {
        if (prev >= 100) return 0;
        return prev + 0.6;
      });
    }, 250);
    return () => clearInterval(timer);
  }, [isPlaying]);

  // Reordenamiento del Roster para Bento Grid de 4 filas x 4 columnas exactas:
  // Fila 1 (4 cols): Lolbit (2 cols) + Nothing (2 cols)
  // Fila 2 (4 cols): Valkiria (1 col) + Sleepy (1 col) + Hater (2 cols)
  // Fila 3 (4 cols): Mangle Drake (2 cols) + STAR/K (1 col) + Darky (1 col)
  // Fila 4 (4 cols): Dramatic (2 cols) + Darth.10 (2 cols)
  const ORDERED_SLUGS = [
    "lolbit",
    "nothing",
    "valkiria",
    "sleepy",
    "hater",
    "mangle",
    "stark",
    "darky",
    "dramatic",
    "darth10",
  ];

  const roster = [
    ...ORDERED_SLUGS.map((slug) =>
      members.find((m) => m.slug === slug || (slug === "mangle" && m.slug === "mangle-drake"))
    ).filter(Boolean) as Member[],
    ...members.filter(
      (m) => !ORDERED_SLUGS.includes(m.slug) && m.slug !== "mangle-drake"
    ),
  ];

  const matches = (m: Member) => {
    const factionOk = filter === "ALL" || FACTIONS[m.slug] === filter;
    const q = query.trim().toLowerCase();
    const queryOk =
      q === "" || `${m.displayName} ${m.role}`.toLowerCase().includes(q);
    return factionOk && queryOk;
  };
  const filtered = roster.filter(matches);

  const copyDiscord = async (e: React.MouseEvent, slug: string) => {
    e.preventDefault();
    e.stopPropagation();
    const tag = DISCORD_TAGS[slug];
    if (!tag) return;
    try {
      await navigator.clipboard.writeText(tag);
      setCopied(slug);
      setTimeout(() => setCopied((c) => (c === slug ? null : c)), 2000);
    } catch {
      /* Portapapeles no disponible */
    }
  };

  const renderDossierCard = (m: Member) => {
    const t = themeFor(m.slug);
    const base = { m, t, copied, onCopy: copyDiscord };

    switch (m.slug) {
      case "valkiria":
        return <ValkiriaCard {...base} />;
      case "hater":
        return <HaterCard {...base} />;
      case "stark":
        return <StarkCard {...base} />;
      case "nothing":
        return <NothingCard {...base} />;
      case "lolbit":
        return <LolbitCard {...base} />;
      case "mangle":
      case "mangle-drake":
        return <MangleCard {...base} />;
      case "darky":
        return <DarkyCard {...base} />;
      case "dramatic":
        return <DramaticCard {...base} />;
      case "darth10":
        return <DarthCard {...base} />;
      case "sleepy":
        return <SleepyCard {...base} />;
      default:
        return <LolbitCard {...base} />;
    }
  };

  const cardSpan = (slug: string) => {
    // Tarjetas de 2 columnas: Lolbit, Nothing, Hater, Mangle, Dramatic, Darth10
    if (
      slug === "lolbit" ||
      slug === "nothing" ||
      slug === "hater" ||
      slug === "mangle" ||
      slug === "mangle-drake" ||
      slug === "dramatic" ||
      slug === "darth10"
    ) {
      return "col-span-1 sm:col-span-2 lg:col-span-2";
    }
    // Tarjetas de 1 columna: Valkiria, Sleepy, Stark, Darky
    return "col-span-1";
  };

  return (
    <div className="flex min-h-screen flex-1 flex-col bg-[#050507] text-neutral-200">
      <style>{FX_STYLES}</style>

      {/* ── Atmósfera líquida orgánica difusa (carmesí y azul profundo) ── */}
      <div
        aria-hidden
        className="pointer-events-none fixed inset-0 z-0"
        style={{
          background: `
            radial-gradient(circle at 18% 22%, rgba(220, 38, 38, 0.13) 0%, rgba(127, 29, 29, 0.04) 45%, transparent 70%),
            radial-gradient(circle at 82% 35%, rgba(30, 58, 138, 0.17) 0%, rgba(15, 23, 42, 0.05) 50%, transparent 75%),
            radial-gradient(circle at 50% 65%, rgba(147, 51, 234, 0.08) 0%, transparent 60%),
            radial-gradient(ellipse at center, transparent 35%, rgba(5, 5, 7, 0.95) 100%)
          `,
        }}
      />

      {/* Motas de polvo estelar orgánicas */}
      <div aria-hidden className="pointer-events-none fixed inset-0 z-0 overflow-hidden">
        {DUST_MOTES.map((d, i) => (
          <span
            key={i}
            className="dust-mote"
            style={{
              top: d.top,
              left: d.left,
              width: `${d.size}px`,
              height: `${d.size}px`,
              opacity: d.opacity,
              animationDuration: d.dur,
              animationDelay: d.delay,
              boxShadow: `0 0 ${d.size * 2}px rgba(255, 255, 255, 0.6), 0 0 ${d.size * 4}px rgba(220, 38, 38, 0.4)`,
            }}
          />
        ))}
      </div>
      <ParticlesBackground className="pointer-events-none fixed inset-0 z-0 h-full w-full opacity-20" />

      {/* ── 1. TABLÓN DEL MANIFIESTO GLL (WELCOME BOARD) ──────── */}
      <GllWelcomeBoard />

      {/* ── 2. REPRODUCTOR RETRO WMP (PIEZA DE TRANSICIÓN) ───── */}
      <RetroWmpHero
        isPlaying={isPlaying}
        setIsPlaying={setIsPlaying}
        progress={progress}
        setProgress={setProgress}
        isMuted={isMuted}
        setIsMuted={setIsMuted}
      />

      {/* ── 3. SECCIÓN INFERIOR: EL ROSTER AUTÉNTICO ─────────── */}
      <section className="relative z-10 mx-auto mt-16 w-full max-w-7xl px-4 py-8 sm:px-6">
        {/* Título Separador y Cabecera Técnica */}
        <div className="text-center">
          <div className="inline-block border-y border-red-600/40 py-2">
            <h2 className="font-mono text-xl font-black tracking-widest text-zinc-100 sm:text-2xl lg:text-3xl">
              [ ✦ OPERATIVES &amp; FOUNDERS // THE ROSTER ✦ ]
            </h2>
          </div>
          <p className="mt-3 font-mono text-[11px] tracking-[0.3em] text-zinc-400">
            CENTRAL ARCHIVE // SELECT OPERATIVE DOSSIER FOR BIOMETRIC TELEMETRY
          </p>
        </div>

        {/* Filtro táctico de facción y búsqueda */}
        <div className="mt-8 flex flex-wrap items-center justify-between gap-3 border-y border-white/10 py-3">
          {/* Botones de facción */}
          <div className="flex flex-wrap items-center gap-2">
            {FILTERS.map((f) => (
              <button
                key={f}
                onClick={() => setFilter(f)}
                className={`border px-3 py-1.5 font-mono text-[10px] tracking-[0.2em] transition ${
                  filter === f
                    ? "border-red-600 bg-red-600/20 text-white shadow-[0_0_12px_rgba(220,38,38,0.4)]"
                    : "border-white/10 bg-white/5 text-zinc-400 hover:border-white/30 hover:text-white"
                }`}
              >
                {f}
              </button>
            ))}
          </div>

          {/* Campo de búsqueda y contador */}
          <div className="flex flex-1 items-center justify-end gap-3 sm:flex-initial">
            <input
              type="text"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="FILTRAR // nombre, rol…"
              aria-label="Buscar integrantes"
              className="w-full sm:w-64 border border-white/10 bg-white/5 px-3 py-1.5 font-mono text-xs text-zinc-200 outline-none transition focus:border-red-500"
            />
            <span className="shrink-0 font-mono text-[10px] tracking-wider text-zinc-400">
              [<strong className="text-red-400">{filtered.length}</strong>/{roster.length}]
            </span>
          </div>
        </div>

        {/* Grid de Roster con enlaces a /gll/[slug] */}
        <div className="mt-8 grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4 auto-rows-[280px]">
          {filtered.map((m) => (
            <Link
              key={m.slug}
              href={`/gll/${m.slug}`}
              className={`group block h-full w-full ${cardSpan(m.slug)}`}
              onMouseEnter={() => setHovered(m.slug)}
              onMouseLeave={() => setHovered(null)}
            >
              {renderDossierCard(m)}
            </Link>
          ))}
        </div>

        {filtered.length === 0 && (
          <div className="mt-12 rounded-xl border border-dashed border-white/10 p-12 text-center font-mono text-xs tracking-widest text-zinc-500">
            NO OPERATIVES MATCH CURRENT FILTER // RESTABLECE LA BÚSQUEDA
          </div>
        )}
      </section>

      {/* ── FOOTER ───────────────────────────────────────────── */}
      <footer className="relative z-10 mt-20 border-t border-white/10 bg-black/60 py-8 text-center font-mono text-[10px] tracking-[0.25em] text-zinc-500">
        <p>© {mounted ? new Date().getFullYear() : "2026"} GLL — Gods Live Longer™ // SECTOR ZERO</p>
        <p className="mt-1 text-[9px] text-zinc-600">
          ALL OPERATIVES DEPLOYED // PERMISSION LEVEL: PUBLIC BROADCAST
        </p>
      </footer>
    </div>
  );
}
