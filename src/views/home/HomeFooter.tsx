"use client";

import { useMounted } from "@/hooks/useMounted";

/* ══════════════════════════════════════════════════════════════
   FOOTER
   ══════════════════════════════════════════════════════════════ */
export function HomeFooter() {
  const mounted = useMounted();

  return (
    <footer className="relative z-10 mt-20 border-t border-white/10 bg-black/60 py-8 text-center font-mono text-[10px] tracking-[0.25em] text-zinc-500">
      <p>© {mounted ? new Date().getFullYear() : "2026"} GLL — Gods Live Longer™ // SECTOR ZERO</p>
      <p className="mt-1 text-[9px] text-zinc-600">
        ALL OPERATIVES DEPLOYED // PERMISSION LEVEL: PUBLIC BROADCAST
      </p>
    </footer>
  );
}
