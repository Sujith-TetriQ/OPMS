import React, { useState } from 'react';
import CircleProgressBar from '@components/CircleProgressBar';
import Button from '@components/common/Button';
import Offcanvas from 'react-bootstrap/Offcanvas';
import Table from 'react-bootstrap/Table'; // Import the Table component
import { useTheme } from '@context/ThemeContext';
import './index.css'; // Assume you have a CSS file for styling

const LeaveManagement = () => {
    const [showOffcanvas, setShowOffcanvas] = useState(false);

    const handleClose = () => setShowOffcanvas(false);
    const handleShow = () => setShowOffcanvas(true);

    const { themeMode } = useTheme();

    const pendingRequests = [
        { name: 'Pavan Kurme', leaveType: 'Vacation Leave', date: '22-07-2025 to 25-07-2025', days: '3 Days' },
        { name: 'Pavan Kurme', leaveType: 'Vacation Leave', date: '12-07-2025 to 17-07-2025', days: '5 Days' },
        { name: 'Bhanu Bellam', leaveType: 'Sick Leave', date: '08-07-2025 to 10-07-2025', days: '2 Days' },
    ];

    return (
        <div className="leave-management-container">
            <div className="d-flex justify-content-between align-items-center mb-4">
                <h4>Leave Balances</h4>
                <Button variant='solid' size='sm' label={'Apply Leave'} onClick={handleShow} />
            </div>

            {/* Leave Balances Section */}
            <div className="row">
                <div className="col-12 col-md-6 col-lg-4 flex-grow-1 mb-3">
                    <div className="card text-center">
                        <div className="card-body">
                            <h5 className="mt-3">Annual</h5>
                            <CircleProgressBar used={13} total={28} color="green" />
                            <p>Days Used: 13, Days Left: 15</p>
                        </div>
                    </div>
                </div>
                <div className="col-12 col-md-6 col-lg-4 flex-grow-1 mb-3">
                    <div className="card text-center">
                        <div className="card-body">
                            <h5 className="mt-3">Sick</h5>
                            <CircleProgressBar used={5} total={17} color="red" />
                            <p>Days Used: 05, Days Left: 12</p>
                        </div>
                    </div>
                </div>
                <div className="col-12 col-md-6 col-lg-4 flex-grow-1 mb-3">
                    <div className="card text-center">
                        <div className="card-body d-flex flex-column justify-content-center align-items-center">
                            <h5 className="mt-3">Vacation</h5>
                            <CircleProgressBar used={8} total={23} color="violet" />
                            <p>Days Used: 08, Days Left: 15</p>
                        </div>
                    </div>
                </div>
            </div>

            {/* Pending Requests Section */}
            <h5 className="mt-5">Pending Requests</h5>
            <div className="table-responsive">
                {/* Conditionally apply the variant prop */}
                <Table
                    striped
                    bordered
                    hover
                    responsive
                    className="align-middle mt-3"
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
                        {pendingRequests.map((request, index) => (
                            <tr key={index}>
                                <td>{request.name}</td>
                                <td>{request.leaveType}</td>
                                <td>{request.date}</td>
                                <td>{request.days}</td>
                                <td><span className="badge bg-warning text-dark">Pending</span></td>
                            </tr>
                        ))}
                    </tbody>
                </Table>
            </div>

            {/* Off-canvas for Apply Leave */}
            <Offcanvas show={showOffcanvas} onHide={handleClose} placement="end">
                <Offcanvas.Header closeButton>
                    <Offcanvas.Title>Apply for Leave</Offcanvas.Title>
                </Offcanvas.Header>
                <Offcanvas.Body>
                    <form>
                        <div className="mb-3">
                            <label htmlFor="fromDate" className="form-label">From Date*</label>
                            <input type="date" className="form-control" id="fromDate" />
                        </div>
                        <div className="mb-3">
                            <label htmlFor="toDate" className="form-label">To Date*</label>
                            <input type="date" className="form-control" id="toDate" />
                        </div>
                        <div className="mb-3">
                            <label htmlFor="leaveType" className="form-label">Leave Type*</label>
                            <select className="form-select" id="leaveType">
                                <option>Annual</option>
                                <option>Sick</option>
                                <option>Vacation</option>
                            </select>
                        </div>
                        <div className="mb-3">
                            <label htmlFor="noOfDays" className="form-label">No. of Days</label>
                            <input type="text" className="form-control" id="noOfDays" readOnly value="03 Day (Auto filled text area)" />
                        </div>
                        <div className="mb-3">
                            <label htmlFor="comments" className="form-label">Comments</label>
                            <textarea className="form-control" id="comments" rows="3"></textarea>
                        </div>
                        <div className="d-flex justify-content-end gap-3">
                            <Button type='button' variant='outline' size='sm' onClick={handleClose} label={'Cancel'} />
                            <Button type='submit' variant='solid' size='sm' label={'Apply'} />
                        </div>
                    </form>
                </Offcanvas.Body>
            </Offcanvas>
        </div>
    );
};

export default LeaveManagement;