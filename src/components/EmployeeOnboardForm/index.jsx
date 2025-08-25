import React, { useState } from 'react';
import { Formik, Form, Field, ErrorMessage } from 'formik';
import * as Yup from 'yup';
import { useNavigate } from 'react-router-dom';
import { onboardingSteps } from '@config/onboard.config';
import { useTheme } from '@context/ThemeContext';
import Button from '@components/common/Button';

// stylings
import './index.css';

const EmployeeOnboarding = () => {
  const [step, setStep] = useState(0);
  const navigate = useNavigate();
  const { themeColor, themeMode } = useTheme();
  const currentStep = onboardingSteps[step];

  const validationSchema = Yup.object(
    Object.fromEntries(
      currentStep.fields.map(field => [
        field.name,
        field.required ? Yup.string().required(`${field.label} is required`) : Yup.string(),
      ])
    )
  );

  const handleNext = () => setStep(s => Math.min(s + 1, onboardingSteps.length - 1));
  const handleBackStep = () => setStep(s => Math.max(s - 1, 0));
  const handleBackPage = () => navigate(-1);

  return (
    <div className={`onboarding-page ${themeMode}`}>
      <div className={`form-wrapper ${themeMode}`}>
        <div className="bs-stepper">
          <div className="bs-stepper-header" style={{ color: `var(--${themeColor})` }}>
            {onboardingSteps.map((s, i) => {
              const isActive = i === step;
              const isCompleted = i < step;

              return (
                <div
                  key={i}
                  className={`step animated-step ${isActive ? 'active' : ''} ${isCompleted ? 'completed' : ''}`}
                >
                  <button
                    type="button"
                    className="step-trigger"
                    style={{
                      color: (isActive || isCompleted) ? '#fff' : '#6c757d',
                      backgroundColor: isCompleted
                        ? `var(--${themeColor})`
                        : isActive
                        ? `var(--${themeColor})`
                        : '#dee2e6',
                      borderColor: (isActive || isCompleted)
                        ? `var(--${themeColor})`
                        : '#ccc',
                    }}
                  >
                    {i + 1}
                  </button>
                  <div
                    className="bs-stepper-label"
                    style={{
                      color: (isActive || isCompleted) ? `var(--${themeColor})` : '#6c757d',
                    }}
                  >
                    {s.title}
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        <Formik
          initialValues={Object.fromEntries(currentStep.fields.map(f => [f.name, '']))}
          validationSchema={validationSchema}
          onSubmit={(values) => {
            if (step < onboardingSteps.length - 1) {
              handleNext();
            } else {
              alert(JSON.stringify(values, null, 2));
            }
          }}
        >
          {() => (
            <Form className="form-content row">
              {currentStep.fields.map(field => (
                <div key={field.name} className="form-group mb-3 col-12 col-md-6">
                  <label className="form-label">
                    {field.label}{field.required && '*'}
                  </label>
                  {field.type === 'select' ? (
                    <Field as="select" name={field.name} className="form-select">
                      <option value="">Select</option>
                      {field.options.map(opt => (
                        <option key={opt} value={opt}>{opt}</option>
                      ))}
                    </Field>
                  ) : (
                    <Field
                      type={field.type}
                      name={field.name}
                      className="form-control"
                      placeholder={field.placeholder || ''}
                    />
                  )}
                  <ErrorMessage name={field.name} component="div" className="error text-danger small mt-1" />
                </div>
              ))}

              <div className="form-buttons d-flex justify-content-between align-items-center mt-4 col-12">
                {step === 0 ? (
                  <Button variant='solid' label={'Back'} onClick={handleBackPage} size='sm' />
                ) : (
                  <Button variant='solid' label={'Previous'} onClick={handleBackStep} size='sm' />
                )}
                <Button type='submit' variant='solid' size='sm' label={step === onboardingSteps.length - 1 ? 'Submit' : 'Next'} />
              </div>
            </Form>
          )}
        </Formik>
      </div>
    </div>
  );
};

export default EmployeeOnboarding;
