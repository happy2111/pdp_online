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
  PlayCircle
} from "lucide-react"

import { CoursesService } from "@/services/courses-service"
import { CourseDetails } from "@/schemas/courses-schema"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion"
import { CourseSidebar } from "@/components/courses/course-sidebar"

const fadeInUp = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.5 } }
}

export default function CourseDetailPage() {
  const { slug } = useParams()
  const [course, setCourse] = useState<CourseDetails | null>(null)
  const [isLoading, setIsLoading] = useState(true)

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

  if (isLoading) {
    return (
      <div className="flex h-screen items-center justify-center">
        <Loader2 className="h-12 w-12 animate-spin text-primary" />
      </div>
    )
  }

  if (!course) return <div>Course not found</div>

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
                <Badge
                  variant="outline"
                  className="text-muted-foreground border-border rounded-xl"
                >
                  {course.level}
                </Badge>
              </div>

              <h1 className="text-4xl md:text-5xl font-bold tracking-tight text-foreground">
                {course.title}
              </h1>

              <p className="text-lg text-muted-foreground max-w-3xl leading-relaxed">
                {course.short_description}
              </p>

              <div className="flex flex-wrap items-center gap-6 text-sm">
                <div className="flex items-center gap-1.5 text-yellow-500 dark:text-yellow-400 font-bold">
                  <Star className="fill-current h-4 w-4" />
                  {course.rating_avg.toFixed(1)}
                    <span className="text-muted-foreground font-normal underline decoration-dotted ml-1">
                (957 отзывов)
                </span>
                </div>
                <div className="flex items-center gap-1.5 text-muted-foreground">
                  <Users className="h-4 w-4" /> {course.enrolled_count} студентов
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
                  <p className="text-muted-foreground">Преподаватель:</p>
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
            <Tabs defaultValue="general" className="w-full">
              <TabsList className="w-full justify-start h-12 bg-transparent border-b border-border rounded-none p-0 gap-8 mb-8">
                {["general", "curriculum", "reviews"].map((tab) => {
                  const labels: Record<string, string> = {
                    general: "Общее",
                    curriculum: "Учебный план",
                    reviews: "Отзывы",
                  }
                  return (
                    <TabsTrigger
                      key={tab}
                      value={tab}
                      className="
                        data-[state=active]:bg-transparent
                        shadow-none!
                        data-[state=active]:border-b-2
                        data-[state=active]:border-x-0
                        data-[state=active]:border-t-0
                        data-[state=active]:border-primary
                        data-[state=active]:text-foreground
                        data-[state=inactive]:text-muted-foreground
                        rounded-none px-0 h-full text-base
                        transition-colors duration-200
                      "
                    >
                      {labels[tab]}
                    </TabsTrigger>
                  )
                })}
              </TabsList>

              <TabsContent value="general" className="space-y-10 outline-none">

                <div className="p-6 border border-border rounded-3xl bg-card/70 backdrop-blur">
                  <h3 className="text-xl font-bold mb-6">Чему вы научитесь?</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-3">
                    {course.learning_outcomes.map((outcome, idx) => (
                      <div key={idx} className="flex gap-3">
                        <CheckCircle2 className="h-5 w-5 text-primary shrink-0 mt-0.5" />
                        <span className="text-muted-foreground text-sm">{outcome}</span>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="space-y-4">
                  <h3 className="text-xl font-bold">Описание курса</h3>
                  <div className="prose prose-slate max-w-none text-muted-foreground leading-relaxed text-sm">
                    {course.description}
                  </div>
                </div>

                <div className="space-y-4">
                  <h3 className="text-xl font-bold flex items-center gap-2">
                    <Info className="h-5 w-5 text-primary" /> Требования
                  </h3>
                  <ul className="space-y-2 text-muted-foreground text-sm ml-2">
                    {course.requirements.map((req, idx) => (
                      <li key={idx} className="flex gap-2">
                        <span className="text-primary mt-1">•</span>
                        {req}
                      </li>
                    ))}
                  </ul>
                </div>
              </TabsContent>

              <TabsContent value="curriculum" className="outline-none">
                <Accordion type="single" collapsible className="w-full space-y-3">
                  <AccordionItem
                    value="module-1"
                    className="border border-border rounded-3xl px-4 bg-card/70 backdrop-blur"
                  >
                    <AccordionTrigger className="hover:no-underline">
                      <div className="flex flex-col items-start text-left gap-1">
                        <span className="font-semibold text-sm">Модуль 1: Основы синтаксиса</span>
                        <span className="text-xs text-muted-foreground font-normal">
                          4 урока • 56 минут
                        </span>
                      </div>
                    </AccordionTrigger>
                    <AccordionContent className="pt-2 pb-4 space-y-1">
                      {[
                        { title: "Введение и установка среды", time: "05:20" },
                        { title: "Типы данных и переменные", time: "12:45" },
                      ].map((lesson) => (
                        <div
                          key={lesson.title}
                          className="flex items-center justify-between p-3 rounded-2xl hover:bg-muted/50 cursor-pointer transition-colors"
                        >
                          <div className="flex items-center gap-3">
                            <PlayCircle className="h-4 w-4 text-primary shrink-0" />
                            <span className="text-sm">{lesson.title}</span>
                          </div>
                          <span className="text-xs text-muted-foreground">{lesson.time}</span>
                        </div>
                      ))}
                    </AccordionContent>
                  </AccordionItem>
                </Accordion>
              </TabsContent>
            </Tabs>
          </div>

          <div className="lg:col-span-4 xl:-translate-y-100">
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