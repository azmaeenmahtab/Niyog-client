import DashboardNavbar from '@/components/RecruiterDashboard/DashboardNavbar'
import { Sidebar } from '@/components/RecruiterDashboard/Sidebar'
import Navbar from '@/components/Navbar'
import React from 'react'

const layout = ({ children }) => {
  return (
    <div>
      <DashboardNavbar />
      <div className='flex gap-4 min-h-screen bg-[#121212] text-white '>
        <div className="">
          <Sidebar />
        </div>
        <div className='flex-1 p-6'>
          {children}
        </div>
      </div>

    </div>
  )
}

export default layout
