'use client'

import { LoginForm } from "@/components/auth/LoginForm";
import { useTranslations } from "next-intl";
import { Button } from "@/components/ui/button";
import { ChevronLeft } from "lucide-react";
import { useRouter } from "@/i18n/navigation";

export default function LoginPage() {
  const t = useTranslations();
  const router = useRouter();

  return (
    <div className="min-h-screen w-full flex items-center justify-center bg-muted/30 max-md:p-4 transition-colors dark:text-white! duration-300">

      <div className="flex w-full max-w-full min-h-dvh bg-card max-md:rounded-[32px] overflow-hidden shadow-2xl max-md:border border-border">

        <div className="hidden md:flex w-[45%] bg-primary p-12 flex-col justify-between text-primary-foreground relative dark:text-white!">

          <div className="absolute -bottom-16 -left-16 w-64 h-64 bg-white/10 dark:bg-black/10 rounded-full blur-3xl" />

          <div className="relative z-10 ">
            <Button
              onClick={() => router.push('/')}
              className="hover:bg-white/10 px-2! -translate-x-4 text-white rounded-2xl"
              variant='ghost'
            >
              <ChevronLeft className="mr-1 size-5"/>
              Orqaga
            </Button>
            <h2 className="text-2xl font-bold tracking-tight mt-4">PDP Online</h2>
          </div>

          <div className="relative z-10 space-y-4 ">
            <h1 className="text-5xl font-bold leading-tight">
              Xush kelibsiz!
            </h1>
            <p className="opacity-90 text-lg leading-relaxed max-w-[300px]">
              Mutahassis bo'lishlikdagi safaringizni davom ettiring. Minglab kurslar sizni kutmoqda.
            </p>
          </div>

          <div className="relative z-10 flex items-end gap-10">
            <div>
              <div className="text-3xl font-bold">12K+</div>
              <div className="text-[11px] opacity-80 font-medium uppercase tracking-wider mt-1">O'quvchilar</div>
            </div>
            <div>
              <div className="text-3xl font-bold">340+</div>
              <div className="text-[11px] opacity-80 font-medium uppercase tracking-wider mt-1">Kurslar</div>
            </div>
            <div>
              <div className="text-3xl font-bold">80+</div>
              <div className="text-[11px] opacity-80 font-medium uppercase tracking-wider mt-1">O'qituvchilar</div>
            </div>
          </div>
        </div>

        <div className="w-full md:w-[55%] flex flex-col justify-center px-8 py-12 md:px-16 bg-card">
          <div className="w-full max-w-[400px] mx-auto">
            <LoginForm className="shadow-none border-none bg-transparent p-0 backdrop-blur-none" />
          </div>
        </div>
      </div>
    </div>
  );
}