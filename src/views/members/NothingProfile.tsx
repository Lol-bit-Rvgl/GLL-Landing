"use client";

import { useState, useEffect, useRef } from "react";
import type { Member } from "@/data/members";
import { Pause, Volume2, VolumeX } from "lucide-react";

const FX_STYLES = `
@keyframes spriteBob {
  0%, 100% { transform: translateY(0); }
  50% { transform: translateY(-6px); }
}
@keyframes spriteTalk {
  0%, 100% { transform: translateY(0) rotate(-1deg); }
  50% { transform: translateY(-8px) rotate(1deg); }
}
@keyframes spriteTremor {
  0% { transform: translate(-2px, 1px); }
  25% { transform: translate(2px, -2px); }
  50% { transform: translate(-3px, -1px); }
  75% { transform: translate(3px, 2px); }
  100% { transform: translate(-2px, 1px); }
}
@keyframes rgbSplit {
  0%, 100% { filter: drop-shadow(-3px 0 rgba(255,0,0,0.85)) drop-shadow(3px 0 rgba(0,255,255,0.85)); }
  50% { filter: drop-shadow(3px 0 rgba(255,0,0,0.85)) drop-shadow(-3px 0 rgba(0,255,255,0.85)); }
}
@keyframes staticShift {
  0% { background-position: 0 0; }
  100% { background-position: 64px 64px; }
}
@keyframes cursorBlink {
  0%, 49% { opacity: 1; }
  50%, 100% { opacity: 0; }
}
@keyframes phoneRing {
  0%, 100% { transform: rotate(8deg); }
  50% { transform: rotate(4deg); }
}
.pose-idle { animation: spriteBob 1.6s ease-in-out infinite; }
.pose-talk { animation: spriteTalk 0.5s ease-in-out infinite; }
.pose-grin { animation: spriteBob 0.9s ease-in-out infinite; }
.pose-static { animation: spriteTremor 0.18s steps(2) infinite, rgbSplit 0.3s steps(2) infinite; }
.tv-static {
  background-image: repeating-linear-gradient(
    0deg,
    rgba(255,255,255,0.7) 0px,
    rgba(255,255,255,0.7) 1px,
    transparent 1px,
    transparent 3px
  );
  animation: staticShift 0.25s linear infinite;
}
.cursor-blink { animation: cursorBlink 0.8s steps(1) infinite; }
.phone-ring { animation: phoneRing 1.2s ease-in-out infinite; }
@keyframes stringTension {
  from { transform: translateX(-4px) skewX(-1.2deg); }
  to { transform: translateX(4px) skewX(1.2deg); }
}
@keyframes screenFlicker {
  0%, 100% { opacity: 0.85; }
  8% { opacity: 0.3; }
  10% { opacity: 0.9; }
  36% { opacity: 0.85; }
  38% { opacity: 0.4; }
  40% { opacity: 0.95; }
  70% { opacity: 0.7; }
  72% { opacity: 1; }
}
@keyframes faceFlash {
  0%, 88%, 100% { opacity: 0; }
  90%, 94% { opacity: 1; }
  96% { opacity: 0; }
}
@keyframes kromerFall {
  0% { transform: translateY(-24px); opacity: 0; }
  10% { opacity: 0.2; }
  88% { opacity: 0.16; }
  100% { transform: translateY(344px); opacity: 0; }
}
@keyframes neonFlicker {
  0%, 100% { opacity: 1; }
  3% { opacity: 0.4; }
  5% { opacity: 1; }
  42% { opacity: 1; }
  44% { opacity: 0.2; }
  46% { opacity: 1; }
  47% { opacity: 0.5; }
  49% { opacity: 1; }
  78% { opacity: 1; }
  79% { opacity: 0.6; }
  80% { opacity: 1; }
}
@keyframes cableSway {
  0%, 100% { transform: rotate(-1deg); }
  50% { transform: rotate(1deg); }
}
.puppet-string {
  animation: stringTension 4s ease-in-out infinite alternate;
  transform-origin: top center;
}
.screen-flicker { animation: screenFlicker 5s linear infinite; }
.face-flash { animation: faceFlash 9s steps(1) infinite; }
.kromer-fall { animation: kromerFall linear infinite; }
.neon-tube { animation: neonFlicker 6s linear infinite; }
.cable-sway { animation: cableSway 7s ease-in-out infinite; transform-origin: top center; }
.pixelated { image-rendering: pixelated; }
.crt-lines {
  background-image: repeating-linear-gradient(
    0deg,
    rgba(0,0,0,0.22) 0px,
    rgba(0,0,0,0.22) 1px,
    transparent 1px,
    transparent 3px
  );
}
`;

