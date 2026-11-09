import { getServerSession } from "next-auth/next";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import { memberRepository } from "@/lib/db/repository";
import Link from "next/link";
import { Users, Shield, Activity, Globe, Edit3 } from "lucide-react";

export const revalidate = 0;

// Faction display names
const FactionLabels: Record<string, string> = {
  ARCHIVE: "ARCHIVE",
  COMBAT: "COMBAT",
  VOID: "VOID",
};

// Faction colors
const FactionColors: Record<string, string> = {
  ARCHIVE: "text-cyan-300",
  COMBAT: "text-pink-300",
  VOID: "text-red-300",
};

export default async function AdminDashboard() {
  const session = await getServerSession(authOptions);
  if (session === null) {
    return <div>Access Denied</div>;
  }

  const stats = await memberRepository.getStats();

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-zinc-100">DASHBOARD</h1>
        <p className="text-sm text-zinc-400">GLL Control System Status</p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <div className="rounded-xl border border-red-600/30 bg-black/50 p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-xs text-zinc-400">TOTAL MEMBERS</p>
              <p className="text-2xl font-bold text-red-400">{stats.total}</p>
            </div>
            <Users className="h-8 w-8 text-red-400/50" />
          </div>
        </div>

        <div className="rounded-xl border border-emerald-600/30 bg-black/50 p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-xs text-zinc-400">ACTIVE</p>
              <p className="text-2xl font-bold text-emerald-400">{stats.visible}</p>
            </div>
            <Activity className="h-8 w-8 text-emerald-400/50" />
          </div>
        </div>

        <div className="rounded-xl border border-zinc-600/30 bg-black/50 p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-xs text-zinc-400">HIDDEN</p>
              <p className="text-2xl font-bold text-zinc-400">{stats.hidden}</p>
            </div>
            <Shield className="h-8 w-8 text-zinc-400/50" />
          </div>
        </div>

        <div className="rounded-xl border border-cyan-600/30 bg-black/50 p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-xs text-zinc-400">SYSTEM</p>
              <p className="text-2xl font-bold text-cyan-400">STABLE</p>
            </div>
            <Globe className="h-8 w-8 text-cyan-400/50" />
          </div>
        </div>
      </div>

      {/* Quick Actions */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
        <Link href="/admin/members" className="group rounded-xl border border-pink-600/30 bg-black/50 p-4 transition hover:border-pink-500/60">
          <div className="flex items-center gap-3">
            <Users className="h-6 w-6 text-pink-400" />
            <h3 className="font-bold text-pink-300">Members</h3>
          </div>
          <p className="mt-2 text-sm text-zinc-400/80">Editar, crear, reorganizar miembros del roster</p>
        </Link>

        <Link href="/admin/members/new" className="group rounded-xl border border-emerald-600/30 bg-black/50 p-4 transition hover:border-emerald-500/60">
          <div className="flex items-center gap-3">
            <Edit3 className="h-6 w-6 text-emerald-400" />
            <h3 className="font-bold text-emerald-300">Create Member</h3>
          </div>
          <p className="mt-2 text-sm text-zinc-400/80">Agregar nuevo miembro al roster</p>
        </Link>

        <Link href="/admin/settings" className="group rounded-xl border border-amber-600/40 bg-black/50 p-4 transition hover:border-amber-500/60">
          <div className="flex items-center gap-3">
            <svg className="h-6 w-6 text-amber-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3" />
            </svg>
            <h3 className="font-bold text-amber-300">Settings</h3>
          </div>
          <p className="mt-2 text-sm text-zinc-400/80">Configuración global del sitio</p>
        </Link>
      </div>

      {/* Faction Distribution */}
      <div className="rounded-xl border border-white/10 bg-black/50 p-4">
        <h3 className="mb-3 text-sm font-bold text-zinc-200">FACTION DISTRIBUTION</h3>
        <div className="flex flex-col gap-2">
          {(["ARCHIVE", "COMBAT", "VOID"] as const).map((faction) => (
            <div key={faction} className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <div className={`h-2 w-2 rounded-full ${FactionColors[faction]}`} />
                <span className="text-sm text-zinc-300">{FactionLabels[faction]}</span>
              </div>
              <span className={`text-sm ${FactionColors[faction]}`}>
                {stats.factions[faction] || 0}
              </span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}