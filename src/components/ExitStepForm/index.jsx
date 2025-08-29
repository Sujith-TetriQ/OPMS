import React from 'react';
import { Formik, Form, Field, ErrorMessage } from 'formik';
import BsForm from 'react-bootstrap/Form';
import { useTheme } from '@context/ThemeContext';
import { formsConfig } from '@config/exit.config';
import Button from '@components/common/Button';
import './index.css'; // Import the CSS file

const StepForms = ({ step, onSave, onNext, showError, setShowError }) => {
    const { themeMode } = useTheme();
    const currentStepConfig = formsConfig[step];

    const handleSubmit = async (values, { setTouched, validateForm }) => {
        const touchedFields = currentStepConfig.fields.reduce((acc, field) => {
            acc[field.name] = true;
            return acc;
        }, {});
        setTouched(touchedFields);

        const errors = await validateForm(values);

        if (Object.keys(errors).length === 0) {
            onSave(values);
            onNext();
            setShowError(false);
        } else {
            setShowError(true);
            setTimeout(() => {
                setShowError(false);
            }, 5000);
        }
    };

    const handleInputChange = () => {
        if (showError) {
            setShowError(false);
        }
    };

    return (
        <div className="fixed-width-container"> {/* New wrapper div */}
            <Formik
                initialValues={currentStepConfig.initialValues}
                validationSchema={currentStepConfig.validationSchema}
                onSubmit={handleSubmit}
            >
                {({ isSubmitting }) => (
                    <Form onChange={handleInputChange} className={`container-fluid bg-${themeMode}-two border rounded-3 pt-2 pb-3 form-card shadow-sm`}>
                        <div className="row">
                            {currentStepConfig.fields.map((field) => (
                                <div className="col-12 col-md-6 mb-3" key={field.name}>
                                    <BsForm.Group>
                                        <BsForm.Label>{field.label}</BsForm.Label>
                                        {field.type === 'textarea' ? (
                                            <Field as="textarea" name={field.name} className="form-control" rows={3} />
                                        ) : field.type === 'select' ? (
                                            <Field as="select" name={field.name} className="form-control">
                                                <option value="">Select an option</option>
                                                {field.options.map(option => (
                                                    <option key={option} value={option}>{option}</option>
                                                ))}
                                            </Field>
                                        ) : (
                                            <Field type={field.type} name={field.name} className="form-control" />
                                        )}
                                        <ErrorMessage name={field.name} component="div" className="text-danger mt-1" />
                                    </BsForm.Group>
                                </div>
                            ))}
                        </div>

                        <div className="d-flex flex-column flex-md-row justify-content-between mt-4 gap-2">
                            <Button
                                variant='outline'
                                label='Go Back'
                                size='sm'
                                onClick={() => onNext(-1)}
                                disabled={step === 0}
                            />
                            <Button
                                variant='solid'
                                label={step === formsConfig.length - 1 ? 'Complete Process' : 'Save & Next'}
                                size='sm'
                                type="submit"
                                disabled={isSubmitting}
                            />
                        </div>
                    </Form>
                )}
            </Formik>
        </div>
    );
};

export default StepForms;