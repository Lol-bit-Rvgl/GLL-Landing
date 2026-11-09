"use client";

import { signIn } from "next-auth/react";
import { useState, useEffect, useRef } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { Lock, User, AlertCircle, Shield } from "lucide-react";

export default function SignInPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const callbackUrl = searchParams.get("callbackUrl") || "/admin";
  const errorParam = searchParams.get("error");

  const [email, setEmail] = useState("admin@gll.terminal");
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [displayError, setDisplayError] = useState<string | null>(null);
  const hasShownError = useRef(false);

  useEffect(() => {
    // Use timeout to avoid sync state updates during render
    if (errorParam === "AccessDenied" && !hasShownError.current) {
      hasShownError.current = true;
      setTimeout(() => {
        setDisplayError("Acceso denegado. Verifica tus credenciales.");
      }, 0);
    }
  }, [errorParam]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setDisplayError(null);

    const result = await signIn("credentials", {
      redirect: false,
      email,
      password,
    });

    if (result?.error) {
      setDisplayError("Credenciales inválidas");
    } else if (result?.ok) {
      router.push(callbackUrl);
    }
    setIsLoading(false);
  };

  return (
    <div className="flex min-h-screen flex-1 flex-col items-center justify-center bg-[#050507] text-zinc-200 font-mono">
      <div className="absolute inset-0 overflow-hidden">
        <div
          className="absolute inset-0"
          style={{
            background: `
              radial-gradient(circle at 20% 30%, rgba(220, 38, 38, 0.08) 0%, transparent 30%),
              radial-gradient(circle at 80% 70%, rgba(56, 189, 248, 0.06) 0%, transparent 40%)
            `,
          }}
        />
      </div>

      <div className="relative z-10 flex flex-col items-center gap-6 w-full max-w-md px-4">
        <div className="flex flex-col items-center gap-3">
          <div className="flex h-16 w-16 items-center justify-center rounded-full bg-gradient-to-tr from-pink-400 via-amber-400 to-cyan-400 shadow-[0_0_20px_rgba(236,72,153,0.4)]">
            <span className="text-2xl font-bold text-black">GLL</span>
          </div>
          <h1 className="text-2xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-pink-400 via-amber-400 to-cyan-400">
            CONTROL TERMINAL
          </h1>
        </div>

        <form
          onSubmit={handleSubmit}
          className="flex w-full flex-col gap-4 rounded-xl border border-red-600/40 bg-black/60 p-6 shadow-[0_0_30px_rgba(220,38,38,0.2)]"
        >
          {displayError && (
            <div className="flex items-center gap-3 rounded-md border border-red-500/60 bg-red-900/20 p-3 text-red-200">
              <AlertCircle className="h-5 w-5 flex-shrink-0" />
              <span className="text-sm">{displayError}</span>
            </div>
          )}

          <div className="flex flex-col gap-2">
            <label
              htmlFor="email"
              className="text-sm font-medium text-zinc-300"
            >
              EMAIL ADDRESS
            </label>
            <div className="relative">
              <User
                className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-zinc-500"
                aria-hidden
              />
              <input
                id="email"
                type="email"
                placeholder="admin@gll.terminal"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                className="w-full rounded-md border border-white/10 bg-black/50 py-2 pl-10 pr-4 text-sm focus:border-red-500/60 outline-none focus:ring-2 focus:ring-red-500/20"
                autoComplete="email"
              />
            </div>
          </div>

          <div className="flex flex-col gap-2">
            <label
              htmlFor="password"
              className="text-sm font-medium text-zinc-300"
            >
              ACCESS CODE
            </label>
            <div className="relative">
              <Lock
                className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-zinc-500"
                aria-hidden
              />
              <input
                id="password"
                type="password"
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                className="w-full rounded-md border border-white/10 bg-black/50 py-2 pl-10 pr-4 text-sm focus:border-red-500/60 outline-none focus:ring-2 focus:ring-red-500/20"
                autoComplete="current-password"
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={isLoading}
            className="w-full rounded-md border-2 border-red-600 bg-red-600 py-2.5 font-bold text-white transition-all duration-300 hover:scale-105 hover:border-red-500 hover:bg-red-500 disabled:cursor-not-allowed disabled:opacity-50"
          >
            {isLoading ? "ACCESSING..." : "ACCESS CONTROL TERMINAL"}
          </button>

          <div className="flex items-center justify-center gap-2 text-xs text-zinc-500">
            <Shield className="h-3 w-3 text-red-400" />
            <span>SECURE ACCESS // AUTH REQUIRED</span>
          </div>
        </form>
      </div>
    </div>
  );
}