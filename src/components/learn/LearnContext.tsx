'use client'

import { createContext } from "react"
import { CourseModule } from "@/schemas/modules-schema"
import { CourseDetails } from "@/schemas/courses-schema"

export interface LearnContextValue {
  course: CourseDetails
  modules: CourseModule[]
  slug: string
  // TODO: replace with real enrollment check from your store/API
  isEnrolled: boolean
}

export const LearnContext = createContext<LearnContextValue>({
  course: {} as CourseDetails,
  modules: [],
  slug: "",
  isEnrolled: false,
})