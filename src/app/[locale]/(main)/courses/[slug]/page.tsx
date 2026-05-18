'use client'

import { useState, useEffect } from "react"
import { useParams } from "next/navigation"
import { motion } from "framer-motion"
import {
  Star,
  Users,
  Globe,
  CheckCircle2,
  Info,
  Loader2,
  PlayCircle,
  Lock
} from "lucide-react"

import { CoursesService } from "@/services/courses-service"
import { CourseDetails } from "@/schemas/courses-schema"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { CourseSidebar } from "@/components/courses/CourseSidebar"
import { ModulesService } from "@/services/modules-service"
import { useTranslations } from "next-intl"
import { ReviewsTab } from "@/components/courses/Review"
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion"
import { formatDuration } from "@/lib/utils"
import NProgress from "nprogress"
import {useRouter} from "@/i18n/navigation";

const fadeInUp = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.5 } }
}

export default function CourseDetailPage() {
  const { slug } = useParams()
  const router = useRouter()
  const t = useTranslations('courses')
  const tDetail = useTranslations('courses.detail')
  const tMain = useTranslations()
  const [course, setCourse] = useState<CourseDetails | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [modules, setModules] = useState<any[]>([])

  useEffect(() => {
    window.scrollTo({ top: 0, left: 0, behavior: "instant" })
  }, [slug])

  useEffect(() => {
    const fetchCourse = async () => {
      try {
        const res = await CoursesService.getCourseBySlug(slug as string)
        setCourse(res.data)
      } catch (error) {
        console.error(error)
      } finally {
        setIsLoading(false)
      }
    }
    fetchCourse()
  }, [slug])

  useEffect(() => {
    if (slug) {
      const loadData = async () => {
        const response = await ModulesService.getCourseModules(slug as string)
        if (response.code === 0) {
          setModules(response.data)
        }
      }
      loadData()
    }
  }, [slug])

  if (isLoading) {
    return (
        <div className="flex h-screen items-center justify-center">
          <Loader2 className="h-12 w-12 animate-spin text-primary" />
        </div>
    )
  }



  if (!course) return <div>{t('no_courses_yet')}</div>

  return (
      <div className="min-h-screen bg-background">
        <section className="relative py-16 md:py-24">
          <div className="absolute top-0 right-0 w-1/2 h-full bg-primary/20 blur-[140px] rounded-full pointer-events-none" />
          <div className="absolute bottom-0 left-0 w-1/3 h-2/3 bg-accent/20 blur-[100px] rounded-full pointer-events-none" />

          <div className="container-custom relative z-10">
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
              <motion.div
                  initial="hidden"
                  animate="visible"
                  variants={fadeInUp}
                  className="lg:col-span-8 space-y-6"
              >
                <div className="flex flex-wrap gap-2">
                  <Badge className="bg-primary/10 text-primary border-primary/20 rounded-xl">
                    {course.category_name}
                  </Badge>
                  <Badge variant="outline" className="text-muted-foreground border-border rounded-xl">
                    {course.level}
                  </Badge>
                </div>

                <h1 className="text-4xl md:text-5xl font-bold tracking-tight text-foreground">
                  {course.title}
                </h1>

                <p className="text-lg text-muted-foreground max-w-3xl break-after-all leading-relaxed">
                  {course.short_description}
                </p>

                <div className="flex flex-wrap items-center gap-6 text-sm">
                  <div className="flex items-center gap-1.5 text-yellow-500 dark:text-yellow-400 font-bold">
                    <Star className="fill-current h-4 w-4" />
                    {course.rating_avg.toFixed(1)}
                    <span className="text-muted-foreground font-normal underline decoration-dotted ml-1">
                    {tDetail('ratingReviews', { count: course.total_reviews })}
                  </span>
                  </div>

                  <div className="flex items-center gap-1.5 text-muted-foreground">
                    <Users className="h-4 w-4" />
                    {course.enrolled_count} {tDetail('studentsCount')}
                  </div>

                  <div className="flex items-center gap-1.5 text-muted-foreground">
                    <Globe className="h-4 w-4" /> {course.language}
                  </div>
                </div>

                {/* Teacher */}
                <div className="pt-2 flex items-center gap-3">
                  <div className="h-10 w-10 rounded-full bg-primary/15 flex items-center justify-center text-primary font-bold shrink-0">
                    {course.teacher_full_name.charAt(0)}
                  </div>
                  <div className="text-sm">
                    <p className="text-muted-foreground">{tDetail('teacher')}</p>
                    <p className="font-medium text-foreground underline decoration-primary underline-offset-4 cursor-pointer">
                      {course.teacher_full_name}
                    </p>
                  </div>
                </div>
              </motion.div>
            </div>
          </div>
        </section>

        <div className="container-custom py-12">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
            <div className="lg:col-span-8">
              <Tabs defaultValue="about" className="w-full">
                {/* Google-style Tab Navigation */}
                <TabsList className="flex w-full border-b border-border/50 bg-transparent p-0 h-auto gap-8 mb-8" variant="line">
                  {["about", "reviews"].map((tab) => {
                    const labels: Record<string, string> = {
                      about: tDetail('general'),
                      reviews: tDetail('reviews'),
                    }
                    return (
                      <TabsTrigger
                        key={tab}
                        value={tab}
                        className="relative bg-transparent px-0 py-4 font-medium text-sm text-muted-foreground data-[state=active]:text-foreground data-[state=active]:bg-transparent hover:text-foreground transition-colors rounded-none after:opacity-0 data-[state=active]:after:opacity-100"
                      >
                        {labels[tab]}
                      </TabsTrigger>
                    )
                  })}
                </TabsList>

                {/* About Tab - Combined General + Curriculum */}
                <TabsContent value="about" className="space-y-12 outline-none">
                  {/* What You Will Learn */}
                  <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.3 }}
                    className="space-y-6"
                  >
                    <div className="space-y-3">
                      <h3 className="text-2xl md:text-3xl font-bold tracking-tight">{tDetail('whatYouWillLearn')}</h3>
                      <div className="h-1 w-12 bg-primary rounded-full" />
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-y-4 gap-x-8">
                      {course.learning_outcomes.map((outcome, idx) => (
                        <motion.div
                          key={idx}
                          initial={{ opacity: 0, x: -10 }}
                          animate={{ opacity: 1, x: 0 }}
                          transition={{ duration: 0.3, delay: idx * 0.05 }}
                          className="flex gap-3 items-start"
                        >
                          <CheckCircle2 className="h-5 w-5 text-primary shrink-0 mt-0.5 flex-shrink-0" />
                          <span className="text-foreground text-base leading-relaxed">{outcome}</span>
                        </motion.div>
                      ))}
                    </div>
                  </motion.div>

                  {/* Course Description */}
                  <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.3, delay: 0.1 }}
                    className="space-y-6"
                  >
                    <div className="space-y-3">
                      <h3 className="text-2xl md:text-3xl font-bold tracking-tight">{tDetail('courseDescription')}</h3>
                      <div className="h-1 w-12 bg-primary rounded-full" />
                    </div>
                    <div className="prose prose-slate max-w-none text-foreground whitespace-pre-line leading-relaxed text-base break-words">
                      {course.description}
                    </div>
                  </motion.div>

                  {/* Requirements */}
                  <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.3, delay: 0.2 }}
                    className="space-y-6"
                  >
                    <div className="space-y-3">
                      <h3 className="text-2xl md:text-3xl font-bold tracking-tight flex items-center gap-3">
                        <Info className="h-6 w-6 text-primary" /> {tDetail('requirements')}
                      </h3>
                      <div className="h-1 w-12 bg-primary rounded-full" />
                    </div>
                    <ul className="space-y-3">
                      {course.requirements.map((req, idx) => (
                        <motion.li
                          key={idx}
                          initial={{ opacity: 0, x: -10 }}
                          animate={{ opacity: 1, x: 0 }}
                          transition={{ duration: 0.3, delay: idx * 0.05 }}
                          className="flex gap-3 items-start text-base text-foreground"
                        >
                          <span className="text-primary font-bold mt-0.5 flex-shrink-0">✓</span>
                          {req}
                        </motion.li>
                      ))}
                    </ul>
                  </motion.div>

                  {/* Curriculum Section */}
                  <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.3, delay: 0.3 }}
                    className="space-y-8"
                  >
                    <div className="space-y-3">
                      <h3 className="text-2xl md:text-3xl font-bold tracking-tight">{tDetail('curriculum')}</h3>
                      <div className="h-1 w-12 bg-primary rounded-full" />
                    </div>

                    <div className="space-y-2">
                      <p className="text-sm text-muted-foreground font-medium">
                        {modules.reduce((sum, m) => sum + m.lessons.length, 0)} {tMain("common.lesson_many")} • {modules.length} {tMain("common.module")}
                      </p>
                    </div>

                    <Accordion type="single" collapsible className="w-full space-y-2">
                      {modules.map((module, index) => (
                        <AccordionItem
                          key={module.id}
                          value={`module-${module.id}`}
                          className="border-0 bg-muted/40 hover:bg-muted/60 transition-colors rounded-xl px-6 py-0 overflow-hidden group"
                        >
                          <AccordionTrigger className="hover:no-underline py-5 text-left">
                            <div className="flex flex-col items-start text-left gap-1.5 w-full">
                              <span className="font-semibold text-base text-foreground group-hover:text-primary transition-colors">
                                {tMain("common.module")} {index + 1}: {module.title}
                              </span>
                              <span className="text-xs text-muted-foreground font-medium">
                                {module.lessons.length} {tMain("common.lesson_many")}
                              </span>
                            </div>
                          </AccordionTrigger>

                          <AccordionContent className="pt-0 pb-4 space-y-2 px-0">
                            {module.lessons.map((lesson: any) => {
                              const isLocked = !lesson.is_free_preview

                              return (
                                <motion.div
                                  key={lesson.lesson_id}
                                  initial={{ opacity: 0, x: -5 }}
                                  animate={{ opacity: 1, x: 0 }}
                                  whileHover={!isLocked ? { x: 4 } : {}}
                                  transition={{ duration: 0.2 }}
                                  onClick={() => {
                                    if (!isLocked) {
                                      NProgress.start()
                                      router.push(
                                        `/courses/${slug}/learn/${lesson.lesson_id}`
                                      );
                                    }
                                  }}
                                  className={`flex items-center justify-between p-3 rounded-lg transition-all group
                                    ${
                                    isLocked
                                      ? "opacity-50 cursor-not-allowed"
                                      : "hover:bg-muted/80 cursor-pointer"
                                  }
                                  `}
                                >
                                  <div className="flex items-center gap-3 flex-1 min-w-0">
                                    {isLocked ? (
                                      <Lock className="h-4 w-4 text-muted-foreground shrink-0" />
                                    ) : (
                                      <PlayCircle className="h-4 w-4 text-primary shrink-0 opacity-60 group-hover:opacity-100 transition-opacity" />
                                    )}

                                    <span className="text-sm font-medium text-foreground truncate">
                                      {lesson.title}
                                    </span>
                                  </div>

                                  <span className="text-xs text-muted-foreground font-medium px-3 py-1 bg-background/50 rounded-md shrink-0 ml-2">
                                    {formatDuration(lesson?.duration_seconds)}
                                  </span>
                                </motion.div>
                              )
                            })}

                            {module.lessons.length === 0 && (
                              <div className="text-center py-4 text-sm text-muted-foreground">
                                {tMain("module.empty_lessons")}
                              </div>
                            )}
                          </AccordionContent>
                        </AccordionItem>
                      ))}
                    </Accordion>
                  </motion.div>
                </TabsContent>

                {/* Reviews Tab */}
                <TabsContent value="reviews" className="outline-none">
                  <ReviewsTab courseId={course.id} courseSlug={slug as string} />
                </TabsContent>
              </Tabs>
            </div>

            <div className="lg:col-span-4 xl:-translate-y-100 z-10">
              <motion.div
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.3 }}
              >
                <CourseSidebar course={course} />
              </motion.div>
            </div>
          </div>
        </div>
      </div>
  )
}