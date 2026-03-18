'use client'

import React, {useEffect} from 'react'
import {useRouter} from "@/i18n/navigation";

const Page = () => {
  const router = useRouter()
  useEffect(() => {
    router.replace("/#courses-list")
  }, [])

  return (
    <div>Page</div>
  )
}
export default Page
