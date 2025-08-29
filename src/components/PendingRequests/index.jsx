import React, { useState } from 'react';
import { Modal } from 'react-bootstrap';
import Button from '@components/common/Button';
import { useTheme } from '@context/ThemeContext';
import Avatar from '@components/common/Avatar';
import './index.css';

const mockRequests = [
    {
        id: 1,
        name: 'Pavan Kurme',
        image: 'https://i.pravatar.cc/40?img=1',
        leaveType: 'Sick Leave',
        from: '12-07-2025',
        to: '17-07-2025',
        days: 5,
        description: 'Fever and cold, advised rest by doctor.',
    },
    {
        id: 2,
        name: 'Bhanu Bellam',
        image: 'https://i.pravatar.cc/40?img=2',
        leaveType: 'Annual Leave',
        from: '12-07-2025',
        to: '20-07-2025',
        days: 8,
        description: 'Annual family vacation pre-planned.',
    },
    {
        id: 3,
        name: 'Sai Kancharla',
        image: 'https://i.pravatar.cc/40?img=3',
        leaveType: 'Vacation Leave',
        from: '13-07-2025',
        to: '19-07-2025',
        days: 6,
        description: 'Out-of-town travel plans.',
    },
    {
        id: 4,
        name: 'Srinivas Chinta',
        image: 'https://i.pravatar.cc/40?img=4',
        leaveType: 'Sick Leave',
        from: '15-07-2025',
        to: '19-07-2025',
        days: 4,
        description: 'Medical emergency at home.',
    },
    {
        id: 5,
        name: 'Robert Cooper',
        image: 'https://i.pravatar.cc/40?img=5',
        leaveType: 'Sick Leave',
        from: '17-07-2025',
        to: '19-07-2025',
        days: 2,
        description: 'Mild flu symptoms.',
    },
];

export default function PendingRequests() {
    const { themeMode } = useTheme();
    const [selectedRequest, setSelectedRequest] = useState(null);
    const [searchTerm, setSearchTerm] = useState('');

    const handleReject = (name) => {
        alert(`Leave request rejected for ${name}`);
        setSelectedRequest(null);
    };

    const handleApprove = (name) => {
        alert(`Leave request approved for ${name}`);
        setSelectedRequest(null);
    };

    const filteredRequests = mockRequests.filter((req) =>
        req.name.toLowerCase().includes(searchTerm.toLowerCase())
    );

    return (
        <div className={`pending-requests-container rounded-3 shadow-lg bg-${themeMode}-two`}>
            <h5 className="title">Pending Requests</h5>
            <p className="subtitle">All pending leave requests of your employees are found here.</p>

            <div className={`search-bar d-flex justify-content-between align-items-center bg-${themeMode}-one`}>
                <span>Search Requests</span>
                <input
                    className={`search-input bg-${themeMode}-two`}
                    placeholder="Search employees"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                />
            </div>

            <div className="table-wrapper">
                <table className="pending-requests-table">
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
                        {filteredRequests.map((req) => (
                            <tr key={req.id}>
                                <td className="d-flex align-items-center">
                                    <Avatar name={req.name} size={30} />
                                    <span className="ms-2">{req.name}</span>
                                </td>
                                <td>{req.leaveType}</td>
                                <td>{req.from} to {req.to}</td>
                                <td>{req.days} Days</td>
                                <td className='d-flex gap-2'>
                                    <span className="expand" onClick={() => setSelectedRequest(req)}>Expand</span>
                                    <Button variant='outline' size='xs' label={'Reject'} onClick={() => handleReject(req.name)} />
                                    <Button variant='solid' size='xs' label={'Approve'} onClick={() => handleApprove(req.name)} />
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>

            {/* Stylish Modal */}
            <Modal show={!!selectedRequest} onHide={() => setSelectedRequest(null)} centered>
                {selectedRequest && (
                    <>
                        <Modal.Header closeButton>
                            <Modal.Title>Leave Request Details</Modal.Title>
                        </Modal.Header>
                        <Modal.Body>
                            <div className="modal-profile-card d-flex align-items-start gap-3">
                                <img src={selectedRequest.image} alt="avatar" className="modal-avatar" />
                                <div>
                                    <h5 className="mb-1">{selectedRequest.name}</h5>
                                    <span className="text-muted small">{selectedRequest.leaveType}</span>
                                </div>
                            </div>
                            <hr />
                            <div className="modal-leave-details">
                                <div className="d-flex justify-content-between py-1">
                                    <span className="text-muted">From</span>
                                    <span className="fw-semibold">{selectedRequest.from}</span>
                                </div>
                                <div className="d-flex justify-content-between py-1">
                                    <span className="text-muted">To</span>
                                    <span className="fw-semibold">{selectedRequest.to}</span>
                                </div>
                                <div className="d-flex justify-content-between py-1">
                                    <span className="text-muted">Total Days</span>
                                    <span className="fw-semibold">{selectedRequest.days} Days</span>
                                </div>
                            </div>
                            <hr />
                            <div className="modal-description mt-2">
                                <p className="text-muted mb-1 fw-medium">Description</p>
                                <p className="text-body">{selectedRequest.description}</p>
                            </div>
                        </Modal.Body>
                        <Modal.Footer>
                            <Button variant='outline' onClick={() => handleReject(selectedRequest.name)} size='sm' label={'Decline'} />
                            <Button variant='solid' onClick={() => handleApprove(selectedRequest.name)} size='sm' label={'Approve'} />
                        </Modal.Footer>
                    </>
                )}
            </Modal>
        </div>
    );
}
