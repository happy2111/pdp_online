"use client";

import { useEffect, useState } from "react";
import { CoursesService } from "@/services/courses-service";
import { CourseListItem } from "@/schemas/courses-schema";
import { CourseCard } from "./CourseCard";
import { Button } from "@/components/ui/button";
import { Loader2, PlusCircle, FolderOpen } from "lucide-react";
import { useTranslations } from "next-intl";
import { CreateCourseDialog } from "./CreateCourseDialog";

export function MyCoursesList({ userId }: { userId: number }) {
  const t = useTranslations();
  const [courses, setCourses] = useState<CourseListItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [isCreateOpen, setIsCreateOpen] = useState(false);

  const fetchMyCourses = async () => {
    setLoading(true);
    try {
      const res = await CoursesService.getMyCourses({ page: 0, size: 100 });
      setCourses(res.items);
    } catch (err) {
      console.error("Failed to fetch my courses:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchMyCourses();
  }, []);

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <Loader2 className="w-8 h-8 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap max-sm:flex-col max-sm:gap-3 justify-between ms:items-center">
        <h2 className="text-2xl font-bold">{t('profile.my_courses')}</h2>
        <Button onClick={() => setIsCreateOpen(true)} className="rounded-full">
          <PlusCircle className="w-4 h-4 mr-2" />
          {t('courses.create_new')}
        </Button>
      </div>

      {courses.length > 0 ? (
        <div className=" grid gap-6  sm:grid-cols-1 lg:grid-cols-2 xl:grid-cols-3">
          {courses.map((course) => (
            <CourseCard key={course.id} course={course} isOwner={true} />
          ))}
        </div>
      ) : (
        <div className="flex flex-col items-center justify-center py-20 bg-muted/30 rounded-3xl border-2 border-dashed">
          <FolderOpen className="w-12 h-12 text-muted-foreground mb-4" />
          <h3 className="text-lg font-medium">{t('courses.no_courses_yet')}</h3>
          <p className="text-muted-foreground mb-6">{t('courses.start_teaching_desc')}</p>
          <Button onClick={() => setIsCreateOpen(true)} variant="default">
            {t('courses.create_first_course')}
          </Button>
        </div>
      )}

      <CreateCourseDialog
        open={isCreateOpen}
        onOpenChange={setIsCreateOpen}
        onSuccess={fetchMyCourses}
      />
    </div>
  );
}