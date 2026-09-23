"use client";

import { useState, useEffect, useRef } from "react";
import type { Member } from "@/data/members";
import * as THREE from "three";
import { GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader.js";

const FX_STYLES = `
@keyframes ashRise {
  0% { transform: translate3d(0, 15vh, 0) rotate(0deg); opacity: 0; }
  10% { opacity: var(--po, 0.5); }
  85% { opacity: var(--po, 0.5); }
  100% { transform: translate3d(var(--dx, 30px), -105vh, 0) rotate(300deg); opacity: 0; }
}
@keyframes eyePulse {
  0%, 100% { opacity: 0.7; }
  42% { opacity: 0.9; }
  50% { opacity: 1; }
  58% { opacity: 0.85; }
  88% { opacity: 0.75; }
  93% { opacity: 1; }
  97% { opacity: 0.8; }
}
@keyframes hudScan {
  0% { top: -12%; opacity: 0; }
  8% { opacity: 1; }
  90% { opacity: 1; }
  100% { top: 112%; opacity: 0; }
}
@keyframes pendulum {
  from { transform: rotate(-6deg); }
  to { transform: rotate(6deg); }
}
@keyframes sealGlow {
  0%, 100% { box-shadow: 0 0 10px rgba(185,28,28,0.35); }
  50% { box-shadow: 0 0 22px rgba(220,38,38,0.6); }
}
.ash-particle { animation: ashRise linear infinite; }
.eye-glow { animation: eyePulse 4s ease-in-out infinite; }
.hud-scan { animation: hudScan 5s linear infinite; }
.pendulum { animation: pendulum 3.2s ease-in-out infinite alternate; transform-origin: top center; }
.seal-glow { animation: sealGlow 3.6s ease-in-out infinite; }
`;

/* ── Cenizas con profundidad de campo ──────────────────── */
const ASHES: { left: number; size: number; dur: number; delay: number; dx: number; po: number; light: boolean; blur: boolean }[] =
  Array.from({ length: 16 }, (_, i) => ({
    left: (i * 53.7 + 7) % 100,
    size: 2 + (i % 4),
    dur: 9 + ((i * 7) % 8),
    delay: -((i * 3.1) % 14),
    dx: ((i * 37) % 80) - 40,
    po: 0.2 + ((i * 13) % 30) / 100,
    light: i % 3 === 0,
    blur: i % 4 === 0,
  }));

/* ── Hojas de ginkgo: valores deterministas ────────────── */
const LEAVES: { x: number; y: number; size: number; spin: number; phase: number; depth: number; tone: number }[] =
  Array.from({ length: 12 }, (_, i) => ({
    x: (i * 83.3 + 11) % 100,
    y: (i * 47.7 + 5) % 100,
    size: 12 + ((i * 5) % 12),
    spin: 0.8 + ((i * 3) % 20) / 10,
    phase: (i * 1.7) % (Math.PI * 2),
    depth: 0.4 + ((i * 7) % 60) / 100,
    tone: i % 3,
  }));

const LEAF_FILL = ["#d4af37", "#8a6d1f", "#b8942e"];

const PILLARS = [
  {
    src: "/images/members/stark/banner-sephiroth.jpg",
    label: "SEPHIROTH",
    specimen: "ARCHIVE // SPECIMEN 01: SEPHIROTH",
    grade: "grayscale(1) contrast(1.3) brightness(0.82)",
    tint: "bg-sky-900/20 mix-blend-overlay",
  },
  {
    src: "/images/members/stark/banner-vegito.jpg",
    label: "VEGITO",
    specimen: "ARCHIVE // SPECIMEN 02: THE FUSION",
    grade: "saturate(0.7) contrast(1.05) brightness(0.85)",
    tint: "bg-neutral-800/20 mix-blend-overlay",
  },
  {
    src: "/images/members/stark/banner-ironman.jpg",
    label: "IRON MAN",
    specimen: "ARCHIVE // SPECIMEN 03: THE GENIUS",
    grade: "saturate(0.85) contrast(1.1) brightness(0.85)",
    tint: "bg-red-800/20 mix-blend-overlay",
  },
];

const CLIPS = [
  "polygon(0 0, 100% 0, 92% 100%, 0 100%)",
  "polygon(8% 0, 100% 0, 92% 100%, 0 100%)",
  "polygon(8% 0, 100% 0, 100% 100%, 0 100%)",
];

/* ── Hoja de ginkgo (abanico poligonal) ────────────────── */
function GinkgoLeaf({ size, tone, opacity }: { size: number; tone: number; opacity: number }) {
  const fill = LEAF_FILL[tone % LEAF_FILL.length];
  return (
    <svg width={size * 2} height={size * 2} viewBox="0 0 100 100" style={{ opacity }}>
      <path
        d="M50 96 L12 42 Q50 -12 88 42 Z"
        fill={fill}
        stroke="#5c4a12"
        strokeWidth="2"
      />
      <path d="M50 96 L50 30 M50 96 L28 52 M50 96 L72 52" stroke={fill === "#d4af37" ? "#8a6d1f" : "#d4af37"} strokeWidth="1.5" opacity="0.7" />
      <path d="M50 96 L50 108" stroke="#5c4a12" strokeWidth="3" strokeLinecap="round" />
    </svg>
  );
}

/* ── Ráfagas Tsushima: hojas con física de viento (rAF) ── */
function WindLeaves() {
  const refs = useRef<(HTMLDivElement | null)[]>([]);

  useEffect(() => {
    let raf = 0;
    let t = 0;
    let last = performance.now();
    let gust = 0;
    let gustTarget = 0.6;
    let nextGust = 1;
    const N = LEAVES.length;
    const state = LEAVES.map((l) => ({
      x: (l.x / 100) * window.innerWidth,
      y: (l.y / 100) * window.innerHeight,
      rot: (l.phase * 180) / Math.PI,
    }));

    const frame = (now: number) => {
      const dt = Math.min(0.05, (now - last) / 1000);
      last = now;
      t += dt;
      if (t > nextGust) {
        gustTarget = 0.5 + Math.random() * 2.4;
        nextGust = t + 1.5 + Math.random() * 3;
      }
      gust += (gustTarget - gust) * dt * 0.8;
      const w = window.innerWidth;
      const h = window.innerHeight;
      for (let i = 0; i < N; i++) {
        const L = LEAVES[i];
        const s = state[i];
        s.rot += dt * 40 * L.spin;
        s.x -= (18 + gust * 70 * L.depth) * dt;
        s.y += (16 + Math.sin(t * 1.4 + L.phase) * 22 + gust * 12 * L.depth) * dt;
        if (s.x < -70) {
          s.x = w + 60;
          s.y = Math.random() * h;
        }
        if (s.y > h + 70) {
          s.y = -60;
          s.x = Math.random() * w;
        }
        const el = refs.current[i];
        if (el) {
          const tilt = Math.sin(t * L.spin + L.phase) * 32;
          el.style.transform = `translate3d(${s.x.toFixed(1)}px, ${s.y.toFixed(1)}px, 0) rotateZ(${s.rot.toFixed(1)}deg) rotateX(${tilt.toFixed(1)}deg) scale(${(0.6 + L.depth * 0.6).toFixed(2)})`;
        }
      }
      raf = requestAnimationFrame(frame);
    };
    raf = requestAnimationFrame(frame);
    return () => cancelAnimationFrame(raf);
  }, []);

  return (
    <div aria-hidden className="pointer-events-none fixed inset-0 z-[2] overflow-hidden" style={{ perspective: "900px" }}>
      {LEAVES.map((l, i) => (
        <div
          key={i}
          ref={(el) => {
            refs.current[i] = el;
          }}
          className="absolute left-0 top-0 will-change-transform"
        >
          <GinkgoLeaf size={l.size} tone={l.tone} opacity={0.35 + l.depth * 0.5} />
        </div>
      ))}
    </div>
  );
}

/* ── Pendiente Pothala: esfera dorada 3D + péndulo ─────── */
function Pothala({ className = "", delay = "0s" }: { className?: string; delay?: string }) {
  return (
    <div aria-hidden className={`pointer-events-none ${className}`}>
      <div className="pendulum flex flex-col items-center" style={{ animationDelay: delay }}>
        <div className="h-14 w-px bg-gradient-to-b from-transparent via-yellow-100/30 to-yellow-200/60" />
        <div
          className="h-9 w-9 rounded-full"
          style={{
            background:
              "radial-gradient(circle at 32% 28%, #fffbe8 0%, #f3d67a 22%, #d4af37 48%, #6b4e12 82%, #2e2208 100%)",
            boxShadow:
              "0 0 22px rgba(212,175,55,0.45), inset -3px -4px 8px rgba(0,0,0,0.5)",
          }}
        />
      </div>
    </div>
  );
}

/* ── Visor 3D real: casco MARK VII (Three.js + GLTF) ──── */
function IronManModelViewer() {
  const mountRef = useRef<HTMLDivElement>(null);
  const rotXRef = useRef<HTMLSpanElement>(null);
  const rotYRef = useRef<HTMLSpanElement>(null);
  const statusRef = useRef<HTMLSpanElement>(null);

  const drag = useRef({ active: false, lx: 0, ly: 0 });
  const target = useRef({ x: 0.12, y: 0 });
  const inside = useRef(false);
  const lastAct = useRef(0);

  useEffect(() => {
    const mount = mountRef.current;
    if (!mount) return;
    let disposed = false;
    let raf = 0;

    const setStatus = (t: string) => {
      if (statusRef.current) statusRef.current.textContent = t;
    };

    let renderer: THREE.WebGLRenderer;
    try {
      renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
    } catch {
      setStatus("WEBGL // UNAVAILABLE");
      return;
    }
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    renderer.toneMappingExposure = 1.15;
    renderer.domElement.style.display = "block";
    mount.appendChild(renderer.domElement);

    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(38, 1, 0.1, 100);
    camera.position.set(0, 0.45, 4.3);
    camera.lookAt(0, 0, 0);

    scene.add(new THREE.AmbientLight(0x8899bb, 0.35));
    const redKey = new THREE.DirectionalLight(0xff4444, 1.1);
    redKey.position.set(-4, 3, 2);
    scene.add(redKey);
    const coldKey = new THREE.DirectionalLight(0xdfefff, 1.5);
    coldKey.position.set(4, 2, 5);
    scene.add(coldKey);
    const eyeL = new THREE.PointLight(0x00f0ff, 6, 5);
    eyeL.position.set(-0.45, 0.25, 1.4);
    const eyeR = new THREE.PointLight(0x00f0ff, 6, 5);
    eyeR.position.set(0.45, 0.25, 1.4);

    const rig = new THREE.Group();
    rig.add(eyeL, eyeR);
    scene.add(rig);

    const resize = () => {
      const w = mount.clientWidth || 300;
      const h = mount.clientHeight || 320;
      renderer.setSize(w, h, false);
      camera.aspect = w / h;
      camera.updateProjectionMatrix();
    };
    resize();

    let meshReady = false;

    const buildFallback = () => {
      if (meshReady || disposed) return;
      meshReady = true;
      const holo = new THREE.Group();
      const core = new THREE.Mesh(
        new THREE.IcosahedronGeometry(1.12, 1),
        new THREE.MeshStandardMaterial({
          color: 0x0b0e14,
          metalness: 0.85,
          roughness: 0.35,
          flatShading: true,
        })
      );
      const wire = new THREE.Mesh(
        new THREE.IcosahedronGeometry(1.15, 1),
        new THREE.MeshBasicMaterial({
          color: 0x67e8f9,
          wireframe: true,
          transparent: true,
          opacity: 0.5,
        })
      );
      const ringGeo = new THREE.TorusGeometry(1.55, 0.012, 8, 80);
      const ring1 = new THREE.Mesh(
        ringGeo,
        new THREE.MeshBasicMaterial({ color: 0x22d3ee, transparent: true, opacity: 0.35 })
      );
      ring1.rotation.x = Math.PI / 2;
      const ring2 = new THREE.Mesh(
        ringGeo,
        new THREE.MeshBasicMaterial({ color: 0x22d3ee, transparent: true, opacity: 0.3 })
      );
      ring2.rotation.x = Math.PI / 2.4;
      const eyeGeo = new THREE.CircleGeometry(0.09, 20);
      const eyeMat = new THREE.MeshBasicMaterial({ color: 0xa5f3fc });
      const eL = new THREE.Mesh(eyeGeo, eyeMat);
      eL.position.set(-0.38, 0.18, 1.02);
      const eR = new THREE.Mesh(eyeGeo, eyeMat);
      eR.position.set(0.38, 0.18, 1.02);
      holo.add(core, wire, ring1, ring2, eL, eR);
      holo.userData.rings = [ring1, ring2];
      holo.scale.setScalar(1.15);
      rig.add(holo);
      rig.userData.spin = holo;
      setStatus("HOLO // PROCEDURAL FALLBACK");
    };

    const fallbackTimer = window.setTimeout(() => {
      if (!meshReady) buildFallback();
    }, 6000);

    const candidates = [
      "/models/ironman_helmet.gltf",
      "/models/ironman_helmet.glb",
    ];

    const loader = new GLTFLoader();
    loader.setResourcePath("/models/");

    const tryLoad = (index: number): void => {
      if (disposed || meshReady) return;
      if (index >= candidates.length) {
        window.clearTimeout(fallbackTimer);
        buildFallback();
        return;
      }
      loader.load(
        candidates[index],
        (gltf) => {
          if (disposed || meshReady) return;
          meshReady = true;
          window.clearTimeout(fallbackTimer);
          const m = gltf.scene;
          const box = new THREE.Box3().setFromObject(m);
          const size = box.getSize(new THREE.Vector3());
          const center = box.getCenter(new THREE.Vector3());
          // Referencia dominante: altura (size.y) -> el casco mantiene
          // proporción real sin exagerar los ejes anchos/profundos.
          const s = 2.6 / Math.max(size.y, 0.0001);
          m.scale.setScalar(s);
          m.position.sub(center.multiplyScalar(s));
          m.position.y += 0.05;
          rig.add(m);
          setStatus("MESH // MARK VII");
        },
        undefined,
        () => tryLoad(index + 1)
      );
    };
    tryLoad(0);

    const ro = new ResizeObserver(resize);
    ro.observe(mount);
    window.addEventListener("resize", resize);

    const clock = new THREE.Clock();
    let frame = 0;
    const fmt = (v: number) =>
      `${v < 0 ? "-" : "+"}${Math.abs(v).toFixed(1).padStart(4, "0")}°`;
    const loop = () => {
      if (disposed) return;
      const dt = Math.min(0.05, clock.getDelta());
      const t = clock.elapsedTime;
      if (
        !drag.current.active &&
        !inside.current &&
        performance.now() - lastAct.current > 3000
      ) {
        target.current.y = Math.sin(t * 0.4) * 0.35;
        target.current.x += (0.1 - target.current.x) * dt * 2;
      }
      rig.rotation.y += (target.current.y - rig.rotation.y) * Math.min(1, dt * 7);
      rig.rotation.x += (target.current.x - rig.rotation.x) * Math.min(1, dt * 7);
      const spin = rig.userData.spin as THREE.Group | undefined;
      if (spin) {
        spin.rotation.y += dt * 0.25;
        const rings = spin.userData.rings as THREE.Mesh[] | undefined;
        if (rings) {
          rings[0].rotation.z += dt * 0.3;
          rings[1].rotation.z -= dt * 0.22;
        }
      }
      frame++;
      if (frame % 5 === 0) {
        const dx = THREE.MathUtils.radToDeg(rig.rotation.x);
        const dy = THREE.MathUtils.radToDeg(rig.rotation.y);
        if (rotXRef.current) rotXRef.current.textContent = fmt(dx);
        if (rotYRef.current) rotYRef.current.textContent = fmt(dy);
      }
      renderer.render(scene, camera);
      raf = requestAnimationFrame(loop);
    };
    raf = requestAnimationFrame(loop);

    return () => {
      disposed = true;
      cancelAnimationFrame(raf);
      window.clearTimeout(fallbackTimer);
      ro.disconnect();
      window.removeEventListener("resize", resize);
      rig.traverse((o) => {
        const mesh = o as THREE.Mesh;
        if (mesh.geometry) mesh.geometry.dispose();
        const mat = mesh.material as THREE.Material | THREE.Material[] | undefined;
        if (Array.isArray(mat)) mat.forEach((mm) => mm.dispose());
        else if (mat) mat.dispose();
      });
      renderer.dispose();
      if (renderer.domElement.parentElement === mount) {
        mount.removeChild(renderer.domElement);
      }
    };
  }, []);

  const LIM = { x: 0.35, y: 0.55 };

  const onPointerMove = (e: React.PointerEvent<HTMLDivElement>) => {
    inside.current = true;
    lastAct.current = performance.now();
    const r = e.currentTarget.getBoundingClientRect();
    if (drag.current.active) {
      const dx = e.clientX - drag.current.lx;
      const dy = e.clientY - drag.current.ly;
      drag.current.lx = e.clientX;
      drag.current.ly = e.clientY;
      target.current.y += dx * 0.008;
      target.current.x = THREE.MathUtils.clamp(
        target.current.x + dy * 0.006,
        -1.2,
        1.2
      );
    } else {
      target.current.y = THREE.MathUtils.clamp(
        ((e.clientX - r.left) / r.width - 0.5) * 1.4,
        -LIM.y,
        LIM.y
      );
      target.current.x =
        THREE.MathUtils.clamp(
          -((e.clientY - r.top) / r.height - 0.5) * 1.0,
          -LIM.x,
          LIM.x
        ) + 0.1;
    }
  };

  const onPointerDown = (e: React.PointerEvent<HTMLDivElement>) => {
    drag.current.active = true;
    drag.current.lx = e.clientX;
    drag.current.ly = e.clientY;
    lastAct.current = performance.now();
    try {
      e.currentTarget.setPointerCapture(e.pointerId);
    } catch {
      /* sin captura */
    }
  };

  const onPointerUp = () => {
    drag.current.active = false;
    lastAct.current = performance.now();
  };

  const onPointerLeave = () => {
    inside.current = false;
    drag.current.active = false;
  };

  return (
    <div className="relative border border-neutral-800 bg-[#070709]/80 px-4 py-8 sm:px-8">
      {/* esquinas del módulo */}
      <span aria-hidden className="absolute left-0 top-0 h-6 w-6 border-l-2 border-t-2 border-neutral-500" />
      <span aria-hidden className="absolute right-0 top-0 h-6 w-6 border-r-2 border-t-2 border-neutral-500" />
      <span aria-hidden className="absolute bottom-0 left-0 h-6 w-6 border-b-2 border-l-2 border-neutral-500" />
      <span aria-hidden className="absolute bottom-0 right-0 h-6 w-6 border-b-2 border-r-2 border-neutral-500" />

      <p className="text-center font-mono text-[11px] tracking-[0.4em] text-neutral-400">
        MARK VII // 3D VIEWPORT — <span ref={statusRef}>LINK // ironman_helmet.gltf</span>
      </p>

      <div className="relative mx-auto mt-6 max-w-3xl">
        {/* anillos radar */}
        <div aria-hidden className="pointer-events-none absolute left-1/2 top-1/2 h-72 w-72 -translate-x-1/2 -translate-y-1/2 rounded-full border border-dashed border-neutral-800 sm:h-96 sm:w-96" />
        <div aria-hidden className="pointer-events-none absolute left-1/2 top-1/2 h-52 w-52 -translate-x-1/2 -translate-y-1/2 rounded-full border border-neutral-800/70 sm:h-72 sm:w-72" />

        {/* canvas WebGL */}
        <div
          ref={mountRef}
          onPointerMove={onPointerMove}
          onPointerDown={onPointerDown}
          onPointerUp={onPointerUp}
          onPointerCancel={onPointerUp}
          onPointerLeave={onPointerLeave}
          className="relative mx-auto h-64 w-full overflow-hidden cursor-grab touch-none select-none active:cursor-grabbing sm:h-80"
        />

        {/* callouts flotantes: línea + etiqueta */}
        <div aria-hidden className="pointer-events-none absolute inset-0 hidden sm:block">
          <div className="absolute left-0 top-[12%] flex items-center gap-0">
            <span className="border border-neutral-600 bg-black/70 px-2 py-1 font-mono text-[10px] tracking-widest text-neutral-300">
              [01] TITANIUM-GOLD ALLOY FACEPLATE
            </span>
            <span className="block h-px w-14 border-t border-dashed border-neutral-500 sm:w-24" />
            <span className="block h-1.5 w-1.5 rounded-full bg-neutral-400" />
          </div>
          <div className="absolute right-0 top-[30%] flex items-center gap-0">
            <span className="block h-1.5 w-1.5 rounded-full bg-cyan-200" />
            <span className="block h-px w-14 border-t border-dashed border-neutral-500 sm:w-24" />
            <span className="border border-neutral-600 bg-black/70 px-2 py-1 font-mono text-[10px] tracking-widest text-neutral-300">
              [02] HUD OPTICAL SENSORS // 0xAJ1
            </span>
          </div>
          <div className="absolute bottom-[8%] right-[6%] flex items-center gap-0">
            <span className="block h-1.5 w-1.5 rounded-full bg-neutral-400" />
            <span className="block h-px w-12 border-t border-dashed border-neutral-500 sm:w-20" />
            <span className="border border-neutral-600 bg-black/70 px-2 py-1 font-mono text-[10px] tracking-widest text-neutral-300">
              [03] PRESSURIZED CRANIAL HOUSING
            </span>
          </div>
        </div>
      </div>

      {/* telemetría viva */}
      <div className="mx-auto mt-6 flex max-w-3xl flex-wrap items-center justify-between gap-2 font-mono text-[10px] tracking-[0.25em] text-neutral-500">
        <span>
          ROT_X <span ref={rotXRef} className="text-neutral-300">+00.0°</span>
          {" // "}
          ROT_Y <span ref={rotYRef} className="text-neutral-300">+00.0°</span>
        </span>
        <span>PWR 98.2% // ARC STABLE</span>
        <span className="text-neutral-400">THREAT SCAN … <span className="text-emerald-400">CLEAR</span></span>
        <span className="hidden sm:inline">DRAG 360° // MOVE TO TRACK</span>
      </div>
      <p className="text-[9px] font-mono text-neutral-500 tracking-wider mt-2 text-center select-none">
        3D ASSET: LOWPOLY IRONMAN HELMET BY DAEMONIIC (CC-BY-4.0) // ADAPTED FOR GLL ARCHIVE
      </p>
    </div>
  );
}

export function StarkProfile({ member }: { member: Member }) {
  const [mounted, setMounted] = useState(false);
  const [failed, setFailed] = useState<Record<string, boolean>>({});

  useEffect(() => {
    setMounted(true);
  }, []);

  const markFailed = (key: string) =>
    setFailed((prev) => (prev[key] ? prev : { ...prev, [key]: true }));

  return (
    <main
      className="relative min-h-screen overflow-x-clip text-neutral-200"
      style={{
        background: "linear-gradient(180deg, #09090b 0%, #050505 60%, #09090b 100%)",
      }}
    >
      <style>{FX_STYLES}</style>

      {/* ── Velo + viñeta ────────────────────────────────── */}
      <div
        aria-hidden
        className="pointer-events-none fixed inset-0 z-0"
        style={{
          background:
            "radial-gradient(ellipse at center, transparent 45%, rgba(0,0,0,0.7) 100%)",
        }}
      />

      {/* ── Cenizas CSS con profundidad ───────────────────── */}
      {mounted && (
        <div aria-hidden className="pointer-events-none fixed inset-0 z-[1] overflow-hidden">
          {ASHES.map((a, i) => (
            <span
              key={i}
              className={`ash-particle absolute ${a.blur ? "blur-[1px]" : ""}`}
              style={{
                left: `${a.left}%`,
                bottom: "-4vh",
                width: `${a.size}px`,
                height: `${a.size * 0.7}px`,
                background: a.light ? "#e4e4e7" : "#52525b",
                animationDuration: `${a.dur}s`,
                animationDelay: `${a.delay}s`,
                "--dx": `${a.dx}px`,
                "--po": a.po,
              } as React.CSSProperties}
            />
          ))}
        </div>
      )}

      {/* ── Ráfagas Tsushima: hojas ginkgo ────────────────── */}
      {mounted && <WindLeaves />}

      {/* ── Top bar ──────────────────────────────────────── */}
      <div className="relative z-10 mx-auto flex max-w-6xl items-center justify-between px-5 pt-5 sm:px-8">
        <a
          href="/"
          className="border border-neutral-800 bg-black/50 px-3 py-1.5 text-[11px] font-bold tracking-[0.25em] text-neutral-300 backdrop-blur-md transition-colors hover:border-neutral-500 hover:text-white"
        >
          <span aria-hidden>&larr;</span>[ GLL // ROSTER ]
        </a>
        <div className="flex items-center gap-3" aria-hidden>
          <span className="hidden text-[10px] tracking-[0.4em] text-neutral-600 sm:inline">
            GHOST OF TSUSHIMA
          </span>
          <span
            className="flex h-11 w-11 items-center justify-center border border-neutral-700 bg-[#0c0c0e] text-lg font-bold text-neutral-200"
            style={{ writingMode: "vertical-rl" }}
          >
            対馬
          </span>
        </div>
      </div>

      {/* ── Banner triple: composición AJ One ────────────── */}
      <div className="relative z-10 mx-auto mt-8 max-w-6xl px-5 sm:px-8">
        <div
          className="flex"
          style={{ filter: "drop-shadow(0 6px 18px rgba(0,0,0,0.7)) drop-shadow(0 0 14px rgba(220,38,38,0.10))" }}
        >
          {PILLARS.map((p, i) =>
            failed[p.src] ? (
              <div
                key={p.src}
                className={`relative h-44 w-full bg-[#0c0c0e] sm:h-72 ${i > 0 ? "-ml-5 sm:-ml-10" : ""}`}
                style={{ clipPath: CLIPS[i] }}
              >
                <div className="flex h-full flex-col items-center justify-center gap-2 border-y border-neutral-800">
                  <span className="font-mono text-[11px] tracking-[0.35em] text-neutral-600">
                    {p.label}
                  </span>
                  <span className="font-mono text-[9px] tracking-[0.25em] text-neutral-700">
                    {p.specimen}
                  </span>
                </div>
              </div>
            ) : (
              <div
                key={p.src}
                className={`group relative h-44 w-full overflow-hidden sm:h-72 ${i > 0 ? "-ml-5 sm:-ml-10" : ""}`}
                style={{ clipPath: CLIPS[i] }}
              >
                <img
                  src={p.src}
                  alt={p.label}
                  onError={() => markFailed(p.src)}
                  className="absolute inset-0 h-full w-full object-cover select-none transition-transform duration-700 group-hover:scale-105"
                  style={{ filter: p.grade }}
                  loading="eager"
                />
                <div aria-hidden className={`absolute inset-0 ${p.tint}`} />
                <div
                  aria-hidden
                  className="absolute inset-0"
                  style={{
                    background:
                      "linear-gradient(180deg, rgba(5,5,5,0.35) 0%, transparent 45%, rgba(5,5,5,0.65) 100%)",
                  }}
                />
                {/* filo carmesí sobre el corte */}
                <span
                  aria-hidden
                  className={`absolute inset-y-0 w-[2px] bg-gradient-to-b from-transparent via-red-500/50 to-transparent ${i === 0 ? "right-0" : "left-0"}`}
                />
                {/* sello de catálogo */}
                <span className="absolute left-3 top-2 border border-neutral-500/60 bg-black/65 px-1.5 py-0.5 font-mono text-[8px] tracking-[0.2em] text-neutral-300 sm:text-[9px]">
                  {p.specimen}
                </span>
                <span className="absolute bottom-2 left-4 border border-neutral-700/70 bg-black/60 px-2 py-0.5 font-mono text-[10px] tracking-[0.3em] text-neutral-300">
                  {p.label}
                </span>
              </div>
            )
          )}
        </div>
        <p className="mt-2 text-center font-mono text-[10px] tracking-[0.35em] text-neutral-600">
          AJ1-SYS // POWER-SCALING LOG
        </p>
      </div>

      {/* ── Sección central: avatar y poética ────────────── */}
      <div className="relative z-10 mx-auto max-w-3xl px-5 pb-8 pt-14 text-center sm:px-8">
        <p className="font-mono text-[11px] tracking-[0.4em] text-neutral-500">
          GLL // RONIN // 浪人
        </p>

        {/* Retrato en marco poligonal de acero */}
        <div className="relative mx-auto mt-8 w-fit drop-shadow-[0_0_18px_rgba(220,38,38,0.12)]">
          <Pothala className="absolute -left-12 top-6 hidden sm:block" />
          <Pothala className="absolute -right-12 top-6 hidden sm:block" delay="-1.6s" />
          <div
            aria-hidden
            className="absolute -inset-2 border border-neutral-600"
            style={{
              clipPath:
                "polygon(14px 0, 100% 0, 100% calc(100% - 14px), calc(100% - 14px) 100%, 0 100%, 0 14px)",
              background: "linear-gradient(135deg, #52525b, #18181b 40%, #3f3f46 60%, #101014)",
            }}
          />
          <span aria-hidden className="absolute -right-[3px] -top-[3px] z-10 h-8 w-[2px] rotate-45 bg-red-500/70" />
          {failed["avatar"] ? (
            <div className="relative flex h-44 w-44 items-center justify-center bg-[#0c0c0e] sm:h-56 sm:w-56">
              <span className="font-mono text-[11px] tracking-[0.35em] text-neutral-600">
                STAR/K
              </span>
            </div>
          ) : (
            <img
              src="/images/members/stark/avatar.jpg"
              alt={member.displayName}
              onError={() => markFailed("avatar")}
              className="relative h-44 w-44 select-none grayscale sm:h-56 sm:w-56"
              style={{
                clipPath:
                  "polygon(10px 0, 100% 0, 100% calc(100% - 10px), calc(100% - 10px) 100%, 0 100%, 0 10px)",
                filter: "grayscale(1) contrast(1.08) brightness(0.92)",
              }}
              loading="eager"
            />
          )}
        </div>

        <h1
          className="mt-8 font-serif text-4xl font-bold tracking-[0.3em] text-neutral-100 sm:text-5xl"
          style={{ fontVariantLigatures: "none" }}
        >
          {member.displayName}
        </h1>
        <p className="mt-3 font-mono text-xs tracking-[0.25em] text-[#71717a]">
          The Iron Will // Ghost of the Blade
        </p>
      </div>

      {/* ── Módulo HUD MARK VII (Three.js) ─────────────── */}
      <div className="relative z-10 mx-auto max-w-5xl px-5 pb-4 sm:px-8">
        {mounted ? (
          <IronManModelViewer />
        ) : (
          <div className="border border-neutral-800 bg-[#070709]/80 px-4 py-16 text-center font-mono text-[11px] tracking-[0.4em] text-neutral-600">
            MARK VII // SCHEMATIC VIEWER
          </div>
        )}
      </div>

      {/* ── Motto bushido ────────────────────────────────── */}
      <div className="relative z-10 mx-auto max-w-3xl px-5 pb-20 pt-10 text-center sm:px-8">
        <div aria-hidden className="mx-auto flex max-w-xs items-center gap-3">
          <span className="h-px flex-1 bg-neutral-800" />
          <span className="block h-1.5 w-1.5 rotate-45 bg-neutral-600" />
          <span className="h-px flex-1 bg-neutral-800" />
        </div>

        <p className="mx-auto mt-8 max-w-xl font-serif text-lg italic leading-relaxed text-neutral-400 sm:text-xl">
          <span className="float-left mr-2 font-serif text-5xl not-italic leading-[0.9] text-red-500">
            N
          </span>
          o hay gloria en la caída, sino en la fuerza para levantarse y cortar
          el propio destino.
        </p>

        <div className="mt-8 flex items-center justify-center gap-3">
          <span className="seal-glow inline-flex h-10 w-10 items-center justify-center rounded-[3px] bg-[#8f1d1d] font-serif text-xl text-[#f5efe4]">
            斬
          </span>
          <span className="font-mono text-[10px] tracking-[0.35em] text-neutral-500">
            BUSHIDO // CUT YOUR OWN FATE
          </span>
        </div>

        <footer className="mt-14 font-mono text-[10px] tracking-[0.3em] text-neutral-600">
          STAR/K — HONOR // IN EXILE
        </footer>
      </div>
    </main>
  );
}
