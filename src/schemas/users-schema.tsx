import {z} from "zod";
import {useTranslations} from "next-intl";

export const GenderValues = z.enum(["male", "female"]);
export type GenderValues = z.infer<typeof GenderValues>;

interface GenderLabelProps {
  gender: GenderValues | null;
}

export function GenderLabel({ gender }: GenderLabelProps) {
  const t = useTranslations();

  if (!gender) return null;

  return <span>{t(`common.${gender}`)}</span>;
}
export const UsersSchema = z.object(
  {
      id: z.number(),
      email: z.string(),
      username: z.string(),
      password_hash: z.string(),
      first_name: z.string(),
      last_name: z.string(),
      avatar_url: z.string().nullable(),
      bio: z.string().nullable(),
      role_id: z.number(),
      phone_number: z.string().nullable(),
      gender: GenderValues.nullable(),
      is_active: z.boolean(),
      created_at: z.string(),
      updated_at: z.string(),
  }
)
export type UsersSchema = z.infer<typeof UsersSchema>;

export const RolesSchema = z.object(
  {
    id: z.string(),
    name: z.string(),
    display_name: z.string(),
    description: z.string().nullable(),
    permissions: z.unknown(), // TODO узнать какой именно будет тип
    created_at: z.string(),
  }
)
export type RolesSchema = z.infer<typeof RolesSchema>;

export const TeacherProfileSchema = z.object(
  {
    id: z.string(),
    user_id: z.string(),
    title: z.string().nullable(),
    department: z.string(),
    expertise_areas: z.array(z.any()),
    office_location: z.string().nullable(),
    rating_avg: z.number().nullable(),
    total_students: z.number().nullable(),
    is_verified: z.boolean(),
    created_at: z.string(),
  }
)
export type TeacherProfileSchema = z.infer<typeof TeacherProfileSchema>;

