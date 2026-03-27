"use client";

import { Input } from "@/components/ui/input";
import { useTranslations } from "next-intl";
import { useState, useRef, useEffect } from "react";
import {Search, Loader2, StepForward} from "lucide-react";
import { useDebounce } from "use-debounce";
import { CoursesService } from "@/services/courses-service";
import { CourseListItem } from "@/schemas/courses-schema";
import {Link, useRouter} from "@/i18n/navigation";

const Hero = () => {
  const t = useTranslations();
  const [isOpen, setIsOpen] = useState(false);
  const [query, setQuery] = useState("");
  const [debouncedQuery] = useDebounce(query, 500);

  const [courses, setCourses] = useState<CourseListItem[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter()

  const inputRef = useRef<HTMLInputElement>(null);
  const modalRef = useRef<HTMLDivElement>(null);

  const fetchSearchCourses = async (search: string) => {
    setIsLoading(true);
    try {
      const res = await CoursesService.getAllCourses({
        search: search,
        page: 0,
        size: 5,
      });
      setCourses(res.items || []);
    } catch (err) {
      console.error("Search error:", err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    if (isOpen) {
      fetchSearchCourses(debouncedQuery);
    }
  }, [debouncedQuery, isOpen]);

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (modalRef.current && !modalRef.current.contains(e.target as Node) &&
        inputRef.current && !inputRef.current.contains(e.target as Node)) {
        setIsOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <section className="relative w-full py-16">
      <div className="container-custom relative z-10">
        <div className="text-center space-y-6">
          <h1 className="text-4xl md:text-5xl font-bold tracking-tight">
            {t("courses.hero.titlePrefix")}{" "}
            <span className="text-primary">{t("courses.hero.titleHighlight")}</span>
          </h1>

          <p className="text-muted-foreground text-lg">{t("courses.hero.description")}</p>

          <div className="relative max-w-xl mx-auto">
            <div className="relative">
              <Input
                ref={inputRef}
                type="text"
                placeholder={t("courses.hero.searchPlaceholder")}
                value={query}
                onFocus={() => setIsOpen(true)}
                onChange={(e) => {
                  setQuery(e.target.value);
                  if (!isOpen) setIsOpen(true);
                }}
                className="h-12 pl-12 pr-4 rounded-full bg-card/70 backdrop-blur border-border focus-visible:ring-primary transition-all"
              />
              <div className="absolute left-4 top-1/2 -translate-y-1/2 text-muted-foreground">
                {isLoading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Search className="w-4 h-4" />}
              </div>
            </div>

            {isOpen && (
              <div
                ref={modalRef}
                className="absolute left-0 z-999 right-0 mt-2 bg-card border border-border rounded-xl shadow-2xl p-2 max-h-80 overflow-y-auto animate-in fade-in zoom-in-95 duration-200"
              >
                <ul className="space-y-1">
                  {isLoading ? (
                    <li className="p-4 text-center text-sm text-muted-foreground">{t('common.loading')}</li>
                  ) : courses.length > 0 ? (
                    courses.map((course) => (
                      <li
                        key={course.id}
                        className="rounded-lg p-3 hover:bg-primary hover:text-primary-foreground cursor-pointer flex items-center justify-between group transition-colors"
                        onClick={() => {
                          setQuery(course.title);
                          setIsOpen(false);
                          router.push(`/courses/${course.slug}`);
                        }}
                      >
                        <span className="text-sm font-medium">{course.title}</span>
                        <StepForward className="w-4 h-4 opacity-0 group-hover:opacity-100 transition-opacity" />
                      </li>
                    ))
                  ) : (
                    <li className="p-4 text-center text-sm text-muted-foreground italic">
                      {t('common.noResults')}
                    </li>
                  )}
                </ul>
              </div>
            )}
          </div>
        </div>
      </div>
    </section>
  );
};

export default Hero;