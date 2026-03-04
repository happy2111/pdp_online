import {z} from "zod";

export const CategoriesSchema = z.object(
  {
    id: z.string(),
    parent_id: z.string().nullable(),
    slug: z.string(),
    name: z.string(),
    description: z.string().nullable(),
    icon_url: z.string().nullable(),
    sort_order: z.number(),
    is_active: z.boolean(),
    created_at: z.string(),
  }
)
export type CategoriesSchema = z.infer<typeof CategoriesSchema>;



