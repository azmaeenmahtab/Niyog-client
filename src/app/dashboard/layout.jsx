import DashboardNavbar from '@/components/Dashboard/DashboardNavbar'
import Navbar from '@/components/Navbar'
import React from 'react'

const dashboardlayout = ({children}) => {
  return (
    <div>
      <DashboardNavbar />
      {children}
    </div>
  )
}

export default dashboardlayout
