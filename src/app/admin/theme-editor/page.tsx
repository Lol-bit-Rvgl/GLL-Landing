"use client";

import { useSearchParams, useRouter } from "next/navigation";
import { useSession } from "next-auth/react";
import { useEffect, useState } from "react";
import { ThemeEditor } from "@/components/admin/ThemeEditor";
import type { Member } from "@/types/member";
import { Shield } from "lucide-react";

export default function ThemeEditorPage() {
  const { data: session } = useSession();
  const router = useRouter();
  const searchParams = useSearchParams();
  const [members, setMembers] = useState<Member[]>([]);
  const [selectedSlug, setSelectedSlug] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!session) {
      router.push("/admin/signin");
      return;
    }

    fetch("/api/data/members")
      .then((res) => res.json())
      .then((data) => {
        setMembers(data);
        const slug = searchParams.get("member") || data[0]?.slug || null;
        setSelectedSlug(slug);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, [session, searchParams, router]);

  if (!session) {
    return (
      <div className="flex items-center justify-center h-64">
        <Shield className="h-6 w-6 text-red-400 mr-2" />
        <span>Checking authentication...</span>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="space-y-6">
        <div>
          <h1 className="text-2xl font-bold text-zinc-100">THEME EDITOR</h1>
          <p className="text-sm text-zinc-400">Loading members...</p>
        </div>
      </div>
    );
  }

  const selectedMember = members.find(m => m.slug === selectedSlug) || members[0];

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-zinc-100">THEME EDITOR</h1>
        <p className="text-sm text-zinc-400">Customize member themes and visual identity</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Member Selector */}
        <div className="space-y-4">
          <h3 className="text-sm font-bold text-zinc-400">SELECT MEMBER</h3>
          <div className="space-y-2">
            {members.map((member) => (
              <button
                key={member.slug}
                onClick={() => {
                  const newParams = new URLSearchParams(searchParams.toString());
                  newParams.set("member", member.slug);
                  router.push(`/admin/theme-editor?${newParams.toString()}`);
                }}
                className={`w-full rounded-lg border p-3 text-left transition hover:border-red-500/50 ${
                  selectedSlug === member.slug ? "border-red-500/50 bg-black/50" : "border-red-600/30 bg-black/50"
                }`}
              >
                <div className="flex items-center gap-3">
                  <div className="relative h-10 w-10 overflow-hidden rounded-full border-2 border-red-400/50">
                    <img
                      src={member.avatar.src}
                      alt={member.displayName}
                      className="h-full w-full object-cover"
                    />
                  </div>
                  <div className="flex-1">
                    <p className="font-mono text-sm text-zinc-200">{member.displayName}</p>
                    <p className="text-xs text-zinc-400">{member.role}</p>
                  </div>
                </div>
              </button>
            ))}
          </div>
        </div>

        {/* Theme Editor */}
        <div className="lg:col-span-2">
          <ThemeEditor 
            initialTheme={selectedMember?.theme} 
            memberSlug={selectedSlug || undefined}
          />
        </div>
      </div>
    </div>
  );
}