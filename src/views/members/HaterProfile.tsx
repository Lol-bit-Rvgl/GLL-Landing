"use client";

import { useState, useEffect, useRef } from "react";
import type { Member } from "@/data/members";
import useSound from "use-sound";

const FX_STYLES = `
@keyframes introShake {
  0% { transform: translate(0, 0); }
  20% { transform: translate(-6px, 3px) skewX(-1deg); }
  40% { transform: translate(5px, -4px); }
  60% { transform: translate(-4px, -3px) skewX(1deg); }
  80% { transform: translate(6px, 4px); }
  100% { transform: translate(0, 0); }
}
@keyframes tauntFlicker {
  0%, 100% { opacity: 1; }
  8% { opacity: 0.25; }
  10% { opacity: 1; }
  36% { opacity: 0.4; }
  38% { opacity: 1; }
  64% { opacity: 0.55; }
  66% { opacity: 1; }
}
@keyframes linkPulse {
  0%, 100% { box-shadow: 0 0 12px rgba(220,38,38,0.35); }
  50% { box-shadow: 0 0 28px rgba(220,38,38,0.7); }
}
.intro-shaking { animation: introShake 0.12s steps(2) infinite; }
.taunt-text {
  animation: tauntFlicker 1.5s steps(1);
  text-shadow:
    -3px 0 rgba(255,0,0,0.85),
    3px 0 rgba(0,255,255,0.85),
    0 0 18px rgba(255,255,255,0.35);
}
.link-pulse { animation: linkPulse 1.6s ease-in-out infinite; }
@keyframes vinylSpin {
  to { transform: rotate(360deg); }
}
@keyframes sleeveGlow {
  0%, 100% { box-shadow: 0 0 12px rgba(220,38,38,0.15); }
  50% { box-shadow: 0 0 25px rgba(220,38,38,0.3); }
}
.vinyl-spin { animation: vinylSpin 6s linear infinite; }
.sleeve-glow { animation: sleeveGlow 2.4s ease-in-out infinite; }
`;

type IntroPhase = "idle" | "playing" | "fading";

/* ── Archivo de pistas: Sinister Minds ─────────────────── */
const TRACKS: string[] = [
  "/images/members/hater/track-01.png",
  "/images/members/hater/track-02.png",
  "/images/members/hater/track-03.jpg",
  "/images/members/hater/track-04.png",
  "/images/members/hater/track-05.jpg",
  "/images/members/hater/track-06.jpg",
  "/images/members/hater/track-07.jpg",
  "/images/members/hater/track-08.jpg",
  "/images/members/hater/track-09.jpg",
  "/images/members/hater/track-10.png",
  "/images/members/hater/track-11.jpg",
  "/images/members/hater/track-12.jpg",
  "/images/members/hater/track-13.jpg",
];

