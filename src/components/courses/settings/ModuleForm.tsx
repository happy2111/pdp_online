'use client'

import { useEffect } from "react"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { Loader2, AlertCircle, Save, X } from "lucide-react"
import { z } from "zod"

import { CreateModuleRequest, CreateModuleSchema } from "@/schemas/modules-schema"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import { useTranslations } from "next-intl"

interface Props {
  defaultValues?: Partial<CreateModuleRequest>
  onSubmit: (data: CreateModuleRequest) => Promise<void>
  onCancel: () => void
  isPending: boolean
  submitLabel: string
  schema?: z.ZodSchema
}

export function ModuleForm({
                             defaultValues,
                             onSubmit,
                             onCancel,
                             isPending,
                             submitLabel,
                             schema = CreateModuleSchema,
                           }: Props) {
  const t = useTranslations()

  const { register, handleSubmit, reset, formState: { errors } } =
    useForm<CreateModuleRequest>({
      resolver: zodResolver(schema as any),
      defaultValues: {...defaultValues },
    })

  useEffect(() => {
    if (defaultValues) {
      reset({...defaultValues })
    }
  }, [defaultValues, reset])


  return (
    <form onSubmit={handleSubmit((d) => onSubmit(d as CreateModuleRequest))} className="space-y-4">
      <div className="space-y-1.5">
        <Label>{t("modules.form.title")}</Label>
        <Input
          {...register("title")}
          placeholder={t("modules.form.title_placeholder")}
          className="h-10"
        />
        {errors.title && (
          <p className="flex items-center gap-1 text-xs text-destructive">
            <AlertCircle className="h-3 w-3" />
            {errors.title.message}
          </p>
        )}
      </div>

      <div className="space-y-1.5">
        <Label>
          {t("modules.form.description")}{" "}
          <span className="text-muted-foreground">
            ({t("modules.form.optional")})
          </span>
        </Label>
        <Textarea
          {...register("description")}
          rows={2}
          placeholder={t("modules.form.description_placeholder")}
          className="resize-none"
        />
      </div>


      <div className="flex gap-2 pt-1">
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