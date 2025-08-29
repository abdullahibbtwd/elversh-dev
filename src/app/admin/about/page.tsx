"use client"
import dynamic from 'next/dynamic'
import React from 'react'

const AboutPage = dynamic(() => import('@/components/Admin/AboutForm'), {
  ssr: false,
  loading: () => <div>Loading...</div>
})

const page = () => {
  return (
    <div>
      <AboutPage/>
    </div>
  )
}

export default page