export function HaterProfile({ member }: { member: Member }) {
  const [mounted, setMounted] = useState(false);
  const [phase, setPhase] = useState<IntroPhase>("idle");
  const [showIntro, setShowIntro] = useState(true);
  const [isVinylOpen, setIsVinylOpen] = useState(false);
  const timers = useRef<number[]>([]);

  const [playLaugh] = useSound("/audio/hater/laugh.mp3", { volume: 0.85 });

  useEffect(() => {
    setMounted(true);
    const pending = timers.current;
    return () => {
      pending.forEach((t) => window.clearTimeout(t));
    };
  }, []);

  const later = (ms: number, fn: () => void) => {
    timers.current.push(window.setTimeout(fn, ms));
  };

  const establishLink = () => {
    if (phase !== "idle") return;
    playLaugh();
    setPhase("playing");
    later(1500, () => {
      setPhase("fading");
      later(750, () => setShowIntro(false));
    });
  };

  const skipIntro = () => {
    timers.current.forEach((t) => window.clearTimeout(t));
    timers.current = [];
    setShowIntro(false);
  };

  if (!mounted) {
    return (
      <main className="flex min-h-screen items-center justify-center bg-[#050505]">
        <span className="font-mono text-xs tracking-[0.4em] text-red-800">
          ESTABLISHING LINK<span className="animate-pulse">_</span>
        </span>
      </main>
    );
  }

  return (
    <main className="relative min-h-screen overflow-x-clip bg-[#050505] text-zinc-200">
      <style>{FX_STYLES}</style>

      {/* ── CRT tenue ────────────────────────────────────── */}
      <div
        aria-hidden
        className="pointer-events-none fixed inset-0 z-0 opacity-70"
        style={{
          backgroundImage:
            "repeating-linear-gradient(0deg, rgba(255,255,255,0.025) 0px, rgba(255,255,255,0.025) 1px, transparent 1px, transparent 4px)",
        }}
      />
      <div
        aria-hidden
        className="pointer-events-none fixed inset-0 z-0"
        style={{
          background:
            "radial-gradient(ellipse at center, transparent 45%, rgba(0,0,0,0.75) 100%)",
        }}
      />

      {/* ── INTRO: Sonic.exe taunt ───────────────────────── */}
      {showIntro && (
        <div
          className={`fixed inset-0 z-50 flex flex-col items-center justify-center bg-black transition-opacity duration-700 ${
            phase === "fading" ? "opacity-0 pointer-events-none" : "opacity-100"
          } ${phase === "playing" ? "intro-shaking" : ""}`}
        >
          <button
            onClick={skipIntro}
            className="absolute right-4 top-4 border border-zinc-800 px-2.5 py-1 font-mono text-[10px] tracking-[0.25em] text-zinc-600 transition-colors hover:border-zinc-500 hover:text-zinc-300"
          >
            [ SKIP ]
          </button>

          {phase === "idle" ? (
            <button
              onClick={establishLink}
              className="link-pulse border border-red-900 bg-red-950/30 px-6 py-3 font-mono text-xs tracking-[0.3em] text-red-400 transition-colors hover:bg-red-950/60 hover:text-red-200"
            >
              [ CLICK TO ESTABLISH LINK // INICIAR CONEXIÓN ]
            </button>
          ) : (
            <p className="taunt-text px-6 text-center font-mono text-xl tracking-wider text-white sm:text-3xl">
              HELLO. DO YOU WANT TO PLAY WITH ME ?
            </p>
          )}
        </div>
      )}

      {/* ── Barra superior ───────────────────────────────── */}
      <div className="relative z-10 mx-auto max-w-2xl px-5 pt-6 sm:px-8">
        <a
          href="/"
          className="inline-flex items-center gap-1.5 border border-red-950 bg-black/60 px-3 py-1.5 text-[11px] font-bold tracking-[0.2em] text-red-400/80 backdrop-blur-md transition-colors hover:border-red-700 hover:text-red-200"
        >
          <span aria-hidden>&larr;</span>[ GLL // ROSTER ]
        </a>
      </div>

      {/* ── Cabecera ─────────────────────────────────────── */}
      <div className="relative z-10 mx-auto max-w-2xl px-5 pb-6 pt-12 text-center sm:px-8">
        <h1
          className="bg-gradient-to-b from-red-500 via-[#991b1b] to-black bg-clip-text font-serif text-5xl font-black tracking-wide text-transparent drop-shadow-[0_0_25px_rgba(220,38,38,0.35)] sm:text-7xl"
          style={{ fontVariantLigatures: "none" }}
        >
          {member.displayName}
        </h1>
        <p className="mt-3 font-mono text-[11px] tracking-[0.35em] text-red-800">
          [ 15/09/2026 12:47 ]
        </p>
        <p className="text-neutral-400 font-serif italic text-lg tracking-wider text-center mt-3">
          &ldquo;I&apos;d missed you old friend&rdquo;
        </p>
      </div>

      {/* ── Feed corrupto: Spotify ───────────────────────── */}
      <div className="relative z-10 mx-auto max-w-2xl px-5 pb-20 sm:px-8">
        <div className="w-full max-w-xl mx-auto my-8 rounded-xl overflow-hidden border border-red-950/60 bg-neutral-950/80 p-3 shadow-[0_0_30px_rgba(220,38,38,0.2)] backdrop-blur-md">
          <div className="text-[10px] font-mono text-red-400 mb-2 px-1 flex items-center justify-between tracking-wider select-none">
            <span className="flex items-center gap-2">
              <span className="inline-block w-2 h-2 rounded-full bg-red-600 animate-ping" />
              [ CORRUPTED FEED // SPOTIFY BROADCAST ]
            </span>
            <span className="text-xs text-neutral-500 font-mono">ALBUM PLAYLIST</span>
          </div>
          <iframe
            style={{ borderRadius: "12px" }}
            src="https://open.spotify.com/embed/album/335oq3WJCd1U5GQJBwdmkd?utm_source=generator&theme=0"
            width="100%"
            height="152"
            frameBorder="0"
            allow="autoplay; clipboard-write; encrypted-media; fullscreen; picture-in-picture"
            loading="lazy"
            title="Hater Spotify Broadcast"
          />
        </div>
      </div>

      {/* ── Módulo vinilo: Sinister Minds ─────────────────── */}
      <div className="relative z-10 mx-auto max-w-4xl px-5 sm:px-8">
        <section className="my-10 border border-red-950/60 bg-black/60 p-5 backdrop-blur-md sm:p-8">
          <p className="text-center font-mono text-[11px] tracking-[0.35em] text-red-500">
            [ VINYL SHOWCASE // SINISTER MINDS ]
          </p>

          <div className="mt-8 grid items-center gap-8 md:grid-cols-2">
            {/* funda + disco */}
            <div className="flex justify-center">
              <button
                onClick={() => setIsVinylOpen((v) => !v)}
                title={isVinylOpen ? "Guardar el disco" : "Sacar el disco"}
                className="relative block h-56 w-56 sm:h-64 sm:w-64"
              >
                {/* disco */}
                <span
                  aria-hidden
                  className={`absolute inset-0 rounded-full transition-transform duration-700 ease-out ${
                    isVinylOpen ? "translate-x-28 sm:translate-x-36" : "translate-x-0"
                  }`}
                >
                  <span
                    className={`absolute inset-0 block rounded-full ${isVinylOpen ? "vinyl-spin" : ""}`}
                    style={{
                      background:
                        "repeating-radial-gradient(circle at center, #0a0a0a 0px, #0a0a0a 2px, #262626 3px, #0a0a0a 4px)",
                    }}
                  >
                    <span className="absolute left-1/2 top-1/2 block h-20 w-20 -translate-x-1/2 -translate-y-1/2 overflow-hidden rounded-full border-2 border-neutral-800">
                      <img
                        src="/images/members/hater/vinyl-cover.jpg"
                        alt=""
                        className="h-full w-full object-cover"
                        loading="lazy"
                      />
                    </span>
                    <span className="absolute left-1/2 top-1/2 block h-2.5 w-2.5 -translate-x-1/2 -translate-y-1/2 rounded-full bg-neutral-950 ring-1 ring-neutral-700" />
                  </span>
                </span>
                {/* funda */}
                <span
                  className={`absolute inset-0 z-10 block overflow-hidden border border-red-950 bg-neutral-950 transition-all duration-500 ${
                    isVinylOpen ? "sleeve-glow border-red-800" : "hover:border-red-800"
                  }`}
                >
                  <img
                    src="/images/members/hater/vinyl-cover.jpg"
                    alt="Portada de Sinister Minds"
                    className="h-full w-full object-cover"
                    loading="lazy"
                  />
                </span>
              </button>
            </div>

            {/* libreto / liner notes */}
            <div>
              <p className="font-mono text-[10px] tracking-[0.3em] text-red-500">
                LINER NOTES // SIDE A
              </p>
              <div className="mt-3 space-y-4 font-serif text-sm leading-relaxed text-zinc-300/90">
                <p>
                  Sinister Minds is an album created by Churgney Gurgney and
                  Marley Jauz, the album is themed around the character Lord X
                  by JoeDoughBoi, a take on the infamous story of Sonic.EXE.
                </p>
                <p>
                  The album presents itself as an in-universe album created by
                  Lord X, with guest features from other characters, such as
                  Majin (played by RedTv53), and Bendo from Badass Kridz
                  (played by Wrathstetic).
                </p>
                <p>
                  Sinister Minds features 16 different songs, with I Miss The
                  Quiet and Big Misser being released beforehand as teasers for
                  the album, with the album itself being released a day earlier
                  than intended on October 30th 2025 (10/30/25) after an
                  unexpected accident with Distrokid leaked the album.
                </p>
              </div>
              <p className="mt-4 font-mono text-[10px] tracking-[0.25em] text-zinc-600">
                {isVinylOpen ? "● NOW SPINNING" : "○ CLICK THE SLEEVE TO PLAY"}
              </p>
            </div>
          </div>
        </section>

        {/* ── Galería de pistas ──────────────────────────── */}
        <section className="mt-10">
          <p className="text-center font-mono text-[11px] tracking-[0.35em] text-red-500">
            [ TRACK ARCHIVE // SINISTER MINDS COMPILATION ]
          </p>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 max-w-4xl mx-auto mt-10">
            {TRACKS.map((src, i) => (
              <figure
                key={src}
                className="group border border-red-950 bg-black transition-colors hover:border-red-600"
              >
                <div className="overflow-hidden">
                  <img
                    src={src}
                    alt={`Sinister Minds — pista ${String(i + 1).padStart(2, "0")}`}
                    loading="lazy"
                    className="h-auto w-full select-none transition-transform duration-300 group-hover:scale-105"
                  />
                </div>
                <figcaption className="border-t border-red-950/60 px-3 py-2 font-mono text-[10px] tracking-[0.25em] text-zinc-500">
                  TRACK {String(i + 1).padStart(2, "0")} // 13
                </figcaption>
              </figure>
            ))}
          </div>
        </section>

        <p className="mt-10 pb-20 text-center font-mono text-[10px] tracking-[0.3em] text-red-950">
          HATER // GLL ARCHIVE
        </p>
      </div>
    </main>
  );
}
