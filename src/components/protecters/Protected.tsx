'use client'

import { ReactNode, useEffect } from "react"
import { useAuthStore } from "@/stores/auth-store"
import {Roles} from "@/schemas/auth-schema";
import {Loader2} from "lucide-react";
import {useRouter} from "@/i18n/navigation";

interface ProtectedProps {
  children: ReactNode
  roles?: Roles[]
  redirectTo?: string
  fallback?: ReactNode
}

export default function Protected({
                                    children,
                                    roles,
                                    redirectTo = "/login",
                                    fallback = null,
                                  }: ProtectedProps) {
  const router = useRouter()
  const { isAuthenticated, user, isLoading, rehydrated } = useAuthStore()

  useEffect(() => {
    if (!rehydrated) return // Ждем пока zustand загрузит localStorage

    if (!isAuthenticated) {
      router.replace(redirectTo)
      return
    }

    if (roles && user && !roles.includes(user.role_name as Roles)) {
      router.replace("/")
    }
  }, [isAuthenticated, user, roles, router, rehydrated, redirectTo])

  if (!rehydrated || isLoading) {
    return fallback || (
      <div className="flex min-h-[50vh] items-center justify-center">
        <Loader2 className="h-10 w-10 animate-spin text-primary" />
      </div>
    )
  }

  if (!isAuthenticated) return null
  if (roles && user && !roles.includes(user.role_name as Roles)) return null

  return <>{children}</>
}