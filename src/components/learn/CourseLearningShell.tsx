'use client'

import { useState, useCallback } from "react"
import { ChevronLeft, Menu, X } from "lucide-react"
import { motion, AnimatePresence } from "framer-motion"

import { CourseDetails } from "@/schemas/courses-schema"
import { CourseModule, LessonTitle } from "@/schemas/modules-schema"
import { Button } from "@/components/ui/button"

import { CourseSidebar } from "./CourseSidebar"
import { LearnContext } from "./LearnContext"
import { useRouter } from "@/i18n/navigation";
import { useParams } from "next/navigation";
import NProgress from "nprogress";

interface Props {
  course: CourseDetails
  modules: CourseModule[]
  children: React.ReactNode
}

export function CourseLearningShell({ course, modules, children }: Props) {
  const router = useRouter()
  const params = useParams<{ slug: string; lessonId?: string }>()
  const [sidebarOpen, setSidebarOpen] = useState(false)

  const isEnrolled = true
  const activeLessonId = params.lessonId ? Number(params.lessonId) : null

  const activeLesson = modules
    .flatMap(m => m.lessons)
    .find(l => l.lesson_id === activeLessonId) ?? null

  const handleSelectLesson = useCallback((lesson: LessonTitle) => {
    setSidebarOpen(false)
    NProgress.start();
    router.push(`/courses/${params.slug}/learn/${lesson.lesson_id}`)
  }, [router, params.slug])


  const handleClose = () => {
    setSidebarOpen(false);
  }
  return (
    <LearnContext.Provider value={{ course, modules, slug: params.slug, isEnrolled }}>
      {/* Новый более «плотный» layout: плеер слева занимает всё доступное пространство, сайдбар справа фиксированной ширины */}
      <div className="flex flex-col min-h-screen bg-background">

        {/* ── Top bar ── */}
        <header className="sticky top-0 flex items-center gap-3 h-14 bg-background/95 backdrop-blur shrink-0 z-20 px-4">
          <Button
            variant="ghost" size="icon" className="h-8 w-8 shrink-0"
            onClick={() => {
              NProgress.start();
              router.push(`/courses/${params.slug}`)
            }}
          >
            <ChevronLeft className="h-4 w-4" />
          </Button>

          <div className="flex-1 min-w-0">
            <p className="text-sm font-medium truncate leading-tight">{course.title}</p>
            {activeLesson && (
              <p className="text-xs text-muted-foreground truncate leading-tight mt-0.5">
                {activeLesson.title}
              </p>
            )}
          </div>

          <Button
            variant="ghost" size="icon" className="h-8 w-8 shrink-0 lg:hidden"
            onClick={() => setSidebarOpen(v => !v)}
          >
            {sidebarOpen ? <X className="h-4 w-4" /> : <Menu className="h-4 w-4" />}
          </Button>
        </header>

        {/* ── Body ── */}
        <div className="flex flex-1 gap-6 lg:gap-8 px-4 py-6">
          {/* Контентная часть (плеер) */}
          <main className="flex-1 min-w-0 flex flex-col">
            {/* Плеерный контейнер - занимает всю доступную высоту под header, с округлыми краями и тенями */}
            <div className="rounded-2xl shadow-lg overflow-hidden bg-black flex-1 flex flex-col h-[calc(100vh-3.5rem)]">
              {/* Внутренний контент (видео или текст) сохраняем в контейнере с паддингом для удобства */}
              <div className="flex-1 min-h-0">
                <div className="h-full">
                  {children}
                </div>
              </div>
            </div>
          </main>

          {/* Desktop sidebar: фиксированная ширина, близко к плееру. Сайдбар "липкий" и имеет внутренний скролл, чтобы сам он не уезжал */}
          <aside className="hidden lg:block w-96 flex-shrink-0 relative">
            <div className="sticky top-14 max-h-[calc(100vh-3.5rem)] overflow-auto rounded-xl bg-background/60 p-3 shadow-sm">
              <CourseSidebar
                modules={modules}
                activeLessonId={activeLessonId}
                isEnrolled={isEnrolled}
                onSelectLesson={handleSelectLesson}
                setSidebarOpen={() => handleClose()}
              />
            </div>
          </aside>

          {/* Mobile overlay */}
          <AnimatePresence>
            {sidebarOpen && (
              <>
                <motion.div
                  initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
                  transition={{ duration: 0.18 }}
                  className="fixed inset-0 z-30 bg-black/50 lg:hidden"
                  onClick={() => setSidebarOpen(false)}
                />
                <motion.aside
                  initial={{ x: "100%" }} animate={{ x: 0 }} exit={{ x: "100%" }}
                  transition={{ type: "tween", duration: 0.22 }}
                  className="z-999 fixed right-0 top-0 bottom-0 w-80 flex flex-col bg-background border-l border-border/60 shadow-2xl lg:hidden overflow-hidden"
                >
                  <CourseSidebar
                    modules={modules}
                    activeLessonId={activeLessonId}
                    isEnrolled={isEnrolled}
                    onSelectLesson={handleSelectLesson}
                    sidebarOpen={sidebarOpen}
                    setSidebarOpen={handleClose}
                  />
                </motion.aside>
              </>
            )}
          </AnimatePresence>
        </div>
      </div>
    </LearnContext.Provider>
  )
}