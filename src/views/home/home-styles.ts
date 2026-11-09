/**
 * Estilos y datos ambientales del Home GLL.
 *
 * Arquitectura:
 * - FX_STYLES: animaciones y texturas globales
 * - EMBERS/DUST_MOTES: partículas especializadas por miembro
 * - FactionColors: referencias visuales para los filtros
 */

/* ── Animaciones y texturas globales ─────────────────────────── */
export const FX_STYLES = `
/* ── Glitch de tarjeta ─────────────────────────────────────── */
@keyframes card-glitch {
  0%, 94% { filter: none; }
  95% { filter: brightness(1.4) saturate(1.5); }
  96% { filter: brightness(0.7); }
  97%, 100% { filter: none; }
}
.group card-glitch:hover { animation: card-glitch 2.4s linear infinite; }

/* ── Micro-glitch en el texto del fundador ─────────────────── */
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

/* ── Scanlines sutiles ─────────────────────────────────────── */
.scanlines {
  background-image: repeating-linear-gradient(0deg, rgba(0,0,0,0.3) 0px, rgba(0,0,0,0.3) 1px, transparent 1px, transparent 4px);
}

/* ── Radar sweep ───────────────────────────────────────────── */
@keyframes radarSpin {
  to { transform: rotate(360deg); }
}
.radar-sweep {
  background: conic-gradient(from 0deg, rgba(236,72,153,0.65), transparent 28%);
  animation: radarSpin 3s linear infinite;
}

/* ── Mini ecualizador ─────────────────────────────────────── */
@keyframes eqBounce {
  0%, 100% { transform: scaleY(0.2); }
  50% { transform: scaleY(1); }
}
.eq-mini { animation: eqBounce 0.8s ease-in-out infinite; transform-origin: bottom; }

/* ── Estrella pulsante ─────────────────────────────────────── */
@keyframes starPulse {
  0%, 100% { opacity: 0.7; transform: scale(1); filter: drop-shadow(0 0 15px rgba(220,38,38,0.5)); }
  50% { opacity: 1; transform: scale(1.06); filter: drop-shadow(0 0 28px rgba(220,38,38,0.85)); }
}
.star-pulse { animation: starPulse 2.4s ease-in-out infinite; }

/* ── Polvo estelar ─────────────────────────────────────────── */
@keyframes stellar-drift {
  0% { transform: translateY(0) translateX(0) scale(1); opacity: 0.15; }
  50% { transform: translateY(-40px) translateX(20px) scale(1.3); opacity: 0.6; }
  100% { transform: translateY(-80px) translateX(-15px) scale(0.8); opacity: 0.1; }
}

/* ── Partículas ember ─────────────────────────────────────── */
@keyframes ember-float {
  0%   { transform: translateY(0) scale(1); opacity: 0; }
  10%  { opacity: 0.9; }
  85%  { opacity: 0.4; }
  100% { transform: translateY(-60px) scale(0.4); opacity: 0; }
}
`;

/* ── Partículas para Darky (ember field) ───────────────────── */
export const EMBERS = Array.from({ length: 8 }, (_, i) => ({
  left: 12 + ((i * 9.5) % 78),
  dur: 1.6 + (i % 4) * 0.6,
  delay: -(i * 1.2),
}));

/* ── Motas de polvo estelar orgánicas ───────────────────────── */
export const DUST_MOTES = Array.from({ length: 20 }, (_, i) => ({
  top: `${(i * 17) % 94}%`,
  left: `${(i * 23) % 94}%`,
  size: 2 + (i % 3) * 1.5,
  dur: `${7 + (i % 5) * 2}s`,
  delay: `${-(i * 1.5)}s`,
  opacity: 0.25 + (i % 4) * 0.15,
}));

/* ── Barra de progreso del hero ───────────────────────────────── */
export const PROGRESS_CONFIG = {
  totalSeconds: 213, // 3:33
  tickInterval: 250,
};

/* ── Layout breakpoints ─────────────────────────────────────── */
export const LAYOUT = {
  heroMaxWidth: "max-w-2xl",
  rosterMaxWidth: "max-w-7xl",
  cardGutter: "gap-5",
  cardSpan: {
    wide: "col-span-1 sm:col-span-2 lg:col-span-2",
    compact: "col-span-1",
  },
};