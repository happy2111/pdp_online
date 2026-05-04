"use client";

import { useEffect, useState } from "react";
import { TeachersService } from "@/services/teachers-service";
import { TeachersSchema } from "@/schemas/teachers-schema";
import { Loader2 } from "lucide-react";
import {TeacherCard} from "@/components/TeacherCard";


export function TeachersList() {
  const [teachers, setTeachers] = useState<TeachersSchema[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    TeachersService.getAllTeachers()
      .then((res) => setTeachers(res.data))
      .catch(console.error)
      .finally(() => setLoading(false));
  }, []);

  if (loading) {
    return (
      <div className="min-w-full grid gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
        {[1, 2, 3, 4].map((_, i) => (
          <div className="rounded-3xl bg-card/70 ring-1 ring-border/50 overflow-hidden animate-pulse flex flex-col">
            <div className="w-full h-40 bg-muted" />
            <div className="flex-1 flex flex-col px-4 pb-4 pt-3 text-center">
              <div className="h-4 w-32 mx-auto bg-muted rounded-md" />
              <div className="h-3 w-24 mx-auto bg-muted rounded-md mt-2" />
              <div className="my-3 border-t border-dashed border-border" />
              <div className="flex justify-center gap-5 mt-auto">
                <div className="flex flex-col items-center gap-1">
                  <div className="h-4 w-6 bg-muted rounded-md" />
                  <div className="h-3 w-8 bg-muted rounded-md" />
                </div>
                <div className="flex flex-col items-center gap-1">
                  <div className="h-4 w-6 bg-muted rounded-md" />
                  <div className="h-3 w-14 bg-muted rounded-md" />
                </div>
                <div className="flex flex-col items-center gap-1">
                  <div className="h-4 w-6 bg-muted rounded-md" />
                  <div className="h-3 w-12 bg-muted rounded-md" />
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

    );
  }

  if (teachers.length === 0) {
    return (
      <div className="col-span-full text-center py-10 text-muted-foreground/50">
        Учителя не найдены
      </div>
    );
  }

  return (
    <div className="min-w-full grid gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
      {teachers.map((teacher, i) => (
        <TeacherCard key={teacher.id} teacher={teacher} index={i} />
      ))}
    </div>
  );
}