"use client";

import { useSearchParams } from "next/navigation";
import { useRouter } from  "@/i18n/navigation";
import { useEffect, useState, useMemo } from "react";
import { CategoriesService } from "@/services/categories-service";
import { Category } from "@/schemas/categories-schema";
import { Button } from "@/components/ui/button";
import { Loader2 } from "lucide-react";
import {useTranslations} from "next-intl";
import {cn} from "@/lib/utils";

export function CategoryFilter() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);

  const t = useTranslations();

  const currentId = searchParams.get("category_id");
  useEffect(() => {
    const fetchCats = async () => {
      try {
        const res = await CategoriesService.getAllCategories();
        // @ts-ignore
        setCategories(res.data);
      } catch (err) {
        console.error("Failed to fetch categories", err);
      } finally {
        setLoading(false);
      }
    };
    fetchCats();
  }, []);

  const findActiveInfo = useMemo(() => {
    if (!currentId) return { activeParentId: null, subCategories: [] };

    for (const parent of categories) {
      if (parent.id.toString() === currentId) {
        return { activeParentId: parent.id, subCategories: parent.children || [] };
      }
      const child = parent.children?.find(c => c.id.toString() === currentId);
      if (child) {
        return { activeParentId: parent.id, subCategories: parent.children || [] };
      }
    }
    return { activeParentId: null, subCategories: [] };
  }, [categories, currentId]);

  const handleCategoryClick = (id: number | null) => {
    const params = new URLSearchParams(searchParams.toString());
    if (id === null) {
      params.delete("category_id");
    } else {
      params.set("category_id", id.toString());
    }
    params.set("page", "0");
    router.push(`?${params.toString()}`, { scroll: false });
  };

  if (loading) return <Loader2 className="animate-spin h-5 w-5 mb-6" />;

  return (
    <div className="flex w-full flex-col gap-3 mb-8">
      <div className="flex w-full overflow-x-auto no-scrollbar gap-2 pb-0.5">
        <Button
          variant="ghost"
          size="sm"
          className={cn(
            "shrink-0 rounded-2xl h-10 px-5 font-semibold text-sm transition-all duration-200",
            !currentId
              ? "bg-primary text-primary-foreground hover:bg-primary/90"
              : "bg-muted/60 text-muted-foreground hover:text-foreground hover:bg-muted"
          )}
          onClick={() => handleCategoryClick(null)}
        >
          {t("common.allCategories")}
        </Button>
        {categories.map((cat) => (
          <Button
            key={cat.id}
            variant="ghost"
            size="sm"
            className={cn(
              "shrink-0 rounded-2xl h-10 px-5 font-semibold text-sm transition-all duration-200",
              findActiveInfo.activeParentId === cat.id
                ? "bg-primary text-primary-foreground hover:bg-primary/90"
                : "bg-muted/60 text-muted-foreground hover:text-foreground hover:bg-muted"
            )}
            onClick={() => handleCategoryClick(cat.id)}
          >
            {cat.name}
          </Button>
        ))}
      </div>

      {findActiveInfo.subCategories.length > 0 && (
        <div className="flex w-full overflow-x-auto no-scrollbar gap-2 px-3 py-2.5 bg-muted/40 rounded-2xl border border-border/50 animate-in fade-in slide-in-from-top-2 duration-200">
          {findActiveInfo.subCategories.map((sub) => (
            <Button
              key={sub.id}
              variant="ghost"
              size="sm"
              className={cn(
                "shrink-0 rounded-xl h-9 px-4 text-xs font-semibold transition-all duration-200",
                currentId === sub.id.toString()
                  ? "bg-background text-foreground shadow-sm border border-border/60"
                  : "text-muted-foreground hover:text-foreground hover:bg-background/70"
              )}
              onClick={() => handleCategoryClick(sub.id)}
            >
              {sub.name}
            </Button>
          ))}
        </div>
      )}
    </div>
  );
}