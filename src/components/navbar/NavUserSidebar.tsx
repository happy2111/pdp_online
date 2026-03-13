"use client"

import {
  BadgeCheck,
  Bell,
  ChevronsUpDown,
  LogOut,
  LogIn,
  UserPlus
} from "lucide-react"

import {
  Avatar,
  AvatarFallback,
  AvatarImage,
} from "@/components/ui/avatar"

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"

import {
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar"

import { useAuthStore } from "@/stores/auth-store"
import { useTranslations } from "next-intl"
import Link from "next/link"
import { Button } from "@/components/ui/button"

export function NavUserSidebar() {
  const { user, isAuthenticated, logout } = useAuthStore()
  const t = useTranslations()

  if (!isAuthenticated || !user) {
    return (
      <SidebarMenu>
        <SidebarMenuItem className="flex flex-col gap-2 p-2">

          <Button
            variant="default"
            size="sm"
            asChild
            className="w-full justify-start gap-2"
          >
            <Link href="/login">
              <LogIn className="size-4" />
              <span>{t("auth.login.submit")}</span>
            </Link>
          </Button>

          <Button
            variant="outline"
            size="sm"
            asChild
            className="w-full justify-start gap-2"
          >
            <Link href="/register">
              <UserPlus className="size-4" />
              <span>{t("auth.register.title")}</span>
            </Link>
          </Button>

        </SidebarMenuItem>
      </SidebarMenu>
    )
  }

  const firstName = user.first_name || user.username || "U"
  const lastName = user.last_name || ""
  const avatarUrl = user.avatar_url || ""
  const roleName = user.role_name || "User"

  return (
    <SidebarMenu>
      <SidebarMenuItem>

        <DropdownMenu>

          <DropdownMenuTrigger asChild>
            <SidebarMenuButton
              size="lg"
              className="data-[state=open]:bg-sidebar-accent data-[state=open]:text-sidebar-accent-foreground"
            >
              <Avatar className="h-8 w-8 rounded-lg">
                <AvatarImage src={avatarUrl} alt={user.username} />
                <AvatarFallback className="rounded-lg">
                  {firstName[0]}{lastName[0] || ""}
                </AvatarFallback>
              </Avatar>

              <div className="grid flex-1 text-left text-sm leading-tight">
                <span className="truncate font-semibold">
                  {firstName} {lastName}
                </span>
                <span className="truncate text-xs text-muted-foreground">
                  {roleName}
                </span>
              </div>

              <ChevronsUpDown className="ml-auto size-4" />
            </SidebarMenuButton>
          </DropdownMenuTrigger>

          <DropdownMenuContent
            className="w-[--radix-dropdown-menu-trigger-width] min-w-56 rounded-lg"
            side="bottom"
            align="end"
            sideOffset={4}
          >

            <DropdownMenuLabel className="p-0 font-normal">
              <div className="flex items-center gap-2 px-1 py-1.5 text-left text-sm">

                <Avatar className="h-8 w-8 rounded-lg">
                  <AvatarImage src={avatarUrl} alt={user.username} />
                  <AvatarFallback className="rounded-lg">
                    {firstName[0]}{lastName[0] || ""}
                  </AvatarFallback>
                </Avatar>

                <div className="grid flex-1 text-left text-sm leading-tight">
                  <span className="truncate font-semibold">
                    {user.username}
                  </span>
                  <span className="truncate text-xs">
                    {user.email}
                  </span>
                </div>

              </div>
            </DropdownMenuLabel>

            <DropdownMenuSeparator />

            <DropdownMenuGroup>

              <DropdownMenuItem asChild>
                <Link href="/profile" className="cursor-pointer">
                  <BadgeCheck className="mr-2 size-4" />
                  {t("sidebar.account")}
                </Link>
              </DropdownMenuItem>

              <DropdownMenuItem>
                <Bell className="mr-2 size-4" />
                {t("sidebar.notifications")}
              </DropdownMenuItem>

            </DropdownMenuGroup>

            <DropdownMenuSeparator />

            <DropdownMenuItem
              onClick={() => logout()}
              className="text-destructive cursor-pointer"
            >
              <LogOut className="mr-2 size-4" />
              {t("common.logout")}
            </DropdownMenuItem>

          </DropdownMenuContent>

        </DropdownMenu>

      </SidebarMenuItem>
    </SidebarMenu>
  )
}