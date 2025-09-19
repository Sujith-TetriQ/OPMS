import React, { useRef, useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { MdMenu, MdPersonOutline, MdVpnKey, MdPowerSettingsNew } from 'react-icons/md';
import { CiWarning } from 'react-icons/ci';

import { useTheme } from '@context/ThemeContext';
import { useAuth } from '@context/AuthContext';
import { useLoading } from '@context/LoadingContext';
import Avatar from '@components/common/Avatar';
import Button from '@components/common/Button';
import { THEME_COLORS } from '@config/theme.config';
import './index.css';

export default function Header({ themeColor, themeMode, toggleThemeMode, changeTheme, setShowSidebar }) {
    const [showDropdown, setShowDropdown] = useState(false);
    const [isRendered, setIsRendered] = useState(false);
    const [showLogoutModal, setShowLogoutModal] = useState(false);
    const { showLoading, hideLoading } = useLoading();

    const dropdownRef = useRef(null);
    const navigate = useNavigate();
    const { logout } = useAuth();

    // Close dropdown when clicking outside
    useEffect(() => {
        const handleOutsideClick = (e) => {
            if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
                setShowDropdown(false);
                setTimeout(() => setIsRendered(false), 200);
            }
        };
        document.addEventListener('mousedown', handleOutsideClick);
        return () => document.removeEventListener('mousedown', handleOutsideClick);
    }, []);

    const toggleDropdown = () => {
        if (showDropdown) {
            setShowDropdown(false);
            setTimeout(() => setIsRendered(false), 200);
        } else {
            setIsRendered(true);
            setShowDropdown(true);
        }
    };

    const handleLogout = async (device) => {
        showLoading({type: 'spinner', size: 'lg', message: 'Logging Out', fullscreen: true });
        await logout(device);
        hideLoading();
        setShowLogoutModal(false);
        navigate('/login', { replace: true });
    };

    return (
        <header className={`header ${themeColor}-header d-flex align-items-center justify-content-between px-3 py-1`}>

            {/* Sidebar Toggle Button (Mobile only) */}
            <button
                className="toggle-btn d-md-block d-lg-none btn text-light outline-none me-2"
                onClick={() => setShowSidebar((prev) => !prev)}
            >
                <MdMenu size={24} />
            </button>

            <div className="flex-grow-1"></div>

            {/* Profile Dropdown */}
            <div className="position-relative" ref={dropdownRef}>
                <div className="profile-container d-flex align-items-center cursor-pointer" onClick={toggleDropdown}>
                    <Avatar firstName="Pavan" lastName="Kurme" imageUrl={null} size={40} />
                    <div className="profile-info text-white d-none d-md-block ms-2">
                        <h6 className="mb-0">Pavan Kurme</h6>
                        <small>Admin</small>
                    </div>
                </div>

                {isRendered && (
                    <div className={`dropdown-menu-box ${themeMode} shadow ${showDropdown ? 'fade-in' : 'fade-out'}`}>
                        <ul className="list-unstyled mb-2">
                            <li className="dropdown-item">
                                <MdPersonOutline size={20} className="text-muted icon" /> View profile
                            </li>
                            <li className="dropdown-item">
                                <MdVpnKey size={20} className="text-muted icon" /> Change Password
                            </li>
                            <li className="dropdown-item" onClick={() => setShowLogoutModal(true)}>
                                <MdPowerSettingsNew size={20} className='text-muted icon' /> Logout
                            </li>
                        </ul>

                        <hr />

                        <div className="d-flex gap-2 px-3 pb-2">
                            {THEME_COLORS.map((color) => (
                                <div
                                    key={color}
                                    className={`theme-box ${color}`}
                                    onClick={() => changeTheme(color)}
                                />
                            ))}
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

            {/* Logout Confirmation Modal */}
            <div
                className={`modal fade ${showLogoutModal ? 'show d-block' : ''}`}
                tabIndex="-1"
                style={{ backgroundColor: 'rgba(0,0,0,0.5)' }}
            >
                <div className="modal-dialog modal-dialog-centered">
                    <div className="modal-content">
                        <div className="modal-body text-center">
                            <CiWarning size={80} className='text-danger' />
                            <h3 className='fw-bold mt-3'>Confirm Logout</h3>
                            <p>Do you want to logout from the current device or all devices?</p>
                        </div>
                        <div className="modal-footer">
                            <Button type='button' variant='solid' label='Current Device' size='sm' onClick={() => handleLogout('single')} />
                            <Button type='button' variant='solid' label='All Devices' size='sm' onClick={() => handleLogout('all')} />
                            <Button type='button' variant='outline' label='Cancel' size='sm' onClick={() => setShowLogoutModal(false)} />
                        </div>
                    </div>
                </div>
            </div>
        </header>
    );
}
