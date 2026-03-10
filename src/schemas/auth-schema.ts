import z from "zod";
import {GenderValues} from "@/schemas/users-schema";

export const LoginSchema =  (t: any) =>  z.object({
  username_or_email: z.string().min(1),
  password: z.string().min(8, t("errors.zod.password_min"))
})
export type LoginSchemaType = z.infer<ReturnType<typeof LoginSchema>>;

export const RegisterSchema = (t: any) => z.object({
  username: z.string().min(1, t("errors.zod.required")),
  email: z.string().email(t("errors.zod.invalid_email")),
  password: z.string()
    .min(8, t("errors.zod.password_min"))
    .regex(/[A-Z]/, t("errors.zod.password_uppercase"))
    .regex(/[a-z]/, t("errors.zod.password_lowercase"))
    .regex(/\d/, t("errors.zod.password_number")),
  first_name: z.string().min(1, t("errors.zod.required")),
  last_name: z.string().min(1, t("errors.zod.required")),
  phone_number: z.string().regex(
    /^\+998\d{9}$/,
    t("errors.zod.phone_invalid")
  ),
  gender: z.any().nullable(),
});
export type RegisterSchemaType = z.infer<ReturnType<typeof RegisterSchema>>;

export const AuthResponseSchema = z.object({
  id: z.number(),
  email: z.string(),
  username: z.string(),
  first_name: z.string(),
  last_name: z.string(),
  avatar_url: z.string().nullable(),
  bio: z.string().nullable(),
  role_id: z.number(),
  role_name: z.string(),
  phone_number: z.string().nullable(),
  gender: GenderValues.nullable(),
  is_active: z.boolean(),
  created_at: z.string(),
  updated_at: z.string(),
  token: z.string(),
});


export type AuthResponse = z.infer<typeof AuthResponseSchema>;
