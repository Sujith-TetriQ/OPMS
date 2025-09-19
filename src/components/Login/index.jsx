import React, { useState, useEffect, useRef } from 'react';
import { FaEye, FaEyeSlash } from 'react-icons/fa';
import { useNavigate } from 'react-router-dom';
import { Formik, Form, Field, ErrorMessage } from 'formik';
import * as Yup from 'yup';
import CryptoJS from 'crypto-js';
import axios from 'axios';
import useBaseUrl from '@hooks/useBaseUrl';
import { useLoading } from '@context/LoadingContext';
import { useAuth } from '@context/AuthContext';
import { formatIdentifier } from '@utils/formatIdentifier';
import Button from '@components/common/Button';

// Carousel Images
import imgOne from '@assets/1.jpg';
import imgTwo from '@assets/2.jpg';
import imgThree from '@assets/3.jpg';

// Logo
import Logo from '@assets/TetriqSolutionsLogo.png'

// toast utils
import { showErrorToast, showSuccessToast, showInfoToast } from '@utils/toastUtils';

import './index.css';

export default function LoginPage() {
    const [showPassword, setShowPassword] = useState(false);
    const [step, setStep] = useState('login'); // Current step: 'login' | 'otp' | 'forgot'
    const [timer, setTimer] = useState(0); // OTP timer countdown
    const [isResendActive, setIsResendActive] = useState(false);
    const [showErrorMessage, setShowErrorMessage] = useState(false);
    const [errorMessage, setErrorMessage] = useState('');

    const [otpValues, setOtpValues] = useState(['', '', '', '', '', '']); // OTP boxes
    const otpRefs = useRef([]);
    const navigate = useNavigate();
    const { showLoading, hideLoading } = useLoading();
    const baseUrl = useBaseUrl(); //custom hook for base url
    const [challengeId, setChallengeId] = useState(''); //to store challenge id
    const { login } = useAuth();


    // Validation Schemas
    // Login Validation
    const loginValidationSchema = Yup.object().shape({
        emailOrPhone: Yup.string()
            .required('Email or Phone is required')
            .test('validate-id', 'Invalid User ID', function (value) {
                if (!value) return false;

                const trimmed = value.trim();

                if (/\s/.test(trimmed)) {
                    return this.createError({ message: 'No spaces allowed' });
                }

                if (trimmed.includes('@')) {
                    // Basic email regex check
                    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
                    return emailRegex.test(trimmed);
                } else {
                    // Should be digits only for phone (no special chars)
                    const phoneRegex = /^[0-9]+$/;
                    return phoneRegex.test(trimmed);
                }
            }),

        password: Yup.string().required('Password is required')
    });

    // OTP Validation
    const otpValidationSchema = Yup.object().shape({
        otp: Yup.string()
            .required('OTP is required')
            .length(6, 'OTP must be exactly 6 digits')
    });

    // Forget Validation
    const forgotValidationSchema = Yup.object().shape({
        resetEmail: Yup.string().email('Invalid email').required('Work Email is required')
    });


    // OTP Timer Effect
    useEffect(() => {
        let interval;
        if (timer > 0) {
            interval = setInterval(() => {
                setTimer(prev => prev - 1);
            }, 1000);
        } else if (timer === 0 && step === 'otp') {
            setIsResendActive(true);
        }
        return () => clearInterval(interval);
    }, [timer, step]);

    // otp start timer Function
    const startTimer = () => {
        setTimer(120); // Example timer (should be 120 in production)
        setIsResendActive(false);
    };

    // Resend OTP Handler
    const handleResendOtp = async () => {
        const data = {
            challengeId,
        }

        try {
            setShowErrorMessage(false);
            showLoading({ type: 'spinner', size: 'md', fullscreen: true });
            const response = await axios.post(`${baseUrl}/auth/2fa/resend`, data);
            startTimer();
            showSuccessToast("New OTP sent successfully!");
            setShowErrorMessage(false)
        } catch (e) {
            const errorMessage =
                e.response?.data?.message ||
                e.response?.data?.error ||
                e.message ||
                'Something went wrong. Please try again.';

            showErrorToast(errorMessage);
            setErrorMessage(errorMessage);
            setShowErrorMessage(true);
        } finally {
            hideLoading();
        }
    };


    // Login Submit Handler
    const handleLoginSubmit = async (values) => {
        const { emailOrPhone, password } = values;
        showLoading({ type: 'spinner', size: 'md', fullscreen: true });
        const data = {
            emailOrPhone,
            password,
            // otp: {
            //     email: true,
            //     phone: true
            // }
        };

        // ###################  Below is Encrypting data ############################# //
        // const dataString = JSON.stringify(data);
        // const encryptedData = CryptoJS.AES.encrypt(dataString, 'pavanKurmeKey').toString();

        try {
            const response = await axios.post(`${baseUrl}/auth/login`, data);

            setChallengeId(response.data.challengeId);

            if (response.data.requires2FA === true) {
                showInfoToast('Please Enter OTP');
                setStep('otp');
                startTimer();
            } else {
                handleSuccessLogin(response); //If 2FA is False
            }

            setShowErrorMessage(false)

        } catch (e) {
            const errorMessage =
                e.response?.data?.message ||
                e.response?.data?.error ||
                e.message ||
                'Something went wrong. Please try again.';

            showErrorToast(errorMessage);
            setErrorMessage(errorMessage);
            setShowErrorMessage(true)
        } finally {
            hideLoading();
        }
    };



    // OTP Input Handlers
    const handleOtpChange = (e, index) => {
        const val = e.target.value.replace(/[^a-zA-Z0-9]/g, '');

        const newOtp = [...otpValues];
        newOtp[index] = val;
        setOtpValues(newOtp);

        if (val && index < 5) {
            otpRefs.current[index + 1].focus();
        }
    };

    const handleOtpKeyDown = (e, index) => {
        if (e.key === 'Backspace' && !otpValues[index] && index > 0) {
            otpRefs.current[index - 1].focus();
        }
    };

    const handleOtpPaste = (e) => {
        e.preventDefault();  // Prevent default paste behavior

        const pastedData = e.clipboardData.getData('Text').trim();
        const alphanumericOnly = pastedData.replace(/[^a-zA-Z0-9]/g, '');

        if (alphanumericOnly.length === 6) {
            const otpArray = alphanumericOnly.split('');
            setOtpValues(otpArray);

            // Optionally focus last input
            otpRefs.current[5].focus();
        }
    };


    // OTP Submit Function
    const handleOtpSubmit = async () => {
        const otp = otpValues.join('');

        // Show toast if user clicks submit without entering any OTP
        if (otpValues.every(val => val === '')) {
            showErrorToast('Please enter OTP');
            return;
        }

        // Show toast if OTP length is not 6 digits
        if (otp.length < 6) {
            showErrorToast('OTP must be exactly 6 digits');
            return;
        }

        const data = {
            challengeId,
            code: otp,
        }

        try {
            showLoading({ type: 'spinner', size: 'md', fullscreen: true });
            const response = await axios.post(`${baseUrl}/auth/2fa/verify`, data);
            handleSuccessLogin(response)
            setShowErrorMessage(false)
        } catch (e) {
            const errorMessage =
                e.response?.data?.message ||
                e.response?.data?.error ||
                e.message ||
                'Something went wrong. Please try again.';

            showErrorToast(errorMessage);
            setErrorMessage(errorMessage);
            setShowErrorMessage(true)

            // Clear OTP inputs on invalid OTP
            setOtpValues(['', '', '', '', '', '']);
        } finally {
            hideLoading();
        }
    };

    // OnSuccess Login 
    const handleSuccessLogin = (response) => {
        login(response.data.accessToken);
        showSuccessToast('Login Successful!');
        navigate('/admin/dashboard', { replace: true });
    }

    // Forgot Password Handler
    const handleForgotSubmit = async (values) => {
        const { resetEmail } = values;
        const data = { email: resetEmail };

        try {
            showLoading({ type: 'spinner', size: 'md', fullscreen: true });
            const response = await axios.post(`${baseUrl}/auth/password/forgot`, data);

            const { ok, challengeId } = response.data;

            if (ok === true && challengeId) {
                // Email found in DB
                setShowErrorMessage(false);
                showInfoToast("If an account with this email exists, you will receive a password reset link.");
                setStep('login');
                setShowErrorMessage(false);
            } else if (ok === true && !challengeId) {
                // Email not found
                setShowErrorMessage(true);
                setErrorMessage('Please enter a valid email address.');
            } else {
                // Just in case some other unexpected response
                setShowErrorMessage(true);
                setErrorMessage('Something went wrong. Please try again.');
            }
        } catch (e) {
            const errorMessage =
                e.response?.data?.message ||
                e.response?.data?.error ||
                e.message ||
                'Something went wrong. Please try again.';

            showErrorToast(errorMessage);
            setErrorMessage(errorMessage);
            setShowErrorMessage(true);
        } finally {
            hideLoading();
        }
    };

    // Utility: Format Timer
    const formatTime = (seconds) => {
        const minutes = Math.floor(seconds / 60);
        const remainingSeconds = seconds % 60;
        return `${minutes.toString().padStart(2, '0')}:${remainingSeconds.toString().padStart(2, '0')}`;
    };

    return (
        <div className='login-page d-flex'>
            {/* Carousel */}
            <div className="carousel-container">
                <div id="carouselExampleCaptions" className="carousel slide carousel-fade" data-bs-ride="carousel" data-bs-interval="3000">
                    <div className="carousel-inner">
                        <div className="carousel-item active">
                            <img src={imgOne} className="d-block login-carousel-img" loading='lazy' alt="First Slide" />
                            <div className="carousel-overlay">
                                <h5>Welcome to Our Platform</h5>
                                <p>Manage your HR processes smoothly and efficiently.</p>
                            </div>
                        </div>
                        <div className="carousel-item">
                            <img src={imgTwo} className="d-block login-carousel-img" loading='lazy' alt="Second Slide" />
                            <div className="carousel-overlay">
                                <h5>Track Employee Attendance</h5>
                                <p>Monitor attendance, leaves, and performance all in one place.</p>
                            </div>
                        </div>
                        <div className="carousel-item">
                            <img src={imgThree} className="d-block login-carousel-img" loading='lazy' alt="Third Slide" />
                            <div className="carousel-overlay">
                                <h5>Payroll & Compliance</h5>
                                <p>Automate payroll generation and stay compliant effortlessly.</p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Form Container */}
            <div className="form-container d-flex align-items-center justify-content-center">

                {/* Login Step */}
                {step === 'login' && (
                    <Formik initialValues={{ emailOrPhone: '', password: '' }} validationSchema={loginValidationSchema} onSubmit={handleLoginSubmit}>
                        {() => (
                            <Form className="login-form p-4">
                                <h3 className="text-center mb-4">Login to SoGo</h3>
                                {Logo && <img src={Logo} alt="Logo" loading='lazy' className='w-100 mb-3' />}

                                <div className="text-center text-danger">
                                    {showErrorMessage === true ? <p>{errorMessage}</p> : ''}
                                </div>

                                <div className="mb-3">
                                    <label className="form-label">User ID</label>
                                    <Field type="text" name="emailOrPhone" className="form-control" placeholder="Enter email or phone" />
                                    <ErrorMessage name="emailOrPhone" component="div" className="error-message text-danger" />
                                </div>

                                <div className="mb-3">
                                    <label className="form-label">Password</label>
                                    <div className="position-relative">
                                        <Field type={showPassword ? 'text' : 'password'} name="password" className="form-control" placeholder="Enter password" />
                                        <span className="password-toggle-icon" onClick={() => setShowPassword(prev => !prev)}>
                                            {showPassword ? <FaEyeSlash /> : <FaEye />}
                                        </span>
                                    </div>
                                    <ErrorMessage name="password" component="div" className="error-message text-danger" />
                                </div>

                                <div className="mb-3 text-end">
                                    <button type="button" className="btn btn-link p-0" onClick={() => { setStep('forgot'); setShowErrorMessage(false); }}>Forgot Password?</button>
                                </div>

                                <Button variant='solid' size='sm' label='Login' className='w-100' type='submit' />
                            </Form>
                        )}
                    </Formik>
                )}

                {/* OTP Step */}
                {step === 'otp' && (
                    <div className="login-form p-4">
                        <h3 className="text-center mb-4">Enter OTP</h3>

                        <div className="otp-input-container d-flex justify-content-between">
                            {otpValues.map((val, idx) => (
                                <input
                                    key={idx}
                                    type="text"
                                    maxLength="1"
                                    value={val}
                                    ref={el => otpRefs.current[idx] = el}
                                    className="otp-box form-control text-center"
                                    onChange={(e) => handleOtpChange(e, idx)}
                                    onKeyDown={(e) => handleOtpKeyDown(e, idx)}
                                    onPaste={handleOtpPaste}
                                />
                            ))}
                        </div>

                        <div className="text-center text-danger mt-3">
                            {showErrorMessage === true ? <p>{errorMessage}</p> : ''}
                        </div>

                        <div className="otp-timer d-flex justify-content-between mt-2">
                            <button type="button" className="btn btn-link p-0" onClick={handleResendOtp} disabled={!isResendActive}>Resend OTP</button>
                            <span className="text-muted">Resend OTP in {formatTime(timer)}</span>
                        </div>

                        <Button variant='solid' size='sm' className='w-100 mt-3' label='Submit OTP' onClick={handleOtpSubmit} />
                    </div>
                )}

                {/* Forgot Password Step */}
                {step === 'forgot' && (
                    <Formik initialValues={{ resetEmail: '' }} validationSchema={forgotValidationSchema} onSubmit={handleForgotSubmit}>
                        {() => (
                            <Form className="login-form p-4">
                                <h3 className="text-center mb-4">Forgot Password</h3>
                                <div className="mb-3">
                                    <label className="form-label">Work Email</label>
                                    <Field type="email" name="resetEmail" className="form-control" placeholder="Enter your work email" />
                                    <ErrorMessage name="resetEmail" component="div" className="error-message text-danger" />
                                </div>

                                <div className="text-center text-danger mt-3">
                                    {showErrorMessage === true ? <p>{errorMessage}</p> : ''}
                                </div>

                                <div className="d-flex gap-2 align-items-center">
                                    <Button type='submit' variant='solid' size='sm' className='w-100' label='Send Reset Link' />
                                    <Button type='button' variant='outline' size='sm' className='w-100' label='Back to Login' onClick={() => { setStep('login'); setShowErrorMessage(false); }} />
                                </div>
                            </Form>
                        )}
                    </Formik>
                )}

            </div>
        </div>
    );
}
