import React, { useState } from 'react';
import { Outlet } from 'react-router-dom';
import { useTheme } from '@context/ThemeContext';
import { SIDEBAR_MENU } from '@config/sidebar.config';
import Sidebar from '@components/Sidebar';
import Header from '@components/Header';
import './index.css';

export default function EmployeeLayout() {
    const { themeColor, changeTheme, themeMode, toggleThemeMode } = useTheme();
    const [showSidebar, setShowSidebar] = useState(true);

    const role = 'employee';

    return (
        <div className={`admin-layout ${themeMode === 'dark' ? 'dark-mode' : 'light-mode'} d-flex`}>
            <Sidebar
                themeColor={themeColor}
                themeMode={themeMode}
                role={role}
                menuConfig={SIDEBAR_MENU}
                showSidebar={showSidebar}
                setShowSidebar={setShowSidebar}
            />

            <div className="main-area flex-grow-1 d-flex flex-column">
                <Header
                    themeColor={themeColor}
                    themeMode={themeMode}
                    toggleThemeMode={toggleThemeMode}
                    changeTheme={changeTheme}
                    setShowSidebar={setShowSidebar}
                />

                <main className="main-content">
                    <Outlet />
                </main>
            </div>
        </div>
    );
}
