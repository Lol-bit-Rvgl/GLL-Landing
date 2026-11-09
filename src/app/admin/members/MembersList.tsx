"use client";

import { MemberCard } from "./MemberCard";
import type { Member } from "@/types/member";
import { useRouter } from "next/navigation";

interface MembersListProps {
  members: Member[];
}

export function MembersList({ members }: MembersListProps) {
  const router = useRouter();

  const handleMemberDeleted = (slug: string) => {
    router.refresh();
  };

  return (
    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
      {members.map((member) => (
        <MemberCard 
          member={member} 
          onMemberDeleted={handleMemberDeleted} 
          key={member.slug} 
        />
      ))}
    </div>
  );
}