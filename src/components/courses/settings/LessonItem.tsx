'use client'

import { useState, useTransition, useRef, useEffect } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { toast } from "sonner"
import {
  Pencil, Trash2, Loader2, Eye, GripVertical,
  Video, FileText, Play, Upload, MoreVertical,
  BookOpen, Code, File,
} from "lucide-react"

import { LessonsService } from "@/services/lessons-service"
import { UpdateLessonRequest } from "@/schemas/lessons-schema"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import {
  DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import {
  AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent,
  AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle,
} from "@/components/ui/alert-dialog"
import { LessonForm } from "./LessonForm"
import { subscribeToVideoProgress } from "@/services/subscribe-to-video-progress"
import { LessonTitle } from "@/schemas/modules-schema"
import {useLocale} from "next-intl";
import {useRouter} from "@/i18n/navigation";

const TYPE_ICONS: Record<string, React.ElementType> = {
  VIDEO: Video,
  TEXT: FileText,
  QUIZ: BookOpen,
  PRACTICE: Code,
  FILE: File,
}

const STATUS_COLOR: Record<string, string> = {
  DONE: "text-green-600",
  TRANSCODING: "text-amber-500",
  PROCESSING: "text-amber-500",
  UPLOADED: "text-blue-500",
  UPLOADED_HLS: "text-blue-400",
  FAILED: "text-red-500",
}

const STATUS_LABEL: Record<string, string> = {
  DONE: "Готово",
  TRANSCODING: "Транскодирование",
  PROCESSING: "Обработка",
  UPLOADED: "Загружено",
  UPLOADED_HLS: "HLS готов",
  FAILED: "Ошибка",
}

const PROCESSING_STATUSES = [
  "PROCESSING",
  "TRANSCODING",
  "UPLOADED",
  "UPLOADED_HLS",
]

interface Props {
  lesson: LessonTitle
  onUpdated: () => void
  courseSlug: string
}

export function LessonItem({ lesson, onUpdated, courseSlug }: Props) {
  const router = useRouter()
  const [editing, setEditing] = useState(false)
  const [deleteOpen, setDeleteOpen] = useState(false)
  const [socketData, setSocketData] = useState<{ status: any; progress: number | null } | null>(null)

  const [isPending, startTransition] = useTransition()
  const [isDeleting, startDelete] = useTransition()
  const fileRef = useRef<HTMLInputElement>(null)

  const currentStatus = socketData?.status ?? lesson.video_status ?? "PENDING"
  const currentProgress = socketData?.progress ?? 0

  const isVideoProcessing =
    lesson.type === "VIDEO" &&
    PROCESSING_STATUSES.includes(currentStatus)

  useEffect(() => {
    if (!isVideoProcessing) return

    const close = subscribeToVideoProgress(
      lesson.lesson_id.toString(),
      "LESSON",
      (data) => {
        setSocketData({
          status: data.status,
          progress: data.progress,
        })

        if (data.status === "DONE" || data.status === "FAILED") {
          setTimeout(() => setSocketData(null), 2000)
          onUpdated()
        }
      }
    )

    return () => {
      close()
    }
  }, [isVideoProcessing, lesson.lesson_id, onUpdated])

  const handleVideoUpload = async (file: File) => {
    try {
      await LessonsService.uploadVideo(lesson.lesson_id, file)
      toast.success("Видео загружено, начинается обработка...")
      setSocketData({ status: "PROCESSING", progress: 0 }) // мгновенный UI
    } catch {
      toast.error("Ошибка загрузки видео")
    }
  }

  const TypeIcon = TYPE_ICONS[lesson.type] ?? FileText

  return (
    <div className="rounded-lg border bg-muted/20 overflow-hidden">
      <div className="flex items-center gap-2 px-3 py-2.5">
        <GripVertical className="h-3.5 w-3.5 text-muted-foreground/30 cursor-grab" />

        <TypeIcon className="h-3.5 w-3.5 text-muted-foreground" />

        <span className="flex-1 text-sm font-medium truncate">
          {lesson.title}
        </span>

        <div className="hidden sm:flex items-center gap-1.5">
          {lesson.is_free_preview && (
            <Badge variant="secondary" className="text-[10px] gap-1 h-5 px-1.5">
              <Eye className="h-2.5 w-2.5" />Free
            </Badge>
          )}

          {isVideoProcessing && (
            <span className={`text-[10px] font-medium ${STATUS_COLOR[currentStatus]}`}>
              {STATUS_LABEL[currentStatus] ?? currentStatus}
              {currentProgress > 0 && ` • ${Math.round(currentProgress)}%`}
            </span>
          )}

          {currentStatus === "DONE" && lesson.type === "VIDEO" && (
            <Button onClick={() => router.push(`/courses/${courseSlug}/learn/${lesson.lesson_id}`)} variant={'ghost'} className="text-primary hover:text-primary-foreground">
              <Play className="h-3 w-3 "  />
            </Button>
          )}
        </div>

        {isVideoProcessing && currentProgress > 0 && (
          <div className="w-16 h-1 bg-muted rounded-full overflow-hidden">
            <div
              className="h-full bg-primary transition-all"
              style={{ width: `${currentProgress}%` }}
            />
          </div>
        )}

        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" size="icon" className="h-7 w-7">
              <MoreVertical className="h-3.5 w-3.5" />
            </Button>
          </DropdownMenuTrigger>

          <DropdownMenuContent align="end" className="w-44">
            <DropdownMenuItem onClick={() => setEditing(!editing)}>
              <Pencil className="h-3.5 w-3.5 mr-2" />
              Редактировать
            </DropdownMenuItem>

            {lesson.type === "VIDEO" && (
              <DropdownMenuItem
                onClick={() => fileRef.current?.click()}
                disabled={isVideoProcessing}
              >
                {isVideoProcessing ? (
                  <>
                    <Loader2 className="h-3.5 w-3.5 mr-2 animate-spin" />
                    Обработка...
                  </>
                ) : (
                  <>
                    <Upload className="h-3.5 w-3.5 mr-2" />
                    {lesson.content_url ? "Заменить видео" : "Загрузить видео"}
                  </>
                )}
              </DropdownMenuItem>
            )}

            <DropdownMenuItem
              className="text-destructive"
              onClick={() => setDeleteOpen(true)}
            >
              <Trash2 className="h-3.5 w-3.5 mr-2" />
              Удалить
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>

        <input
          ref={fileRef}
          type="file"
          accept="video/*"
          className="sr-only"
          onChange={(e) => {
            const file = e.target.files?.[0]
            if (file) handleVideoUpload(file)
            e.target.value = ""
          }}
        />
      </div>

      <AnimatePresence>
        {editing && (
          <motion.div initial={{ height: 0 }} animate={{ height: "auto" }} exit={{ height: 0 }}>
            <Separator />
            <div className="p-3">
              <LessonForm
                defaultValues={{
                  title: lesson.title,
                  type: lesson.type,
                  content_text: lesson.content_text ?? undefined,
                  is_free_preview: lesson.is_free_preview,
                }}
                onSubmit={async (data) => {
                  startTransition(async () => {
                    try {
                      await LessonsService.update(
                        lesson.lesson_id,
                        data as UpdateLessonRequest
                      )
                      toast.success("Урок обновлён")
                      setEditing(false)
                      onUpdated()
                    } catch {
                      toast.error("Ошибка обновления")
                    }
                  })
                }}
                onCancel={() => setEditing(false)}
                isPending={isPending}
                submitLabel="Сохранить"
              />
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <AlertDialog open={deleteOpen} onOpenChange={setDeleteOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Удалить урок?</AlertDialogTitle>
            <AlertDialogDescription>
              Урок «{lesson.title}» будет удалён.
            </AlertDialogDescription>
          </AlertDialogHeader>

          <AlertDialogFooter>
            <AlertDialogCancel>Отмена</AlertDialogCancel>

            <AlertDialogAction
              onClick={() => {
                startDelete(async () => {
                  try {
                    await LessonsService.delete(lesson.lesson_id)
                    toast.success("Удалено")
                    onUpdated()
                  } catch {
                    toast.error("Ошибка удаления")
                  }
                })
              }}
            >
              {isDeleting ? <Loader2 className="animate-spin" /> : "Удалить"}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  )
}