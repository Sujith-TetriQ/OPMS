import React, { useState } from 'react';
import DatePicker from 'react-datepicker';
import { parse, isBefore, isAfter, format } from 'date-fns';
import { useTheme } from '@context/ThemeContext';
import './index.css';

const mockLeaveData = [
    {
        id: 1,
        name: 'Pavan Kurme',
        avatar: '/avatars/pavan.png',
        leaveType: 'Vaccation',
        approvedBy: 'Sujith Chandra',
        date: '12-07-2025 to 17-07-2025',
        days: '5 Days',
        status: 'Approved',
    },
    {
        id: 2,
        name: 'Bhanu Bellam',
        avatar: '/avatars/bhanu.png',
        leaveType: 'Unpaid',
        approvedBy: 'Vinay R',
        date: '12-07-2025 to 20-07-2025',
        days: '8 Days',
        status: 'Rejected',
    },
    {
        id: 3,
        name: 'Sai Kancharla',
        avatar: '/avatars/sai.png',
        leaveType: 'Emergency',
        approvedBy: 'Mounika D',
        date: '13-07-2025 to 19-07-2025',
        days: '6 Days',
        status: 'Pending',
    },
    {
        id: 4,
        name: 'Srinivas Chinta',
        avatar: '/avatars/srinivas.png',
        leaveType: 'Casual',
        approvedBy: 'Sravan M',
        date: '15-07-2025 to 19-07-2025',
        days: '4 Days',
        status: 'Rejected',
    },
    {
        id: 5,
        name: 'Robert Cooper',
        avatar: '/avatars/robert.png',
        leaveType: 'Casual',
        approvedBy: 'Sujith Chandra',
        date: '17-07-2025 to 19-07-2025',
        days: '2 Days',
        status: 'Approved',
    },
];

export default function AllRecords() {
    const { themeMode } = useTheme();

    const [filters, setFilters] = useState({
        jobTitle: '',
        department: '',
        location: '',
        dateRange: [null, null],
        status: [],
    });

    const allowedStatuses = ['Approved', 'Pending', 'Rejected'];
    const [startDate, endDate] = filters.dateRange;

    const handleStatusChange = (status) => {
        setFilters((prev) => {
            const isChecked = prev.status.includes(status);
            return {
                ...prev,
                status: isChecked
                    ? prev.status.filter((s) => s !== status)
                    : [...prev.status, status],
            };
        });
    };

    const filteredData = mockLeaveData.filter((record) => {
        if (!allowedStatuses.includes(record.status)) return false;

        if (filters.status.length > 0 && !filters.status.includes(record.status)) {
            return false;
        }

        if (startDate && endDate) {
            const [fromStr, toStr] = record.date.split(' to ');
            const recordStart = parse(fromStr, 'dd-MM-yyyy', new Date());
            const recordEnd = parse(toStr, 'dd-MM-yyyy', new Date());

            const isOutsideRange =
                isAfter(startDate, recordEnd) || isBefore(endDate, recordStart);
            if (isOutsideRange) return false;
        }

        return true;
    });

    return (
        <div className={`all-records-container shadow-lg ${themeMode}`}>
            <div className="row g-3 mb-4">
                <div className="col-md-3">
                    <label className="form-label">Job Title*</label>
                    <input
                        type="text"
                        className="form-control"
                        value={filters.jobTitle}
                        onChange={(e) => setFilters({ ...filters, jobTitle: e.target.value })}
                        placeholder="Enter job title"
                    />
                </div>
                <div className="col-md-3">
                    <label className="form-label">Department*</label>
                    <input
                        type="text"
                        className="form-control"
                        value={filters.department}
                        onChange={(e) => setFilters({ ...filters, department: e.target.value })}
                        placeholder="Enter department"
                    />
                </div>
                <div className="col-md-3">
                    <label className="form-label">Location*</label>
                    <input
                        type="text"
                        className="form-control"
                        value={filters.location}
                        onChange={(e) => setFilters({ ...filters, location: e.target.value })}
                        placeholder="Enter location"
                    />
                </div>
                <div className="col-md-3">
                    <label className="form-label">Date Range*</label>
                    <DatePicker
                        selectsRange
                        startDate={startDate}
                        endDate={endDate}
                        onChange={(update) => setFilters({ ...filters, dateRange: update })}
                        dateFormat="dd-MM-yyyy"
                        placeholderText="Select date range"
                        className="form-control"
                        isClearable
                    />
                </div>

                <div className="col-12 d-flex flex-wrap align-items-center gap-3">
                    <label className="form-label mb-0">Status</label>
                    {['All', ...allowedStatuses].map((status) => (
                        <div className="form-check form-check-inline" key={status}>
                            <input
                                className="form-check-input"
                                type="checkbox"
                                id={`status-${status}`}
                                checked={
                                    filters.status.includes(status) ||
                                    (status === 'All' && filters.status.length === 0)
                                }
                                onChange={() =>
                                    status === 'All'
                                        ? setFilters({ ...filters, status: [] })
                                        : handleStatusChange(status)
                                }
                            />
                            <label className="form-check-label" htmlFor={`status-${status}`}>
                                {status}
                            </label>
                        </div>
                    ))}
                </div>
            </div>

            <div className="table-responsive">
                <h5 className="mb-3">All Records</h5>
                <table className="table table-hover table-bordered align-middle leave-records-table">
                    <thead>
                        <tr>
                            <th>Employee Name</th>
                            <th>Leave Type</th>
                            <th>By Approval</th>
                            <th>Date</th>
                            <th>Days</th>
                            <th>Status</th>
                        </tr>
                    </thead>
                    <tbody>
                        {filteredData.length > 0 ? (
                            filteredData.map((record) => (
                                <tr key={record.id}>
                                    <td className="d-flex align-items-center gap-2 name-cell">
                                        <img src={record.avatar} alt={record.name} className="avatar" />
                                        {record.name}
                                    </td>
                                    <td>{record.leaveType}</td>
                                    <td>{record.approvedBy}</td>
                                    <td>{record.date}</td>
                                    <td>{record.days}</td>
                                    <td>
                                        <span className={`status-badge ${record.status.toLowerCase()}`}>
                                            {record.status}
                                        </span>
                                    </td>
                                </tr>
                            ))
                        ) : (
                            <tr>
                                <td colSpan="6" className="text-center py-4">
                                    No records found for the selected filters.
                                </td>
                            </tr>
                        )}
                    </tbody>
                </table>
            </div>
        </div>
    );
}
