"use client";

import {CourseLevelLabels, CourseListItem} from "@/schemas/courses-schema";
import {Card, CardContent} from "@/components/ui/card";
import {Badge} from "@/components/ui/badge";
import {Button} from "@/components/ui/button";
import {useTranslations} from "next-intl";
import {Star, Settings, StarHalf} from "lucide-react";
import {useRouter} from "@/i18n/navigation"

interface Props {
  course: CourseListItem;
  isOwner: boolean;
  customPath?: string;
}

export function CourseCard({course, isOwner, customPath}: Props) {
  const t = useTranslations();
  const router = useRouter();

  const handleSettingsClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    router.push(`/courses/${course.slug}/settings`);
  };

  return (
    <Card
      onClick={() => router.push(`${customPath ?? `/courses/${course.slug}`}`)}
      className="group pt-0! border-border relative gap-2 overflow-hidden rounded-3xl bg-card/70 backdrop-blur transition-all duration-500 hover:shadow-2xl hover:shadow-primary/5 hover:-translate-y-1.5 cursor-pointer flex flex-col border-none ring-1 ring-border/50"
    >
      <div className="relative w-full h-36 overflow-hidden">
        <img
          src={course.thumbnail_url}
          alt={course.title}
          className="object-cover w-full h-full transition-transform duration-700 ease-out group-hover:scale-110"
        />

        <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />

        {course.is_free && (
          <Badge className="absolute top-3 left-3 bg-white/90 dark:bg-black/80 backdrop-blur-md text-foreground border-none shadow-sm">
            {t("common.free")}
          </Badge>
        )}

        {isOwner && (
          <Button
            size="icon"
            variant="secondary"
            onClick={handleSettingsClick}
            className="
              absolute top-3 right-3 z-10 size-9 rounded-full
              bg-white/20 dark:bg-black/30 backdrop-blur-xl border border-white/30 dark:border-white/10
              text-white shadow-xl transition-all duration-300
              opacity-100 scale-100
              md:opacity-0 md:scale-75 md:group-hover:opacity-100 md:group-hover:scale-100
              hover:bg-primary hover:text-white
              hover:dark:text-primary hover:rotate-90
            "
          >
            <Settings className="size-5" />
          </Button>
        )}
      </div>

      <CardContent className="px-4 pb-4 flex-1 flex flex-col pt-2">
        <div className="flex flex-col gap-1">
          <h3 className="font-bold text-base leading-tight line-clamp-1 group-hover:text-primary transition-colors">
            {course.title}
          </h3>
          <p className="text-muted-foreground text-xs line-clamp-2 leading-relaxed">
            {course.short_description}
          </p>
        </div>

        <div className="my-3 border-t border-dashed border-border" />

        <div className="mt-auto space-y-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-0.5">
              {[1, 2, 3, 4, 5].map((star) => {
                const rating = course.rating_avg;
                if (rating >= star) {
                  return <Star
                    key={star}
                    className="size-3.5 text-yellow-500 fill-yellow-500"
                  />;
                }
                if (rating > star - 1 && rating < star) {
                  return <StarHalf
                    key={star}
                    className="size-3.5 text-yellow-500 fill-yellow-500"
                  />;
                }
                return <Star
                  key={star}
                  className="size-3.5 text-muted-foreground/30"
                />;
              })}
              <span className="ml-1.5 text-[13px] font-bold text-foreground">
                {course.rating_avg.toFixed(1)}
              </span>
            </div>

            <Badge
              variant="outline"
              className="rounded-md border-primary/20 text-primary bg-primary/5 text-[10px]"
            >
              {t(CourseLevelLabels[course.level])}
            </Badge>
          </div>

          <div className="flex items-center justify-between items-end">
            <div className="flex flex-col gap-1 text-[11px] uppercase tracking-wider font-semibold text-muted-foreground/70">
              <span>{course.duration_hours}h • {course.enrolled_count} {t("students")}</span>
            </div>

            <div className="text-right">
              {course.is_free ? (
                <span className="text-sm font-bold text-green-600 dark:text-green-400">
                  {t("common.free")}
                </span>
              ) : (
                <span className="text-sm font-bold text-foreground">
                  {new Intl.NumberFormat('ru-RU').format(course.price)}
                        <span className="ml-1 text-[10px] text-muted-foreground uppercase">UZS</span>
                </span>
              )}
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}