"use client";

import dynamic from "next/dynamic";

/**
 * Punto de entrada único para efectos visuales.
 * Scene3D, ModelViewer y ParticlesBackground se cargan solo en el cliente
 * (Three.js / tsparticles referencian `window`).
 * Nota: cada uno usa su exportación por defecto para evitar ChunkLoadError
 * en Turbopack con módulos pesados.
 */

export const Scene3D = dynamic(() => import("./Scene3D"), {
  ssr: false,
  loading: () => null,
});

export const ModelViewer = dynamic(() => import("./ModelViewer"), {
  ssr: false,
  loading: () => null,
});

export const ParticlesBackground = dynamic(() => import("./ParticlesBackground"), {
  ssr: false,
  loading: () => null,
});

export { SoundButton } from "./SoundButton";
