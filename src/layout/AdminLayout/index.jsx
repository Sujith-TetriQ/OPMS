// AdminLayout.jsx
import React, { useEffect, useRef, useState } from 'react';
import { useTheme } from '@context/ThemeContext';
import { NavLink, Outlet, useLocation } from 'react-router-dom';
import { SIDEBAR_MENU } from '@config/sidebar/admin.config';
import { THEME_COLORS } from '@config/theme.config';
import {
    MdMenu, MdPersonOutline, MdVpnKey, MdPowerSettingsNew
} from 'react-icons/md';
import './index.css';

export default function AdminLayout() {
    const { themeColor, changeTheme } = useTheme();
    const { themeMode, toggleThemeMode } = useTheme();

    const [showDropdown, setShowDropdown] = useState(false);
    const [isRendered, setIsRendered] = useState(false); // Controls if dropdown is in DOM
    const [showSidebar, setShowSidebar] = useState(true);

    const location = useLocation();
    const dropdownRef = useRef(null);

    // Close dropdown on outside click
    useEffect(() => {
        const handleClickOutside = (event) => {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
                setShowDropdown(false);
                setTimeout(() => setIsRendered(false), 200); // Allow animation before removing
            }
        };
        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    // Toggle dropdown with animation rendering
    const toggleDropdown = () => {
        if (showDropdown) {
            setShowDropdown(false);
            setTimeout(() => setIsRendered(false), 200);
        } else {
            setIsRendered(true);
            setShowDropdown(true);
        }
    };

    return (
        <div className={`admin-layout ${themeMode === 'dark' ? 'dark-mode' : 'light-mode'} d-flex`}>

            {/* Sidebar */}
            <aside className={`sidebar ${themeColor}-sidebar ${showSidebar ? 'show' : 'hide'} d-lg-block`}>
                <div className="logo-container">
                    <h3 className="fw-bold">SoGo</h3>
                </div>
                <ul className="sidebar-menu">
                    {SIDEBAR_MENU.map(({ path, label, icon: Icon, activeIcon: ActiveIcon }) => {
                        const isMatch = location.pathname.includes(path.replace('/', ''));
                        return (
                            <li key={path}>
                                <NavLink to={path} className="menu-item">
                                    {isMatch ? (
                                        <>
                                            <ActiveIcon className="menu-icon" />
                                            <span>{label}</span>
                                        </>
                                    ) : (
                                        <>
                                            <Icon className="menu-icon" />
                                            <span>{label}</span>
                                        </>
                                    )}
                                </NavLink>
                            </li>
                        );
                    })}
                </ul>
            </aside>

            {/* Main Area */}
            <div className="main-area flex-grow-1 d-flex flex-column">

                {/* Header */}
                <header className={`header ${themeColor}-header d-flex align-items-center justify-content-between px-3 py-1`}>
                    <button className="toggle-btn d-md-block d-lg-none btn text-light outline-none me-2" onClick={() => setShowSidebar(!showSidebar)}>
                        <MdMenu size={24} />
                    </button>

                    <div className="flex-grow-1"></div>

                    {/* Profile Dropdown */}
                    <div className="position-relative" ref={dropdownRef}>
                        <div className="profile-container d-flex align-items-center cursor-pointer" onClick={toggleDropdown}>
                            <img src="https://placehold.co/40x40" alt="profile" className="rounded-circle me-2" />
                            <div className="profile-info text-white d-none d-md-block">
                                <h6 className="mb-0">Pavan Kurme</h6>
                                <small>Admin</small>
                            </div>
                        </div>

                        {/* Animated Dropdown */}
                        {isRendered && (
                            <div className={`dropdown-menu-box ${themeMode} shadow ${showDropdown ? 'fade-in' : 'fade-out'}`}>
                                <ul className="list-unstyled mb-2">
                                    <li className="dropdown-item"><MdPersonOutline size={20} className='text-muted icon' /> View profile</li>
                                    <li className="dropdown-item"><MdVpnKey size={20} className='text-muted icon' /> Change Password</li>
                                    <li className="dropdown-item"><MdPowerSettingsNew size={20} className='text-muted icon' /> Logout</li>
                                </ul>
                                <hr className="my-2" />
                                <div className="d-flex justify-content-between align-items-center px-3 pb-2">
                                    <div className="d-flex gap-2">
                                        {THEME_COLORS.map((color) => (
                                            <div key={color} className={`theme-box ${color}`} onClick={() => changeTheme(color)} />
                                        ))}
                                    </div>
                                </div>
                                <div className="text-center pb-2">
                                    <small className="me-2">Light</small>
                                    <label className="switch">
                                        <input type="checkbox" checked={themeMode === 'dark'} onChange={toggleThemeMode} />
                                        <span className="slider round"></span>
                                    </label>
                                    <small className="ms-2">Dark</small>
                                </div>
                            </div>
                        )}
                    </div>
                </header>

                {/* Page Content */}
                <main className="main-content">
                    <Outlet />
                </main>
            </div>
        </div>
    );
}
