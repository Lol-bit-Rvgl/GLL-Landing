"use client";

import {
  Component,
  Suspense,
  useMemo,
  useRef,
  useState,
  useEffect,
  type ReactNode,
} from "react";
import { Canvas, useFrame, useLoader } from "@react-three/fiber";
import * as THREE from "three";
import type { Group } from "three";
import { USDZLoader } from "three/examples/jsm/loaders/USDZLoader.js";

/* ── ErrorBoundary: si el modelo falla (formato/404) → estática CRT ── */
class GLBoundary extends Component<
  { fallback: ReactNode; children: ReactNode },
  { hasError: boolean }
> {
  state = { hasError: false };
  static getDerivedStateFromError() {
    return { hasError: true };
  }
  render() {
    return this.state.hasError ? this.props.fallback : this.props.children;
  }
}

function Model({ url }: { url: string }) {
  const ref = useRef<Group>(null);
  const scene = useLoader(USDZLoader, url);

  // Auto-fit: centrar y normalizar escala del modelo
  useMemo(() => {
    const box = new THREE.Box3().setFromObject(scene);
    const size = box.getSize(new THREE.Vector3());
    const center = box.getCenter(new THREE.Vector3());
    const maxDim = Math.max(size.x, size.y, size.z) || 1;
    const scale = 2.2 / maxDim;
    scene.scale.setScalar(scale);
    scene.position.sub(center.multiplyScalar(scale));
  }, [scene]);

  useFrame((state) => {
    if (!ref.current) return;
    ref.current.rotation.y =
      state.clock.elapsedTime * 0.25 + state.pointer.x * 0.6;
    ref.current.rotation.x = state.pointer.y * 0.25;
  });

  return (
    <group ref={ref}>
      <primitive object={scene} />
    </group>
  );
}

/* ── Fallback: estática CRT "NO SIGNAL" ──────────────── */
function StaticFallback() {
  return (
    <div className="relative h-full w-full overflow-hidden bg-black">
      <svg className="absolute inset-0 h-full w-full opacity-25">
        <filter id="mv-noise">
          <feTurbulence
            type="fractalNoise"
            baseFrequency="0.9"
            numOctaves="3"
            stitchTiles="stitch"
          />
        </filter>
        <rect width="100%" height="100%" filter="url(#mv-noise)" />
      </svg>
      <div
        className="absolute inset-0"
        style={{
          backgroundImage:
            "repeating-linear-gradient(0deg, rgba(0,0,0,0.4) 0px, rgba(0,0,0,0.4) 1px, transparent 1px, transparent 3px)",
        }}
      />
      <div className="absolute inset-0 flex flex-col items-center justify-center gap-2">
        <p className="text-xs font-bold tracking-[0.4em] text-[#FF9900]">
          NO SIGNAL
        </p>
        <p className="text-[10px] tracking-[0.25em] text-[#F0EDE6]/40">
          MODEL_STREAM LOST — RECONNECTING...
        </p>
      </div>
    </div>
  );
}

export interface ModelViewerProps {
  url: string;
  className?: string;
  keyLight?: string;
  accentLight?: string;
}

export function ModelViewer({
  url,
  className,
  keyLight = "#FF8C00",
  accentLight = "#4A0E4E",
}: ModelViewerProps) {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    return (
      <div className={className}>
        <StaticFallback />
      </div>
    );
  }

  return (
    <div className={className}>
      <GLBoundary fallback={<StaticFallback />}>
        <Canvas
          camera={{ position: [0, 0, 4], fov: 50 }}
          gl={{ alpha: true, antialias: true }}
          style={{ background: "transparent" }}
        >
          <ambientLight intensity={0.35} />
          <pointLight position={[4, 3, 4]} intensity={25} color={keyLight} />
          <pointLight position={[-4, -2, 3]} intensity={18} color={accentLight} />
          <Suspense fallback={null}>
            <Model url={url} />
          </Suspense>
        </Canvas>
      </GLBoundary>
    </div>
  );
}

export default ModelViewer;
