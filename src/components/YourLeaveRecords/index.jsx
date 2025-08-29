import React from 'react';
import { useTheme } from '@context/ThemeContext';
import Table from 'react-bootstrap/Table';
import './index.css';

const YourLeaveRecords = () => {
    const { themeMode } = useTheme();

    const leaveRecords = [
        { name: 'Pavan Kurme', leaveType: 'Sick Leave', date: '12-07-2025 to 17-07-2025', days: '5 Days', status: 'Approved' },
        { name: 'Bhanu Bellam', leaveType: 'Annual Leave', date: '12-07-2025 to 20-07-2025', days: '8 Days', status: 'Rejected' },
        { name: 'Sai kancharla', leaveType: 'Vacation Leave', date: '13-07-2025 to 19-07-2025', days: '6 Days', status: 'Pending' },
        { name: 'Srinivas Chinta', leaveType: 'Sick Leave', date: '15-07-2025 to 19-07-2025', days: '4 Days', status: 'Approved' },
        { name: 'Robert Cooper', leaveType: 'Sick Leave', date: '17-07-2025 to 19-07-2025', days: '2 Days', status: 'Rejected' },
    ];

    const getStatusBadge = (status) => {
        switch (status) {
            case 'Approved':
                return <span className="badge bg-success">Approved</span>;
            case 'Rejected':
                return <span className="badge bg-danger">Rejected</span>;
            case 'Pending':
                return <span className="badge bg-warning text-dark">Pending</span>;
            default:
                return null;
        }
    };

    return (
        <div className={`leave-records-container p-4 bg-${themeMode}-two`}>
            <div className="d-flex justify-content-between align-items-center mb-4">
                <h4 className={`text-${themeMode === 'dark' ? 'light' : 'dark'}`}>Your Records</h4>
                <div className="d-flex align-items-center">
                    <div className="search-box me-3">
                        <input type="text" className={`form-control bg-${themeMode}-one`} placeholder="Search..." />
                    </div>
                    <button className="btn btn-outline-secondary">
                        <i className="bi bi-three-dots-vertical"></i>
                    </button>
                </div>
            </div>

            <div className="table-responsive">
                <Table
                    striped
                    hover
                    responsive
                    className="table table-hover table-bordered align-middle mt-3 leave-records-table"
                    variant={themeMode === 'dark' ? 'dark' : ''}
                >
                    <thead>
                        <tr>
                            <th>Employee Name</th>
                            <th>Leave Type</th>
                            <th>Date</th>
                            <th>Days</th>
                            <th>Action</th>
                        </tr>
                    </thead>
                    <tbody>
                        {leaveRecords.map((record, index) => (
                            <tr key={index}>
                                <td>{record.name}</td>
                                <td>{record.leaveType}</td>
                                <td>{record.date}</td>
                                <td>{record.days}</td>
                                <td>{getStatusBadge(record.status)}</td>
                            </tr>
                        ))}
                    </tbody>
                </Table>
            </div>
        </div>
    );
};

export default YourLeaveRecords;