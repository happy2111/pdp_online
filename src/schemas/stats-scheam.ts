import {z} from 'zod'

export const statsSchema = z.object({
  students: z.number(),
  teachers: z.number(),
  courses: z.number(),
})

export type StatsSchema = z.infer<typeof statsSchema>