import { ParticlesBackground } from "@/components/fx";
import { DUST_MOTES } from "./home-styles";

/**
 * Capa ambiental fija de la home: gradientes carmesí/azul, polvo estelar y
 * partículas. Es puramente decorativa y no captura punteros.
 */
export function HomeAtmosphere() {
  return (
    <>
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
    </>
  );
}
