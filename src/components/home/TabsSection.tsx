"use client";

import { useSearchParams } from "next/navigation";
import { useRouter } from "@/i18n/navigation";
import React, {Suspense, useEffect} from "react";
import { CoursesList } from "@/components/courses/CoursesList";
import { TeachersList } from "@/components/TeachersList";
import { BookOpen, Users } from "lucide-react";
import {useStatsStore} from "@/stores/stats-store";
import CountUp from "react-countup";
import {useTranslations} from "next-intl";
import NProgress from "nprogress";

export function TabsSection() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const t = useTranslations();
  const { stats, isLoading, fetchStats } = useStatsStore();
  useEffect(() => {
    fetchStats();
  }, []);

  const tab = searchParams.get("tab") || "courses";

  const setTab = (newTab: string) => {
    const params = new URLSearchParams(searchParams.toString());
    params.set("tab", newTab);
    params.set("page", "0");
    NProgress.start();
    router.push(`?${params.toString()}`, { scroll: false });
  };

  return (
    <>
      <div className="mb-10 inline-flex gap-0 bg-background/40 backdrop-blur-sm
                border border-border shadow-lgrounded-xl rounded-3xl p-1">
        <button
          onClick={() => setTab("courses")}
          className={`
      relative flex items-center gap-2 px-6 py-2 rounded-3xl
      text-sm font-medium transition-all duration-200 cursor-pointer border-none
      ${tab === "courses"
            ? "bg-muted/40 text-foreground"
            : "bg-transparent text-muted-foreground hover:text-foreground"
          }
    `}
        >
          <BookOpen className="w-4 h-4" />
          {t("common.tab.courses")}
          <span className={`text-xs px-1.5 py-0.5 rounded-full min-w-5 text-center transition-all ${
            tab === "courses" ? "bg-background text-foreground" : "bg-muted text-muted-foreground"
          }`}>
             <CountUp end={stats?.courses ?? 0} duration={1.5} />
          </span>
        </button>

        <button
          onClick={() => setTab("teachers")}
          className={`
      relative flex items-center gap-2 px-6 py-2 rounded-3xl
      text-sm font-medium transition-all duration-200 cursor-pointer border-none
      ${tab === "teachers"
            ? "bg-muted/40 text-foreground"
            : "bg-transparent text-muted-foreground hover:text-foreground"
          }
    `}
        >
          <Users className="w-4 h-4" />
          {t("common.tab.teachers")}
          <span className={`text-xs px-1.5 py-0.5 rounded-full min-w-5 text-center transition-all ${
            tab === "teachers" ? "bg-background text-foreground" : "bg-muted text-muted-foreground"
          }`}>
             <CountUp end={stats?.teachers ?? 0} duration={1.5} />
          </span>
        </button>
      </div>

      <Suspense fallback={
        <div className="flex justify-center items-center min-w-full h-64 text-primary"></div>
      }>
        {tab === "courses" && <CoursesList />}
        {tab === "teachers" && <TeachersList />}
      </Suspense>
    </>
  );
}