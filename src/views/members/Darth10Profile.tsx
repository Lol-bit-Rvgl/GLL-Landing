"use client";

import { useState, useCallback, useRef, useEffect } from "react";
import type { Member } from "@/data/members";
import { X, GripVertical } from "lucide-react";
import { SoundButton } from "@/components/fx";

/* ── CSS dinámico ─────────────────────────────────────────── */
const FX_STYLES = `
@keyframes screen-shake {
  0%, 100% { transform: translate(0,0); }
  85% { transform: translate(0,0); }
  87% { transform: translate(-1px, 1px); }
  89% { transform: translate(1px, -1px); }
  91% { transform: translate(-1px, -1px); }
  93% { transform: translate(1px, 1px); }
  95% { transform: translate(0,0); }
}
@keyframes rgb-split {
  0%, 100% { filter: none; }
  20% { filter: drop-shadow(2px 0 0 #FF0000) drop-shadow(-2px 0 0 #00FFFF); }
  60% { filter: drop-shadow(-1px 0 0 #FF0000) drop-shadow(1px 0 0 #00FFFF); }
}
@keyframes scan-drift {
  0% { background-position: 0 0; }
  100% { background-position: 0 4px; }
}
@keyframes title-flicker {
  0%, 96% { opacity: 1; filter: none; }
  97% { opacity: 0.8; filter: blur(0.5px); }
}
@keyframes reboot-flash {
  0% { background: #000; }
  35% { background: #000; }
  45% { background: #FFF; }
  60% { background: #000; }
}
@keyframes pip-spin {
  0% { transform: rotate(0deg); }
  100% { transform: rotate(360deg); }
}
@keyframes pip-eq {
  0%, 100% { transform: scaleY(0.25); }
  50% { transform: scaleY(1); }
}
@keyframes grid-drift-cyber {
  0%   { background-position: 0 0; }
  100% { background-position: 40px 40px; }
}
@keyframes orb-pulse {
  0%, 100% { transform: scale(1); opacity: 0.9; }
  50% { transform: scale(1.15); opacity: 0.55; }
}
@keyframes wired-tear {
  0%, 82% { opacity: 0; transform: translateX(0); }
  84% { opacity: 1; transform: translateX(38px); }
  86% { opacity: 0.7; transform: translateX(-28px); }
  88% { opacity: 1; transform: translateX(12px); }
  91%, 100% { opacity: 0; transform: translateX(0); }
}
@keyframes glitch-hit {
  0%, 82% { transform: translate(0,0); filter: none; }
  84% { transform: translate(-4px, 1px); filter: drop-shadow(4px 0 0 #00FFFF) drop-shadow(-4px 0 0 #FF0055); }
  86% { transform: translate(3px, -1px); filter: drop-shadow(-3px 0 0 #00FFFF) drop-shadow(3px 0 0 #00FF66); }
  88% { transform: translate(-2px, 2px); filter: drop-shadow(2px 0 0 #FF0055) drop-shadow(-2px 0 0 #00FF66); }
  91%, 100% { transform: translate(0,0); filter: none; }
}
.screen-shake { animation: screen-shake 3.2s steps(2) infinite; }
.rgb-split { animation: rgb-split 2s steps(2) infinite; }
.glitch-sync { animation: glitch-hit 3.4s linear infinite; }
.grid-cyber { animation: grid-drift-cyber 9s linear infinite; }
.orb-pulse { animation: orb-pulse 6s ease-in-out infinite; }
.wired-tear { animation: wired-tear 3.4s linear infinite; }
.scan-slow {
  background-image: repeating-linear-gradient(
    0deg,
    rgba(0,40,20,0.25) 0px,
    rgba(0,40,20,0.25) 1px,
    transparent 1px,
    transparent 4px
  );
  animation: scan-drift 8s linear infinite;
}
.title-flicker { animation: title-flicker 4s linear infinite; }
.reboot-flash { animation: reboot-flash 0.8s ease-out forwards; }
.pip-spin { animation: pip-spin 4s linear infinite; }
.pip-eq-bar { animation: pip-eq 0.9s ease-in-out infinite; transform-origin: bottom; }

/* Windows 98 border groove */
.win98-inset {
  border: 2px inset;
  border-color: #DFDFDF #808080 #808080 #DFDFDF;
}
.win98-outset {
  border: 2px outset;
  border-color: #DFDFDF #C0C0C0 #C0C0C0 #DFDFDF;
}
`;

