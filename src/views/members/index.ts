import type { ComponentType } from "react";
import type { Member } from "@/data/members";

import { DefaultProfile } from "./DefaultProfile";
import { HaterProfile } from "./HaterProfile";
import { LolbitProfile } from "./LolbitProfile";
import { ValkiriaProfile } from "./ValkiriaProfile";
import { DarkyProfile } from "./DarkyProfile";
import { NothingProfile } from "./NothingProfile";
import { Darth10Profile } from "./Darth10Profile";
import { DramaticProfile } from "./DramaticProfile";
import { MangleProfile } from "./MangleProfile";
import { SleepyProfile } from "./SleepyProfile";
import { StarkProfile } from "./StarkProfile";

export type MemberViewProps = { member: Member };

const MEMBER_COMPONENTS: Record<string, ComponentType<MemberViewProps>> = {
  lolbit: LolbitProfile,
  hater: HaterProfile,
  valkiria: ValkiriaProfile,
  darky: DarkyProfile,
  nothing: NothingProfile,
  darth10: Darth10Profile,
  darth: Darth10Profile,
  dramatic: DramaticProfile,
  mangle: MangleProfile,
  "mangle-drake": MangleProfile,
  sleepy: SleepyProfile,
  stark: StarkProfile,
};

export function getMemberView(slug: string): ComponentType<MemberViewProps> {
  return MEMBER_COMPONENTS[slug] ?? DefaultProfile;
}

export { MangleProfile };
