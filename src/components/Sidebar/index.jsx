import React, { useEffect } from 'react';
import { NavLink, useLocation } from 'react-router-dom';
import './index.css';

export default function Sidebar({ themeColor, themeMode, role, menuConfig, showSidebar, setShowSidebar }) {
    const location = useLocation();
    const sidebarMenu = menuConfig[role] || [];

    // on select menu item close the sidebar
    const handleItemClick = () => {
        if (window.innerWidth < 992) {
            setShowSidebar(false);
        }
    };

    // shows active menu
    const isMenuActive = (menuItem) => {
        if (menuItem.path) {
            return location.pathname.startsWith(menuItem.path);
        }
        if (menuItem.subMenu) {
            return menuItem.subMenu.some(subItem => isMenuActive(subItem));
        }
        return false;
    };

    const renderSubMenu = (subMenuItems) => (
        <ul className="sub-menu">
            {subMenuItems.map((sub, i) => (
                <li key={i} className={sub.subMenu ? 'has-submenu' : ''}>
                    {sub.path ? (
                        <NavLink
                            to={sub.path}
                            className={`sub-menu-item ${isMenuActive(sub) ? 'active' : ''}`}
                            onClick={handleItemClick}
                        >
                            {sub.label}
                        </NavLink>
                    ) : (
                        <>
                            <span className="sub-menu-label">{sub.label}</span>
                            {sub.subMenu && renderSubMenu(sub.subMenu)}
                        </>
                    )}
                </li>
            ))}
        </ul>
    );

    return (
        <aside className={`sidebar ${themeColor}-sidebar ${showSidebar ? 'show' : 'hide'} d-lg-block`}>
            <div className="logo-container">
                <h3 className="fw-bold">SoGo</h3>
            </div>
            <ul className="sidebar-menu">
                {sidebarMenu.map(({ path, label, icon: Icon, activeIcon: ActiveIcon, subMenu }, index) => {
                    const active = isMenuActive({ path, subMenu });

                    return (
                        <li key={index} className={`${subMenu ? 'has-submenu' : ''} ${active ? 'active' : ''}`}>
                            {path ? (
                                <NavLink
                                    to={path}
                                    className="menu-item"
                                    onClick={handleItemClick}
                                >
                                    {active ? (
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
                            ) : (
                                <>
                                    <div className="menu-item">
                                        {active && ActiveIcon ? (
                                            <ActiveIcon className="menu-icon" />
                                        ) : (
                                            Icon && <Icon className="menu-icon" />
                                        )}
                                        <span>{label}</span>
                                    </div>
                                    {subMenu && renderSubMenu(subMenu)}
                                </>
                            )}
                        </li>
                    );
                })}
            </ul>
        </aside>
    );
}