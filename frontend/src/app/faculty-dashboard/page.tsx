"use client"

import React from 'react'
import FacultyDashboard from './faculty'
import {Protected} from '../protected'
const page = () => {
  return (
    <Protected requiredRole = 'faculty'>
       <FacultyDashboard/>
    </Protected>
   
  )
}

export default page