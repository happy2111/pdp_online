import type { Viewport } from 'next'
import {ModeToggle} from "@/components/ModeToggle";
import {LanguageToggle} from "@/components/LanguageToggle";

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  maximumScale: 1,
  userScalable: false,
}

export default async function RootLayout({
                                           children,
                                         }: {
  children: React.ReactNode;
}) {
  return (
    <html lang="ru">
    <body>

    {children}

    </body>
    </html>
  );
}