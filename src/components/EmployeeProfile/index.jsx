import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { mockEmployees } from '@data/mockData';
import { useTheme } from '@context/ThemeContext';
// profile icons
import { FaPhoneAlt, FaEnvelope, FaMapMarkerAlt, FaIdBadge } from 'react-icons/fa';
// tab icons
import {
    FaInfoCircle,
    FaUser,
    FaBriefcase,
    FaFileAlt
} from 'react-icons/fa';

// components for tabs
import AboutEmployee from '@components/AboutEmployee';
import AboutEmployeeProfile from '@components/AboutEmployeeProfile';
import JobDetails from '@components/JobDetails';

// stylings
import './index.css';

// content components for each tab
const DocumentsTab = () => <div className="tab-content-body">Documents Content</div>;

// Tab Links
const tabList = [
    { key: 'ABOUT', label: 'About', icon: <FaInfoCircle />, className: 'tab-about' },
    { key: 'PROFILE', label: 'Profile', icon: <FaUser />, className: 'tab-profile' },
    { key: 'JOB', label: 'Job', icon: <FaBriefcase />, className: 'tab-job' },
    { key: 'DOCUMENTS', label: 'Documents', icon: <FaFileAlt />, className: 'tab-documents' }
];

export default function EmployeeProfile() {
    const { id } = useParams();
    const [employee, setEmployee] = useState(null);
    const [activeMainTab, setActiveMainTab] = useState('ABOUT');
    const { themeMode, themeColor } = useTheme();

    // Fetching the employee details
    useEffect(() => {
        const found = mockEmployees.find(emp => emp.id === Number(id));
        setEmployee(found);
    }, [id]);

    if (!employee) {
        return (
            <div className="text-center mt-5">
                <h5>Employee not found</h5>
            </div>
        );
    }

    const getInitials = (fullName) => {
        const names = fullName.trim().split(' ');
        return names.length >= 2
            ? `${names[0][0]}${names[1][0]}`.toUpperCase()
            : names[0][0].toUpperCase();
    };

    const generateColor = (name) => {
        const colors = ['#f44336', '#2196f3', '#4caf50', '#ff9800', '#9c27b0', '#3f51b5', '#009688'];
        const hash = [...name].reduce((acc, char) => acc + char.charCodeAt(0), 0);
        return colors[hash % colors.length];
    };

    const initials = getInitials(employee.displayName);
    const bgColor = generateColor(employee.displayName);

    const renderMainTabContent = () => {
        switch (activeMainTab) {
            case 'ABOUT': return <AboutEmployee />;
            case 'PROFILE': return <AboutEmployeeProfile employee={employee} />;
            case 'JOB': return <JobDetails />;
            case 'DOCUMENTS': return <DocumentsTab />;
            default: return null;
        }
    };

    return (
        <div className={`employee-profile ${themeMode}`}>
            <div className="container">
                <div className="profile-card shadow-sm p-4 rounded">
                    <div className="row align-items-center">
                        <div className="col-12 col-md-2 text-center">
                            {employee.profilePic ? (
                                <img
                                    src={employee.profilePic}
                                    alt="profile"
                                    className="profile-img rounded"
                                />
                            ) : (
                                <div
                                    className="profile-initials rounded"
                                    style={{ backgroundColor: bgColor }}
                                >
                                    {initials}
                                </div>
                            )}
                        </div>

                        <div className="col-12 col-md-10">
                            <div className="d-flex align-items-center justify-content-between flex-wrap">
                                <h4 className="employee-name mb-0">{employee.displayName}</h4>
                                <span className="status-badge">IN</span>
                            </div>
                            <div className="employee-meta mt-2">
                                <span className="me-4">
                                    <FaIdBadge className="me-2" /> {employee.id}
                                </span>
                                <span className="me-4">
                                    <FaEnvelope className="me-2" /> {employee.email}
                                </span>
                                <span className="me-4">
                                    <FaPhoneAlt className="me-2" /> {employee.contactNumber}
                                </span>
                                <span className="me-4">
                                    <FaMapMarkerAlt className="me-2" /> {employee.location}
                                </span>
                            </div>
                        </div>
                    </div>

                    <div className="divider my-3"></div>

                    <div className="row ">
                        <div className="col-12 col-md-4 mb-3">
                            <div className="label">Business Unit</div>
                            <div className="value">TetriQ Solutions</div>
                        </div>
                        <div className="col-12 col-md-4 mb-3">
                            <div className="label">Department</div>
                            <div className="value">{employee.department}</div>
                        </div>
                        <div className="col-12 col-md-4 mb-3 d-flex align-items-center justify-content-start justify-content-md-start">
                            <div className="me-2">
                                <div className="label">Reporting Manager</div>
                                <div className="value d-flex align-items-center">
                                    {employee.profilePic ? (
                                        <img
                                            src={employee.reportingManagerProfile}
                                            alt="profile"
                                            className="rounded-circle me-2"
                                        />
                                    ) : (
                                        <div
                                            className="rounded-5 p-1 small me-1"
                                            style={{ backgroundColor: bgColor }}
                                        >
                                            {getInitials('Sujith Chandra')}
                                        </div>
                                    )}
                                    Sujith Chandra
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Main Tabs */}
                    <div className="custom-tabs mt-4">
                        <ul className="nav custom-tabs" role="tablist">
                            {tabList.map(tab => (
                                <li className="nav-item" key={tab.key}>
                                    <button
                                        className={`nav-link ${activeMainTab === tab.key ? 'active' : ''} ${themeColor} ${tab.className}`}
                                        onClick={() => setActiveMainTab(tab.key)}
                                    >
                                        <span className="tab-icon">{tab.icon}</span>
                                        <span className="tab-label">{tab.label}</span>
                                    </button>
                                </li>
                            ))}
                        </ul>
                    </div>
                </div>

                {/* Components render container */}
                <div className="mt-3">
                    {renderMainTabContent()}
                </div>
            </div>
        </div>
    );
}
