// Mock payroll data for the current year (12 months).
// Each month includes: month, year, processDate, amount, status, structure, departmentWiseSalary, locationWiseSalary

import { startOfMonth, format } from "date-fns";

const year = new Date().getFullYear();

const sampleDepartments = [
    "Engineering",
    "HR",
    "Marketing",
    "Finance",
    "Operations",
];

const sampleLocations = ["India", "USA", "UK", "Australia", "Canada"];

const months = Array.from({ length: 12 }, (_, i) => {
    const date = startOfMonth(new Date(year, i, 1));
    const monthName = format(date, "MMMM");
    const processDate = format(date, "dd-MM-yyyy");

    // create plausible amounts and breakdowns
    const amount = Math.round(800000 + (i * 50000) + Math.random() * 200000); // ₹
    const status = date > new Date() ? "Pending" : "Processed";

    // payroll structure numbers (mock)
    const totalEmployees = 200;
    const payrollProcessed = status === "Processed" ? 196 : 0;
    const pendingPayroll = totalEmployees - payrollProcessed;
    const totalSalary = amount;
    const employeeDeposit = Math.round(totalSalary * 0.82);
    const pf = Math.round(totalSalary * 0.08);
    const pt = Math.round(totalSalary * 0.05);

    // department distribution (percent + amount)
    const departmentWiseSalary = sampleDepartments.map((d, idx) => {
        // generate relative slice ~ 10-35%
        const value = [35, 15, 20, 10, 20][idx];
        return { name: d, value, amount: Math.round((value / 100) * totalSalary) };
    });

    // location distribution
    const locationWiseSalary = sampleLocations.map((loc, idx) => {
        const value = [35, 25, 15, 15, 10][idx];
        return { name: loc, value, amount: Math.round((value / 100) * totalSalary) };
    });

    return {
        id: `${year}-${i + 1}`,
        month: monthName,
        year,
        processDate,
        amount,
        status,
        structure: {
            totalEmployees,
            payrollProcessed,
            pendingPayroll,
            totalSalary,
            employeeDeposit,
            pf,
            pt,
        },
        departmentWiseSalary,
        locationWiseSalary,
    };
});

export default months;
