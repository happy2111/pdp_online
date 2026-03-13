import type { Viewport } from 'next'
import {ModeToggle} from "@/components/ModeToggle";
import {LanguageToggle} from "@/components/LanguageToggle";
import {SidebarProvider} from "@/components/ui/sidebar";
import {HomeSidebar} from "@/components/navbar/HomeSidebar";
import Navbar from "@/components/navbar/Navbar";

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  maximumScale: 1,
  userScalable: false,
}

export default async function MainLayout({
                                           children,
                                         }: {
  children: React.ReactNode;
}) {
  return (
    <SidebarProvider>
      <HomeSidebar />
      <div className="flex flex-col w-full">
        <Navbar />
        <main className="w-full pt-28 p-6">
          {children}
        </main>
      </div>
    </SidebarProvider>
  );
}