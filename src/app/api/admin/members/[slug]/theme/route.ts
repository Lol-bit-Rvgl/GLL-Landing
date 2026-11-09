export const dynamic = 'force-dynamic';

import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import { memberRepository } from "@/lib/db/repository";
import { validateTheme } from "@/lib/db/validators";

export async function PATCH(
  request: NextRequest,
  context: { params: Promise<{ slug: string }> }
) {
  const session = await getServerSession(authOptions);
  const { slug } = await context.params;
  
  if (!session?.user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  // Verificar rol de super admin
  const userRole = (session.user as { role?: string }).role;
  if (userRole !== "SUPER_ADMIN") {
    return NextResponse.json({ error: "Forbidden - Super Admin required" }, { status: 403 });
  }

  try {
    const theme = await request.json();
    
    // Validar datos de tema
    const validation = validateTheme(theme);
    if (!validation.valid) {
      return NextResponse.json(
        { error: "Theme validation failed", details: validation.errors },
        { status: 400 }
      );
    }

    // Verificar que el miembro existe primero
    const existingMember = await memberRepository.getBySlug(slug);
    if (!existingMember) {
      return NextResponse.json({ error: "Member not found" }, { status: 404 });
    }

    // Merge con el theme existente
    const mergedTheme = {
      primary: validation.values?.primary ?? existingMember.theme.primary,
      secondary: validation.values?.secondary ?? existingMember.theme.secondary,
      background: validation.values?.background ?? existingMember.theme.background,
      foreground: validation.values?.foreground ?? existingMember.theme.foreground,
      muted: validation.values?.muted ?? existingMember.theme.muted,
      border: validation.values?.border ?? existingMember.theme.border,
      glow: validation.values?.glow ?? existingMember.theme.glow,
      font: validation.values?.font ?? existingMember.theme.font,
      radius: validation.values?.radius ?? existingMember.theme.radius,
      texture: validation.values?.texture ?? existingMember.theme.texture,
      effects: validation.values?.effects ?? existingMember.theme.effects,
      card: validation.values?.card ?? existingMember.theme.card,
    };

    const result = await memberRepository.update(slug, { theme: mergedTheme });
    
    if (!result) {
      return NextResponse.json({ error: "Theme update failed" }, { status: 500 });
    }

    // Log de auditoría
    console.log(`[AUDIT] Theme updated for ${slug} by ${session.user.email}`);

    return NextResponse.json({ success: true, member: result });
  } catch (error) {
    console.error("[Theme Update Error]:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}