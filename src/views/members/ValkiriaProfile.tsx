"use client";

import { useState, useEffect, useRef } from "react";
import type { Member } from "@/data/members";
import { Pirata_One, Special_Elite } from "next/font/google";
import { Play, Pause, Volume2, VolumeX } from "lucide-react";

const gothic = Pirata_One({
  subsets: ["latin"],
  weight: ["400"],
  display: "swap",
});

const elite = Special_Elite({
  subsets: ["latin"],
  weight: ["400"],
  display: "swap",
});

const FX_STYLES = `
@keyframes flowerSway {
  from { transform: rotate(-4deg); }
  to { transform: rotate(4deg); }
}
@keyframes fallingPetals {
  0% { transform: translate3d(0, -8vh, 0) rotate(0deg); opacity: 0; }
  8% { opacity: 0.55; }
  85% { opacity: 0.4; }
  100% { transform: translate3d(var(--drift, 30px), 108vh, 0) rotate(340deg); opacity: 0; }
}
@keyframes grainShift {
  0% { background-position: 0 0; }
  25% { background-position: -60px 30px; }
  50% { background-position: 40px -50px; }
  75% { background-position: -30px -20px; }
  100% { background-position: 0 0; }
}
@keyframes haloBreathe {
  0%, 100% { box-shadow: 0 0 28px rgba(251,191,36,0.22), 0 0 70px rgba(185,28,28,0.18); }
  50% { box-shadow: 0 0 44px rgba(251,191,36,0.38), 0 0 100px rgba(185,28,28,0.3); }
}
.flower-sway {
  animation: flowerSway 6s ease-in-out infinite alternate;
  transform-box: fill-box;
  transform-origin: bottom center;
}
.falling-petal { animation: fallingPetals linear infinite; }
.film-grain { animation: grainShift 0.9s steps(2) infinite; }
.halo-breathe { animation: haloBreathe 5s ease-in-out infinite; }
`;

/* ── Pétalos: posiciones deterministas (SSR-seguro) ────── */
const PETALS: { left: number; size: number; dur: number; delay: number; drift: number }[] = [
  { left: 6, size: 12, dur: 16, delay: -3, drift: 40 },
  { left: 18, size: 9, dur: 13, delay: -9, drift: -30 },
  { left: 33, size: 14, dur: 18, delay: -6, drift: 55 },
  { left: 52, size: 10, dur: 14, delay: -11, drift: -45 },
  { left: 68, size: 13, dur: 17, delay: -2, drift: 35 },
  { left: 82, size: 9, dur: 12, delay: -7, drift: -25 },
  { left: 93, size: 11, dur: 15, delay: -12, drift: 45 },
];

/* ── "The Past" (poema original) ───────────────────────── */
const POEM: string[][] = [
  [
    "I walked among broken memories,",
    "through streets where echoes learned to creep,",
    "I gathered names like falling ashes,",
    "and sowed them in the fields of sleep.",
  ],
  [
    "I trusted hands that seemed sincere,",
    "they held me close, then let me fall,",
    "betrayal wears a gentle face —",
    "the kindest knife cuts deepest of all.",
  ],
  [
    "The past left scars upon my soul,",
    "red signatures I cannot hide,",
    "but every wound became a lantern,",
    "and every tear, a rising tide.",
  ],
  [
    "So here I stand among the damned,",
    "with yellow blooms between the wire,",
    "the lost don't kneel, the lost remember —",
    "we walk through ash, we carry fire.",
  ],
];

const TRACK_SRC = "/images/members/valkiria/audio.mp3";

function fmtTime(s: number): string {
  const v = Math.max(0, Math.floor(s || 0));
  return `${Math.floor(v / 60)}:${String(v % 60).padStart(2, "0")}`;
}

