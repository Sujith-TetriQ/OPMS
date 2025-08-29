import React, { useEffect, useState } from 'react';
import { useTheme } from '@context/ThemeContext';
import {
    FaUserCheck,
    FaGraduationCap,
    FaArrowUp,
    FaProjectDiagram,
    FaUserEdit,
    FaFileUpload,
    FaCommentDots,
    FaPlaneDeparture
} from 'react-icons/fa';

// stylings
import './index.css';

const AboutEmployee = () => {
    const { themeColor, themeMode } = useTheme();
    const [timelineData, setTimelineData] = useState([]);
    const [wallData, setWallData] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        loadDummyProfileDetails();
    }, []);

    const loadDummyProfileDetails = () => {
        try {
            setLoading(true);

            const dummyTimeline = [
                { date: '2023-02-01', label: 'Joined Tetriq Solutions', icon: <FaUserCheck /> },
                { date: '2023-06-15', label: 'Completed React Certification', icon: <FaGraduationCap /> },
                { date: '2024-01-01', label: 'Promoted to Senior Developer', icon: <FaArrowUp /> },
                { date: '2024-12-20', label: 'Completed Project Alpha', icon: <FaProjectDiagram /> }
            ];

            const dummyWall = [
                { msg: 'Updated profile information', icon: <FaUserEdit />, time: '2025-07-25 10:32 AM' },
                { msg: 'Uploaded PAN document', icon: <FaFileUpload />, time: '2025-07-25 11:45 AM' },
                { msg: 'Commented on HR policy update', icon: <FaCommentDots />, time: '2025-07-26 03:15 PM' },
                { msg: 'Applied for annual leave', icon: <FaPlaneDeparture />, time: '2025-07-27 09:20 AM' }
            ];

            setTimelineData(dummyTimeline);
            setWallData(dummyWall);
        } catch (err) {
            setError('Something went wrong while loading profile details.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className={`about-employee ${themeColor} bg-${themeMode}-one`}>
            <div className="section-wrapper no-border">
                <div className="row g-4 align-items-stretch">
                    <div className="col-lg-6 col-12">
                        <div className={`section-card h-100 d-flex flex-column border-0 ${themeColor} bg-${themeMode}-two`}>
                            <h5 className="section-title">Timeline</h5>
                            {loading ? (
                                <div className="loader flex-grow-1 d-flex align-items-center justify-content-center">Loading...</div>
                            ) : error ? (
                                <div className="error-msg flex-grow-1 d-flex align-items-center justify-content-center">{error}</div>
                            ) : timelineData.length > 0 ? (
                                <ul className="timeline-list flex-grow-1">
                                    {timelineData.map((item, index) => (
                                        <li key={index} className="timeline-item no-left-border animate-fade-in">
                                            <div className="timeline-badge">{new Date(item.date).getFullYear()}</div>
                                            <div className="timeline-content">
                                                <div className="timeline-icon">{item.icon}</div>
                                                <div>
                                                    <strong>{item.label}</strong>
                                                    <div className="text-muted">{new Date(item.date).toLocaleDateString()}</div>
                                                </div>
                                            </div>
                                        </li>
                                    ))}
                                </ul>
                            ) : (
                                <div className="empty-msg flex-grow-1 d-flex align-items-center justify-content-center">
                                    No timeline records found.
                                </div>
                            )}
                        </div>
                    </div>

                    <div className="col-lg-6 col-12">
                        <div className={`section-card h-100 d-flex flex-column wall-section border-0 ${themeColor} bg-${themeMode}-two`}>
                            <h5 className="section-title">Wall Activity</h5>
                            {loading ? (
                                <div className="loader flex-grow-1 d-flex align-items-center justify-content-center">Loading...</div>
                            ) : error ? (
                                <div className="error-msg flex-grow-1 d-flex align-items-center justify-content-center">{error}</div>
                            ) : wallData.length > 0 ? (
                                <div className="wall-grid">
                                    {wallData.map((item, idx) => (
                                        <div key={idx} className="wall-card animate-fade-in">
                                            <div className="d-flex align-items-center gap-2">
                                                <span className="wall-icon">{item.icon}</span>
                                                <p className="mb-0">{item.msg}</p>
                                            </div>
                                            <div className="text-muted wall-time small mt-1">{item.time}</div>
                                        </div>
                                    ))}
                                </div>
                            ) : (
                                <div className="no-activity flex-grow-1 d-flex flex-column align-items-center justify-content-center">
                                    <img src="/no-activity.svg" alt="No Activity" className="no-activity-img" />
                                    <p className="text-muted mt-2">No Activity Found</p>
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default AboutEmployee;
