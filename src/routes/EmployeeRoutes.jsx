import React from 'react'
import { Routes, Route } from 'react-router-dom';

// Employee Pages & Routes
import EmployeeLayout from '@layout/EmployeeLayout';
import EmployeeDashboard from '@pages/employee/EmployeeDashboard';
import EmployeeProfile from '@components/EmployeeProfile';
import Inbox from '@components/Inbox';

export default function EmployeeRoutes() {
  return (
    <div>
        <Routes>
            <Route path='/employee' element={<EmployeeLayout />}>
                <Route path='dashboard' element={<EmployeeDashboard />} />
                <Route path='me/profile/:id' element={<EmployeeProfile />} />
                <Route path='inbox' element={<Inbox />} />
            </Route>
        </Routes>
    </div>
  )
}
