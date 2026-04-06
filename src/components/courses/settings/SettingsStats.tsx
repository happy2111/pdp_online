import React from 'react'
import {motion} from "framer-motion";
import {BarChart3, BookOpen, DollarSign, Play} from "lucide-react";
import {CourseDetails} from "@/schemas/courses-schema";

interface Props {
  course: CourseDetails
}

const SettingsStats = (props: Props) => {
  const { course } = props
  return (
    <motion.div initial="hidden" animate="visible" custom={1}
                className="mb-8 grid grid-cols-2 sm:grid-cols-4 gap-3">
      {[
        { label: "Студентов", value: course.enrolled_count, icon: BookOpen },
        { label: "Рейтинг", value: course.rating_avg.toFixed(1), icon: BarChart3 },
        { label: "Часов", value: course.duration_hours, icon: Play },
        { label: "Цена", value: course.price != null ? `${course.price} so'm` : "Бесплатно", icon: DollarSign },
      ].map(({ label, value, icon: Icon }) => (
        <div key={label} className="rounded-xl border border-border/60 bg-card/60 backdrop-blur-sm px-4 py-3 flex items-center gap-3">
          <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary/10 text-primary shrink-0">
            <Icon className="h-4 w-4" />
          </div>
          <div className="min-w-0">
            <p className="text-[11px] text-muted-foreground">{label}</p>
            <p className="text-base font-semibold leading-tight truncate">{value}</p>
          </div>
        </div>
      ))}
    </motion.div>

  )
}
export default SettingsStats
