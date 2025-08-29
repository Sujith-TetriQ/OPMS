import React from "react";
import { useTheme } from "@context/ThemeContext"; // theme context
import "./index.css"; // custom CSS

const Loading = ({ type = "spinner", size = "md", message = "", fullScreen = false }) => {
    const { themeMode } = useTheme();

    return (
        <div
            className={`loading-container ${fullScreen ? "fullscreen" : ""} ${themeMode}`}
        >
            {type === "spinner" && <div className={`loader-spinner ${size}`}></div>}

            {type === "dots" && (
                <div className={`loader-dots ${size}`}>
                    <span></span><span></span><span></span>
                </div>
            )}

            {type === "skeleton" && (
                <div className={`loader-skeleton ${size}`}>
                    <div className="skeleton-line"></div>
                    <div className="skeleton-line short"></div>
                </div>
            )}

            {message && <p className="loading-message">{message}</p>}
        </div>
    );
};

export default Loading;

// ########################### USAGE ############################# //

// Full screen spinner while fetching
{/* <Loading type="spinner" size="lg" fullScreen message="Loading employees..." /> */}

// Inline dots loader
{/* <Loading type="dots" size="sm" /> */}

// Skeleton loader for cards
{/* <Loading type="skeleton" /> */}