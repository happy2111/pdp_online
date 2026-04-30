import {LessonPageClient} from "@/components/learn/LessonPageClient";
import Protected from "@/components/protecters/Protected";

export default async function LessonPage({
                                           params,
                                         }: {
  params: Promise<{ slug: string; lessonId: string }>
}) {
  const { lessonId, slug } = await params
  return <Protected>
    <LessonPageClient lessonId={Number(lessonId)} />
  </Protected>
}