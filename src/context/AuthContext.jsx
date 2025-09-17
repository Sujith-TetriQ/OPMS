import React, { createContext, useContext, useState, useEffect } from 'react';
import Cookies from 'js-cookie';
import CryptoJS from 'crypto-js';
import { decodeAccessToken } from '@utils/jwtHelper';
import useBaseUrl from '@hooks/useBaseUrl';
import axios from 'axios';
import { showErrorToast, showSuccessToast } from '@utils/toastUtils';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [accessToken, setAccessToken] = useState(null);
    const baseUrl = useBaseUrl();

    useEffect(() => {
        const encryptedToken = Cookies.get('accessToken');
        if (encryptedToken) {
            const bytes = CryptoJS.AES.decrypt(encryptedToken, 'mySecretKey');
            const token = bytes.toString(CryptoJS.enc.Utf8);
            setAccessToken(token);
            setUser(decodeAccessToken(token));
        }
    }, []);

    const login = (token) => {
        const encryptedToken = CryptoJS.AES.encrypt(token, 'mySecretKey').toString();
        Cookies.set('accessToken', encryptedToken, { sameSite: 'Strict', secure: true, expires: 1 });
        setAccessToken(token);
        setUser(decodeAccessToken(token));
    };

    const logout = async (device) => {
        try {
            let response;

            if (device === 'single') {
                response = await axios.post(
                    `${baseUrl}/auth/logout/token`,
                    {},  // Empty body
                    {
                        headers: {
                            Authorization: `Bearer ${accessToken}`
                        }
                    }
                );
            } else if (device === 'all') {
                response = await axios.post(
                    `${baseUrl}/auth/logout`,
                    {},  // Empty body
                    {
                        headers: {
                            Authorization: `Bearer ${accessToken}`
                        }
                    }
                );
            } else {
                throw new Error('Invalid logout device type');
            }

            if (response?.data?.success === true) {
                Cookies.remove('accessToken');
                setAccessToken(null);
                setUser(null);
                showSuccessToast('Logged out successfully.');
            } else {
                throw new Error('Logout failed: invalid response from server');
            }

        } catch (e) {
            const errorMessage =
                e.response?.data?.message ||
                e.response?.data?.error ||
                e.message ||
                'Something went wrong during logout.';

            showErrorToast(errorMessage);
        }
    };

    const isAuthenticated = !!accessToken;

    return (
        <AuthContext.Provider value={{ user, accessToken, login, logout, isAuthenticated }}>
            {children}
        </AuthContext.Provider>
    );
};

export const useAuth = () => useContext(AuthContext);
