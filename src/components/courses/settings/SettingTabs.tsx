import React from 'react'
import { motion } from "framer-motion"
import {
  Image as ImageIcon,
  BookOpen,
  Tag,
  Globe,
  DollarSign,
  FileText,
  CheckCircle2,
  AlertCircle,
  Eye,
} from "lucide-react"

import {
  CourseDetails,
  CourseLevelEnum,
  CourseLevelLabels,
} from "@/schemas/courses-schema"
import { cn } from "@/lib/utils"
import { LANGUAGES } from "@/schemas/courses-schema"

import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Separator } from "@/components/ui/separator"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import StringListEditor from "@/components/courses/settings/StringListEditor"
import ThumbnailUploadCard from "@/components/courses/settings/ThumbnailUploadCard"
import VideoPreviewCard from "@/components/courses/settings/VideoPreviewCard"
import SaveRow from "@/components/courses/settings/SaveRow"

import { useTranslations } from "next-intl"
import { Category } from "@/schemas/categories-schema"
import { Controller } from "react-hook-form"
import ModulesTab from "@/components/courses/settings/ModulesTab";

interface Props {
  isEditing: boolean;
  isPending: boolean;
  isDirty: boolean;

  course: CourseDetails;
  categories: any[];
  requirements: string[];
  outcomes: string[];

  level: CourseLevelEnum | undefined;

  isAuth: boolean;
  uploadingThumb: boolean;
  uploadingVideo: boolean;

  register: any;
  watch: any;
  setValue: any;
  control?: any;

  handleSubmit: any;
  onSubmit: any;
  handleThumbnailUpload: (file: File) => void;
  handleVideoUpload: (file: File) => void;

  errors: any;
}

type FlatCategory = Category & { level: number }

function flattenCategories(
  categories: Category[],
  level = 0
): FlatCategory[] {
  return categories.flatMap(cat => [
    { ...cat, level },
    ...(cat.children ? flattenCategories(cat.children, level + 1) : [])
  ])
}

