"use client"
import Link from 'next/link'
import Image from 'next/image'
import { LanguageToggle } from '../LanguageToggle'
import { ModeToggle } from '../ModeToggle'
import { NavbarAuth } from '@/components/ui/NavbarAuth'
import { CategoryDropdown } from "@/components/navbar/CategoryDropdown"
import { Input } from "@/components/ui/input"
import { SidebarTrigger } from "@/components/ui/sidebar" // Импортируем триггер

const Navbar = () => {
  return (
    <div className="fixed top-8 left-0 w-full flex justify-center z-50">
      <nav className={`
                relative w-[95%] lg:w-[75%] px-4 md:px-6 py-3 
                flex justify-between items-center 
                rounded-3xl transition-all duration-300
                bg-background/60 backdrop-blur-xl
                border border-border shadow-lg
            `}>


        <div className="flex items-center gap-4">
          <div className="md:hidden">
            <SidebarTrigger />
          </div>

          <Link href="/" className="flex items-center shrink-0">
            <Image
              src="/logo.svg"
              alt="Logo"
              width={90}
              height={32}
            />
          </Link>
        </div>

        {/* Центр: Поиск (только десктоп) */}
        <div className="flex-1 max-w-md mx-8 hidden md:block">
          <div className="relative flex items-center">
            <Input
              type="text"
              placeholder="Search courses..."
              className="px-4 pl-10 text-sm rounded-full transition-all"
            />
            <div className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground">
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
            </div>
          </div>
        </div>

        {/* Правая часть: Категории (десктоп) + Опции */}
        <div className="flex items-center gap-2">
          <div className="hidden md:block">
            <CategoryDropdown />
          </div>

          <div className="flex  items-center gap-1 md:gap-2 ml-2 pl-2 border-l border-border">

            <LanguageToggle />
            <ModeToggle />
            <div className={`hidden md:block`}>
              <NavbarAuth />
            </div>
          </div>
        </div>
      </nav>
    </div>
  )
}

export default Navbar