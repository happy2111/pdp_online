"use client";

import { Input } from "@/components/ui/input";
import { useTranslations } from "next-intl";

const Hero = () => {
  const t = useTranslations();

  return (
    <section className="relative w-full py-16 overflow-hidden">
      <div className="container-custom relative z-10">
        <div className=" text-center space-y-6">
          <h1 className="text-4xl md:text-5xl font-bold tracking-tight">
            {t("courses.hero.titlePrefix")}{" "}
            <span className="text-primary">
              {t("courses.hero.titleHighlight")}
            </span>
          </h1>

          <p className="text-muted-foreground text-lg">
            {t("courses.hero.description")}
          </p>

          <div className="relative max-w-xl mx-auto">

            <Input
              type="text"
              placeholder={t("courses.hero.searchPlaceholder")}
              className="
              h-12
              pl-12 pr-4
              rounded-full
              bg-card/70
              backdrop-blur
              border-border
              focus-visible:ring-primary
              transition-all
              "
            />

            <div className="absolute left-4 top-1/2 -translate-y-1/2 text-muted-foreground">
              <svg
                className="w-5 h-5"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                />
              </svg>
            </div>

          </div>

        </div>

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

    </section>
  );
};

export default Hero;