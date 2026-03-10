import { z } from "zod";

export const CategorySchema = z.object({
    id: z.number(),
    parent_id: z.number().nullable(),
    slug: z.string(),
    name: z.string(),
    description: z.string().nullable(),
    icon_url: z.string().nullable(),
    sort_order: z.number(),
    is_active: z.boolean(),
    created_at: z.string(),
});

export type Category = z.infer<typeof CategorySchema> & {
    children?: Category[];
};

export const CategoryTreeSchema: z.ZodType<Category> = CategorySchema.extend({
    children: z.lazy(() => CategoryTreeSchema.array()).optional(),
});

export const CategoriesDataSchema = z.array(CategoryTreeSchema);

export const CategoriesResponseSchema = z.object({
    data: CategoriesDataSchema
});

export type CategoriesResponse = z.infer<typeof CategoriesResponseSchema>;