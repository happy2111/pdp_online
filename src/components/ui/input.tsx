import * as React from "react"
import { cn } from "@/lib/utils"

function Input({ className, type, ...props }: React.ComponentProps<"input">) {
  return (
    <input
      type={type}
      data-slot="input"
      className={cn(
        "h-11 w-full min-w-0 rounded-lg border border-border/60 bg-background px-4 text-sm shadow-sm transition-all duration-200 outline-none",
        "placeholder:text-muted-foreground/70",
        "focus:border-primary focus:ring-2 focus:ring-primary/30",
        "disabled:pointer-events-none disabled:cursor-not-allowed disabled:opacity-50",
        "dark:bg-input/40",
        className
      )}
      {...props}
    />
  )
}

export { Input }