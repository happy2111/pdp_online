import type { Viewport } from 'next'
import {SidebarProvider} from "@/components/ui/sidebar";
import {HomeSidebar} from "@/components/navbar/HomeSidebar";
import Navbar from "@/components/navbar/Navbar";
import Footer from "@/components/Footer";


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
      <div className="flex flex-col w-full min-h-screen">
        <Navbar />
        <main className="w-full pt-28 flex-grow">
          {children}
        </main>
        <Footer />
      </div>
    </SidebarProvider>
  );
}