"use client";

import { useState, useEffect, useCallback, useRef } from "react";
import type { Member } from "@/data/members";
import { Cormorant_Garamond } from "next/font/google";
import { ArrowLeft, Play, Pause } from "lucide-react";

const cormorant = Cormorant_Garamond({
  subsets: ["latin"],
  weight: ["300", "400", "600", "700"],
  style: ["normal", "italic"],
  display: "swap",
});

const FX_STYLES = `
@keyframes pulse-glow {
  0%, 100% { opacity: 0.5; transform: scale(1); }
  50% { opacity: 0.8; transform: scale(1.05); }
}
@keyframes fade-in-up {
  from { opacity: 0; transform: translateY(16px); }
  to { opacity: 1; transform: translateY(0); }
}
.pulse-glow { animation: pulse-glow 4s ease-in-out infinite; }
.fade-in-up {
  animation: fade-in-up 0.8s ease-out both;
}
.fade-in-up-d1 { animation-delay: 0.15s; }
.fade-in-up-d2 { animation-delay: 0.3s; }
.fade-in-up-d3 { animation-delay: 0.45s; }
`;

const TEXTO_UNO = [
  "No sé si el destino existe,",
  "pero si es así,",
  "espero que vuelva a ponerte en mi camino.",
];

const POEM_STROPHE = [
  "A veces pienso que el destino es una cosa bien rara,",
  "uno se va por un lado y el otro por la otra esfera,",
  "después de tanto tiempo me encuentro otra vez contigo,",
  "sin pensarlo ni esperarlo, sin buscarlo, sin quererlo.",
  "",
  "y si algún día pasa solo sé que fue por pura suerte,",
  "porque a pesar de la distancia no pude dejarte de ver.",
  "",
  "yo solo sé que si el tiempo pudiera retroceder,",
  "habría hecho las cosas bien, por fin te encontré.",
  "",
  "no era por orgullo, era más bien por timidez,",
  "pero la soledad no es buena consejera en verdad.",
  "",
  "Y si algún día pasa... solo espero no volver a olvidarte.",
];

const CLOCK_MARKS: { angle: number; label: string | null; x: number; y: number }[] = [
  { angle: 0, label: "XII", x: 50, y: 8 },
  { angle: 30, label: null, x: 72.5, y: 11.03 },
  { angle: 60, label: null, x: 88.97, y: 27.5 },
  { angle: 90, label: "III", x: 92, y: 50 },
  { angle: 120, label: null, x: 88.97, y: 72.5 },
  { angle: 150, label: null, x: 72.5, y: 88.97 },
  { angle: 180, label: "VI", x: 50, y: 92 },
  { angle: 210, label: null, x: 27.5, y: 88.97 },
  { angle: 240, label: null, x: 11.03, y: 72.5 },
  { angle: 270, label: "IX", x: 8, y: 50 },
  { angle: 300, label: null, x: 11.03, y: 27.5 },
  { angle: 330, label: null, x: 27.5, y: 11.03 },
];

