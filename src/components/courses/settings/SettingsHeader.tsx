import React from 'react'
import { motion } from "framer-motion";
import {
  ArrowLeft,
  ChevronRight,
  Loader2,
  PencilLine,
  SendHorizonal,
  ShieldCheck,
  X
} from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { useRouter } from "@/i18n/navigation";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger
} from "@/components/ui/alert-dialog";
import {
  CourseDetails,
  CourseLevelEnum,
  CourseLevelLabels,
  CourseStatusEnum,
  CourseStatusLabels,
} from "@/schemas/courses-schema";
import { useTranslations } from "next-intl";
import { Badge } from "@/components/ui/badge";

interface Props {
  course: CourseDetails;
  isEditing: boolean;
  isPublishing: boolean;
  toggleEdit: () => void;
  handlePublish: () => void;
}

const levelColor: Record<CourseLevelEnum, string> = {
  BEGINNER: "bg-green-500/10 text-green-600 ring-green-500/20",
  INTERMEDIATE: "bg-yellow-500/10 text-yellow-600 ring-yellow-500/20",
  ADVANCED: "bg-red-500/10 text-red-600 ring-red-500/20",
}

const statusColor: Record<CourseStatusEnum, string> = {
  DRAFT: "bg-gray-500/10 text-gray-600 ring-gray-500/20",
  PUBLISHED: "bg-green-500/10 text-green-600 ring-green-500/20",
  ARCHIVED: "bg-red-500/10 text-red-600 ring-red-500/20",
}

const SettingsHeader = ({
                          course,
                          isEditing,
                          isPublishing,
                          toggleEdit,
                          handlePublish
                        }: Props) => {

  const t = useTranslations();
  const router = useRouter();

  const isPublished = course.status === "PUBLISHED";

  return (
    <motion.div
      initial="hidden"
      animate="visible"
      className="mb-8 flex items-start justify-between gap-4 flex-wrap"
    >
      <div className="flex items-center gap-3">
        <Button
          variant="ghost"
          size="icon"
          onClick={() => router.back()}
          className="h-9 w-9 rounded-xl text-muted-foreground hover:text-foreground"
        >
          <ArrowLeft className="h-5 w-5" />
        </Button>

        <div>
          <div className="flex items-center gap-2 text-xs text-muted-foreground mb-1">
            <span>{t("courses.settings.my_courses")}</span>
            <ChevronRight className="h-3 w-3" />
            <span className="text-foreground font-medium truncate max-w-[200px]">
              {course.title}
            </span>
          </div>

          <div className="flex items-center gap-2 flex-wrap">
            <h1 className="text-2xl md:text-3xl font-semibold tracking-tight leading-tight">
              {t("courses.settings.title")}
            </h1>

            <Badge
              className={cn(
                "rounded-full px-3 py-1 text-xs font-medium ring-1",
                statusColor[course.status]
              )}
            >
              {t(CourseStatusLabels[course.status])}
            </Badge>
          </div>
        </div>
      </div>

      <div className="flex items-center gap-2 shrink-0">

        <Badge
          className={cn(
            "rounded-full px-3 py-1 text-xs font-medium ring-1",
            levelColor[course.level]
          )}
        >
          {t(CourseLevelLabels[course.level])}
        </Badge>

        <AlertDialog>
          <AlertDialogTrigger asChild>
            <Button
              variant="outline"
              size="sm"
              disabled={isPublishing || isPublished}
              className={cn(
                "h-9 gap-1.5 rounded-xl font-medium",
                isPublished
                  ? "opacity-60 cursor-not-allowed"
                  : "border-primary/30 text-primary hover:bg-primary/5"
              )}
            >
              {isPublishing ? (
                <>
                  <Loader2 className="h-3.5 w-3.5 animate-spin" />
                  {t("courses.settings.publishing")}
                </>
              ) : isPublished ? (
                <>
                  <ShieldCheck className="h-3.5 w-3.5" />
                  {t("courses.settings.published")}
                </>
              ) : (
                <>
                  <SendHorizonal className="h-3.5 w-3.5" />
                  {t("courses.settings.publish")}
                </>
              )}
            </Button>
          </AlertDialogTrigger>

          {!isPublished && (
            <AlertDialogContent>
              <AlertDialogHeader>
                <AlertDialogTitle className="flex items-center gap-2">
                  <ShieldCheck className="h-5 w-5 text-primary" />
                  {t("courses.settings.publish_confirm_title")}
                </AlertDialogTitle>

                <AlertDialogDescription>
                  {t("courses.settings.publish_confirm_desc")}
                </AlertDialogDescription>
              </AlertDialogHeader>

              <AlertDialogFooter>
                <AlertDialogCancel>
                  {t("common.cancel")}
                </AlertDialogCancel>

                <AlertDialogAction
                  onClick={handlePublish}
                  className="bg-primary hover:bg-primary/90"
                >
                  {t("courses.settings.publish_confirm_action")}
                </AlertDialogAction>
              </AlertDialogFooter>
            </AlertDialogContent>
          )}
        </AlertDialog>

        <Button
          variant="ghost"
          size="icon"
          onClick={toggleEdit}
          className={cn(
            "h-9 w-9 rounded-full transition-colors",
            isEditing
              ? "bg-destructive/10 text-destructive hover:bg-destructive/20"
              : "hover:bg-primary/10 text-muted-foreground hover:text-primary"
          )}
        >
          {isEditing
            ? <X className="h-5 w-5" />
            : <PencilLine className="h-5 w-5" />
          }
        </Button>

      </div>
    </motion.div>
  )
}

export default SettingsHeader;