import {z} from "zod";

export const VideoProgressEventType = z.enum([
  "COURSE", "LESSON"
])

export type VideoProgressEventType = z.infer<typeof VideoProgressEventType>

export const VideoProgressSchema = z.object({
  type: VideoProgressEventType,
  id: z.string(),
  status: z.string(),
  progress: z.coerce.number(),
})

export type VideoProgressType = z.infer<typeof VideoProgressSchema>
