import { FX_STYLES } from "@/views/home/home-styles";
import { HomeAtmosphere } from "@/views/home/HomeAtmosphere";
import { RetroWmpHero } from "@/views/home/RetroWmpHero";
import { GllWelcomeBoard } from "@/views/home/GllWelcomeBoard";
import { RosterSection } from "@/views/home/RosterSection";
import { HomeFooter } from "@/views/home/HomeFooter";

/**
 * Home de GLL.
 *
 * La composición queda aquí; el contenido del roster vive en `src/data/members`,
 * el hero y el tablón en `src/views/home`, y las cards conservan su identidad
 * individual en `src/views/home/cards`.
 */
export default function Home() {
  return (
    <div className="flex min-h-screen flex-1 flex-col bg-[#050507] text-neutral-200 font-mono">
      <style>{FX_STYLES}</style>

      <HomeAtmosphere />

      {/* ── 1. TRANSMISSION TERMINAL ───────────────────────────── */}
      <RetroWmpHero />

      {/* ── 2. MANIFESTO DIGITAL ─────────────────────────────── */}
      <GllWelcomeBoard />

      {/* ── 3. DIGITAL ARCHIVE ROSTER ────────────────────────── */}
      <RosterSection />

      {/* ── FOOTER ───────────────────────────────────────────── */}
      <HomeFooter />
    </div>
  );
}