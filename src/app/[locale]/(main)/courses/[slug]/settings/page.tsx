'use client'

import { useState, useEffect, useTransition, useRef } from "react"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { useParams, useRouter } from "next/navigation"
import { useTranslations } from "next-intl"
import { motion } from "framer-motion"
import { toast } from "sonner"
import {
  ArrowLeft, Save, PencilLine, X, Loader2, Upload, Video, Image as ImageIcon,
  Plus, BookOpen, Tag, Globe, BarChart3, DollarSign, FileText,
  ChevronRight, CheckCircle2, AlertCircle, Play, Eye, PlayCircle,
  SendHorizonal, ShieldCheck,
} from "lucide-react"

import { CoursesService } from "@/services/courses-service"
import { CategoriesService } from "@/services/categories-service"
import {
  CreateCourseSchema, CreateCourseRequest, CourseDetails,
  CourseLevelEnum, CourseLevelLabels,
} from "@/schemas/courses-schema"
import { Category } from "@/schemas/categories-schema"
import { cn } from "@/lib/utils"
import { useAuthStore } from "@/stores/auth-store"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import {
  AlertDialog, AlertDialogAction, AlertDialogCancel,
  AlertDialogContent, AlertDialogDescription, AlertDialogFooter,
  AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger,
} from "@/components/ui/alert-dialog"
import Protected from "@/components/protecters/Protected"
import StringListEditor from "@/components/courses/settings/StringListEditor"
import ThumbnailUploadCard
  from "@/components/courses/settings/ThumbnailUploadCard";
import VideoPreviewCard from "@/components/courses/settings/VideoPreviewCard";
import SaveRow from "@/components/courses/settings/SaveRow";


const LANGUAGES = [
  { value: "uz", label: "O'zbek" },
  { value: "ru", label: "Русский" },
  { value: "en", label: "English" },
]




