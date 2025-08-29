"use client"
import dynamic from 'next/dynamic'
import React from 'react'

const ServicesAdminDashboard = dynamic(() => import('@/components/Admin/Services'), {
  ssr: false,
  loading: () => <div>Loading...</div>
})

const page = () => {
  return (
    <div>
      <ServicesAdminDashboard/>
    </div>
  )
}

export default page
