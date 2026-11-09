import Image from "next/image";
import type { Member } from "@/types/member";

interface MemberAvatarProps {
  member: Member;
}

/**
 * Avatar circular compartido por las cards del roster y cualquier vista que
 * necesite el retrato de un miembro. La fuente viene de `member.avatar`.
 */
export function MemberAvatar({ member }: MemberAvatarProps) {
  return (
    <div className="relative h-12 w-12 shrink-0 overflow-hidden rounded-full border border-white/20 shadow-md">
      <Image
        src={member.avatar.src}
        alt={member.avatar.alt ?? member.slug}
        fill
        className="object-cover"
      />
    </div>
  );
}
