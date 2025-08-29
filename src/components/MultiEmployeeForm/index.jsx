import React, { useState } from 'react';
import { ProgressBar, Table, Form, Toast, ToastContainer } from 'react-bootstrap';
import { useTheme } from '@context/ThemeContext';
import Papa from 'papaparse';
import Button from '@components/common/Button';
import { MdOutlineCloudUpload } from 'react-icons/md';
import { AiOutlineClose } from 'react-icons/ai'; // <-- close icon
import { useNavigate } from 'react-router-dom';      // <-- for closing action
import './index.css';

// Required and optional field definitions
const requiredFields = ['First Name', 'Last Name', 'Email', 'Phone', 'Joining Date'];
const optionalFields = [
  'Middle Name', 'Gender', 'DOB', 'Address', 'Emergency Contact',
  'Department', 'Job Title', 'Manager', 'Location', 'Work Email'
];

const AddMultipleEmployees = () => {
  const { themeMode } = useTheme();
  const navigate = useNavigate();

  // UI state
  const [selectedFields, setSelectedFields] = useState(
    Object.fromEntries(optionalFields.map(f => [f, true]))
  );
  const [csvData, setCsvData] = useState([]);         // valid rows
  const [invalidRows, setInvalidRows] = useState([]); // invalid rows
  const [uploadProgress, setUploadProgress] = useState(0);
  const [toastMsg, setToastMsg] = useState('');
  const [showToast, setShowToast] = useState(false);
  const [toastVariant, setToastVariant] = useState('success');
  const [fileName, setFileName] = useState('');

  // true = show ONLY data tables + submit + "go back" button
  const [isDataMode, setIsDataMode] = useState(false);

  const showToastMsg = (message, type = 'success') => {
    setToastMsg(message);
    setToastVariant(type);
    setShowToast(true);
  };

  const handleCheckboxChange = (field) => {
    setSelectedFields(prev => ({ ...prev, [field]: !prev[field] }));
  };

  const convertToISODate = (dateStr) => {
    if (/^\d{2}\/\d{2}\/\d{4}$/.test(dateStr)) {
      const [dd, mm, yyyy] = dateStr.split('/');
      return `${yyyy}-${mm}-${dd}`;
    }
    return dateStr;
  };

  // Generate downloadable CSV template
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
      acc[field] = requiredFields.includes(field) ? `Required: ${field}` : 'Optional';
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

  const validateField = (key, value) => {
    if (requiredFields.includes(key) && (!value || value.trim() === '')) return 'Required';
    if (key === 'Email' && value && !/^\S+@\S+\.\S+$/.test(value)) return 'Invalid Email';
    if (key === 'Phone' && value && !/^\d{10}$/.test(value)) return 'Invalid Phone';
    if (key === 'Emergency Contact' && value && !/^\d{10}$/.test(value)) return 'Invalid Emergency Contact';
    if (key === 'DOB' && value && !/^\d{4}-\d{2}-\d{2}$/.test(value)) return 'Invalid DOB';
    if (key === 'Joining Date' && value && !/^\d{4}-\d{2}-\d{2}$/.test(value)) return 'Invalid Joining Date';
    return '';
  };

  const resetUpload = () => {
    setCsvData([]);
    setInvalidRows([]);
    setUploadProgress(0);
    setFileName('');
    setIsDataMode(false);
  };

  // Page-level "Close" action (top-right)
  const handleClosePage = () => {
    // Change to navigate('/admin/employees') if you want a fixed destination
    navigate(-1);
  };

  // File Upload Handler
  const handleFileUpload = (file) => {
    if (!file) return;

    setFileName(file.name);
    setCsvData([]);
    setInvalidRows([]);
    setUploadProgress(0);

    if (!file.name.endsWith('.csv')) {
      showToastMsg('Please upload a valid CSV file.', 'danger');
      return;
    }

    Papa.parse(file, {
      header: true,
      skipEmptyLines: true,
      complete: function ({ data, meta }) {
        const headers = meta.fields || [];
        const missingHeaders = requiredFields.filter(h => !headers.includes(h));
        if (missingHeaders.length > 0) {
          showToastMsg(`Missing required fields: ${missingHeaders.join(', ')}`, 'danger');
          return;
        }

        const rows = data.slice(2); // skip instruction + sample row
        const valid = [];
        const invalid = [];

        rows.forEach((row, index) => {
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

        // Enter data-only mode
        setIsDataMode(true);

        if (valid.length && invalid.length === 0) {
          showToastMsg('CSV uploaded and validated successfully.');
        } else if (!valid.length) {
          showToastMsg('No valid rows found in CSV.', 'danger');
        } else {
          showToastMsg(`Found ${invalid.length} invalid row(s). You can still submit ${valid.length} valid row(s).`, 'danger');
        }
      },
      error: function (err) {
        showToastMsg('Error parsing CSV: ' + err.message, 'danger');
      }
    });
  };

  const deleteRow = (index, type = 'valid') => {
    if (type === 'valid') setCsvData(prev => prev.filter((_, i) => i !== index));
    else setInvalidRows(prev => prev.filter((_, i) => i !== index));
  };

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

  const readyToSubmit = csvData.length > 0;

  const handleSubmit = () => {
    console.log('Submitting employees:', csvData);
    showToastMsg(`Submitting ${csvData.length} employee(s)…`);
  };

  return (
    <>
      <div className={`add-employees-page ${themeMode} ${isDataMode ? 'data-mode' : ''}`}>
        {/* Page header with single Close button (top-right) */}
        <div className="d-flex justify-content-between align-items-center mb-3">
          <h3 className="mb-0">Add Multiple Employees</h3>
          <button
            type="button"
            className="icon-btn top-right-action"
            onClick={handleClosePage}
            aria-label="Close"
            data-tip="Close"
          >
            <AiOutlineClose size={18} />
          </button>
        </div>

        <div className="container">
          <div className="row">
            {/* ======= UPLOAD MODE ======= */}
            {!isDataMode && (
              <>
                {/* Optional Fields (left) */}
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
                            onChange={() => { }}
                            readOnly
                            className="ms-2"
                          />
                        </div>
                      ))}
                    </div>
                  </div>
                </div>

                {/* Upload + Instructions (right) */}
                <div className="col-md-8">
                  <div className="card-section">
                    <p className="upload-instructions">
                      Download CSV template with required and selected optional fields, fill it, then upload.
                    </p>

                    <div className="upload-actions d-flex flex-column justify-content-start align-items-start mb-3">
                      <Button
                        variant="outline"
                        label="Download Template"
                        size="sm"
                        onClick={generateCSV}
                      />

                      <div
                        className="drag-drop-area mt-3 p-4 border rounded text-center w-100"
                        onDragOver={(e) => e.preventDefault()}
                        onDrop={(e) => {
                          e.preventDefault();
                          handleFileUpload(e.dataTransfer.files[0]);
                        }}
                      >
                        {/* Hidden input */}
                        <input
                          type="file"
                          id="csvFile"
                          accept=".csv"
                          className="d-none"
                          onChange={(e) => handleFileUpload(e.target.files[0])}
                        />

                        {/* Upload icon trigger */}
                        <label
                          htmlFor="csvFile"
                          className="d-flex flex-column align-items-center justify-content-center cursor-pointer"
                          style={{ cursor: 'pointer' }}
                        >
                          <MdOutlineCloudUpload size={36} className="text-dark mb-2" />
                          <span className="fw-semibold">Upload CSV</span>
                        </label>

                        <p className="mt-2 mb-0">or drag and drop CSV file here</p>
                        {fileName && <div className="file-name mt-2">📂 {fileName}</div>}
                      </div>

                      {/* Instructions list */}
                      <div className="upload-instructions-list mt-3">
                        <p className="mb-1"><strong>Instructions:</strong></p>
                        <ol>
                          <li>Click <b>Download Template</b> and open it in Excel/Google Sheets.</li>
                          <li>Fill the required fields. Add optional fields you selected on the left.</li>
                          <li>Save as <b>CSV (UTF-8)</b>.</li>
                          <li>Drag & drop the file here or click <b>Upload CSV</b>.</li>
                          <li>Fix any errors shown below, then submit the valid rows.</li>
                        </ol>
                      </div>
                    </div>
                  </div>
                </div>
              </>
            )}

            {/* ======= DATA MODE (ONLY TABLES + SUBMIT) ======= */}
            {isDataMode && (
              <div className="col-12">
                <div className="card-section">
                  <div className="d-flex justify-content-between align-items-center">
                    <h4 className="mb-0">Review & Import</h4>
                    <Button
                      variant="outline"
                      size="sm"
                      label="← Go back & upload again"
                      onClick={resetUpload}
                    />
                  </div>

                  {uploadProgress > 0 && (
                    <ProgressBar now={uploadProgress} label={`${uploadProgress}%`} className="my-3" />
                  )}

                  {/* Valid rows */}
                  {csvData.length > 0 && (
                    <div className="mt-2">
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
                              <td>
                                <Button
                                  variant="outline"
                                  label="Delete"
                                  size="sm"
                                  onClick={() => deleteRow(idx, 'valid')}
                                />
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </Table>
                    </div>
                  )}

                  {/* Invalid rows */}
                  {invalidRows.length > 0 && (
                    <div className="mt-4">
                      <h5 className="text-danger">⚠️ Invalid Rows</h5>
                      <Button
                        variant="solid"
                        size="sm"
                        label="Download Invalid CSV"
                        className="mb-3"
                        onClick={downloadInvalidCSV}
                      />
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
                              <td>
                                <Button
                                  variant="outline"
                                  size="sm"
                                  label="Delete"
                                  onClick={() => deleteRow(idx, 'invalid')}
                                />
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </Table>
                    </div>
                  )}

                  {(csvData.length > 0 || invalidRows.length > 0) && (
                    <div className="d-flex justify-content-between align-items-center mt-4">
                      <div className={invalidRows.length ? 'text-warning fw-semibold' : 'text-success fw-semibold'}>
                        {invalidRows.length
                          ? `Ready to submit ${csvData.length} valid row(s). ${invalidRows.length} invalid row(s) will be ignored.`
                          : csvData.length
                            ? 'All rows validated. Ready to import.'
                            : 'No valid rows yet.'}
                      </div>
                      {csvData.length > 0 && (
                        <Button
                          variant="solid"
                          size="sm"
                          label={invalidRows.length ? `Submit Valid (${csvData.length})` : `Submit (${csvData.length})`}
                          onClick={handleSubmit}
                        />
                      )}
                    </div>
                  )}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Toast Notification */}
      <ToastContainer position="bottom-end" className="p-4">
        <Toast
          bg={toastVariant}
          show={showToast}
          onClose={() => setShowToast(false)}
          delay={3000}
          autohide
        >
          <Toast.Body className="text-white">{toastMsg}</Toast.Body>
        </Toast>
      </ToastContainer>
    </>
  );
};

export default AddMultipleEmployees;
