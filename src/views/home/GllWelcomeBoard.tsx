import { ExternalLink, Gamepad2, Shield, Users } from "lucide-react";
import { SiDiscord } from "react-icons/si";

/**
 * GLL WELCOME BOARD - Manifesto Digital
 *
 * Declaración de identidad de GLL como una red de señal/comunidad.
 * No es una simple card, es una sección declarativa de propósito.
 */
export function GllWelcomeBoard() {
  return (
    <section className="relative mx-auto mt-10 w-full max-w-5xl px-4 sm:px-6">
      <div className="relative overflow-hidden rounded-2xl border border-red-900/40 bg-[#08050c]/90 p-6 shadow-[0_0_60px_rgba(0,0,0,0.9)] backdrop-blur-xl transition-colors hover:border-red-600/50 sm:p-10">
        {/* Cruces de señal en las 4 esquinas */}
        <span className="pointer-events-none absolute left-3 top-3 font-mono text-xs font-bold text-red-500/60 select-none">
          +
        </span>
        <span className="pointer-events-none absolute right-3 top-3 font-mono text-xs font-bold text-red-500/60 select-none">
          +
        </span>
        <span className="pointer-events-none absolute bottom-3 left-3 font-mono text-xs font-bold text-red-500/60 select-none">
          +
        </span>
        <span className="pointer-events-none absolute bottom-3 right-3 font-mono text-xs font-bold text-red-500/60 select-none">
          +
        </span>

        {/* Resplandor de fondo */}
        <div
          aria-hidden
          className="pointer-events-none absolute -top-24 left-1/2 h-64 w-96 -translate-x-1/2 rounded-full bg-red-600/10 blur-3xl"
        />

        {/* === ENCABEZADO DE IDENTIDAD === */}
        <div className="text-center">
          <p className="font-serif text-lg font-bold tracking-wide text-zinc-100 sm:text-2xl lg:text-3xl">
            ₊‧꒰ა ✦ ໒꒱ ‧₊˚ 𝑮𝑳𝑳 — 𝐆𝐨𝐝&apos;𝐬 𝐋𝐢𝐯𝐞 𝐋𝐨𝐧𝐠𝐞𝐫.™ ˚₊‧꒰ა ✦ ໒꒱ ‧₊˚
          </p>
        </div>

        {/* === DESCRIPCIÓN DE COMUNIDAD === */}
        <div className="mt-6 text-center">
          <h2 className="font-serif text-2xl font-black italic tracking-wide text-red-100 sm:text-3xl">
            𝑾𝒆𝒍𝒄𝒐𝒎𝒆 𝒕𝒐 𝑮𝑳𝑳
          </h2>
          <p className="mx-auto mt-3 max-w-2xl text-sm leading-relaxed text-zinc-300 sm:text-base">
            Una red de señal para conocer personas, compartir intereses y transmitir historias.
          </p>
          <p className="mt-2 font-mono text-xs font-semibold tracking-wider text-red-400 sm:text-sm">
            &gt; ✦ TRANSFER // AUDIO · VIDEOJUEGOS · ROLEPLAY · AMISTADES ✦
          </p>
        </div>

        {/* === SEPARADOR ORNAMENTAL === */}
        <div className="my-8 flex items-center justify-center gap-3">
          <span className="h-px flex-1 bg-gradient-to-r from-transparent via-red-800/50 to-transparent" />
          <span className="text-xs text-red-500 select-none">✦ ── ୨୧ ── ✦</span>
          <span className="h-px flex-1 bg-gradient-to-r from-transparent via-red-800/50 to-transparent" />
        </div>

        {/* === REDES DE COMUNIDAD === */}
        <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
          {/* Actividades */}
          <div className="rounded-xl border border-red-950/70 bg-black/50 p-5 backdrop-blur-sm transition hover:border-red-600/40">
            <div className="mb-3 flex items-center justify-center gap-2">
              <Gamepad2 className="h-4 w-4 text-red-400" />
              <h3 className="font-serif text-base font-bold text-red-200">
                ୨୧ ── 𝑸𝑹𝑬𝑨𝑫𝑶𝑹 ── ୨୧
              </h3>
            </div>
            <ul className="space-y-2.5 text-xs text-zinc-300">
              <li className="flex items-start gap-2">
                <span className="text-red-400 font-bold">•</span>
                <span>
                  <strong className="text-zinc-100 font-medium">Stories:</strong> Narrativas,
                  facciones e historias compartidas.
                </span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-red-400 font-bold">•</span>
                <span>
                  <strong className="text-zinc-100 font-medium">Signal:</strong> Canales de audio,
                  transmisiones y dinámicas grupales.
                </span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-red-400 font-bold">•</span>
                <span>
                  <strong className="text-zinc-100 font-medium">Play:</strong> Juegos en
                  Roblox, Minecraft, Fortnite y más.
                </span>
              </li>
            </ul>
          </div>

          {/* Seguridad */}
          <div className="rounded-xl border border-red-950/70 bg-black/50 p-5 backdrop-blur-sm transition hover:border-red-600/40">
            <div className="mb-3 flex items-center justify-center gap-2">
              <Shield className="h-4 w-4 text-red-400" />
              <h3 className="font-serif text-base font-bold text-red-200">
                ✦ 𝑺𝑰𝑳𝑶𝑵𝑼𝑺 ✦
              </h3>
            </div>
            <ul className="space-y-2.5 text-xs text-zinc-300">
              <li className="flex items-start gap-2">
                <span className="text-red-400 font-bold">•</span>
                <span>
                  <strong className="text-zinc-100 font-medium">Espacio Seguro:</strong> Liberado
                  de toxicidad y bajo supervisión activa.
                </span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-red-400 font-bold">•</span>
                <span>
                  <strong className="text-zinc-100 font-medium">Cuidado Activo:</strong> Soporte
                  integral y moderación inmediata.
                </span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-red-400 font-bold">•</span>
                <span>
                  <strong className="text-zinc-100 font-medium">Contacto Directo:</strong> Mensaje
                  directo al staff disponible.
                </span>
              </li>
            </ul>
          </div>

          {/* Comunidad */}
          <div className="rounded-xl border border-red-950/70 bg-black/50 p-5 backdrop-blur-sm transition hover:border-red-600/40">
            <div className="mb-3 flex items-center justify-center gap-2">
              <Users className="h-4 w-4 text-red-400" />
              <h3 className="font-serif text-base font-bold text-red-200">
                ✦ 𝑪𝑶𝑵𝑬 𝑩‐𝑳𝑨𝑵𝑬 ✦
              </h3>
            </div>
            <ul className="space-y-2.5 text-xs text-zinc-300">
              <li className="flex items-start gap-2">
                <span className="text-red-400 font-bold">•</span>
                <span>
                  <strong className="text-zinc-100 font-medium">Libre Participación:</strong> Sin
                  horarios forzados ni requisitos de actividad.
                </span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-red-400 font-bold">•</span>
                <span>
                  <strong className="text-zinc-100 font-medium">Conexiones:</strong> Encuentra
                  gente con intereses compatibles.
                </span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-red-400 font-bold">•</span>
                <span>
                  <strong className="text-zinc-100 font-medium">Puerta de Entrada:</strong> Un
                  hogar digital donde ser auténtico.
                </span>
              </li>
            </ul>
          </div>
        </div>

        {/* === CALL TO ACTION DISCORD === */}
        <div className="mt-10 flex flex-col items-center justify-center text-center">
          <a
            href="https://discord.gg/JFwbkEbfAH"
            target="_blank"
            rel="noopener noreferrer"
            className="group relative inline-flex items-center justify-center gap-3 overflow-hidden rounded-xl border border-red-400/50 bg-gradient-to-r from-red-600 via-purple-600 to-red-600 px-8 py-4 font-mono text-sm font-bold tracking-wider text-white shadow-[0_0_30px_rgba(220,38,38,0.4),0_0_60px_rgba(168,85,247,0.3)] transition-all duration-300 hover:scale-105 hover:border-purple-300 hover:shadow-[0_0_50px_rgba(220,38,38,0.7),0_0_80px_rgba(168,85,247,0.6)] active:scale-95 sm:text-base"
          >
            <SiDiscord className="h-5 w-5 text-white transition-transform group-hover:rotate-12" />
            <span>[ ╰┈➤ ÚNETE A GLL // DISCORD SERVER ]</span>
            <ExternalLink className="h-4 w-4 opacity-70 transition-opacity group-hover:opacity-100" />
          </a>
          <p className="mt-2 font-mono text-[10px] tracking-widest text-zinc-500 uppercase">
            OFFICIAL GATEWAY // DIRECT ACCESS
          </p>
        </div>
      </div>
    </section>
  );
}