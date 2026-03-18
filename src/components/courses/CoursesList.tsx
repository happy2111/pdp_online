"use client";

import { useEffect, useState } from "react";
import { CoursesService } from "@/services/courses-service";
import { CourseListItem, GetAllCoursesParams } from "@/schemas/courses-schema";
import { CourseCard } from "./CourseCard";
import { Button } from "@/components/ui/button";
import {AlignRight, ChevronRight} from "lucide-react";
import {useTranslations} from "next-intl";

export function CoursesList() {
  const [courses, setCourses] = useState<CourseListItem[]>([]);
  const [loading, setLoading] = useState(true);

  const [page, setPage] = useState(0);
  const [size] = useState(12);
  const [totalPages, setTotalPages] = useState(0);
  const [totalElements, setTotalElements] = useState(0);

  const [categoryId, setCategoryId] = useState<number | undefined>(undefined);
  const [search, setSearch] = useState<string>("");

  const t = useTranslations();

  const fetchCourses = async (params?: GetAllCoursesParams) => {
    setLoading(true);
    try {
      const res = await CoursesService.getAllCourses({
        page,
        size,
        category_id: categoryId,
        search,
        ...params,
      });

      setCourses(res.data);
      setTotalPages(res.total_pages);
      setTotalElements(res.total_elements);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCourses();
  }, [page, categoryId, search]);

  const nextPage = () => setPage((prev) => Math.min(prev + 1, totalPages - 1));
  const prevPage = () => setPage((prev) => Math.max(prev - 1, 0));

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearch(e.target.value);
    setPage(0); // Сбрасываем на первую страницу при поиске
  };

  return (
    <div>
      {/* Поиск */}
      {/*<div className="mb-4 flex gap-2">*/}
      {/*  <input*/}
      {/*    type="text"*/}
      {/*    placeholder={t('courses.list.searchPlaceholder')}*/}
      {/*      value={search}*/}
      {/*    onChange={handleSearchChange}*/}
      {/*    className="flex-1 border p-2 rounded"*/}
      {/*  />*/}
      {/*</div>*/}

      {loading ? (
        <div className="...">
          {t('courses.list.loading')}
        </div>
      ) : (
        <>
          {/*/!* Пагинация сверху *!/*/}
          {/*<div className="mb-4 text-center text-sm text-muted-foreground">*/}
          {/*  /!* На мобилках (hidden), на планшетах и выше (sm:inline) *!/*/}
          {/*  <span className="hidden sm:inline">*/}
          {/*    {t('courses.list.pagination', { page: page + 1, total: totalPages, count: totalElements })}*/}
          {/*  </span>*/}

          {/*            /!* Только для мобилок *!/*/}
          {/*            <span className="sm:hidden">*/}
          {/*    {t('courses.list.pageInfo', { page: page + 1, total: totalPages })}*/}
          {/*  </span>*/}
          {/*</div>*/}

          {/* Список курсов */}
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
            {courses.map((course) => (
              <CourseCard key={course.id} course={course} />
            ))}
          </div>

          {/* Пагинация снизу */}
          <div className="mt-6 flex items-center justify-center gap-4">
            <Button
              variant="outline"
              size="sm"
              onClick={prevPage}
              disabled={page === 0}
            >
              <ChevronRight className="rotate-180 w-4 h-4 mr-1"/>
              {t('common.previous')} {/* "Назад" */}
            </Button>
            <span className="text-sm font-medium">
              {page + 1} / {totalPages}
            </span>

            <Button
              variant="outline"
              size="sm"
              onClick={nextPage}
              disabled={page + 1 >= totalPages}
            >
              {t('common.next')} {/* "Далее" */}
              <ChevronRight className="w-4 h-4 ml-1"/>
            </Button>
          </div>
        </>
      )}
    </div>
  );
}