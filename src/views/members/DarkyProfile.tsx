"use client";

import { useState, useEffect, useRef } from "react";
import type { Member } from "@/data/members";
import {
  SkipBack,
  SkipForward,
  Play,
  Pause,
  Minus,
  ChevronUp,
  X,
} from "lucide-react";

/* ── Pistas Liquid Glass ───────────────────────────────── */
const TRACKS = [
  {
    id: 1,
    title: "Rein raus",
    artist: "Rammstein",
    src: "/images/members/Darky/track-1.mp3",
    duration: "3:10",
  },
  {
    id: 2,
    title: "Bang Bang Bang Bang",
    artist: "Sohodolls",
    src: "/images/members/Darky/track-2.mp3",
    duration: "3:24",
  },
  {
    id: 3,
    title: "GMFU",
    artist: "Odetari ft. 6arelyhuman",
    src: "/images/members/Darky/track-3.mp3",
    duration: "2:15",
  },
];

/* ── CSS dinámico ──────────────────────────────────────── */
const FX_STYLES = `
@keyframes cam-tremor {
  0%, 100% { transform: translate(0,0) rotate(0); }
  25% { transform: translate(-1.5px,1px) rotate(-0.15deg); }
  50% { transform: translate(1.5px,-1px) rotate(0.15deg); }
  75% { transform: translate(-1px,-1px) rotate(-0.1deg); }
}
@keyframes shake-violent {
  0% { transform: translate(0,0); }
  10% { transform: translate(-14px,10px); }
  20% { transform: translate(12px,-14px); }
  30% { transform: translate(-10px,-8px); }
  40% { transform: translate(14px,12px); }
  50% { transform: translate(-12px,6px); }
  60% { transform: translate(10px,-12px); }
  70% { transform: translate(-14px,10px); }
  80% { transform: translate(12px,-4px); }
  90% { transform: translate(-8px,8px); }
  100% { transform: translate(0,0); }
}
@keyframes strobe-invert {
  0%, 100% { filter: invert(0) brightness(1); }
  6% { filter: invert(1) brightness(2) contrast(1.5); }
  10% { filter: invert(0); }
  20% { filter: invert(1) brightness(2) contrast(1.5); }
  24% { filter: invert(0); }
  34% { filter: invert(1) brightness(2) contrast(1.5); }
  38% { filter: invert(0); }
  46% { filter: invert(1) brightness(2) contrast(1.5); }
  50%, 100% { filter: invert(0); }
}
@keyframes glitch-a {
  0% { clip-path: inset(0 0 62% 0); transform: translateX(-4px); }
  25% { clip-path: inset(30% 0 30% 0); transform: translateX(3px); }
  50% { clip-path: inset(55% 0 5% 0); transform: translateX(-3px); }
  75% { clip-path: inset(10% 0 70% 0); transform: translateX(4px); }
  100% { clip-path: inset(40% 0 25% 0); transform: translateX(-2px); }
}
@keyframes glitch-b {
  0% { clip-path: inset(35% 0 40% 0); transform: translateX(4px); }
  25% { clip-path: inset(5% 0 75% 0); transform: translateX(-3px); }
  50% { clip-path: inset(60% 0 8% 0); transform: translateX(3px); }
  75% { clip-path: inset(20% 0 50% 0); transform: translateX(-4px); }
  100% { clip-path: inset(45% 0 20% 0); transform: translateX(2px); }
}
@keyframes vhs-tear {
  0%, 100% { top: -20%; }
  100% { top: 115%; }
}
@keyframes name-glitch {
  0%, 90%, 100% {
    text-shadow: -2px 0 rgba(255,0,0,0.8), 2px 0 rgba(0,255,255,0.8);
    transform: translate(0,0);
  }
  92% {
    text-shadow: -5px 0 rgba(255,0,0,0.95), 4px 0 rgba(0,255,255,0.95), -2px 2px 0 rgba(255,0,255,0.6);
    transform: translate(-3px,1px) skewX(-2deg);
  }
  94% {
    text-shadow: 4px 0 rgba(255,0,255,0.8), -5px 0 rgba(0,255,255,0.9);
    transform: translate(3px,-2px) skewX(2deg);
  }
  96% {
    text-shadow: -2px 2px rgba(255,0,0,0.9), 2px -2px rgba(0,255,255,0.9);
    transform: translate(-2px,2px);
  }
  98% {
    text-shadow: 2px 0 rgba(255,0,0,0.8), -2px 0 rgba(0,255,255,0.8);
    transform: translate(1px,-1px);
  }
}
@keyframes msg-flicker {
  0%, 100% { opacity: 1; }
  10% { opacity: 0.2; }
  14% { opacity: 0.9; }
  30% { opacity: 0.4; }
  34% { opacity: 1; }
}
@keyframes eq1 { 0%,100% { height: 4px; } 50% { height: 15px; } }
@keyframes eq2 { 0%,100% { height: 11px; } 50% { height: 3px; } }
@keyframes eq3 { 0%,100% { height: 6px; } 50% { height: 13px; } }

.cam-tremor { animation: cam-tremor 4s ease-in-out infinite; }
.crash-shake { animation: shake-violent 0.3s linear infinite; }
.strobe-layer { animation: strobe-invert 2.2s linear infinite; }
.name-glitch { animation: name-glitch 3.4s steps(1) infinite; }
.chroma {
  text-shadow: -1.5px 0 rgba(255,0,0,0.55), 1.5px 0 rgba(0,255,255,0.55);
}
.msg-flicker { animation: msg-flicker 0.5s steps(1) infinite; }
.eq-bar { width: 3px; border-radius: 2px; background: #a3a3a3; }
.eq-active.eq1 { animation: eq1 0.9s ease-in-out infinite; }
.eq-active.eq2 { animation: eq2 0.7s ease-in-out infinite; }
.eq-active.eq3 { animation: eq3 1.1s ease-in-out infinite; }
.vhs-static {
  background-image: repeating-linear-gradient(
    0deg,
    rgba(255,255,255,0.04) 0px,
    rgba(255,255,255,0.04) 1px,
    transparent 1px,
    transparent 4px
  );
  mix-blend-mode: screen;
}
.vhs-scanbar {
  position: absolute;
  left: 0;
  right: 0;
  height: 90px;
  background: linear-gradient(180deg, transparent, rgba(255,255,255,0.16), transparent);
  animation: vhs-tear 0.15s linear infinite;
}
`;

