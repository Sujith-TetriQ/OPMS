import React, { useEffect, useState, useRef } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { mockEmployees } from '@data/mockData';
import { useTheme } from '@context/ThemeContext';
import Button from '@components/common/Button';
import Avatar from '@components/common/Avatar';
// profile icons
import { FaPhoneAlt, FaEnvelope, FaMapMarkerAlt, FaIdBadge } from 'react-icons/fa';
// tab icons
import {
    FaInfoCircle,
    FaUser,
    FaBriefcase,
    FaFileAlt
} from 'react-icons/fa';
import { BsThreeDotsVertical } from "react-icons/bs";

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
    const navigate = useNavigate();
    const [employee, setEmployee] = useState(null);
    const [activeMainTab, setActiveMainTab] = useState('ABOUT');
    const [isPopoverOpen, setIsPopoverOpen] = useState(false);
    const [isConfirmationOpen, setIsConfirmationOpen] = useState(false);
    const { themeMode, themeColor } = useTheme();
    const popoverRef = useRef(null);
    const threeDotsButtonRef = useRef(null);

    // Fetching the employee details
    useEffect(() => {
        const found = mockEmployees.find(emp => emp.id === Number(id));
        setEmployee(found);
    }, [id]);

    // Handle clicks outside the popover to close it
    useEffect(() => {
        const handleOutsideClick = (event) => {
            if (
                popoverRef.current &&
                !popoverRef.current.contains(event.target) &&
                threeDotsButtonRef.current &&
                !threeDotsButtonRef.current.contains(event.target)
            ) {
                setIsPopoverOpen(false);
            }
        };

        document.addEventListener('mousedown', handleOutsideClick);
        return () => {
            document.removeEventListener('mousedown', handleOutsideClick);
        };
    }, []);

    if (!employee) {
        return (
            <div className="text-center mt-5">
                <h5>Employee not found</h5>
            </div>
        );
    }

    // Function to handle the "Exit Employee" action
    const handleExitEmployee = () => {
        setIsPopoverOpen(false); // Close popover
        setIsConfirmationOpen(true); // Open confirmation dialog
    };

    // Function to confirm the exit and navigate
    const handleConfirmExit = () => {
        setIsConfirmationOpen(false);
        navigate(`/admin/employees/exit-process/${employee.id}`);
    };

    // Function to cancel the exit process
    const handleCancelExit = () => {
        setIsConfirmationOpen(false);
    };

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
                            {/* ✅ Avatar Component */}
                            <Avatar
                                name={employee.displayName}
                                imageUrl={employee.profilePic}
                                size={130}
                                type="square"
                            />
                        </div>

                        <div className="col-12 col-md-10">
                            <div className="d-flex align-items-center justify-content-between flex-wrap">
                                <h4 className="employee-name mb-0">{employee.displayName}</h4>
                                <div className="d-flex align-items-center gap-2 position-relative">
                                    <span className="status-badge">IN</span>
                                    {/* Three-dots button to toggle the popover */}
                                    <button
                                        className="btn border-0"
                                        onClick={() => setIsPopoverOpen(!isPopoverOpen)}
                                        ref={threeDotsButtonRef}
                                    >
                                        <BsThreeDotsVertical size={20} />
                                    </button>
                                    {isPopoverOpen && (
                                        <div ref={popoverRef} className={`bg-${themeMode}-two custom-popover`}>
                                            <ul className="custom-popover-list">
                                                <li
                                                    className="custom-popover-item text-danger"
                                                    onClick={handleExitEmployee}
                                                >
                                                    Exit Employee
                                                </li>
                                            </ul>
                                        </div>
                                    )}
                                </div>
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
                                    <Avatar
                                        name="Sujith Chandra"
                                        imageUrl={employee.reportingManagerProfile}
                                        size={30}
                                        type="rounded"
                                    />
                                    <span className="ms-2">Sujith Chandra</span>
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

            {/* Confirmation Modal/Popup */}
            {isConfirmationOpen && (
                <div className={`confirmation-overlay bg-${themeMode}-two`}>
                    <div className="confirmation-modal">
                        <h4 className="confirmation-header">Confirm Exit</h4>
                        <p className="confirmation-message">Are you sure you want to exit this employee? This action cannot be undone.</p>
                        <div className="confirmation-actions">
                            <Button variant='solid' size='sm' onClick={handleConfirmExit} label={'Yes, Exit'} />
                            <Button variant='outline' size='sm' onClick={handleCancelExit} label={'No, Cancel'} />
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
