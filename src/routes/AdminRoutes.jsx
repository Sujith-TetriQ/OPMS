import React from 'react';
import { Routes, Route } from 'react-router-dom';

import AdminLayout from '@layout/AdminLayout';
import AdminDashboard from '@pages/admin/AdminDashboard';
import AdminEmployees from '@pages/admin/AdminEmployees';
import AdminAttendance from '@pages/admin/AdminAttendance';
import AdminLeave from '@pages/admin/AdminLeave';
import AdminExit from '@pages/admin/AdminExit';
import AdminPayroll from '@pages/admin/AdminPayroll';

import EmployeeOverview from '@components/EmployeeOverview';
import EmployeeOnboardForm from '@components/EmployeeOnboardForm';
import MultiEmployeeForm from '@components/MultiEmployeeForm';
import EmployeeProfile from '@components/EmployeeProfile';

import EmployeeAttendanceView from '@components/EmployeeAttendanceView'

export default function AdminRoutes() {
  return (
    <Routes>
      <Route path='/admin' element={<AdminLayout />}>

        <Route path='dashboard' element={<AdminDashboard />} />

        {/* Employee-related routes */}
        <Route path='employees' element={<AdminEmployees />}>
          <Route index element={<EmployeeOverview />} />
          <Route path='add-single-employee' element={<EmployeeOnboardForm />} />
          <Route path='add-multi-employee' element={<MultiEmployeeForm />} />
          <Route path=':id' element={<EmployeeProfile />} />
        </Route>

        <Route path='attendance' element={<AdminAttendance />} />
        <Route path='attendance/:id' element={<EmployeeAttendanceView />} />
        <Route path='leaves' element={<AdminLeave />} />
        <Route path='payroll' element={<AdminPayroll />} />
        <Route path='exit' element={<AdminExit />} />
      </Route>
    </Routes>
  );
}