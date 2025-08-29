// @config/onboard.config.js

export const DEPARTMENTS = [
  'Management', 'Human Resources', 'Finance', 'Sales',
  'Marketing', 'Operations', 'IT', 'Admin', 'Accounts'
];

export const PROBATION_POLICIES = ['None', '3 Months', '6 Months', '9 Months'];
export const TIME_TYPES = ['Full Time', 'Part Time'];
export const WORKER_TYPES = ['Permanent', 'Contractual'];
export const WORK_MODES = ['Remote', 'Hybrid', 'On-site'];
export const SALARY_STRUCTURES = ['CTC', 'Hourly', 'Monthly'];
export const NOTICE_PERIODS = [
  'Not applicable', '15 Days', '30 Days', '45 Days', '60 Days', '90 Days'
];

export const MANAGERS_BY_DEPT = {
  Management: ['Super Manager - Management', 'Sujith Chandra', 'Sravan Kumar'],
  'Human Resources': ['Super Manager - HR', 'Mounika D'],
  Finance: ['Super Manager - Finance', 'Srihari'],
  Sales: ['Super Manager - Sales', 'Fiaz', 'Vamsi'],
  Marketing: ['Super Manager - Marketing', 'Srinivas'],
  Operations: ['Super Manager - Operations', 'Deepak', 'Vamshi Krishna', 'Rohit',],
  IT: ['Super Manager - IT', 'Vinay R', 'Pavan K', 'Srikanth B'],
  Admin: ['Super Manager - Admin', 'Priya G'],
  Accounts: ['Super Manager - Accounts', 'Prasanth'],
};

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

      { name: 'dob', label: 'Date of Birth', type: 'date-ddmmyyyy', placeholder: 'DD-MM-YYYY', required: true },


      { name: 'nationality', label: 'Nationality', type: 'country-select', required: true },

      { name: 'employeeNumber', label: 'Employee Number', type: 'text', required: true },
      { name: 'email', label: 'Email', type: 'email', required: true },


      { name: 'phone', label: 'Phone Number', type: 'phone-intl', required: true },

      { name: 'address', label: 'Address', type: 'text' },
      { name: 'emergencyContactName', label: 'Emergency Contact Name', type: 'text' },
      { name: 'emergencyContactNumber', label: 'Emergency Contact Number', type: 'text' },
    ],
  },
  {
    step: 2,
    title: 'Job Details',
    fields: [
      { name: 'joiningDate', label: 'Joining Date', type: 'date-ddmmyyyy', placeholder: 'DD-MM-YYYY', required: true },
      { name: 'jobTitle', label: 'Job Title', type: 'text', required: true },
      { name: 'timeType', label: 'Time Type', type: 'select', options: TIME_TYPES },

      { name: 'legalEntity', label: 'Legal Entity', type: 'text', required: true },

      { name: 'department', label: 'Department', type: 'select', required: true, options: DEPARTMENTS },
      { name: 'reportingManager', label: 'Reporting Manager', type: 'select', dynamic: 'MANAGER' },

      { name: 'workerType', label: 'Worker Type', type: 'select', options: WORKER_TYPES },
      { name: 'probationPolicy', label: 'Probation Policy', type: 'select', required: true, options: PROBATION_POLICIES },
      { name: 'noticePeriod', label: 'Notice Period', type: 'select', required: true, options: NOTICE_PERIODS },


    ],
  },
  {
    step: 3,
    title: 'Work Details',
    fields: [
      { name: 'workMode', label: 'Work Mode', type: 'select', required: true, options: WORK_MODES },


      { name: 'officeCountry', label: 'Office Country', type: 'country-select', required: true },
      { name: 'officeState', label: 'Office State / Province', type: 'state-select', required: true, dependsOn: 'officeCountry' },
      { name: 'officeCity', label: 'Office City', type: 'city-select', required: true, dependsOn: 'officeState' },

      { name: 'workEmail', label: 'Work Email', type: 'email', required: true },
      { name: 'workPhone', label: 'Work Phone', type: 'phone-intl' },

      { name: 'shiftTiming', label: 'Shift Timing', type: 'time-12h' },
      { name: 'workHoursPerWeek', label: 'Weekly Work Hours', type: 'text' },
      { name: 'accessCardNumber', label: 'Access Card Number', type: 'text' },
      { name: 'systemAllocated', label: 'System Allocated', type: 'select', options: ['Yes', 'No'] },
    ]
  },
  {
    step: 4,
    title: 'Compensation Details',
    fields: [
      { name: 'salaryStructure', label: 'Salary Structure', type: 'select', required: true, options: SALARY_STRUCTURES },

      { name: 'baseSalary', label: 'Base Salary (₹)', type: 'text', required: true, showWhen: 'CTC' },
      { name: 'hra', label: 'House Rent Allowance (₹)', type: 'text', showWhen: 'CTC' },
      { name: 'variablePay', label: 'Variable Pay (₹)', type: 'text', showWhen: 'CTC' },
      { name: 'bonus', label: 'Joining Bonus (₹)', type: 'text', showWhen: 'CTC' },
      { name: 'otherBenefits', label: 'Other Benefits', type: 'text', showWhen: 'CTC' },

      { name: 'hourlyRate', label: 'Hourly Rate (₹)', type: 'text', required: true, showWhen: 'Hourly' },
      { name: 'monthlySalary', label: 'Monthly Salary (₹)', type: 'text', required: true, showWhen: 'Monthly' },


      { name: 'bankName', label: 'Bank Name', type: 'text', required: true },
      { name: 'accountNumber', label: 'Account Number', type: 'text', required: true },
      { name: 'ifscCode', label: 'IFSC Code', type: 'text', required: true },

    ]
  }
];
