
import React, { useState } from 'react';
import { NavLink, Outlet } from 'react-router-dom';
import { MdPeopleAlt } from 'react-icons/md';
import { SlCalender } from 'react-icons/sl';
import AdminHeader from '../components/AdminHeader';

import './AdminLayout.css';

const AdminLayout = () => {
  const [currentSection, setCurrentSection] = useState('employee');
  const [activeMainTab, setActiveMainTab] = useState('Employee Management');
  const [activeSubTab, setActiveSubTab] = useState('Dashboard');
  const [sidebarColor] = useState('violet');
  const [headerColor] = useState('violet');

  const menus = {
    employee: {
      'Employee Management': ['Dashboard', 'Employee Records', 'Basic Details', 'Job Details', 'Work Details'],
      'Department Management': ['Active Department', 'Inactive Department'],
    },
    attendance: {
      'Attendance Management': ['Dashboard', 'Attendance Tracking'],
    },
  };

  const handleMainTabClick = (tab) => {
    setActiveMainTab(tab);
    setActiveSubTab(menus[currentSection][tab][0]);
  };

  const handleSubTabClick = (subTab) => {
    setActiveSubTab(subTab);
  };

  const handleSidebarSectionChange = (sectionKey, defaultMainTab) => {
    const defaultSubTab = menus[sectionKey][defaultMainTab][0];
    setCurrentSection(sectionKey);
    setActiveMainTab(defaultMainTab);
    setActiveSubTab(defaultSubTab);
  };

  return (
    <div className="flex h-screen">
      {/* Sidebar */}
      <aside className={`sidebar ${sidebarColor}-sidebar`}>
        <div className="logo-container w-full flex justify-center mb-6">
          <h3 className="fw-bold">SoGo</h3>
        </div>

        {/* Sidebar Menu */}
        <ul className="sidebar-menu">
          <li>
            <NavLink
              to="/admin/employee"
              className={({ isActive }) => isActive ? 'menu-item active' : 'menu-item'}
              onClick={() => handleSidebarSectionChange('employee', 'Employee Management')}
            >
              <div className="menu-icon"><MdPeopleAlt /></div>
              <span>Employee</span>
            </NavLink>
          </li>
          <li>
            <NavLink
              to="/admin/attendance"
              className={({ isActive }) => isActive ? 'menu-item active' : 'menu-item'}
              onClick={() => handleSidebarSectionChange('attendance', 'Attendance Management')}
            >
              <div className="menu-icon"><SlCalender /></div>
              <span>Attendance</span>
            </NavLink>
          </li>
        </ul>
      </aside>

      {/* Main Content Area */}
      <div className="d-flex flex-column w-100">
        <AdminHeader
          activeMainTab={activeMainTab}
          activeSubTab={activeSubTab}
          menus={menus[currentSection]}
          headerColor={headerColor}
          handleMainTabClick={handleMainTabClick}
          handleSubTabClick={handleSubTabClick}
        />
        <main className="p-1 main-content">
          <Outlet />
        </main>
      </div>
    </div>
  );
};

export default AdminLayout;
