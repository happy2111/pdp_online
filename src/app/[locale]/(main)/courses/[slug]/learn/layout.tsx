import {CoursesService} from "@/services/courses-service";
import {ModulesService} from "@/services/modules-service";
import {notFound} from "next/navigation";
import {CourseLearningShell} from "@/components/learn/CourseLearningShell";

export default async function LearnLayout({
                                            children,
                                            params,
                                          }: {
  children: React.ReactNode
  params: Promise<{ slug: string }>
}) {
  const { slug } = await params

  console.log("slug:", slug)

  const [courseRes, modulesRes] = await Promise.all([
    CoursesService.getCourseBySlug(slug),
    ModulesService.getCourseModules(slug),
  ])

  if (!courseRes.data) notFound()

  return (
    <CourseLearningShell
      course={courseRes.data}
      modules={modulesRes.data ?? []}
    >
      {children}
    </CourseLearningShell>
  )
}