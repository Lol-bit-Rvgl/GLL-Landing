"use client";

import { useMemo } from "react";
import Particles, { ParticlesProvider } from "@tsparticles/react";
import { loadSlim } from "@tsparticles/slim";
import type { ISourceOptions, Engine } from "@tsparticles/engine";

interface ParticlesBackgroundProps {
  className?: string;
}

export function ParticlesBackground({ className }: ParticlesBackgroundProps) {
  const options: ISourceOptions = useMemo(
    () => ({
      fullScreen: false,
      fpsLimit: 30,
      particles: {
        number: { value: 40, density: { enable: true } },
        color: { value: ["#8C8884", "#6B1420", "#C81E3A"] },
        opacity: {
          value: { min: 0.1, max: 0.35 },
          animation: { enable: true, speed: 0.4, sync: false },
        },
        size: {
          value: { min: 1, max: 3 },
          animation: { enable: true, speed: 0.6, sync: false },
        },
        move: {
          enable: true,
          speed: { min: 0.2, max: 0.8 },
          direction: "none" as const,
          outModes: { default: "out" as const },
        },
      },
      detectRetina: true,
    }),
    [],
  );

  const init = async (engine: Engine) => {
    await loadSlim(engine);
  };

  return (
    <ParticlesProvider init={init}>
      <Particles
        id="gll-particles"
        options={options}
        className={className}
      />
    </ParticlesProvider>
  );
}

export default ParticlesBackground;
