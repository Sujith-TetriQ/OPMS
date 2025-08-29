// src/components/EmployeeExitProcess/EmployeeExitProcess.jsx
import React, { useEffect, useState } from 'react';
import { useTheme } from '@context/ThemeContext';
import { mockEmployees } from '@data/mockData';
import Button from '@components/common/Button';
import { useParams } from 'react-router-dom';
import { FaStream, FaListOl } from "react-icons/fa";
import { FaFileAlt, FaUserCheck, FaCommentDots, FaSyncAlt, FaCog } from "react-icons/fa";
import ProgressBar from 'react-bootstrap/ProgressBar';
import { MdOutlineArrowRightAlt } from "react-icons/md";
import StepForms from '@components/ExitStepForm';
import { formsConfig } from '@config/exit.config';

import './index.css';

export default function EmployeeExitProcess() {
    const { themeMode, themeColor } = useTheme();
    const { id } = useParams();
    const [exitEmployeeDetails, setExitEmployee] = useState(null);
    const [activeTab, setActiveTab] = useState("step");
    const [completedSteps, setCompletedSteps] = useState(0);
    const [allFormData, setAllFormData] = useState({});
    const [showFormError, setShowFormError] = useState(false); // New state variable

    const totalSteps = formsConfig.length;
    const progressPercentage = (completedSteps / totalSteps) * 100;

    const exitProcessSteps = [
        { title: "Resignation Details", subtitle: "Basic resignation details", icon: <FaFileAlt />, bg: "step-card-violet" },
        { title: "Manager Review", subtitle: "Manager acknowledgment", icon: <FaUserCheck />, bg: "step-card-green" },
        { title: "Exit Interview", subtitle: "Feedback collection", icon: <FaCommentDots />, bg: "step-card-orange" },
        { title: "Task Handover", subtitle: "Responsibility transfer", icon: <FaSyncAlt />, bg: "step-card-purple" },
        { title: "Final Process", subtitle: "Settlement & Completion", icon: <FaCog />, bg: "step-card-yellow" }
    ];

    useEffect(() => {
        if (id) {
            const employeeDetails = mockEmployees.find(emp => String(emp.id) === String(id));
            setExitEmployee(employeeDetails || null);
        }
    }, [id]);

    const updatedSteps = exitProcessSteps.map((step, index) => {
        if (index < completedSteps) {
            return { ...step, status: "Completed" };
        } else if (index === completedSteps) {
            return { ...step, status: "Current" };
        } else {
            return { ...step, status: "Pending" };
        }
    });

    const handleSave = (stepData) => {
        setAllFormData(prev => ({ ...prev, [completedSteps]: stepData }));
        console.log("All Saved Data:", { ...allFormData, [completedSteps]: stepData });
    };

    const handleNext = (direction = 1) => {
        const newStep = completedSteps + direction;
        if (newStep >= 0 && newStep < totalSteps) {
            setCompletedSteps(newStep);
        }
    };

    // Pass down the new state and its setter to the StepForms component
    const ExitProcesSteps = () => {
        const currentTitle = updatedSteps[completedSteps] ? updatedSteps[completedSteps].title : 'Loading...';
        return (
            <div className="row mt-3 ps-0 ms-0 pe-0 me-0">
                <div className="col-12">
                    <div className="d-flex justify-content-between align-items-center mb-3">
                        <h5 className="mb-0">Exit Process Progress</h5>
                        <span>{completedSteps} of {totalSteps} completed ({progressPercentage.toFixed(0)}%)</span>
                    </div>
                    <ProgressBar
                        now={progressPercentage}
                        animated
                        variant="success"
                        className="mb-4 w-100"
                    />
                    <div className="exit-step-visuals d-flex justify-content-between align-items-center mt-3">
                        {updatedSteps.map((step, index) => (
                            <React.Fragment key={index}>
                                <div className="exit-step">
                                    <div className={`step-icon-circle ${themeColor} ${step.status.toLowerCase()}`}>
                                        {step.icon}
                                    </div>
                                    <h6 className="step-title">{step.title}</h6>
                                    <p className="step-subtitle">{step.subtitle}</p>
                                    <span className={`step-status-badge ${step.status.toLowerCase()}`}>{step.status}</span>
                                </div>
                                {index < updatedSteps.length - 1 && (
                                    <MdOutlineArrowRightAlt className='step-arrow-icon d-none d-md-block' />
                                )}
                            </React.Fragment>
                        ))}
                    </div>
                    <div className={`step-form-container mt-3`}>
                        <h4>{currentTitle} Form</h4>
                        <StepForms
                            step={completedSteps}
                            onSave={handleSave}
                            onNext={handleNext}
                            showError={showFormError} // Pass down state
                            setShowError={setShowFormError} // Pass down setter
                        />
                    </div>
                </div>
            </div>
        );
    };

    const ViewExitSteps = () => {
        return (
            <div className="exit-steps-container mt-4">
                {exitProcessSteps.map((eachStep, index) => (
                    <div
                        key={index}
                        className={`exit-step-card ${eachStep.bg} ${themeMode} ${completedSteps > index ? "completed" : ""}`}
                        onClick={() => setCompletedSteps(index)}
                    >
                        <div className="icon-circle">
                            {eachStep.icon}
                        </div>
                        <h6 className='mt-2'>{eachStep.title}</h6>
                        <p className="step-subtitle">{eachStep.subtitle}</p>
                    </div>
                ))}
            </div>
        );
    };

    return (
        <div className={`employee-exit-process ${themeMode}`}>
            <h4 className='mt-3'>Employee Exit Process</h4>
            <p className='text-muted'>HRMS - Human Resource Management System</p>

            <div className={`employee-details-bar rounded-2 p-2 ${themeMode} shadow-sm`}>
                {exitEmployeeDetails ? (
                    <div className="d-flex justify-content-evenly">
                        <div>
                            <span className='text-muted'>Employee ID:</span>
                            <h6 className='mt-1'>{exitEmployeeDetails.id}</h6>
                        </div>
                        <div className="vr mx-3"></div>
                        <div>
                            <span className='text-muted'>Name:</span>
                            <h6 className='mt-1'>{exitEmployeeDetails.displayName}</h6>
                        </div>
                        <div className="vr mx-3"></div>
                        <div>
                            <span className='text-muted'>Designation:</span>
                            <h6 className='mt-1'>{exitEmployeeDetails.designation}</h6>
                        </div>
                        <div className="vr mx-3"></div>
                        <div>
                            <span className='text-muted'>Department:</span>
                            <h6 className='mt-1'>{exitEmployeeDetails.department}</h6>
                        </div>
                    </div>
                ) : (
                    <p className="text-danger m-0">No employee found for this ID</p>
                )}
            </div>

            <div className={`exit-tab-bar d-flex justify-content-center mt-3`}>
                <div className={`d-flex exit-bar-btn-container ${themeMode}`}>
                    <Button label={<span className='d-none d-md-block'>Step by Step</span>} size='sm' variant={`${activeTab === "step" ? "solid" : "outline"}`} onClick={() => setActiveTab("step")} iconLeft={<FaStream className="me-2" />} />
                    <Button label={<span className='d-none d-md-block'>View All Steps</span>} size='sm' variant={`${activeTab === "all" ? "solid" : "outline"}`} onClick={() => setActiveTab("all")} iconLeft={<FaListOl className="me-2" />} />
                </div>
            </div>
            {activeTab === 'step' ? ExitProcesSteps() : ViewExitSteps()}
        </div>
    );
}