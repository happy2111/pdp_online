"use client";

import { useEffect, useState } from "react";
import { CoursesService } from "@/services/courses-service";
import { CourseListItem } from "@/schemas/courses-schema";
import { CourseCard } from "./CourseCard";
import { Button } from "@/components/ui/button";
import { Loader2, GraduationCap, ChevronLeft, ChevronRight } from "lucide-react";
import { useTranslations } from "next-intl";

export function EnrolledCoursesList({ userId }: { userId: number }) {
  const t = useTranslations();

  const [courses, setCourses] = useState<CourseListItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(0);
  const [totalPages, setTotalPages] = useState(0);
  const [pageSize] = useState(6); // Выведем по 6 курсов на страницу

  const fetchEnrolledCourses = async (currentPage: number) => {
    setLoading(true);
    try {
      const res = await CoursesService.getEnrolledCourses({
        page: currentPage,
        size: pageSize
      });

      // Обрати внимание: в ApiResponseItems данные лежат в res.items
      setCourses(res.items);
      setTotalPages(res.total_pages);
    } catch (err) {
      console.error("Failed to fetch enrolled courses:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchEnrolledCourses(page);
  }, [page]);

  const handlePageChange = (newPage: number) => {
    setPage(newPage);
    // Скролл к началу списка при смене страницы (опционально)
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  if (loading && page === 0) {
    return (
      <div className="flex justify-center items-center h-64">
        <Loader2 className="w-8 h-8 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold">{t('profile.enrolled_tab')}</h2>
      </div>

      {courses.length > 0 ? (
        <>
          <div className="grid gap-6 sm:grid-cols-1 lg:grid-cols-2 xl:grid-cols-3">
            {courses.map((course) => (
              <CourseCard key={course.id} course={course} isOwner={false} />
            ))}
          </div>

          {/* Пагинация */}
          {totalPages > 1 && (
            <div className="mt-8 flex items-center justify-center gap-4">
              <Button
                variant="outline"
                size="sm"
                className="rounded-xl"
                onClick={() => handlePageChange(page - 1)}
                disabled={page === 0 || loading}
              >
                <ChevronLeft className="w-4 h-4 mr-1" />
                {t('common.previous')}
              </Button>

              <span className="text-sm font-medium bg-muted px-4 py-2 rounded-lg">
                {page + 1} / {totalPages}
              </span>

              <Button
                variant="outline"
                size="sm"
                className="rounded-xl"
                onClick={() => handlePageChange(page + 1)}
                disabled={page + 1 >= totalPages || loading}
              >
                {t('common.next')}
                <ChevronRight className="w-4 h-4 ml-1" />
              </Button>
            </div>
          )}
        </>
      ) : (
        <div className="flex flex-col items-center justify-center py-20 bg-muted/30 rounded-3xl border-2 border-dashed">
          <GraduationCap className="w-12 h-12 text-muted-foreground mb-4" />
          <h3 className="text-lg font-medium">{t('courses.no_courses_yet')}</h3>
          <p className="text-muted-foreground mb-6">
            Вы еще не записались ни на один курс. Самое время начать учиться!
          </p>
          <Button onClick={() => window.location.href = '/courses'} variant="default">
            {t('common.allCourses')}
          </Button>
        </div>
      )}
    </div>
  );
}