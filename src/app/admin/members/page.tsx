import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/auth/config";
import { memberRepository } from "@/lib/db/repository";
import Link from "next/link";
import { Plus } from "lucide-react";
import { MembersList } from "./MembersList";
import type { Member } from "@/types/member";

export const revalidate = 0;

export default async function MembersPage() {
  const session = await getServerSession(authOptions);
  if (!session?.user) {
    return <div>Access Denied</div>;
  }

  const stats = await memberRepository.getStats();
  const members = await memberRepository.getAll();

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-zinc-100">MEMBERS</h1>
        <p className="text-sm text-zinc-400">Manage roster members</p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
        <div className="rounded-xl border border-red-600/30 bg-black/50 p-4 text-center">
          <p className="text-xs text-zinc-400">TOTAL</p>
          <p className="text-2xl font-bold text-red-400">{stats.total}</p>
        </div>
        <div className="rounded-xl border border-emerald-600/30 bg-black/50 p-4 text-center">
          <p className="text-xs text-zinc-400">VISIBLE</p>
          <p className="text-2xl font-bold text-emerald-400">{stats.visible}</p>
        </div>
        <div className="rounded-xl border border-zinc-600/30 bg-black/50 p-4 text-center">
          <p className="text-xs text-zinc-400">HIDDEN</p>
          <p className="text-2xl font-bold text-zinc-400">{stats.hidden}</p>
        </div>
      </div>

      {/* Action Buttons */}
      <div className="flex gap-2">
        <Link href="/admin/members/new">
          <button className="flex items-center gap-2 rounded-md bg-pink-600/20 px-4 py-2 text-sm font-medium text-pink-300 hover:bg-pink-600/30">
            <Plus className="h-4 w-4" />
            Add New Member
          </button>
        </Link>
      </div>

      {/* Members List - client component */}
      <MembersList members={members} />
    </div>
  );
}