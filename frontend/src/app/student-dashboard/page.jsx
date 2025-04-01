"use client"
import React from 'react'
import StudentDashboard from './student'
import { Protected } from '../protected'

const page = () => {
  return (
    <Protected requiredRole>
      <StudentDashboard/>
    </Protected>
    
  )
}

export default page