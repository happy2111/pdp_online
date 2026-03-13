"use client"

import * as React from "react"
import { useState, useEffect } from "react"
import Link from "next/link"
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

  const [categories, setCategories] = useState<Category[]>([])
  const [activeCategory, setActiveCategory] = useState<Category | null>(null)
  const [loading, setLoading] = useState(false)
  const [open, setOpen] = useState(false)

  useEffect(() => {
    const fetchCategories = async () => {
      setLoading(true)
      try {
        const response = await CategoriesService.getAllCategories()

        const categoriesArray = Array.isArray(response.data)
          ? response.data
          : []

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

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          variant="ghost"
          size="sm"
          className="gap-2 font-medium hover:secondary-foreground"
          onMouseEnter={() => setOpen(true)}
        >
          <LayoutGrid className="w-4 h-4" />
          {t("categories.title")}
        </Button>
      </PopoverTrigger>

      <PopoverContent
        align="start"
        className="p-0 w-125 overflow-hidden rounded-2xl border-border bg-popover/95 backdrop-blur-md shadow-2xl"
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
          <div className="flex h-[350px]">
            {/* LEFT */}
            <div className="w-1/2 border-r border-border p-2 bg-muted/20">
              <p className="text-[10px] font-bold text-muted-foreground uppercase px-3 py-2 tracking-wider">
                {t("categories.directions")}
              </p>

              <div className="space-y-1">
                {categories.map((category) => (
                  <button
                    key={category.id}
                    onMouseEnter={() => setActiveCategory(category)}
                    className={cn(
                      "w-full flex items-center justify-between px-3 py-2.5 rounded-xl text-sm transition-all",
                      activeCategory?.id === category.id
                        ? "bg-primary text-primary-foreground shadow-md"
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

            {/* RIGHT */}
            <div className="w-1/2 p-3 bg-background">
              {activeCategory ? (
                <>
                  <p className="text-[10px] font-bold text-muted-foreground uppercase px-3 py-2 tracking-wider">
                    {activeCategory.name} {t("categories.courses")}
                  </p>

                  <div className="grid gap-1">
                    {(activeCategory.children?.length ?? 0) > 0 ? (
                      activeCategory.children?.map((child) => (
                        <Link
                          key={child.id}
                          href={`/categories/${child.slug}`}
                          onClick={() => setOpen(false)}
                          className="px-3 py-2.5 rounded-xl text-sm font-medium hover:bg-primary/10 hover:text-primary transition-colors flex items-center"
                        >
                          {child.name}
                        </Link>
                      ))
                    ) : (
                      <p className="text-sm text-muted-foreground px-3 py-4 italic">
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