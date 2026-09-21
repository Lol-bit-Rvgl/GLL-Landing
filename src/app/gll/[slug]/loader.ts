import { getMemberBySlug, getAllSlugs } from "@/data/members";
import { notFound } from "next/navigation";

export function loadMember(slug: string) {
  const member = getMemberBySlug(slug);
  if (!member) notFound();
  return member;
}

export function generateStaticParams() {
  return getAllSlugs().map((slug) => ({ slug }));
}
