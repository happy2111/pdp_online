"use client"

import * as React from "react"
import { useRouter, useSearchParams } from "next/navigation"
import { Minus, Plus, Loader2 } from "lucide-react"
import { motion } from "framer-motion"
import { useTranslations } from "next-intl"

import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible"
import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarMenuSub,
  SidebarMenuSubButton,
  SidebarMenuSubItem,
  SidebarRail,
  useSidebar, // Добавим хук для закрытия сайдбара после выбора
} from "@/components/ui/sidebar"

import { CategoriesService } from "@/services/categories-service"
import { Category } from "@/schemas/categories-schema"
import { NavUserSidebar } from "@/components/navbar/NavUserSidebar"

function HomeSidebarContent({ ...props }: React.ComponentProps<typeof Sidebar>) {
  const router = useRouter()
  const searchParams = useSearchParams()
  const { setOpenMobile } = useSidebar()

  const [categories, setCategories] = React.useState<Category[]>([])
  const [loading, setLoading] = React.useState(true)
  const t = useTranslations()

  React.useEffect(() => {
    async function fetchCats() {
      try {
        const response = await CategoriesService.getAllCategories()
        setCategories(Array.isArray(response.data) ? response.data : [])
      } catch (e) {
        console.error(e)
      } finally {
        setLoading(false)
      }
    }
    fetchCats()
  }, [])

  // Та же логика, что и в Dropdown
  const handleCategorySelect = (id: number) => {
    const params = new URLSearchParams(searchParams.toString())
    params.set("category_id", id.toString())
    params.set("page", "0")

    // Переход на главную с параметрами
    router.push(`/?${params.toString()}#courses-list`, { scroll: true })

    // Закрываем мобильный сайдбар
    setOpenMobile(false)
  }

  return (
    <Sidebar collapsible="offcanvas" className="md:hidden" {...props}>
      <SidebarHeader className="border-b border-sidebar-border pb-4">
        <NavUserSidebar />
      </SidebarHeader>

      <SidebarContent>
        <SidebarGroup>
          <div className="text-[11px] font-bold text-muted-foreground uppercase tracking-widest px-4 mb-4 opacity-70">
            {t("categories.title")}
          </div>
          <SidebarMenu>
            {loading ? (
              <div className="flex justify-center p-4">
                <Loader2 className="animate-spin" />
              </div>
            ) : (
              categories.map((category) => (
                <Collapsible key={category.id} className="group/collapsible">
                  <SidebarMenuItem>
                    {/* Клик по родителю (тексту) тоже может фильтровать */}
                    <div className="flex items-center">
                      <SidebarMenuButton
                        asChild
                        className="h-12 px-4 flex-1 hover:bg-primary/5"
                        onClick={() => handleCategorySelect(category.id)}
                      >
                        <button className="text-left">
                          <span className="font-semibold text-base">{category.name}</span>
                        </button>
                      </SidebarMenuButton>

                      {/* Триггер только для раскрытия списка */}
                      <CollapsibleTrigger asChild>
                        <button className="p-3">
                          <Plus className="group-data-[state=open]/collapsible:hidden size-5 text-muted-foreground" />
                          <Minus className="group-data-[state=closed]/collapsible:hidden size-5 text-primary" />
                        </button>
                      </CollapsibleTrigger>
                    </div>

                    <CollapsibleContent asChild>
                      <motion.div
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: "auto" }}
                        exit={{ opacity: 0, height: 0 }}
                        transition={{ duration: 0.2 }}
                      >
                        <SidebarMenuSub className="ml-4 border-l-2 border-primary/20 py-2 gap-1">
                          {category.children?.map((child) => (
                            <SidebarMenuSubItem key={child.id}>
                              <SidebarMenuSubButton
                                asChild
                                className="h-10 text-[15px]"
                                onClick={() => handleCategorySelect(child.id)}
                              >
                                <button className="w-full text-left transition-colors hover:text-primary">
                                  {child.name}
                                </button>
                              </SidebarMenuSubButton>
                            </SidebarMenuSubItem>
                          ))}
                        </SidebarMenuSub>
                      </motion.div>
                    </CollapsibleContent>
                  </SidebarMenuItem>
                </Collapsible>
              ))
            )}
          </SidebarMenu>
        </SidebarGroup>
      </SidebarContent>
      <SidebarRail />
    </Sidebar>
  )
}

export function HomeSidebar(props: React.ComponentProps<typeof Sidebar>) {
  return (
    <React.Suspense fallback={null}>
      <HomeSidebarContent {...props} />
    </React.Suspense>
  )
}