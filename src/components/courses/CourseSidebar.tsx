'use client'

import { useState } from "react"
import {
  PlayCircle,
  Clock,
  FileText,
  Layout,
  Award,
  Share2,
  Check,
  Loader2
} from "lucide-react"
import { toast } from "sonner"

import { CourseDetails } from "@/schemas/courses-schema"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { VideoPlayer } from "../video-player"
import { useAuthStore } from "@/stores/auth-store"
import { useTranslations } from 'next-intl';
import {formatDurationHour} from "@/lib/utils";
import {CoursesService} from "@/services/courses-service";
import { useRouter } from "@/i18n/navigation";
import {useParams} from "next/navigation";

export const CourseSidebar = ({ course }: { course: CourseDetails }) => {
  const isAuth = useAuthStore((state) => state.isAuthenticated)
  const [copied, setCopied] = useState(false)
  const router = useRouter()
  const params = useParams()
  const locale = params.locale as string

  const [isPending, setIsPending] = useState(false);
  const t = useTranslations()

  const handleShare = async () => {
    const shareData = {
      title: course.title,
      text: `${t('sidebar_course.share')}: ${course.title}`,
      url: window.location.href,
    }

    try {
      if (navigator.share && navigator.canShare(shareData)) {
        await navigator.share(shareData)
      } else {
        await navigator.clipboard.writeText(window.location.href)
        setCopied(true)
        toast.success(t('sidebar_course.link_copied'))
        setTimeout(() => setCopied(false), 2000)
      }
    } catch (err) {
      console.error("Share error:", err)
    }
  }

  const handleStart = async (courseId: number) => {
    setIsPending(true); // Включаем анимацию на кнопке

    toast.promise(CoursesService.startCourse(courseId), {
      loading: t('common.loading'),
      success: (res) => {
        if (res.code === 0) {
          const lessonId = res.data.last_lesson_id;

          const targetPath = `/${locale}/courses/${course.slug}/learn/${lessonId}`;

          setTimeout(() => {
            router.push(targetPath);
          }, 800);

          return t('sidebar_course.course_started');
        }
        setIsPending(false);
        throw new Error(res.message);

      },
      error: (err) => {
        console.log(JSON.stringify(err))
        setIsPending(false);
        return t('sidebar_course.start_error');
      },
    });
  };

  const isFree = course.price === 0 || course.price === null

  return (
    <Card className="sticky pt-0! top-0 overflow-hidden rounded-3xl bg-card/70 backdrop-blur border border-border transition-all hover:shadow-xl">

      <div className="relative group cursor-pointer z-50">
        {isAuth ? (
          <VideoPlayer slug={course.slug} endpoint={course.preview_video_url} />
        ) : (
          <div onClick={() => toast.error(t('sidebar_course.auth_error_preview'))}>
            <img
              src={course.thumbnail_url}
              alt={course.title}
              className="aspect-video w-full object-cover transition-transform duration-300 group-hover:scale-105"
            />
            <div className="absolute inset-0 flex items-center justify-center bg-black/40 group-hover:bg-black/20 transition-colors">
              <PlayCircle className="h-14 w-14 text-white drop-shadow-lg" />
            </div>
          </div>
        )}
      </div>

      <CardContent className="p-6 pt-0 space-y-6">

        <div className="flex items-center gap-2">
          {!isFree ? (
            <div className="flex flex-col">
              <span className="text-3xl font-bold tracking-tight text-foreground">
                {new Intl.NumberFormat('ru-RU').format(course.price!)}
                <span className="ml-1 text-lg font-medium text-muted-foreground uppercase">so'm</span>
              </span>
            </div>
          ) : (
            <div className="px-3 py-1 rounded-full bg-green-500/10 text-green-600 dark:text-green-400 text-sm font-bold uppercase tracking-wide border border-green-500/20">
              {t('common.free')}
            </div>
          )}
        </div>

        <Button
          size="lg"
          disabled={isPending}
          onClick={() => handleStart(course.id)}
          className={`w-full h-12 text-base font-bold rounded-2xl transition-all duration-300 relative overflow-hidden ${
            course.enrolled
              ? "bg-secondary text-secondary-foreground hover:bg-secondary/80 shadow-sm"
              : "bg-primary text-primary-foreground hover:bg-primary/90 shadow-md hover:shadow-lg active:scale-95"
          }`}
        >
          {isPending ? (
            <div className="flex items-center gap-2">
              <Loader2 className="h-5 w-5 animate-spin" />
              <span>{t('common.loading')}</span>
            </div>
          ) : (
            <div className="flex items-center gap-2">
              {course.enrolled ? (
                <>
                  <PlayCircle className="h-5 w-5" />
                  {t('sidebar_course.enrolled')}
                </>
              ) : (
                isFree ? t('sidebar_course.enroll_free') : t('sidebar_course.buy')
              )}
            </div>
          )}
        </Button>

        <div className="space-y-3 pt-2">
          <h4 className="font-semibold text-xs uppercase tracking-wider text-muted-foreground">
            {t('sidebar_course.includes')}
          </h4>
          <ul className="space-y-3 text-sm font-medium">
            {[
              {
                icon: Clock,
                label: t('sidebar_course.items.hours', {
                  count: formatDurationHour(course.duration_hours)
                })
              },
              { icon: FileText, label: t('sidebar_course.items.resources') },
              { icon: Layout,   label: t('sidebar_course.items.tasks') },
              { icon: Award,    label: t('sidebar_course.items.certificate') },
            ].map(({ icon: Icon, label }) => (
              <li key={label} className="flex items-center gap-3 text-foreground/80">
                <Icon className="h-4 w-4 text-primary shrink-0" />
                {label}
              </li>
            ))}
          </ul>
        </div>

        <Button
          variant="ghost"
          onClick={handleShare}
          className="w-full text-muted-foreground hover:text-primary hover:bg-primary/5 transition-all rounded-2xl"
        >
          {copied ? (
            <Check className="mr-2 h-4 w-4 text-green-500" />
          ) : (
            <Share2 className="mr-2 h-4 w-4" />
          )}
          {copied ? t('sidebar_course.link_copied') : t('sidebar_course.share')}
        </Button>

      </CardContent>
    </Card>
  )
}