const SettingTabs = (props: Props) => {
  const {
    isEditing,
    isPending,
    isDirty,
    course,
    categories,
    requirements,
    outcomes,
    level,
    isAuth,
    uploadingThumb,
    uploadingVideo,
    register,
    watch,
    setValue,
    control,
    handleSubmit,
    onSubmit,
    handleThumbnailUpload,
    handleVideoUpload,
    errors,
  } = props;

  const t = useTranslations('courses.settings')
  const t2 = useTranslations()
  const flatCategories = flattenCategories(categories)

  return (
    <motion.div initial="hidden" animate="visible" custom={2}>
      <Tabs defaultValue="info" className="space-y-6">
        <TabsList className="grid w-full max-w-md grid-cols-4 p-1 bg-muted/50 rounded-2xl">
          <TabsTrigger value="info" className="rounded-xl gap-1.5 text-xs sm:text-sm">
            <FileText className="h-3.5 w-3.5" /> {t('tabs.info')}
          </TabsTrigger>
          <TabsTrigger value="media" className="rounded-xl gap-1.5 text-xs sm:text-sm">
            <ImageIcon className="h-3.5 w-3.5" /> {t('tabs.media')}
          </TabsTrigger>
          <TabsTrigger value="content" className="rounded-xl gap-1.5 text-xs sm:text-sm">
            <BookOpen className="h-3.5 w-3.5" /> {t('tabs.content')}
          </TabsTrigger>
          <TabsTrigger value="modules" className="rounded-xl gap-1.5 text-xs sm:text-sm">
            <BookOpen className="h-3.5 w-3.5" /> {t('tabs.modules')}
          </TabsTrigger>
        </TabsList>

          {/* TAB: INFO */}
          <TabsContent value="info" className="mt-0 space-y-5">
            <form onSubmit={handleSubmit(onSubmit)}>
              <Card className="border bg-card/60 backdrop-blur-sm">
                <CardHeader className="pb-5">
                  <CardTitle className="flex items-center gap-2 text-lg">
                    <Tag className="h-4.5 w-4.5 text-primary" />
                    {t('basicInfo')}
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-5">
                  <div className="space-y-2">
                    <Label htmlFor="title">{t('courseTitle')}</Label>
                    <Input
                      id="title"
                      {...register("title")}
                      disabled={!isEditing}
                      placeholder="Masalan: React noldan PRO gacha"
                      className={cn("h-11 transition-all", !isEditing && "bg-muted/20 opacity-80")}
                    />
                    {errors.title && (
                      <p className="flex items-center gap-1 text-xs text-destructive">
                        <AlertCircle className="h-3 w-3" />
                        {errors.title.message}
                      </p>
                    )}
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="short_description">{t('shortDescription')}</Label>
                    <Textarea
                      id="short_description"
                      {...register("short_description")}
                      disabled={!isEditing}
                      rows={2}
                      placeholder="Kurs haqida bir-ikki jumla..."
                      className={cn("resize-none transition-all", !isEditing && "bg-muted/20 opacity-80")}
                    />
                    {errors.short_description && (
                      <p className="flex items-center gap-1 text-xs text-destructive">
                        <AlertCircle className="h-3 w-3" />
                        {errors.short_description.message}
                      </p>
                    )}
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="description">{t('fullDescription')}</Label>
                    <Textarea
                      id="description"
                      {...register("description")}
                      disabled={!isEditing}
                      rows={5}
                      placeholder="Kursning to‘liq tavsifi..."
                      className={cn("min-h-[120px] resize-none transition-all", !isEditing && "bg-muted/20 opacity-80")}
                    />
                  </div>

                  <Separator />

                  <div className="grid gap-5 sm:grid-cols-2">
                    {/* Категория */}
                    <div className="space-y-2">
                      <Label>{t('category')}</Label>
                      <Controller
                        name="category_id"
                        control={control}
                        render={({ field }) => (
                          <Select
                            disabled={!isEditing}
                            value={field.value ? String(field.value) : undefined}
                            onValueChange={(v) => field.onChange(Number(v))}
                          >
                            <SelectTrigger className={cn("h-11", !isEditing && "bg-muted/20 opacity-80")}>
                              <SelectValue placeholder={t('selectCategoryPlaceholder')} />
                            </SelectTrigger>
                            <SelectContent>
                              {flatCategories.map((cat) => (
                                <SelectItem key={cat.id} value={cat.id.toString()}>
                                  <span
                                    style={{ paddingLeft: `${cat.level * 12}px` }}
                                    className="flex items-center gap-2"
                                  >
                                    {cat.level > 0 && "└ "}
                                    {cat.name}
                                  </span>
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                        )}
                      />
                    </div>

                    {/* Уровень */}
                    <div className="space-y-2">
                      <Label>{t('level')}</Label>
                      <Select
                        disabled={!isEditing}
                        value={level}
                        onValueChange={v => setValue("level", v as CourseLevelEnum, { shouldDirty: true })}
                      >
                        <SelectTrigger className={cn("h-11", !isEditing && "bg-muted/20 opacity-80")}>
                          <SelectValue placeholder={t('selectLevelPlaceholder')} />
                        </SelectTrigger>
                        <SelectContent>
                          {(Object.keys(CourseLevelLabels) as CourseLevelEnum[]).map(l => (
                            <SelectItem key={l} value={l}>
                              {t2(CourseLevelLabels[l])}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>

                    {/* Язык */}
                    <div className="space-y-2">
                      <Label className="flex items-center gap-1.5">
                        <Globe className="h-3.5 w-3.5" /> {t('language')}
                      </Label>
                      <Select
                        disabled={!isEditing}
                        value={watch("language")}
                        onValueChange={v => setValue("language", v, { shouldDirty: true })}
                      >
                        <SelectTrigger className={cn("h-11", !isEditing && "bg-muted/20 opacity-80")}>
                          <SelectValue placeholder={t('selectLanguagePlaceholder')} />
                        </SelectTrigger>
                        <SelectContent>
                          {LANGUAGES.map(l => (
                            <SelectItem key={l.value} value={l.value}>
                              {l.label}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>

                    {/* Цена */}
                    <div className="space-y-2">
                      <Label htmlFor="price" className="flex items-center gap-1.5">
                        <DollarSign className="h-3.5 w-3.5" /> {t('price')}
                      </Label>
                      <Input
                        id="price"
                        type="number"
                        min={0}
                        step={0.01}
                        {...register("price", { valueAsNumber: true })}
                        disabled={!isEditing}
                        placeholder={t('pricePlaceholder')}
                        className={cn("h-11", !isEditing && "bg-muted/20 opacity-80")}
                      />
                    </div>
                  </div>
                </CardContent>
              </Card>

              <SaveRow isEditing={isEditing} isPending={isPending} isDirty={isDirty} />
            </form>
          </TabsContent>

          {/* TAB: MEDIA */}
          <TabsContent value="media" className="mt-0">
            <Card className="border bg-card/60 backdrop-blur-sm">
              <CardHeader className="pb-5">
                <CardTitle className="flex items-center gap-2 text-lg">
                  <ImageIcon className="h-4.5 w-4.5 text-primary" />
                  {t('media')}
                </CardTitle>
                <p className="text-sm text-muted-foreground mt-1">
                  {t('mediaDescription')}
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
            <form onSubmit={handleSubmit(onSubmit)}>
              <Card className="border bg-card/60 backdrop-blur-sm">
                <CardHeader className="pb-4">
                  <CardTitle className="flex items-center gap-2 text-lg">
                    <CheckCircle2 className="h-4.5 w-4.5 text-primary" />
                    {t('requirements')}
                  </CardTitle>
                  <p className="text-sm text-muted-foreground">{t('requirementsDesc')}</p>
                </CardHeader>
                <CardContent>
                  <StringListEditor
                    label={t('stringList.requirementsLabel')}
                    items={requirements}
                    onChange={v => setValue("requirements", v, { shouldDirty: true })}
                    placeholder={t('stringList.requirementsPlaceholder')}
                    disabled={!isEditing}
                  />
                </CardContent>
              </Card>

              <Card className="border bg-card/60 backdrop-blur-sm">
                <CardHeader className="pb-4">
                  <CardTitle className="flex items-center gap-2 text-lg">
                    <Eye className="h-4.5 w-4.5 text-primary" />
                    {t('learningOutcomes')}
                  </CardTitle>
                  <p className="text-sm text-muted-foreground">{t('learningOutcomesDesc')}</p>
                </CardHeader>
                <CardContent>
                  <StringListEditor
                    label={t('stringList.outcomesLabel')}
                    items={outcomes}
                    onChange={v => setValue("learning_outcomes", v, { shouldDirty: true })}
                    placeholder={t('stringList.outcomesPlaceholder')}
                    disabled={!isEditing}
                  />
                </CardContent>
              </Card>

              <SaveRow isEditing={isEditing} isPending={isPending} isDirty={isDirty} />
            </form>
          </TabsContent>

          <TabsContent value="modules" className="mt-0">
            <ModulesTab
              slug={course.slug}
              courseId={course.id}
            />
          </TabsContent>

      </Tabs>
    </motion.div>
  )
}

export default SettingTabs