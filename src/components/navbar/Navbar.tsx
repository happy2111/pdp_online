"use client"
import {Suspense, useState} from 'react'
import { motion, useScroll, useMotionValueEvent } from 'framer-motion'
import Link from 'next/link'
import Image from 'next/image'
import { LanguageToggle } from '../LanguageToggle'
import { ModeToggle } from '../ModeToggle'
import { NavbarAuth } from '@/components/ui/NavbarAuth'
import { CategoryDropdown } from "@/components/navbar/CategoryDropdown"
import { SidebarTrigger } from "@/components/ui/sidebar"
import {Loader2} from "lucide-react";

const Navbar = () => {
  const [hidden, setHidden] = useState(false)
  const { scrollY } = useScroll()

  useMotionValueEvent(scrollY, "change", (latest) => {
    const previous = scrollY.getPrevious() ?? 0
    if (latest > previous && latest > 150) {
      setHidden(true) // Скролл вниз — скрываем
    } else {
      setHidden(false) // Скролл вверх — показываем
    }
  })

  return (
    <motion.div
      variants={{
        visible: { y: 0, opacity: 1 },
        hidden: { y: "-150%", opacity: 0 }, // Уводим выше экрана
      }}
      animate={hidden ? "hidden" : "visible"}
      transition={{ duration: 0.35, ease: "easeInOut" }}
      className="fixed top-8 left-0 w-full flex justify-center z-50 px-4"
    >
      <nav className={`
                relative container-custom py-3
                flex justify-between items-center 
                rounded-3xl transition-all duration-300
                bg-background/40 backdrop-blur-sm
                border border-border shadow-lg
                w-full max-w-7xl
            `}>
        {/* Ваш существующий контент */}
        <div className="flex items-center gap-4">
          <div className="md:hidden">
            <SidebarTrigger />
          </div>

          <Link href="/" className="flex items-center shrink-0">
            <Image src="/logo.svg" alt="Logo" width={90} height={32} />
          </Link>
        </div>

        <div className="flex items-center gap-2">
          <div className="hidden md:block">
            <Suspense
              fallback={
                <div className="flex justify-center items-center h-64 text-primary">
                  <Loader2 className="w-8 h-8 animate-spin" />
                </div>
              }
            >
             <CategoryDropdown />
            </Suspense>
          </div>

          <div className="flex items-center gap-1 md:gap-2 ml-2 pl-2 border-l border-border">
            <LanguageToggle />
            <ModeToggle />
            <div className={`hidden md:block`}>
              <NavbarAuth />
            </div>
          </div>
        </div>
      </nav>
    </motion.div>
  )
}

export default Navbar;