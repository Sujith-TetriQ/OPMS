import React from 'react';
import {
  ResponsiveContainer,
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
} from 'recharts';
import './index.css';
import { useTheme } from '@context/ThemeContext';

const data = [
  { month: 'Jan', onboard: 50, exit: 30 },
  { month: 'Feb', onboard: 55, exit: 45 },
  { month: 'Mar', onboard: 47, exit: 60 },
  { month: 'Apr', onboard: 60, exit: 55 },
  { month: 'May', onboard: 90, exit: 58 },
  { month: 'Jun', onboard: 115, exit: 65 },
  { month: 'Jul', onboard: 108, exit: 60 },
];

const EmployeeTrendChart = () => {
  const { themeMode } = useTheme();

  return (
    <div className={`employee-trend-chart shadow-sm ${themeMode}`}>
      <ResponsiveContainer width="100%" height={250}>
        <LineChart data={data} margin={{ top: 10, right: 20, left: 0, bottom: 10 }}>
          <CartesianGrid strokeDasharray="3 3" strokeOpacity={0.2} />
          <XAxis dataKey="month" />
          <YAxis />
          <Tooltip />
          <Line
            type="monotone"
            dataKey="onboard"
            stroke="#10b981"
            strokeWidth={3}
            dot={false}
          />
          <Line
            type="monotone"
            dataKey="exit"
            stroke="#ef4444"
            strokeWidth={3}
            dot={false}
          />
        </LineChart>
      </ResponsiveContainer>

      {/* Legend Row */}
      <div className="legend-row mt-2">
        <div className="legend-item">
          <span className="dot" style={{ backgroundColor: '#10b981' }}></span>
          Onboarding employees
        </div>
        <div className="legend-item">
          <span className="dot" style={{ backgroundColor: '#ef4444' }}></span>
          Exit employees
        </div>
      </div>
    </div>
  );
};

export default EmployeeTrendChart;
