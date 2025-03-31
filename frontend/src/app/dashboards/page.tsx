import React from 'react'
import FacultyDashboard from '@/app/dashboards/faculty'
import { SessionProvider } from "next-auth/react";

const page = () => {
  return (
    <SessionProvider>
      <FacultyDashboard/>
    </SessionProvider>
    
  )
}

export default page