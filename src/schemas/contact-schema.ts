import z from "zod";

export const ContactSchema = (t: any) => z.object({
  name: z.string()
    .min(1, t("errors.zod.required"))
    .max(100, "Max 100 characters"),
  phone: z.string()
    .regex(/^\+998\d{9}$/, t("errors.zod.phone_invalid")),
  telegram_username: z.string()
    .regex(/^@?[a-zA-Z0-9_]{5,32}$/, "Invalid telegram username")
    .optional()
    .nullable(),
  message: z.string()
    .min(5, "Minimum 5 characters")
    .max(1000, "Maximum 1000 characters"),
});

export type ContactSchemaType = z.infer<ReturnType<typeof ContactSchema>>;

export const ContactResponseSchema = z.object({
  code: z.number(),
  message: z.string(),
  data: z.any().nullable(),
});

export type ContactResponseType = z.infer<typeof ContactResponseSchema>;

