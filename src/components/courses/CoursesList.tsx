"use client";

import { useEffect, useState } from "react";
import { useSearchParams, useRouter } from "next/navigation"; // Импортируем хуки
import { CoursesService } from "@/services/courses-service";
import { CourseListItem } from "@/schemas/courses-schema";
import { CourseCard } from "./CourseCard";
import { Button } from "@/components/ui/button";
import { ChevronRight, Loader2 } from "lucide-react";
import { useTranslations } from "next-intl";
import { CategoryFilter } from "./CategoryFilter";

export function CoursesList() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const t = useTranslations();

  const page = Number(searchParams.get("page")) || 0;
  const categoryId = searchParams.get("category_id")
    ? Number(searchParams.get("category_id"))
    : undefined;
  const search = searchParams.get("search") || "";

  const [courses, setCourses] = useState<CourseListItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [totalPages, setTotalPages] = useState(0);
  const [size] = useState(12);

  const fetchCourses = async () => {
    setLoading(true);
    try {
      const res = await CoursesService.getAllCourses({
        page,
        size,
        category_id: categoryId,
        search,
      });

      setCourses(res.data);
      setTotalPages(res.total_pages);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCourses();
  }, [page, categoryId, search]);

  // Функция для обновления параметров в URL (пагинация)
  const updateUrl = (newPage: number) => {
    const params = new URLSearchParams(searchParams.toString());
    params.set("page", newPage.toString());
    router.push(`?${params.toString()}`, { scroll: false });
  };

  return (
    <div id="courses-list">
      {/* Вызов фильтра сверху списка */}
      <CategoryFilter />

      {loading ? (
        <div className="flex justify-center items-center h-64 text-primary">
          <Loader2 className="w-8 h-8 animate-spin" />
        </div>
      ) : (
        <>
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
            {courses.length > 0 ? (
              courses.map((course) => (
                <CourseCard key={course.id} course={course} />
              ))
            ) : (
              <div className="col-span-full text-center py-10 opacity-50">
                Курсы не найдены
              </div>
            )}
          </div>

          {/* Пагинация */}
          <div className="mt-6 flex items-center justify-center gap-4">
            <Button
              variant="outline"
              size="sm"
              onClick={() => updateUrl(page - 1)}
              disabled={page === 0}
            >
              <ChevronRight className="rotate-180 w-4 h-4 mr-1"/>
              {t('common.previous')}
            </Button>

            <span className="text-sm font-medium">
              {page + 1} / {totalPages}
            </span>

            <Button
              variant="outline"
              size="sm"
              onClick={() => updateUrl(page + 1)}
              disabled={page + 1 >= totalPages}
            >
              {t('common.next')}
              <ChevronRight className="w-4 h-4 ml-1"/>
            </Button>
          </div>
        </>
      )}
    </div>
  );
}