'use client'

import { useState, useEffect, useTransition } from "react"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { useParams, useRouter } from "next/navigation"
import { useTranslations } from "next-intl"
import { toast } from "sonner"
import { Loader2 } from "lucide-react"

import { CoursesService } from "@/services/courses-service"
import { CategoriesService } from "@/services/categories-service"
import {
  CourseDetails,
  UpdateCourseRequest,
  UpdateCourseSchema,
} from "@/schemas/courses-schema"
import { Category } from "@/schemas/categories-schema"
import { useAuthStore } from "@/stores/auth-store"
import Protected from "@/components/protecters/Protected"

import SettingsHeader from "@/components/courses/settings/SettingsHeader"
import SettingsStats from "@/components/courses/settings/SettingsStats"
import SettingTabs from "@/components/courses/settings/SettingTabs"

export default function CourseSettingsPage() {
  const { slug } = useParams<{ slug: string }>()
  const router = useRouter()
  const t = useTranslations()
  const tCourse = useTranslations('courses')
  const tSettings = useTranslations('courses.settings')

  const isAuth = useAuthStore(state => state.isAuthenticated)

  const [course, setCourse] = useState<CourseDetails | null>(null)
  const [categories, setCategories] = useState<Category[]>([])
  const [isEditing, setIsEditing] = useState(false)
  const [isPending, startTransition] = useTransition()
  const [isPublishing, setIsPublishing] = useState(false)
  const [uploadingThumb, setUploadingThumb] = useState(false)
  const [uploadingVideo, setUploadingVideo] = useState(false)

  const {
    register,
    handleSubmit,
    reset,
    watch,
    setValue,
    control,
    formState: { errors, isDirty }
  } = useForm<UpdateCourseRequest>({
    resolver: zodResolver(UpdateCourseSchema)
  })

  const requirements = watch("requirements") ?? []
  const outcomes = watch("learning_outcomes") ?? []
  const level = watch("level")

  // ── Load Data ─────────────────────────────────────────────────
  useEffect(() => {
    (async () => {
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

        if (catRes?.data) {
          // @ts-ignore
          setCategories(catRes.data)
        }
      } catch (error) {
        toast.error(tSettings('loadingError'))
      }
    })()
  }, [slug, reset, tSettings])

  // ── Handlers ─────────────────────────────────────────────
  const onSubmit = (data: UpdateCourseRequest) => {
    startTransition(async () => {
      try {
        await CoursesService.updateCourse(slug, data)
        const res = await CoursesService.getCourseBySlug(slug)
        if (res.data) setCourse(res.data)

        toast.success(tSettings('updateSuccess'))
        setIsEditing(false)
      } catch {
        toast.error(tSettings('updateError'))
      }
    })
  }

  const handlePublish = async () => {
    setIsPublishing(true)
    try {
      await CoursesService.publishCourse(slug)
      const res = await CoursesService.getCourseBySlug(slug)
      if (res.data) setCourse(res.data)
      toast.success(tSettings('publishSuccess'))
    } catch (e: any) {
      toast.error(e?.message || tSettings('publishError'))
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
      toast.success(tSettings('thumbnailSuccess'))
    } catch (e: any) {
      toast.error(e?.message || tSettings('thumbnailError'))
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
      toast.success(tSettings('videoSuccess'))
    } catch (e: any) {
      toast.error(e?.message || tSettings('videoError'))
    } finally {
      setUploadingVideo(false)
    }
  }

  const toggleEdit = () => {
    if (isEditing && course) {
      reset({
        title: course.title,
        short_description: course.short_description,
        description: course.description,
        level: course.level,
        language: course.language,
        category_id: course.category_id,
        price: course.price ?? undefined,
        requirements: course.requirements,
        learning_outcomes: course.learning_outcomes,
      })
    }
    setIsEditing(v => !v)
  }

  if (!course) {
    return (
      <div className="flex min-h-[60vh] items-center justify-center">
        <Loader2 className="h-10 w-10 animate-spin text-primary" />
      </div>
    )
  }

  return (
    <Protected>
      <div className="container-custom py-8 md:py-12">
        <SettingsHeader
          course={course}
          isEditing={isEditing}
          isPublishing={isPublishing}
          toggleEdit={toggleEdit}
          handlePublish={handlePublish}
        />

        <SettingsStats course={course} />

        <SettingTabs
          course={course}
          isPending={isPending}
          isEditing={isEditing}
          isDirty={isDirty}
          categories={categories}
          requirements={requirements}
          outcomes={outcomes}
          level={level}
          isAuth={isAuth}
          uploadingThumb={uploadingThumb}
          uploadingVideo={uploadingVideo}
          register={register}
          watch={watch}
          setValue={setValue}
          control={control}
          handleSubmit={handleSubmit}
          onSubmit={onSubmit}
          handleThumbnailUpload={handleThumbnailUpload}
          handleVideoUpload={handleVideoUpload}
          errors={errors}
        />
      </div>
    </Protected>
  )
}