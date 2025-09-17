import React, { useState, useEffect } from 'react';
import { FaEye, FaEyeSlash } from 'react-icons/fa';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { Formik, Form, Field, ErrorMessage } from 'formik';
import * as Yup from 'yup';
import axios from 'axios';
import useBaseUrl from '@hooks/useBaseUrl';
import { useLoading } from '@context/LoadingContext';
import Button from '@components/common/Button';
import { showErrorToast, showSuccessToast } from '@utils/toastUtils';
import Loading from '@components/common/Loading';

// icon
import { FaCheckCircle } from 'react-icons/fa';
import { FaInfoCircle } from 'react-icons/fa';

// carousel images
import imgOne from '@assets/1.jpg';
import imgTwo from '@assets/2.jpg';
import imgThree from '@assets/3.jpg';

// link expired image
import linkExpired from '@assets/linkexpired.png';

import './index.css';

export default function ResetPasswordPage() {
    const [showPassword, setShowPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);
    const [loading, setLoading] = useState(true);
    const [isValidLink, setIsValidLink] = useState(false);
    const [resetSuccessful, setResetSuccessful] = useState(false);
    const [formError, setFormError] = useState('');
    const [validSuccessMsg, setValidSucessMsg] = useState('');
    const navigate = useNavigate();
    const [searchParams] = useSearchParams();
    const baseUrl = useBaseUrl();
    const { showLoading, hideLoading } = useLoading();

    // Reset Password Validation Schema
    const resetPasswordValidationSchema = Yup.object().shape({
        newPassword: Yup.string()
            .required('New Password is required')
            .min(8, 'Password must be at least 8 characters long')
            .matches(/[a-z]/, 'Password must contain at least one lowercase letter')
            .matches(/[A-Z]/, 'Password must contain at least one uppercase letter')
            .matches(/[0-9]/, 'Password must contain at least one number')
            .matches(/[@$!%*?&]/, 'Password must contain at least one special character (@$!%*?&)')
            .max(25, 'Password cannot exceed 25 characters'),
        confirmPassword: Yup.string()
            .oneOf([Yup.ref('newPassword'), null], 'Passwords must match')
            .required('Confirm Password is required'),
    });

    // Effect to validate the reset token on component mount
    useEffect(() => {
        const challengeId = searchParams.get('challengeId');
        const code = searchParams.get('code');

        const validateLink = async () => {
            if (!challengeId || !code) {
                setIsValidLink(false);
                setLoading(false);
                setFormError('Invalid or incomplete password reset link.');
                return;
            }

            try {
                showLoading({ type: 'spinner', size: 'md', fullscreen: true });
                await axios.post(`${baseUrl}/auth/password/validate`, { challengeId, code });
                setIsValidLink(true);
                setValidSucessMsg('Password reset link is valid. Please set your new password.')
                // showSuccessToast('Password reset link is valid. Please set your new password.');
            } catch (error) {
                const errorMessage = error.response?.data?.message || 'Invalid or expired password reset link. Please request a new one.';
                setIsValidLink(false);
                setFormError(errorMessage);
                showErrorToast(errorMessage);
            } finally {
                hideLoading();
                setLoading(false);
            }
        };

        validateLink();
    }, [searchParams, baseUrl, showLoading, hideLoading]);

    // Handle password reset form submission
    const handleResetSubmit = async (values) => {
        const challengeId = searchParams.get('challengeId');
        const code = searchParams.get('code');
        const { newPassword } = values;

        try {
            showLoading({ type: 'spinner', size: 'md', fullscreen: true });
            await axios.post(`${baseUrl}/auth/password/reset`, {
                challengeId,
                code,
                password: newPassword, // Changed to 'password' to match the likely backend key
            });
            setResetSuccessful(true);
            showSuccessToast('Password updated successfully!');
        } catch (error) {
            const errorMessage = error.response?.data?.message || 'Failed to update password. Please try again.';
            setFormError(errorMessage);
            showErrorToast(errorMessage);
            setResetSuccessful(false);
        } finally {
            hideLoading();
        }
    };

    return (
        <div className='reset-password-page d-flex'>
            {/* Carousel Section */}
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
                <div className="reset-form p-4">
                    {/* Conditional Rendering based on state */}
                    {loading ? (
                        <div className="text-center">
                            <Loading type='dots' size='sm' message='Verifying link...' />
                        </div>
                    ) : isValidLink ? (
                        resetSuccessful ? (
                            <div className="text-center p-4">
                                <div className="d-flex justify-content-center">
                                    <FaCheckCircle size={40} className='text-success' />
                                </div>
                                <h4 className="text-success my-3">Password Changed Successfully!</h4>
                                <p>Your password has been updated. You can now log in with your new password.</p>
                                <Button
                                    variant='solid'
                                    size='sm'
                                    label='Go to Login'
                                    className='mt-3 w-100'
                                    onClick={() => navigate('/login')}
                                />
                            </div>
                        ) : (
                            <div >
                                <Formik
                                    initialValues={{ newPassword: '', confirmPassword: '' }}
                                    validationSchema={resetPasswordValidationSchema}
                                    onSubmit={handleResetSubmit}
                                >
                                    {() => (
                                        <Form className="p-4">
                                            <h3 className="text-center mb-4">Reset Password</h3>
                                            <div className="text-center text-danger mb-3">
                                                {formError && <p>{formError}</p>}
                                            </div>
                                            <div className="text-center mb-3">
                                                {isValidLink === true && !formError ? (
                                                    <p className='text-success'>{validSuccessMsg}</p>
                                                ) : (
                                                    ''
                                                )}
                                            </div>
                                            <div className="mb-3">
                                                <label className="form-label d-flex align-items-center">
                                                    New Password
                                                    <span className="info-icon ms-2" data-tooltip="Your password must contain at least one lowercase letter (a-z), one uppercase letter (A-Z), one number (0-9), and one special character (@$!%*?&), and be 8-25 characters long.">
                                                        <FaInfoCircle size={14} className='mb-1 text-muted' />
                                                    </span>
                                                </label>
                                                <div className="position-relative">
                                                    <Field
                                                        type={showPassword ? 'text' : 'password'}
                                                        name="newPassword"
                                                        className="form-control"
                                                        placeholder="Enter new password"
                                                    />
                                                    <span className="password-toggle-icon" onClick={() => setShowPassword(prev => !prev)}>
                                                        {showPassword ? <FaEyeSlash /> : <FaEye />}
                                                    </span>
                                                </div>
                                                <ErrorMessage name="newPassword" component="div" className="error-message text-danger" />
                                            </div>
                                            <div className="mb-4">
                                                <label className="form-label">Confirm Password</label>
                                                <div className="position-relative">
                                                    <Field
                                                        type={showConfirmPassword ? 'text' : 'password'}
                                                        name="confirmPassword"
                                                        className="form-control"
                                                        placeholder="Confirm new password"
                                                    />
                                                    <span className="password-toggle-icon" onClick={() => setShowConfirmPassword(prev => !prev)}>
                                                        {showConfirmPassword ? <FaEyeSlash /> : <FaEye />}
                                                    </span>
                                                </div>
                                                <ErrorMessage name="confirmPassword" component="div" className="error-message text-danger" />
                                            </div>
                                            <Button
                                                type='submit'
                                                variant='solid'
                                                size='sm'
                                                label='Reset Password'
                                                className='w-100'
                                            />
                                        </Form>
                                    )}
                                </Formik>
                            </div>
                        )
                    ) : (
                        <div className="text-center p-4">
                            <img src={linkExpired} alt="Link Expired" style={{ maxWidth: '300px' }} />
                            <h4 className="text-danger mb-3">{formError}</h4>
                            <Button
                                variant='solid'
                                size='sm'
                                label='Back to Login'
                                className='mt-3 w-100'
                                onClick={() => navigate('/login')}
                            />
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}