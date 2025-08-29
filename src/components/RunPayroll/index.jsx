import React, { useState } from 'react'

import months from '@data/mockPayrollData'
import MonthCarousel from '@components/MonthCarousel'
import PayrollStructure from '@components/PayrollStructure'

export default function RunPayroll() {
    const [selectedMonth, setSelectedMonth] = useState(months[months.length - 1]);
    return (
        <div className='run-payroll'>
            <MonthCarousel onMonthSelect={setSelectedMonth} />
            <PayrollStructure payrollData={selectedMonth} />
        </div>
    )
}