// ==========================================================
// // MAIN PAGE
// // ==============================================================
export default function CourseSettingsPage() {
  const { slug } = useParams<{ slug: string }>()
  const router = useRouter()
  const t = useTranslations()
  const isAuth = useAuthStore(state => state.isAuthenticated)

  const [course, setCourse] = useState<CourseDetails | null>(null)
  const [categories, setCategories] = useState<Category[]>([])
  const [isEditing, setIsEditing] = useState(false)
  const [isPending, startTransition] = useTransition()
  const [isPublishing, setIsPublishing] = useState(false)
  const [uploadingThumb, setUploadingThumb] = useState(false)
  const [uploadingVideo, setUploadingVideo] = useState(false)

  const { register, handleSubmit, reset, watch, setValue, formState: { errors, isDirty } } =
    useForm<CreateCourseRequest>({ resolver: zodResolver(CreateCourseSchema) })

  const requirements = watch("requirements") ?? []
  const outcomes = watch("learning_outcomes") ?? []
  const level = watch("level")

  // ── Load ─────────────────────────────────────────────────
  useEffect(() => {
    ;(async () => {
      try {
        const [courseRes, catRes] = await Promise.all([
          CoursesService.getCourseBySlug(slug),
          CategoriesService.getAllCategories(),
        ])
        if (courseRes.data) {
          setCourse(courseRes.data)
          reset({
            title: courseRes.data.title,
            short_description: courseRes.data.short_description,
            description: courseRes.data.description,
            level: courseRes.data.level,
            language: courseRes.data.language,
            category_id: courseRes.data.category_id,
            price: courseRes.data.price ?? undefined,
            requirements: courseRes.data.requirements,
            learning_outcomes: courseRes.data.learning_outcomes,
          })
        }
        if (catRes?.data?.data) {
          const flat: Category[] = []
          const flatten = (cats: Category[]) =>
            cats.forEach(c => { flat.push(c); if (c.children) flatten(c.children) })
          flatten(catRes.data.data)
          setCategories(flat)
        }
      } catch {
        toast.error("Не удалось загрузить курс")
      }
    })()
  }, [slug, reset])

  // ── Handlers ─────────────────────────────────────────────
  const onSubmit = (data: CreateCourseRequest) => {
    startTransition(async () => {
      try {
        // await CoursesService.updateCourse(slug, data)
        toast.success("Курс успешно обновлён")
        setIsEditing(false)
      } catch {
        toast.error("Не удалось сохранить изменения")
      }
    })
  }

  const handlePublish = async () => {
    setIsPublishing(true)
    try {
      await CoursesService.publishCourse(slug)
      const res = await CoursesService.getCourseBySlug(slug)
      if (res.data) setCourse(res.data)
      toast.success("Курс успешно опубликован!")
    } catch (e: any) {
      toast.error(e?.message || "Не удалось опубликовать курс")
    } finally {
      setIsPublishing(false)
    }
  }

  const handleThumbnailUpload = async (file: File) => {
    setUploadingThumb(true)
    try {
      await CoursesService.uploadThumbnail(slug, file)
      const res = await CoursesService.getCourseBySlug(slug)
      if (res.data) setCourse(res.data)
      toast.success("Обложка обновлена")
    } catch (e: any) {
      toast.error(e?.message || "Ошибка загрузки обложки")
    } finally {
      setUploadingThumb(false)
    }
  }

  const handleVideoUpload = async (file: File) => {
    setUploadingVideo(true)
    try {
      await CoursesService.UploadPreviewVideo(slug, file)
      const res = await CoursesService.getCourseBySlug(slug)
      if (res.data) setCourse(res.data)
      toast.success("Видео загружено")
    } catch (e: any) {
      toast.error(e?.message || "Ошибка загрузки видео")
    } finally {
      setUploadingVideo(false)
    }
  }

  const toggleEdit = () => {
    if (isEditing) reset()
    setIsEditing(v => !v)
  }

  if (!course) {
    return (
      <div className="flex min-h-[60vh] items-center justify-center">
        <Loader2 className="h-10 w-10 animate-spin text-primary" />
      </div>
    )
  }

  const levelColor: Record<CourseLevelEnum, string> = {
    BEGINNER: "bg-green-500/10 text-green-600 ring-green-500/20",
    INTERMEDIATE: "bg-yellow-500/10 text-yellow-600 ring-yellow-500/20",
    ADVANCED: "bg-red-500/10 text-red-600 ring-red-500/20",
  }

  return (
    <Protected>
      <div className="container-custom py-8 md:py-12">

        {/* Header */}
        <motion.div initial="hidden" animate="visible"
                    className="mb-8 flex items-start justify-between gap-4 flex-wrap">
          <div className="flex items-center gap-3">
            <Button variant="ghost" size="icon" onClick={() => router.back()}
                    className="h-9 w-9 rounded-xl text-muted-foreground hover:text-foreground">
              <ArrowLeft className="h-5 w-5" />
            </Button>
            <div>
              <div className="flex items-center gap-2 text-xs text-muted-foreground mb-1">
                <span>Мои курсы</span>
                <ChevronRight className="h-3 w-3" />
                <span className="text-foreground font-medium truncate max-w-[200px]">{course.title}</span>
              </div>
              <h1 className="text-2xl md:text-3xl font-semibold tracking-tight leading-tight">
                Настройки курса
              </h1>
            </div>
          </div>

          <div className="flex items-center gap-2 shrink-0">
            <Badge className={cn("rounded-full px-3 py-1 text-xs font-medium ring-1", levelColor[course.level])}>
              {t(CourseLevelLabels[course.level])}
            </Badge>

            {/* Publish */}
            <AlertDialog>
              <AlertDialogTrigger asChild>
                <Button variant="outline" size="sm" disabled={isPublishing}
                        className="h-9 gap-1.5 rounded-xl border-primary/30 text-primary hover:bg-primary/5 font-medium">
                  {isPublishing
                    ? <><Loader2 className="h-3.5 w-3.5 animate-spin" /> Публикация...</>
                    : <><SendHorizonal className="h-3.5 w-3.5" /> Опубликовать</>
                  }
                </Button>
              </AlertDialogTrigger>
              <AlertDialogContent>
                <AlertDialogHeader>
                  <AlertDialogTitle className="flex items-center gap-2">
                    <ShieldCheck className="h-5 w-5 text-primary" />
                    Опубликовать курс?
                  </AlertDialogTitle>
                  <AlertDialogDescription>
                    После публикации курс станет доступен всем пользователям платформы.
                    Убедитесь, что контент готов и все необходимые поля заполнены.
                  </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter>
                  <AlertDialogCancel>Отмена</AlertDialogCancel>
                  <AlertDialogAction onClick={handlePublish} className="bg-primary hover:bg-primary/90">
                    Да, опубликовать
                  </AlertDialogAction>
                </AlertDialogFooter>
              </AlertDialogContent>
            </AlertDialog>

            {/* Edit toggle */}
            <Button variant="ghost" size="icon" onClick={toggleEdit}
                    className={cn("h-9 w-9 rounded-full transition-colors",
                      isEditing
                        ? "bg-destructive/10 text-destructive hover:bg-destructive/20"
                        : "hover:bg-primary/10 text-muted-foreground hover:text-primary"
                    )}>
              {isEditing ? <X className="h-5 w-5" /> : <PencilLine className="h-5 w-5" />}
            </Button>
          </div>
        </motion.div>

        {/* Stats row */}
        <motion.div initial="hidden" animate="visible" custom={1}
                    className="mb-8 grid grid-cols-2 sm:grid-cols-4 gap-3">
          {[
            { label: "Студентов", value: course.enrolled_count, icon: BookOpen },
            { label: "Рейтинг", value: course.rating_avg.toFixed(1), icon: BarChart3 },
            { label: "Часов", value: course.duration_hours, icon: Play },
            { label: "Цена", value: course.price != null ? `$${course.price}` : "Бесплатно", icon: DollarSign },
          ].map(({ label, value, icon: Icon }) => (
            <div key={label} className="rounded-xl border border-border/60 bg-card/60 backdrop-blur-sm px-4 py-3 flex items-center gap-3">
              <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary/10 text-primary shrink-0">
                <Icon className="h-4 w-4" />
              </div>
              <div className="min-w-0">
                <p className="text-[11px] text-muted-foreground">{label}</p>
                <p className="text-base font-semibold leading-tight truncate">{value}</p>
              </div>
            </div>
          ))}
        </motion.div>

        {/* Tabs */}
        <motion.div initial="hidden" animate="visible" custom={2}>
          <Tabs defaultValue="info" className="space-y-6">
            <TabsList className="grid w-full max-w-md grid-cols-3 p-1 bg-muted/50 rounded-2xl">
              <TabsTrigger value="info" className="rounded-xl gap-1.5 text-xs sm:text-sm">
                <FileText className="h-3.5 w-3.5" /> Основное
              </TabsTrigger>
              <TabsTrigger value="media" className="rounded-xl gap-1.5 text-xs sm:text-sm">
                <ImageIcon className="h-3.5 w-3.5" /> Медиа
              </TabsTrigger>
              <TabsTrigger value="content" className="rounded-xl gap-1.5 text-xs sm:text-sm">
                <BookOpen className="h-3.5 w-3.5" /> Контент
              </TabsTrigger>
            </TabsList>

            <form onSubmit={handleSubmit(onSubmit)}>

              {/* TAB: INFO */}
              <TabsContent value="info" className="mt-0 space-y-5">
                <Card className="border bg-card/60 backdrop-blur-sm">
                  <CardHeader className="pb-5">
                    <CardTitle className="flex items-center gap-2 text-lg">
                      <Tag className="h-4.5 w-4.5 text-primary" />
                      Основная информация
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-5">
                    <div className="space-y-2">
                      <Label htmlFor="title">Название курса</Label>
                      <Input id="title" {...register("title")} disabled={!isEditing}
                             placeholder="Например: React с нуля до PRO"
                             className={cn("h-11 transition-all", !isEditing && "bg-muted/20 opacity-80")} />
                      {errors.title && (
                        <p className="flex items-center gap-1 text-xs text-destructive">
                          <AlertCircle className="h-3 w-3" />{errors.title.message}
                        </p>
                      )}
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="short_description">Краткое описание</Label>
                      <Textarea id="short_description" {...register("short_description")}
                                disabled={!isEditing} rows={2} placeholder="Одно-два предложения о курсе..."
                                className={cn("resize-none transition-all", !isEditing && "bg-muted/20 opacity-80")} />
                      {errors.short_description && (
                        <p className="flex items-center gap-1 text-xs text-destructive">
                          <AlertCircle className="h-3 w-3" />{errors.short_description.message}
                        </p>
                      )}
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="description">Полное описание</Label>
                      <Textarea id="description" {...register("description")} disabled={!isEditing} rows={5}
                                placeholder="Подробное описание курса..."
                                className={cn("min-h-[120px] resize-none transition-all", !isEditing && "bg-muted/20 opacity-80")} />
                    </div>

                    <Separator />

                    <div className="grid gap-5 sm:grid-cols-2">
                      <div className="space-y-2">
                        <Label>Категория</Label>
                        <Select disabled={!isEditing} value={watch("category_id")?.toString()}
                                onValueChange={v => setValue("category_id", Number(v), { shouldDirty: true })}>
                          <SelectTrigger className={cn("h-11", !isEditing && "bg-muted/20 opacity-80")}>
                            <SelectValue placeholder="Выберите категорию" />
                          </SelectTrigger>
                          <SelectContent>
                            {categories.map(cat => (
                              <SelectItem key={cat.id} value={cat.id.toString()}>{cat.name}</SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </div>

                      <div className="space-y-2">
                        <Label>Уровень</Label>
                        <Select disabled={!isEditing} value={level}
                                onValueChange={v => setValue("level", v as CourseLevelEnum, { shouldDirty: true })}>
                          <SelectTrigger className={cn("h-11", !isEditing && "bg-muted/20 opacity-80")}>
                            <SelectValue placeholder="Выберите уровень" />
                          </SelectTrigger>
                          <SelectContent>
                            {(Object.keys(CourseLevelLabels) as CourseLevelEnum[]).map(l => (
                              <SelectItem key={l} value={l}>{t(CourseLevelLabels[l])}</SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </div>

                      <div className="space-y-2">
                        <Label className="flex items-center gap-1.5">
                          <Globe className="h-3.5 w-3.5" /> Язык
                        </Label>
                        <Select disabled={!isEditing} value={watch("language")}
                                onValueChange={v => setValue("language", v, { shouldDirty: true })}>
                          <SelectTrigger className={cn("h-11", !isEditing && "bg-muted/20 opacity-80")}>
                            <SelectValue placeholder="Выберите язык" />
                          </SelectTrigger>
                          <SelectContent>
                            {LANGUAGES.map(l => (
                              <SelectItem key={l.value} value={l.value}>{l.label}</SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="price" className="flex items-center gap-1.5">
                          <DollarSign className="h-3.5 w-3.5" /> Цена (пусто = бесплатно)
                        </Label>
                        <Input id="price" type="number" min={0} step={0.01}
                               {...register("price", { valueAsNumber: true })}
                               disabled={!isEditing} placeholder="0.00"
                               className={cn("h-11", !isEditing && "bg-muted/20 opacity-80")} />
                      </div>
                    </div>
                  </CardContent>
                </Card>
                <SaveRow isEditing={isEditing} isPending={isPending} isDirty={isDirty} t={t} />
              </TabsContent>

              {/* TAB: MEDIA */}
              <TabsContent value="media" className="mt-0">
                <Card className="border bg-card/60 backdrop-blur-sm">
                  <CardHeader className="pb-5">
                    <CardTitle className="flex items-center gap-2 text-lg">
                      <ImageIcon className="h-4.5 w-4.5 text-primary" />
                      Медиа-материалы
                    </CardTitle>
                    <p className="text-sm text-muted-foreground mt-1">
                      Обложка и превью-видео курса. Включите режим редактирования для загрузки.
                    </p>
                  </CardHeader>
                  <CardContent className="grid gap-8 md:grid-cols-2">
                    <ThumbnailUploadCard
                      previewUrl={course.thumbnail_url}
                      isUploading={uploadingThumb}
                      disabled={!isEditing || uploadingThumb}
                      onFileSelect={handleThumbnailUpload}
                    />
                    <VideoPreviewCard
                      course={course}
                      isAuth={isAuth}
                      isUploading={uploadingVideo}
                      disabled={!isEditing || uploadingVideo}
                      onFileSelect={handleVideoUpload}
                    />
                  </CardContent>
                </Card>
              </TabsContent>

              {/* TAB: CONTENT */}
              <TabsContent value="content" className="mt-0 space-y-5">
                <Card className="border bg-card/60 backdrop-blur-sm">
                  <CardHeader className="pb-4">
                    <CardTitle className="flex items-center gap-2 text-lg">
                      <CheckCircle2 className="h-4.5 w-4.5 text-primary" />
                      Требования
                    </CardTitle>
                    <p className="text-sm text-muted-foreground">Что студент должен знать перед началом курса</p>
                  </CardHeader>
                  <CardContent>
                    <StringListEditor
                      label="Список требований"
                      items={requirements}
                      onChange={v => setValue("requirements", v, { shouldDirty: true })}
                      placeholder="Добавить требование..."
                      disabled={!isEditing}
                    />
                  </CardContent>
                </Card>

                <Card className="border bg-card/60 backdrop-blur-sm">
                  <CardHeader className="pb-4">
                    <CardTitle className="flex items-center gap-2 text-lg">
                      <Eye className="h-4.5 w-4.5 text-primary" />
                      Результаты обучения
                    </CardTitle>
                    <p className="text-sm text-muted-foreground">Чему студент научится после прохождения курса</p>
                  </CardHeader>
                  <CardContent>
                    <StringListEditor
                      label="Список результатов"
                      items={outcomes}
                      onChange={v => setValue("learning_outcomes", v, { shouldDirty: true })}
                      placeholder="Добавить результат обучения..."
                      disabled={!isEditing}
                    />
                  </CardContent>
                </Card>

                <SaveRow isEditing={isEditing} isPending={isPending} isDirty={isDirty} t={t} />
              </TabsContent>

            </form>
          </Tabs>
        </motion.div>
      </div>
    </Protected>
  )
}