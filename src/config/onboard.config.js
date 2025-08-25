// config/onboarding.config.js

export const onboardingSteps = [
  {
    step: 1,
    title: 'Basic Details',
    fields: [
      { name: 'firstName', label: 'First Name', type: 'text', required: true },
      { name: 'middleName', label: 'Middle Name', type: 'text' },
      { name: 'lastName', label: 'Last Name', type: 'text', required: true },
      { name: 'displayName', label: 'Display Name', type: 'text', required: true },
      { name: 'gender', label: 'Gender', type: 'select', required: true, options: ['Male', 'Female', 'Other'] },
      { name: 'dob', label: 'Date of Birth', type: 'date', required: true },
      { name: 'nationality', label: 'Nationality', type: 'text' },
      { name: 'employeeNumber', label: 'Employee Number', type: 'text', required: true },
      { name: 'email', label: 'Email', type: 'email', required: true },
      { name: 'phone', label: 'Phone Number', type: 'text', required: true },
      { name: 'address', label: 'Address', type: 'text' },
      { name: 'emergencyContactName', label: 'Emergency Contact Name', type: 'text' },
      { name: 'emergencyContactNumber', label: 'Emergency Contact Number', type: 'text' },
    ],
  },
  {
    step: 2,
    title: 'Job Details',
    fields: [
      { name: 'joiningDate', label: 'Joining Date', type: 'date', required: true },
      { name: 'jobTitle', label: 'Job Title', type: 'text', required: true },
      { name: 'timeType', label: 'Time Type', type: 'select', options: ['Full Time', 'Part Time'] },
      { name: 'legalEntity', label: 'Legal Entity', type: 'text', required: true },
      { name: 'department', label: 'Department', type: 'text', required: true },
      { name: 'location', label: 'Location', type: 'text', required: true },
      { name: 'reportingManager', label: 'Reporting Manager', type: 'text' },
      { name: 'workerType', label: 'Worker Type', type: 'select', options: ['Permanent', 'Contractual'] },
      { name: 'probationPolicy', label: 'Probation Policy', type: 'text', required: true },
      { name: 'noticePeriod', label: 'Notice Period', type: 'text', required: true },
      { name: 'workEmail', label: 'Work Email', type: 'email', required: true },
      { name: 'workPhone', label: 'Work Phone', type: 'text' },
    ],
  },
  {
  step: 3,
  title: 'Work Details',
  fields: [
    { name: 'workMode', label: 'Work Mode', type: 'select', required: true, options: ['Remote', 'Hybrid', 'On-site'] },
    { name: 'officeLocation', label: 'Office Location', type: 'text', required: true },
    { name: 'shiftTiming', label: 'Shift Timing', type: 'text', required: false },
    { name: 'workHoursPerWeek', label: 'Weekly Work Hours', type: 'text' },
    { name: 'accessCardNumber', label: 'Access Card Number', type: 'text' },
    { name: 'systemAllocated', label: 'System Allocated', type: 'select', options: ['Yes', 'No'] },
    { name: 'systemAssetTag', label: 'System Asset Tag', type: 'text' },
    { name: 'vpnAccess', label: 'VPN Access Required', type: 'select', options: ['Yes', 'No'] },
    { name: 'officialLaptopEmail', label: 'Official Laptop Email', type: 'email' },
    { name: 'remarks', label: 'Remarks', type: 'text' }
  ]
},
{
  step: 4,
  title: 'Compensation Details',
  fields: [
    { name: 'salaryStructure', label: 'Salary Structure', type: 'select', required: true, options: ['CTC', 'Hourly', 'Monthly'] },
    { name: 'baseSalary', label: 'Base Salary (₹)', type: 'text', required: true },
    { name: 'hra', label: 'House Rent Allowance (₹)', type: 'text' },
    { name: 'variablePay', label: 'Variable Pay (₹)', type: 'text' },
    { name: 'bonus', label: 'Joining Bonus (₹)', type: 'text' },
    { name: 'otherBenefits', label: 'Other Benefits', type: 'text' },
    { name: 'bankName', label: 'Bank Name', type: 'text', required: true },
    { name: 'accountNumber', label: 'Account Number', type: 'text', required: true },
    { name: 'ifscCode', label: 'IFSC Code', type: 'text', required: true },
    { name: 'pfApplicable', label: 'PF Applicable', type: 'select', options: ['Yes', 'No'] },
    { name: 'esiApplicable', label: 'ESI Applicable', type: 'select', options: ['Yes', 'No'] }

  ]

  }
];

 