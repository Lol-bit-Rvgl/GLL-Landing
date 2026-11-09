export const dynamic = 'force-dynamic';

import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/auth/config";
import { memberRepository } from "@/lib/db/repository";
import { validateMemberUpdate } from "@/lib/db/validators";

/**
 * GET - Obtener miembro por slug
 */
export async function GET(
  request: Request,
  { params }: { params: Promise<{ slug: string }> | { slug: string } }
) {
  const { slug } = await params;
  
  try {
    const member = await memberRepository.getBySlug(slug);
    
    if (!member) {
      return NextResponse.json({ error: "Member not found" }, { status: 404 });
    }
    
    return NextResponse.json(member);
  } catch (error) {
    console.error("[Get Member Error]:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}

/**
 * PUT - Actualizar miembro completo (reemplazo total)
 */ 
export async function PUT(
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
    const updates = await request.json();
    
    // Validar datos de entrada
    const validation = validateMemberUpdate(updates);
    if (!validation.valid) {
      return NextResponse.json(
        { error: "Validation failed", details: validation.errors },
        { status: 400 }
      );
    }

    const result = await memberRepository.update(slug, validation.values!);
    
    if (!result) {
      return NextResponse.json({ error: "Member not found or update failed" }, { status: 404 });
    }

    // Log de auditoría
    console.log(`[AUDIT] Member updated (PUT): ${slug} by ${session.user.email}`);

    return NextResponse.json({ success: true, member: result });
  } catch (error) {
    console.error("[Update Member Error]:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}

/**
 * PATCH - Actualizar parcialmente un miembro
 */
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
    const updates = await request.json();
    
    // Validar datos de entrada
    const validation = validateMemberUpdate(updates);
    if (!validation.valid) {
      return NextResponse.json(
        { error: "Validation failed", details: validation.errors },
        { status: 400 }
      );
    }

    const result = await memberRepository.update(slug, validation.values!);
    
    if (!result) {
      return NextResponse.json({ error: "Member not found or update failed" }, { status: 404 });
    }

    // Log de auditoría
    console.log(`[AUDIT] Member updated (PATCH): ${slug} by ${session.user.email}`);

    return NextResponse.json({ success: true, member: result });
  } catch (error) {
    console.error("[Update Member Error]:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}

/**
 * DELETE - Eliminar miembro (soft delete)
 */
export async function DELETE(
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
    const result = await memberRepository.delete(slug);
    
    if (!result) {
      return NextResponse.json({ error: "Member not found or already deleted" }, { status: 404 });
    }

    // Log de auditoría
    console.log(`[AUDIT] Member deleted: ${slug} by ${session.user.email}`);

    return NextResponse.json({ success: true, message: "Member soft-deleted" });
  } catch (error) {
    console.error("[Delete Member Error]:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}