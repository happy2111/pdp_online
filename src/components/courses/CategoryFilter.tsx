"use client";

import { useSearchParams } from "next/navigation";
import { useRouter } from  "@/i18n/navigation";
import { useEffect, useState, useMemo } from "react";
import { CategoriesService } from "@/services/categories-service";
import { Category } from "@/schemas/categories-schema";
import { Button } from "@/components/ui/button";
import { Loader2 } from "lucide-react";
import {useTranslations} from "next-intl";

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

  // 1. Находим активную категорию и её уровень в дереве
  const findActiveInfo = useMemo(() => {
    if (!currentId) return { activeParentId: null, subCategories: [] };

    for (const parent of categories) {
      // Если выбрана сама родительская категория
      if (parent.id.toString() === currentId) {
        return { activeParentId: parent.id, subCategories: parent.children || [] };
      }
      // Если выбран кто-то из детей
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
    <div className="flex flex-col gap-4 mb-8">
      {/* Первый уровень: Основные категории */}
      <div className="flex flex-wrap gap-2">
        <Button
          variant={!currentId ? "default" : "outline"}
          size="sm"
          className="rounded-full"
          onClick={() => handleCategoryClick(null)}
        >
          {t("common.allCategories")}
        </Button>
        {categories.map((cat) => (
          <Button
            key={cat.id}
            variant={findActiveInfo.activeParentId === cat.id ? "default" : "outline"}
            size="sm"
            className="rounded-full"
            onClick={() => handleCategoryClick(cat.id)}
          >
            {cat.name}
          </Button>
        ))}
      </div>

      {/* Второй уровень: Подкатегории (появляются только если есть дети) */}
      {findActiveInfo.subCategories.length > 0 && (
        <div className="flex flex-wrap gap-2 p-3 bg-muted/50 rounded-xl border animate-in fade-in slide-in-from-top-1">
          {findActiveInfo.subCategories.map((sub) => (
            <Button
              key={sub.id}
              variant={currentId === sub.id.toString() ? "secondary" : "ghost"}
              size="sm"
              className="rounded-full h-8 text-xs"
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