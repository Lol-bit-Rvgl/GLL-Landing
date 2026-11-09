import type { Metadata } from "next";
import { getServerSession } from "next-auth/next";
import { redirect } from "next/navigation";
import { authOptions } from "@/lib/auth/config";

export const metadata: Metadata = {
  title: "GLL Control Terminal",
  description: "Super Admin — God's Live Longer.™ Control System",
};

export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await getServerSession(authOptions);

  if (!session?.user) {
    redirect("/admin/signin");
  }

  return (
    <div className="flex min-h-screen flex-1 flex-col bg-gradient-to-b from-[#050507] via-[#050507] to-[#0a0515] text-zinc-200 font-mono">
      {/* Transmission background */}
      <div
        aria-hidden
        className="absolute inset-0 pointer-events-none"
        style={{
          background: `
            radial-gradient(circle at 20% 30%, rgba(220, 38, 38, 0.08) 0%, transparent 30%),
            radial-gradient(circle at 80% 70%, rgba(56, 189, 248, 0.06) 0%, transparent 40%),
            radial-gradient(circle at 50% 50%, rgba(245, 158, 11, 0.03) 0%, transparent 50%)
          `,
        }}
      />

      {/* Subtle scanlines */}
      <div className="absolute inset-0 pointer-events-none opacity-10" />

      {/* Terminal header */}
      <header className="relative z-10 border-b border-red-600/30 bg-black/50 px-4 py-3 backdrop-blur-sm">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <span className="text-xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-pink-400 via-amber-400 to-cyan-400">
              GLL CONTROL TERMINAL
            </span>
            <span className="hidden sm:inline-block text-xs text-red-400/70">
              │ SUPER ADMIN ACCESS
            </span>
          </div>
          <div className="flex items-center gap-4 text-xs">
            <span className="text-zinc-400">
              {new Date().toISOString().split("T")[0]}
            </span>
            <span className="text-emerald-400">STATUS: ONLINE</span>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="relative z-10 flex-1 p-4 sm:p-6 lg:p-8">{children}</main>

      {/* Footer */}
      <footer className="relative z-10 border-t border-red-600/30 bg-black/50 py-4 text-xs text-zinc-500">
        <div className="text-center">
          <p>GLL CONTROL SYSTEM v1.0 // LAST SYNC: REAL-TIME</p>
          <p className="mt-1">
            USER: {session.user?.name} (SUPER_ADMIN) |{" "}
            <form action="/api/auth/signout" method="POST">
              <button
                type="submit"
                className="text-red-400/70 underline underline-offset-2 hover:text-red-300"
              >
                LOGOUT
              </button>
            </form>
          </p>
        </div>
      </footer>
    </div>
  );
}