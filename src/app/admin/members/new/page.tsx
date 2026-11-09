import { getServerSession } from "next-auth/next";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import { memberRepository } from "@/lib/db/repository";
import { redirect } from "next/navigation";
import type { MemberFaction, MemberCardSize } from "@/types/member";

export const revalidate = 0;

export default async function CreateMemberPage() {
  const session = await getServerSession(authOptions);
  if (!session?.user) {
    redirect("/admin/signin");
  }

  async function handleSubmit(formData: FormData) {
    "use server";
    const displayName = formData.get("displayName") as string;
    const role = formData.get("role") as string;
    const slug = formData.get("slug") as string;
    const faction = formData.get("faction") as string;
    const order = parseInt(formData.get("order") as string || "0");
    const visible = formData.get("visible") === "true";
    const discord = formData.get("discord") as string;
    const quote = formData.get("quote") as string;
    const description = formData.get("description") as string;
    const cardSize = formData.get("cardSize") as string || "compact";

    await memberRepository.create({
      slug,
      displayName,
      role,
      faction: faction as MemberFaction,
      order,
      visible,
      discord,
      quote,
      description,
      avatar: {
        src: "/images/members/lolbit/avatars.jpeg",
        alt: displayName,
      },
      tags: [],
      links: [],
      seo: {
        title: `${displayName} // GLL`,
        description: "Member of GLL",
      },
      theme: memberRepository.getDefaultTheme(),
      experience: {
        component: "default",
        kind: "interactive",
        capabilities: [],
      },
      cardSize: cardSize as MemberCardSize,
    });

    redirect("/admin/members");
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-zinc-100">CREATE MEMBER</h1>
        <p className="text-sm text-zinc-400">Add a new member to the roster</p>
      </div>

      <form action={handleSubmit} className="space-y-4 rounded-xl border border-red-600/30 bg-black/50 p-6">
        <div className="space-y-2">
          <label className="text-xs text-zinc-400">DISPLAY NAME</label>
          <input
            name="displayName"
            type="text"
            required
            className="w-full rounded-md border border-white/10 bg-black/30 px-3 py-2 text-sm text-zinc-200"
            placeholder="— Member Name"
          />
        </div>

        <div className="space-y-2">
          <label className="text-xs text-zinc-400">SLUG (URL)</label>
          <input
            name="slug"
            type="text"
            required
            pattern="[a-z0-9-]+"
            className="w-full rounded-md border border-white/10 bg-black/30 px-3 py-2 text-sm text-zinc-200 font-mono"
            placeholder="member-name"
          />
        </div>

        <div className="space-y-2">
          <label className="text-xs text-zinc-400">ROLE</label>
          <input
            name="role"
            type="text"
            required
            className="w-full rounded-md border border-white/10 bg-black/30 px-3 py-2 text-sm text-zinc-200"
            placeholder="Member Role // Description"
          />
        </div>

        <div className="space-y-2">
          <label className="text-xs text-zinc-400">FACTION</label>
          <select
            name="faction"
            defaultValue="ARCHIVE"
            className="w-full rounded-md border border-white/10 bg-black/30 px-3 py-2 text-sm text-zinc-200"
          >
            <option value="ARCHIVE">ARCHIVE</option>
            <option value="COMBAT">COMBAT</option>
            <option value="VOID">VOID</option>
          </select>
        </div>

        <div className="space-y-2">
          <label className="text-xs text-zinc-400">ORDER</label>
          <input
            name="order"
            type="number"
            defaultValue="0"
            className="w-full rounded-md border border-white/10 bg-black/30 px-3 py-2 text-sm text-zinc-200"
          />
        </div>

        <div className="space-y-2">
          <label className="text-xs text-zinc-400">VISIBLE</label>
          <label className="flex items-center gap-3 rounded-md border border-red-600/30 bg-black/30 p-3">
            <input type="checkbox" name="visible" defaultChecked className="h-4 w-4" />
            <span className="text-sm text-zinc-300">Visible in roster</span>
          </label>
        </div>

        <button
          type="submit"
          className="w-full rounded-md bg-red-600 px-4 py-2 font-bold text-white hover:bg-red-500"
        >
          CREATE MEMBER
        </button>
      </form>
    </div>
  );
}