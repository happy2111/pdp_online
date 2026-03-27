import { PlayCircle, FileText } from "lucide-react";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { TabsContent } from "@/components/ui/tabs";
import { CourseModule } from "@/schemas/modules-schema";

interface CurriculumProps {
  modules: CourseModule[];
}

export const CourseCurriculum = ({ modules }: CurriculumProps) => {
  return (
    <TabsContent value="curriculum" className="outline-none">
      <Accordion type="single" collapsible className="w-full space-y-3">
        {modules.map((module, index) => (
          <AccordionItem
            key={module.id}
            value={`module-${module.id}`}
            className="border border-border rounded-3xl px-4 bg-card/70 backdrop-blur overflow-hidden"
          >
            <AccordionTrigger className="hover:no-underline py-4">
              <div className="flex flex-col items-start text-left gap-1">
                <span className="font-semibold text-sm">
                  Модуль {index + 1}: {module.title}
                </span>
                <span className="text-xs text-muted-foreground font-normal">
                  {module.lessons.length} уроков
                  {module.is_free_preview && " • Бесплатный доступ"}
                </span>
              </div>
            </AccordionTrigger>

            <AccordionContent className="pt-2 pb-4 space-y-1">
              {module.lessons.map((lesson) => (
                <div
                  key={lesson.lesson_id}
                  className="flex items-center justify-between p-3 rounded-2xl hover:bg-muted/50 cursor-pointer transition-colors group"
                >
                  <div className="flex items-center gap-3">
                    {/* Если на бэкенде появится тип контента, можно менять иконку */}
                    <PlayCircle className="h-4 w-4 text-primary shrink-0 opacity-70 group-hover:opacity-100 transition-opacity" />
                    <span className="text-sm font-medium">{lesson.title}</span>
                  </div>

                  {/* Если в API нет длительности, можно просто поставить иконку или заглушку */}
                  <span className="text-[10px] uppercase tracking-wider text-muted-foreground font-medium px-2 py-1 bg-muted rounded-lg">
                    ID: {lesson.lesson_id}
                  </span>
                </div>
              ))}

              {module.lessons.length === 0 && (
                <div className="text-center py-4 text-sm text-muted-foreground">
                  В этом модуле пока нет уроков
                </div>
              )}
            </AccordionContent>
          </AccordionItem>
        ))}
      </Accordion>
    </TabsContent>
  );
};