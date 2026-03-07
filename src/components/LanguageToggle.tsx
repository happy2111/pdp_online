"use client"

import * as React from "react"
import { Languages } from "lucide-react"
import { usePathname, useRouter } from "@/i18n/navigation"
import { useParams } from "next/navigation"

import { Button } from "@/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"

export function LanguageToggle() {
  const router = useRouter()
  const pathname = usePathname()
  const params = useParams()

  // Получаем текущую локаль из параметров пути
  const currentLocale = params.locale as string

  const languages = [
    { code: "ru", label: "Русский" },
    { code: "uz", label: "O'zbekcha" },
  ]

  const handleLanguageChange = (nextLocale: string) => {
    // router.replace автоматически подставит нужный префикс
    router.replace(pathname, { locale: nextLocale })
  }

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button
          variant="ghost"
          size="icon"
          className="hover:bg-emerald-500/10 transition-colors"
        >
          <Languages className="h-[1.2rem] w-[1.2rem] text-foreground/70" />
          <span className="sr-only">Toggle language</span>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="backdrop-blur-md bg-background/80">
        {languages.map((lang) => (
          <DropdownMenuItem
            key={lang.code}
            onClick={() => handleLanguageChange(lang.code)}
            className={currentLocale === lang.code ? "bg-emerald-500/20 font-bold" : ""}
          >
            {lang.label}
          </DropdownMenuItem>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  )
}