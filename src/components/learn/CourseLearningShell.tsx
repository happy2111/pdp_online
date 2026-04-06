'use client'

import { useState, useCallback } from "react"
import { useRouter, useParams } from "next/navigation"
import { ChevronLeft, Menu, X } from "lucide-react"
import { motion, AnimatePresence } from "framer-motion"

import { CourseDetails } from "@/schemas/courses-schema"
import { CourseModule, LessonTitle } from "@/schemas/modules-schema"
import { Button } from "@/components/ui/button"

import { CourseSidebar } from "./CourseSidebar"
import { LearnContext } from "./LearnContext"

interface Props {
  course: CourseDetails
  modules: CourseModule[]
  children: React.ReactNode
}

export function CourseLearningShell({ course, modules, children }: Props) {
  const router = useRouter()
  const params = useParams<{ slug: string; lessonId?: string }>()
  const [sidebarOpen, setSidebarOpen] = useState(false)

  // TODO: replace with real enrollment check from your store/API
  const isEnrolled = true

  const activeLessonId = params.lessonId ? Number(params.lessonId) : null

  const activeLesson = modules
    .flatMap(m => m.lessons)
    .find(l => l.lesson_id === activeLessonId) ?? null

  const handleSelectLesson = useCallback((lesson: LessonTitle) => {
    setSidebarOpen(false)
    router.push(`/courses/${params.slug}/learn/${lesson.lesson_id}`)
  }, [router, params.slug])

  return (
    <LearnContext.Provider value={{ course, modules, slug: params.slug, isEnrolled }}>
      <div className="flex flex-col h-dvh bg-background overflow-hidden container-custom">

        {/* ── Top bar ── */}
        <header className="flex items-center gap-3 h-14 border-b border-border/60 bg-background/95 backdrop-blur shrink-0 z-20">
          <Button
            variant="ghost" size="icon" className="h-8 w-8 shrink-0"
            onClick={() => router.push(`/courses/${params.slug}`)}
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
        <div className="flex flex-1 overflow-hidden">
          <main className="flex-1 flex flex-col overflow-hidden min-w-0">
            {children}
          </main>

          {/* Desktop sidebar */}
          <aside className="hidden lg:flex flex-col w-80 xl:w-96 border-l border-border/60 bg-background shrink-0 overflow-hidden">
            <CourseSidebar
              modules={modules}
              activeLessonId={activeLessonId}
              isEnrolled={isEnrolled}
              onSelectLesson={handleSelectLesson}
            />
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
                  className="fixed right-0 top-14 bottom-0 z-40 w-80 flex flex-col bg-background border-l border-border/60 shadow-2xl lg:hidden overflow-hidden"
                >
                  <CourseSidebar
                    modules={modules}
                    activeLessonId={activeLessonId}
                    isEnrolled={isEnrolled}
                    onSelectLesson={handleSelectLesson}
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