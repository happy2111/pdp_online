'use client'

import { useContext } from "react"
import { LessonContent } from "./LessonContent"
import { LearnContext } from "./LearnContext"

interface Props {
  lessonId: number
}

export function LessonPageClient({ lessonId }: Props) {
  const { modules, isEnrolled, slug } = useContext(LearnContext)

  const allLessons = modules.flatMap(m => m.lessons)
  const lesson = allLessons.find(l => l.lesson_id === lessonId) ?? null

  return (
    <LessonContent
      lesson={lesson}
      allLessons={allLessons}
      isEnrolled={isEnrolled}
    />
  )
}