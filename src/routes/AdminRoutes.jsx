import React, { Component } from 'react'
import { Routes, Route } from 'react-router-dom'

import AdminLayout from '../layouts/AdminLayout'
import AdminDashboard from '../pages/admin/AdminDashboard'
import AdminEmployee from '../pages/admin/AdminEmployee'
import AdminAttendance from '../pages/admin/AdminAttendance'

export default class AdminRoutes extends Component {
  render() {
    return (
      <Routes>
        <Route path='/admin' element={<AdminLayout />}>
            <Route path='dashboard' element={<AdminDashboard />} />
            <Route path='employee' element={<AdminEmployee />} />
            <Route path='attendance' element={<AdminAttendance />} />
        </Route>
      </Routes>
    )
  }
}
