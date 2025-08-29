import React from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import Button from '@components/common/Button';
import { useTheme } from '@context/ThemeContext';
import EmployeeCompositionChart from '@components/EmployeeCompositionChart';
import EmployeeTrendChart from '@components/EmployeeTrendChart';
import FilteredEmployeeList from '@components/FilteredEmployeeList';
import { employeeManagementOverviewData } from '@data/mockData'; // real-time mock backend data

// Font Awesome & Outline Icons
import {
    FaRegEye,
    FaRegClock
} from 'react-icons/fa';
import {
    HiOutlineUsers,
    HiOutlineUserAdd,
    HiOutlineBriefcase,
    HiOutlineLogout,
    HiOutlineIdentification,
    HiOutlineUserGroup,
    HiOutlineCheckCircle
} from 'react-icons/hi';
import { TbUsersPlus } from 'react-icons/tb';
import { FiUserPlus } from 'react-icons/fi';

import './index.css';

// ===============================
// Stat Card Component
// ===============================
const StatCard = ({ statIcon, statLabel, statNumber, onEyeClick }) => {
    const { themeColor, themeMode } = useTheme();

    return (
        <div className="col-12 col-md-6 col-lg-3 mt-2">
            <div className={`employee-stat-card ${themeColor} ${themeMode} shadow-sm`}>
                <div className="card-info">
                    <span className="icon">{statIcon}</span>
                    <p>{statLabel}</p>
                    <h2 className='d-none d-md-block'>{statNumber}</h2>
                </div>
                <div className="icon-container">
                    <h2 className='d-block d-md-none me-2'>{statNumber}</h2>
                    <button className="btn" onClick={onEyeClick}>
                        <FaRegEye />
                    </button>
                </div>
            </div>
        </div>
    );
};

// ===============================
// Main Component
// ===============================
export default function EmployeeOverview() {
    const { themeMode } = useTheme();
    const navigate = useNavigate();
    const [searchParams] = useSearchParams();
    const query = searchParams.get('q');

    // =========================
    // Compute Live Stats
    // =========================
    const totalEmployees = employeeManagementOverviewData.length;
    const onProbation = employeeManagementOverviewData.filter(e => e.status === 'On Probation').length;
    const newJoiners = employeeManagementOverviewData.filter(e => e.status === 'New Joiner').length;
    const exitEmployees = employeeManagementOverviewData.filter(e => e.status === 'Exited').length;
    const fullTimeEmployees = employeeManagementOverviewData.filter(e => e.type === 'Full Time').length;
    const contingentEmployees = employeeManagementOverviewData.filter(e => e.type === 'Contingent').length;
    const onboarded = employeeManagementOverviewData.filter(e => e.onboardingStatus === 'Completed').length;
    const pendingOnboarding = employeeManagementOverviewData.filter(e => e.onboardingStatus === 'Pending').length;

    const employeeStatCards = [
        { icon: <HiOutlineUsers className='icon' />, label: 'Total Employees', count: totalEmployees, queryKey: 'total-employees' },
        { icon: <HiOutlineIdentification className='icon' />, label: 'On Probation', count: onProbation, queryKey: 'on-probation' },
        { icon: <HiOutlineUserAdd className='icon' />, label: 'New Joiners', count: newJoiners, queryKey: 'new-joiners' },
        { icon: <HiOutlineLogout className='icon' />, label: 'Exit Employees', count: exitEmployees, queryKey: 'on-exit' },
        { icon: <HiOutlineBriefcase className='icon' />, label: 'Full Time Employees', count: fullTimeEmployees, queryKey: 'full-time' },
        { icon: <HiOutlineUserGroup className='icon' />, label: 'Contingent Employees', count: contingentEmployees, queryKey: 'contingent' },
        { icon: <HiOutlineCheckCircle className='icon' />, label: 'Onboarded Employees', count: onboarded, queryKey: 'onboarded' },
        { icon: <FaRegClock className='icon' />, label: 'Pending Onboarding', count: pendingOnboarding, queryKey: 'pending-onboarding' }
    ];

    return (
        <div className={`employee-management ${themeMode}`}>
            <div className="container">
                {/* =======================
                    Page Header & Actions
                ========================= */}
                <div className="row">
                    <div className="col-12 d-flex align-items-center mt-3">
                        <h5 className="mt-2">Employee Overview</h5>
                        <div className="d-flex gap-1 ms-auto">
                            <Button
                                variant="outline"
                                size="sm"
                                label={<span className="d-none d-md-block">Add Multi Employees</span>}
                                onClick={() => {navigate('/admin/employees/add-multi-employee')}}
                                iconLeft={<TbUsersPlus />}
                            />
                            <Button
                                variant="solid"
                                size="sm"
                                label={<span className="d-none d-md-block">Add Single Employee</span>}
                                onClick={() => {navigate('/admin/employees/add-single-employee')}}
                                iconLeft={<FiUserPlus />}
                            />
                        </div>
                    </div>
                </div>

                {query ? (
                    <FilteredEmployeeList filterKey={query} />
                ) : (
                    <>
                        {/* Stat Cards */}
                        <div className="row mt-3">
                            {employeeStatCards.map((card, idx) => (
                                <StatCard
                                    key={idx}
                                    statIcon={card.icon}
                                    statLabel={card.label}
                                    statNumber={card.count}
                                    onEyeClick={() => navigate(`/admin/employees?q=${card.queryKey}`)}
                                />
                            ))}
                        </div>

                        {/* Charts */}
                        <div className="row mt-3">
                            <div className="col-12 col-lg-4 my-2">
                                <EmployeeCompositionChart />
                            </div>
                            <div className="col-12 col-lg-8 my-2">
                                <EmployeeTrendChart />
                            </div>
                        </div>
                    </>
                )}
            </div>
        </div>
    );
}
