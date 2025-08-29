"use client"
import dynamic from 'next/dynamic'
import React from 'react'

const SkillsAdminDashboard = dynamic(() => import('@/components/Admin/Skils'), {
  ssr: false,
  loading: () => <div>Loading...</div>
})

const page = () => {
  return (
    <div>
      <SkillsAdminDashboard/>
    </div>
  )
}

export default page
