'use client'

import { useState, useEffect, useTransition } from "react"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { motion, AnimatePresence } from "framer-motion"
import { toast } from "sonner"
import {
  BookOpen, Plus, Pencil, Trash2, ChevronDown,
  ChevronUp, Loader2, AlertCircle, Eye,
  GripVertical, Save, X,
} from "lucide-react"
import { z } from "zod"

import { ModulesService } from "@/services/modules-service"
import {
  CourseModule,
  CreateModuleRequest,
  CreateModuleSchema,
  UpdateModuleRequest,
  UpdateModuleSchema,
} from "@/schemas/modules-schema"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import { Switch } from "@/components/ui/switch"
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog"

// ─── Props ────────────────────────────────────────────────────────────────────
interface Props {
  slug: string
  courseId: number
}

// ─── Module Form ──────────────────────────────────────────────────────────────
interface ModuleFormProps {
  defaultValues?: Partial<CreateModuleRequest>
  onSubmit: (data: CreateModuleRequest) => Promise<void>
  onCancel: () => void
  isPending: boolean
  submitLabel: string,
  schema?: z.ZodSchema
}

function ModuleForm({
                      defaultValues,
                      onSubmit,
                      onCancel,
                      isPending,
                      submitLabel,
                      schema = CreateModuleSchema
                    }: ModuleFormProps) {
  const { register, handleSubmit, setValue, watch, reset, formState: { errors } } =
    useForm<CreateModuleRequest>({
      resolver: zodResolver(schema as any),
      defaultValues: { isFreePreview: false, ...defaultValues },
    })

  useEffect(() => {
    if (defaultValues) {
      reset({ isFreePreview: false, ...defaultValues })
    }
  }, [])

  const isFreePreview = watch("isFreePreview")

  const handleFormSubmit = handleSubmit(
    (data) => onSubmit(data as CreateModuleRequest),
    (errs) => console.error("Validation errors:", errs)
  )

  return (
    <form onSubmit={handleFormSubmit} className="space-y-4">
      <div className="space-y-2">
        <Label htmlFor="module-title">Название модуля</Label>
        <Input
          id="module-title"
          {...register("title")}
          placeholder="Например: Введение в React"
          className="h-11"
        />
        {errors.title && (
          <p className="flex items-center gap-1 text-xs text-destructive">
            <AlertCircle className="h-3 w-3" />
            {errors.title.message}
          </p>
        )}
      </div>

      <div className="space-y-2">
        <Label htmlFor="module-desc">
          Описание <span className="text-muted-foreground">(необязательно)</span>
        </Label>
        <Textarea
          id="module-desc"
          {...register("description")}
          rows={3}
          placeholder="Краткое описание модуля..."
          className="resize-none"
        />
      </div>

      <div className="flex items-center gap-3">
        <Switch
          id="free-preview"
          checked={!!isFreePreview}
          onCheckedChange={(v) => setValue("isFreePreview", v)}
        />
        <Label htmlFor="free-preview" className="cursor-pointer">
          Бесплатный предпросмотр
        </Label>
      </div>

      <div className="flex gap-2 pt-1">
        <Button type="submit" size="sm" disabled={isPending} className="gap-1.5">
          {isPending ? <Loader2 className="h-3.5 w-3.5 animate-spin" /> : <Save className="h-3.5 w-3.5" />}
          {submitLabel}
        </Button>
        <Button type="button" variant="ghost" size="sm" onClick={onCancel} className="gap-1.5">
          <X className="h-3.5 w-3.5" />
          Отмена
        </Button>
      </div>
    </form>
  )
}

// ─── Module Card ──────────────────────────────────────────────────────────────
interface ModuleCardProps {
  module: CourseModule
  onUpdated: () => void
}

