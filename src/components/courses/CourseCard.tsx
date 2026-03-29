"use client";

import {CourseLevelLabels, CourseListItem} from "@/schemas/courses-schema";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {useTranslations} from "next-intl";
import {Star, Settings} from "lucide-react";
import {useRouter} from "next/navigation";

interface Props {
  course: CourseListItem;
  isOwner: boolean;
  customPath?: string;
}

export function CourseCard({ course , isOwner, customPath}: Props) {
  const t = useTranslations();
  const router = useRouter();

  const handleSettingsClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    router.push(`/courses/${course.slug}/settings`);
  };

  return (
    <Card
      onClick={() => router.push(`${customPath ?? `/courses/${course.slug}`}`)}
      className="group pt-0! gap-2 overflow-hidden rounded-3xl bg-card/70 backdrop-blur transition-all hover:shadow-xl hover:-translate-y-1 cursor-pointer flex flex-col"
    >
      <div className="relative w-full h-32 overflow-hidden flex items-center justify-center">
        <img
          src={course.thumbnail_url}
          alt={course.title}
          className="object-cover w-full h-full group-hover:scale-105 transition-transform duration-300"
        />

        {course.is_free && (
          <Badge className="absolute top-3 left-3 bg-primary text-primary-foreground">
            {t("common.free")}
          </Badge>
        )}
      </div>

      <CardContent className="px-3 pb-3 flex-1 flex flex-col">
        <h3 className="font-semibold text-lg line-clamp-1">
          {course.title}
        </h3>

        <p className="text-muted-foreground text-sm line-clamp-2">
          {course.short_description}
        </p>

        <div className="flex items-center justify-between text-sm pt-2">
          <span className="text-muted-foreground">
            {course.duration_hours}h
          </span>
          <Badge variant="secondary">
            {t(CourseLevelLabels[course.level])}
          </Badge>
        </div>

        <div className="flex items-center justify-between text-xs text-muted-foreground pt-2">
          <span className="flex items-center gap-1">
            <Star className="size-4 text-yellow-400 fill-yellow-400"/> {course.rating_avg.toFixed(1)}
          </span>
          <span>
            {course.enrolled_count} {t("students")}
          </span>
        </div>

        {isOwner && (
          <div className="mt-auto pt-3">
            <Button
              size="sm"
              variant="default"
              className="
                w-full gap-2 h-10 rounded-xl transition-all duration-300 active:scale-95
                /* Мобильные: кнопка видна всегда */
                opacity-100 translate-y-0
                /* Десктоп (md и выше): скрыта по дефолту, выезжает при наведении на Card */
                md:opacity-0 md:translate-y-2 group-hover:md:opacity-100 group-hover:md:translate-y-0
              "
              onClick={handleSettingsClick}
            >
              <Settings className="size-4" />
              {t("courses.edit_course")}
            </Button>
          </div>
        )}
      </CardContent>
    </Card>
  );
}