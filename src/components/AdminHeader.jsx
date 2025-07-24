import React, { useState } from 'react';
import { MdPeopleAlt, MdApartment, MdPerson, MdVpnKey, MdPowerSettingsNew } from 'react-icons/md';

const AdminHeader = ({
    activeMainTab,
    activeSubTab,
    menus,
    headerColor: initialHeaderColor = 'violet',
    handleMainTabClick,
    handleSubTabClick,
    onColorChange
}) => {
    const [showDropdown, setShowDropdown] = useState(false);
    const [theme, setTheme] = useState('light');
    const [headerColor, setHeaderColor] = useState(initialHeaderColor);

    const toggleDropdown = () => {
        setShowDropdown(prev => !prev);
    };

    const setColorTheme = (color) => {
        setHeaderColor(color);
        if (onColorChange) {
            onColorChange(color);
        }
    };

    const toggleTheme = () => {
        setTheme(prev => (prev === 'light' ? 'dark' : 'light'));
    };

    const colorOptions = ['violet', 'blue', 'red', 'green', 'orange'];

    return (
        <div className={`admin-header ps-1 pe-1 ${headerColor}-header`}>
            {/* Top Header Tabs */}
            <div className="header-top">
                <div className="main-tabs">
                    {Object.keys(menus).map((tab) => {
                        const isActive = activeMainTab === tab;
                        const icon = tab === 'Employee Management' ? (
                            <MdPeopleAlt size={20} />
                        ) : (
                            <MdApartment size={20} />
                        );

                        return (
                            <button
                                key={tab}
                                onClick={() => handleMainTabClick(tab)}
                                className={`main-tab-btn ${isActive ? 'active' : ''}`}
                            >
                                <span className="d-inline d-lg-none">{icon}</span>
                                <span className="d-none d-lg-inline">{tab}</span>
                            </button>
                        );
                    })}
                </div>

                {/* User Info */}
                <div className="user-info position-relative">
                    <img
                        src="https://placehold.co/30"
                        alt="avatar"
                        className="avatar"
                        onClick={toggleDropdown}
                        style={{ cursor: 'pointer' }}
                    />
                    <div
                        className="user-text d-none d-sm-block"
                        onClick={toggleDropdown}
                        style={{ cursor: 'pointer' }}
                    >
                        <p>Ozlem Cetin</p>
                        <p className="role">Administrator</p>
                    </div>

                    {showDropdown && (
                        <div className="profile-dropdown shadow p-2 rounded">
                            <button className="dropdown-item">
                                <MdPerson className="me-2" /> View profile
                            </button>
                            <button className="dropdown-item">
                                <MdVpnKey className="me-2" /> Change Password
                            </button>
                            <button className="dropdown-item">
                                <MdPowerSettingsNew className="me-2" /> Logout
                            </button>
                            <hr className="bg-dark text-dark" />
                            <div className="d-flex justify-content-between align-items-center mb-2 px-1">
                                {colorOptions.map(color => (
                                    <div
                                        key={color}
                                        onClick={() => setColorTheme(color)}
                                        className={`theme-color-box ${color}-bg`}
                                        style={{
                                            width: 20,
                                            height: 20,
                                            borderRadius: 4,
                                            cursor: 'pointer',
                                            border: headerColor === color ? '2px solid white' : '1px solid #ccc'
                                        }}
                                    />
                                ))}
                            </div>
                            <div className="d-flex justify-content-between align-items-center px-1">
                                <span className="text-muted">Light</span>
                                <div className="form-check form-switch m-0">
                                    <input
                                        className="form-check-input"
                                        type="checkbox"
                                        role="switch"
                                        id="themeSwitch"
                                        checked={theme === 'dark'}
                                        onChange={toggleTheme}
                                    />
                                </div>
                                <span className="text-muted">Dark</span>
                            </div>
                        </div>
                    )}
                </div>
            </div>

            {/* Submenu Tabs */}
            <div className="submenu-tabs">
                {menus[activeMainTab]?.map((subItem) => (
                    <button
                        key={subItem}
                        onClick={() => handleSubTabClick(subItem)}
                        className={`submenu-btn ${activeSubTab === subItem ? 'active' : ''}`}
                    >
                        {subItem}
                    </button>
                ))}
            </div>
        </div>
    );
};

export default AdminHeader;
 