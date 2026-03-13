"use client";

import {CourseLevelLabels, CourseListItem} from "@/schemas/courses-schema";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import Image from "next/image";
import {useTranslations} from "next-intl";

interface Props {
  course: CourseListItem;
}

export function CourseCard({ course }: Props) {
  const t = useTranslations();

  return (
    <Card className="group pt-0! overflow-hidden rounded-3xl bg-card/70 backdrop-blur transition-all hover:shadow-xl hover:-translate-y-1 cursor-pointer">

      <div className="relative w-full h-48 overflow-hidden">
        <img
          src={course.thumbnail_url}
          alt={course.title}
          // fill
          className="object-cover group-hover:scale-105 transition-transform duration-300"
        />

        {course.is_free && (
          <Badge className="absolute top-3 left-3 bg-primary text-primary-foreground">
            Free
          </Badge>
        )}
      </div>

      <CardContent className="p-3 space-y-3">

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

          <span>
            ⭐ {course.rating_avg.toFixed(1)}
          </span>

          <span>
            {course.enrolled_count} students
          </span>

        </div>

      </CardContent>
    </Card>
  );
}