/* ── Esquina de enredadera con flores silvestres ───────── */
function FlowerCorner({ className = "" }: { className?: string }) {
  const flowers = [
    { x: 44, y: 96, s: 1, d: "0s" },
    { x: 88, y: 62, s: 0.75, d: "-2s" },
    { x: 118, y: 26, s: 0.55, d: "-4s" },
  ];
  return (
    <svg viewBox="0 0 160 160" className={className} aria-hidden>
      <path
        d="M6 154 C50 130 78 96 96 44 C102 26 108 12 118 4"
        fill="none"
        stroke="#4a5d23"
        strokeWidth="4"
        strokeLinecap="round"
        opacity="0.9"
      />
      <path
        d="M30 148 C60 132 84 104 98 66"
        fill="none"
        stroke="#3a4a1c"
        strokeWidth="2.5"
        strokeLinecap="round"
        opacity="0.8"
      />
      {[
        { x: 52, y: 118, r: -30 },
        { x: 78, y: 88, r: 25 },
        { x: 100, y: 52, r: -20 },
      ].map((l, i) => (
        <ellipse
          key={i}
          cx={l.x}
          cy={l.y}
          rx="11"
          ry="5"
          fill="#556b2f"
          opacity="0.85"
          transform={`rotate(${l.r} ${l.x} ${l.y})`}
        />
      ))}
      {flowers.map((f, i) => (
        <g
          key={i}
          className="flower-sway"
          style={{ animationDelay: f.d }}
          transform={`translate(${f.x} ${f.y}) scale(${f.s})`}
        >
          {[0, 72, 144, 216, 288].map((a) => (
            <ellipse
              key={a}
              cx="0"
              cy="-11"
              rx="6.5"
              ry="11"
              fill="#facc15"
              stroke="#b45309"
              strokeWidth="1"
              transform={`rotate(${a})`}
            />
          ))}
          <circle cx="0" cy="0" r="6" fill="#78350f" />
          <circle cx="-2" cy="-2" r="1.6" fill="#fbbf24" />
          <circle cx="2" cy="1.5" r="1.6" fill="#fbbf24" />
        </g>
      ))}
    </svg>
  );
}

