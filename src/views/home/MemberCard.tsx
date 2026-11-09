import type { Member, MemberCardTheme } from "@/types/member";
import { LolbitCard } from "./cards/LolbitCard";
import { NothingCard } from "./cards/NothingCard";
import { ValkiriaCard } from "./cards/ValkiriaCard";
import { HaterCard } from "./cards/HaterCard";
import { StarkCard } from "./cards/StarkCard";
import { MangleCard } from "./cards/MangleCard";
import { DarkyCard } from "./cards/DarkyCard";
import { DramaticCard } from "./cards/DramaticCard";
import { DarthCard } from "./cards/DarthCard";
import { SleepyCard } from "./cards/SleepyCard";

/**
 * MemberCard - Selector de card del roster.
 *
 * Cada miembro mantiene su propia identidad visual.
 * Este selector delega al card específico según el slug.
 */
export function MemberCard(props: { m: Member; t: MemberCardTheme; copied: string | null; onCopy: (e: React.MouseEvent, slug: string) => void }) {
  switch (props.m.slug) {
    case "lolbit":
      return <LolbitCard {...props} />;
    case "nothing":
      return <NothingCard {...props} />;
    case "valkiria":
      return <ValkiriaCard {...props} />;
    case "hater":
      return <HaterCard {...props} />;
    case "stark":
      return <StarkCard {...props} />;
    case "mangle":
      return <MangleCard {...props} />;
    case "darky":
      return <DarkyCard {...props} />;
    case "dramatic":
      return <DramaticCard {...props} />;
    case "darth10":
      return <DarthCard {...props} />;
    case "sleepy":
      return <SleepyCard {...props} />;
    default:
      return <LolbitCard {...props} />;
  }
}