export function DramaticProfile({ member }: { member: Member }) {
  const [now, setNow] = useState(() => new Date());
  const [mounted, setMounted] = useState(false);
  const [playing, setPlaying] = useState(false);
  const audioRef = useRef<HTMLAudioElement | null>(null);

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    const id = setInterval(() => setNow(new Date()), 1000);
    return () => clearInterval(id);
  }, []);

  useEffect(() => {
    const a = new Audio("/images/members/dramatic/track.mp3");
    a.loop = true;
    a.volume = 0.35;
    audioRef.current = a;
    return () => {
      a.pause();
      a.src = "";
    };
  }, []);

  const toggleMusic = useCallback(() => {
    const a = audioRef.current;
    if (!a) return;
    if (playing) {
      a.pause();
    } else {
      a.play().catch(() => {});
    }
    setPlaying((p) => !p);
  }, [playing]);

  const handleSecret = useCallback(async () => {
    try {
      const res = await fetch("/images/members/dramatic/street.jpeg");
      const blob = await res.blob();
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = "Nada_por_Aqui.jpeg";
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
    } catch {
      window.open("/images/members/dramatic/street.jpeg", "_blank");
    }
  }, []);

  const hours = now.getHours();
  const minutes = now.getMinutes();
  const seconds = now.getSeconds();
  const ampm = hours >= 12 ? "PM" : "AM";
  const hourRot = (hours % 12 + minutes / 60) * 30;
  const minRot = (minutes + seconds / 60) * 6;
  const secRot = seconds * 6;

  const renderLine = (line: string, i: number) => {
    if (line === "") return <br key={i} />;

    if (line.includes("por fin te encontré")) {
      const parts = line.split("por fin te encontré");
      return (
        <span key={i} className="block leading-relaxed">
          {parts[0]}
          <button
            onClick={handleSecret}
            className="cursor-pointer border-b border-sky-300/60 text-sky-300 italic transition-colors hover:border-sky-200 hover:text-sky-100"
            title="Algo se esconde aquí..."
          >
            por fin te encontré
          </button>
          {parts[1] ?? ""}
        </span>
      );
    }

    return (
      <span key={i} className="block leading-relaxed">
        {line}
      </span>
    );
  };

  return (
    <main
      className={`relative min-h-screen overflow-x-hidden bg-[#060e1a] text-white ${cormorant.className}`}
    >
      <style>{FX_STYLES}</style>

      {/* ── Capa 0: fondo completo ──────────────────────── */}
      <div className="pointer-events-none fixed inset-0 z-0 overflow-hidden bg-black">
        <img
          src="/images/members/dramatic/bg.jpeg"
          alt=""
          className="h-full w-full object-cover object-center select-none"
          loading="eager"
        />
      </div>

      {/* ── Capa 1: tinte azul suave ────────────────────── */}
      <div
        aria-hidden
        className="pointer-events-none fixed inset-0 z-[1]"
        style={{
          background:
            "linear-gradient(180deg, rgba(56,189,248,0.08) 0%, rgba(6,14,26,0.55) 60%, rgba(6,14,26,0.88) 100%)",
        }}
      />

      {/* ── Capa 2: viñeta delicada ─────────────────────── */}
      <div
        aria-hidden
        className="pointer-events-none fixed inset-0 z-[2]"
        style={{
          background:
            "radial-gradient(ellipse at center, transparent 45%, rgba(6,14,26,0.7) 100%)",
        }}
      />

      {/* ── Barra superior ─────────────────────────────── */}
      <header className="fixed left-0 right-0 top-0 z-40 flex items-center justify-between px-5 py-3 sm:px-8 sm:py-4">
        <a
          href="/"
          className="group flex items-center gap-1.5 rounded-full border border-sky-400/25 bg-[#060e1a]/60 px-3 py-1.5 text-[11px] font-semibold uppercase tracking-widest text-sky-300/80 backdrop-blur-md transition-all hover:border-sky-400/50 hover:text-sky-200"
        >
          <ArrowLeft className="size-3 transition-transform duration-200 group-hover:-translate-x-0.5" />
          Inicio
        </a>

        <div className="flex items-center gap-3">
          {/* ── Reloj analógico circular ──────────────── */}
          <div className="relative flex h-24 w-24 shrink-0 items-center justify-center rounded-full border border-sky-300/40 bg-sky-950/30 shadow-[0_0_25px_rgba(56,189,248,0.2)] backdrop-blur-md md:h-28 md:w-28">
            {/* aro interior */}
            <div className="absolute inset-[7%] rounded-full border border-sky-400/15" />

            {/* marcas horarias (posiciones estáticas precalculadas) */}
            <div className="absolute inset-0">
              {CLOCK_MARKS.map((m) => (
                <div
                  key={m.angle}
                  className="absolute"
                  style={{
                    left: `${m.x}%`,
                    top: `${m.y}%`,
                    transform: "translate(-50%, -50%)",
                  }}
                >
                  {m.label ? (
                    <span className="font-serif text-[8px] font-semibold tracking-wide text-sky-300/80">
                      {m.label}
                    </span>
                  ) : (
                    <span className="block h-1.5 w-[2px] rounded-full bg-sky-300/40" />
                  )}
                </div>
              ))}
            </div>

            {/* esqueleto sutil hasta montar en cliente */}
            {!mounted ? (
              <>
                {/* pivote central fijo */}
                <span className="absolute left-1/2 top-1/2 h-2 w-2 -translate-x-1/2 -translate-y-1/2 rounded-full bg-sky-300/80 shadow-[0_0_6px_rgba(125,211,252,0.8)]" />
              </>
            ) : (
              <>
                {/* indicador AM/PM */}
                <span className="absolute bottom-[26%] left-1/2 -translate-x-1/2 text-[7px] font-semibold uppercase tracking-[0.22em] text-sky-400/80">
                  {ampm}
                </span>

                {/* aguja de la hora */}
                <div
                  className="absolute bottom-1/2 left-1/2 h-[22px] w-[3px] rounded-full bg-sky-200"
                  style={{
                    transformOrigin: "bottom center",
                    transform: `translateX(-50%) rotate(${hourRot}deg)`,
                  }}
                />
                {/* aguja del minuto */}
                <div
                  className="absolute bottom-1/2 left-1/2 h-[32px] w-[2px] rounded-full bg-sky-100/90"
                  style={{
                    transformOrigin: "bottom center",
                    transform: `translateX(-50%) rotate(${minRot}deg)`,
                  }}
                />
                {/* segundero fino */}
                <div
                  className="absolute bottom-1/2 left-1/2 h-[38px] w-px rounded-full bg-sky-400"
                  style={{
                    transformOrigin: "bottom center",
                    transform: `translateX(-50%) rotate(${secRot}deg)`,
                  }}
                />

                {/* pivote central */}
                <span className="absolute left-1/2 top-1/2 h-2 w-2 -translate-x-1/2 -translate-y-1/2 rounded-full bg-sky-300 shadow-[0_0_6px_rgba(125,211,252,0.8)]" />
                <span className="absolute left-1/2 top-1/2 h-[3px] w-[3px] -translate-x-1/2 -translate-y-1/2 rounded-full bg-white" />
              </>
            )}
          </div>

          {/* reproductor */}
          <button
            onClick={toggleMusic}
            className="flex items-center gap-1.5 rounded-full border border-sky-400/20 bg-[#060e1a]/60 px-3 py-1.5 text-[11px] font-semibold uppercase tracking-widest text-sky-300/70 backdrop-blur-md transition-all hover:border-sky-400/40 hover:text-sky-200"
          >
            {playing ? (
              <Pause className="size-3 fill-current" />
            ) : (
              <Play className="size-3 fill-current" />
            )}
            <span className="hidden sm:inline">Ambient</span>
          </button>
        </div>
      </header>

      {/* ── Contenido ──────────────────────────────────── */}
      <div className="relative z-10 mx-auto flex min-h-screen max-w-5xl flex-col items-center justify-center px-5 pb-20 pt-20 sm:px-8">
        {/* ── Avatar ────────────────────────────────────── */}
        <div className="fade-in-up mb-10 flex flex-col items-center">
          <div className="relative">
            <div className="pulse-glow absolute -inset-3 rounded-full bg-sky-400/15 blur-xl" />
            <div className="relative h-24 w-24 overflow-hidden rounded-full border-2 border-sky-300/30 bg-[#060e1a] shadow-[0_0_28px_rgba(56,189,248,0.3)]">
              <img
                src="/images/members/dramatic/avatar.jpeg"
                alt={member.displayName}
                className="h-full w-full object-cover select-none"
              />
            </div>
          </div>
          <span
            className="mt-4 font-serif text-2xl font-semibold tracking-wide text-sky-100 drop-shadow-[0_0_12px_rgba(56,189,248,0.35)] sm:text-3xl"
          >
            {member.displayName}
          </span>
          <span className="mt-1 text-[10px] font-semibold uppercase tracking-[0.3em] text-sky-400/50">
            {member.role}
          </span>
        </div>

        {/* ── Dos columnas: poema + foto ──────────────── */}
        <div className="fade-in-up fade-in-up-d1 flex w-full flex-col items-center gap-10 md:flex-row md:items-start md:gap-12">
          {/* columna textos */}
          <div className="flex-1 text-center md:text-left">
            {/* ── Epígrafe (cita introductoria) ────────── */}
            <blockquote className="font-serif text-2xl font-light italic leading-relaxed tracking-wide text-sky-100/90 drop-shadow-sm sm:text-3xl md:border-l md:border-sky-400/30 md:pl-8 md:text-left">
              {TEXTO_UNO.map((line, i) => (
                <span key={i} className="block">
                  {line}
                </span>
              ))}
            </blockquote>

            {/* ── Ornamento etéreo ─────────────────────── */}
            <div
              aria-hidden
              className="my-10 flex items-center justify-center gap-3 text-sky-300/50 md:justify-start md:pl-8"
            >
              <span className="text-[11px] leading-none">✦</span>
              <span className="text-[8px] leading-none opacity-70">·</span>
              <span className="text-[11px] leading-none">✦</span>
              <span className="text-[8px] leading-none opacity-70">·</span>
              <span className="text-[11px] leading-none">✦</span>
            </div>

            {/* ── Poema (continuación fluida) ──────────── */}
            <div className="space-y-0 font-serif text-lg leading-relaxed tracking-wide text-sky-100/90 drop-shadow-sm sm:text-xl">
              {POEM_STROPHE.map(renderLine)}
            </div>
          </div>

          {/* columna foto */}
          <div className="fade-in-up fade-in-up-d2 w-full max-w-sm shrink-0 md:w-[380px]">
            <div
              className="relative aspect-[4/5] overflow-hidden opacity-85 transition-opacity duration-700 hover:opacity-100"
              style={{
                maskImage:
                  "linear-gradient(to left, rgba(0,0,0,1) 30%, rgba(0,0,0,0) 100%)",
                WebkitMaskImage:
                  "linear-gradient(to left, rgba(0,0,0,1) 30%, rgba(0,0,0,0) 100%)",
              }}
            >
              <img
                src="/images/members/dramatic/street.jpeg"
                alt="Noche solitaria"
                className="absolute inset-0 h-full w-full object-cover select-none"
                loading="lazy"
              />
              {/* tinte celeste envolvente */}
              <div
                aria-hidden
                className="pointer-events-none absolute inset-0 bg-gradient-to-t from-sky-950/40 via-transparent to-sky-200/20"
              />
              {/* resplandor ambiental */}
              <div
                aria-hidden
                className="pointer-events-none absolute inset-0 shadow-[0_0_60px_rgba(56,189,248,0.2)]"
              />
            </div>
          </div>
        </div>

        {/* ── Cita final ─────────────────────────────────── */}
        <div className="fade-in-up fade-in-up-d3 mt-14 max-w-md rounded-lg border border-sky-400/10 bg-[#060e1a]/50 px-8 py-8 text-center shadow-[0_0_40px_rgba(56,189,248,0.08)] backdrop-blur-sm">
          <p className="font-serif text-xl italic text-sky-200/80 sm:text-2xl">
            &ldquo;La distancia no borra, solo aprende a convivir.&rdquo;
          </p>
          <p className="mt-3 text-xs font-semibold uppercase tracking-[0.2em] text-sky-400/40">
            — 𝕯𝖗𝖆𝖒𝖆𝖙𝖎𝖈
          </p>
        </div>
      </div>
    </main>
  );
}