/* ── Datos de la tienda ────────────────────────────────── */
type Pose = "idle" | "talk" | "grin" | "static";

interface BuyItem {
  name: string;
  price: number;
  desc: string;
  pose: Pose;
}

const BUY_ITEMS: BuyItem[] = [
  {
    name: "[S.EDIT] IMAGEN MALDITA",
    price: 350,
    desc: "* ¡¡UNA EDICIÓN TAN [BUENA] QUE LOS ENVIDIOSOS DIRÁN QUE ES MENTIRA!! * ¡¡HECHA POR EL [BUENO EN TODO, EXPERTO EN NADA]!!",
    pose: "grin",
  },
  {
    name: "[NOMBRE GLL] ORIGINAL",
    price: 999,
    desc: "* ¡¡EL NOMBRE QUE [CREÓ] AL CLAN!! * ¡¡FIRMADO POR SU [CREADOR], NADA MÁS Y NADA MENOS!!",
    pose: "talk",
  },
  {
    name: "[MONSTER] x12 PACK",
    price: 80,
    desc: "* ¡¡DOCE LATAS DE [JUGUITO VERDE] PARA EL [MONSTER LOVER]!! * ¡¡TE PONEN MÁS [ELÉCTRICO] QUE MI PELO!!",
    pose: "grin",
  },
  {
    name: "[ORGANIZACIÓN] TOTAL",
    price: 500,
    desc: "* ¡¡ORDENO TU GRUPO, TU VIDA Y TUS [[CALZONCILLOS]]!! * ¡¡ALINEACIÓN [PERFECTA] GARANTIZADA!!",
    pose: "talk",
  },
];

interface TalkTopic {
  name: string;
  text: string;
  pose: Pose;
}

const TALK_TOPICS: TalkTopic[] = [
  {
    name: "Sobre mí / Identidad",
    text: "* ME LLAMAN NOTHING... * ¡¡NADA MÁS Y NADA MENOS QUE EL [NÚMERO UNO]!! * ¡¡BUENO EN TODO, [EXPERTO] EN NADA!!",
    pose: "talk",
  },
  {
    name: "Rol & Creación",
    text: "* ¡¡YO ORGANIZO! ¡¡YO ALINEO!! * ¡¡EL GRUPO CAMINA DERECHITO GRACIAS A ESTE [PEQUEÑO HOMBRE]!!",
    pose: "grin",
  },
  {
    name: "Gustos & Obsesiones",
    text: "* ¡¡AMO EL [JUGUITO VERDE] MONSTER!! * ¡¡Y LOS NOMBRES! ¡¡YO CREÉ EL NOMBRE [GLL]!! * (LOS ENVIDIOSOS DIRÁN QUE ES MENTIRA)",
    pose: "talk",
  },
  {
    name: "[HYPERLINK BLOCKED]",
    text: "* ... * [[¡¡ERROR!! ¡¡HIPERVÍNCULO BLOQUEADO!!]] * ...ESO NO LO PUEDES [[SABER]] TODAVÍA, [BIG SHOT]...",
    pose: "static",
  },
];

const PROMPTS: Record<string, string> = {
  main: "* ¡¡BIENVENIDO A MI [[TIENDA DE $#!*]]!! * SOY SPAMTON, ¡¡TU [MEJOR AMIGO]!! * ¿QUÉ VAS A HACER HOY, [BIG SHOT]?",
  buy: "* ¡¡ELIGE CON [[CUIDADO]], CAMPEÓN!! * ¡¡TODO ES [100% LEGAL] Y [100% TUYO]!!",
  talk: "* ¿¿DE QUÉ QUIERES [[HABLAR]] CON TU [MEJOR AMIGO]??",
};

const SELL_TEXT =
  "* ¿¡¡VENDERME TUS COSAS!?... * ¡¡JAJAJA!! ¡¡BUEN INTENTO, [PEQUEÑO ESTAFADOR]!! * ¡¡AQUÍ EL ÚNICO QUE [ESTAFA] SOY YO!!";
const POOR_TEXT =
  "* ¿¡¡ESO ES TODO LO QUE TIENES!?... * ¡¡VUELVE CUANDO SEAS UN [BIG SHOT]!!";
const EXIT_TEXT =
  "* ¡¡¿YA TE VAS?!... * ¡¡VUELVE PRONTO, [BIG SHOT]!! * * PLEASE COME BACK WHEN YOU'RE A [BIG SHOT]!!";

const MAIN_COMMANDS = ["BUY", "TALK", "SELL", "EXIT"];
const STARTING_KROMER = 100;

