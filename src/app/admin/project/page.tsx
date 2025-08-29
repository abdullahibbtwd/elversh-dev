"use client"

import dynamic from 'next/dynamic'
import React from 'react'

const ProjectsAdminDashboard = dynamic(() => import('@/components/Admin/Project'), {
  ssr: false,
  loading: () => <div>Loading...</div>
})

const page = () => {
  return (
    <div>
      <ProjectsAdminDashboard/>
    </div>
  )
}

export default page
