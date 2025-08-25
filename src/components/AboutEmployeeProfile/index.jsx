import React, { useState, useEffect } from 'react';
import { useTheme } from '@context/ThemeContext';
import { OverlayTrigger, Tooltip } from 'react-bootstrap';
import Button from '@components/common/Button';
import { BsPencilSquare } from 'react-icons/bs';
import './index.css';

const AboutEmployeeProfile = ({ employee }) => {
  const { themeColor, themeMode } = useTheme();
  const [activeSection, setActiveSection] = useState(null);
  const [sections, setSections] = useState([]);

  useEffect(() => {
    if (employee) {
      const dynamicSections = [
        {
          title: 'Primary Details',
          fields: [
            { label: 'First Name', name: 'firstName', value: employee.firstName || '', required: true },
            { label: 'Middle Name', name: 'middleName', value: employee.middleName || '', required: false },
            { label: 'Last Name', name: 'lastName', value: employee.lastName || '', required: true },
            { label: 'Display Name', name: 'displayName', value: employee.displayName || '', required: true },
            { label: 'Gender', name: 'gender', value: employee.gender || '', type: 'select', options: ['Male', 'Female'] },
            { label: 'Date of Birth', name: 'dob', value: employee.dob || '', type: 'date' },
            { label: 'Marital Status', name: 'marital', value: employee.marital || '', type: 'select', options: ['Single', 'Married'] },
            { label: 'Blood Group', name: 'blood', value: employee.blood || '' },
            { label: 'Physically Handicapped', name: 'handicapped', value: employee.handicapped || 'No', type: 'select', options: ['Yes', 'No'] },
            { label: 'Nationality', name: 'nationality', value: employee.nationality || 'India' },
          ],
        },
        {
          title: 'Contact Details',
          fields: [
            { label: 'Work Email', name: 'workEmail', value: employee.email || '' },
            { label: 'Personal Email', name: 'personalEmail', value: employee.personalEmail || '' },
            { label: 'Mobile Number', name: 'mobile', value: employee.contactNumber || '' },
            { label: 'Work Number', name: 'workNumber', value: employee.workNumber || '' },
            { label: 'Residence Number', name: 'residenceNumber', value: employee.residenceNumber || '' },
            { label: 'Emergency Contact', name: 'emergency', value: employee.emergencyContact || '' },
          ],
        },
        {
          title: 'Addresses',
          fields: [
            { label: 'Current Address', name: 'currentAddress', value: employee.currentAddress || '' },
            { label: 'Permanent Address', name: 'permanentAddress', value: employee.permanentAddress || '' },
            { label: 'Same as Current Address', name: 'sameAddress', value: employee.sameAddress || false, type: 'checkbox' },
          ],
        },
        {
          title: 'Relations',
          fields: [
            { label: 'Relation Type', name: 'relation', value: employee.relation || '', type: 'select', options: ['Father', 'Mother', 'Spouse', 'Sibling', 'Others'] },
            { label: 'Gender', name: 'relationGender', value: employee.relationGender || '', type: 'select', options: ['Male', 'Female', 'Other'] },
            { label: 'First Name', name: 'relationFirstName', value: employee.relationFirstName || '' },
            { label: 'Last Name', name: 'relationLastName', value: employee.relationLastName || '' },
            { label: 'Email', name: 'relationEmail', value: employee.relationEmail || '' },
            { label: 'Mobile', name: 'relationMobile', value: employee.relationMobile || '' },
            { label: 'Profession', name: 'relationProfession', value: employee.relationProfession || '' },
            { label: 'Date of Birth', name: 'relationDob', value: employee.relationDob || '', type: 'date' },
          ],
        }
      ];
      setSections(dynamicSections);
    }
  }, [employee]);

  const handleSave = (updatedSection) => {
    const updated = sections.map((s) => s.title === updatedSection.title ? updatedSection : s);
    setSections(updated);
    setActiveSection(null);
  };

  return (
    <div className={`employee-profile-container ${themeColor} ${themeMode}`}>
      <div className="row g-4">
        {sections.map((section, idx) => (
          <div key={idx} className="col-lg-6 col-md-12">
            <div className="profile-card h-100">
              <div className="profile-card-header">
                <h6 className="theme-text">{section.title}</h6>
                <OverlayTrigger placement="left" overlay={<Tooltip>Edit {section.title}</Tooltip>}>
                  <span className="edit-link" onClick={() => setActiveSection(section)}>
                    <BsPencilSquare size={18} />
                  </span>
                </OverlayTrigger>
              </div>
              <div className="profile-card-body row">
                {section.fields.map((field, i) => (
                  <div key={i} className="col-6 field-item">
                    <div className="field-label">{field.label}</div>
                    <div className="field-value">
                      {field.type === 'checkbox'
                        ? field.value
                          ? 'Yes'
                          : 'No'
                        : field.value || <em className="text-muted">-Not Set-</em>}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Modal for Editing Section */}
      {activeSection && (
        <div className="modal fade show d-block" tabIndex="-1" role="dialog" style={{ backgroundColor: 'rgba(0,0,0,0.5)' }}>
          <div className="modal-dialog modal-lg modal-dialog-centered" role="document">
            <div className={`modal-content ${themeMode === 'dark' ? 'bg-dark text-white' : ''}`}>
              {/* Modal Header */}
              <div className="modal-header">
                <h5 className="modal-title">{activeSection.title}</h5>
                <button type="button" className="btn-close" onClick={() => setActiveSection(null)}></button>
              </div>

              {/* Modal Body */}
              <div className="modal-body">
                <form className="row g-3">
                  {activeSection.fields.map((field, idx) => (
                    <div key={idx} className="col-md-6">
                      {field.type === 'checkbox' ? (
                        <div className="form-check">
                          <input
                            type="checkbox"
                            className="form-check-input"
                            id={`check-${field.name}`}
                            checked={field.value}
                            onChange={(e) => {
                              const updated = [...activeSection.fields];
                              updated[idx].value = e.target.checked;
                              setActiveSection({ ...activeSection, fields: updated });
                            }}
                          />
                          <label htmlFor={`check-${field.name}`} className="form-check-label">
                            {field.label}
                          </label>
                        </div>
                      ) : (
                        <>
                          <label className="form-label">
                            {field.label}{field.required && ' *'}
                          </label>
                          {field.type === 'select' ? (
                            <select
                              className="form-select"
                              value={field.value}
                              onChange={(e) => {
                                const updated = [...activeSection.fields];
                                updated[idx].value = e.target.value;
                                setActiveSection({ ...activeSection, fields: updated });
                              }}
                            >
                              <option value="">Select</option>
                              {field.options.map(opt => (
                                <option key={opt} value={opt}>{opt}</option>
                              ))}
                            </select>
                          ) : (
                            <input
                              type={field.type === 'date' ? 'date' : 'text'}
                              className="form-control"
                              value={field.value}
                              onChange={(e) => {
                                const updated = [...activeSection.fields];
                                updated[idx].value = e.target.value;
                                setActiveSection({ ...activeSection, fields: updated });
                              }}
                            />
                          )}
                        </>
                      )}
                    </div>
                  ))}
                </form>
              </div>

              {/* Modal Footer */}
              <div className="modal-footer">
                <Button variant='outline' size='sm' label={'Cancel'} onClick={() => setActiveSection(null)} />
                <Button variant='solid' size='sm' label={'Update'} onClick={() => handleSave(activeSection)} />
              </div>
            </div>
          </div>
        </div>
      )}

    </div>
  );
};

export default AboutEmployeeProfile;
