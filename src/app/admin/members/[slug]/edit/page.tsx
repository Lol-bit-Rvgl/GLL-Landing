import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/auth/config";
import { memberRepository } from "@/lib/db/repository";
import { redirect } from "next/navigation";
import type { MemberFaction, MemberCardSize } from "@/types/member";

export const revalidate = 0;

interface EditMemberPageProps {
  params: { slug: string };
}

export default async function EditMemberPage({ params }: EditMemberPageProps) {
  const session = await getServerSession(authOptions);
  if (!session?.user) {
    redirect("/admin/signin");
  }

  const { slug } = params;
  const member = await memberRepository.getBySlug(slug);

  if (!member) {
    return (
      <div className="space-y-6">
        <h1 className="text-2xl font-bold text-zinc-100">MEMBER NOT FOUND</h1>
      </div>
    );
  }

  async function handleSubmit(formData: FormData) {
    "use server";
    const displayName = formData.get("displayName") as string;
    const role = formData.get("role") as string;
    const faction = formData.get("faction") as string;
    const order = parseInt(formData.get("order") as string || "0");
    const visible = formData.get("visible") === "true";
    const discord = formData.get("discord") as string;
    const quote = formData.get("quote") as string;
    const description = formData.get("description") as string;
    const cardSize = formData.get("cardSize") as string || "compact";

    await memberRepository.update(slug, {
      displayName,
      role,
      faction: faction as MemberFaction,
      order,
      visible,
      discord,
      quote,
      description,
      cardSize: cardSize as MemberCardSize,
    });

    redirect("/admin/members");
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-zinc-100">EDIT MEMBER</h1>
        <p className="text-sm text-zinc-400">Modify member: {member.displayName}</p>
      </div>

      <form action={handleSubmit} className="space-y-4 rounded-xl border border-red-600/30 bg-black/50 p-6">
        <div className="space-y-2">
          <label className="text-xs text-zinc-400">DISPLAY NAME</label>
          <input
            name="displayName"
            type="text"
            required
            defaultValue={member.displayName}
            className="w-full rounded-md border border-white/10 bg-black/30 px-3 py-2 text-sm text-zinc-200"
          />
        </div>

        <div className="space-y-2">
          <label className="text-xs text-zinc-400">SLUG (URL)</label>
          <input
            name="slug"
            type="text"
            readOnly
            className="w-full rounded-md border border-white/10 bg-black/30 px-3 py-2 text-sm text-zinc-500 font-mono"
            value={member.slug}
          />
          <p className="text-xs text-zinc-600">Cannot change URL identifier after creation</p>
        </div>

        <div className="space-y-2">
          <label className="text-xs text-zinc-400">ROLE</label>
          <input
            name="role"
            type="text"
            required
            defaultValue={member.role}
            className="w-full rounded-md border border-white/10 bg-black/30 px-3 py-2 text-sm text-zinc-200"
          />
        </div>

        <div className="space-y-2">
          <label className="text-xs text-zinc-400">FACTION</label>
          <select
            name="faction"
            defaultValue={member.faction}
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
            defaultValue={member.order}
            className="w-full rounded-md border border-white/10 bg-black/30 px-3 py-2 text-sm text-zinc-200"
          />
        </div>

        <div className="space-y-2">
          <label className="text-xs text-zinc-400">VISIBLE</label>
          <label className="flex items-center gap-3 rounded-md border border-red-600/30 bg-black/30 p-3">
            <input
              type="checkbox"
              name="visible"
              defaultChecked={member.visible}
              className="h-4 w-4"
            />
            <span className="text-sm text-zinc-300">Visible in roster</span>
          </label>
        </div>

        <div className="space-y-2">
          <label className="text-xs text-zinc-400">DISCORD</label>
          <input
            name="discord"
            type="text"
            defaultValue={member.discord || ""}
            className="w-full rounded-md border border-white/10 bg-black/30 px-3 py-2 text-sm text-zinc-200"
          />
        </div>

        <div className="space-y-2">
          <label className="text-xs text-zinc-400">QUOTE</label>
          <input
            name="quote"
            type="text"
            defaultValue={member.quote || ""}
            className="w-full rounded-md border border-white/10 bg-black/30 px-3 py-2 text-sm text-zinc-200"
          />
        </div>

        <div className="space-y-2">
          <label className="text-xs text-zinc-400">DESCRIPTION</label>
          <textarea
            name="description"
            defaultValue={member.description || ""}
            rows={3}
            className="w-full rounded-md border border-white/10 bg-black/30 px-3 py-2 text-sm text-zinc-200 resize-y"
          />
        </div>

        <div className="space-y-2">
          <label className="text-xs text-zinc-400">CARD SIZE</label>
          <select
            name="cardSize"
            defaultValue={member.cardSize || "compact"}
            className="w-full rounded-md border border-white/10 bg-black/30 px-3 py-2 text-sm text-zinc-200"
          >
            <option value="compact">Compact</option>
            <option value="wide">Wide</option>
          </select>
        </div>

        <button
          type="submit"
          className="w-full rounded-md bg-red-600 px-4 py-2 font-bold text-white hover:bg-red-500"
        >
          SAVE CHANGES
        </button>
      </form>
    </div>
  );
}