/**
 * JSON Repository para desarrollo/local
 */

import type { Member, MemberFaction } from "@/types/member";
import { members as staticMembers } from "@/data/members";
import { writeFile, readFile } from "fs/promises";
import { join } from "path";

const MEMBERS_JSON_PATH = join(process.cwd(), "data", "members.json");

const MEMBER_ALIASES: Record<string, string> = {
  "mangle-drake": "mangle",
  darth: "darth10",
};

function resolveMemberSlug(slug: string): string {
  return MEMBER_ALIASES[slug] ?? slug;
}

function getDefaultTheme() {
  return {
    primary: "#ec4899",
    secondary: "#f59e0b",
    background: "#050507",
    foreground: "#e7e4de",
    muted: "#a1a1aa",
    border: "rgba(255, 255, 255, 0.08)",
    glow: "#ec4899",
    font: "mono" as const,
    radius: "0.5rem",
    texture: "none" as const,
    effects: {
      scanlines: false,
      noise: false,
      glitch: false,
      glow: "none" as const,
    },
    card: {
      accent: "#ec4899",
      tag: "ARCHIVE",
      tagClass: "border-cyan-500/40 bg-cyan-500/10 text-cyan-300",
      statusColor: "#10b981",
    },
  };
}

export class JSONRepository {
  private async loadMembers(): Promise<Member[]> {
    try {
      const data = await readFile(MEMBERS_JSON_PATH, "utf-8");
      const parsed = JSON.parse(data);
      return parsed.map((m: Member) => ({
        ...m,
        theme: m.theme || getDefaultTheme(),
      }));
    } catch {
      return staticMembers.map((m) => ({
        ...m,
        theme: m.theme || getDefaultTheme(),
      }));
    }
  }

  private async saveMembers(members: Member[]): Promise<void> {
    const data = JSON.stringify(members, null, 2);
    await writeFile(MEMBERS_JSON_PATH, data, "utf-8");
  }

  private async initializeIfNeeded(): Promise<void> {
    try {
      await readFile(MEMBERS_JSON_PATH, "utf-8");
    } catch {
      await this.saveMembers(staticMembers);
    }
  }

  async getAll(): Promise<Member[]> {
    const members = await this.loadMembers();
    return members.filter((m) => m.visible !== false);
  }

  async getBySlug(slug: string): Promise<Member | null> {
    const resolvedSlug = resolveMemberSlug(slug);
    const members = await this.loadMembers();
    return members.find((m) => m.slug === resolvedSlug) || null;
  }

  async create(data: Omit<Member, "slug"> & { slug: string }): Promise<Member> {
    await this.initializeIfNeeded();
    const members = await this.loadMembers();
    const maxOrder = Math.max(...members.map((m) => m.order), 0);

    const newMember: Member = {
      ...data,
      order: maxOrder + 1,
      visible: true,
      links: [],
      seo: {
        title: `${data.displayName} // GLL`,
        description: "Member of GLL",
      },
      theme: data.theme || getDefaultTheme(),
      experience: data.experience || {
        component: "default",
        kind: "interactive",
        capabilities: [],
      },
    };

    if (members.some((m) => m.slug === newMember.slug)) {
      throw new Error("DUPLICATE_SLUG");
    }

    const updated = [...members, newMember];
    await this.saveMembers(updated);
    return newMember;
  }

  async update(slug: string, data: Partial<Member>): Promise<Member | null> {
    await this.initializeIfNeeded();
    const members = await this.loadMembers();
    const index = members.findIndex((m) => m.slug === slug);

    if (index === -1) {
      return null;
    }

    const protectedFields = ["experience", "slug"];
    const safeData = { ...data };
    for (const field of protectedFields) {
      delete (safeData as Record<string, unknown>)[field];
    }

    members[index] = { ...members[index], ...safeData };
    await this.saveMembers(members);
    return members[index];
  }

  async delete(slug: string): Promise<boolean> {
    await this.initializeIfNeeded();
    const members = await this.loadMembers();
    const index = members.findIndex((m) => m.slug === slug);

    if (index === -1) {
      return false;
    }

    members[index].visible = false;
    await this.saveMembers(members);
    return true;
  }

  async restore(slug: string): Promise<boolean> {
    const member = await this.getBySlug(slug);
    if (!member) return false;
    return this.update(slug, { visible: true })
      .then(() => true)
      .catch(() => false);
  }

  async getStats(): Promise<{
    total: number;
    visible: number;
    hidden: number;
    factions: Record<MemberFaction, number>;
  }> {
    const members = await this.loadMembers();

    return {
      total: members.length,
      visible: members.filter((m) => m.visible !== false).length,
      hidden: members.filter((m) => m.visible === false).length,
      factions: {
        ARCHIVE: members.filter((m) => m.faction === "ARCHIVE").length,
        COMBAT: members.filter((m) => m.faction === "COMBAT").length,
        VOID: members.filter((m) => m.faction === "VOID").length,
        SOLAR: members.filter((m) => m.faction === "SOLAR").length,
        LUNAR: members.filter((m) => m.faction === "LUNAR").length,
        NEBULA: members.filter((m) => m.faction === "NEBULA").length,
        CHRONO: members.filter((m) => m.faction === "CHRONO").length,
      },
    };
  }

  async search(query: string): Promise<Member[]> {
    const q = query.trim().toLowerCase();
    const members = await this.loadMembers();
    return members.filter(
      (m) =>
        m.visible !== false &&
        `${m.displayName} ${m.role}`.toLowerCase().includes(q),
    );
  }

  getDefaultTheme() {
    return getDefaultTheme();
  }

  async saveTheme(slug: string, theme: Member["theme"]): Promise<boolean> {
    const member = await this.getBySlug(slug);
    if (!member) return false;
    return this.update(slug, { theme })
      .then(() => true)
      .catch(() => false);
  }
}

// Singleton export
export const jsonRepository = new JSONRepository();