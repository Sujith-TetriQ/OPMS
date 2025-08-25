import React from 'react';
import { useTheme } from '@context/ThemeContext';
import {
    PieChart,
    Pie,
    Cell,
    Tooltip,
    ResponsiveContainer,
    Label,
} from 'recharts';
import { FaMale, FaFemale } from 'react-icons/fa';
import './index.css';

const data = [
    { name: 'Male', value: 65 },
    { name: 'Female', value: 35 },
];

const COLORS = ['#8b5cf6', '#e5e7eb']; // Violet & light gray

const RADIAN = Math.PI / 180;

const renderCustomizedLabel = ({ cx, cy, midAngle, innerRadius, outerRadius, percent, index }) => {
    const radius = innerRadius + (outerRadius - innerRadius) * 0.5;
    const x = cx + radius * Math.cos(-midAngle * RADIAN);
    const y = cy + radius * Math.sin(-midAngle * RADIAN);
    const Icon = index === 0 ? FaMale : FaFemale;

    return (
        <foreignObject x={x - 20} y={y - 15} width={80} height={30}>
            <div className="custom-label">
                <Icon className="me-1" />
                {`${(percent * 100).toFixed(0)}%`}
            </div>
        </foreignObject>
    );
};

const EmployeeCompositionChart = () => {
    const { themeColor, themeMode } = useTheme();
    return (
        <div className={`employee-composition-card ${themeMode} shadow-sm`}>
            <h5 className="title">Employee Composition</h5>
            <ResponsiveContainer width="100%" height={200}>
                <PieChart>
                    <Pie
                        data={data}
                        cx="50%"
                        cy="50%"
                        innerRadius={60}
                        outerRadius={80}
                        labelLine={false}
                        label={renderCustomizedLabel}
                        dataKey="value"
                    >
                        {data.map((entry, index) => (
                            <Cell key={`cell-${index}`} fill={COLORS[index]} />
                        ))}
                    </Pie>
                </PieChart>
            </ResponsiveContainer>
            <p className="total">Total Employees - 85</p>
        </div>
    );
};

export default EmployeeCompositionChart;
