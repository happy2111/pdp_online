"use client"

import * as React from "react"
import { GalleryVerticalEnd, Minus, Plus, Loader2 } from "lucide-react"
import { SearchForm } from "@/components/navbar/SearchForm"
import { motion, AnimatePresence } from "framer-motion"
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
} from "@/components/ui/sidebar"
import { CategoriesService } from "@/services/categories-service"
import { Category } from "@/schemas/categories-schema"
import {NavUserSidebar} from "@/components/navbar/NavUserSidebar";
import {useTranslations} from "next-intl";

export function HomeSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
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

  return (
    <Sidebar
      collapsible="offcanvas"
      className="md:hidden"
      {...props}>
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
              <div className="flex justify-center p-4"><Loader2 className="animate-spin" /></div>
            ) : (
              categories.map((category) => (
                <Collapsible key={category.id} className="group/collapsible">
                  <SidebarMenuItem>
                    <CollapsibleTrigger asChild>
                      <SidebarMenuButton
                        tooltip={category.name}
                        className="h-12 px-4 hover:bg-primary/5 active:scale-[0.98] transition-all" // Увеличили высоту
                      >
                        <span className="font-semibold text-base">{category.name}</span> {/* Текст крупнее */}
                        <Plus className="ml-auto group-data-[state=open]/collapsible:hidden size-5 text-muted-foreground" />
                        <Minus className="ml-auto group-data-[state=closed]/collapsible:hidden size-5 text-primary" />
                      </SidebarMenuButton>
                    </CollapsibleTrigger>

                    <CollapsibleContent asChild>
                      <motion.div
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: "auto" }}
                        exit={{ opacity: 0, height: 0 }}
                        transition={{ duration: 0.2, ease: "easeInOut" }}
                      >
                        <SidebarMenuSub className="ml-4 border-l-2 border-primary/20 py-2 gap-1">
                          {category.children?.map((child) => (
                            <SidebarMenuSubItem key={child.id}>
                              <SidebarMenuSubButton asChild className="h-10 text-[15px] hover:text-primary transition-colors">
                                <a href={`/categories/${child.slug}`}>
                                  {child.name}
                                </a>
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