const GALLERY = [
  "/images/members/Darky/gallery/1.jpg",
  "/images/members/Darky/gallery/2.jpg",
  "/images/members/Darky/gallery/3.jpg",
  "/images/members/Darky/gallery/4.jpg",
  "/images/members/Darky/gallery/5.jpg",
  "/images/members/Darky/gallery/6.jpg",
];

/* ── Tipos del enjambre ────────────────────────────────── */
type Skull = {
  x: number;
  y: number;
  vx: number;
  vy: number;
  size: number;
  depth: number;
  rot: number;
  vr: number;
  phase: number;
};

type Ghost = {
  x: number;
  y: number;
  age: number;
  size: number;
  rot: number;
};

/* ── Helpers ───────────────────────────────────────────── */
function fmtTime(s: number): string {
  const v = Math.max(0, Math.floor(s || 0));
  const m = Math.floor(v / 60);
  const sec = v % 60;
  return `${m}:${String(sec).padStart(2, "0")}`;
}

export function DarkyProfile({ member }: { member: Member }) {
  const [mounted, setMounted] = useState(false);
  const [crashed, setCrashed] = useState(false);

  const [expanded, setExpanded] = useState(false);
  const [currentTrack, setCurrentTrack] = useState(1);
  const [isPlaying, setIsPlaying] = useState(false);
  const [progress, setProgress] = useState(0);
  const [duration, setDuration] = useState(0);

  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const mouseRef = useRef({ x: -9999, y: -9999 });
  const ghostsRef = useRef<Ghost[]>([]);
  const crashedRef = useRef(false);
  const scrollRef = useRef(0);

  const activeTrack = TRACKS.find((t) => t.id === currentTrack) ?? TRACKS[0];

  /* ── mounted + crash timer ───────────────────────────── */
  useEffect(() => setMounted(true), []);

  useEffect(() => {
    crashedRef.current = crashed;
    if (crashed) {
      const t = setTimeout(() => setCrashed(false), 3000);
      return () => clearTimeout(t);
    }
  }, [crashed]);

  /* ── Canvas 2D: enjambre de calaveras ────────────────── */
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const dpr = window.devicePixelRatio || 1;
    let w = window.innerWidth;
    let h = window.innerHeight;
    let raf = 0;
    let last = performance.now();

    const resize = () => {
      w = window.innerWidth;
      h = window.innerHeight;
      canvas.width = Math.floor(w * dpr);
      canvas.height = Math.floor(h * dpr);
      canvas.style.width = `${w}px`;
      canvas.style.height = `${h}px`;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    };
    resize();

    const skulls: Skull[] = [];
    const COUNT = 32;
    for (let i = 0; i < COUNT; i++) {
      skulls.push({
        x: Math.random() * w,
        y: Math.random() * h,
        vx: (Math.random() - 0.5) * 0.5,
        vy: (Math.random() - 0.5) * 0.5,
        size: 11 + Math.random() * 15,
        depth: 0.4 + Math.random() * 0.6,
        rot: Math.random() * Math.PI * 2,
        vr: (Math.random() - 0.5) * 0.02,
        phase: Math.random() * Math.PI * 2,
      });
    }
    ghostsRef.current = [];

    const drawSkull = (
      x: number,
      y: number,
      size: number,
      rot: number,
      alpha: number,
      fill: string
    ) => {
      ctx.save();
      ctx.globalAlpha = alpha;
      ctx.translate(x, y);
      ctx.rotate(rot);
      ctx.scale(size / 26, size / 26);
      ctx.fillStyle = fill;
      ctx.beginPath();
      ctx.arc(0, -2, 13, 0, Math.PI * 2);
      ctx.fill();
      ctx.beginPath();
      ctx.moveTo(-9, 2);
      ctx.lineTo(9, 2);
      ctx.lineTo(9, 8);
      ctx.lineTo(-9, 8);
      ctx.closePath();
      ctx.fill();
      ctx.beginPath();
      ctx.arc(-9, 4, 6, 0, Math.PI * 2);
      ctx.fill();
      ctx.beginPath();
      ctx.arc(9, 4, 6, 0, Math.PI * 2);
      ctx.fill();
      ctx.fillStyle = "#0a0a0b";
      ctx.beginPath();
      ctx.arc(-5, -1, 3.2, 0, Math.PI * 2);
      ctx.fill();
      ctx.beginPath();
      ctx.arc(5, -1, 3.2, 0, Math.PI * 2);
      ctx.fill();
      ctx.beginPath();
      ctx.moveTo(0, 0);
      ctx.lineTo(-2.6, 4);
      ctx.lineTo(2.6, 4);
      ctx.closePath();
      ctx.fill();
      for (let i = -5; i <= 5; i += 2.5) {
        ctx.fillRect(i, 5.5, 1.4, 4.5);
      }
      ctx.restore();
    };

    const frame = (now: number) => {
      const dt = Math.min(0.05, (now - last) / 1000);
      last = now;
      ctx.clearRect(0, 0, w, h);
      const mouse = mouseRef.current;
      const rush = crashedRef.current;

      for (const s of skulls) {
        const dx = s.x - mouse.x;
        const dy = s.y - mouse.y;
        const d2 = dx * dx + dy * dy;
        if (d2 < 150 * 150) {
          const d = Math.sqrt(d2) || 1;
          const f = (150 - d) / 150;
          s.vx += (dx / d) * f * 0.5;
          s.vy += (dy / d) * f * 0.5;
        }

        s.vy += scrollRef.current * 0.012;
        s.vx *= 0.996;
        s.vy *= 0.996;
        s.x += s.vx * (rush ? 4 : 1);
        s.y += s.vy * (rush ? 4 : 1) + Math.sin(now * 0.001 + s.phase) * 0.25;
        s.rot += s.vr * (rush ? 3 : 1);

        if (s.x < -50) s.x = w + 50;
        if (s.x > w + 50) s.x = -50;
        if (s.y < -50) s.y = h + 50;
        if (s.y > h + 50) s.y = -50;

        if (rush) {
          const cx = w / 2;
          const cy = h / 2;
          s.vx += (cx - s.x) * 0.05;
          s.vy += (cy - s.y) * 0.05;
          s.vx *= 1.07;
          s.vy *= 1.07;
          s.size += 0.7;
          if (s.size > 100) s.size = 12;
        }

        drawSkull(
          s.x,
          s.y,
          s.size,
          s.rot,
          rush ? 0.95 : 0.22 + s.depth * 0.55,
          rush ? "#e8e2da" : "#cfc7be"
        );
      }

      const ghosts = ghostsRef.current;
      for (let i = ghosts.length - 1; i >= 0; i--) {
        const g = ghosts[i];
        g.age += dt;
        if (g.age > 1.2) {
          ghosts.splice(i, 1);
          continue;
        }
        const p = 1 - g.age / 1.2;
        const size = g.size * (1 + g.age * 2.4);
        ctx.globalCompositeOperation = "lighter";
        ctx.save();
        ctx.translate(-3, 0);
        drawSkull(g.x, g.y, size, g.rot, p * 0.5, "#ff2d55");
        ctx.restore();
        ctx.save();
        ctx.translate(3, 0);
        drawSkull(g.x, g.y, size, g.rot, p * 0.5, "#00e5ff");
        ctx.restore();
        drawSkull(g.x, g.y, size, g.rot, p * 0.9, "#d8d3cc");
        ctx.globalCompositeOperation = "source-over";
      }

      scrollRef.current *= 0.9;
      raf = requestAnimationFrame(frame);
    };
    raf = requestAnimationFrame(frame);

    const onResize = () => resize();
    window.addEventListener("resize", onResize);
    const onMove = (e: PointerEvent) => {
      mouseRef.current = { x: e.clientX, y: e.clientY };
    };
    window.addEventListener("pointermove", onMove);
    const onWheel = (e: WheelEvent) => {
      scrollRef.current = Math.max(-900, Math.min(900, e.deltaY * 0.35));
    };
    window.addEventListener("wheel", onWheel);

    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener("resize", onResize);
      window.removeEventListener("pointermove", onMove);
      window.removeEventListener("wheel", onWheel);
    };
  }, []);

  /* ── Mecánica crash (The Ring) ───────────────────────── */
  const triggerCrash = () => {
    if (!crashed) setCrashed(true);
  };

  const handleBgClick = (e: React.MouseEvent) => {
    const gs = ghostsRef.current;
    if (!gs) return;
    for (let i = 0; i < 3; i++) {
      gs.push({
        x: e.clientX + (Math.random() * 50 - 25),
        y: e.clientY + (Math.random() * 50 - 25),
        age: -i * 0.08,
        size: 14 + Math.random() * 9,
        rot: Math.random() * Math.PI * 2,
      });
    }
  };

  /* ── Player ──────────────────────────────────────────── */
  const togglePlay = () => {
    const a = audioRef.current;
    if (!a) return;
    if (a.paused) a.play().catch(() => {});
    else a.pause();
  };

  const selectTrack = (id: number) => {
    const a = audioRef.current;
    const t = TRACKS.find((x) => x.id === id);
    if (!a || !t) return;
    if (id === currentTrack) {
      togglePlay();
      return;
    }
    a.src = t.src;
    a.currentTime = 0;
    setCurrentTrack(id);
    setProgress(0);
    setDuration(0);
    a.play().catch(() => {});
  };

  const go = (dir: number) => {
    const a = audioRef.current;
    if (!a) return;
    const ci = TRACKS.findIndex((t) => t.id === currentTrack);
    const t = TRACKS[(ci + dir + TRACKS.length) % TRACKS.length];
    a.src = t.src;
    a.currentTime = 0;
    setCurrentTrack(t.id);
    setProgress(0);
    setDuration(0);
    a.play().catch(() => {});
  };

  const seek = (e: React.ChangeEvent<HTMLInputElement>) => {
    const a = audioRef.current;
    if (!a) return;
    a.currentTime = Number(e.target.value);
    setProgress(a.currentTime);
  };

  return (
    <main
      className={`relative min-h-[220vh] overflow-x-clip bg-[#050506] text-neutral-200 ${
        crashed ? "crash-shake" : ""
      }`}
    >
      <style>{FX_STYLES}</style>

      {crashed && (
        <div className="strobe-layer pointer-events-none fixed inset-0 z-[40]" />
      )}

      {/* ── Capa fondo: manos fantasmales ────────────────── */}
      <div className="fixed inset-0 -z-20 overflow-hidden bg-black">
        <img
          src="/images/members/Darky/bg.jpg"
          alt=""
          className="h-full w-full object-cover object-center select-none"
          style={{
            filter: "grayscale(0.9) saturate(0.4) brightness(0.55) contrast(1.15)",
          }}
          loading="eager"
        />
        {/* tinte frío espectral */}
        <div
          aria-hidden
          className="absolute inset-0"
          style={{
            background:
              "linear-gradient(180deg, rgba(20,26,40,0.35) 0%, rgba(5,5,6,0.55) 60%, rgba(5,5,6,0.92) 100%)",
          }}
        />
        {/* viñeta oscura profunda */}
        <div
          aria-hidden
          className="absolute inset-0"
          style={{
            background:
              "radial-gradient(ellipse at center, transparent 30%, rgba(0,0,0,0.72) 100%)",
          }}
        />
      </div>

      {/* ── Capa clic-fondo (spawn de calaveras) ─────────── */}
      <div
        aria-hidden
        onClick={handleBgClick}
        className="fixed inset-0 z-[5] cursor-crosshair"
      />

      {/* ── Canvas: enjambre de calaveras ────────────────── */}
      {mounted && (
        <canvas
          ref={canvasRef}
          className="pointer-events-none fixed inset-0 z-10"
        />
      )}

      {/* ── Estática VHS durante el crash ────────────────── */}
      {crashed && (
        <div
          aria-hidden
          className="vhs-static pointer-events-none fixed inset-0 z-[30] opacity-40"
        >
          <div className="vhs-scanbar" />
          <div
            className="absolute left-[8%] top-[30%] h-[3px] w-[84%] bg-white/25"
            style={{ animation: "vhs-tear 0.22s linear infinite" }}
          />
          <div
            className="absolute left-[20%] top-[62%] h-[2px] w-[60%] bg-white/20"
            style={{ animation: "vhs-tear 0.31s linear infinite" }}
          />
        </div>
      )}

      {/* ── Mensaje críptico central ─────────────────────── */}
      {crashed && (
        <div className="pointer-events-none fixed inset-0 z-[35] flex items-center justify-center px-6">
          <div className="msg-flicker text-center">
            <p className="font-serif text-xl tracking-[0.35em] text-white sm:text-3xl">
              《 七日間 》
            </p>
            <p className="mt-4 text-xs font-bold uppercase tracking-[0.4em] text-red-300/90 sm:text-sm">
              7 DAYS
            </p>
            <p className="mt-2 text-[11px] uppercase tracking-[0.25em] text-neutral-300/80">
              ただの始まりに過ぎない…
            </p>
          </div>
        </div>
      )}

      {/* ── Nav ──────────────────────────────────────────── */}
      <span
        className="fixed left-5 top-5 z-50 text-xs text-white/20 sm:left-8 sm:top-8"
        style={{ fontVariantLigatures: "none" }}
      >
        ↳᭄۞⃟𝐆𝐋Լೄ
      </span>

      <a
        href="/"
        className="group fixed right-5 top-5 z-50 flex items-center gap-1.5 rounded-full border border-white/10 bg-white/5 px-3 py-1.5 text-[10px] font-medium tracking-widest text-white/30 backdrop-blur-md transition-all hover:border-[#6B1420]/40 hover:text-white/60 sm:right-8 sm:top-8"
      >
        <X className="size-3.5 text-[#6B1420]/80 transition-transform duration-300 group-hover:rotate-90" />
        CERRAR
      </a>

      {/* ── Sección 1: Hero ──────────────────────────────── */}
      <section className="relative z-10 flex min-h-[92vh] flex-col items-center justify-center px-6 pb-24 pt-28 text-center">
        <div className="cam-tremor mb-6">
          <div className="relative h-24 w-24 overflow-hidden rounded-full border-2 border-[#6B1420]/40 bg-black/60 shadow-[0_0_40px_rgba(107,20,32,0.3)]">
            <img
              src="/images/members/Darky/avatar.jpg"
              alt={member.displayName}
              className="h-full w-full object-cover select-none grayscale"
            />
          </div>
        </div>

        <h1
          className="max-w-full font-sans text-3xl font-extrabold tracking-wide text-neutral-100 sm:text-5xl lg:text-6xl"
          style={{ fontVariantLigatures: "none", wordBreak: "break-word" }}
        >
          <button
            onClick={triggerCrash}
            className="name-glitch cursor-pointer rounded-sm px-2 py-1 transition-transform hover:scale-[1.02]"
            title="CLIC: la cinta se rebobina..."
          >
            ↳᭄۞⃟ೄ┆¡!𝔻𝐴ℛ𝕂𝑌«~♡ [東京喰種]
          </button>
        </h1>

        <div className="mt-6 inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/[0.04] px-4 py-1.5 backdrop-blur-sm">
          <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-[#6B1420]" />
          <span className="text-[11px] uppercase tracking-[0.25em] text-neutral-400">
            {member.role}
          </span>
        </div>
      </section>

      {/* ── Sección 2: El Templo Maldito ─────────────────── */}
      <section className="relative z-10 mx-auto max-w-6xl px-6 pb-28 sm:px-10">
        <div className="relative overflow-hidden rounded-2xl border border-neutral-800/80 shadow-[0_0_80px_rgba(0,0,0,0.6)]">
          <div className="relative aspect-[16/10] w-full sm:aspect-[21/10]">
            <img
              src="/images/members/Darky/alt-bg.jpg"
              alt="Catedral de ángeles"
              className="absolute inset-0 h-full w-full object-cover select-none"
              style={{
                filter: "saturate(0.45) contrast(1.08) brightness(0.85)",
              }}
              loading="lazy"
            />
            {/* viñetas oscuras + fundido etéreo */}
            <div
              aria-hidden
              className="absolute inset-0"
              style={{
                background:
                  "radial-gradient(ellipse at center, transparent 30%, rgba(5,5,6,0.55) 78%, rgba(5,5,6,0.92) 100%)",
              }}
            />
            <div
              aria-hidden
              className="absolute inset-0"
              style={{
                background:
                  "linear-gradient(180deg, rgba(5,5,6,0.85) 0%, transparent 30%, transparent 62%, rgba(5,5,6,0.9) 100%)",
              }}
            />
          </div>

          {/* manifiesto superpuesto */}
          <div className="absolute inset-x-0 bottom-0 p-6 sm:p-10">
            <p className="text-[10px] uppercase tracking-[0.4em] text-neutral-500">
              El Santuario Gótico
            </p>
            <h2 className="mt-2 font-serif text-3xl italic text-neutral-100 sm:text-5xl">
              <span className="chroma">
                壁の中では、白い鴉はもう歌わない。
              </span>
            </h2>
            <p className="mt-3 max-w-xl text-sm leading-relaxed text-neutral-400">
              Algunas almas no saben morir; se quedan a mirar desde las grietas
              del mármol. Susurran en kanji antiguo, rozan el lente, tiemblan
              entre la luz y el eco del cementerio de las nubes.
            </p>
          </div>
        </div>
      </section>

      {/* ── Sección 3: La Cámara de las Almas ────────────── */}
      <section className="relative z-10 mx-auto max-w-6xl px-6 pb-32 sm:px-10">
        <p className="text-center text-[10px] uppercase tracking-[0.4em] text-neutral-500">
          Galería
        </p>
        <h2 className="chroma mt-3 text-center font-serif text-3xl italic text-neutral-100 sm:text-4xl">
          アルバム・オブ・ソウルズ
        </h2>

        <div className="mt-12 grid grid-cols-2 gap-4 sm:grid-cols-3 sm:gap-6">
          {GALLERY.map((src, i) => (
            <div
              key={i}
              className="group relative overflow-hidden rounded-xl border border-neutral-800 bg-black/60 backdrop-blur-xl"
            >
              <div
                className={`relative overflow-hidden ${
                  i % 3 === 1 ? "aspect-[3/4]" : "aspect-square"
                }`}
              >
                <img
                  src={src}
                  alt=""
                  className="h-full w-full object-cover select-none transition-transform duration-500 group-hover:scale-110"
                  style={{ filter: "grayscale(0.55)" }}
                  loading="lazy"
                />
                {/* micro-glitch RGB al hover */}
                <span
                  aria-hidden
                  className="pointer-events-none absolute inset-0 opacity-0 transition-opacity duration-200 group-hover:opacity-100"
                >
                  <img
                    src={src}
                    alt=""
                    className="absolute inset-0 h-full w-full object-cover"
                    style={{
                      filter:
                        "grayscale(0.55) hue-rotate(-40deg) saturate(1.6)",
                      mixBlendMode: "screen",
                      opacity: 0.55,
                      animation: "glitch-a 0.35s steps(2) infinite",
                    }}
                  />
                  <img
                    src={src}
                    alt=""
                    className="absolute inset-0 h-full w-full object-cover"
                    style={{
                      filter: "grayscale(0.55) hue-rotate(40deg) saturate(1.6)",
                      mixBlendMode: "screen",
                      opacity: 0.55,
                      animation: "glitch-b 0.28s steps(2) infinite",
                    }}
                  />
                </span>
                <div
                  aria-hidden
                  className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-transparent opacity-0 transition-opacity duration-300 group-hover:opacity-100"
                />
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* ── Reproductor Liquid Glass ─────────────────────── */}
      <audio
        ref={audioRef}
        src={TRACKS[0].src}
        preload="none"
        onTimeUpdate={(e) => setProgress(e.currentTarget.currentTime)}
        onLoadedMetadata={(e) => setDuration(e.currentTarget.duration)}
        onPlay={() => setIsPlaying(true)}
        onPause={() => setIsPlaying(false)}
        onEnded={() => go(1)}
      />

      {mounted &&
        (expanded ? (
          <div className="fixed bottom-4 right-4 z-30 w-[min(92vw,440px)]">
            <div className="rounded-2xl border border-neutral-600/30 bg-black/70 p-5 text-neutral-200 shadow-2xl backdrop-blur-2xl">
              {/* cabecera */}
              <div className="flex items-center gap-3">
                <div className="relative h-14 w-14 shrink-0 overflow-hidden rounded-lg border border-neutral-700/50">
                  <img
                    src="/images/members/Darky/alt-bg.jpg"
                    alt=""
                    className="h-full w-full object-cover select-none grayscale"
                  />
                </div>
                <div className="min-w-0 flex-1 text-left">
                  <p className="truncate text-sm font-semibold">
                    {activeTrack.title}
                  </p>
                  <p className="truncate text-xs text-neutral-500">
                    {activeTrack.artist}
                  </p>
                </div>
                <div className="flex items-center gap-1.5">
                  <button
                    onClick={() => go(-1)}
                    className="rounded-full p-2 text-neutral-400 transition-colors hover:bg-neutral-800/60 hover:text-neutral-100"
                    title="Anterior"
                  >
                    <SkipBack className="size-4" />
                  </button>
                  <button
                    onClick={togglePlay}
                    className="flex h-11 w-11 items-center justify-center rounded-full bg-neutral-100 text-black shadow-lg transition-transform hover:scale-105 active:scale-95"
                    title={isPlaying ? "Pausar" : "Reproducir"}
                  >
                    {isPlaying ? (
                      <Pause className="size-4 fill-current" />
                    ) : (
                      <Play className="ml-0.5 size-4 fill-current" />
                    )}
                  </button>
                  <button
                    onClick={() => go(1)}
                    className="rounded-full p-2 text-neutral-400 transition-colors hover:bg-neutral-800/60 hover:text-neutral-100"
                    title="Siguiente"
                  >
                    <SkipForward className="size-4" />
                  </button>
                </div>
              </div>

              {/* barra de tiempo interactiva */}
              <div className="mt-4 flex items-center gap-2">
                <span className="w-9 text-right text-[10px] tabular-nums text-neutral-500">
                  {fmtTime(progress)}
                </span>
                <input
                  type="range"
                  min={0}
                  max={duration || 0}
                  step={0.1}
                  value={progress}
                  onChange={seek}
                  className="h-1 w-full cursor-pointer accent-neutral-300"
                />
                <span className="w-9 text-left text-[10px] tabular-nums text-neutral-500">
                  {fmtTime(duration)}
                </span>
              </div>

              {/* tracklist */}
              <div className="mt-4 divide-y divide-neutral-700/30 rounded-lg border border-neutral-800/60">
                {TRACKS.map((t, i) => (
                  <button
                    key={t.id}
                    onClick={() => selectTrack(t.id)}
                    className={`flex w-full items-center gap-3 px-3 py-2.5 text-left transition-colors hover:bg-neutral-900/60 ${
                      t.id === currentTrack ? "bg-neutral-900/40" : ""
                    }`}
                  >
                    <span className="w-6 text-[11px] tabular-nums text-neutral-500">
                      {String(i + 1).padStart(2, "0")}
                    </span>
                    <span className="min-w-0 flex-1 truncate text-xs">
                      {t.title}
                    </span>
                    <span className="text-[10px] tabular-nums text-neutral-500">
                      {t.duration}
                    </span>
                  </button>
                ))}
              </div>

              {/* colapsar */}
              <div className="mt-3 flex justify-center">
                <button
                  onClick={() => setExpanded(false)}
                  className="flex items-center gap-1 rounded-full border border-neutral-700/50 px-4 py-1 text-[10px] uppercase tracking-widest text-neutral-400 transition-colors hover:border-neutral-500 hover:text-neutral-100"
                  title="Colapsar"
                >
                  <Minus className="size-3.5" />
                </button>
              </div>
            </div>
          </div>
        ) : (
          <button
            onClick={() => setExpanded(true)}
            className="fixed bottom-4 right-4 z-30 flex cursor-pointer items-center gap-3 rounded-full border border-neutral-700/40 bg-neutral-950/50 px-4 py-1.5 backdrop-blur-xl transition-all hover:border-neutral-500/60"
            title="Abrir Liquid Glass"
          >
            <span className="flex h-3 items-end gap-[3px]">
              <span
                className={`eq-bar ${isPlaying ? "eq-active eq1" : ""}`}
                style={isPlaying ? undefined : { height: 4 }}
              />
              <span
                className={`eq-bar ${isPlaying ? "eq-active eq2" : ""}`}
                style={isPlaying ? undefined : { height: 4 }}
              />
              <span
                className={`eq-bar ${isPlaying ? "eq-active eq3" : ""}`}
                style={isPlaying ? undefined : { height: 4 }}
              />
            </span>
            <span className="max-w-[170px] truncate text-xs text-neutral-300">
              {activeTrack.title}
            </span>
            {isPlaying ? (
              <Pause className="size-3.5 shrink-0 text-neutral-400" />
            ) : (
              <Play className="size-3.5 shrink-0 text-neutral-400" />
            )}
            <ChevronUp className="size-3.5 shrink-0 text-neutral-500" />
          </button>
        ))}
    </main>
  );
}