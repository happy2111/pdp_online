'use client'

import { useRouter, useParams } from "next/navigation"
import { Play, FileText, Loader2, ChevronLeft, ChevronRight, Lock } from "lucide-react"

import { LessonTitle } from "@/schemas/modules-schema"
import { VideoPlayer } from "@/components/video-player"
import { Button } from "@/components/ui/button"
import { ScrollArea } from "@/components/ui/scroll-area"

interface Props {
  lesson: LessonTitle | null
  allLessons: LessonTitle[]
  isEnrolled: boolean
  slug: string
}

function VideoLesson({ lesson }: { lesson: LessonTitle }) {
  if (lesson.video_status !== "DONE" || !lesson.content_url) {
    return (
      <div className="w-full h-full flex flex-col items-center justify-center gap-3 bg-black text-white/60">
        <Loader2 className="h-8 w-8 animate-spin opacity-40" />
        <p className="text-sm">Видео обрабатывается, попробуйте позже</p>
      </div>
    )
  }

  return (
    <VideoPlayer
      slug={`lesson-${lesson.lesson_id}`}
      endpoint={`/api/v1/videos/lesson/stream/${lesson.lesson_id}/master.m3u8`}
    />
  )
}

function TextLesson({ lesson }: { lesson: LessonTitle }) {
  return (
    <ScrollArea className="h-full">
      <div className="max-w-3xl mx-auto px-6 sm:px-10 py-10">
        <h1 className="text-2xl font-semibold mb-6 leading-snug">{lesson.title}</h1>
        <div className="prose prose-sm sm:prose dark:prose-invert max-w-none text-foreground/80 leading-relaxed whitespace-pre-wrap">
          {lesson.content_text ?? (
            <p className="text-muted-foreground italic">Содержимое урока не добавлено.</p>
          )}
        </div>
      </div>
    </ScrollArea>
  )
}

function EmptyLesson() {
  return (
    <div className="h-full flex flex-col items-center justify-center gap-3 text-muted-foreground p-8">
      <Play className="h-12 w-12 opacity-15" />
      <p className="text-sm">Выберите урок из списка</p>
    </div>
  )
}

function LockedLesson() {
  return (
    <div className="h-full flex flex-col items-center justify-center gap-4 text-muted-foreground p-8">
      <div className="flex h-16 w-16 items-center justify-center rounded-full bg-muted">
        <Lock className="h-7 w-7 opacity-40" />
      </div>
      <div className="text-center space-y-1">
        <p className="text-sm font-medium text-foreground/70">Урок недоступен</p>
        <p className="text-xs">Купите курс, чтобы получить доступ</p>
      </div>
    </div>
  )
}

export function LessonContent({ lesson, allLessons, isEnrolled, slug }: Props) {
  const router = useRouter()
  const params = useParams<{ slug: string }>()

  if (!lesson) return <EmptyLesson />

  const isLocked = !isEnrolled && !lesson.is_free_preview
  if (isLocked) return <LockedLesson />

  const activeIndex = allLessons.findIndex(l => l.lesson_id === lesson.lesson_id)
  const prevLesson = activeIndex > 0 ? allLessons[activeIndex - 1] : null
  const nextLesson = activeIndex < allLessons.length - 1 ? allLessons[activeIndex + 1] : null

  const canGo = (l: LessonTitle | null) =>
    !!l && (isEnrolled || l.is_free_preview)

  const go = (l: LessonTitle) =>
    router.push(`/courses/${params.slug}/learn/${l.lesson_id}`)

  return (
    <div className="flex flex-col h-full overflow-hidden">

      {/* ── Content ── */}
      <div className={`flex-1 overflow-hidden ${lesson.type === "VIDEO" ? "bg-black" : "bg-background"}`}>
        {lesson.type === "VIDEO"  && <VideoLesson lesson={lesson} />}
        {lesson.type === "TEXT"   && <TextLesson lesson={lesson} />}
        {lesson.type !== "VIDEO" && lesson.type !== "TEXT" && (
          <div className="h-full flex flex-col items-center justify-center gap-3 text-muted-foreground p-8">
            <FileText className="h-10 w-10 opacity-20" />
            <p className="text-sm">Этот формат урока скоро будет поддержан</p>
          </div>
        )}
      </div>

      {/* ── Prev / Next ── */}
      <div className="shrink-0 border-t border-border/60 bg-background px-4 py-2.5 flex items-center justify-between gap-4">
        <Button
          variant="ghost"
          size="sm"
          className="gap-1.5 text-sm min-w-0 max-w-[40%]"
          disabled={!canGo(prevLesson)}
          onClick={() => prevLesson && go(prevLesson)}
        >
          <ChevronLeft className="h-4 w-4 shrink-0" />
          <span className="truncate hidden sm:block">{prevLesson?.title ?? "—"}</span>
          <span className="sm:hidden">Назад</span>
        </Button>

        <span className="text-xs text-muted-foreground shrink-0 tabular-nums">
          {activeIndex + 1} / {allLessons.length}
        </span>

        <Button
          variant="ghost"
          size="sm"
          className="gap-1.5 text-sm min-w-0 max-w-[40%]"
          disabled={!canGo(nextLesson)}
          onClick={() => nextLesson && go(nextLesson)}
        >
          <span className="truncate hidden sm:block">{nextLesson?.title ?? "—"}</span>
          <span className="sm:hidden">Далее</span>
          <ChevronRight className="h-4 w-4 shrink-0" />
        </Button>
      </div>
    </div>
  )
}