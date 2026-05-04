"use client";

import { TeachersSchema } from "@/schemas/teachers-schema";

const AVATAR_COLORS = [
  "bg-blue-300 dark:bg-blue-200/30",
  "bg-green-300 dark:bg-green-200/30",
  "bg-amber-300 dark:bg-amber-200/30",
  "bg-pink-300 dark:bg-pink-200/30",
  "bg-purple-300 dark:bg-purple-200/30",
  "bg-teal-300 dark:bg-teal-200/30",
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

export function TeacherCard({ teacher, index }: TeacherCardProps) {
  const colorIdx = index % AVATAR_COLORS.length;
  const avatarColor = AVATAR_COLORS[colorIdx];

  return (
    <div className="group relative rounded-3xl bg-card/70 ring-1 ring-border/50 overflow-hidden cursor-pointer transition-all duration-500 hover:-translate-y-1.5 hover:shadow-2xl hover:shadow-primary/5 flex flex-col">

      <div className="relative w-full h-40 overflow-hidden">
        {teacher.avatar_url ? (
          <img
            src={teacher.avatar_url}
            alt={teacher.full_name}
            className="object-cover w-full h-full transition-transform duration-700 ease-out group-hover:scale-110"
          />
        ) : (
          <div className={`w-full h-full ${avatarColor} flex items-center justify-center`}>
            <span className="text-4xl font-bold text-white/80">
              {getInitials(teacher.full_name)}
            </span>
          </div>
        )}
        <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
      </div>

      <div className="flex-1 flex flex-col px-4 pb-4 pt-3 text-center">
        <h3 className="font-bold text-sm leading-tight group-hover:text-primary transition-colors line-clamp-1">
          {teacher.full_name}
        </h3>
        <p className="text-muted-foreground text-xs mt-1 line-clamp-1">
          {teacher.department}
        </p>

        <div className="my-3 border-t border-dashed border-border" />

        <div className="flex justify-center gap-5 mt-auto">
          <div className="flex flex-col items-center gap-0.5">
            <span className="text-sm font-bold text-foreground">
              {teacher.experience_year}
            </span>
            <span className="text-[10px] uppercase tracking-wider font-semibold text-muted-foreground/70">
              лет
            </span>
          </div>
          {/*{teacher.students_count != null && (*/}
          {/*  <div className="flex flex-col items-center gap-0.5">*/}
          {/*    <span className="text-sm font-bold text-foreground">*/}
          {/*      {teacher.students_count}*/}
          {/*    </span>*/}
          {/*    <span className="text-[10px] uppercase tracking-wider font-semibold text-muted-foreground/70">*/}
          {/*      студентов*/}
          {/*    </span>*/}
          {/*  </div>*/}
          {/*)}*/}
          {/*{teacher.rating != null && (*/}
          {/*  <div className="flex flex-col items-center gap-0.5">*/}
          {/*    <span className="text-sm font-bold text-foreground">*/}
          {/*      {teacher.rating.toFixed(1)}*/}
          {/*    </span>*/}
          {/*    <span className="text-[10px] uppercase tracking-wider font-semibold text-muted-foreground/70">*/}
          {/*      рейтинг*/}
          {/*    </span>*/}
          {/*  </div>*/}
          {/*)}*/}
        </div>
      </div>
    </div>
  );
}