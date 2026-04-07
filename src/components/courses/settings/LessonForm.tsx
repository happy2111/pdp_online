'use client'

import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { Loader2, AlertCircle, Save, X, Video, FileText, BookOpen, Code, File } from "lucide-react"

import { CreateLessonRequest, CreateLessonRequestSchema } from "@/schemas/lessons-schema"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import { Switch } from "@/components/ui/switch"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { useTranslations } from "next-intl"

const LESSON_TYPES = [
  { value: "VIDEO",    labelKey: "lessons.types.video",     icon: Video },
  { value: "TEXT",     labelKey: "lessons.types.text",      icon: FileText },
  { value: "QUIZ",     labelKey: "lessons.types.quiz",      icon: BookOpen },
  { value: "PRACTICE", labelKey: "lessons.types.practice",  icon: Code },
  { value: "FILE",     labelKey: "lessons.types.file",      icon: File },
] as const

interface Props {
  defaultValues?: Partial<CreateLessonRequest>
  onSubmit: (data: CreateLessonRequest) => Promise<void>
  onCancel: () => void
  isPending: boolean
  submitLabel: string
}

export function LessonForm({ defaultValues, onSubmit, onCancel, isPending, submitLabel }: Props) {
  const t = useTranslations()   // ← next-intl

  const { register, handleSubmit, setValue, watch, formState: { errors } } =
    useForm<CreateLessonRequest>({
      resolver: zodResolver(CreateLessonRequestSchema),
      defaultValues: { type: "VIDEO", is_free_preview: false, ...defaultValues },
    })

  const is_free_preview = watch("is_free_preview")
  const type = watch("type")

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-3 pt-1">
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        <div className="space-y-1.5">
          <Label>{t("lessons.form.title")}</Label>
          <Input
            {...register("title")}
            placeholder={t("lessons.form.title_placeholder")}
            className="h-9"
          />
          {errors.title && (
            <p className="flex items-center gap-1 text-xs text-destructive">
              <AlertCircle className="h-3 w-3" />
              {errors.title.message}
            </p>
          )}
        </div>

        <div className="space-y-1.5">
          <Label>{t("lessons.form.type")}</Label>
          <Select value={type} onValueChange={(v) => setValue("type", v as CreateLessonRequest["type"])}>
            <SelectTrigger className="h-9">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {LESSON_TYPES.map(({ value, labelKey, icon: Icon }) => (
                <SelectItem key={value} value={value}>
                  <span className="flex items-center gap-2">
                    <Icon className="h-3.5 w-3.5" />
                    {t(labelKey)}
                  </span>
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>

      {type === "TEXT" && (
        <div className="space-y-1.5">
          <Label>{t("lessons.form.content_text")}</Label>
          <Textarea
            {...register("content_text")}
            rows={3}
            placeholder={t("lessons.form.content_text_placeholder")}
            className="resize-none text-sm"
          />
        </div>
      )}

      <div className="flex items-center gap-3">
        <Switch
          id="lesson-fp"
          checked={!!is_free_preview}
          onCheckedChange={(v) => setValue("is_free_preview", v)}
        />
        <Label htmlFor="lesson-fp" className="cursor-pointer text-sm">
          {t("modules.form.free_preview")}   {/* можно вынести в common, но пока используем существующий */}
        </Label>
      </div>

      <div className="flex gap-2">
        <Button type="submit" size="sm" disabled={isPending} className="gap-1.5">
          {isPending ? (
            <Loader2 className="h-3.5 w-3.5 animate-spin" />
          ) : (
            <Save className="h-3.5 w-3.5" />
          )}
          {submitLabel}
        </Button>

        <Button
          type="button"
          variant="ghost"
          size="sm"
          onClick={onCancel}
          className="gap-1.5"
        >
          <X className="h-3.5 w-3.5" />
          {t("common.cancel")}
        </Button>
      </div>
    </form>
  )
}