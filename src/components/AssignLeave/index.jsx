import React, { useState } from 'react';
import DatePicker from 'react-datepicker';
import { useTheme } from '@context/ThemeContext';
import Button from '@components/common/Button';
import './index.css'; // Custom styles

export default function AssignLeave() {
    const [department, setDepartment] = useState('');
    const [leaveType, setLeaveType] = useState('');
    const [location, setLocation] = useState('');
    const [assignedBy, setAssignedBy] = useState('');
    const [dateRange, setDateRange] = useState([null, null]);
    const [comments, setComments] = useState('');
    const { themeMode } = useTheme();

    const [startDate, endDate] = dateRange;

    const calculateDays = () => {
        if (!startDate || !endDate) return '';
        const diff = Math.floor((endDate - startDate) / (1000 * 60 * 60 * 24)) + 1;
        return `${diff} Day${diff > 1 ? 's' : ''}`;
    };

    const handleAssignLeave = () => {
        const payload = {
            department,
            leaveType,
            location,
            assignedBy,
            dateRange: {
                start: startDate,
                end: endDate,
            },
            numberOfDays: calculateDays(),
            comments,
        };
        console.log('Assigning Leave:', payload);
        // Call API or other logic here
    };

    return (
        <div className={`assign-leave-card p-4 shadow bg-${themeMode}-two`}>
            <form>
                <div className="row mb-3">
                    <div className="col-md-6">
                        <label className="form-label">Department*</label>
                        <select className="form-select assign-leave-input" value={department} onChange={(e) => setDepartment(e.target.value)}>
                            <option value="">Select Department</option>
                            <option value="IT">IT</option>
                            <option value="HR">HR</option>
                        </select>
                    </div>
                    <div className="col-md-6">
                        <label className="form-label">Leave Type*</label>
                        <select className="form-select assign-leave-input" value={leaveType} onChange={(e) => setLeaveType(e.target.value)}>
                            <option value="">Select Leave Type</option>
                            <option value="Annual">Annual</option>
                            <option value="Sick">Sick</option>
                        </select>
                    </div>
                </div>

                <div className="row mb-3">
                    <div className="col-md-6">
                        <label className="form-label">Location*</label>
                        <select className="form-select assign-leave-input" value={location} onChange={(e) => setLocation(e.target.value)}>
                            <option value="">Select Location</option>
                            <option value="Hyderabad">Hyderabad</option>
                            <option value="Bangalore">Bangalore</option>
                        </select>
                    </div>
                    <div className="col-md-6">
                        <label className="form-label">Assigned By*</label>
                        <select className="form-select assign-leave-input" value={assignedBy} onChange={(e) => setAssignedBy(e.target.value)}>
                            <option value="">Select Manager</option>
                            <option value="Manager (Sujith Chandra)">Manager (Sujith Chandra)</option>
                        </select>
                    </div>
                </div>

                <div className="row mb-3">
                    <div className="col-md-6 d-flex flex-column">
                        <label className="form-label">Date Range</label>
                        <DatePicker
                            selectsRange
                            startDate={startDate}
                            endDate={endDate}
                            onChange={(update) => setDateRange(update)}
                            isClearable
                            placeholderText="Select date range"
                            className="form-control assign-leave-input"
                        />
                    </div>
                    <div className="col-md-6">
                        <label className="form-label">No. of Days</label>
                        <input
                            type="text"
                            className="form-control assign-leave-input"
                            readOnly
                            value={calculateDays()}
                            placeholder="Auto filled"
                        />
                    </div>
                </div>

                <div className="mb-3">
                    <label className="form-label">Comments</label>
                    <textarea
                        className="form-control assign-leave-input"
                        rows='6'
                        column='6'
                        value={comments}
                        onChange={(e) => setComments(e.target.value)}
                    />
                </div>

                <div className="text-center">
                    <Button variant='solid' size='sm' label={'Assign Leave'} onClick={handleAssignLeave} />
                </div>
            </form>
        </div>
    );
}
