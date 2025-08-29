import React from "react";
import { useTheme } from "@context/ThemeContext";
import "./index.css";

export default function PayrollStructure({ payrollData }) {
    const { themeMode } = useTheme();

    // Show placeholder if no month is selected
    if (!payrollData) {
        return <div className="text-muted">Select a month to view payroll details</div>;
    }

    // Extract structure & charts data safely
    const {
        structure: {
            totalEmployees = 0,
            payrollProcessed = 0,
            pendingPayroll = 0,
            totalSalary = 0,
            employeeDeposit = 0,
            pf = 0,
            pt = 0
        } = {},
        departmentWiseSalary = [],
        locationWiseSalary = []
    } = payrollData;

    // Calculate TDS if not provided
    const tds = Math.max(totalSalary - (employeeDeposit + pf + pt), 0);

    // Chart colors
    const COLORS = ["#6f42c1", "#20c997", "#fd7e14", "#0dcaf0", "#ffc107", "#198754"];

    return (
        <div className={`payroll-structure-container shadow my-4 bg-${themeMode}-two`}>
            <h5 className="mb-3">Payroll structure</h5>

            {/* Summary Row */}
            <div className="d-flex gap-3 flex-wrap">
                {/* Employee Stats */}
                <div className="border rounded p-3 flex-grow-1 d-flex justify-content-between align-items-center">
                    <div>
                        <strong>Total Employees</strong>
                        <div>{totalEmployees}</div>
                    </div>
                    <div>=</div>
                    <div>
                        <strong>Payroll Processed</strong>
                        <div>{payrollProcessed}</div>
                    </div>
                    <div>+</div>
                    <div>
                        <strong>Pending Payroll</strong>
                        <div>{pendingPayroll}</div>
                    </div>
                </div>

                {/* Salary Stats */}
                <div className="border rounded p-3 flex-grow-1 d-flex justify-content-between align-items-center">
                    <div>
                        <strong>Total Salary</strong>
                        <div>₹{totalSalary}</div>
                    </div>
                    <div>=</div>
                    <div>
                        <strong>Employee deposit</strong>
                        <div>₹{employeeDeposit}</div>
                    </div>
                    <div>+</div>
                    <div>
                        <strong>TDS</strong>
                        <div>₹{tds}</div>
                    </div>
                    <div>+</div>
                    <div>
                        <strong>PF</strong>
                        <div>₹{pf}</div>
                    </div>
                    <div>+</div>
                    <div>
                        <strong>PT</strong>
                        <div>₹{pt}</div>
                    </div>
                </div>
            </div>
        </div>
    );
}
