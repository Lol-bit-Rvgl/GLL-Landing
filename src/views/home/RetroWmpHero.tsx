"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import {
  Play,
  Pause,
  Square,
  SkipBack,
  SkipForward,
  Volume2,
  VolumeX,
} from "lucide-react";
import { PROGRESS_CONFIG } from "./home-styles";

/**
 * RETRO WMP HERO - Transmisión GLL
 *
 * Reproductor de fondo que ahora sirve como punto de entrada narrativo.
 * Se siente como un terminal de transmisión de señal, no como una ventana Windows.
 */
export function RetroWmpHero() {
  const [isPlaying, setIsPlaying] = useState(true);
  const [progress, setProgress] = useState(30);
  const [isMuted, setIsMuted] = useState(false);

  // Avance automático en loop
  useEffect(() => {
    if (!isPlaying) return;
    const timer = setInterval(() => {
      setProgress((prev) => {
        if (prev >= 100) return 0;
        return prev + 0.6;
      });
    }, PROGRESS_CONFIG.tickInterval);
    return () => clearInterval(timer);
  }, [isPlaying]);

  const totalSeconds = PROGRESS_CONFIG.totalSeconds;
  const currentSeconds = Math.floor((progress / 100) * totalSeconds);
  const fmt = (s: number) => {
    const mins = Math.floor(s / 60);
    const secs = s % 60;
    return `${mins.toString().padStart(2, "0")}:${secs.toString().padStart(2, "0")}`;
  };

  return (
    <section className="relative mx-auto mt-16 mb-20 w-full max-w-2xl px-4 select-none">
      {/* Contenedor principal del transmisor */}
      <div className="relative overflow-hidden rounded-t-xl rounded-b-xl border-2 border-[#003c9c] shadow-[0_15px_50px_rgba(0,0,0,0.8),0_0_35px_rgba(0,85,234,0.25)]">
        {/* Barra de Título del Transmisor - estilo Azul Cian */}
        <div
          className="relative flex h-8 items-center justify-between px-3 select-none"
          style={{
            background:
              "linear-gradient(180deg, #0058e6 0%, #3a93ff 8%, #0055ea 40%, #0044cc 88%, #0033aa 100%)",
            borderBottom: "1px solid #002277",
          }}
        >
          {/* Brillo especular superior */}
          <div className="pointer-events-none absolute inset-x-0 top-0 h-[2px] bg-white/40" />

          {/* Icono de Señal y Título */}
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
              GLL Transmission Terminal // God&apos;s Live Longer.™
            </span>
          </div>

          {/* Botones de Control de Señal */}
          <div className="flex items-center gap-1">
            <button
              title="Preparar Señal"
              className="flex h-5 w-5 items-center justify-center rounded-[3px] border border-white/40 bg-gradient-to-b from-[#3a93ff] to-[#0044cc] text-[10px] font-bold text-white shadow-sm transition hover:brightness-125"
            >
              ⌘
            </button>
            <button
              title="Maximizar Señal"
              className="flex h-5 w-5 items-center justify-center rounded-[3px] border border-white/40 bg-gradient-to-b from-[#3a93ff] to-[#0044cc] text-[9px] text-white shadow-sm transition hover:brightness-125"
            >
              □
            </button>
            <button
              title="Cerrar Transmisión"
              className="flex h-5 w-5 items-center justify-center rounded-[3px] border border-white/40 bg-gradient-to-b from-[#ff6b6b] via-[#e81123] to-[#b30917] text-[10px] font-black text-white shadow-sm transition hover:brightness-125"
            >
              ✕
            </button>
          </div>
        </div>

        {/* Menú del Transmisor */}
        <div className="flex items-center gap-4 border-b border-[#aca899] bg-[#ede9d8] px-3 py-1 text-xs font-sans text-neutral-800 select-none">
          <span className="cursor-default rounded-sm px-1.5 py-0.5 hover:bg-[#316ac5] hover:text-white">
            <span className="underline">F</span>ile
          </span>
          <span className="cursor-default rounded-sm px-1.5 py-0.5 hover:bg-[#316ac5] hover:text-white">
            <span className="underline">V</span>iew
          </span>
          <span className="cursor-default rounded-sm px-1.5 py-0.5 hover:bg-[#316ac5] hover:text-white">
            <span className="underline">T</span>ransponder
          </span>
        </div>

        {/* Contenido del Transmisor */}
        <div className="relative flex aspect-[16/9] max-h-[340px] w-full items-center justify-center overflow-hidden border-x-2 border-[#121620] bg-black sm:aspect-[21/9]">
          {/* Imagen de transmisión */}
          <div className="absolute inset-0 overflow-hidden">
            <Image
              src="/images/gll-player.jpg"
              alt="GLL Signal Visualizer"
              fill
              priority
              className={`scale-[1.75] object-cover object-center transition-transform duration-1000 ${
                isPlaying ? "brightness-110" : "opacity-80"
              }`}
            />
          </div>

          {/* Scanlines sutiles */}
          <div aria-hidden className="scanlines pointer-events-none absolute inset-0 opacity-30" />
          <div
            aria-hidden
            className="pointer-events-none absolute inset-0 bg-radial from-transparent via-black/30 to-black/90"
          />

          {/* Estrella central de transmisión */}
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

          {/* Badge de estado superior izquierdo */}
          <div className="absolute left-3 top-3 flex items-center gap-2 rounded bg-black/80 px-2.5 py-1 font-mono text-[10px] tracking-wider backdrop-blur-sm border border-white/10">
            <span className="relative flex h-2 w-2">
              <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-emerald-400 opacity-75" />
              <span className="relative inline-flex h-2 w-2 rounded-full bg-emerald-500" />
            </span>
            <span className="font-bold text-emerald-400">
              {isPlaying ? "● TRANSMITTING" : "● TRANSMISSION READY"}
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

        {/* Barra de Control del Transmisor */}
        <div
          className="relative border-t border-sky-400/40 p-3 sm:p-4 select-none"
          style={{
            background:
              "linear-gradient(180deg, #2b61b8 0%, #1a4da3 30%, #123d88 70%, #0d2f6d 100%)",
          }}
        >
          {/* Estado del transmisor */}
          <div className="mb-3 flex flex-wrap items-center justify-between gap-2 rounded-sm border border-[#04280f] bg-[#001407] px-3 py-1.5 font-mono shadow-[inset_0_2px_4px_rgba(0,0,0,0.8)]">
            <div className="flex items-center gap-2">
              <span
                className={`h-2 w-2 rounded-full ${
                  isPlaying ? "bg-emerald-400 shadow-[0_0_8px_#34d399] animate-pulse" : "bg-emerald-800"
                }`}
              />
              <span className="text-[11px] font-bold tracking-wider text-emerald-300">
                {isPlaying ? "● TRANSMITTING // GLL ANTHEM" : "STANDBY MODE"}
              </span>
            </div>
            <div className="text-[11px] font-bold tracking-widest text-emerald-400">
              {fmt(currentSeconds)} / {fmt(totalSeconds)}
            </div>
          </div>

          {/* Barra de progreso */}
          <div className="mb-3 flex items-center gap-2">
            <div
              onClick={(e) => {
                const rect = e.currentTarget.getBoundingClientRect();
                const clickX = e.clientX - rect.left;
                const newProgress = Math.max(0, Math.min(100, (clickX / rect.width) * 100));
                setProgress(newProgress);
              }}
              className="relative h-2 w-full cursor-pointer rounded-full border border-[#09224f] bg-[#0c244d] shadow-[inset_0_1px_2px_rgba(0,0,0,0.7)]"
            >
              {/* Relleno */}
              <div
                className="h-full rounded-full bg-gradient-to-r from-sky-400 to-[#38bdf8]"
                style={{ width: `${progress}%` }}
              />
              {/* Knob */}
              <div
                className="absolute top-1/2 -ml-2 h-4 w-4 -translate-y-1/2 rounded-full border border-[#092960] bg-gradient-to-b from-[#7ebbff] to-[#1c64d9] shadow-[0_1px_3px_rgba(0,0,0,0.6)] hover:scale-110"
                style={{ left: `${progress}%` }}
              />
            </div>
          </div>

          {/* Controles del transmisor */}
          <div className="flex flex-wrap items-center justify-between gap-3">
            <div className="flex items-center gap-2 sm:gap-3">
              {/* Prev */}
              <button
                onClick={() => setProgress(0)}
                title="Pista anterior"
                className="flex h-7 w-7 items-center justify-center rounded-full border border-[#092960] bg-gradient-to-b from-[#4d86d6] via-[#1a5cb8] to-[#0d3b84] text-white shadow-sm transition hover:brightness-115 active:translate-y-px"
              >
                <SkipBack className="h-3.5 w-3.5" />
              </button>

              {/* Play/Pause */}
              <button
                onClick={() => setIsPlaying((p) => !p)}
                title={isPlaying ? "Pausar" : "Reproducir"}
                className="relative flex h-11 w-11 items-center justify-center rounded-full border-2 border-[#092960] bg-gradient-to-b from-[#6ba3f5] via-[#2463c7] to-[#0e3b85] text-white shadow-[inset_0_2px_4px_rgba(255,255,255,0.7),0_3px_6px_rgba(0,0,0,0.6)] transition-all hover:scale-105 active:scale-95"
              >
                <div className="pointer-events-none absolute inset-x-1 top-0.5 h-3 rounded-t-full bg-white/40" />
                {isPlaying ? <Pause className="h-5 w-5 fill-white" /> : <Play className="ml-0.5 h-5 w-5 fill-white" />}
              </button>

              {/* Stop */}
              <button
                onClick={() => {
                  setIsPlaying(false);
                  setProgress(0);
                }}
                title="Detener"
                className="flex h-7 w-7 items-center justify-center rounded-full border border-[#092960] bg-gradient-to-b from-[#4d86d6] via-[#1a5cb8] to-[#0d3b84] text-white shadow-sm transition hover:brightness-115 active:translate-y-px"
              >
                <Square className="h-3 w-3 fill-white" />
              </button>

              {/* Next */}
              <button
                onClick={() => setProgress(100)}
                title="Siguiente pista"
                className="flex h-7 w-7 items-center justify-center rounded-full border border-[#092960] bg-gradient-to-b from-[#4d86d6] via-[#1a5cb8] to-[#0d3b84] text-white shadow-sm transition hover:brightness-115 active:translate-y-px"
              >
                <SkipForward className="h-3.5 w-3.5" />
              </button>
            </div>

            {/* Volumen */}
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