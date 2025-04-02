"use client"
import React from 'react'
import StudentDashboard from './student'
import { Protected } from '../protected'
// import { SessionProvider } from 'next-auth/react'

const page = () => {
  return (
    
    <Protected requiredRole='student'>
      <StudentDashboard/>
    </Protected>
   
  )
}

export default page