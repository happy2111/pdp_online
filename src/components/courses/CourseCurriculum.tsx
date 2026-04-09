import { PlayCircle, Lock } from "lucide-react";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { TabsContent } from "@/components/ui/tabs";
import { CourseModule } from "@/schemas/modules-schema";
import { formatDuration } from "@/lib/utils";
import { useRouter } from "@/i18n/navigation";
import {useTranslations} from "next-intl";

interface CurriculumProps {
  modules: CourseModule[];
  courseSlug: string;
}

export const CourseCurriculum = ({ modules, courseSlug }: CurriculumProps) => {
  const router = useRouter();
  const t = useTranslations();

  return (
    <TabsContent value="curriculum" className="outline-none pb-3">
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
                  {t("common.module")} {index + 1}: {module.title}
                </span>

                <span className="text-xs text-muted-foreground font-normal">
                  {module.lessons.length} {t("common.lesson_many")}
                </span>
              </div>
            </AccordionTrigger>

            <AccordionContent className="pt-2 pb-4 space-y-1">
              {module.lessons.map((lesson) => {
                const isLocked = !lesson.is_free_preview;

                return (
                  <div
                    key={lesson.lesson_id}
                    onClick={() => {
                      if (!isLocked) {
                        router.push(
                          `/courses/${courseSlug}/learn/${lesson.lesson_id}`
                        );
                      }
                    }}
                    className={`flex items-center justify-between p-3 rounded-2xl transition-all group
                      ${
                      isLocked
                        ? "opacity-50 cursor-not-allowed"
                        : "hover:bg-muted/50 cursor-pointer"
                    }
                    `}
                  >
                    <div className="flex items-center gap-3">
                      {isLocked ? (
                        <Lock className="h-4 w-4 text-muted-foreground" />
                      ) : (
                        <PlayCircle className="h-4 w-4 text-primary shrink-0 opacity-70 group-hover:opacity-100 transition-opacity" />
                      )}

                      <span className="text-sm font-medium">
                        {lesson.title}
                      </span>
                    </div>

                    <span className="text-[10px] uppercase tracking-wider text-muted-foreground font-medium px-2 py-1 bg-muted rounded-lg">
                      {formatDuration(lesson?.duration_seconds)}
                    </span>
                  </div>
                );
              })}

              {module.lessons.length === 0 && (
                <div className="text-center py-4 text-sm text-muted-foreground">
                  {t("module.empty_lessons")}
                </div>
              )}
            </AccordionContent>
          </AccordionItem>
        ))}
      </Accordion>
    </TabsContent>
  );
};