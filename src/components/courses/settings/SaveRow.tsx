'use client'


import {AnimatePresence, motion} from "framer-motion";
import {Button} from "@/components/ui/button";
import {cn} from "@/lib/utils";
import {Loader2, PencilLine, Save} from "lucide-react";
import {useTranslations} from "next-intl";

export default function SaveRow({ isEditing, isPending, isDirty, t }: {
  isEditing: boolean
  isPending: boolean
  isDirty: boolean
  t: ReturnType<typeof useTranslations>
}) {
  return (
    <div className="flex justify-end pt-2">
      <AnimatePresence mode="wait">
        {isEditing ? (
          <motion.div key="save" initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.95 }}>
            <Button type="submit" disabled={isPending || !isDirty}
                    className={cn("min-w-36 h-11 rounded-xl font-medium transition-all",
                      isDirty ? "shadow-sm" : "bg-muted text-muted-foreground")}>
              {isPending
                ? <><Loader2 className="mr-2 h-4 w-4 animate-spin" />{t("common.loading")}</>
                : <><Save className="mr-2 h-4 w-4" />{t("common.save")}</>
              }
            </Button>
          </motion.div>
        ) : (
          <motion.div key="hint" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
            <p className="text-xs text-muted-foreground py-3">
              Нажмите <PencilLine className="inline h-3 w-3" /> чтобы редактировать
            </p>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}