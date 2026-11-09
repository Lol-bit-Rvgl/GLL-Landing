import type { Member, MemberCardTheme } from "@/types/member";

/**
 * Props compartidos por todas las cards del roster.
 * Mantiene compatibilidad con la estructura actual.
 */
export interface MemberCardProps {
  m: Member;
  t: MemberCardTheme;
  copied: string | null;
  onCopy: (e: React.MouseEvent, slug: string) => void;
}