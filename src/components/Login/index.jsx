import React, { useState } from "react";
import { motion } from "framer-motion";
import { FaEye, FaEyeSlash } from "react-icons/fa";
import "./index.css"; // custom styles

export default function Login() {
    const [focusedField, setFocusedField] = useState("");
    const [showPassword, setShowPassword] = useState(false);

    // mascot animation rules
    let mascotAnimation = { y: 0 };
    let mascotTransition = { duration: 0.6 };

    if (focusedField === "username") {
        // bounce loop when username
        mascotAnimation = { y: [0, -10, 0] };
        mascotTransition = { duration: 0.6, repeat: Infinity, repeatType: "loop" };
    } else if (focusedField === "password" && !showPassword) {
        // bounce once then fall under
        mascotAnimation = { y: [0, -15, 0, 200] };
        mascotTransition = { duration: 1.2 };
    } else if (showPassword) {
        // half visible (rise up)
        mascotAnimation = { y: 60 };
        mascotTransition = { duration: 0.8 };
    }

    return (
        <div className="login-container">
            {/* Mascot / Logo */}
            <motion.div
                className="mascot"
                initial={{ x: -100, opacity: 0 }}
                animate={{ x: 0, opacity: 1 }}
                transition={{ type: "spring", stiffness: 50 }}
            >
                <motion.div
                    className={`face ${showPassword
                            ? "one-eye-open"
                            : focusedField === "password"
                                ? "eyes-closed"
                                : "eyes-open"
                        } ${focusedField === "username" ? "smile" : ""}`}
                    animate={mascotAnimation}
                    transition={mascotTransition}
                >
                    <div className="eye left-eye"></div>
                    <div className="eye right-eye"></div>
                    <div className="mouth"></div>
                </motion.div>
            </motion.div>

            {/* Login Form */}
            <div className="login-form">
                <h2>Login</h2>
                <input
                    type="text"
                    placeholder="Username"
                    onFocus={() => setFocusedField("username")}
                    onBlur={() => setFocusedField("")}
                />
                <div className="password-field">
                    <input
                        type={showPassword ? "text" : "password"}
                        placeholder="Password"
                        onFocus={() => setFocusedField("password")}
                        onBlur={() => setFocusedField("")}
                    />
                    <button
                        type="button"
                        className="show-btn"
                        onClick={() => setShowPassword(!showPassword)}
                    >
                        {showPassword ? (
                            <FaEye className="text-muted mt-2" size={20} />
                        ) : (
                            <FaEyeSlash className="text-muted mt-2" size={20} />
                        )}
                    </button>
                </div>
                <button className="login-btn">Login</button>
            </div>
        </div>
    );
}
