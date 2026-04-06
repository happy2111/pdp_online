'use client'

import { useState, useEffect } from "react"
import {
  ChevronDown, ChevronUp, Play, FileText, BookOpen,
  Code, File, Lock, CheckCircle2, Loader2,
} from "lucide-react"
import { motion, AnimatePresence } from "framer-motion"

import { CourseModule, LessonTitle } from "@/schemas/modules-schema"
import { ScrollArea } from "@/components/ui/scroll-area"
import { cn } from "@/lib/utils"

const LESSON_TYPE_ICON: Record<string, React.ElementType> = {
  VIDEO:    Play,
  TEXT:     FileText,
  QUIZ:     BookOpen,
  PRACTICE: Code,
  FILE:     File,
}

function formatDuration(seconds: number | null | undefined): string {
  if (!seconds) return ""
  const m = Math.floor(seconds / 60)
  const s = seconds % 60
  return `${m}:${s.toString().padStart(2, "0")}`
}

// ─── Lesson row ───────────────────────────────────────────────────────────────

function LessonRow({
                     lesson,
                     isActive,
                     isLocked,
                     onClick,
                   }: {
  lesson: LessonTitle
  isActive: boolean
  isLocked: boolean
  onClick: () => void
}) {
  const Icon = LESSON_TYPE_ICON[lesson.type] ?? Play

  return (
    <button
      type="button"
      onClick={onClick}
      disabled={isLocked}
      className={cn(
        "w-full flex items-start gap-3 px-3 py-2.5 rounded-lg text-left transition-colors",
        isActive
          ? "bg-primary/10 text-primary"
          : "hover:bg-muted/60 text-foreground/80",
        isLocked && "opacity-40 cursor-not-allowed pointer-events-none",
      )}
    >
      <div className={cn(
        "mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-full transition-colors",
        isActive
          ? "bg-primary text-primary-foreground"
          : "bg-muted text-muted-foreground",
      )}>
        {isLocked
          ? <Lock className="h-2.5 w-2.5" />
          : <Icon className="h-2.5 w-2.5" />
        }
      </div>

      <div className="flex-1 min-w-0">
        <p className={cn(
          "text-sm leading-snug",
          isActive ? "font-medium" : "",
        )}>
          {lesson.title}
        </p>
        <div className="flex items-center gap-2 mt-0.5">
          {lesson.is_free_preview && !isActive && (
            <span className="text-[10px] text-emerald-600 dark:text-emerald-400 font-medium">
              Бесплатно
            </span>
          )}
          {lesson.duration_seconds && (
            <span className="text-[10px] text-muted-foreground flex items-center gap-1">
              {formatDuration(lesson.duration_seconds)}
            </span>
          )}
        </div>
      </div>

      {lesson.video_status === "DONE" && lesson.type === "VIDEO" && (
        <CheckCircle2 className="h-3.5 w-3.5 mt-0.5 shrink-0 text-emerald-500 opacity-70" />
      )}
    </button>
  )
}

// ─── Module accordion ─────────────────────────────────────────────────────────

function ModuleAccordion({
                           module,
                           activeLessonId,
                           isEnrolled,
                           onSelectLesson,
                         }: {
  module: CourseModule
  activeLessonId: number | null
  isEnrolled: boolean
  onSelectLesson: (lesson: LessonTitle) => void
}) {
  const hasActive = module.lessons.some(l => l.lesson_id === activeLessonId)
  const [open, setOpen] = useState(hasActive)

  useEffect(() => {
    if (hasActive) setOpen(true)
  }, [hasActive])

  const doneCount = module.lessons.filter(l => l.video_status === "DONE").length

  return (
    <div className="border-b border-border/40 last:border-0">
      <button
        type="button"
        onClick={() => setOpen(v => !v)}
        className="w-full flex items-start gap-2 px-4 py-3 text-left hover:bg-muted/30 transition-colors"
      >
        <div className="flex-1 min-w-0 space-y-0.5">
          <p className="text-sm font-medium leading-snug">{module.title}</p>
          <p className="text-[11px] text-muted-foreground">
            {module.lessons.length} {
            module.lessons.length === 1 ? "урок" :
              module.lessons.length < 5 ? "урока" : "уроков"
          }
            {doneCount > 0 && ` · ${doneCount} пройдено`}
          </p>
        </div>
        {open
          ? <ChevronUp className="h-4 w-4 text-muted-foreground shrink-0 mt-0.5" />
          : <ChevronDown className="h-4 w-4 text-muted-foreground shrink-0 mt-0.5" />
        }
      </button>

      <AnimatePresence initial={false}>
        {open && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.18 }}
            className="overflow-hidden"
          >
            <div className="px-2 pb-2 space-y-0.5">
              {module.lessons.map(lesson => (
                <LessonRow
                  key={lesson.lesson_id}
                  lesson={lesson}
                  isActive={lesson.lesson_id === activeLessonId}
                  isLocked={!isEnrolled && !lesson.is_free_preview}
                  onClick={() => onSelectLesson(lesson)}
                />
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}

// ─── Main sidebar ─────────────────────────────────────────────────────────────

interface Props {
  modules: CourseModule[]
  activeLessonId: number | null
  onSelectLesson: (lesson: LessonTitle) => void
  // TODO: pass real enrollment status
  isEnrolled?: boolean
}

export function CourseSidebar({
                                modules,
                                activeLessonId,
                                onSelectLesson,
                                isEnrolled = true,
                              }: Props) {
  const totalLessons = modules.reduce((acc, m) => acc + m.lessons.length, 0)

  return (
    <>
      {/* Header */}
      <div className="px-4 py-3 border-b border-border/60 shrink-0">
        <p className="text-sm font-semibold">Содержание курса</p>
        <p className="text-xs text-muted-foreground mt-0.5">
          {modules.length} {modules.length === 1 ? "модуль" : modules.length < 5 ? "модуля" : "модулей"}
          {" · "}
          {totalLessons} {totalLessons === 1 ? "урок" : totalLessons < 5 ? "урока" : "уроков"}
        </p>
      </div>

      {/* List */}
      <ScrollArea className="flex-1">
        {modules.length === 0 ? (
          <div className="flex flex-col items-center gap-2 py-12 text-muted-foreground">
            <BookOpen className="h-8 w-8 opacity-20" />
            <p className="text-xs">Модули не добавлены</p>
          </div>
        ) : (
          modules.map(module => (
            <ModuleAccordion
              key={module.id}
              module={module}
              activeLessonId={activeLessonId}
              isEnrolled={isEnrolled}
              onSelectLesson={onSelectLesson}
            />
          ))
        )}
      </ScrollArea>
    </>
  )
}