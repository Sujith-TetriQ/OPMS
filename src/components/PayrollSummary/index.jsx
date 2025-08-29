import React, { useState } from 'react';
import { format, startOfMonth, subMonths } from 'date-fns';
import { useTheme } from '@context/ThemeContext';
import months from '@data/mockPayrollData';
import MonthCarousel from '@components/MonthCarousel';
import PayrollStructure from '@components/PayrollStructure';
import CustomPieChart from '@components/CustomPieChart';
import {
    FiCalendar,  // For Last Processed Salary
    FiClock,     // For Upcoming Salary
    FiAlertCircle, // For Pending Review
} from 'react-icons/fi';

// ===== Payroll Stat Card =====
const PayrollStatCard = ({ icon, label, btnLabel, filterKey, number }) => {
    const { themeColor, themeMode } = useTheme();
    return (
        <div className="col-12 col-md-4 mt-3 flex-grow-1">
            <div className={`shadow-sm p-3 rounded h-100 bg-${themeMode}-two`}>
                {/* Icon + Button */}
                <div className="d-flex justify-content-between align-items-start mb-2">
                    <div className={`stat-icon fs-3 bg-transparent payroll-stat-icon ${themeColor}`}>
                        {icon}
                    </div>
                    <button className="text-primary fw-semibold border-0 bg-transparent p-0">
                        {btnLabel}
                    </button>
                </div>

                {/* Label */}
                <h6 className="mb-1 fw-medium">{label}</h6>

                {/* Value */}
                <h4 className="fw-bold mb-0">₹{number}</h4>
            </div>
        </div>
    );
};

// ===== Month Variables =====
// Shift "Last Processed Salary" date to show salary month, but with payment date = next month 1st
const today = new Date();
const currentMonth = startOfMonth(today);
const previousMonth = startOfMonth(subMonths(today, 1));

const currentMonthFormat = format(currentMonth, 'MMMM');
const previousMonthFormat = format(previousMonth, 'MMMM');

// ===== Payroll Stat List =====
const payrollStatList = [
    {
        id: 1,
        label: 'Last Processed Salary',
        btnLabel: `${previousMonthFormat} (Paid on ${format(currentMonth, 'd MMM')})`,
        icon: <FiCalendar />,
        number: months.find(month => month.month === previousMonthFormat)?.amount || 0,
        filterKey: 'last-month',
    },
    {
        id: 2,
        label: 'Upcoming Salary',
        btnLabel: `${currentMonthFormat} (Paying on ${format(startOfMonth(subMonths(today, -1)), 'd MMM')})`,
        icon: <FiClock />,
        number: months.find(month => month.month === currentMonthFormat)?.amount || 0,
        filterKey: 'next-month',
    },
    {
        id: 3,
        label: 'Pending Review',
        btnLabel: 'View',
        icon: <FiAlertCircle />,
        number: months.find(month => month.month === previousMonthFormat)?.structure?.pendingPayroll || 0,
        filterKey: 'pending-review',
    },
];

export default function PayrollSummary() {
    const [selectedMonth, setSelectedMonth] = useState(months[months.length - 1]);

    return (
        <div className="payroll-summary">
            <div className="container">

                {/* ===== Stat Cards ===== */}
                <div className="row">
                    {payrollStatList.map(eachCard => (
                        <PayrollStatCard
                            key={eachCard.id}
                            label={eachCard.label}
                            btnLabel={eachCard.btnLabel}
                            icon={eachCard.icon}
                            filterKey={eachCard.filterKey}
                            number={eachCard.number}
                        />
                    ))}
                </div>

                {/* ===== Month Carousel & Details ===== */}
                <div className="mt-3">
                    <MonthCarousel onMonthSelect={setSelectedMonth} />
                    <div className="mt-4">
                        <h5>
                            Payroll Details – {selectedMonth.month} {selectedMonth.year}
                        </h5>

                        {/* Payroll Structure */}
                        <PayrollStructure payrollData={selectedMonth} />

                        {/* Pie Charts */}
                        <div className="d-flex flex-wrap gap-3 mt-4">
                            <CustomPieChart
                                title="Department wise Employees Salary"
                                data={selectedMonth.departmentWiseSalary || []}
                            />
                            <CustomPieChart
                                title="Location wise Employees Salary"
                                data={selectedMonth.locationWiseSalary || []}
                            />
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
