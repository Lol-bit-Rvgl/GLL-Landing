"use client";

import { useState } from "react";
import Link from "next/link";
import { Eye, Edit, Trash2 } from "lucide-react";
import type { Member } from "@/types/member";

interface MemberCardProps {
  member: Member;
  onMemberDeleted: (slug: string) => void;
}

export function MemberCard({ member, onMemberDeleted }: MemberCardProps) {
  const [isDeleting, setIsDeleting] = useState(false);
  const [deleteError, setDeleteError] = useState<string | null>(null);

  const handleDelete = async () => {
    if (!confirm(`Delete ${member.displayName}?`)) return;
    
    setIsDeleting(true);
    setDeleteError(null);
    
    try {
      const res = await fetch(`/api/admin/members/${member.slug}`, {
        method: "DELETE",
      });
      
      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.error || "Failed to delete");
      }
      
      onMemberDeleted(member.slug);
    } catch (e) {
      setDeleteError(e instanceof Error ? e.message : "Failed to delete member");
    } finally {
      setIsDeleting(false);
    }
  };

  return (
    <div className="rounded-xl border border-red-600/20 bg-black/30 p-4 hover:border-red-500/40">
      <div className="flex items-start justify-between">
        <div className="flex items-center gap-3">
          <div className="relative h-12 w-12 overflow-hidden rounded-full border-2 border-red-400/50">
            <img
              src={member.avatar.src}
              alt={member.displayName}
              className="h-full w-full object-cover"
            />
          </div>
          <div>
            <p className="font-bold text-zinc-200">{member.displayName}</p>
            <p className="text-xs text-zinc-500">{member.role}</p>
          </div>
        </div>
        <div className="flex gap-1">
          <Link href={`/gll/${member.slug}`} target="_blank">
            <button className="p-1 text-zinc-400 hover:text-zinc-200">
              <Eye className="h-4 w-4" />
            </button>
          </Link>
          <Link href={`/admin/members/${member.slug}/edit`}>
            <button className="p-1 text-zinc-400 hover:text-zinc-200">
              <Edit className="h-4 w-4" />
            </button>
          </Link>
          <button
            onClick={handleDelete}
            disabled={isDeleting}
            className="p-1 text-red-400 hover:text-red-300 disabled:opacity-50"
          >
            <Trash2 className="h-4 w-4" />
          </button>
        </div>
      </div>

      <div className="mt-3 space-y-2 text-xs">
        <div className="flex gap-4">
          <span className="text-zinc-500">Faction:</span>
          <span>{member.faction}</span>
        </div>
        <div className="flex gap-4">
          <span className="text-zinc-500">Status:</span>
          <span>{member.status || "ACTIVE"}</span>
        </div>
        <div className="flex gap-4">
          <span className="text-zinc-500">Visible:</span>
          <span>{member.visible === false ? "No" : "Sí"}</span>
        </div>
      </div>

      {deleteError && (
        <div className="mt-2 text-sm text-red-400">{deleteError}</div>
      )}
    </div>
  );
}