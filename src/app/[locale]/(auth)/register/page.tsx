'use client'

import { SignupForm } from "@/components/SignupForm";
import {LanguageToggle} from "@/components/LanguageToggle";
import {ModeToggle} from "@/components/ModeToggle";

export default function SignupPage() {
  return (
    <div className="relative flex min-h-svh flex-col items-center justify-center overflow-hidden bg-background p-6 md:p-10">
      <div className="absolute inset-0 z-0 pointer-events-none">
        <div className="absolute top-[5%] left-[10%] w-80 h-80 rounded-full bg-emerald-500/20 blur-[100px] animate-blob" />
        <div className="absolute top-[35%] right-[5%] w-[450px] h-[450px] rounded-full bg-green-500/15 blur-[120px] animate-blob animation-delay-2000" />
        <div className="absolute bottom-[15%] left-[15%] w-72 h-72 rounded-full bg-green-400/20 blur-[100px] animate-blob animation-delay-4000" />
      </div>

      <div className="w-full max-w-md relative z-10">
        <SignupForm />
      </div>

      <div className="relative mt-2 z-50 flex items-center gap-2 p-1 rounded-2xl backdrop-blur-xl bg-background/70 border border-emerald-500/10">
        <LanguageToggle />
        <div className="w-[1px] h-4 bg-emerald-500/20" />
        <ModeToggle />
      </div>

      <style jsx global>{`
        @keyframes blob {
          0% { transform: translate(0px, 0px) scale(1); }
          33% { transform: translate(40px, -60px) scale(1.1); }
          66% { transform: translate(-30px, 30px) scale(0.9); }
          100% { transform: translate(0px, 0px) scale(1); }
        }
        .animate-blob {
          animation: blob 12s infinite alternate cubic-bezier(0.4, 0, 0.2, 1);
        }
        .animation-delay-2000 {
          animation-delay: 2s;
        }
        .animation-delay-4000 {
          animation-delay: 4s;
        }
      `}</style>
    </div>
  );
}