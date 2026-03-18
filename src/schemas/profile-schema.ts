import { z } from "zod";

export const TeacherInfoSchema = z.object({
  title: z.string(),
  department: z.string(),
  rating_avg: z.number(),
  total_students: z.number(),
});

export type TeacherInfo = z.infer<typeof TeacherInfoSchema>;

export const ProfileSchema = z.object({
  id: z.number(),
  email: z.string(),
  username: z.string(),
  first_name: z.string(),
  last_name: z.string(),
  avatar_url: z.string(),
  bio: z.string(),
  role: z.string(),
  teacher_info: TeacherInfoSchema.nullable().optional(),
});

export type Profile = z.infer<typeof ProfileSchema>;



export type ProfileResponse = z.infer<typeof ProfileSchema>;

export const AvatarPresignRequestSchema = z.object({
  filename: z.string(),
});
export type AvatarPresignRequest = z.infer<typeof AvatarPresignRequestSchema>;

export const AvatarPresignResponseSchema = z.object({
  upload_url: z.string(),
  key: z.string(),
  content_type: z.string(),
});

export type AvatarPresignResponse = z.infer<typeof AvatarPresignResponseSchema>;

export const UpdateProfileRequestSchema = z.object({
  first_name: z.string(),
  last_name: z.string(),
  bio: z.string(),
  username: z.string(),
  title: z.string(),
  department: z.string(),
});

export type UpdateProfileRequest = z.infer<typeof UpdateProfileRequestSchema>;

export const UpdateProfileResponseSchema = z.object({
  data: ProfileSchema,
});

export type UpdateProfileResponse = z.infer<typeof UpdateProfileResponseSchema>;