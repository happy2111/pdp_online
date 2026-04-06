'use client'

import { useState, useTransition } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { toast } from "sonner"
import {
  ChevronDown, ChevronUp, Eye, GripVertical,
  Loader2, Pencil, Plus, Trash2, X, Lock,
} from "lucide-react"

import { ModulesService } from "@/services/modules-service"
import { LessonsService } from "@/services/lessons-service"
import {
  CourseModule, CreateModuleRequest, UpdateModuleRequest, UpdateModuleSchema,
} from "@/schemas/modules-schema"
import { CreateLessonRequest } from "@/schemas/lessons-schema"

import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import {
  AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent,
  AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle,
} from "@/components/ui/alert-dialog"

import { ModuleForm } from "./ModuleForm"
import { LessonForm } from "./LessonForm"
import { LessonItem } from "./LessonItem"

interface Props {
  module: CourseModule
  onUpdated: () => void
  courseSlug: string
}

export function ModuleCard({ module, onUpdated, courseSlug }: Props) {
  const [expanded, setExpanded]       = useState(false)
  const [editing, setEditing]         = useState(false)
  const [addingLesson, setAddingLesson] = useState(false)
  const [deleteOpen, setDeleteOpen]   = useState(false)

  const [isPending, startTransition]     = useTransition()
  const [isDeleting, startDelete]        = useTransition()
  const [isCreating, startCreateLesson]  = useTransition()

  const handleUpdate = async (data: CreateModuleRequest) => {
    startTransition(async () => {
      try {
        await ModulesService.updateModule(module.id, data as UpdateModuleRequest)
        toast.success("Модуль обновлён")
        setEditing(false)
        onUpdated()
      } catch {
        toast.error("Не удалось обновить модуль")
      }
    })
  }

  const handleDelete = () => {
    startDelete(async () => {
      try {
        await ModulesService.deleteModule(module.id)
        toast.success("Модуль удалён")
        onUpdated()
      } catch {
        toast.error("Нельзя удалить модуль с уроками")
      }
    })
  }

  const handleCreateLesson = async (data: CreateLessonRequest) => {
    startCreateLesson(async () => {
      try {
        await LessonsService.create(module.id, data)
        toast.success("Урок создан")
        setAddingLesson(false)
        onUpdated()
      } catch {
        toast.error("Ошибка при создании урока")
      }
    })
  }

  const lessonCount = module.lessons.length

  return (
    <motion.div
      layout
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -8 }}
      className="rounded-xl border bg-card overflow-hidden"
    >
      {/* ── Header ── */}
      <div className="flex items-center gap-2 sm:gap-3 px-3 sm:px-4 py-3">
        <GripVertical className="h-4 w-4 text-muted-foreground/30 shrink-0 cursor-grab hidden sm:block" />

        <button
          type="button"
          onClick={() => { setExpanded(v => !v); setEditing(false) }}
          className="flex-1 flex items-center gap-2 sm:gap-3 text-left min-w-0"
        >
          <span className="flex h-6 w-6 sm:h-7 sm:w-7 shrink-0 items-center justify-center rounded-full bg-primary/10 text-xs font-semibold text-primary">
            {module.sort_order}
          </span>
          <span className="flex-1 font-medium text-sm sm:text-base truncate">{module.title}</span>

          <div className="flex items-center gap-1.5 shrink-0">
            {module.is_free_preview && (
              <Badge variant="secondary" className="hidden sm:flex gap-1 text-xs">
                <Eye className="h-3 w-3" />Бесплатно
              </Badge>
            )}
            <Badge variant="outline" className="text-xs whitespace-nowrap">
              {lessonCount} {lessonCount === 1 ? "урок" : lessonCount < 5 ? "урока" : "уроков"}
            </Badge>
            {expanded
              ? <ChevronUp className="h-4 w-4 text-muted-foreground" />
              : <ChevronDown className="h-4 w-4 text-muted-foreground" />
            }
          </div>
        </button>

        {/* Module actions */}
        <div className="flex gap-0.5 shrink-0">
          <Button
            variant="ghost" size="icon" className="h-8 w-8"
            onClick={() => { setEditing(!editing); setExpanded(true) }}
          >
            <Pencil className="h-3.5 w-3.5" />
          </Button>
          <Button
            variant="ghost" size="icon" className="h-8 w-8 text-destructive"
            onClick={() => setDeleteOpen(true)}
          >
            {isDeleting
              ? <Loader2 className="h-3.5 w-3.5 animate-spin" />
              : <Trash2 className="h-3.5 w-3.5" />
            }
          </Button>
        </div>
      </div>

      {/* ── Expanded body ── */}
      <AnimatePresence initial={false}>
        {expanded && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            className="overflow-hidden"
          >
            <Separator />
            <div className="px-3 sm:px-4 py-4 space-y-4">

              {/* Edit form */}
              <AnimatePresence initial={false}>
                {editing && (
                  <motion.div
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: "auto", opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    className="overflow-hidden"
                  >
                    <div className="rounded-lg border bg-muted/30 p-3 sm:p-4">
                      <p className="text-xs font-medium text-muted-foreground mb-3 uppercase tracking-wide">
                        Редактировать модуль
                      </p>
                      <ModuleForm
                        defaultValues={{
                          title:         module.title,
                          description:   module.description ?? undefined,
                          isFreePreview: module.is_free_preview,
                        }}
                        onSubmit={handleUpdate}
                        onCancel={() => setEditing(false)}
                        isPending={isPending}
                        submitLabel="Сохранить"
                        schema={UpdateModuleSchema}
                      />
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>

              {/* Description */}
              {!editing && module.description && (
                <p className="text-sm text-muted-foreground">{module.description}</p>
              )}

              {/* ── Lessons section ── */}
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <p className="text-xs font-medium text-muted-foreground uppercase tracking-wide">
                    Уроки
                  </p>
                  <Button
                    variant="ghost" size="sm" className="h-7 text-xs gap-1.5"
                    onClick={() => setAddingLesson(v => !v)}
                  >
                    {addingLesson
                      ? <><X className="h-3 w-3" />Отмена</>
                      : <><Plus className="h-3 w-3" />Добавить урок</>
                    }
                  </Button>
                </div>

                {/* New lesson form */}
                <AnimatePresence initial={false}>
                  {addingLesson && (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: "auto", opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      className="overflow-hidden"
                    >
                      <div className="rounded-lg border border-dashed bg-muted/20 p-3">
                        <LessonForm
                          onSubmit={handleCreateLesson}
                          onCancel={() => setAddingLesson(false)}
                          isPending={isCreating}
                          submitLabel="Создать урок"
                        />
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>

                {/* Lesson list */}
                {module.lessons.length > 0 ? (
                  <div className="space-y-1.5">
                    <AnimatePresence mode="popLayout">
                      {module.lessons.map((lesson) => (
                        <motion.div
                          key={lesson.lesson_id}
                          layout
                          initial={{ opacity: 0, x: -8 }}
                          animate={{ opacity: 1, x: 0 }}
                          exit={{ opacity: 0, x: -8 }}
                        >
                          <LessonItem
                            lesson={lesson as any}
                            onUpdated={onUpdated}
                            courseSlug={courseSlug}
                          />
                        </motion.div>
                      ))}
                    </AnimatePresence>
                  </div>
                ) : !addingLesson ? (
                  <button
                    type="button"
                    onClick={() => setAddingLesson(true)}
                    className="w-full flex flex-col items-center gap-2 rounded-lg border border-dashed py-6 text-center text-muted-foreground hover:bg-muted/20 transition-colors"
                  >
                    <Lock className="h-5 w-5 opacity-30" />
                    <span className="text-xs">Уроков пока нет — нажмите, чтобы добавить</span>
                  </button>
                ) : null}
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Delete dialog */}
      <AlertDialog open={deleteOpen} onOpenChange={setDeleteOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Удалить модуль?</AlertDialogTitle>
            <AlertDialogDescription>
              Модуль «{module.title}» будет удалён навсегда. Это действие нельзя отменить.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Отмена</AlertDialogCancel>
            <AlertDialogAction onClick={handleDelete} className="bg-destructive hover:bg-destructive/90">
              Удалить
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </motion.div>
  )
}