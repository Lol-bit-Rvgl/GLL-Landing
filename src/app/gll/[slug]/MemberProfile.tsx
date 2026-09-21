"use client";

import type { Member } from "@/data/members";

export function MemberProfile({ member }: { member: Member }) {
  return (
    <main className="min-h-screen bg-gll-carbon px-6 py-16">
      <div className="mx-auto max-w-2xl">
        <a
          href="/"
          className="mb-8 inline-block text-sm text-gll-piedra transition-colors hover:text-gll-rojo"
        >
          &larr; Volver al roster
        </a>

        <div
          className={`rounded-2xl border bg-gll-grafito/40 p-8 ${
            member.isLeader
              ? "border-gll-rojo shadow-[0_0_40px_rgba(200,30,58,0.12)]"
              : "border-gll-grafito"
          }`}
        >
          <div className="flex items-center gap-6">
            <div
              className={`flex h-24 w-24 shrink-0 items-center justify-center rounded-full text-3xl font-bold ${
                member.isLeader
                  ? "bg-gll-rojo text-white"
                  : "bg-gll-rojo/20 text-gll-rojo"
              }`}
            >
              {member.displayName.replace(/[^\w]/g, "")[0] ?? "?"}
            </div>

            <div className="min-w-0">
              {member.isLeader && (
                <span className="mb-1 inline-block rounded-full bg-gll-rojo/20 px-2.5 py-0.5 text-[10px] font-bold uppercase tracking-widest text-gll-rojo">
                  Fundador
                </span>
              )}
              <h1
                className="text-3xl font-bold text-gll-niebla"
                style={{ wordBreak: "break-word" }}
              >
                {member.displayName}
              </h1>
              <p className="mt-1 text-sm uppercase tracking-widest text-gll-rojo">
                {member.role}
              </p>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}
