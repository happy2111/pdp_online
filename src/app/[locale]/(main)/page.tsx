'use client'

import {Suspense, useEffect} from "react";
import {printMe} from "@/lib/utils";
import Hero from "@/components/home/Hero";
import {TabsSection} from "@/components/home/TabsSection";

export default function Home() {
  useEffect(() => {
    printMe()
  }, []);

  return (
    <div className="relative w-full">

      <div className="absolute inset-0 z-0 pointer-events-none overflow-hidden">
        <div className="absolute top-[10%] left-[10%] w-80 h-80 rounded-full bg-primary/20 blur-[100px] animate-blob" />
        <div className="absolute top-[40%] right-[10%] w-[420px] h-[420px] rounded-full bg-accent/20 blur-[120px] animate-blob animation-delay-2000" />
        <div className="absolute bottom-[10%] left-[25%] w-72 h-72 rounded-full bg-primary/15 blur-[100px] animate-blob animation-delay-4000" />
      </div>

      <Hero />

      <div className="relative min-h-svh overflow-hidden ">

        <div className="absolute inset-0 z-0 pointer-events-none">
          <div className="absolute top-[35%] right-[5%] w-[450px] h-[450px] rounded-full bg-green-500/15 blur-[120px] animate-blob animation-delay-2000" />
          <div className="absolute bottom-[15%] left-[15%] w-72 h-72 rounded-full bg-green-400/20 blur-[100px] animate-blob animation-delay-4000" />
        </div>

        <div className="container-custom relative z-1 py-16">
          <div className="py-16 sm:flex flex-col items-center w-full">
            <Suspense fallback={<div className="h-64" />}>
              <TabsSection />
            </Suspense>
          </div>
        </div>

        <style
          jsx
          global
        >{`
          @keyframes blob {
            0% {
              transform: translate(0px, 0px) scale(1);
            }
            33% {
              transform: translate(40px, -60px) scale(1.1);
            }
            66% {
              transform: translate(-30px, 30px) scale(0.9);
            }
            100% {
              transform: translate(0px, 0px) scale(1);
            }
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
    </div>
  );
}
