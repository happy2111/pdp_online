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
  password: z.string()
    .min(8, "Password must be at least 8 characters")
    .regex(/[A-Z]/, "Password must contain at least one uppercase letter")
    .regex(/[a-z]/, "Password must contain at least one lowercase letter")
    .regex(/\d/, "Password must contain at least one number"),
  first_name: z.string().min(1),
  last_name: z.string().min(1),
  phone_number: z.string().regex(
    /^\+998\d{9}$/,
    'invalid uzbek phone number'
  ),
  gender: GenderValues.nullable(),
})
export type RegisterSchema = z.infer<typeof RegisterSchema>;

export const AuthResponseSchema = z.object({
  id: z.number(),
  email: z.string(),
  username: z.string(),
  firstName: z.string(),
  lastName: z.string(),
  avatarUrl: z.string().nullable(),
  bio: z.string().nullable(),
  roleId: z.number(),
  roleName: z.string(),
  phoneNumber: z.string().nullable(),
  gender: GenderValues.nullable(),
  isActive: z.boolean(),
  createdAt: z.string(),
  updatedAt: z.string(),
  token: z.string(),
});


export type AuthResponse = z.infer<typeof AuthResponseSchema>;
