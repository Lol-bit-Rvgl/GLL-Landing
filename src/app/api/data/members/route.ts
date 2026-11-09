import { NextResponse } from "next/server";
import { memberRepository } from "@/lib/db/repository";

export async function GET() {
  // Allow public access for member data (for profile pages)
  // But restrict write operations to authenticated users via separate endpoints
  
  try {
    const members = await memberRepository.getAll();
    return NextResponse.json(members);
  } catch (error) {
    console.error("[Members API Error]:", error);
    
    // Fallback to static data
    try {
      const { members: staticMembers } = await import("@/data/members");
      return NextResponse.json(staticMembers);
    } catch {
      return NextResponse.json([], { status: 500 });
    }
  }
}