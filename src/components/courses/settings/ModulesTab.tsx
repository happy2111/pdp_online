'use client'

import { useState, useEffect, useTransition } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { toast } from "sonner"
import { BookOpen, Plus, X, Loader2 } from "lucide-react"

import { ModulesService } from "@/services/modules-service"
import { CourseModule, CreateModuleRequest } from "@/schemas/modules-schema"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"

import { ModuleForm } from "./ModuleForm"
import { ModuleCard } from "./ModuleCard"
import {useTranslations} from "next-intl";

interface Props {
  slug: string
  courseId: number
}

export default function ModulesTab({ slug, courseId }: Props) {
  const t  = useTranslations()

  const [modules, setModules] = useState<CourseModule[]>([])
  const [loading, setLoading] = useState(true)
  const [showCreate, setShowCreate] = useState(false)
  const [isPending, startTransition] = useTransition()

  const loadModules = async () => {
    try {
      const res = await ModulesService.getCourseModules(slug)
      setModules(res.data ?? [])
    } catch {
      toast.error(t("modules.load_error"))
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
        toast.success(t("modules.create_success"))
        setShowCreate(false)
        await loadModules()
      } catch {
        toast.error(t("modules.create_error"))
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
    <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} className="space-y-4">

      <Card className="border bg-card/60 backdrop-blur-sm">
        <CardHeader className="pb-4">
          <div className="flex items-center justify-between gap-2">
            <CardTitle className="flex items-center gap-2 text-base sm:text-lg">
              <BookOpen className="h-4 w-4 text-primary" />
              {t("modules.title")}
              <Badge variant="secondary">{modules.length}</Badge>
            </CardTitle>
            <Button
              size="sm"
              variant={showCreate ? "outline" : "default"}
              onClick={() => setShowCreate(!showCreate)}
              className="gap-1.5 shrink-0"
            >
              {showCreate ? (
                <>
                  <X className="h-3.5 w-3.5" />
                  <span className="hidden sm:inline">{t("common.cancel")}</span>
                </>
              ) : (
                <>
                  <Plus className="h-3.5 w-3.5" />
                  <span className="hidden sm:inline">{t("modules.add_module")}</span>
                </>
              )}
            </Button>
          </div>
        </CardHeader>

        <AnimatePresence>
          {showCreate && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: "auto", opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
            >
              <Separator />
              <CardContent className="pt-5">
                <ModuleForm
                  onSubmit={handleCreate}
                  onCancel={() => setShowCreate(false)}
                  isPending={isPending}
                  submitLabel={t("modules.create_module")}
                />
              </CardContent>
            </motion.div>
          )}
        </AnimatePresence>
      </Card>

      {modules.length === 0 ? (
        <div className="flex flex-col items-center justify-center gap-3 rounded-xl border border-dashed py-14 text-center text-muted-foreground">
          <BookOpen className="h-10 w-10 opacity-30" />
          <p className="text-sm">{t("modules.no_modules_yet")}</p>
          <Button variant="outline" size="sm" onClick={() => setShowCreate(true)}>
            <Plus className="mr-2 h-3.5 w-3.5" />
            {t("modules.create_first_module")}
          </Button>
        </div>
      ) : (
        <div className="space-y-3">
          <AnimatePresence mode="popLayout">
            {modules.map((module) => (
              <ModuleCard
                courseSlug={slug}
                key={module.id}
                module={module}
                onUpdated={loadModules}
              />
            ))}
          </AnimatePresence>
        </div>
      )}
    </motion.div>
  )
}