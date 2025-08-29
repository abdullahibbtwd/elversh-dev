"use client"
import dynamic from 'next/dynamic'
import React from 'react'

const WorkExperienceDashboard = dynamic(() => import('@/components/Admin/WorkinExprience'), {
  ssr: false,
  loading: () => <div>Loading...</div>
})

const page = () => {
  return (
    <div>
      <WorkExperienceDashboard/>
    </div>
  )
}

export default page
