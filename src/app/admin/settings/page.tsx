import { getServerSession } from "next-auth/next";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import { redirect } from "next/navigation";

export const revalidate = 0;

export default async function SettingsPage() {
  const session = await getServerSession(authOptions);
  if (!session?.user) {
    redirect("/admin/signin");
  }

  // Form handler
  async function handleSubmit() {
    "use server";
    // TODO: Implement persistence
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-zinc-100">SITE SETTINGS</h1>
        <p className="text-sm text-zinc-400">Configure global site settings</p>
      </div>

      <form action={handleSubmit} className="space-y-4 rounded-xl border border-amber-600/30 bg-black/50 p-6">
        <div className="space-y-2">
          <label className="text-xs text-zinc-400">SITE NAME</label>
          <input
            name="siteName"
            type="text"
            defaultValue="GLL • Gods Live Longer.™"
            className="w-full rounded-md border border-white/10 bg-black/30 px-3 py-2 text-sm text-zinc-200"
          />
        </div>

        <div className="space-y-2">
          <label className="text-xs text-zinc-400">SLOGAN</label>
          <input
            name="slogan"
            type="text"
            defaultValue="Digital Archive • Signal Network"
            className="w-full rounded-md border border-white/10 bg-black/30 px-3 py-2 text-sm text-zinc-200"
          />
        </div>

        <div className="space-y-2">
          <label className="text-xs text-zinc-400">DESCRIPTION</label>
          <input
            name="description"
            type="text"
            defaultValue="GLL is a digital archive and signal network for the community."
            className="w-full rounded-md border border-white/10 bg-black/30 px-3 py-2 text-sm text-zinc-200"
          />
        </div>

        <div className="space-y-2">
          <label className="text-xs text-zinc-400">DISCORD</label>
          <input
            name="discord"
            type="text"
            defaultValue="JFwbkEbfAH"
            className="w-full rounded-md border border-white/10 bg-black/30 px-3 py-2 text-sm text-zinc-200"
          />
        </div>

        <button
          type="submit"
          className="rounded-md bg-emerald-600 px-4 py-2 font-bold text-white hover:bg-emerald-500"
        >
          SAVE SETTINGS
        </button>
      </form>
    </div>
  );
}