import { Sidebar } from '@/components/Dashboard/Sidebar'
import RecruiterDashboardStats from '@/components/Dashboard/StatSection'
import React from 'react'

const RecruiterPage = () => {
  return (
    <div className='flex gap-4 min-h-screen bg-[#121212] text-white '> 
        <div className="">
            <Sidebar />
        </div>
        <div className='flex-1 p-6'>
            <RecruiterDashboardStats />
        </div>
        
    </div>
  )
}

export default RecruiterPage
