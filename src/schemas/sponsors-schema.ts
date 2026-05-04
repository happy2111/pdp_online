import z from "zod";

export const SponsorResponseSchema = z.object({
  id: z.number(),
  name: z.string(),
  logo_url: z.string().nullable(),
  created_at: z.string(),
  updated_at: z.string(),
});

export type SponsorResponse = z.infer<typeof SponsorResponseSchema>;

export const CreateSponsorRequestSchema = z.object({
  name: z.string().min(1, "Name is required"),
});

export type CreateSponsorRequest = z.infer<typeof CreateSponsorRequestSchema>;

export const UpdateSponsorRequestSchema = z.object({
  name: z.string().optional(),
});

export type UpdateSponsorRequest = z.infer<typeof UpdateSponsorRequestSchema>;

export const LogoPresignRequestSchema = z.object({
  filename: z.string(),
});

export type LogoPresignRequest = z.infer<typeof LogoPresignRequestSchema>;

export const PresignResponseSchema = z.object({
  upload_url: z.string(),
  key: z.string(),
  content_type: z.string(),
});

export type PresignResponse = z.infer<typeof PresignResponseSchema>;

export interface GetSponsorsParams {
  page?: number;
  size?: number;
}

export interface SponsorListItem extends SponsorResponse {}

