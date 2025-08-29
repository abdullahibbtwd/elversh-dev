"use client"
import React, { useState, useEffect } from 'react'

export default function Page() {
  const [isClient, setIsClient] = useState(false)

  useEffect(() => {
    setIsClient(true)
  }, [])

  if (!isClient) {
    return <div>Loading...</div>
  }

  // Dynamic import only on client side
  const EducationCertificateDashboard = React.lazy(() => import('@/components/Admin/Education'))

  return (
    <div>
      <React.Suspense fallback={<div>Loading...</div>}>
        <EducationCertificateDashboard />
      </React.Suspense>
    </div>
  )
}

