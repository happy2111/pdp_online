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
      <div className="flex justify-center items-center h-64 text-primary">
        <Loader2 className="w-8 h-8 animate-spin" />
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