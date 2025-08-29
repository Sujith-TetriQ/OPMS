import React from "react";
import { useTheme } from "@context/ThemeContext";
import { PieChart, Pie, Cell, Legend, Tooltip, ResponsiveContainer } from "recharts";
import './index.css';

export default function CustomPieChart({ title, data, colors }) {
    const safeData = Array.isArray(data) ? data : [];
    const defaultColors = ["#8884d8", "#82ca9d", "#ffc658", "#ff8042", "#0088fe"];
    const chartColors = colors && colors.length > 0 ? colors : defaultColors;
    const { themeMode } = useTheme();

    return (
        <div className={`custom-pie-chart shadow rounded p-3 flex-grow-1 mb-3 bg-${themeMode}-two`} style={{ minWidth: "300px" }}>
            <h6 className="mb-3">{title}</h6>
            <hr />
            {safeData.length > 0 ? (
                <ResponsiveContainer width="100%" height={250}>
                    <PieChart>
                        <Pie
                            data={safeData}
                            dataKey="value"
                            nameKey="name"
                            cx="50%"
                            cy="50%"
                            outerRadius={80}
                            label
                        >
                            {safeData.map((_, index) => (
                                <Cell key={index} fill={chartColors[index % chartColors.length]} />
                            ))}
                        </Pie>
                        <Tooltip formatter={(value) => `${value}%`} />
                        <Legend />
                    </PieChart>
                </ResponsiveContainer>
            ) : (
                <div className="text-muted">No data available</div>
            )}
        </div>
    );
}