export function ValkiriaProfile({ member }: { member: Member }) {
  const [mounted, setMounted] = useState(false);
  const [bgOk, setBgOk] = useState(false);
  const [bgSrc, setBgSrc] = useState("");
  const [avatarOk, setAvatarOk] = useState(true);

  const [playing, setPlaying] = useState(false);
  const [muted, setMuted] = useState(false);
  const [volume, setVolume] = useState(0.4);
  const [progress, setProgress] = useState(0);
  const [duration, setDuration] = useState(0);
  const [audioMissing, setAudioMissing] = useState(false);
  const audioRef = useRef<HTMLAudioElement | null>(null);

  useEffect(() => {
    setMounted(true);
  }, []);

  /* ── Pre-chequeo de la reliquia: PNG primero, luego JPG ── */
  useEffect(() => {
    const testPng = new window.Image();
    testPng.src = "/images/members/valkiria/bg.png";
    testPng.onload = () => {
      setBgSrc("/images/members/valkiria/bg.png");
      setBgOk(true);
    };
    testPng.onerror = () => {
      const testJpg = new window.Image();
      testJpg.src = "/images/members/valkiria/bg.jpg";
      testJpg.onload = () => {
        setBgSrc("/images/members/valkiria/bg.jpg");
        setBgOk(true);
      };
      testJpg.onerror = () => setBgOk(false);
    };
  }, []);

  const togglePlay = () => {
    const a = audioRef.current;
    if (!a || audioMissing) return;
    if (a.paused) a.play().catch(() => {});
    else a.pause();
  };

  const toggleMute = () => {
    const a = audioRef.current;
    if (!a) return;
    a.muted = !a.muted;
    setMuted(a.muted);
  };

  const seek = (e: React.MouseEvent<HTMLDivElement>) => {
    const a = audioRef.current;
    if (!a || !duration) return;
    const rect = e.currentTarget.getBoundingClientRect();
    const ratio = Math.min(
      1,
      Math.max(0, (e.clientX - rect.left) / rect.width)
    );
    a.currentTime = ratio * duration;
    setProgress(a.currentTime);
  };

  return (
    <main
      className="relative min-h-screen overflow-x-clip text-stone-200"
      style={{
        background: "linear-gradient(180deg, #08080a 0%, #12090b 55%, #08080a 100%)",
      }}
    >
      <style>{FX_STYLES}</style>

      {/* ── Velos radiales en rojo sangre ────────────────── */}
      <div
        aria-hidden
        className="pointer-events-none fixed inset-0 z-0"
        style={{
          background:
            "radial-gradient(ellipse 70% 45% at 50% 0%, rgba(185,28,28,0.15) 0%, transparent 70%), radial-gradient(ellipse 60% 40% at 50% 100%, rgba(185,28,28,0.12) 0%, transparent 70%)",
        }}
      />
      {/* ── Viñeta + grano ───────────────────────────────── */}
      <div
        aria-hidden
        className="pointer-events-none fixed inset-0 z-0"
        style={{
          background:
            "radial-gradient(ellipse at center, transparent 45%, rgba(0,0,0,0.7) 100%)",
        }}
      />
      <div
        aria-hidden
        className="film-grain pointer-events-none fixed inset-0 z-[3] opacity-[0.06]"
        style={{
          backgroundImage:
            "url(\"data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='140' height='140'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='2'/%3E%3C/filter%3E%3Crect width='140' height='140' filter='url(%23n)' opacity='1'/%3E%3C/svg%3E\")",
        }}
      />

      {/* ── Marco perimetral de enredaderas ──────────────── */}
      <div aria-hidden className="pointer-events-none fixed inset-0 z-[1]">
        <FlowerCorner className="absolute left-0 top-0 h-40 w-40 sm:h-56 sm:w-56" />
        <FlowerCorner className="absolute right-0 top-0 h-40 w-40 -scale-x-100 sm:h-56 sm:w-56" />
        <FlowerCorner className="absolute bottom-0 left-0 h-40 w-40 -scale-y-100 sm:h-56 sm:w-56" />
        <FlowerCorner className="absolute bottom-0 right-0 h-40 w-40 -scale-100 sm:h-56 sm:w-56" />
      </div>

      {/* ── Pétalos amarillos flotantes ───────────────────── */}
      {mounted && (
        <div aria-hidden className="pointer-events-none fixed inset-0 z-[1] overflow-hidden">
          {PETALS.map((p, i) => (
            <span
              key={i}
              className="falling-petal absolute"
              style={{
                left: `${p.left}%`,
                top: 0,
                width: `${p.size}px`,
                height: `${p.size * 0.7}px`,
                background: "linear-gradient(135deg, #fde047, #f59e0b)",
                borderRadius: "100% 3px",
                animationDuration: `${p.dur}s`,
                animationDelay: `${p.delay}s`,
                "--drift": `${p.drift}px`,
              } as React.CSSProperties}
            />
          ))}
        </div>
      )}

      {/* ── Retorno ──────────────────────────────────────── */}
      <a
        href="/"
        className="fixed left-4 top-4 z-40 flex items-center gap-2 border border-red-900/60 bg-black/60 px-3 py-1.5 text-[11px] font-bold tracking-[0.2em] text-stone-300 backdrop-blur-md transition-colors hover:border-[#dc2626] hover:text-red-200 sm:left-6 sm:top-6"
      >
        <span aria-hidden>&larr;</span>[ GLL // ROSTER ]
      </a>

      {/* ── Hero ─────────────────────────────────────────── */}
      <div className="relative z-10 mx-auto max-w-5xl px-5 pb-16 pt-24 text-center sm:px-8 sm:pt-28">
        <p className={`text-[11px] font-bold uppercase tracking-[0.4em] text-red-500/70 ${elite.className}`}>
          FILE // {member.role}
        </p>
        <h1
          className={`${gothic.className} mt-4 leading-none text-transparent`}
          style={{
            fontSize: "clamp(3rem, 10vw, 6.5rem)",
            backgroundImage: "linear-gradient(180deg, #ef4444 5%, #b91c1c 55%, #7f1d1d 95%)",
            backgroundClip: "text",
            WebkitBackgroundClip: "text",
            filter: "drop-shadow(0 3px 0 rgba(0,0,0,0.85)) drop-shadow(0 0 26px rgba(185,28,28,0.35))",
          }}
        >
          THE LOST &amp; DAMNED
        </h1>
        <p
          className="mt-4 font-sans text-lg font-semibold tracking-wide text-amber-100/90 sm:text-2xl"
          style={{ fontVariantLigatures: "none" }}
        >
          ꓘᏙ𝒂ʅ𝘬𝗶𝙧𝗶𝒂 𝑾𝒂𝒍𝒕𝒆𝒏. <span className="text-stone-500">//</span>{" "}
          <span className={`text-sm tracking-[0.35em] text-stone-400 sm:text-base ${elite.className}`}>
            THE GOSPEL OF THE LOST
          </span>
        </p>
      </div>

      {/* ── Sección poética: retrato + poema ──────────────── */}
      <div className="relative z-10 mx-auto grid max-w-6xl gap-10 px-5 pb-20 sm:px-8 md:grid-cols-[minmax(0,5fr)_minmax(0,7fr)] md:gap-14">
        {/* Retrato con halo dorado */}
        <figure className="mx-auto w-full max-w-sm md:mx-0">
          {avatarOk ? (
            <div className="halo-breathe border-2 border-red-900/60 bg-black/60 p-2 outline outline-1 outline-amber-200/20">
              <img
                src="/images/members/valkiria/avatar.jpg"
                alt="Valkiria — the martyr's halo"
                onError={() => setAvatarOk(false)}
                className="aspect-[3/4] w-full object-cover select-none"
                loading="eager"
              />
            </div>
          ) : (
            <div className="flex aspect-[3/4] w-full items-center justify-center border-2 border-red-900/60 bg-black/60">
              <span className={`text-6xl text-red-900/60 ${gothic.className}`}>V</span>
            </div>
          )}
          <figcaption className={`mt-3 text-center text-sm italic tracking-[0.25em] text-amber-200/60 ${elite.className}`}>
            — the martyr&apos;s halo —
          </figcaption>
        </figure>

        {/* El poema */}
        <article>
          <h2
            className={`${gothic.className} text-4xl text-transparent sm:text-5xl`}
            style={{
              backgroundImage: "linear-gradient(180deg, #ef4444 10%, #b91c1c 70%, #7f1d1d 100%)",
              backgroundClip: "text",
              WebkitBackgroundClip: "text",
              filter: "drop-shadow(0 2px 0 rgba(0,0,0,0.8))",
            }}
          >
            THE PAST
          </h2>
          <div className="mt-6">
            {POEM.map((stanza, si) => (
              <div key={si} className="mb-7 border-l border-red-900/30 pl-5">
                {stanza.map((line, li) => (
                  <p
                    key={li}
                    className="font-serif text-lg italic leading-relaxed tracking-wide text-red-500 drop-shadow-[0_1px_3px_rgba(0,0,0,0.8)] sm:text-xl"
                  >
                    {line}
                  </p>
                ))}
              </div>
            ))}
          </div>
        </article>
      </div>

      {/* ── Reliquia: la gorra ───────────────────────────── */}
      <div className="relative z-10 mx-auto max-w-4xl px-5 pb-24 sm:px-8">
        <div className="border border-red-900/50 bg-black/60 p-4 shadow-[0_0_50px_rgba(185,28,28,0.12)] sm:p-6">
          <p className={`text-[11px] font-bold uppercase tracking-[0.35em] text-amber-200/70 ${elite.className}`}>
            THE RELIC // SURVIVOR&apos;S KEEPSAKE
          </p>
          {bgOk ? (
            <div className="mt-4 overflow-hidden rounded-lg border-2 border-amber-900/50 shadow-[0_0_40px_rgba(251,191,36,0.12)] outline outline-1 outline-red-900/40">
              <img
                src={bgSrc}
                alt="La gorra de Clementine — recuerdos de supervivencia"
                onError={() => setBgOk(false)}
                className="aspect-[21/9] w-full object-cover select-none"
                style={{ filter: "saturate(0.7) contrast(1.05) brightness(0.9)" }}
                loading="lazy"
              />
            </div>
          ) : (
            <div
              className="mt-4 flex aspect-[21/9] w-full flex-col items-center justify-center gap-3 rounded-lg border border-amber-900/40 bg-neutral-950/80 p-8"
              style={{
                backgroundImage:
                  "repeating-linear-gradient(45deg, rgba(251,191,36,0.04) 0px, rgba(251,191,36,0.04) 1px, transparent 1px, transparent 9px)",
              }}
            >
              <svg
                viewBox="0 0 140 90"
                className="h-16 w-auto sm:h-20"
                style={{ filter: "drop-shadow(0 0 14px rgba(251,191,36,0.35))" }}
                aria-hidden
              >
                <ellipse cx="102" cy="64" rx="26" ry="7" fill="none" stroke="#b45309" strokeWidth="2.5" />
                <path
                  d="M28 64 C28 34 48 18 66 18 C84 18 100 36 100 64 Z"
                  fill="rgba(0,0,0,0.4)"
                  stroke="#b45309"
                  strokeWidth="2.5"
                />
                <circle cx="66" cy="18" r="3.5" fill="none" stroke="#b45309" strokeWidth="2" />
                <path d="M48 62 C48 40 56 26 64 20" fill="none" stroke="#92600a" strokeWidth="1.5" strokeDasharray="4 3" />
                <path d="M84 62 C84 40 76 26 68 20" fill="none" stroke="#92600a" strokeWidth="1.5" strokeDasharray="4 3" />
                <text x="62" y="54" textAnchor="middle" fill="#d97706" fontSize="22" fontFamily="serif" fontWeight="bold">
                  D
                </text>
              </svg>
              <p className="text-center font-mono text-[11px] tracking-[0.25em] text-amber-200/70 sm:text-xs">
                [ ARCHIVED RELIC // CLEMENTINE&apos;S CAP — AWAITING ARTIFACT DEPOSIT ]
              </p>
            </div>
          )}
          <p className="mt-5 font-serif text-base italic leading-relaxed text-stone-300 sm:text-lg">
            &ldquo;Clementine&apos;s cap outlived every winter, every horde, every
            goodbye. It doesn&apos;t shield you from the dead — it reminds the
            living who you chose to become. Keep walking. Keep choosing.&rdquo;
          </p>
          <p className={`mt-3 text-right text-sm tracking-[0.25em] text-red-500/70 ${elite.className}`}>
            — V.
          </p>
        </div>
      </div>

      {/* ── Audio deck flotante ──────────────────────────── */}
      <audio
        ref={audioRef}
        src={TRACK_SRC}
        preload="metadata"
        onTimeUpdate={(e) => setProgress(e.currentTarget.currentTime)}
        onLoadedMetadata={(e) => {
          setDuration(e.currentTarget.duration);
          const a = audioRef.current;
          if (a) {
            a.volume = volume;
            a.muted = muted;
          }
        }}
        onPlay={() => setPlaying(true)}
        onPause={() => setPlaying(false)}
        onEnded={() => setPlaying(false)}
        onError={() => setAudioMissing(true)}
      />

      {mounted && (
        <div className="fixed bottom-4 left-1/2 z-30 w-[min(94vw,540px)] -translate-x-1/2">
          <div className="flex items-center gap-3 border border-red-900/60 bg-black/75 px-3 py-2 backdrop-blur-md">
            <button
              onClick={togglePlay}
              aria-label={playing ? "Pausar" : "Reproducir"}
              className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-[#7f1d1d] text-red-100 shadow-[0_0_16px_rgba(185,28,28,0.4)] transition-transform hover:scale-105 active:scale-95"
            >
              {playing ? (
                <Pause className="size-4 fill-current" />
              ) : (
                <Play className="ml-0.5 size-4 fill-current" />
              )}
            </button>
            <div className="min-w-0 flex-1">
              {audioMissing ? (
                <p className="text-[11px] tracking-[0.2em] text-red-400">
                  CINTA AUSENTE — audio.mp3 no encontrado
                </p>
              ) : (
                <>
                  <p className={`truncate text-[11px] tracking-[0.2em] text-stone-300 ${elite.className}`}>
                    VALKIRIA // SIDE A
                  </p>
                  <div className="mt-1 flex items-center gap-2">
                    <span className="text-[10px] tabular-nums text-stone-500">
                      {fmtTime(progress)}
                    </span>
                    <div
                      role="slider"
                      aria-label="Progreso"
                      aria-valuemin={0}
                      aria-valuemax={Math.round(duration)}
                      aria-valuenow={Math.round(progress)}
                      tabIndex={0}
                      onClick={seek}
                      onKeyDown={(e) => {
                        const a = audioRef.current;
                        if (!a) return;
                        if (e.key === "ArrowRight") a.currentTime = Math.min(duration, a.currentTime + 5);
                        if (e.key === "ArrowLeft") a.currentTime = Math.max(0, a.currentTime - 5);
                      }}
                      className="h-1.5 flex-1 cursor-pointer border border-red-900/50 bg-black"
                    >
                      <div
                        className="h-full bg-gradient-to-r from-[#7f1d1d] via-[#dc2626] to-[#fbbf24]"
                        style={{ width: `${duration ? (progress / duration) * 100 : 0}%` }}
                      />
                    </div>
                    <span className="text-[10px] tabular-nums text-stone-500">
                      {fmtTime(duration)}
                    </span>
                  </div>
                </>
              )}
            </div>
            <button
              onClick={toggleMute}
              aria-label={muted ? "Activar sonido" : "Silenciar"}
              className="shrink-0 p-1.5 text-stone-400 transition-colors hover:text-red-200"
            >
              {muted ? <VolumeX className="size-4" /> : <Volume2 className="size-4" />}
            </button>
            <input
              type="range"
              min={0}
              max={1}
              step={0.05}
              value={volume}
              onChange={(e) => {
                const v = Number(e.target.value);
                setVolume(v);
                if (audioRef.current) {
                  audioRef.current.volume = v;
                  if (v > 0 && muted) {
                    audioRef.current.muted = false;
                    setMuted(false);
                  }
                }
              }}
              aria-label="Volumen"
              className="hidden w-20 shrink-0 cursor-pointer accent-[#b91c1c] sm:block"
            />
          </div>
        </div>
      )}

      {/* ── Cierre ───────────────────────────────────────── */}
      <footer className="relative z-10 pb-28 pt-4 text-center">
        <p className={`text-xs tracking-[0.3em] text-stone-600 ${elite.className}`}>
          THE LOST DON&apos;T KNEEL — GLL
        </p>
      </footer>
    </main>
  );
}
