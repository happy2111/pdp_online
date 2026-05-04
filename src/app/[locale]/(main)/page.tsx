'use client'

import {useTranslations} from "next-intl";
import {Suspense, useEffect} from "react";
import {printMe} from "@/lib/utils";
import Hero from "@/components/home/Hero";
import {CoursesList} from "@/components/courses/CoursesList";
import {BookOpen, Loader2, Users} from "lucide-react";
import {useSearchParams} from "next/navigation";
import {useRouter} from "@/i18n/navigation";
import {TeachersList} from "@/components/TeachersList";
import {Button} from "@/components/ui/button";

export default function Home() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const t = useTranslations();

  const tab = searchParams.get("tab") || "courses";

  const setTab = (newTab: string) => {
    const params = new URLSearchParams(searchParams.toString());
    params.set("tab", newTab);
    params.set("page", "0");
    router.push(`?${params.toString()}`, {scroll: false});
  };

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
          <div className="py-16 sm:flex flex-col items-center">
            <div className="inline-flex gap-0 bg-background mb-12 border border-border/20 rounded-xl p-1">
              <button
                onClick={() => setTab("courses")}
                className={`
                  relative flex items-center gap-2 px-6 py-2 rounded-[calc(var(--radius-xl)-4px)]
                  text-sm font-medium transition-all duration-200 cursor-pointer border-none
                  ${tab === "courses"
                              ? "bg-muted text-foreground"
                              : "bg-transparent text-muted-foreground hover:text-foreground"
                            }
                `}
              >
                <BookOpen className="w-4 h-4" />
                Курсы
                <span
                  className={`text-xs px-1.5 py-0.5 rounded-full min-w-5 text-center transition-all ${
                    tab === "courses" ? "bg-background text-foreground" : "bg-muted text-muted-foreground"
                  }`}
                >
                  24
                </span>
              </button>

              <button
                onClick={() => setTab("teachers")}
                className={`
                  relative flex items-center gap-2 px-6 py-2 rounded-[calc(var(--radius-xl)-4px)]
                  text-sm font-medium transition-all duration-200 cursor-pointer border-none
                  ${tab === "teachers"
                              ? "bg-muted text-foreground"
                              : "bg-transparent text-muted-foreground hover:text-foreground"
                            }
                `}
              >
                <Users className="w-4 h-4" />
                Учителя
                <span
                  className={`text-xs px-1.5 py-0.5 rounded-full min-w-5 text-center transition-all ${
                    tab === "teachers" ? "bg-background text-foreground" : "bg-muted text-muted-foreground"
                  }`}
                >
      8
    </span>
              </button>
            </div>

            {tab === "courses" && (
              <Suspense
                fallback={null}
              >
                <CoursesList />
              </Suspense>)}
            {tab === "teachers" &&
              <Suspense
                fallback={null}
              ><TeachersList />
              </Suspense>
            }
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
