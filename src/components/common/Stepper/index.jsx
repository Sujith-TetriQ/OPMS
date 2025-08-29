import React from "react";
import "./index.css";

const Stepper = ({ steps = [], currentStep = 1, themeColor = "violet" }) => {
    const progress = ((currentStep - 1) / (steps.length - 1)) * 100;

    return (
        <div className="stepper-container">
            {/* Progress Bar */}
            <div className="progressbar-wrapper">
                <div
                    className={`progressbar-fill ${themeColor}`}
                    style={{ width: `${progress}%` }}
                />
            </div>

            {/* Steps */}
            <div className="steps-wrapper">
                {steps.map((label, index) => {
                    const stepNumber = index + 1;
                    let statusClass = "pending";
                    if (currentStep > stepNumber) statusClass = "completed";
                    else if (currentStep === stepNumber) statusClass = "active";

                    return (
                        <div key={index} className="step-item">
                            <div className={`step-circle ${statusClass} ${themeColor}`}>
                                {statusClass === "completed" ? "✓" : stepNumber}
                            </div>
                            <div className="step-label">{label}</div>
                        </div>
                    );
                })}
            </div>
        </div>
    );
};

export default Stepper;

// <Stepper steps={steps} currentStep={x} themeColor="violet" />