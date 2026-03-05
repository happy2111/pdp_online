import z from "zod";
import {GenderValues} from "@/schemas/users-schema";

export const LoginSchema = z.object({
  username_or_email: z.string().min(1),
  password: z.string().min(1),
})
export type LoginSchema = z.infer<typeof LoginSchema>;


export const RegisterSchema = z.object({
  username: z.string().min(1),
  email: z.email(),
  password: z.string().min(6),
  first_name: z.string().min(1),
  last_name: z.string().min(1),
  phone_number: z.string().regex(
    /^\+998\d{9}$/,
    'invalid uzbek phone number'
  ),
  gender: GenderValues,
})
export type RegisterSchema = z.infer<typeof RegisterSchema>;
