import React, { useState } from 'react';
import { useTheme } from '@context/ThemeContext';
import {
  FiBarChart2,  // Payroll Summary
  FiPlayCircle, // Run Payroll
  FiFileText,   // Payroll Reports
} from 'react-icons/fi';

//components
import PayrollSummary from '@components/PayrollSummary';
import RunPayroll from '@components/RunPayroll';

//payroll tabs list
const payrollTabs = [
  {
    key: "payroll-summary",
    label: "Payroll Summary",
    icon: <FiBarChart2 />,
  },
  {
    key: "run-payroll",
    label: "Run Payroll",
    icon: <FiPlayCircle />,
  },
  {
    key: "payroll-reports",
    label: "Payroll Reports",
    icon: <FiFileText />,
  },
];

// components initalization
const componentMap = {
  "payroll-summary": () => <PayrollSummary />,
  "run-payroll": () => <RunPayroll />,
  "payroll-reports": () => <>Payroll Reports</>, //<PayrollReports />
};

export default function AdminPayroll() {
  const { themeMode, themeColor } = useTheme();
  const [activeTab, setActiveTab] = useState("payroll-summary");

  const ActiveComponent = componentMap[activeTab];
  const colorClass = `theme-${themeColor || 'violet'}`;
  return (
    <div className={`admin-payroll-page ${colorClass}`}>
      <div className="container">
        <h3 className='mt-3'>Payroll Management</h3>
        <div className="row mt-3">
          <ul className="nav nav-tabs">
            {payrollTabs.map((tab) => (
              <li key={tab.key} className="nav-item">
                <button
                  className={`nav-link d-flex align-items-center gap-2 ${activeTab === tab.key ? 'active' : ''}`}
                  onClick={() => setActiveTab(tab.key)}
                >
                  <span>{tab.icon}</span>
                  <span className="d-none d-md-inline">{tab.label}</span>
                </button>
              </li>
            ))}
          </ul>
        </div>
        <div className="mt-4">
          <ActiveComponent />
        </div>
      </div>
    </div>
  );
}