/* ── Lluvia de [KROMER]: valores estáticos deterministas ─ */
const KROMER_RAIN: { left: number; delay: number; dur: number; glyph: boolean; size: number }[] =
  Array.from({ length: 14 }, (_, i) => ({
    left: (i * 7.3 + 4) % 100,
    delay: -((i * 1.7) % 9),
    dur: 6 + ((i * 5) % 7),
    glyph: i % 3 === 0,
    size: 8 + (i % 3) * 2,
  }));

/* ── Hilos de marioneta vivos ──────────────────────────── */
const STRINGS: { x: number; len: number; delay: string; dur: string }[] = [
  { x: 44, len: 120, delay: "0s", dur: "4s" },
  { x: 56, len: 132, delay: "-1.3s", dur: "4.6s" },
  { x: 66, len: 118, delay: "-2.1s", dur: "3.6s" },
  { x: 76, len: 128, delay: "-0.7s", dur: "4.3s" },
  { x: 88, len: 116, delay: "-2.8s", dur: "3.9s" },
];

export function NothingProfile({ member }: { member: Member }) {
  const [mounted, setMounted] = useState(false);
  const [started, setStarted] = useState(false);

  const [view, setView] = useState<"main" | "buy" | "talk">("main");
  const [cursor, setCursor] = useState(0);
  const [pose, setPose] = useState<Pose>("idle");

  const [fullText, setFullText] = useState(PROMPTS.main);
  const [shown, setShown] = useState(PROMPTS.main.length);
  const [typing, setTyping] = useState(false);
  const [atLeaf, setAtLeaf] = useState(false);

  const [kromer, setKromer] = useState(STARTING_KROMER);
  const [owned, setOwned] = useState(0);
  const [exiting, setExiting] = useState(false);
  const [signOk, setSignOk] = useState(true);
  const [flameOk, setFlameOk] = useState(true);

  const [musicOn, setMusicOn] = useState(false);
  const [volume, setVolume] = useState(0.35);
  const [musicMissing, setMusicMissing] = useState(false);

  const audioCtxRef = useRef<AudioContext | null>(null);
  const musicRef = useRef<HTMLAudioElement | null>(null);

  /* ── Motor de arranque (post-hidratación) ────────────── */
  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    if (!mounted || started) return;
    setStarted(true);
    setShown(0);
    setTyping(true);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [mounted]);

  /* ── Web Audio: contexto + sonidos ───────────────────── */
  const ensureCtx = (): AudioContext | null => {
    try {
      const AC =
        window.AudioContext ||
        (window as unknown as { webkitAudioContext: typeof AudioContext })
          .webkitAudioContext;
      if (!AC) return null;
      if (!audioCtxRef.current) audioCtxRef.current = new AC();
      const ctx = audioCtxRef.current;
      if (ctx.state === "suspended") void ctx.resume();
      return ctx;
    } catch {
      return null;
    }
  };

  useEffect(() => {
    if (!mounted) return;
    const wake = () => ensureCtx();
    window.addEventListener("pointerdown", wake);
    window.addEventListener("keydown", wake);
    return () => {
      window.removeEventListener("pointerdown", wake);
      window.removeEventListener("keydown", wake);
      audioCtxRef.current?.close().catch(() => {});
      audioCtxRef.current = null;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [mounted]);

  const playBlip = () => {
    const ctx = audioCtxRef.current;
    if (!ctx || ctx.state !== "running") return;
    try {
      const t = ctx.currentTime;
      const o = ctx.createOscillator();
      const g = ctx.createGain();
      o.type = "square";
      o.frequency.value = 460 + Math.random() * 160;
      g.gain.setValueAtTime(0.045, t);
      g.gain.exponentialRampToValueAtTime(0.0001, t + 0.035);
      o.connect(g);
      g.connect(ctx.destination);
      o.start(t);
      o.stop(t + 0.04);
    } catch {
      /* silencio */
    }
  };

  const playSelect = () => {
    const ctx = audioCtxRef.current;
    if (!ctx || ctx.state !== "running") return;
    try {
      const t = ctx.currentTime;
      [880, 1318].forEach((f, i) => {
        const o = ctx.createOscillator();
        const g = ctx.createGain();
        o.type = "triangle";
        o.frequency.value = f;
        g.gain.setValueAtTime(0.07 / (i + 1), t);
        g.gain.exponentialRampToValueAtTime(0.0001, t + 0.07);
        o.connect(g);
        g.connect(ctx.destination);
        o.start(t);
        o.stop(t + 0.08);
      });
    } catch {
      /* silencio */
    }
  };

  /* ── Typewriter letra por letra ──────────────────────── */
  useEffect(() => {
    if (!typing) return;
    if (shown >= fullText.length) {
      setTyping(false);
      return;
    }
    const id = setTimeout(() => {
      setShown((s) => {
        const n = Math.min(fullText.length, s + 1);
        if (n % 2 === 0) playBlip();
        return n;
      });
    }, 18);
    return () => clearTimeout(id);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [typing, shown, fullText]);

  const speak = (text: string, nextPose: Pose, leaf: boolean) => {
    setPose(nextPose);
    setFullText(text);
    setShown(0);
    setTyping(true);
    setAtLeaf(leaf);
  };

  const backToPrompt = () => {
    const v = view;
    speak(PROMPTS[v], "idle", false);
  };

  /* ── Selección ───────────────────────────────────────── */
  const optionCount = () =>
    view === "main"
      ? MAIN_COMMANDS.length
      : view === "buy"
        ? BUY_ITEMS.length
        : TALK_TOPICS.length;

  const choose = () => {
    if (exiting) return;
    playSelect();
    if (view === "main") {
      const cmd = MAIN_COMMANDS[cursor];
      if (cmd === "BUY") {
        setView("buy");
        setCursor(0);
        speak(PROMPTS.buy, "idle", false);
      } else if (cmd === "TALK") {
        setView("talk");
        setCursor(0);
        speak(PROMPTS.talk, "idle", false);
      } else if (cmd === "SELL") {
        speak(SELL_TEXT, "grin", true);
      } else {
        setExiting(true);
        speak(EXIT_TEXT, "talk", true);
        setTimeout(() => {
          window.location.href = "/";
        }, 2400);
      }
    } else if (view === "buy") {
      const item = BUY_ITEMS[cursor];
      if (kromer >= item.price) {
        setKromer((k) => k - item.price);
        if (cursor === 2) setOwned((o) => o + 12);
        speak(`* ¡¡[TRATO HECHO]!! ${item.desc}`, "grin", true);
      } else {
        speak(POOR_TEXT, "static", true);
      }
    } else {
      const topic = TALK_TOPICS[cursor];
      speak(topic.text, topic.pose, true);
    }
  };

  /* clic en la caja: completa el texto o vuelve al menú */
  const advanceDialog = () => {
    if (exiting) return;
    playSelect();
    if (typing) {
      setShown(fullText.length);
      setTyping(false);
    } else if (atLeaf) {
      backToPrompt();
    }
  };

  /* ── Teclado: flechas / Enter / X ────────────────────── */
  useEffect(() => {
    if (!mounted || !started) return;
    const onKey = (e: KeyboardEvent) => {
      if (exiting) return;
      if (e.key === "ArrowUp" || e.key === "ArrowDown") {
        e.preventDefault();
        playSelect();
        setCursor((c) => {
          const n = optionCount();
          return e.key === "ArrowUp" ? (c - 1 + n) % n : (c + 1) % n;
        });
      } else if (e.key === "Enter" || e.key === "z" || e.key === "Z") {
        e.preventDefault();
        if (typing) advanceDialog();
        else choose();
      } else if (e.key === "x" || e.key === "X" || e.key === "Escape") {
        if (typing) advanceDialog();
        else if (atLeaf) {
          playSelect();
          backToPrompt();
        } else if (view !== "main") {
          playSelect();
          setView("main");
          setCursor(0);
          speak(PROMPTS.main, "idle", false);
        }
      }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [mounted, started, view, cursor, typing, fullText, atLeaf, exiting, kromer]);

  /* ── Música de fondo (Dialtone) ──────────────────────── */
  const toggleMusic = () => {
    const a = musicRef.current;
    if (!a || musicMissing) return;
    if (a.paused) a.play().catch(() => {});
    else a.pause();
  };

  return (
    <main className="relative flex min-h-screen flex-col overflow-x-clip bg-black font-mono text-white">
      <style>{FX_STYLES}</style>

      {/* ── scanlines CRT globales ──────────────────────── */}
      <div aria-hidden className="crt-lines pointer-events-none fixed inset-0 z-[5] opacity-60" />
      <div
        aria-hidden
        className="pointer-events-none fixed inset-0 z-[5]"
        style={{
          background:
            "radial-gradient(ellipse at center, transparent 55%, rgba(0,0,0,0.55) 100%)",
        }}
      />

      {/* ── Barra superior ──────────────────────────────── */}
      <div className="relative z-10 flex items-center justify-between px-4 py-3 sm:px-6">
        <a
          href="/"
          className="border-2 border-white bg-black px-3 py-1.5 text-[11px] font-bold tracking-[0.2em] transition-colors hover:bg-white hover:text-black"
        >
          &larr; [ GLL // ROSTER ]
        </a>
        <div className="flex items-center gap-2">
          <span className="hidden text-[10px] tracking-[0.25em] text-yellow-300 sm:inline">
            [[KROMER]]: {kromer}
          </span>
          {!musicMissing ? (
            <>
              <button
                onClick={toggleMusic}
                className="flex items-center gap-1.5 border-2 border-white bg-black px-2.5 py-1.5 text-[10px] font-bold tracking-widest transition-colors hover:bg-white hover:text-black"
                title="Dialtone: reproducir / pausar"
              >
                {musicOn ? <Pause className="size-3.5" /> : <Volume2 className="size-3.5" />}
                <span className="hidden sm:inline">DIALTONE</span>
              </button>
              <button
                onClick={() => {
                  const a = musicRef.current;
                  if (!a) return;
                  a.muted = !a.muted;
                }}
                className="border-2 border-white bg-black p-1.5 transition-colors hover:bg-white hover:text-black"
                title="Mute"
              >
                <VolumeX className="size-3.5" />
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
                  if (musicRef.current) musicRef.current.volume = v;
                }}
                className="h-1 w-16 cursor-pointer accent-yellow-300"
                title="Volumen"
              />
            </>
          ) : (
            <span className="border-2 border-zinc-700 px-2.5 py-1.5 text-[10px] tracking-widest text-zinc-600">
              SIN CINTA
            </span>
          )}
        </div>
      </div>

      <audio
        ref={musicRef}
        src="/images/members/nothing/audio.mp3"
        loop
        preload="none"
        onPlay={() => setMusicOn(true)}
        onPause={() => setMusicOn(false)}
        onError={() => setMusicMissing(true)}
      />

      {/* ── Letrero colgante ────────────────────────────── */}
      <div className="relative z-10 mx-auto w-full max-w-3xl px-4 text-center">
        {signOk && (
          <img
            src="/images/members/nothing/banner.png"
            alt="Spamton's Shop"
            onError={() => setSignOk(false)}
            className="pixelated mx-auto h-14 w-auto object-contain sm:h-20"
            loading="eager"
          />
        )}
        <p
          className="mt-1 text-sm font-bold tracking-wider text-yellow-300 sm:text-base"
          style={{ fontVariantLigatures: "none" }}
        >
          ↳۞⃟𝐌𝐎𝐓𝐇𝐈𝐍𝐆ʸᵇˡᵃᵏᵏ [GLL]
        </p>
        <p className="text-[10px] tracking-[0.3em] text-zinc-500">
          {member.role}
        </p>
      </div>

      {/* ── Viewport: tienda clandestina ─────────────────── */}
      <div className="relative z-10 mx-auto mt-4 w-full max-w-3xl px-4">
        <div className="border-4 border-white">
          <div
            className="relative h-64 overflow-hidden sm:h-80"
            style={{
              background:
                "linear-gradient(180deg, #06080e 0%, #0a0f1e 45%, #0f172a 75%, #06080e 100%)",
            }}
          >
            {/* ── Tubo de neón defectuoso + letrero ─────── */}
            <div aria-hidden className="neon-tube absolute left-0 right-0 top-2 text-center">
              <div
                className="mx-auto h-1.5 w-3/4"
                style={{
                  background:
                    "linear-gradient(90deg, transparent, #67e8f9 20%, #fff 50%, #67e8f9 80%, transparent)",
                  boxShadow:
                    "0 0 12px #22d3ee, 0 0 28px rgba(34,211,238,0.6)",
                }}
              />
              <p
                className="mt-1 text-sm font-black tracking-[0.35em] text-yellow-300 sm:text-base"
                style={{ textShadow: "0 0 10px rgba(250,204,21,0.9), 0 0 26px rgba(250,204,21,0.5)" }}
              >
                ★ BIG SHOT ★
              </p>
            </div>

            {/* ── Ciudad lejana: ventanitas encendidas ───── */}
            <div
              aria-hidden
              className="absolute inset-x-0 top-14 h-16 opacity-25"
              style={{
                backgroundImage:
                  "radial-gradient(2px 3px at 12px 8px, #67e8f9 50%, transparent 51%), radial-gradient(2px 3px at 44px 22px, #fde047 50%, transparent 51%), radial-gradient(2px 3px at 78px 10px, #f0abfc 50%, transparent 51%), radial-gradient(2px 3px at 110px 26px, #67e8f9 50%, transparent 51%), radial-gradient(2px 3px at 150px 6px, #fde047 50%, transparent 51%), radial-gradient(2px 3px at 190px 20px, #67e8f9 50%, transparent 51%)",
                backgroundSize: "210px 36px",
              }}
            />

            {/* ── Cables industriales caídos ─────────────── */}
            <svg aria-hidden viewBox="0 0 300 120" preserveAspectRatio="none" className="cable-sway absolute -left-6 top-0 h-32 w-40 opacity-80">
              <path d="M10 0 Q30 70 90 95" fill="none" stroke="#050505" strokeWidth="7" />
              <path d="M10 0 Q30 70 90 95" fill="none" stroke="#2b2f36" strokeWidth="2" />
              <path d="M34 0 Q44 50 96 88" fill="none" stroke="#050505" strokeWidth="4" />
            </svg>
            <svg aria-hidden viewBox="0 0 300 120" preserveAspectRatio="none" className="cable-sway absolute -right-6 top-0 h-28 w-36 opacity-80" style={{ animationDelay: "-3.2s" }}>
              <path d="M290 0 Q270 66 210 92" fill="none" stroke="#050505" strokeWidth="7" />
              <path d="M290 0 Q270 66 210 92" fill="none" stroke="#2b2f36" strokeWidth="2" />
            </svg>

            {/* ── Pila izquierda: monitores CRT ──────────── */}
            <div aria-hidden className="absolute bottom-16 left-[4%] hidden w-32 sm:block">
              <div className="relative mx-auto h-16 w-24 border-2 border-[#2b2f36] bg-[#14161c]">
                <div className="screen-flicker absolute inset-1.5 bg-[#39ff14] opacity-80" style={{ boxShadow: "0 0 18px rgba(57,255,20,0.55)" }}>
                  <div className="crt-lines absolute inset-0" />
                </div>
                <svg viewBox="0 0 60 40" className="face-flash absolute inset-0 h-full w-full">
                  <ellipse cx="22" cy="18" rx="6" ry="8" fill="#0a0a0a" />
                  <ellipse cx="38" cy="18" rx="6" ry="8" fill="#0a0a0a" />
                </svg>
              </div>
              <div className="relative mx-auto mt-1 h-14 w-28 border-2 border-[#2b2f36] bg-[#101319]">
                <div className="screen-flicker absolute inset-1.5 bg-[#ffe600] opacity-70" style={{ animationDelay: "-2.2s", boxShadow: "0 0 16px rgba(255,230,0,0.5)" }}>
                  <div className="crt-lines absolute inset-0" />
                </div>
              </div>
              <div className="mx-auto h-2 w-16 bg-[#050505]" />
            </div>

            {/* ── Pila derecha: monitor magenta ──────────── */}
            <div aria-hidden className="absolute bottom-16 right-[4%] hidden w-28 sm:block">
              <div className="relative mx-auto h-20 w-24 -rotate-3 border-2 border-[#2b2f36] bg-[#14161c]">
                <div className="screen-flicker absolute inset-1.5 bg-[#ff4fd8] opacity-75" style={{ animationDelay: "-3.6s", boxShadow: "0 0 18px rgba(255,79,216,0.5)" }}>
                  <div className="crt-lines absolute inset-0" />
                </div>
                <svg viewBox="0 0 60 48" className="face-flash absolute inset-0 h-full w-full" style={{ animationDelay: "-4.5s" }}>
                  <path d="M16 30 Q30 40 44 30" stroke="#0a0a0a" strokeWidth="4" fill="none" strokeLinecap="round" />
                </svg>
              </div>
              <div className="mx-auto h-2 w-16 bg-[#050505]" />
            </div>

            {/* ── Contenedores de basura (siluetas) ──────── */}
            <div aria-hidden className="absolute bottom-12 left-[24%] h-20 w-24 bg-[#080b12]" />
            <div aria-hidden className="absolute bottom-12 left-[24%] h-2 w-24 bg-[#1c2333]" />
            <div aria-hidden className="absolute bottom-12 right-[24%] h-24 w-20 bg-[#080b12]" />
            <div aria-hidden className="absolute bottom-12 right-[24%] h-2 w-20 bg-[#1c2333]" />

            {/* ── Suelo del callejón ─────────────────────── */}
            <div
              aria-hidden
              className="absolute bottom-0 left-0 h-14 w-full"
              style={{ background: "linear-gradient(180deg, #0b0f18 0%, #04060b 100%)" }}
            />

            {/* ── Hilos de marioneta vivos ───────────────── */}
            <svg aria-hidden viewBox="0 0 160 140" preserveAspectRatio="none" className="absolute left-1/2 top-0 h-36 w-44 -translate-x-1/2">
              {STRINGS.map((s) => (
                <line
                  key={s.x}
                  x1={s.x}
                  y1={0}
                  x2={s.x}
                  y2={s.len}
                  stroke="rgba(255,255,255,0.25)"
                  strokeWidth={1.5}
                  className="puppet-string"
                  style={{ animationDelay: s.delay, animationDuration: s.dur }}
                />
              ))}
            </svg>

            {/* ── Lluvia de [KROMER] / píxeles glitch ─────── */}
            <div aria-hidden className="pointer-events-none absolute inset-0 overflow-hidden">
              {KROMER_RAIN.map((k, i) =>
                k.glyph ? (
                  <span
                    key={i}
                    className="kromer-fall absolute font-mono font-bold text-yellow-300"
                    style={{
                      left: `${k.left}%`,
                      fontSize: `${k.size}px`,
                      animationDuration: `${k.dur}s`,
                      animationDelay: `${k.delay}s`,
                    }}
                  >
                    [$]
                  </span>
                ) : (
                  <span
                    key={i}
                    className="kromer-fall absolute bg-[#39ff14]"
                    style={{
                      left: `${k.left}%`,
                      width: `${k.size / 2}px`,
                      height: `${k.size / 2}px`,
                      animationDuration: `${k.dur}s`,
                      animationDelay: `${k.delay}s`,
                    }}
                  />
                )
              )}
            </div>

            {/* ── Halo tras el sprite (contraste) ────────── */}
            <div
              aria-hidden
              className="absolute bottom-10 left-1/2 h-44 w-56 -translate-x-1/2 rounded-full"
              style={{ background: "radial-gradient(ellipse at center, rgba(250,204,21,0.14) 0%, transparent 70%)" }}
            />

            {/* mesa frontal */}
            <div aria-hidden className="absolute bottom-8 left-1/2 h-4 w-3/4 -translate-x-1/2 bg-[#4a2f14]" />
            <div aria-hidden className="absolute bottom-8 left-1/2 h-1 w-3/4 -translate-x-1/2 bg-[#7a5225]" />
            <div aria-hidden className="absolute bottom-0 left-[16%] h-8 w-3 bg-[#2e1d0c]" />
            <div aria-hidden className="absolute bottom-0 right-[16%] h-8 w-3 bg-[#2e1d0c]" />

            {/* sprite */}
            <div className="absolute bottom-12 left-1/2 -translate-x-1/2 drop-shadow-[0_0_16px_rgba(255,255,255,0.3)]">
              <div className={`pose-${pose}`}>
                <SpamtonSprite pose={pose} />
              </div>
            </div>

            {/* teléfono negro, esquina derecha */}
            <div aria-hidden className="phone-ring absolute right-4 top-16 sm:right-8">
              <div className="h-24 w-12 rotate-[8deg] rounded-lg border-2 border-zinc-800 bg-black shadow-[0_0_22px_rgba(255,230,0,0.25)]">
                <div className="mx-auto mt-2 h-12 w-8 rounded-sm bg-[#0d2b12]" />
                <div className="mx-auto mt-1 h-1.5 w-1.5 rounded-full bg-red-600" />
              </div>
            </div>
          </div>
        </div>

        {/* divisor en llamas */}
        {flameOk && (
          <img
            src="/images/members/nothing/flame.gif"
            alt=""
            onError={() => setFlameOk(false)}
            className="pixelated mx-auto mt-3 h-10 w-64 object-contain sm:w-96"
            loading="lazy"
          />
        )}
      </div>

      {/* ── Caja de diálogo + opciones ──────────────────── */}
      <div className="relative z-10 mx-auto mb-10 mt-4 grid w-full max-w-3xl flex-1 gap-3 px-4 sm:grid-cols-[1fr_220px]">
        <button
          onClick={advanceDialog}
          className="min-h-40 border-4 border-white bg-black p-4 text-left sm:min-h-44"
          title="Clic para avanzar"
        >
          <p className="whitespace-pre-wrap text-sm leading-relaxed sm:text-base">
            {fullText.slice(0, shown)}
            {typing && <span className="cursor-blink">▌</span>}
          </p>
        </button>

        <div className="border-4 border-white bg-black p-3">
          <p className="mb-2 border-b-2 border-white/30 pb-1 text-[10px] tracking-[0.3em] text-yellow-300">
            {view === "main" ? "COMANDOS" : view === "buy" ? "¡COMPRA!" : "HABLAR"}
            {view === "buy" && (
              <span className="float-right text-white">[{kromer}]K</span>
            )}
          </p>
          <ul className="space-y-1">
            {(view === "main"
              ? MAIN_COMMANDS.map((c) => ({ label: `[ ${c} ]`, sub: "" }))
              : view === "buy"
                ? BUY_ITEMS.map((b) => ({
                    label: b.name,
                    sub: `${b.price}K`,
                  }))
                : TALK_TOPICS.map((t) => ({ label: t.name, sub: "" }))
            ).map((opt, i) => (
              <li key={opt.label}>
                <button
                  onClick={() => {
                    if (exiting) return;
                    playSelect();
                    if (i === cursor) choose();
                    else setCursor(i);
                  }}
                  onMouseEnter={() => {
                    if (i !== cursor && !exiting) {
                      playSelect();
                      setCursor(i);
                    }
                  }}
                  className={`flex w-full items-center justify-between px-1 py-1 text-left text-xs transition-colors sm:text-sm ${
                    i === cursor
                      ? "bg-white text-black"
                      : "text-white hover:bg-zinc-800"
                  }`}
                >
                  <span>
                    <span className={i === cursor ? "" : "cursor-blink"}>
                      {i === cursor ? "▶ " : "  "}
                    </span>
                    {opt.label}
                  </span>
                  {opt.sub && (
                    <span className={i === cursor ? "text-black" : "text-yellow-300"}>
                      {opt.sub}
                    </span>
                  )}
                </button>
              </li>
            ))}
          </ul>
          <p className="mt-2 text-[9px] leading-relaxed tracking-widest text-zinc-500">
            FLECHAS + ENTER / CLIC
            {owned > 0 && (
              <span className="block text-green-400">
                [MONSTER] x{owned} EN BOLSILLO
              </span>
            )}
          </p>
        </div>
      </div>

      {/* ── Transición de salida ────────────────────────── */}
      {exiting && (
        <div className="pointer-events-none fixed inset-0 z-50 animate-pulse bg-white" />
      )}
    </main>
  );
}

/* ── Sprite vectorial de Spamton/Nothing ───────────────── */
function SpamtonSprite({ pose }: { pose: Pose }) {
  const grin = pose === "grin";
  const talking = pose === "talk";
  const statik = pose === "static";

  return (
    <svg
      width="120"
      height="160"
      viewBox="0 0 120 160"
      className="pixelated drop-shadow-[0_6px_0_rgba(0,0,0,0.45)]"
      role="img"
      aria-label="Nothing / Spamton"
    >
      {/* cuerpo: traje oscuro */}
      <path d="M38 108 L82 108 L94 160 L26 160 Z" fill="#151515" />
      <path d="M56 108 L64 108 L62 132 L58 132 Z" fill="#7a1010" />
      {/* brazos */}
      <path d="M38 112 L22 140" stroke="#151515" strokeWidth="10" strokeLinecap="round" />
      <path d="M82 112 L98 140" stroke="#151515" strokeWidth="10" strokeLinecap="round" />
      {/* cabeza */}
      {statik ? (
        <g>
          <rect x="26" y="34" width="68" height="66" rx="14" fill="#111" />
          <rect x="26" y="34" width="68" height="66" rx="14" fill="url(#n)" className="tv-static" opacity="0.9" />
          <defs>
            <pattern id="n" width="8" height="8" patternUnits="userSpaceOnUse">
              <rect width="8" height="8" fill="#0a0a0a" />
              <rect width="4" height="4" fill="#e8e8e8" />
              <rect x="4" y="4" width="4" height="4" fill="#888" />
            </pattern>
          </defs>
          <ellipse cx="46" cy="62" rx="8" ry="10" fill="#ffe600" />
          <ellipse cx="74" cy="62" rx="8" ry="10" fill="#ff4fd8" />
        </g>
      ) : (
        <g>
          <rect x="26" y="34" width="68" height="66" rx="14" fill="#f2ede2" />
          {/* gafas */}
          <rect x="32" y="52" width="24" height="16" rx="3" fill={grin ? "#ffe600" : "#ffd7f2"} stroke="#111" strokeWidth="3" />
          <rect x="64" y="52" width="24" height="16" rx="3" fill={grin ? "#ffe600" : "#ffd7f2"} stroke="#111" strokeWidth="3" />
          <rect x="56" y="58" width="8" height="4" fill="#111" />
          {/* pupilas */}
          <circle cx="44" cy="60" r="3" fill={grin ? "#ff4fd8" : "#111"} />
          <circle cx="76" cy="60" r="3" fill={grin ? "#ff4fd8" : "#111"} />
          {/* narizota */}
          <ellipse cx="60" cy="76" rx="9" ry="12" fill="#f2ede2" stroke="#111" strokeWidth="3" />
          {/* boca */}
          {talking ? (
            <ellipse cx="60" cy="94" rx="7" ry="6" fill="#3a0a0a" />
          ) : grin ? (
            <path d="M38 88 Q60 104 82 88 Q78 100 60 100 Q42 100 38 88 Z" fill="#3a0a0a" />
          ) : (
            <path d="M44 90 Q60 98 76 90" stroke="#111" strokeWidth="3" fill="none" strokeLinecap="round" />
          )}
        </g>
      )}
    </svg>
  );
}
