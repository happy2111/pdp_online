'use client'
import { Label } from "@/components/ui/label";
import {useState} from "react";
import {AnimatePresence, motion} from "framer-motion";
import {CheckCircle2, Plus, X} from "lucide-react";
import {Input} from "@/components/ui/input";
import {Button} from "@/components/ui/button";

export default function StringListEditor({
                            label, items, onChange, placeholder, disabled,
                          }: {
  label: string
  items: string[]
  onChange: (v: string[]) => void
  placeholder?: string
  disabled?: boolean
}) {
  const [draft, setDraft] = useState("")
  const add = () => {
    if (!draft.trim()) return
    onChange([...items, draft.trim()])
    setDraft("")
  }
  const remove = (idx: number) => onChange(items.filter((_, i) => i !== idx))

  return (
    <div className="space-y-3">
      <Label>{label}</Label>
      <div className="space-y-2">
        <AnimatePresence initial={false}>
          {items.map((item, idx) => (
            <motion.div
              key={idx}
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 10 }}
              className="flex items-center gap-2 rounded-lg border border-border/60 bg-muted/30 px-3 py-2 text-sm"
            >
              <CheckCircle2 className="h-3.5 w-3.5 shrink-0 text-primary" />
              <span className="flex-1 text-foreground/90">{item}</span>
              {!disabled && (
                <button type="button" onClick={() => remove(idx)}
                        className="text-muted-foreground hover:text-destructive transition-colors">
                  <X className="h-3.5 w-3.5" />
                </button>
              )}
            </motion.div>
          ))}
        </AnimatePresence>
      </div>
      {!disabled && (
        <div className="flex gap-2">
          <Input
            value={draft}
            onChange={e => setDraft(e.target.value)}
            onKeyDown={e => e.key === "Enter" && (e.preventDefault(), add())}
            placeholder={placeholder}
            className="h-10 text-sm"
          />
          <Button type="button" variant="outline" size="sm" onClick={add} className="h-10 px-3 shrink-0">
            <Plus className="h-4 w-4" />
          </Button>
        </div>
      )}
    </div>
  )
}