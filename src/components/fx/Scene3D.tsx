"use client";

import { Canvas, useFrame } from "@react-three/fiber";
import { MeshDistortMaterial, Float } from "@react-three/drei";
import { useRef } from "react";
import type { Mesh } from "three";

interface FloatingOctahedronProps {
  baseColor: string;
  emissive: string;
}

function FloatingOctahedron({ baseColor, emissive }: FloatingOctahedronProps) {
  const ref = useRef<Mesh>(null);

  useFrame((state) => {
    if (!ref.current) return;
    ref.current.rotation.x =
      state.clock.elapsedTime * 0.15 + state.pointer.y * 0.4;
    ref.current.rotation.y =
      state.clock.elapsedTime * 0.2 + state.pointer.x * 0.5;
  });

  return (
    <Float speed={1.5} rotationIntensity={0.3} floatIntensity={0.8}>
      <mesh ref={ref}>
        <octahedronGeometry args={[1.2, 0]} />
        <MeshDistortMaterial
          color={baseColor}
          emissive={emissive}
          emissiveIntensity={0.15}
          roughness={0.3}
          metalness={0.8}
          distort={0.15}
          speed={1.2}
        />
      </mesh>
    </Float>
  );
}

export interface Scene3DProps {
  className?: string;
  /** Color base de la geometría (default carbón GLL) */
  baseColor?: string;
  /** Emisión del material (default vino GLL) */
  emissive?: string;
  /** Luz direccional principal */
  keyLight?: string;
  /** Luz puntual de contraste */
  accentLight?: string;
}

export function Scene3D({
  className,
  baseColor = "#1A1717",
  emissive = "#4A0A10",
  keyLight = "#E7E4DE",
  accentLight = "#6B1420",
}: Scene3DProps) {
  return (
    <div className={className}>
      <Canvas
        camera={{ position: [0, 0, 4], fov: 50 }}
        gl={{ alpha: true, antialias: true }}
        style={{ background: "transparent" }}
      >
        <ambientLight intensity={0.3} />
        <directionalLight position={[5, 5, 5]} intensity={0.6} color={keyLight} />
        <pointLight position={[-3, 2, -3]} intensity={0.4} color={accentLight} />
        <FloatingOctahedron baseColor={baseColor} emissive={emissive} />
      </Canvas>
    </div>
  );
}

export default Scene3D;
