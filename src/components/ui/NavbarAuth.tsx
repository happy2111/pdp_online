"use client"

import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { useAuthStore } from "@/stores/auth-store"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { BadgeCheck, Bell, LogOut, Settings } from "lucide-react"

export const NavbarAuth = () => {
  const { user, isAuthenticated, logout } = useAuthStore()

  // 1. Если НЕ авторизован — показываем кнопки
  if (!isAuthenticated || !user) {
    return (
      <div className="flex items-center gap-2">
        <Button
          variant="ghost"
          size="sm"
          asChild
          className="font-medium hover:bg-accent/10 transition-colors"
        >
          <Link href="/login">Login</Link>
        </Button>

        <Button
          variant="default"
          size="sm"
          asChild
          className="bg-primary text-primary-foreground hover:opacity-90 shadow-sm active:scale-95 transition-all"
        >
          <Link href="/register">Register</Link>
        </Button>
      </div>
    )
  }

  // Данные пользователя для отображения
  const firstName = user.first_name || user.username || "U"
  const lastName = user.last_name || ""
  const avatarUrl = user.avatar_url || ""

  // 2. Если АВТОРИЗОВАН — показываем только аватарку с Dropdown
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" className="relative h-10 w-10 rounded-full p-0 overflow-hidden hover:bg-transparent focus-visible:ring-primary">
          <Avatar className="h-10 w-10 border border-border transition-transform hover:scale-105">
            <AvatarImage src={avatarUrl} alt={user.username} />
            <AvatarFallback className="bg-primary/10 text-primary font-bold">
              {firstName[0]}{lastName[0] || ""}
            </AvatarFallback>
          </Avatar>
        </Button>
      </DropdownMenuTrigger>

      <DropdownMenuContent className="w-56 mt-2 rounded-2xl p-2 shadow-xl border-border/50" align="end" sideOffset={8}>
        <DropdownMenuLabel className="font-normal">
          <div className="flex flex-col space-y-1 p-2">
            <p className="text-sm font-semibold leading-none">{firstName} {lastName}</p>
            <p className="text-xs leading-none text-muted-foreground">{user.email}</p>
          </div>
        </DropdownMenuLabel>
        <DropdownMenuSeparator className="bg-border/50" />
        <DropdownMenuGroup className="gap-1 flex flex-col">
          <DropdownMenuItem asChild className="rounded-xl cursor-pointer py-2.5">
            <Link href="/profile">
              <BadgeCheck className="mr-2 h-4 w-4 text-primary" />
              <span>Profil</span>
            </Link>
          </DropdownMenuItem>
          <DropdownMenuItem asChild className="rounded-xl cursor-pointer py-2.5">
            <Link href="/settings">
              <Settings className="mr-2 h-4 w-4 text-muted-foreground" />
              <span>Sozlamalar</span>
            </Link>
          </DropdownMenuItem>
          <DropdownMenuItem className="rounded-xl cursor-pointer py-2.5">
            <Bell className="mr-2 h-4 w-4 text-muted-foreground" />
            <span>Bildirishnomalar</span>
          </DropdownMenuItem>
        </DropdownMenuGroup>
        <DropdownMenuSeparator className="bg-border/50" />
        <DropdownMenuItem
          onClick={() => logout()}
          className="rounded-xl cursor-pointer py-2.5 text-destructive focus:bg-destructive/10 focus:text-destructive"
        >
          <LogOut className="mr-2 h-4 w-4" />
          <span>Chiqish</span>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}