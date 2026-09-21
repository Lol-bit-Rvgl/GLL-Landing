import { loadMember, generateStaticParams } from "./loader";
import { getMemberView } from "@/views/members";

export { generateStaticParams };

type PageProps = { params: Promise<{ slug: string }> };

export default async function MemberPage({ params }: PageProps) {
  const { slug } = await params;
  const member = loadMember(slug);
  const View = getMemberView(slug);
  return <View member={member} />;
}