function ModuleCard({ module, onUpdated }: ModuleCardProps) {
  const [expanded, setExpanded] = useState(false)
  const [editing, setEditing] = useState(false)
  const [isPending, startTransition] = useTransition()
  const [isDeleting, startDelete] = useTransition()

  const handleUpdate = async (data: CreateModuleRequest) => {
    startTransition(async () => {
      try {
        const updateData: UpdateModuleRequest = {
          title: data.title,
          description: data.description,
          isFreePreview: data.isFreePreview,
        }

        await ModulesService.updateModule(module.id, updateData)
        toast.success("Модуль успешно обновлён")
        setEditing(false)
        onUpdated()           // ← Важно: перезагружаем список
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
        toast.error("Нельзя удалить модуль, в котором есть уроки")
      }
    })
  }

  return (
    <motion.div
      layout
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -8 }}
      className="rounded-xl border bg-card/60 backdrop-blur-sm overflow-hidden"
    >
      <div className="flex items-center gap-3 px-4 py-3">
        <GripVertical className="h-4 w-4 text-muted-foreground/40 shrink-0 cursor-grab" />

        <button
          type="button"
          onClick={() => setExpanded((v) => !v)}
          className="flex-1 flex items-center gap-3 text-left min-w-0"
        >
          <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-primary/10 text-xs font-semibold text-primary">
            {module.sort_order}
          </span>
          <span className="flex-1 font-medium truncate">{module.title}</span>

          <div className="flex items-center gap-2 shrink-0">
            {module.is_free_preview && (
              <Badge variant="secondary" className="gap-1 text-xs">
                <Eye className="h-3 w-3" /> Бесплатно
              </Badge>
            )}
            <Badge variant="outline" className="text-xs">
              {module.lessons.length} {module.lessons.length === 1 ? "урок" : "уроков"}
            </Badge>
            {expanded ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />}
          </div>
        </button>

        <div className="flex gap-1">
          <Button variant="ghost" size="icon" className="h-8 w-8" onClick={() => setEditing(!editing)}>
            <Pencil className="h-3.5 w-3.5" />
          </Button>

          <AlertDialog>
            <AlertDialogTrigger asChild>
              <Button variant="ghost" size="icon" className="h-8 w-8 text-destructive">
                {isDeleting ? <Loader2 className="animate-spin" /> : <Trash2 className="h-3.5 w-3.5" />}
              </Button>
            </AlertDialogTrigger>
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
        </div>
      </div>

      <AnimatePresence initial={false}>
        {expanded && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            className="overflow-hidden"
          >
            <Separator />
            <div className="px-4 py-4 space-y-4">
              {editing ? (
                <ModuleForm
                  defaultValues={{
                    title: module.title,
                    description: module.description ?? undefined,
                    isFreePreview: module.is_free_preview,
                  }}
                  onSubmit={handleUpdate}
                  onCancel={() => setEditing(false)}
                  isPending={isPending}
                  submitLabel="Сохранить изменения"
                  schema={UpdateModuleSchema}
                />
              ) : (
                <>
                  {module.description && (
                    <p className="text-sm text-muted-foreground">{module.description}</p>
                  )}

                  {module.lessons.length > 0 ? (
                    <ul className="space-y-1.5">
                      {module.lessons.map((lesson, i) => (
                        <li key={lesson.lesson_id} className="flex items-center gap-2.5 rounded-lg px-3 py-2 text-sm bg-muted/30">
                          <span className="text-xs text-muted-foreground w-5">{i + 1}.</span>
                          <span>{lesson.title}</span>
                        </li>
                      ))}
                    </ul>
                  ) : (
                    <p className="text-sm text-muted-foreground italic">Уроков пока нет</p>
                  )}
                </>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  )
}

// ─── Main Component ───────────────────────────────────────────────────────────
export default function ModulesTab({ slug, courseId }: Props) {
  const [modules, setModules] = useState<CourseModule[]>([])
  const [loading, setLoading] = useState(true)
  const [showCreateForm, setShowCreateForm] = useState(false)
  const [isPending, startTransition] = useTransition()

  const loadModules = async () => {
    try {
      const res = await ModulesService.getCourseModules(slug)
      setModules(res.data ?? [])
    } catch (err) {
      toast.error("Не удалось загрузить модули")
      console.error(err)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    loadModules()
  }, [slug])

  const handleCreate = async (data: CreateModuleRequest) => {
    startTransition(async () => {
      try {
        await ModulesService.createModule(courseId, data)
        toast.success("Модуль успешно создан")
        setShowCreateForm(false)
        await loadModules()        // ← await для гарантии обновления
      } catch {
        toast.error("Ошибка при создании модуля")
      }
    })
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center py-20">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    )
  }

  return (
    <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} className="space-y-5">
      <Card className="border bg-card/60 backdrop-blur-sm">
        <CardHeader className="pb-4">
          <div className="flex items-center justify-between">
            <CardTitle className="flex items-center gap-2 text-lg">
              <BookOpen className="h-4.5 w-4.5 text-primary" />
              Модули курса
              <Badge variant="secondary">{modules.length}</Badge>
            </CardTitle>

            <Button
              size="sm"
              variant={showCreateForm ? "outline" : "default"}
              onClick={() => setShowCreateForm(!showCreateForm)}
              className="gap-1.5"
            >
              {showCreateForm ? (
                <>
                  <X className="h-3.5 w-3.5" /> Отмена
                </>
              ) : (
                <>
                  <Plus className="h-3.5 w-3.5" /> Добавить модуль
                </>
              )}
            </Button>
          </div>
        </CardHeader>

        <AnimatePresence>
          {showCreateForm && (
            <motion.div initial={{ height: 0, opacity: 0 }} animate={{ height: "auto", opacity: 1 }} exit={{ height: 0, opacity: 0 }}>
              <Separator />
              <CardContent className="pt-5">
                <ModuleForm
                  onSubmit={handleCreate}
                  onCancel={() => setShowCreateForm(false)}
                  isPending={isPending}
                  submitLabel="Создать модуль"
                />
              </CardContent>
            </motion.div>
          )}
        </AnimatePresence>
      </Card>

      {modules.length === 0 ? (
        <div className="flex flex-col items-center justify-center gap-3 rounded-xl border border-dashed py-14 text-center text-muted-foreground">
          <BookOpen className="h-10 w-10 opacity-30" />
          <p>Модулей пока нет</p>
          <Button variant="outline" onClick={() => setShowCreateForm(true)}>
            <Plus className="mr-2 h-4 w-4" />
            Создать первый модуль
          </Button>
        </div>
      ) : (
        <div className="space-y-3">
          <AnimatePresence mode="popLayout">
            {modules.map((module) => (
              <ModuleCard key={module.id} module={module} onUpdated={loadModules} />
            ))}
          </AnimatePresence>
        </div>
      )}
    </motion.div>
  )
}