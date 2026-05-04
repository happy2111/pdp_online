"use client";

import { useEffect, useState } from "react";
import { TeachersService } from "@/services/teachers-service";
import { TeachersSchema } from "@/schemas/teachers-schema";
import { Loader2 } from "lucide-react";

export function TeachersList() {
  const [teachers, setTeachers] = useState<TeachersSchema[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchTeachers = async () => {
    setLoading(true);
    try {
      const res = await TeachersService.getAllTeachers();
      setTeachers(res.data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTeachers();
  }, []);

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64 text-primary">
        <Loader2 className="w-8 h-8 animate-spin" />
      </div>
    );
  }

  return (
    <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
      {teachers.length > 0 ? (
        teachers.map((t) => (
          <div
            key={t.id}
            className="p-4 rounded-xl border bg-background"
          >
            <img
              src={t.avatar_url}
              alt={t.full_name}
              className="w-20 h-20 rounded-full mb-3"
            />

            <h3 className="font-semibold">{t.full_name}</h3>

            <p className="text-sm opacity-60">
              {t.department}
            </p>

            <p className="text-xs mt-2">
              {t.experience_year} лет опыта
            </p>
          </div>
        ))
      ) : (
        <div className="col-span-full text-center py-10 opacity-50">
          Учителя не найдены
        </div>
      )}
    </div>
  );
}