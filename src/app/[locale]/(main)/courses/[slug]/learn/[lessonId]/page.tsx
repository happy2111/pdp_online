import {LessonPageClient} from "@/components/learn/LessonPageClient";

export default async function LessonPage({
                                           params,
                                         }: {
  params: Promise<{ slug: string; lessonId: string }>
}) {
  const { lessonId, slug } = await params
  return <LessonPageClient lessonId={Number(lessonId)} />
}