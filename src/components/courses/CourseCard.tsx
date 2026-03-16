"use client";

import {CourseLevelLabels, CourseListItem} from "@/schemas/courses-schema";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import Image from "next/image";
import {useTranslations} from "next-intl";
import {Star} from "lucide-react";

interface Props {
  course: CourseListItem;
}

export function CourseCard({ course }: Props) {
  const t = useTranslations();

  return (
    <Card className="group pt-0! gap-2 overflow-hidden rounded-3xl bg-card/70 backdrop-blur transition-all hover:shadow-xl hover:-translate-y-1 cursor-pointer">
      <div className="relative w-full h-32 overflow-hidden">
        <img
          src={course.thumbnail_url}
          alt={course.title}
          className="object-cover group-hover:scale-105 transition-transform duration-300"
        />
        {course.is_free && (
          <Badge className="absolute top-3 left-3 bg-primary text-primary-foreground">
            Free
          </Badge>
        )}
      </div>

      <CardContent className="px-3">

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
            <Star className="size-4 text-yellow-400"/> {course.rating_avg.toFixed(1)}
          </span>

          <span>
            {course.enrolled_count} students
          </span>

        </div>

      </CardContent>
    </Card>
  );
}