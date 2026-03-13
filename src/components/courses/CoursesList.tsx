"use client";

import { useEffect, useState } from "react";
import { CoursesService } from "@/services/courses-service";
import { CourseListItem } from "@/schemas/courses-schema";
import { CourseCard } from "./CourseCard";

export function CoursesList() {
  const [courses, setCourses] = useState<CourseListItem[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    CoursesService.getAllCourses().then((res) => {
      setCourses(res.data);
      setLoading(false);
    });
  }, []);

  if (loading) {
    return (
      <div className="text-center py-20 text-muted-foreground">
        Loading courses...
      </div>
    );
  }

  return (
    <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
      {courses.map((course) => (
        <CourseCard key={course.id} course={course} />
      ))}
    </div>
  );
}