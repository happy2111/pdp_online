'use client'

import { useState, useEffect, useTransition } from "react"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { Camera, User, Mail, Save, PencilLine, BadgeCheck, GraduationCap, Loader2, X } from "lucide-react"
import { toast } from "sonner"
import { useTranslations } from "next-intl"
import { motion, AnimatePresence } from "framer-motion"

import { ProfileService } from "@/services/profile-service"
import { UpdateProfileRequest, UpdateProfileRequestSchema, Profile } from "@/schemas/profile-schema"
import { cn } from "@/lib/utils"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"

const cardVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.4 } },
}

export default function ProfileSettings() {
  const t = useTranslations()

  const [profile, setProfile] = useState<Profile | null>(null)
  const [isPending, startTransition] = useTransition()
  const [isUploading, setIsUploading] = useState(false)
  const [isEditing, setIsEditing] = useState(false) // Состояние режима редактирования

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isDirty },
  } = useForm<UpdateProfileRequest>({
    resolver: zodResolver(UpdateProfileRequestSchema),
  })

  useEffect(() => {
    ;(async () => {
      try {
        const res = await ProfileService.getProfile()
        if (res.data) {
          setProfile(res.data)
          reset({
            first_name: res.data.first_name,
            last_name: res.data.last_name,
            username: res.data.username,
            bio: res.data.bio,
            title: res.data.teacher_info?.title || "",
            department: res.data.teacher_info?.department || "",
          })
        }
      } catch (err) {
        toast.error(t("errors.1000"))
      }
    })()
  }, [reset, t])

  const onAvatarChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return

    setIsUploading(true)
    try {
      await ProfileService.uploadAvatar(file)
      const { data } = await ProfileService.getProfile()
      setProfile(data)
      toast.success(t("profile.avatar_updated") || "Аватар обновлён")
    } catch (error: any) {
      toast.error(error?.message || t("errors.1000"))
    } finally {
      setIsUploading(false)
    }
  }

  const onSubmit = (data: UpdateProfileRequest) => {
    startTransition(async () => {
      try {
        await ProfileService.updateProfile(data)
        toast.success(t("profile.updated_success") || "Профиль успешно обновлён")
        setIsEditing(false) // Выключаем режим редактирования после успеха
      } catch (err: any) {
        toast.error(t("errors.update_failed") || "Не удалось сохранить изменения")
      }
    })
  }

  const toggleEditing = () => {
    if (isEditing) {
      reset() // Сброс полей при отмене
    }
    setIsEditing(!isEditing)
  }

  if (!profile) {
    return (
      <div className="flex min-h-[50vh] items-center justify-center">
        <Loader2 className="h-10 w-10 animate-spin text-primary" />
      </div>
    )
  }

  return (
    <div className="container-custom py-8 md:py-12">
      <motion.div
        initial="hidden"
        animate="visible"
        variants={cardVariants}
        className="grid grid-cols-1 lg:grid-cols-12 gap-6 lg:gap-8"
      >
        {/* Левая колонка */}
        <motion.div variants={cardVariants} className="lg:col-span-4 space-y-6">
          <Card className="border bg-card/60 backdrop-blur-sm">
            <CardContent className="pt-10 pb-8 text-center">
              <div className="relative mx-auto mb-5 inline-block">
                <Avatar className="h-28 w-28 border-4 border-background ring-1 ring-border/60 shadow-sm">
                  <AvatarImage src={profile.avatar_url} alt="Avatar" />
                  <AvatarFallback className="text-3xl bg-muted">
                    <User className="h-10 w-10" />
                  </AvatarFallback>
                </Avatar>

                <label
                  htmlFor="avatar-upload"
                  className={cn(
                    "absolute bottom-1 right-1 flex h-9 w-9 cursor-pointer items-center justify-center rounded-full bg-primary text-primary-foreground shadow-md transition-all hover:bg-primary/90 hover:scale-105 active:scale-95",
                    (isUploading || !isEditing) && "opacity-70 cursor-not-allowed pointer-events-none grayscale-[0.5]"
                  )}
                >
                  {isUploading ? (
                    <Loader2 className="h-5 w-5 animate-spin" />
                  ) : (
                    <Camera className="h-5 w-5" />
                  )}
                  <input
                    id="avatar-upload"
                    type="file"
                    className="sr-only"
                    onChange={onAvatarChange}
                    disabled={isUploading || !isEditing}
                    accept="image/*"
                  />
                </label>
              </div>

              <h2 className="text-2xl font-semibold tracking-tight">
                {profile.first_name} {profile.last_name}
              </h2>
              <p className="mt-1 text-muted-foreground">@{profile.username}</p>

              <div className="mt-4 flex flex-wrap justify-center gap-2">
                <div className="rounded-full bg-primary/10 px-3.5 py-1 text-xs font-medium text-primary ring-1 ring-primary/20">
                  {profile.role}
                </div>
                {profile.teacher_info && (
                  <div className="flex items-center gap-1.5 rounded-full bg-accent/10 px-3.5 py-1 text-xs font-medium text-accent-foreground ring-1 ring-accent/20">
                    <BadgeCheck className="h-3.5 w-3.5" />
                    Teacher
                  </div>
                )}
              </div>
            </CardContent>
          </Card>

          {profile.teacher_info && (
            <Card className="border bg-card/60 backdrop-blur-sm">
              <CardHeader className="pb-4">
                <CardTitle className="flex items-center gap-2 text-lg">
                  <GraduationCap className="h-5 w-5 text-primary" />
                  {t("profile.teacher_stats") || "Статистика преподавателя"}
                </CardTitle>
              </CardHeader>
              <CardContent className="grid grid-cols-2 gap-4">
                <div className="rounded-xl bg-muted/50 p-4 text-center">
                  <p className="text-sm text-muted-foreground">{t("profile.students") || "Студенты"}</p>
                  <p className="mt-1 text-2xl font-semibold">{profile.teacher_info.total_students}</p>
                </div>
                <div className="rounded-xl bg-muted/50 p-4 text-center">
                  <p className="text-sm text-muted-foreground">{t("profile.rating") || "Рейтинг"}</p>
                  <p className="mt-1 text-2xl font-semibold text-accent">
                    {profile.teacher_info.rating_avg.toFixed(1)}
                  </p>
                </div>
              </CardContent>
            </Card>
          )}
        </motion.div>

        {/* Правая колонка — форма */}
        <motion.div variants={cardVariants} className="lg:col-span-8">
          <Card className="border bg-card/60 backdrop-blur-sm">
            <CardHeader className="space-y-1 pb-6">
              <div className="flex items-start justify-between">
                <div>
                  <CardTitle className="text-2xl font-semibold tracking-tight">
                    {t("profile.settings") || "Настройки профиля"}
                  </CardTitle>
                  <p className="mt-1.5 text-sm text-muted-foreground">
                    {t("profile.manage_info") || "Управляйте личной информацией"}
                  </p>
                </div>
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={toggleEditing}
                  className={cn(
                    "rounded-full transition-colors",
                    isEditing ? "bg-destructive/10 text-destructive hover:bg-destructive/20" : "hover:bg-primary/10 text-muted-foreground hover:text-primary"
                  )}
                >
                  {isEditing ? <X className="h-6 w-6" /> : <PencilLine className="h-6 w-6" />}
                </Button>
              </div>
            </CardHeader>

            <CardContent>
              <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
                <div className="grid gap-6 sm:grid-cols-2">
                  <div className="space-y-2">
                    <Label htmlFor="first_name">{t("auth.fields.firstName")}</Label>
                    <Input
                      id="first_name"
                      {...register("first_name")}
                      disabled={!isEditing}
                      className={cn("h-11 transition-all", !isEditing && "bg-muted/20 opacity-80")}
                    />
                    {errors.first_name && (
                      <p className="text-sm text-destructive">{errors.first_name.message}</p>
                    )}
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="last_name">{t("auth.fields.lastName")}</Label>
                    <Input
                      id="last_name"
                      {...register("last_name")}
                      disabled={!isEditing}
                      className={cn("h-11 transition-all", !isEditing && "bg-muted/20 opacity-80")}
                    />
                    {errors.last_name && (
                      <p className="text-sm text-destructive">{errors.last_name.message}</p>
                    )}
                  </div>
                </div>

                <div className="grid gap-6 sm:grid-cols-2">
                  <div className="space-y-2">
                    <Label htmlFor="username">{t("auth.fields.username")}</Label>
                    <div className="relative">
                      <span className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground">
                        @
                      </span>
                      <Input
                        id="username"
                        {...register("username")}
                        disabled={!isEditing}
                        className={cn("h-11 pl-8 transition-all", !isEditing && "bg-muted/20 opacity-80")}
                      />
                    </div>
                    {errors.username && (
                      <p className="text-sm text-destructive">{errors.username.message}</p>
                    )}
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="email">{t("auth.fields.email")}</Label>
                    <div className="relative">
                      <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                      <Input
                        id="email"
                        value={profile.email}
                        readOnly
                        disabled
                        className="h-11 pl-10 bg-muted/40 cursor-not-allowed opacity-70"
                      />
                    </div>
                  </div>
                </div>

                {profile.teacher_info && (
                  <div className="grid gap-6 sm:grid-cols-2">
                    <div className="space-y-2">
                      <Label htmlFor="title">{t("profile.title") || "Должность / Титул"}</Label>
                      <Input
                        id="title"
                        {...register("title")}
                        disabled={!isEditing}
                        placeholder="Например: Senior Lecturer"
                        className={cn("h-11 transition-all", !isEditing && "bg-muted/20 opacity-80")}
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="department">{t("profile.department") || "Кафедра / Департамент"}</Label>
                      <Input
                        id="department"
                        {...register("department")}
                        disabled={!isEditing}
                        placeholder="Например: Computer Science"
                        className={cn("h-11 transition-all", !isEditing && "bg-muted/20 opacity-80")}
                      />
                    </div>
                  </div>
                )}

                <div className="space-y-2">
                  <Label htmlFor="bio">{t("profile.bio") || "О себе"}</Label>
                  <Textarea
                    id="bio"
                    {...register("bio")}
                    disabled={!isEditing}
                    rows={4}
                    placeholder={t("profile.bio_placeholder") || "Несколько слов о себе..."}
                    className={cn("min-h-[108px] resize-none transition-all", !isEditing && "bg-muted/20 opacity-80")}
                  />
                </div>

                <div className="flex justify-end pt-4">
                  <AnimatePresence mode="wait">
                    {isEditing ? (
                      <motion.div
                        key="save-btn"
                        initial={{ opacity: 0, scale: 0.95 }}
                        animate={{ opacity: 1, scale: 1 }}
                        exit={{ opacity: 0, scale: 0.95 }}
                      >
                        <Button
                          type="submit"
                          disabled={isPending || !isDirty}
                          className={cn(
                            "min-w-40 h-11 rounded-xl font-medium transition-all",
                            isDirty
                              ? "bg-primary hover:bg-primary/95 shadow-sm"
                              : "bg-muted text-muted-foreground"
                          )}
                        >
                          {isPending ? (
                            <>
                              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                              {t("common.loading")}
                            </>
                          ) : (
                            <>
                              <Save className="mr-2 h-4 w-4" />
                              {t("common.save")}
                            </>
                          )}
                        </Button>
                      </motion.div>
                    ) : (
                      <motion.div
                        key="edit-btn"
                        initial={{ opacity: 0, scale: 0.95 }}
                        animate={{ opacity: 1, scale: 1 }}
                        exit={{ opacity: 0, scale: 0.95 }}
                      >
                        <Button
                          type="button"
                          onClick={() => setIsEditing(true)}
                          variant="outline"
                          className="min-w-40 h-11 rounded-xl font-medium border-primary/20 text-primary hover:bg-primary/5"
                        >
                          <PencilLine className="mr-2 h-4 w-4" />
                          {t("common.edit") || "Редактировать"}
                        </Button>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              </form>
            </CardContent>
          </Card>
        </motion.div>
      </motion.div>
    </div>
  )
}