import React, { useState } from 'react';
import { useTheme } from '@context/ThemeContext';
import {
  FiList,
  FiClock,
  FiUserPlus,
  FiUsers,
  FiEdit,
  FiFolder,
  FiCalendar,
} from 'react-icons/fi';

import AllLeaveRecords from '@components/AllLeaveRecords';
import PendingRequests from '@components/PendingRequests';
import AssignLeave from '@components/AssignLeave';
import ApplyLeave from '@components/ApplyLeave';
import YourLeaveRecords from '@components/YourLeaveRecords'
import EventCalendar from '@components/EventCalendar';

import './admin.css';

const leaveTabs = [
  {
    key: "all-records",
    label: "All Records",
    icon: <FiList />,
  },
  {
    key: "pending-requests",
    label: "Pending Requests",
    icon: <FiClock />,
  },
  {
    key: "assign-leave",
    label: "Assign Leave",
    icon: <FiUserPlus />,
  },
  // {
  //   key: "mass-assign",
  //   label: "Mass Assign",
  //   icon: <FiUsers />,
  // },
  {
    key: "apply-leave",
    label: "Apply",
    icon: <FiEdit />,
  },
  {
    key: "your-records",
    label: "Your Records",
    icon: <FiFolder />,
  },
  {
    key: "event-calendar",
    label: "Event Calendar",
    icon: <FiCalendar />,
  },
];

// Dummy components for demo
const componentMap = {
  "all-records": () => <AllLeaveRecords />,
  "pending-requests": () => <PendingRequests />,
  "assign-leave": () => <AssignLeave />,
  // "mass-assign": () => <div>Mass Assign Component</div>,
  "apply-leave": () => <ApplyLeave />,
  "your-records": () => <YourLeaveRecords />,
  "event-calendar": () => <EventCalendar />,
};

export default function AdminLeave() {
  const { themeMode } = useTheme();
  const [activeTab, setActiveTab] = useState("all-records");

  const ActiveComponent = componentMap[activeTab];

  return (
    <div className={`admin-leave ${themeMode === 'dark' ? 'dark-mode' : 'light-mode'}`}>
      <div className="container py-3">
        <div className="row mb-3">
          <h3>Leave Management</h3>
        </div>

        <div className="row mb-4">
          <ul className="nav nav-tabs">
            {leaveTabs.map((tab) => (
              <li key={tab.key} className="nav-item">
                <button
                  className={`nav-link d-flex align-items-center gap-2 ${activeTab === tab.key ? 'active' : ''
                    }`}
                  onClick={() => setActiveTab(tab.key)}
                >
                  <span>{tab.icon}</span>
                  <span className="d-none d-md-inline">{tab.label}</span>
                </button>
              </li>
            ))}
          </ul>
        </div>

        <div>
          <ActiveComponent />
        </div>
      </div>
    </div>
  );
}
