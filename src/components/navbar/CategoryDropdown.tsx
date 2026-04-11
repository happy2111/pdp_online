"use client"

import * as React from "react"
import { useState, useEffect } from "react"
import { useSearchParams } from "next/navigation";
import { useRouter } from "@/i18n/navigation";
import { ChevronRight, LayoutGrid, Loader2 } from "lucide-react"
import { Button } from "@/components/ui/button"
import { CategoriesService } from "@/services/categories-service"
import { Category } from "@/schemas/categories-schema"
import { useTranslations } from "next-intl"

import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover"

import { cn } from "@/lib/utils"

export const CategoryDropdown = () => {
  const t = useTranslations()
  const router = useRouter()
  const searchParams = useSearchParams()

  const [categories, setCategories] = useState<Category[]>([])
  const [activeCategory, setActiveCategory] = useState<Category | null>(null)
  const [loading, setLoading] = useState(false)
  const [open, setOpen] = useState(false)

  useEffect(() => {
    const fetchCategories = async () => {
      setLoading(true)
      try {
        const response = await CategoriesService.getAllCategories()
        const categoriesArray = Array.isArray(response.data) ? response.data : []
        setCategories(categoriesArray)

        if (categoriesArray.length > 0) {
          setActiveCategory(categoriesArray[0])
        }
      } catch (error) {
        console.error("Error loading categories:", error)
      } finally {
        setLoading(false)
      }
    }
    fetchCategories()
  }, [])

  // Универсальная функция для перехода к категории
  const handleCategorySelect = (id: number) => {
    const params = new URLSearchParams(searchParams.toString())
    params.set("category_id", id.toString())
    params.set("page", "0") // Сбрасываем пагинацию

    // Переходим на страницу курсов (или главную) с новыми параметрами
    router.push(`/?${params.toString()}#courses-list`, { scroll: true })
    setOpen(false) // Закрываем выпадающее меню
  }

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          variant="ghost"
          size="sm"
          className={cn(
            "gap-2 font-medium transition-colors",
            open ? "bg-accent text-accent-foreground" : "hover:bg-accent/50"
          )}
          // Для десктопа можно оставить onMouseEnter, но onClick надежнее для мобильных
          onClick={() => setOpen(!open)}
        >
          <LayoutGrid className="w-4 h-4" />
          {t("categories.title")}
        </Button>
      </PopoverTrigger>

      <PopoverContent
        align="start"
        sideOffset={8}
        className="p-0 w-[500px] overflow-hidden rounded-2xl border-border bg-popover/95 backdrop-blur-md shadow-2xl"
        onMouseLeave={() => setOpen(false)}
      >
        {loading ? (
          <div className="flex items-center justify-center p-10">
            <Loader2 className="w-6 h-6 animate-spin text-primary" />
            <span className="ml-2 text-sm text-muted-foreground">
              {t("common.loading")}
            </span>
          </div>
        ) : (
          <div className="flex h-[400px]">
            {/* ЛЕВАЯ ЧАСТЬ: Родительские категории */}
            <div className="w-1/2 border-r border-border p-2 bg-muted/20 overflow-y-auto">
              <p className="text-[10px] font-bold text-muted-foreground uppercase px-3 py-2 tracking-wider">
                {t("categories.directions")}
              </p>

              <div className="space-y-1">
                {categories.map((category) => (
                  <button
                    key={category.id}
                    onMouseEnter={() => setActiveCategory(category)}
                    onClick={() => handleCategorySelect(category.id)} // Можно кликнуть и на родителя
                    className={cn(
                      "w-full flex items-center justify-between px-3 py-2.5 rounded-xl text-sm transition-all text-left",
                      activeCategory?.id === category.id
                        ? "bg-primary text-primary-foreground shadow-sm"
                        : "hover:bg-accent hover:text-accent-foreground"
                    )}
                  >
                    <span className="font-medium">{category.name}</span>
                    <ChevronRight
                      className={cn(
                        "w-4 h-4 opacity-50",
                        activeCategory?.id === category.id && "opacity-100"
                      )}
                    />
                  </button>
                ))}
              </div>
            </div>

            {/* ПРАВАЯ ЧАСТЬ: Подкатегории */}
            <div className="w-1/2 p-3 bg-background overflow-y-auto">
              {activeCategory ? (
                <>
                  <div className="flex items-center justify-between px-3 py-2 mb-1">
                    <p className="text-[10px] font-bold text-muted-foreground uppercase tracking-wider">
                      {activeCategory.name}
                    </p>
                    <Button
                      variant="link"
                      className="h-auto p-0 text-[10px] uppercase font-bold"
                      onClick={() => handleCategorySelect(activeCategory.id)}
                    >
                      {t("common.viewAll")}
                    </Button>
                  </div>

                  <div className="grid gap-1">
                    {(activeCategory.children?.length ?? 0) > 0 ? (
                      activeCategory.children?.map((child) => (
                        <button
                          key={child.id}
                          onClick={() => handleCategorySelect(child.id)}
                          className="w-full text-left px-3 py-2.5 rounded-xl text-sm font-medium hover:bg-primary/10 hover:text-primary transition-colors"
                        >
                          {child.name}
                        </button>
                      ))
                    ) : (
                      <p className="text-sm text-muted-foreground px-3 py-4 italic text-center">
                        {t("categories.emptyCourses")}
                      </p>
                    )}
                  </div>
                </>
              ) : (
                <div className="flex items-center justify-center h-full text-muted-foreground text-sm">
                  {t("categories.selectCategory")}
                </div>
              )}
            </div>
          </div>
        )}
      </PopoverContent>
    </Popover>
  )
}