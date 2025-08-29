import React, { useState } from 'react';
import { useTheme } from '@context/ThemeContext'; // get themeMode + themeColor from context
import {
  FiList,
  FiClock,
  FiUserPlus,
  // FiUsers,
  FiEdit,
  FiFolder,
  FiCalendar,
} from 'react-icons/fi';

import AllLeaveRecords from '@components/AllLeaveRecords';
import PendingRequests from '@components/PendingRequests';
import AssignLeave from '@components/AssignLeave';
import ApplyLeave from '@components/ApplyLeave';
import YourLeaveRecords from '@components/YourLeaveRecords';
import EventCalendar from '@components/EventCalendar';

import './admin.css';

/** Tab definitions: key, label, and icon */
const leaveTabs = [
  { key: 'all-records', label: 'All Records', icon: <FiList /> },
  { key: 'pending-requests', label: 'Pending Requests', icon: <FiClock /> },
  { key: 'assign-leave', label: 'Assign Leave', icon: <FiUserPlus /> },
  { key: 'apply-leave', label: 'Apply', icon: <FiEdit /> },
  { key: 'your-records', label: 'Your Records', icon: <FiFolder /> },
  { key: 'event-calendar', label: 'Event Calendar', icon: <FiCalendar /> },
];

/** Map each tab key to its component */
const componentMap = {
  'all-records': () => <AllLeaveRecords />,
  'pending-requests': () => <PendingRequests />,
  'assign-leave': () => <AssignLeave />,
  'apply-leave': () => <ApplyLeave />,
  'your-records': () => <YourLeaveRecords />,
  'event-calendar': () => <EventCalendar />,
};

export default function AdminLeave() {
  const { themeMode, themeColor } = useTheme(); // ← themeMode: 'dark' | 'light', themeColor: 'violet' | 'blue' | ...
  const [activeTab, setActiveTab] = useState('all-records');

  // Current tab component
  const ActiveComponent = componentMap[activeTab];

  // Wrapper classes:
  // - dark/light mode toggles palette variables defined in CSS
  // - theme-${themeColor} injects --theme-color which we reuse for tabs
  const modeClass = themeMode === 'dark' ? 'dark-mode' : 'light-mode';
  const colorClass = `theme-${themeColor || 'violet'}`;

  return (
    <div className={`admin-leave ${modeClass} ${colorClass}`}>
      <div className="container py-3">
        <div className="row mb-3">
          <h3>Leave Management</h3>
        </div>

        {/* Tabs */}
        <div className="row mb-4">
          <ul className="nav nav-tabs" role="tablist">
            {leaveTabs.map((tab) => {
              const isActive = activeTab === tab.key;
              return (
                <li key={tab.key} className="nav-item" role="presentation">
                  <button
                    type="button"
                    role="tab"
                    aria-selected={isActive}
                    aria-current={isActive ? 'page' : undefined}
                    className={`nav-link d-flex align-items-center gap-2 ${isActive ? 'active' : ''}`}
                    onClick={() => setActiveTab(tab.key)}
                  >
                    <span aria-hidden="true">{tab.icon}</span>
                    <span className="d-none d-md-inline">{tab.label}</span>
                  </button>
                </li>
              );
            })}
          </ul>
        </div>

        {/* Active tab content */}
        <div>
          <ActiveComponent />
        </div>
      </div>
    </div>
  );
}