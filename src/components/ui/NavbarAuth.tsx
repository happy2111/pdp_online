"use client"

import Link from 'next/link'
import { Button } from '@/components/ui/button'

export const NavbarAuth = () => {
  return (
    <div className="flex items-center gap-2">
      <Button
        variant="ghost"
        size="sm"
        asChild
        className="font-medium hover:bg-accent/10 hover:text-accent transition-colors"
      >
        <Link href="/login">
          Login
        </Link>
      </Button>

      <Button
        variant="default"
        size="sm"
        asChild
        className="bg-primary text-primary-foreground hover:opacity-90 shadow-md transition-all active:scale-95"
      >
        <Link href="/register">
          Register
        </Link>
      </Button>
    </div>
  )
}