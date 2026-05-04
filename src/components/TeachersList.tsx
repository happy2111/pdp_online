"use client";

import { useEffect, useState } from "react";
import { TeachersService } from "@/services/teachers-service";
import { TeachersSchema } from "@/schemas/teachers-schema";
import { Loader2 } from "lucide-react";
import {TeacherCard} from "@/components/TeacherCard";

const BANNER_COLORS = [
  "from-blue-100 to-blue-200",
  "from-green-100 to-green-200",
  "from-amber-100 to-amber-200",
  "from-pink-100 to-pink-200",
  "from-purple-100 to-purple-200",
  "from-teal-100 to-teal-200",
];

const AVATAR_COLORS = [
  "bg-blue-500",
  "bg-green-500",
  "bg-amber-500",
  "bg-pink-500",
  "bg-purple-500",
  "bg-teal-500",
];

function getInitials(name: string) {
  return name
    .split(" ")
    .slice(0, 2)
    .map((w) => w[0])
    .join("")
    .toUpperCase();
}

interface TeacherCardProps {
  teacher: TeachersSchema;
  index: number;
}


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
    <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
      {teachers.map((teacher, i) => (
        <TeacherCard key={teacher.id} teacher={teacher} index={i} />
      ))}
    </div>
  );
}