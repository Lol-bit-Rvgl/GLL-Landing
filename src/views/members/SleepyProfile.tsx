"use client";

import { useState, useEffect, useRef } from "react";
import type { Member } from "@/data/members";
import { VT323 } from "next/font/google";
import { Play, Pause, ChevronLeft, ChevronRight } from "lucide-react";

const vhs = VT323({
  subsets: ["latin"],
  weight: ["400"],
  display: "swap",
});

const FX_STYLES = `
@keyframes vhsGrainShift {
  0% { background-position: 0 0; }
  25% { background-position: -48px 24px; }
  50% { background-position: 32px -40px; }
  75% { background-position: -24px -16px; }
  100% { background-position: 0 0; }
}
@keyframes trackingSweep {
  0%, 86% { transform: translateY(-32vh); opacity: 0; }
  88% { transform: translateY(-32vh); opacity: 0.55; }
  92% { transform: translateY(112vh); opacity: 0.55; }
  94%, 100% { transform: translateY(112vh); opacity: 0; }
}
@keyframes blinkStep {
  0%, 49% { opacity: 1; }
  50%, 100% { opacity: 0; }
}
@keyframes eqIdle {
  0%, 100% { transform: scaleY(0.25); }
  50% { transform: scaleY(0.65); }
}
.vhs-scanlines {
  background-image: repeating-linear-gradient(
    0deg,
    rgba(0,0,0,0.32) 0px,
    rgba(0,0,0,0.32) 1px,
    transparent 1px,
    transparent 3px
  );
}
.vhs-grain {
  background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='120' height='120'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='2'/%3E%3C/filter%3E%3Crect width='120' height='120' filter='url(%23n)' opacity='1'/%3E%3C/svg%3E");
  animation: vhsGrainShift 0.8s steps(2) infinite;
}
.tracking-bar { animation: trackingSweep 9s linear infinite; }
.osd-blink { animation: blinkStep 1s steps(1) infinite; }
.eq-idle { animation: eqIdle 1.1s ease-in-out infinite; transform-origin: bottom; }
.btn-retro {
  border: 2px solid;
  border-color: #71717a #09090b #09090b #71717a;
  background: linear-gradient(180deg, #3f3f46, #27272a);
  color: #f4f4f5;
}
.btn-retro:hover {
  box-shadow: 0 0 12px rgba(220,38,38,0.45);
  border-color: #ef4444 #09090b #09090b #ef4444;
}
.btn-retro:active {
  border-color: #09090b #71717a #71717a #09090b;
}
.chroma-soft {
  text-shadow: -1px 0 rgba(255,0,60,0.55), 1px 0 rgba(0,220,255,0.55);
}
.dot-pattern {
  background-image: radial-gradient(rgba(220,38,38,0.13) 1.2px, transparent 1.2px);
  background-size: 18px 18px;
}
`;

const VISITS = ["0", "6", "8", "4", "1", "1", "2", "7"];

const GAMES = [
  "Guilty Gear",
  "Hollow Knight",
  "Metal Gear",
  "Devil May Cry",
  "Bayonetta",
  "Omori",
  "Skullgirls",
  "OFF",
];

const HEAVY_ROTATION = [
  "Dope",
  "Slipknot",
  "Nirvana",
  "Deftones",
  "System of a Down",
  "Metallica",
  "Kittie",
  "Three Days Grace",
];

const SKETCHBOOK = [
  { src: "/images/members/sleepy/art/art-1.jpg", label: "Ilustración 01" },
  { src: "/images/members/sleepy/art/art-2.jpg", label: "Ilustración 02" },
  { src: "/images/members/sleepy/art/art-3.jpg", label: "Ilustración 03" },
  { src: "/images/members/sleepy/art/art-4.jpg", label: "Ilustración 04" },
  { src: "/images/members/sleepy/art/art-5.jpg", label: "Ilustración 05" },
];

