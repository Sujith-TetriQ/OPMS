import React from 'react';
import { CircularProgressbar, buildStyles } from 'react-circular-progressbar';
import 'react-circular-progressbar/dist/styles.css';
import './index.css';

const colorMap = {
    red: { path: '#dc3545', trail: '#f8d7da' },
    green: { path: '#28a745', trail: '#d4edda' },
    blue: { path: '#007bff', trail: '#d1ecf1' },
    yellow: { path: '#ffc107', trail: '#fff3cd' },
    violet: { path: '#8661f7', trail: '#e8e0fc' },
    gray: { path: '#6c757d', trail: '#dee2e6' },
};

export default function CircleProgressBar({
    used = 0,
    total = 100,
    size = 100,
    color = 'green',
}) {
    const percentage = total > 0 ? (used / total) * 100 : 0;
    const selectedColor = colorMap[color] || colorMap.green;

    return (
        <div className="circle-progress-container">
            <CircularProgressbar
                value={percentage}
                text={`${used}/${total}`}
                styles={buildStyles({
                    pathColor: selectedColor.path,
                    trailColor: selectedColor.trail,
                    textColor: '#212529',
                    textSize: '16px',
                })}
            />
        </div>
    );
}