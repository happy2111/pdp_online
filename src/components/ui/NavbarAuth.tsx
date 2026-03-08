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
                className="text-black dark:text-white hover:text-gray-600 dark:hover:text-gray-300"
            >
                <Link href="/login">
                    Login
                </Link>
            </Button>

            <Button
                variant="default"
                size="sm"
                asChild
                className="bg-blue-600 dark:bg-blue-500 text-white hover:bg-blue-700 dark:hover:bg-blue-600"
            >
                <Link href="/register">
                    Register
                </Link>
            </Button>
        </div>
    )
}