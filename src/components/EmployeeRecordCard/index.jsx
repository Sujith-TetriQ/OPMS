import React from 'react';
import { FaExternalLinkAlt } from "react-icons/fa";
import { useTheme } from '@context/ThemeContext';
import { useNavigate } from 'react-router-dom';
import Avatar from '@components/common/Avatar';
import './index.css';

export default function EmployeeRecordCard({ employee }) {
    const { themeColor, themeMode } = useTheme();
    const navigate = useNavigate();

    const {
        id,
        firstName,
        middleName,
        lastName,
        jobTitle,
        employeeNumber,
        department,
        workEmail,
        phone,
        location,
        profileImage
    } = employee;

    const fullName = [firstName, middleName, lastName].filter(Boolean).join(' ');

    const handleViewProfile = () => {
        if (id) {
            navigate(`/admin/employees/${id}`);
        }
    };

    return (
        <div className="col-md-6 col-lg-4 my-3 flex-grow-1">
            <div className={`employee-card ${themeMode} shadow-sm`}>
                <div className="card-body d-flex">
                    <Avatar firstName={firstName} lastName={lastName} imageUrl={null} size={100} />
                    {/* <img
                        src={profileImage || 'https://placehold.co/150x150?text=No+Image'}
                        alt={fullName}
                        className="employee-photo"
                    /> */}
                    <div className="employee-details ms-3 flex-grow-1">
                        <div className="d-flex justify-content-between align-items-start">
                            <div>
                                <h6 className={`employee-name ${themeColor}`}>{fullName}</h6>
                                <small className="employee-role text-muted">{jobTitle}</small>
                            </div>
                            <button
                                className="border-0 bg-transparent"
                                onClick={handleViewProfile}
                                title="View Profile"
                            >
                                <FaExternalLinkAlt className="text-muted" />
                            </button>
                        </div>
                        <div className="employee-meta mt-2">
                            <p><strong>Employee ID:</strong> {employeeNumber}</p>
                            <p><strong>Department:</strong> {department}</p>
                            <p><strong>Email-ID:</strong> {workEmail}</p>
                            <p><strong>Mobile No:</strong> {phone}</p>
                            <p><strong>Location:</strong> {location}</p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
