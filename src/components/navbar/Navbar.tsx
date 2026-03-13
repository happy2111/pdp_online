"use client"
import Link from 'next/link'
import Image from 'next/image'
import { LanguageToggle } from '../LanguageToggle'
import { ModeToggle } from '../ModeToggle'
import { NavbarAuth } from '@/components/ui/NavbarAuth'
import { CategoryDropdown } from "@/components/navbar/CategoryDropdown"
import { SidebarTrigger } from "@/components/ui/sidebar"

const Navbar = () => {
  return (
    <div className="fixed top-8 left-0 w-full flex justify-center z-50 ">
      <nav className={`
                relative container-custom py-3
                flex justify-between items-center 
                rounded-3xl transition-all duration-300
                bg-background/40 backdrop-blur-sm
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

export default Navbar;