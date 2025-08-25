import React, { useState } from 'react';
import { ProgressBar, Table, Form, Toast, ToastContainer } from 'react-bootstrap';
import { useTheme } from '@context/ThemeContext';
import Papa from 'papaparse';
import Button from '@components/common/Button';
import './index.css';

// Required and optional field definitions
const requiredFields = ['First Name', 'Last Name', 'Email', 'Phone', 'Joining Date'];
const optionalFields = [
  'Middle Name', 'Gender', 'DOB', 'Address', 'Emergency Contact',
  'Department', 'Job Title', 'Manager', 'Location', 'Work Email'
];

const AddMultipleEmployees = () => {
  // State hooks
  const {themeMode} = useTheme();
  const [selectedFields, setSelectedFields] = useState(Object.fromEntries(optionalFields.map(f => [f, true])));
  const [csvData, setCsvData] = useState([]);
  const [invalidRows, setInvalidRows] = useState([]);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [toastMsg, setToastMsg] = useState('');
  const [showToast, setShowToast] = useState(false);
  const [toastVariant, setToastVariant] = useState('success');

  // Show toast alert
  const showToastMsg = (message, type = 'success') => {
    setToastMsg(message);
    setToastVariant(type);
    setShowToast(true);
  };

  // Toggle optional field selection
  const handleCheckboxChange = (field) => {
    setSelectedFields(prev => ({ ...prev, [field]: !prev[field] }));
  };

  // Convert DD/MM/YYYY to YYYY-MM-DD
  const convertToISODate = (dateStr) => {
    if (/^\d{2}\/\d{2}\/\d{4}$/.test(dateStr)) {
      const [dd, mm, yyyy] = dateStr.split('/');
      return `${yyyy}-${mm}-${dd}`;
    }
    return dateStr;
  };

  // Generate downloadable CSV template with sample and instructions
  const generateCSV = () => {
    const selectedOptionalFields = optionalFields.filter(f => selectedFields[f]);
    const allHeaders = [...requiredFields, ...selectedOptionalFields];

    const sampleRow = {
      'First Name': 'John',
      'Last Name': 'Doe',
      'Email': 'john.doe@example.com',
      'Phone': '9876543210',
      'Joining Date': '2024-01-01',
      'Middle Name': 'A.',
      'Gender': 'Male',
      'DOB': '1990-05-15',
      'Address': '123 Main St, NY',
      'Emergency Contact': '1234567890',
      'Department': 'Engineering',
      'Job Title': 'Software Engineer',
      'Manager': 'Jane Smith',
      'Location': 'New York',
      'Work Email': 'john.doe@company.com'
    };

    const instructions = allHeaders.reduce((acc, field) => {
      acc[field] = requiredFields.includes(field)
        ? `Required: ${field}`
        : 'Optional';
      return acc;
    }, {});

    const csvRows = [
      allHeaders,
      allHeaders.map(h => instructions[h] || ''),
      allHeaders.map(h => sampleRow[h] || '')
    ];

    const csv = Papa.unparse(csvRows);
    const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    link.href = URL.createObjectURL(blob);
    link.setAttribute('download', 'employee_template.csv');
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  // Field-level validation
  const validateField = (key, value) => {
    if (requiredFields.includes(key) && (!value || value.trim() === '')) return 'Required';
    if (key === 'Email' && value && !/^\S+@\S+\.\S+$/.test(value)) return 'Invalid Email';
    if (key === 'Phone' && value && !/^\d{10}$/.test(value)) return 'Invalid Phone';
    if (key === 'Emergency Contact' && value && !/^\d{10}$/.test(value)) return 'Invalid Emergency Contact';
    if (key === 'DOB' && value && !/^\d{4}-\d{2}-\d{2}$/.test(value)) return 'Invalid DOB';
    if (key === 'Joining Date' && value && !/^\d{4}-\d{2}-\d{2}$/.test(value)) return 'Invalid Joining Date';
    return '';
  };

  // CSV file upload handler
  const handleFileUpload = (e) => {
    const file = e.target.files[0];
    if (!file || file.type !== 'text/csv') {
      showToastMsg('Please upload a valid CSV file.', 'danger');
      return;
    }

    Papa.parse(file, {
      header: true,
      skipEmptyLines: true,
      complete: function (results) {
        let { data, meta } = results;
        data = data.slice(2); // skip instructions rows
        const headers = meta.fields;

        const missingHeaders = requiredFields.filter(h => !headers.includes(h));
        if (missingHeaders.length > 0) {
          showToastMsg(`Missing required fields: ${missingHeaders.join(', ')}`, 'danger');
          return;
        }

        const valid = [];
        const invalid = [];

        data.forEach((row, index) => {
          if (row['DOB']) row['DOB'] = convertToISODate(row['DOB']);
          if (row['Joining Date']) row['Joining Date'] = convertToISODate(row['Joining Date']);

          const rowErrors = {};
          Object.keys(row).forEach(key => {
            const error = validateField(key, row[key]);
            if (error) rowErrors[key] = error;
          });

          if (Object.keys(rowErrors).length > 0) {
            invalid.push({ ...row, __errors: rowErrors, __rowNumber: index + 3 });
          } else {
            valid.push(row);
          }
        });

        setCsvData(valid);
        setInvalidRows(invalid);
        setUploadProgress(100);
        showToastMsg('CSV uploaded and validated successfully.');
      },
      error: function (err) {
        showToastMsg('Error parsing CSV: ' + err.message, 'danger');
      }
    });
  };

  // Delete individual row (valid/invalid)
  const deleteRow = (index, type = 'valid') => {
    const updated = type === 'valid' ? [...csvData] : [...invalidRows];
    updated.splice(index, 1);
    type === 'valid' ? setCsvData(updated) : setInvalidRows(updated);
  };

  // Download only invalid rows
  const downloadInvalidCSV = () => {
    if (invalidRows.length === 0) return;
    const flat = invalidRows.map(({ __errors, __rowNumber, ...rest }) => rest);
    const csv = Papa.unparse(flat);
    const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    link.href = URL.createObjectURL(blob);
    link.setAttribute('download', 'invalid_employees.csv');
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <>
      {/* Main UI */}
      <div className={`add-employees-page ${themeMode}`}>
        <div className="row">
          {/* Optional Fields Section */}
          <div className="col-md-4">
            <div className="card-section">
              <h5 className="optional-fields-title">Optional Fields</h5>
              <div className="checkbox-list">
                {optionalFields.map(field => (
                  <div
                    key={field}
                    onClick={() => handleCheckboxChange(field)}
                    className={`mb-2 py-2 px-3 border rounded bg-light d-flex align-items-center justify-content-between clickable-box ${selectedFields[field] ? 'selected' : ''}`}
                    style={{ cursor: 'pointer' }}
                  >
                    <span className="fw-semibold">{field}</span>
                    <Form.Check
                      type="checkbox"
                      checked={selectedFields[field]}
                      onChange={() => {}}
                      readOnly
                      className="ms-2"
                    />
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* CSV Upload and Result Display Section */}
          <div className="col-md-8">
            <div className="card-section">
              <h4>Add Multiple Employees</h4>
              <p className="upload-instructions">
                Download CSV template with required and selected optional fields, fill it, then upload.
              </p>

              <Button variant="solid" label="Download Template" size="md" onClick={generateCSV} className="mb-3" />

              <div className='upload-area mb-4'>
                <label htmlFor="csvFile" className='form-label fw-semibold'>Upload CSV File</label>
                <input type="file" name="csvFile" accept='.csv' id="csvFile" onChange={handleFileUpload} />
              </div>

              {uploadProgress > 0 && <ProgressBar now={uploadProgress} label={`${uploadProgress}%`} className="mb-4" />}

              {/* Valid rows table */}
              {csvData.length > 0 && (
                <div className="mt-4">
                  <h5>✅ Valid Rows</h5>
                  <Table striped bordered hover responsive size="sm">
                    <thead>
                      <tr>
                        {Object.keys(csvData[0]).map((key, i) => <th key={i}>{key}</th>)}
                        <th>Action</th>
                      </tr>
                    </thead>
                    <tbody>
                      {csvData.map((row, idx) => (
                        <tr key={idx}>
                          {Object.values(row).map((val, i) => <td key={i}>{val}</td>)}
                          <td><Button variant="outline" label="Delete" size="sm" onClick={() => deleteRow(idx, 'valid')} /></td>
                        </tr>
                      ))}
                    </tbody>
                  </Table>
                </div>
              )}

              {/* Invalid rows table */}
              {invalidRows.length > 0 && (
                <div className="mt-5">
                  <h5 className="text-danger">⚠️ Invalid Rows</h5>
                  <Button variant="solid" size="md" label="Download Invalid CSV" className="mb-3" onClick={downloadInvalidCSV} />
                  <Table striped bordered hover responsive size="sm">
                    <thead>
                      <tr>
                        {Object.keys(invalidRows[0]).filter(k => k !== '__errors' && k !== '__rowNumber').map((key, i) => (
                          <th key={i}>{key}</th>
                        ))}
                        <th>Errors</th>
                        <th>Action</th>
                      </tr>
                    </thead>
                    <tbody>
                      {invalidRows.map((row, idx) => (
                        <tr key={idx} className="table-danger">
                          {Object.keys(row).filter(k => k !== '__errors' && k !== '__rowNumber').map((key, i) => (
                            <td key={i}>
                              {row[key]}
                              {row.__errors?.[key] && (
                                <div className="text-danger small">{row.__errors[key]}</div>
                              )}
                            </td>
                          ))}
                          <td>
                            {Object.entries(row.__errors || {}).map(([key, msg], i) => (
                              <div key={i}><strong>{key}:</strong> {msg}</div>
                            ))}
                          </td>
                          <td><Button variant="outline" size="sm" label="Delete" onClick={() => deleteRow(idx, 'invalid')} /></td>
                        </tr>
                      ))}
                    </tbody>
                  </Table>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Toast Notification */}
      <ToastContainer position="bottom-end" className="p-4">
        <Toast bg={toastVariant} show={showToast} onClose={() => setShowToast(false)} delay={3000} autohide>
          <Toast.Body className="text-white">{toastMsg}</Toast.Body>
        </Toast>
      </ToastContainer>
    </>
  );
};

export default AddMultipleEmployees;
