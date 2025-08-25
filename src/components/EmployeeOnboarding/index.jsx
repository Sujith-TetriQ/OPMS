import React, { useState } from 'react';
import { useTheme } from '../../context/ThemeContext';
import { showErrorToast } from '../../utils/toastUtils';
import './index.css';

export default function EmployeeOnboarding() {
    const { themeColor, isDarkMode } = useTheme();
    const [step, setStep] = useState(1);
    const [formData, setFormData] = useState({
        firstName: '', lastName: '', displayName: '', gender: '', dob: '',
        maritalStatus: '', contact: '', email: '', emergencyContact: '', nationality: '',
        address1: '', address2: '', idProof: ''
    });
    const [touched, setTouched] = useState({});
    const [sameAsPermanent, setSameAsPermanent] = useState(true);
    const themeClass = `${themeColor}-theme ${isDarkMode ? 'dark-mode' : 'light-mode'}`;

    const requiredFields = ['firstName', 'lastName', 'displayName', 'gender', 'dob', 'maritalStatus', 'contact', 'email', 'emergencyContact', 'nationality', 'address1', 'address2', 'idProof'];

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
        setTouched(prev => ({ ...prev, [name]: true }));
    };

    const handleCheckboxChange = () => {
        setSameAsPermanent(!sameAsPermanent);
    };

    const validateStep1 = () => {
        let isValid = true;
        const newTouched = {};

        requiredFields.forEach(field => {
            if (!formData[field]) {
                newTouched[field] = true;
                isValid = false;
            }
        });

        setTouched(prev => ({ ...prev, ...newTouched }));

        if (!isValid) {
            showErrorToast('please fill all the required inputs.')
        }

        return isValid;
    };

    const handleNext = () => {
        if (step === 1 && !validateStep1()) return;
        setStep(prev => Math.min(prev + 1, 3));
    };

    const handleBack = () => setStep(prev => Math.max(prev - 1, 1));

    const isActive = s => step === s ? 'active' : step > s ? 'completed' : '';

    const getInputClass = (field) => touched[field] && !formData[field] ? 'form-control border-danger' : 'form-control';

    return (
        <div className={`container employee-onboarding-form ${themeClass} p-4 rounded`}>
            <div className="d-flex justify-content-between align-items-center mb-4 px-md-5">
                {[1, 2, 3].map(s => (
                    <React.Fragment key={s}>
                        <div className={`step-circle ${themeColor} ${isActive(s)}`}>{s}</div>
                        {s < 3 && <div className={`step-line ${step > s ? 'completed' : ''}`}></div>}
                    </React.Fragment>
                ))}
            </div>

            {step === 1 && (
                <>
                    <h5 className="mb-3">Basic Details</h5>
                    <div className="row g-3">
                        <div className="col-md-4">
                            <label className="form-label">First Name*</label>
                            <input name="firstName" value={formData.firstName} onChange={handleInputChange} className={getInputClass('firstName')} />
                        </div>
                        <div className="col-md-4">
                            <label className="form-label">Middle Name</label>
                            <input name="middleName" className="form-control" />
                        </div>
                        <div className="col-md-4">
                            <label className="form-label">Last Name*</label>
                            <input name="lastName" value={formData.lastName} onChange={handleInputChange} className={getInputClass('lastName')} />
                        </div>
                        <div className="col-md-4">
                            <label className="form-label">Display Name*</label>
                            <input name="displayName" value={formData.displayName} onChange={handleInputChange} className={getInputClass('displayName')} />
                        </div>
                        <div className="col-md-4">
                            <label className="form-label">Gender*</label>
                            <select name="gender" value={formData.gender} onChange={handleInputChange} className={getInputClass('gender')}>
                                <option value="">Select</option>
                                <option>Male</option>
                                <option>Female</option>
                            </select>
                        </div>
                        <div className="col-md-4">
                            <label className="form-label">Date of Birth*</label>
                            <input type="date" name="dob" value={formData.dob} onChange={handleInputChange} className={getInputClass('dob')} />
                        </div>
                        <div className="col-md-4">
                            <label className="form-label">Marital Status*</label>
                            <select name="maritalStatus" value={formData.maritalStatus} onChange={handleInputChange} className={getInputClass('maritalStatus')}>
                                <option value="">Select</option>
                                <option>Single</option>
                                <option>Married</option>
                            </select>
                        </div>
                        <div className="col-md-4">
                            <label className="form-label">Contact Number*</label>
                            <input
                                name="contact"
                                value={formData.contact}
                                onChange={handleInputChange}
                                className={getInputClass('contact')}
                                type="tel"
                                pattern="[0-9]{10}"
                                maxLength={10}
                                inputMode="numeric"
                                placeholder="Enter 10-digit number"
                            />
                        </div>
                        <div className="col-md-4">
                            <label className="form-label">Email-ID*</label>
                            <input name="email" type="email" value={formData.email} onChange={handleInputChange} className={getInputClass('email')} />
                        </div>
                        <div className="col-md-4">
                            <label className="form-label">Emergency Contact*</label>
                            <input
                                name="emergencyContact"
                                value={formData.emergencyContact}
                                onChange={handleInputChange}
                                className={getInputClass('emergencyContact')}
                                type="tel"
                                pattern="[0-9]{10}"
                                maxLength={10}
                                inputMode="numeric"
                                placeholder="Enter 10-digit number"
                            />
                        </div>
                        <div className="col-md-4">
                            <label className="form-label">Nationality*</label>
                            <select name="nationality" value={formData.nationality} onChange={handleInputChange} className={getInputClass('nationality')}>
                                <option value="">Select</option>
                                <option>Indian</option>
                            </select>
                        </div>
                        <div className="col-md-4">
                            <label className="form-label">Permanent Address-1*</label>
                            <input name="address1" value={formData.address1} onChange={handleInputChange} className={getInputClass('address1')} />
                        </div>
                        <div className="col-md-4">
                            <label className="form-label">Address-2*</label>
                            <input name="address2" value={formData.address2} onChange={handleInputChange} className={getInputClass('address2')} />
                        </div>
                        <div className="col-md-4">
                            <label className="form-label">ID Proof*</label>
                            <select name="idProof" value={formData.idProof} onChange={handleInputChange} className={getInputClass('idProof')}>
                                <option value="">Select</option>
                                <option>Aadhar Card</option>
                                <option>PAN Card</option>
                            </select>
                        </div>
                        <div className="col-md-4">
                            <label className="form-label">Upload PAN Card</label>
                            <input type="file" className="form-control" />
                        </div>
                    </div>
                    {/* Checkbox */}
                    <div className="form-check mt-3">
                        <input
                            type="checkbox"
                            className="form-check-input"
                            id="sameAddress"
                            checked={sameAsPermanent}
                            onChange={handleCheckboxChange}
                        />
                        <label htmlFor="sameAddress" className="form-check-label">
                            Same as Permanent Address
                        </label>
                    </div>
                    {/* Conditional Fields */}
                    {!sameAsPermanent && (
                        <div className="row g-3 mt-2">
                            <div className="col-md-4">
                                <label className="form-label">Current Address-1*</label>
                                <input
                                    name="currentAddress1"
                                    value={formData.tempAddress1 || ''}
                                    onChange={handleInputChange}
                                    className={getInputClass('tempAddress1')}
                                />
                            </div>
                            <div className="col-md-4">
                                <label className="form-label">Current Address-2</label>
                                <input
                                    name="currentAddress2"
                                    value={formData.tempAddress2 || ''}
                                    onChange={handleInputChange}
                                    className={getInputClass('tempAddress2')}
                                />
                            </div>
                        </div>
                    )}
                </>
            )}

            {/* Render step 2 and 3 as before */}

            <div className="d-flex justify-content-between mt-4">
                {step > 1 && <button className="btn btn-secondary" onClick={handleBack}>Back</button>}
                {step < 3 && <button className="btn btn-primary ms-auto" onClick={handleNext}>Next</button>}
                {step === 3 && <button className="btn btn-success ms-auto">Submit</button>}
            </div>
        </div>
    );
}