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
        <Button variant="outline" size="icon">
          <Languages className="h-[1.2rem] w-[1.2rem]" />
          <span className="sr-only">Toggle language</span>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        {languages.map((lang) => (
          <DropdownMenuItem
            key={lang.code}
            onClick={() => handleLanguageChange(lang.code)}
            className={currentLocale === lang.code ? "bg-accent font-bold" : ""}
          >
            {lang.label}
          </DropdownMenuItem>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  )
}