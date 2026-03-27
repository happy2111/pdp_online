'use client'

import { CourseDetails } from "@/schemas/courses-schema"
import { PlayCircle, Clock, FileText, Layout, Award, Share2 } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"

export const CourseSidebar = ({ course }: { course: CourseDetails }) => {
  return (
    <Card className="sticky pt-0! top-0 overflow-hidden rounded-3xl bg-card/70 backdrop-blur border border-border transition-all hover:shadow-xl">

      <div className="relative group cursor-pointer">
        <img
          src={course.thumbnail_url}
          alt={course.title}
          className="aspect-video w-full object-cover transition-transform duration-300 group-hover:scale-105"
        />
        <div className="absolute inset-0 flex items-center justify-center bg-black/40 group-hover:bg-black/20 transition-colors">
          <PlayCircle className="h-14 w-14 text-white drop-shadow-lg" />
        </div>
      </div>

      <CardContent className="p-5 space-y-5">

        <div className="space-y-0.5">
          <div className="text-2xl font-bold">Бесплатно</div>
          <p className="text-sm text-muted-foreground line-through">{course.price} so'm</p>
        </div>

        <Button className="w-full h-11 text-base font-semibold rounded-2xl bg-primary hover:bg-primary/90">
          Начать обучение
        </Button>

        <div className="space-y-3 pt-1">
          <h4 className="font-semibold text-xs uppercase tracking-wider text-muted-foreground">
            В этот курс входит:
          </h4>
          <ul className="space-y-2.5 text-sm">
            {[
              { icon: Clock,    label: `${course.duration_hours} часов видео` },
              { icon: FileText, label: "Статьи и ресурсы" },
              { icon: Layout,   label: "Практические задания" },
              { icon: Award,    label: "Сертификат об окончании" },
            ].map(({ icon: Icon, label }) => (
              <li key={label} className="flex items-center gap-3 text-foreground/80">
                <Icon className="h-4 w-4 text-primary shrink-0" />
                {label}
              </li>
            ))}
          </ul>
        </div>

        <Button
          variant="ghost"
          className="w-full text-muted-foreground hover:text-primary-foreground rounded-2xl"
        >
          <Share2 className="mr-2 h-4 w-4" /> Поделиться курсом
        </Button>

      </CardContent>
    </Card>
  )
}