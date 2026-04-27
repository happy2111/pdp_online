'use client'

import { useState, useTransition, useRef, useEffect } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { toast } from "sonner"
import {
  Pencil, Trash2, Loader2, Eye, GripVertical,
  Video, FileText, Play, Upload, MoreVertical,
  BookOpen, Code, File, X, CheckCircle2
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
import { useRouter } from "@/i18n/navigation"
import { useTranslations } from "next-intl"
import { Progress } from "@/components/ui/progress"

const TYPE_ICONS: Record<string, React.ElementType> = {
  VIDEO: Video,
  TEXT: FileText,
  QUIZ: BookOpen,
  PRACTICE: Code,
  FILE: File,
}

interface Props {
  lesson: LessonTitle
  onUpdated: () => void
  courseSlug: string
}

export function LessonItem({ lesson, onUpdated, courseSlug }: Props) {
  const t = useTranslations()
  const router = useRouter()

  const [editing, setEditing] = useState(false)
  const [deleteOpen, setDeleteOpen] = useState(false)

  // Состояние сокета и локальной обработки
  const [socketData, setSocketData] = useState<{ status: string; progress: number | null, message: string | null } | null>(null)
  const [isProcessing, setIsProcessing] = useState(false)

  const [isPending, startTransition] = useTransition()
  const [isDeleting, startDelete] = useTransition()
  const fileRef = useRef<HTMLInputElement>(null)

  // 1. Логика определения: нужно ли слушать сокет?
  useEffect(() => {
    const status = lesson.video_status
    const isStillProcessing =
      status === 'PROCESSING' ||
      status === 'TRANSCODING' ||
      status === 'UPLOADED' ||
      status === 'UPLOADED_HLS'

    if (isStillProcessing) {
      setIsProcessing(true)
    }
  }, [lesson.video_status])

  useEffect(() => {
    let unsubscribe: (() => void) | undefined

    if (isProcessing) {
      unsubscribe = subscribeToVideoProgress(
        lesson.lesson_id.toString(),
        "LESSON",
        (data) => {
          setSocketData({
            status: data.status,
            progress: data.progress,
            message: data.message,
          })

          if (data.status === "DONE") {
            setIsProcessing(false)

            setTimeout(() => {
              onUpdated()
            }, 1000)

            setTimeout(() => setSocketData(null), 3000)
          }

          if (data.status === "FAILED") {
            setIsProcessing(false)
            onUpdated()
          }
        }
      )
    }
    return () => unsubscribe?.()
  }, [isProcessing, lesson.lesson_id, onUpdated])

  const handleVideoUpload = async (file: File) => {
    try {
      setIsProcessing(true)
      await LessonsService.uploadVideo(lesson.lesson_id, file)
      toast.success(t("lessons.video_upload_success"))
      // Устанавливаем начальное состояние до прихода первого сообщения из сокета
      setSocketData({ status: "UPLOADED", progress: 0, message: null })
    } catch {
      setIsProcessing(false)
      toast.error(t("lessons.video_upload_error"))
    }
  }

  // Рендеринг текста ошибок (как в VideoProcessingOverlay)
  const renderStatusMessage = () => {
    const status = socketData?.status || lesson.video_status
    const message = socketData?.message

    if (status === 'FAILED') {
      if (!message) return t('video.status.failed')
      if (message.includes(':')) {
        const [key, value] = message.split(':')
        return t(key, { minutes: value })
      }
      return t(message)
    }

    return t(`video.status.${status?.toLowerCase() || 'processing'}`)
  }

  const TypeIcon = TYPE_ICONS[lesson.type] ?? FileText
  const showProcessing = isProcessing || !!socketData

  return (
    <div className="rounded-lg border bg-muted/20 overflow-hidden relative">
      <div className="flex items-center gap-2 px-3 py-2.5">
        <GripVertical className="h-3.5 w-3.5 text-muted-foreground/30 cursor-grab" />

        <div className="relative">
          <TypeIcon className={`h-3.5 w-3.5 ${showProcessing ? 'text-primary animate-pulse' : 'text-muted-foreground'}`} />
        </div>

        <span className="flex-1 text-sm font-medium truncate">
          {lesson.title}
        </span>

        <div className="flex items-center gap-2">
          {lesson.is_free_preview && (
            <Badge variant="secondary" className="text-[10px] gap-1 h-5 px-1.5 hidden sm:flex">
              <Eye className="h-2.5 w-2.5" /> {t("common.free")}
            </Badge>
          )}

          {showProcessing && socketData && (
            <div className="flex items-center gap-2">
              <span className={`text-[10px] font-medium ${socketData.status === 'FAILED' ? 'text-red-500' : 'text-amber-500'}`}>
                {renderStatusMessage()}
                {socketData.status !== 'DONE' && typeof socketData.progress === 'number' && socketData.progress > 0 && (
                  ` • ${Math.round(socketData.progress)}%`
                )}
              </span>

              {socketData.status !== 'DONE' && typeof socketData.progress === 'number' && socketData.progress > 0 && (
                <Progress value={socketData.progress} className="w-12 h-1" />
              )}
            </div>
          )}

          {(lesson.video_status === "DONE" || socketData?.status === "DONE") && !isProcessing && (
            <Button
              onClick={() => router.push(`/courses/${courseSlug}/learn/${lesson.lesson_id}`)}
              variant="ghost"
              size="icon"
              className="h-7 w-7 text-primary"
            >
              <Play className="h-3 w-3" />
            </Button>
          )}


        </div>

        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" size="icon" className="h-7 w-7">
              <MoreVertical className="h-3.5 w-3.5" />
            </Button>
          </DropdownMenuTrigger>

          <DropdownMenuContent align="end" className="w-44">
            <DropdownMenuItem onClick={() => setEditing(!editing)}>
              <Pencil className="h-3.5 w-3.5 mr-2" />
              {t("common.edit")}
            </DropdownMenuItem>

            {lesson.type === "VIDEO" && (
              <DropdownMenuItem
                onClick={() => fileRef.current?.click()}
                disabled={showProcessing}
              >
                {showProcessing ? (
                  <>
                    <Loader2 className="h-3.5 w-3.5 mr-2 animate-spin" />
                    {t("lessons.processing")}
                  </>
                ) : (
                  <>
                    <Upload className="h-3.5 w-3.5 mr-2" />
                    {lesson.content_url ? t("lessons.replace_video") : t("lessons.upload_video")}
                  </>
                )}
              </DropdownMenuItem>
            )}

            <DropdownMenuItem className="text-destructive" onClick={() => setDeleteOpen(true)}>
              <Trash2 className="h-3.5 w-3.5 mr-2" />
              {t("common.delete")}
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

      {/* Оверлей статуса для завершения или ошибки (опционально) */}
      <AnimatePresence>
        {socketData && (socketData.status === 'DONE' || socketData.status === 'FAILED') && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="absolute inset-0 z-10 flex items-center justify-center bg-background/80 backdrop-blur-[1px] px-3"
          >
            <div className="flex items-center gap-2">
              {socketData.status === 'DONE' ? (
                <CheckCircle2 className="h-4 w-4 text-green-500" />
              ) : (
                <X className="h-4 w-4 text-red-500" />
              )}
              <span className="text-xs font-medium">{renderStatusMessage()}</span>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

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
                      await LessonsService.update(lesson.lesson_id, data as UpdateLessonRequest)
                      toast.success(t("lessons.update_success"))
                      setEditing(false)
                      onUpdated()
                    } catch {
                      toast.error(t("lessons.update_error"))
                    }
                  })
                }}
                onCancel={() => setEditing(false)}
                isPending={isPending}
                submitLabel={t("common.save")}
              />
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <AlertDialog open={deleteOpen} onOpenChange={setDeleteOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>{t("lessons.delete_confirm_title")}</AlertDialogTitle>
            <AlertDialogDescription>
              {t("lessons.delete_confirm_desc", { title: lesson.title })}
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>{t("common.cancel")}</AlertDialogCancel>
            <AlertDialogAction
              onClick={() => {
                startDelete(async () => {
                  try {
                    await LessonsService.delete(lesson.lesson_id)
                    toast.success(t("lessons.delete_success"))
                    onUpdated()
                  } catch {
                    toast.error(t("lessons.delete_error"))
                  }
                })
              }}
              className="bg-destructive hover:bg-destructive/90"
            >
              {isDeleting ? <Loader2 className="h-4 w-4 animate-spin" /> : t("common.delete")}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  )
}