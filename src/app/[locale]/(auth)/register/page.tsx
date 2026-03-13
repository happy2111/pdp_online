'use client'

import { SignupForm } from "@/components/auth/SignupForm";
import { useTranslations } from "next-intl";
import { Button } from "@/components/ui/button";
import { ChevronLeft } from "lucide-react";
import { useRouter } from "@/i18n/navigation";

export default function SignupPage() {
  const t = useTranslations();
  const router = useRouter();

  return (
    <div className="min-h-screen w-full flex items-center justify-center bg-muted/30 p-4 md:p-6 transition-colors duration-300">

      <div className="flex w-full max-w-[1000px] min-h-[600px] bg-card rounded-[32px] overflow-hidden shadow-2xl border border-border">

        <div className="hidden md:flex w-1/2 bg-primary p-12 flex-col justify-between text-primary-foreground relative overflow-hidden">

          <div className="absolute -bottom-10 -left-10 w-40 h-40 bg-white/10 dark:bg-black/10 rounded-full blur-2xl" />
          <div className="absolute top-20 -right-10 w-60 h-60 bg-white/5 dark:bg-black/5 rounded-full blur-3xl" />

          <div className="relative z-10">
            <Button
              onClick={() => router.push('/')}
              className="hover:bg-white/10 px-2! -translate-x-4 text-primary-foreground rounded-2xl"
              variant='ghost'
            >
              <ChevronLeft className="mr-1 size-5"/>
              Orqaga
            </Button>
            <h2 className="text-3xl font-bold mb-2 mt-4">PDP Online</h2>
          </div>

          <div className="relative z-10">
            <h1 className="text-4xl font-extrabold leading-tight mb-4">
              Xush kelibsiz!
            </h1>
            <p className="opacity-90 text-lg max-w-[280px]">
              Mutahassis bo'lishlikdagi safaringizni davom ettiring. Minglab kurslar sizni kutmoqda.
            </p>
          </div>

          <div className="relative z-10 flex gap-8">
            <div>
              <div className="text-2xl font-bold">12K+</div>
              <div className="text-xs opacity-80 uppercase tracking-wider">O'quvchilar</div>
            </div>
            <div>
              <div className="text-2xl font-bold">340+</div>
              <div className="text-xs opacity-80 uppercase tracking-wider">Kurslar</div>
            </div>
            <div>
              <div className="text-2xl font-bold">80+</div>
              <div className="text-xs opacity-80 uppercase tracking-wider">O'qituvchilar</div>
            </div>
          </div>
        </div>
        <div className="w-full md:w-1/2 flex flex-col justify-center p-8 md:p-12 bg-card">
          <div className="w-full max-w-[450px] mx-auto">
            <SignupForm className="shadow-none border-none bg-transparent backdrop-blur-none p-0" />
          </div>
        </div>
      </div>
    </div>
  );
}