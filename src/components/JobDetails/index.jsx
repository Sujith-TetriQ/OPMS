import React, { useState, useEffect } from 'react';
import { Modal, Button, Form, OverlayTrigger, Tooltip } from 'react-bootstrap';
import { BsPencilSquare } from 'react-icons/bs';
import { useTheme } from '@context/ThemeContext';
import './index.css';

const JobDetails = ({ job={} }) => {
  const { themeColor, themeMode } = useTheme();
  const [sections, setSections] = useState([]);
  const [activeSection, setActiveSection] = useState(null);

  useEffect(() => {
    const structured = [
      {
        title: 'Job Details',
        fields: [
          { label: 'Employee Number', name: 'employeeNumber', value: job.employeeNumber || '' },
          { label: 'Date of Joining', name: 'joiningDate', value: job.joiningDate || '', type: 'date' },
          { label: 'Primary Job Title', name: 'primaryTitle', value: job.primaryTitle || '' },
          { label: 'Secondary Job Title', name: 'secondaryTitle', value: job.secondaryTitle || '' },
          { label: 'In Probation', name: 'probationStatus', value: job.probationStatus || '', type: 'select', options: ['Yes', 'No'] },
          { label: 'Probation Policy', name: 'probationPolicy', value: job.probationPolicy || '' },
          { label: 'Notice Period', name: 'noticePeriod', value: job.noticePeriod || '' },
          { label: 'Worker Type', name: 'workerType', value: job.workerType || '' },
          { label: 'Time Type', name: 'timeType', value: job.timeType || '' },
          { label: 'Contract Status', name: 'contractStatus', value: job.contractStatus || '' },
          { label: 'Pay Band', name: 'payBand', value: job.payBand || '' },
          { label: 'Pay Grade', name: 'payGrade', value: job.payGrade || '' },
        ]
      },
      {
        title: 'Organization',
        fields: [
          { label: 'Business Unit', name: 'businessUnit', value: job.businessUnit || '' },
          { label: 'Department', name: 'department', value: job.department || '' },
          { label: 'Location', name: 'location', value: job.location || '' },
          { label: 'Cost Center', name: 'costCenter', value: job.costCenter || '' },
          { label: 'Legal Entity', name: 'legalEntity', value: job.legalEntity || '' },
          { label: 'Reports To', name: 'reportingManager', value: job.reportingManager || '' },
        ]
      },
      {
        title: 'Employee Time',
        fields: [
          { label: 'Shift', name: 'shift', value: job.shift || '' },
          { label: 'Leave Plan', name: 'leavePlan', value: job.leavePlan || '' },
          { label: 'Attendance Number', name: 'attendanceNumber', value: job.attendanceNumber || '' },
          { label: 'Attendance Capture Scheme', name: 'attendanceScheme', value: job.attendanceScheme || '' },
          { label: 'Shift Weekly Off Rule', name: 'weeklyOffRule', value: job.weeklyOffRule || '' },
          { label: 'Shift Allowance Policy', name: 'allowancePolicy', value: job.allowancePolicy || '' },
          { label: 'Overtime', name: 'overtime', value: job.overtime || '' },
          { label: 'Weekly Off Policy', name: 'weeklyOffPolicy', value: job.weeklyOffPolicy || '' },
          { label: 'Holiday Calendar', name: 'holidayCalendar', value: job.holidayCalendar || '' },
          { label: 'Disable Attendance Tracking', name: 'disableTracking', value: !!job.disableTracking, type: 'checkbox' },
          { label: 'Attendance Penalisation Policy', name: 'penalisationPolicy', value: job.penalisationPolicy || '' },
        ]
      }
    ];

    // ✅ Prevent infinite loop by checking if already same
    if (JSON.stringify(sections) !== JSON.stringify(structured)) {
      setSections(structured);
    }
  }, [job]);

  const handleSave = (updatedSection) => {
    const updated = sections.map((sec) =>
      sec.title === updatedSection.title ? updatedSection : sec
    );
    setSections(updated);
    setActiveSection(null);
  };

  return (
    <div className={`job-details-wrapper ${themeColor} ${themeMode}`}>
      <div className="row g-4">
        {sections.map((section, idx) => (
          <div key={idx} className="col-12 col-lg-6 d-flex">
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
                  <div key={i} className="col-md-6 field-item">
                    <div className="field-label">{field.label}</div>
                    <div className="field-value">
                      {field.type === 'checkbox'
                        ? field.value ? 'Yes' : 'No'
                        : field.value || <em className="text-muted">-Not Set-</em>}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Modal for editing */}
      {activeSection && (
        <Modal show onHide={() => setActiveSection(null)} size="lg" centered>
          <Modal.Header closeButton>
            <Modal.Title>{activeSection.title}</Modal.Title>
          </Modal.Header>
          <Modal.Body>
            <Form className="row g-3">
              {activeSection.fields.map((field, idx) => (
                <div key={idx} className="col-md-6">
                  <Form.Label className="form-label">{field.label}</Form.Label>
                  {field.type === 'select' ? (
                    <Form.Select
                      value={field.value}
                      onChange={(e) => {
                        const updated = [...activeSection.fields];
                        updated[idx].value = e.target.value;
                        setActiveSection({ ...activeSection, fields: updated });
                      }}
                    >
                      {field.options.map((opt) => (
                        <option key={opt} value={opt}>{opt}</option>
                      ))}
                    </Form.Select>
                  ) : field.type === 'date' ? (
                    <Form.Control
                      type="date"
                      value={field.value}
                      onChange={(e) => {
                        const updated = [...activeSection.fields];
                        updated[idx].value = e.target.value;
                        setActiveSection({ ...activeSection, fields: updated });
                      }}
                    />
                  ) : field.type === 'checkbox' ? (
                    <Form.Check
                      type="checkbox"
                      checked={field.value}
                      onChange={(e) => {
                        const updated = [...activeSection.fields];
                        updated[idx].value = e.target.checked;
                        setActiveSection({ ...activeSection, fields: updated });
                      }}
                    />
                  ) : (
                    <Form.Control
                      type="text"
                      value={field.value}
                      onChange={(e) => {
                        const updated = [...activeSection.fields];
                        updated[idx].value = e.target.value;
                        setActiveSection({ ...activeSection, fields: updated });
                      }}
                    />
                  )}
                </div>
              ))}
            </Form>
          </Modal.Body>
          <Modal.Footer>
            <Button variant="secondary" onClick={() => setActiveSection(null)}>Cancel</Button>
            <Button variant="primary" onClick={() => handleSave(activeSection)}>Update</Button>
          </Modal.Footer>
        </Modal>
      )}
    </div>
  );
};

export default JobDetails;
