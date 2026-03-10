"use client"

import * as React from "react"
import { GalleryVerticalEnd, Minus, Plus, Loader2 } from "lucide-react"
import { SearchForm } from "@/components/navbar/search-form"
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

export function HomeSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
  const [categories, setCategories] = React.useState<Category[]>([])
  const [loading, setLoading] = React.useState(true)

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

        <div className="mt-2">
          <SearchForm />
        </div>
      </SidebarHeader>

      <SidebarContent>
        <SidebarGroup>
          <SidebarMenu>
            {loading ? (
              <div className="flex justify-center p-4"><Loader2 className="animate-spin" /></div>
            ) : (
              categories.map((category) => (
                <Collapsible
                  key={category.id}
                  className="group/collapsible"
                >
                  <SidebarMenuItem>
                    <CollapsibleTrigger asChild>
                      <SidebarMenuButton tooltip={category.name}>
                        <span className="font-medium">{category.name}</span>
                        <Plus className="ml-auto group-data-[state=open]/collapsible:hidden size-4" />
                        <Minus className="ml-auto group-data-[state=closed]/collapsible:hidden size-4" />
                      </SidebarMenuButton>
                    </CollapsibleTrigger>
                    {category.children && category.children.length > 0 && (
                      <CollapsibleContent>
                        <SidebarMenuSub>
                          {category.children.map((child) => (
                            <SidebarMenuSubItem key={child.id}>
                              <SidebarMenuSubButton asChild>
                                <a href={`/categories/${child.slug}`}>
                                  {child.name}
                                </a>
                              </SidebarMenuSubButton>
                            </SidebarMenuSubItem>
                          ))}
                        </SidebarMenuSub>
                      </CollapsibleContent>
                    )}
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