/* ── Ventana de error Win98 ───────────────────────────────── */
interface ErrorWindowProps {
  x: number;
  y: number;
    z: number;
  onClose: () => void;
  onFix: () => void;
  onDragStart: (e: React.PointerEvent) => void;
}

function ErrorWindow({ x, y, z, onClose, onFix, onDragStart }: ErrorWindowProps) {
  // Hidra: [X] y [Cancel] disparan exactamente la misma remoción + spawn x2
  const handleTriggerHydra = (e: React.MouseEvent) => {
    e.stopPropagation();
    e.preventDefault();
    onClose();
  };
  return (
    <div
      className="pointer-events-auto absolute"
      style={{
        top: `${y}%`,
        left: `${x}%`,
        zIndex: z,
        width: "220px",
        transform: "translate(-50%,-50%)",
      }}
    >
      {/* ── Title bar azul ── */}
      <div
        onPointerDown={onDragStart}
        className="win98-outset cursor-grab bg-[#000080] px-2 py-1 flex items-center justify-between"
      >
        <span className="text-xs font-bold text-white">System Error</span>
        <button
          className="win98-outset bg-[#C0C0C0] px-1 py-0 text-[10px] text-black leading-none hover:bg-white"
          onClick={handleTriggerHydra}
        >
          X
        </button>
      </div>

      {/* ── Cuerpo ── */}
      <div className="win98-outset bg-[#C0C0C0] p-3 flex items-start gap-3">
        {/* icono error */}
        <div className="mt-1 flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-[#C0C0C0] win98-inset">
          <div className="flex h-5 w-5 items-center justify-center rounded-full bg-red-600 text-xs font-bold text-white">
            ✕
          </div>
        </div>

        <div className="flex-1">
          <p className="text-xs text-black leading-snug mb-3">
            Click &quot;Fix&quot; to fix error.
          </p>
          <div className="mt-3 flex justify-center gap-3">
            <button
              className="min-w-[60px] bg-[#C0C0C0] px-3 py-1 text-center font-sans text-xs font-semibold text-black whitespace-nowrap border-2 border-t-white border-l-white border-b-black border-r-black hover:bg-white active:border-t-black active:border-l-black active:border-b-white active:border-r-white"
              onClick={onFix}
            >
              [ Fix ]
            </button>
            <button
              className="min-w-[60px] bg-[#C0C0C0] px-3 py-1 text-center font-sans text-xs font-semibold text-black whitespace-nowrap border-2 border-t-white border-l-white border-b-black border-r-black hover:bg-white active:border-t-black active:border-l-black active:border-b-white active:border-r-white"
              onClick={handleTriggerHydra}
            >
              Cancel
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

/* ── Perfil Darth10 ────────────────────────────────────────── */
export function Darth10Profile({ member }: { member: Member }) {
  const [errors, setErrors] = useState<
    { id: number; x: number; y: number; z: number }[]
  >(() => [
    // Esquina superior izquierda (sobre el poste superior)
    { id: 1, x: 12, y: 14, z: 10 },
    // Cascada lateral derecha superior/media (evita el reproductor inferior derecho)
    { id: 2, x: 74, y: 32, z: 11 },
    { id: 3, x: 80, y: 44, z: 12 },
  ]);
  const [rebooting, setRebooting] = useState(false);
  const [rebootDone, setRebootDone] = useState(false);
  const [showFlash, setShowFlash] = useState(false);
  const [mounted, setMounted] = useState(false);
  const [expanded, setExpanded] = useState(false);
  const nextId = useRef(4);
  const zCounter = useRef(10);
  const dragRef = useRef<{ id: number; offX: number; offY: number } | null>(null);
  const pipRef = useRef<HTMLDivElement>(null);
  const pipPos = useRef<{ x: number; y: number } | null>(null);
  const pipDrag = useRef<{ offX: number; offY: number } | null>(null);
  const [minimized, setMinimized] = useState(false);
  const [pipDragging, setPipDragging] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  const closeError = useCallback((id: number) => {
    setErrors((prev) => {
      const filtered = prev.filter((w) => w.id !== id);
      if (prev.length >= 40) return filtered; // límite estricto 40

      const newErrors = [
        {
          id: nextId.current++,
          x: Math.floor(Math.random() * 75) + 5,
          y: Math.floor(Math.random() * 70) + 10,
          z: ++zCounter.current,
        },
        {
          id: nextId.current++,
          x: Math.floor(Math.random() * 75) + 5,
          y: Math.floor(Math.random() * 70) + 10,
          z: ++zCounter.current,
        },
      ];

      return [...filtered, ...newErrors];
    });
  }, []);

  const onFix = useCallback(() => {
    setRebooting(true);
    setShowFlash(true);
    setTimeout(() => setShowFlash(false), 300);
  }, []);

  useEffect(() => {
    if (!rebooting) return;
    const timers = [
      () => setRebootDone(true),
    ];
    const t = setTimeout(timers[0], 2500);
    return () => clearTimeout(t);
  }, [rebooting]);

  useEffect(() => {
    if (!rebootDone) return;
    const t = setTimeout(() => {
      setRebooting(false);
      setRebootDone(false);
      // reset a 3 ventanas iniciales
      setErrors([
        { id: 1, x: 12, y: 14, z: 10 },
        { id: 2, x: 74, y: 32, z: 11 },
        { id: 3, x: 80, y: 44, z: 12 },
      ]);
      nextId.current = 4;
      zCounter.current = 10;
    }, 600);
    return () => clearTimeout(t);
  }, [rebootDone]);

  const handleCloseAll = () => {
    if (window.history.length > 1) {
      window.close();
      window.location.href = "/";
    } else {
      window.location.href = "/";
    }
  };

  const handleDragStart = (e: React.PointerEvent, id: number) => {
    e.preventDefault();
    const win = (e.target as HTMLElement).closest("[data-win]") as HTMLElement;
    if (!win) return;
    const rect = win.getBoundingClientRect();
    dragRef.current = {
      id,
      offX: e.clientX - rect.left,
      offY: e.clientY - rect.top,
    };
    const onMove = (ev: PointerEvent) => {
      if (!dragRef.current) return;
      const tt = dragRef.current;
      const parent = win.offsetParent as HTMLElement;
      if (!parent) return;
      const px = ev.clientX - parent.getBoundingClientRect().left - tt.offX;
      const py = ev.clientY - parent.getBoundingClientRect().top - tt.offY;
      win.style.left = `${px}px`;
      win.style.top = `${py}px`;
    };
    const onUp = () => {
      dragRef.current = null;
      document.removeEventListener("pointermove", onMove);
      document.removeEventListener("pointerup", onUp);
    };
    document.addEventListener("pointermove", onMove);
    document.addEventListener("pointerup", onUp);
  };

  /* ── PIP Spotify: libremente desplazable (arrastre nativo) ── */
  const clampPip = (x: number, y: number, el: HTMLElement) => {
    const pad = 8;
    const w = el.offsetWidth;
    const h = el.offsetHeight;
    return {
      x: Math.max(pad, Math.min(x, window.innerWidth - w - pad)),
      y: Math.max(pad, Math.min(y, window.innerHeight - h - pad)),
    };
  };

  const pipHandleDown = (e: React.PointerEvent) => {
    if ((e.target as HTMLElement).closest("[data-no-drag]")) return;
    const el = pipRef.current;
    if (!el) return;
    if (!pipPos.current) {
      const r = el.getBoundingClientRect();
      pipPos.current = { x: r.left, y: r.top };
    }
    e.preventDefault();
    pipDrag.current = {
      offX: e.clientX - pipPos.current.x,
      offY: e.clientY - pipPos.current.y,
    };
    setPipDragging(true);
    const onMove = (ev: PointerEvent) => {
      if (!pipDrag.current) return;
      const next = clampPip(
        ev.clientX - pipDrag.current.offX,
        ev.clientY - pipDrag.current.offY,
        el
      );
      pipPos.current = next;
      el.style.left = `${next.x}px`;
      el.style.top = `${next.y}px`;
    };
    const onUp = () => {
      pipDrag.current = null;
      setPipDragging(false);
      document.removeEventListener("pointermove", onMove);
      document.removeEventListener("pointerup", onUp);
    };
    document.addEventListener("pointermove", onMove);
    document.addEventListener("pointerup", onUp);
  };

  // Posición inicial (esquina inferior derecha) y clamp tras cambiar de modo
  useEffect(() => {
    const el = pipRef.current;
    if (!el) return;
    if (!pipPos.current) {
      const r = el.getBoundingClientRect();
      pipPos.current = { x: r.left, y: r.top };
    }
    const n = clampPip(pipPos.current.x, pipPos.current.y, el);
    pipPos.current = n;
    el.style.left = `${n.x}px`;
    el.style.top = `${n.y}px`;
  }, [mounted, minimized]);

  if (rebooting) {
    return (
      <main className={`fixed inset-0 z-[999] bg-black font-mono text-green-400 p-6 text-xs leading-relaxed overflow-hidden ${rebootDone ? "reboot-flash" : ""}`}>
        <style>{FX_STYLES}</style>
        <div className="max-w-2xl mx-auto">
          <p className="mb-1">&gt;&gt;&gt; CORRUPTION LEVEL CRITICAL: PURGING MEMORY...</p>
          <p className="mb-1">&gt;&gt;&gt; EXECUTING KERNEL REBOOT // DARTH_10.SYS</p>
          <p className="mb-1">&gt;&gt;&gt; FLUSHING STACK TRACE (0x0000007E)... DONE</p>
          <p className="mb-1">&gt;&gt;&gt; RE-INITIALIZING PROTOCOL GLL...</p>
          <p className="mt-4 text-green-600">&gt; boot complete.</p>
        </div>
      </main>
    );
  }

  return (
    <main className="relative min-h-screen overflow-hidden bg-black font-mono text-white">
      <style>{FX_STYLES}</style>

      {/* ── Imagen base 16:9 (img nativo, a prueba de fallos) ── */}
      <div className="pointer-events-none fixed inset-0 z-0 overflow-hidden bg-black">
        <img
          src="/images/members/darth10/bg.png"
          alt="Darth10 Background"
          className="h-full w-full object-cover object-center select-none"
          loading="eager"
        />
      </div>

      {/* ── Fondo cibernético verde (rejilla transparente, z-1) ── */}
      <div
        aria-hidden
        className="grid-cyber pointer-events-none fixed inset-0 z-[1]"
        style={{
          backgroundImage:
            "linear-gradient(rgba(0,255,102,0.08) 1px, transparent 1px), linear-gradient(90deg, rgba(0,255,102,0.06) 1px, transparent 1px)",
          backgroundSize: "40px 40px",
        }}
      />

      {/* ── Orbes Matrix (z-1) ───────────────────────────── */}
      <div className="pointer-events-none fixed inset-0 z-[1] overflow-hidden">
        <div
          className="orb-pulse absolute left-1/2 top-[-12%] h-[480px] w-[480px] -translate-x-1/2 rounded-full blur-[140px]"
          style={{ background: "rgba(0,180,80,0.12)" }}
        />
        <div
          className="orb-pulse absolute bottom-[-10%] right-[-6%] h-[400px] w-[400px] rounded-full blur-[140px]"
          style={{ background: "rgba(0,100,150,0.08)", animationDelay: "-3s" }}
        />
      </div>

      {/* ── Bandas de desgarro cromático (Wired tearing) ─── */}
      <div className="pointer-events-none fixed inset-0 z-[2] overflow-hidden">
        <div
          className="wired-tear absolute left-0 top-[18%] h-[14px] w-full mix-blend-screen"
          style={{
            background:
              "linear-gradient(90deg, transparent, #00FFFF 25%, #FF0055 60%, #00FF66 90%, transparent)",
          }}
        />
        <div
          className="wired-tear absolute left-0 top-[47%] h-[9px] w-full mix-blend-screen"
          style={{
            background:
              "linear-gradient(90deg, transparent, #FF0055 30%, #00FFFF 65%, transparent)",
            animationDelay: "-1.3s",
          }}
        />
        <div
          className="wired-tear absolute left-0 top-[76%] h-[6px] w-full mix-blend-screen"
          style={{
            background:
              "linear-gradient(90deg, transparent, #00FF66 40%, #00FFFF 75%, transparent)",
            animationDelay: "-2.4s",
          }}
        />
      </div>

      {/* ── Scanlines CRT (z-2, sobre la imagen) ────────── */}
      <div aria-hidden className="scan-slow pointer-events-none fixed inset-0 z-[2] opacity-50" />

      {/* ── Nav ───────────────────────────────────────────── */}
      <div className="fixed left-4 top-4 z-50 text-xs tracking-widest text-green-400/60">
        DARTH_10.SYS — CORRUPTION MODE
      </div>

      <SoundButton
        soundSrc="/sounds/glitch.mp3"
        onClick={handleCloseAll}
        className="group fixed right-4 top-4 z-50 flex items-center gap-1.5 border border-zinc-600 bg-black/70 px-3 py-1.5 text-[10px] tracking-[0.2em] text-white/60 backdrop-blur-sm transition-all hover:border-[#FF7A00]/60 hover:text-white sm:right-6 sm:top-6"
      >
        <X className="size-3.5 transition-transform duration-300 group-hover:rotate-90" />
        DESCONECTAR
      </SoundButton>

      {/* ── Reproductor de Spotify PIP // Flotante y libremente desplazable ── */}
      {mounted && (
        <div
          ref={pipRef}
          className={`fixed bottom-4 right-4 z-40 w-[calc(100vw-2rem)] sm:right-6 sm:bottom-6 sm:w-[400px] max-w-md select-none ${
            pipDragging ? "pointer-events-none" : ""
          }`}
          style={{ left: pipPos.current?.x, top: pipPos.current?.y, willChange: "left, top" }}
        >
          {minimized ? (
            /* ── Modo píldora compacta (disco giratorio + ecualizador) ── */
            <div
              className="cursor-grab active:cursor-grabbing"
              onPointerDown={pipHandleDown}
              style={{ touchAction: "none" }}
            >
              <div className="flex items-center gap-3 rounded-full border border-white/10 bg-neutral-950/85 py-1.5 pl-1.5 pr-2 shadow-2xl backdrop-blur-xl">
                <span className="pip-spin relative block h-10 w-10 shrink-0 rounded-full border border-cyan-900/60 bg-black shadow-[0_0_18px_rgba(6,182,212,0.3)]">
                  <span
                    aria-hidden
                    className="absolute inset-0 rounded-full"
                    style={{
                      background:
                        "repeating-radial-gradient(circle at 50% 50%, #0a4038 0px, #0a4038 1px, #072e2a 1px, #072e2a 3px)",
                    }}
                  />
                  <span
                    aria-hidden
                    className="absolute inset-0 m-auto h-1.5 w-1.5 rounded-full bg-cyan-400"
                  />
                </span>
                <span className="flex h-6 items-center gap-[3px]">
                  {[0, 1, 2, 3].map((i) => (
                    <span
                      key={i}
                      aria-hidden
                      className="pip-eq-bar inline-block h-4 w-[3px] rounded-sm bg-green-400/90"
                      style={{ animationDelay: `${i * 0.13}s` }}
                    />
                  ))}
                </span>
                <span className="min-w-0 flex-1 truncate text-[10px] font-mono tracking-widest text-cyan-300/90">
                  DARTH.10 MIX
                </span>
                <button
                  type="button"
                  data-no-drag
                  onClick={(e) => {
                    e.stopPropagation();
                    setMinimized(false);
                  }}
                  className="shrink-0 cursor-pointer rounded-full border border-cyan-900/60 bg-black/50 px-1.5 py-0.5 text-[11px] leading-none text-cyan-300 transition-colors hover:text-white"
                  title="Expandir reproductor"
                >
                  +
                </button>
              </div>
            </div>
          ) : (
            /* ── Modo completo: carátula, título y embed ── */
            <div className="overflow-hidden rounded-2xl border border-white/10 bg-neutral-950/85 p-3 shadow-2xl backdrop-blur-xl">
              <header
                className="flex cursor-grab select-none items-center justify-between gap-2 px-1 pb-2 font-mono text-[10px] tracking-wider text-cyan-400 active:cursor-grabbing"
                onPointerDown={pipHandleDown}
                style={{ touchAction: "none" }}
              >
                <span className="flex items-center gap-2">
                  <GripVertical className="h-3.5 w-3.5 text-cyan-500/70" />
                  <span className="inline-block h-2 w-2 rounded-full bg-cyan-400 animate-pulse" />
                  [ CONSOLE AUDIO FEED // DARTH.10 MIX ]
                </span>
                <span className="flex items-center gap-1">
                  <button
                    type="button"
                    data-no-drag
                    onClick={(e) => {
                      e.stopPropagation();
                      setMinimized(true);
                    }}
                    className="cursor-pointer select-none rounded border border-cyan-900/60 bg-black/50 px-1.5 py-0.5 text-xs leading-none text-neutral-400 transition-colors hover:text-cyan-300"
                    title="Minimizar a píldora compacta"
                  >
                    −
                  </button>
                  <button
                    type="button"
                    data-no-drag
                    onClick={(e) => {
                      e.stopPropagation();
                      setExpanded((prev) => !prev);
                    }}
                    className="cursor-pointer select-none rounded border border-cyan-900/60 bg-black/50 px-1.5 py-0.5 text-xs leading-none text-neutral-400 transition-colors hover:text-cyan-300"
                    title={expanded ? "Modo compacto (152px)" : "Ver lista completa (352px)"}
                  >
                    {expanded ? "▲" : "▼"}
                  </button>
                </span>
              </header>
              <iframe
                style={{ borderRadius: "12px" }}
                src="https://open.spotify.com/embed/playlist/6r0mw8mYkDRCyiDL4YVVC2?utm_source=generator&theme=0"
                width="100%"
                height={expanded ? "352" : "152"}
                frameBorder="0"
                allow="autoplay; clipboard-write; encrypted-media; fullscreen; picture-in-picture"
                loading="lazy"
                title="Darth.10 Spotify Playlist"
              />
            </div>
          )}
        </div>
      )}

      {/* ── Metadata técnica y telemetría (esquina inferior izquierda) ─── */}
      <div className="pointer-events-none fixed bottom-4 left-4 z-50 flex flex-wrap items-center gap-3 text-[9px] tracking-[0.25em] text-zinc-500">
        <span>[ SUBJECT: LAIN_IWAKURA // WIRED_ID: DARTH.10 ]</span>
        <span className="text-red-500/70" style={{ fontVariantLigatures: "none" }}>
          • {errors.length} ERROR(S) ACTIVE • MAX 40
        </span>
      </div>

      {/* ── Ventanas de error ─────────────────────────────── */}
      <div className="pointer-events-none fixed inset-0 z-20">
        {errors.map((e) => (
          <ErrorWindow
            key={e.id}
            x={e.x}
            y={e.y}
            z={e.z}
            onClose={() => closeError(e.id)}
            onFix={onFix}
            onDragStart={(ev) => handleDragStart(ev, e.id)}
          />
        ))}
      </div>
    </main>
  );
}