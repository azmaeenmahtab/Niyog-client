import { Sidebar } from '@/components/RecruiterDashboard/Sidebar'
import React from 'react'

const SeekerPage = () => {
  return (
    <div className='flex gap-4 min-h-screen bg-[#121212] text-white '>
      <div className="">
        <Sidebar />
      </div>
      <div className='flex-1 p-6'>
        <h1>Applicant Dashboard</h1>
      </div>

    </div>
  )
}

export default SeekerPage