const IM_REPLIES = [
  "hehe hii ^_^",
  "sorry, estaba dibujando~",
  "escuchaste lo nuevo de Dope??",
  "brb, mi foca interior me llama 💤",
  "que sueñes con calamares bonitos ᛝ",
];

const EQ_BARS = 16;

function fmtTime(s: number): string {
  const v = Math.max(0, Math.floor(s || 0));
  return `${Math.floor(v / 60)}:${String(v % 60).padStart(2, "0")}`;
}

function fmtClock(d: Date): string {
  const p = (n: number) => String(n).padStart(2, "0");
  return `${p(d.getHours())}:${p(d.getMinutes())}:${p(d.getSeconds())}`;
}

export function SleepyProfile({ member }: { member: Member }) {
  const [mounted, setMounted] = useState(false);
  const [clock, setClock] = useState("--:--:--");

  const [playing, setPlaying] = useState(false);
  const [progress, setProgress] = useState(0);
  const [duration, setDuration] = useState(0);
  const [audioMissing, setAudioMissing] = useState(false);

  const [artOpen, setArtOpen] = useState(false);
  const [artIndex, setArtIndex] = useState(0);

  const [isFriend, setIsFriend] = useState(false);
  const [imOpen, setImOpen] = useState(false);
  const [imLog, setImLog] = useState<string[]>(["seal_girl: hiii ^_^"]);
  const [imDraft, setImDraft] = useState("");
  const [imCount, setImCount] = useState(0);

  const [cardNum, setCardNum] = useState("");
  const [cardExp, setCardExp] = useState("");
  const [cardMsg, setCardMsg] = useState("");

  const audioRef = useRef<HTMLAudioElement | null>(null);
  const barsRef = useRef<(HTMLSpanElement | null)[]>([]);
  const analyserRef = useRef<AnalyserNode | null>(null);
  const rafRef = useRef(0);
  const ctxRef = useRef<AudioContext | null>(null);

  useEffect(() => {
    setMounted(true);
    return () => {
      cancelAnimationFrame(rafRef.current);
      if (ctxRef.current) {
        ctxRef.current.close().catch(() => {});
        ctxRef.current = null;
      }
    };
  }, []);

  /* ── Reloj OSD (solo cliente) ────────────────────────── */
  useEffect(() => {
    if (!mounted) return;
    setClock(fmtClock(new Date()));
    const id = setInterval(() => setClock(fmtClock(new Date())), 1000);
    return () => clearInterval(id);
  }, [mounted]);

  /* ── Escape cierra la galería + bloqueo de scroll ────── */
  useEffect(() => {
    if (!artOpen) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setArtOpen(false);
    };
    window.addEventListener("keydown", onKey);
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      window.removeEventListener("keydown", onKey);
      document.body.style.overflow = prev;
    };
  }, [artOpen]);

  /* ── Ecualizador reactivo vía AnalyserNode ───────────── */
  const startEqLoop = () => {
    const analyser = analyserRef.current;
    if (!analyser) return;
    const data = new Uint8Array(analyser.frequencyBinCount);
    const loop = () => {
      analyser.getByteFrequencyData(data);
      const step = Math.max(1, Math.floor(data.length / EQ_BARS));
      for (let i = 0; i < EQ_BARS; i++) {
        const el = barsRef.current[i];
        if (el) el.style.transform = `scaleY(${0.08 + (data[i * step] / 255) * 0.92})`;
      }
      rafRef.current = requestAnimationFrame(loop);
    };
    cancelAnimationFrame(rafRef.current);
    rafRef.current = requestAnimationFrame(loop);
  };

  const stopEqLoop = () => {
    cancelAnimationFrame(rafRef.current);
    barsRef.current.forEach((el) => {
      if (el) el.style.transform = "";
    });
  };

  const ensureAnalyser = (): boolean => {
    if (analyserRef.current) return true;
    const a = audioRef.current;
    if (!a) return false;
    try {
      const AC =
        window.AudioContext ||
        (window as unknown as { webkitAudioContext: typeof AudioContext })
          .webkitAudioContext;
      if (!AC) return false;
      const ctx = ctxRef.current ?? new AC();
      ctxRef.current = ctx;
      if (ctx.state === "suspended") void ctx.resume();
      const src = ctx.createMediaElementSource(a);
      const analyser = ctx.createAnalyser();
      analyser.fftSize = 64;
      analyser.smoothingTimeConstant = 0.75;
      src.connect(analyser);
      analyser.connect(ctx.destination);
      analyserRef.current = analyser;
      return true;
    } catch {
      return false;
    }
  };

  const togglePlay = () => {
    const a = audioRef.current;
    if (!a || audioMissing) return;
    if (a.paused) {
      if (ensureAnalyser()) startEqLoop();
      a.play().catch(() => {});
    } else {
      a.pause();
    }
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

  const openArt = (i: number) => {
    setArtIndex(i);
    setArtOpen(true);
  };

  const sendIm = () => {
    const text = imDraft.trim();
    if (!text) return;
    setImLog((log) => [...log, `tu: ${text}`]);
    setImDraft("");
    const reply = IM_REPLIES[imCount % IM_REPLIES.length];
    setImCount((c) => c + 1);
    setTimeout(() => {
      setImLog((log) => [...log, `seal_girl: ${reply}`]);
    }, 700);
  };

  const submitCard = (e: React.FormEvent) => {
    e.preventDefault();
    if (!cardNum.trim() || !cardExp.trim()) {
      setCardMsg("la cinta exige TODOS los datos... mentira, ni los quiero.");
      return;
    }
    setCardMsg("sike! tus secretos están a salvo (probablemente).");
    setCardNum("");
    setCardExp("");
  };

  return (
    <main id="top" className="relative min-h-screen overflow-x-clip bg-[#0a0a0c] text-[#f4f4f5]">
      <style>{FX_STYLES}</style>

      {/* ── Textura retro del fondo ─────────────────────── */}
      <div aria-hidden className="dot-pattern pointer-events-none fixed inset-0 z-0" />
      <div
        aria-hidden
        className="pointer-events-none fixed inset-0 z-0"
        style={{
          background:
            "linear-gradient(180deg, rgba(153,27,27,0.12) 0%, transparent 30%, transparent 70%, rgba(153,27,27,0.14) 100%)",
        }}
      />

      {/* ── CAPA VHS (no bloqueante) ────────────────────── */}
      <div aria-hidden className="pointer-events-none fixed inset-0 z-40">
        <div className="vhs-scanlines absolute inset-0" />
        <div className="vhs-grain absolute inset-0 opacity-[0.14]" />
        {/* ruido de tracking esporádico */}
        <div className="absolute inset-x-0 top-0 overflow-hidden">
          <div
            className="tracking-bar h-16 w-full"
            style={{
              background:
                "linear-gradient(180deg, transparent, rgba(255,255,255,0.5) 45%, rgba(255,255,255,0.7) 50%, rgba(255,255,255,0.5) 55%, transparent)",
            }}
          />
        </div>
        {/* telemetría OSD */}
        <div className={`absolute left-3 top-2 flex items-center gap-2 text-[#22c55e] ${vhs.className}`}>
          <span className="text-lg leading-none drop-shadow-[0_0_6px_rgba(34,197,94,0.8)]">PLAY ▶</span>
          <span className="text-lg leading-none">SP</span>
        </div>
        <div className={`absolute right-3 top-2 flex items-center gap-2 text-[#22c55e] ${vhs.className}`}>
          <span className="osd-blink text-lg leading-none text-red-500 drop-shadow-[0_0_6px_rgba(239,68,68,0.8)]">●</span>
          <span className="text-lg leading-none drop-shadow-[0_0_6px_rgba(34,197,94,0.8)]">REC {clock}</span>
        </div>
      </div>

      {/* ── Barra SPACEHEY // GLL NET ───────────────────── */}
      <header className="relative z-10 border-b-2 border-[#b91c1c] bg-gradient-to-r from-[#991b1b] via-[#7f1d1d] to-[#450a0a] text-white">
        <div className="mx-auto flex max-w-5xl flex-wrap items-center gap-x-4 gap-y-2 px-4 py-2.5 sm:px-6">
          <a href="/" className={`chroma-soft text-2xl font-bold leading-none tracking-wider text-white drop-shadow-[1px_1px_0_rgba(0,0,0,0.4)] ${vhs.className}`}>
            spacehey<span className="text-[#f87171]">//</span>gll.net
          </a>
          <nav className="flex flex-wrap items-center gap-x-4 gap-y-1 text-[13px]">
            <a href="#top" className="underline underline-offset-2 text-[#fecaca] hover:text-white">Home</a>
            <a href="#interests" className="underline underline-offset-2 text-[#fecaca] hover:text-white">Browse</a>
            <a href="#rotation" className="underline underline-offset-2 text-[#fecaca] hover:text-white">Search</a>
            <a href="#about" className="underline underline-offset-2 text-[#fecaca] hover:text-white">Bulletins</a>
            <a href="#gallery" className="underline underline-offset-2 text-[#fecaca] hover:text-white">Art Wall</a>
            <a href="/" className="underline underline-offset-2 text-[#fecaca] hover:text-white">Roster</a>
          </nav>
          <a
            href="/"
            className="btn-retro ml-auto px-2.5 py-1 text-xs font-bold"
          >
            [ ← GLL // ROSTER ]
          </a>
        </div>
      </header>

      {/* ── Contador + timestamp ────────────────────────── */}
      <div className="relative z-10 mx-auto flex max-w-5xl flex-wrap items-center justify-between gap-2 px-4 pt-3 sm:px-6">
        <div className={`flex items-center gap-1 ${vhs.className}`} aria-label="Contador de visitas 06841127">
          {VISITS.map((d, i) => (
            <span
              key={i}
              className="border border-[#7f1d1d] bg-black px-1.5 py-0.5 text-lg leading-none text-[#f87171]"
            >
              {d}
            </span>
          ))}
          <span className="ml-1 text-sm text-[#f87171]">visits ^_^</span>
        </div>
        <p className={`text-sm tracking-widest text-[#f87171] ${vhs.className}`}>
          LAST UPDATED: 2026-09-19
        </p>
      </div>

      {/* ── Layout 2 columnas ───────────────────────────── */}
      <div className="relative z-10 mx-auto grid max-w-5xl gap-5 px-4 pb-16 pt-4 sm:px-6 lg:grid-cols-[290px_1fr]">
        {/* ═══ Columna izquierda: sidebar ═══ */}
        <aside className="space-y-5">
          {/* Caja de perfil */}
          <section className="border-2 border-[#991b1b] bg-[#18181b] shadow-[3px_3px_0_rgba(153,27,27,0.5)]">
            <div className="bg-gradient-to-r from-[#991b1b] to-[#7f1d1d] px-2.5 py-1 text-sm font-bold text-white chroma-soft">
              sleepy ^_^
            </div>
            <div className="p-3">
              <div className="border-2 border-[#991b1b] bg-[#0f0f12] p-1.5">
                <img
                  src="/images/members/sleepy/avatar.jpg"
                  alt={member.displayName}
                  className="h-auto w-full select-none"
                  loading="eager"
                />
              </div>
              <p className="mt-2 text-center text-[13px] italic leading-snug text-[#e4e4e7]">
                “resident seal girl of spacehey ᛝ tu amiguito eslipicito ^_^”
              </p>
              <div className="mt-2 space-y-1 border-t border-dashed border-[#991b1b] pt-2 text-[13px]">
                <p>
                  <span className="font-bold text-[#f87171]">Mood:</span> sleepy 💤
                </p>
                <p className="flex items-center gap-1.5">
                  <span className="inline-block h-2 w-2 rounded-full bg-green-500" />
                  <span className="font-bold text-green-700">ONLINE</span>
                </p>
              </div>
            </div>
          </section>

          {/* CONTACT ME */}
          <section id="contact" className="border-2 border-[#991b1b] bg-[#18181b] shadow-[3px_3px_0_rgba(153,27,27,0.5)]">
            <div className="bg-gradient-to-r from-[#991b1b] to-[#7f1d1d] px-2.5 py-1 text-sm font-bold text-white">
              CONTACT ME ☆
            </div>
            <div className="space-y-2 p-3">
              <button onClick={() => setIsFriend((f) => !f)} className="btn-retro w-full px-2 py-1.5 text-[13px] font-bold">
                {isFriend ? "★ Friends! ★" : "+ Add to Friends"}
              </button>
              <button onClick={() => setImOpen((o) => !o)} className="btn-retro w-full px-2 py-1.5 text-[13px] font-bold">
                ✉ Instant Message
              </button>
              <button onClick={() => openArt(0)} className="btn-retro w-full px-2 py-1.5 text-[13px] font-bold">
                ✎ Art Sketchbook
              </button>

              {mounted && imOpen && (
                <div className="border-2 border-[#991b1b] bg-[#0f0f12]">
                  <div className="bg-[#7f1d1d] px-2 py-0.5 text-xs font-bold text-white">
                    seal_girl — online ^_^
                  </div>
                  <div className="h-32 space-y-1 overflow-y-auto p-2 text-[13px] leading-snug">
                    {imLog.map((line, i) => (
                      <p key={i} className={line.startsWith("tu:") ? "text-right text-[#f87171]" : "text-[#f4f4f5]"}>
                        {line}
                      </p>
                    ))}
                  </div>
                  <div className="flex gap-1 border-t border-[#3f3f46] p-1.5">
                    <input
                      value={imDraft}
                      onChange={(e) => setImDraft(e.target.value)}
                      onKeyDown={(e) => {
                        if (e.key === "Enter") sendIm();
                      }}
                      placeholder="escribe algo..."
                      className="min-w-0 flex-1 border border-[#52525b] bg-[#18181b] px-1.5 py-1 text-[13px] outline-none focus:border-[#ef4444]"
                    />
                    <button onClick={sendIm} className="btn-retro px-2 py-1 text-xs font-bold">
                      ➤
                    </button>
                  </div>
                </div>
              )}
            </div>
          </section>

          {/* Reproductor retro */}
          {mounted && (
            <section id="music" className="border-2 border-[#991b1b] bg-[#18181b] shadow-[3px_3px_0_rgba(153,27,27,0.5)]">
              <div className="bg-gradient-to-r from-[#991b1b] to-[#7f1d1d] px-2.5 py-1 text-sm font-bold text-white">
                ♪ NOW PLAYING
              </div>
              <div className="p-3">
                <div className="flex items-center gap-2.5">
                  <img
                    src="/images/members/sleepy/dope-cover.jpg"
                    alt="Dope — No Regrets"
                    className="h-14 w-14 shrink-0 select-none border border-[#52525b]"
                  />
                  <div className="min-w-0 flex-1">
                    <p className="truncate text-[13px] font-bold leading-tight">Dope — Nothing For Me Here</p>
                    <p className="text-xs text-[#a1a1aa]">No Regrets (2009)</p>
                  </div>
                  <button
                    onClick={togglePlay}
                    aria-label={playing ? "Pausar" : "Reproducir"}
                    className="btn-retro flex h-9 w-9 shrink-0 items-center justify-center"
                  >
                    {playing ? <Pause className="size-4" /> : <Play className="size-4" />}
                  </button>
                </div>

                {audioMissing ? (
                  <p className="mt-2 border border-dashed border-red-400 bg-red-50 px-2 py-1 text-xs text-red-600">
                    audio no encontrado (´･ω･`)
                  </p>
                ) : (
                  <div className="mt-2 flex items-center gap-1.5">
                    <span className="text-[11px] tabular-nums text-[#a1a1aa]">{fmtTime(progress)}</span>
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
                      className="h-2.5 flex-1 cursor-pointer border border-[#52525b] bg-[#27272a]"
                      style={{ borderStyle: "inset" }}
                    >
                      <div
                        className="h-full bg-gradient-to-r from-[#991b1b] to-[#ef4444]"
                        style={{ width: `${duration ? (progress / duration) * 100 : 0}%` }}
                      />
                    </div>
                    <span className="text-[11px] tabular-nums text-[#a1a1aa]">{fmtTime(duration)}</span>
                  </div>
                )}

                {/* ecualizador minimalista */}
                <div className="mt-2 flex h-8 items-end justify-center gap-[3px] border border-[#3f3f46] bg-[#0f0f12] px-2 pb-1 pt-1">
                  {Array.from({ length: EQ_BARS }, (_, i) => (
                    <span
                      key={i}
                      ref={(el) => {
                        barsRef.current[i] = el;
                      }}
                      className={`w-full max-w-[10px] flex-1 bg-[#dc2626] ${playing ? "" : "eq-idle"}`}
                      style={{
                        height: "100%",
                        transformOrigin: "bottom",
                        animationDelay: `${(i % 5) * 0.12}s`,
                        ...(playing ? { transform: "scaleY(0.08)" } : {}),
                      }}
                    />
                  ))}
                </div>
              </div>
            </section>
          )}

          <audio
            ref={audioRef}
            src="/images/members/sleepy/audio.mp3"
            preload="metadata"
            onTimeUpdate={(e) => setProgress(e.currentTarget.currentTime)}
            onLoadedMetadata={(e) => setDuration(e.currentTarget.duration)}
            onPlay={() => setPlaying(true)}
            onPause={() => {
              setPlaying(false);
              stopEqLoop();
            }}
            onEnded={() => {
              setPlaying(false);
              stopEqLoop();
            }}
            onError={() => setAudioMissing(true)}
          />
        </aside>

        {/* ═══ Columna derecha: feed ═══ */}
        <div className="min-w-0 space-y-5">
          {/* Ventana About Me */}
          <section id="about" className="border-2 border-[#991b1b] bg-[#18181b] shadow-[3px_3px_0_rgba(153,27,27,0.5)]">
            <div className="flex items-center justify-between bg-gradient-to-r from-[#991b1b] to-[#7f1d1d] px-2.5 py-1 text-sm font-bold text-white">
              <span>◦ About Me ☆</span>
              <span className="flex gap-1" aria-hidden>
                <span className="btn-retro px-1.5 text-[10px] leading-tight">_</span>
                <span className="btn-retro px-1.5 text-[10px] leading-tight">□</span>
                <span className="btn-retro px-1.5 text-[10px] leading-tight">X</span>
              </span>
            </div>
            <div className="space-y-3 p-4 text-sm leading-relaxed text-[#e4e4e7]">
              <p className="font-semibold text-[#f87171]">
                ᛝ ¡Hola! Soy Sleepy, resident seal girl y artista del clan GLL ^_^
              </p>
              <p>
                Me encanta dibujar, escuchar música alternativa / grunge de los 2000s, jugar Guilty Gear, Omori y coleccionar chatarra digital.
              </p>
              <p className="text-xs text-[#a1a1aa] italic">
                &quot;don&apos;t wake me up unless there&apos;s coffee, burgers, or new sketchbooks.&quot;
              </p>
            </div>
          </section>

          {/* Widget Totally Not Malware */}
          <section className="border-2 border-[#991b1b] bg-[#18181b] shadow-[3px_3px_0_rgba(153,27,27,0.5)]">
            <div className="flex items-center justify-between bg-gradient-to-r from-[#991b1b] to-[#7f1d1d] px-2.5 py-1 text-sm font-bold text-white">
              <span>⚠ Totally Not Malware</span>
              <span className="flex gap-1" aria-hidden>
                <span className="btn-retro px-1.5 text-[10px] leading-tight">_</span>
                <span className="btn-retro px-1.5 text-[10px] leading-tight">X</span>
              </span>
            </div>
            <div className="p-4">
              <img
                src="/images/members/sleepy/malware-popup.gif"
                alt="Definitivamente no es malware"
                className="mx-auto h-auto w-full max-w-sm select-none border border-[#52525b]"
                loading="lazy"
              />
              <form onSubmit={submitCard} className="mx-auto mt-3 max-w-sm space-y-2">
                <label className="block text-xs font-bold text-[#a1a1aa]">
                  Card number (confía)
                  <input
                    value={cardNum}
                    onChange={(e) => setCardNum(e.target.value)}
                    placeholder="0000 0000 0000 0000"
                    inputMode="numeric"
                    className="mt-0.5 w-full border-2 border-[#52525b] bg-[#0f0f12] px-2 py-1 text-sm outline-none focus:border-[#ef4444]"
                  />
                </label>
                <label className="block text-xs font-bold text-[#a1a1aa]">
                  Expiry date
                  <input
                    value={cardExp}
                    onChange={(e) => setCardExp(e.target.value)}
                    placeholder="MM/YY"
                    className="mt-0.5 w-full border-2 border-[#52525b] bg-[#0f0f12] px-2 py-1 text-sm outline-none focus:border-[#ef4444]"
                  />
                </label>
                <button type="submit" className="btn-retro w-full px-2 py-1.5 text-[13px] font-bold">
                  [ Cancelar / Th-thanks ]
                </button>
                {cardMsg && (
                  <p className="border border-dashed border-[#991b1b] bg-red-950/30 px-2 py-1.5 text-center text-[13px] italic text-[#f87171]">
                    {cardMsg}
                  </p>
                )}
              </form>
            </div>
          </section>

          {/* Interests & Media */}
          <section id="interests" className="border-2 border-[#991b1b] bg-[#18181b] shadow-[3px_3px_0_rgba(153,27,27,0.5)]">
            <div className="bg-gradient-to-r from-[#991b1b] to-[#7f1d1d] px-2.5 py-1 text-sm font-bold text-white">
              ★ Interests &amp; Media
            </div>
            <div className="grid gap-4 p-4 sm:grid-cols-2">
              <div>
                <p className={`text-lg text-[#f87171] ${vhs.className}`}>▸ Gaming Vault</p>
                <ul className="mt-1.5 space-y-1 text-sm">
                  {GAMES.map((g) => (
                    <li key={g} className="flex items-center gap-1.5">
                      <span className="text-[#ef4444]">▪</span> {g}
                    </li>
                  ))}
                </ul>
              </div>
              <div id="rotation">
                <p className={`text-lg text-[#f87171] ${vhs.className}`}>▸ Heavy Rotation</p>
                <ul className="mt-1.5 space-y-1 text-sm">
                  {HEAVY_ROTATION.map((b) => (
                    <li key={b} className="flex items-center gap-1.5">
                      <span className="text-[#ef4444]">♪</span> {b}
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </section>

          {/* Galería de arte */}
          <section id="gallery" className="border-2 border-[#991b1b] bg-[#18181b] shadow-[3px_3px_0_rgba(153,27,27,0.5)]">
            <div className="bg-gradient-to-r from-[#991b1b] to-[#7f1d1d] px-2.5 py-1 text-sm font-bold text-white">
              ✎ Sketchbook de Sleepy <span className="font-normal opacity-80">(clic para ampliar)</span>
            </div>
            <div className="grid grid-cols-3 gap-2 p-3 sm:grid-cols-5">
              {SKETCHBOOK.map((s, i) => (
                <button
                  key={s.src}
                  onClick={() => openArt(i)}
                  className="group border-2 border-[#3f3f46] bg-[#0f0f12] p-1 transition-colors hover:border-[#ef4444]"
                  title={s.label}
                >
                  <img
                    src={s.src}
                    alt={s.label}
                    loading="lazy"
                    className="aspect-square h-auto w-full select-none object-cover transition-transform group-hover:scale-[1.03]"
                  />
                  <span className={`block pt-0.5 text-center text-xs text-[#a1a1aa] ${vhs.className}`}>
                    {String(i + 1).padStart(2, "0")}
                  </span>
                </button>
              ))}
            </div>
          </section>

          <footer className={`pb-2 text-center text-sm text-[#f87171] ${vhs.className}`}>
            © sleepy ^_^ · best viewed at 800x600 · no se aceptan devoluciones de trazos
          </footer>
        </div>
      </div>

      {/* ── Pestañas verticales (bookmarks) ─────────────── */}
      <nav aria-label="Bookmarks" className="fixed right-1 top-1/3 z-30 hidden flex-col gap-1 lg:flex">
        {[
          { label: "INTERESTS", href: "#interests" },
          { label: "ART", href: "#gallery" },
          { label: "MUSIC", href: "#music" },
        ].map((t) => (
          <a
            key={t.label}
            href={t.href}
            className="border-2 border-black bg-[#7f1d1d] px-1 py-2 text-xs font-bold tracking-widest text-white shadow-[2px_2px_0_rgba(0,0,0,0.6)] transition-colors hover:bg-[#991b1b] hover:shadow-[0_0_12px_rgba(220,38,38,0.5)]"
            style={{ writingMode: "vertical-rl" }}
          >
            {t.label}
          </a>
        ))}
        <a
          href="/"
          className="border-2 border-black bg-[#450a0a] px-1 py-2 text-xs font-bold tracking-widest text-white shadow-[2px_2px_0_rgba(0,0,0,0.6)] transition-colors hover:bg-[#7f1d1d]"
          style={{ writingMode: "vertical-rl" }}
        >
          ROSTER
        </a>
      </nav>

      {/* ── Modal: visor de arte ────────────────────────── */}
      {mounted && artOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/85 p-4">
          <div className="w-full max-w-3xl border-2 border-[#991b1b] bg-[#18181b] shadow-[5px_5px_0_rgba(153,27,27,0.55)]">
            <div className="flex items-center justify-between bg-gradient-to-r from-[#991b1b] to-[#7f1d1d] px-2.5 py-1 text-sm font-bold text-white">
              <span>
                {SKETCHBOOK[artIndex].label} — {String(artIndex + 1).padStart(2, "0")} /{" "}
                {String(SKETCHBOOK.length).padStart(2, "0")}
              </span>
              <button
                onClick={() => setArtOpen(false)}
                className="btn-retro px-2 py-0.5 text-[11px]"
              >
                [ ESC / CERRAR ]
              </button>
            </div>
            <div className="flex items-center gap-2 p-3">
              <button
                onClick={() => setArtIndex((i) => (i - 1 + SKETCHBOOK.length) % SKETCHBOOK.length)}
                aria-label="Anterior"
                className="btn-retro flex h-10 w-10 shrink-0 items-center justify-center"
              >
                <ChevronLeft className="size-5" />
              </button>
              <div className="flex min-h-[40vh] flex-1 items-center justify-center border border-[#3f3f46] bg-[#0f0f12] sm:min-h-[55vh]">
                <img
                  key={SKETCHBOOK[artIndex].src}
                  src={SKETCHBOOK[artIndex].src}
                  alt={SKETCHBOOK[artIndex].label}
                  className="max-h-[55vh] w-full select-none object-contain sm:max-h-[65vh]"
                />
              </div>
              <button
                onClick={() => setArtIndex((i) => (i + 1) % SKETCHBOOK.length)}
                aria-label="Siguiente"
                className="btn-retro flex h-10 w-10 shrink-0 items-center justify-center"
              >
                <ChevronRight className="size-5" />
              </button>
            </div>
          </div>
        </div>
      )}
    </main>
  );
}
