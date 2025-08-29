import * as Yup from 'yup';

export const formsConfig = [
    {
        title: "Resignation Details",
        fields: [
            { name: "employeeID", label: "Employee ID*", type: "text" },
            { name: "employeeName", label: "Employee Name*", type: "text" },
            { name: "department", label: "Department*", type: "select", options: ["IT", "HR", "Sales", "Marketing"] },
            { name: "resignationDate", label: "Date of Resignation*", type: "date" },
            { name: "noticePeriod", label: "Notice Period*", type: "select", options: ["30 days", "60 days", "90 days"] },
            { name: "reason", label: "Reason for Leaving (optional)", type: "textarea" },
        ],
        validationSchema: Yup.object({
            employeeID: Yup.string().required('Employee ID is required'),
            employeeName: Yup.string().required('Employee Name is required'),
            department: Yup.string().required('Department is required'),
            resignationDate: Yup.date().required('Date of Resignation is required'),
            noticePeriod: Yup.string().required('Notice Period is required'),
            reason: Yup.string(),
        }),
        initialValues: {
            employeeID: '',
            employeeName: '',
            department: '',
            resignationDate: '',
            noticePeriod: '',
            reason: '',
        }
    },
    {
        title: "Manager Review",
        fields: [
            { name: "managerName", label: "Manager Name*", type: "text" },
            { name: "acknowledgmentDate", label: "Date of Acknowledgment*", type: "date" },
            { name: "approvalStatus", label: "Approval Status*", type: "select", options: ["Pending", "Approved", "Denied"] },
            { name: "nextStep", label: "Next Step*", type: "select", options: ["Initiate Exit Interview", "Begin Handover Process", "Both Exit Interview & Handover"] },
        ],
        validationSchema: Yup.object({
            managerName: Yup.string().required('Manager Name is required'),
            acknowledgmentDate: Yup.date().required('Date of Acknowledgment is required'),
            approvalStatus: Yup.string().oneOf(["Pending", "Approved", "Denied"]).required('Approval Status is required'),
            nextStep: Yup.string().oneOf(["Initiate Exit Interview", "Begin Handover Process", "Both Exit Interview & Handover"]).required('Next Step is required'),
        }),
        initialValues: {
            managerName: '',
            acknowledgmentDate: '',
            approvalStatus: 'Pending',
            nextStep: '',
        }
    },
    {
        title: "Exit Interview",
        fields: [
            { name: "interviewConducted", label: "Exit Interview Conducted", type: "select", options: ["Yes", "No"] },
            { name: "interviewDate", label: "Interview Date*", type: "date" },
            { name: "interviewerName", label: "Interviewer Name*", type: "text" },
            { name: "interviewOutcome", label: "Outcome of the Interview*", type: "textarea" },
            { name: "overallExperience", label: "Overall Experience (1-5 stars)", type: "stars" },
            { name: "okayToRejoin", label: "Okay to Rejoin", type: "radio", options: ["Yes", "No", "Maybe"] },
        ],
        validationSchema: Yup.object({
            interviewConducted: Yup.string().oneOf(["Yes", "No"]).required('Please specify if the interview was conducted'),
            interviewDate: Yup.date().required('Interview Date is required'),
            interviewerName: Yup.string().required('Interviewer Name is required'),
            interviewOutcome: Yup.string().required('Outcome of the Interview is required'),
        }),
        initialValues: {
            interviewConducted: '',
            interviewDate: '',
            interviewerName: '',
            interviewOutcome: '',
            overallExperience: 0,
            okayToRejoin: '',
        }
    },
    {
        title: "Task Handover",
        fields: [
            { name: "taskList", label: "Task List", type: "dynamic-table" },
        ],
        validationSchema: Yup.object({
            taskList: Yup.array().of(
                Yup.object({
                    taskName: Yup.string().required('Task Name is required'),
                    assignedTo: Yup.string().required('Assigned To is required'),
                    handoverDate: Yup.date().required('Handover Date is required'),
                    status: Yup.string().required('Status is required'),
                })
            ).min(1, 'At least one task is required'),
        }),
        initialValues: {
            taskList: [
                { taskName: '', assignedTo: '', handoverDate: '', status: '' }
            ]
        }
    },
    {
        title: "Final Process",
        fields: [
            { name: "outstandingSalary", label: "Outstanding Salary($)", type: "number" },
            { name: "accruedVacation", label: "Accrued Vacation($)", type: "number" },
            { name: "anyDeductions", label: "Any Deductions($)", type: "number" },
            { name: "finalSettlementAmount", label: "Final Settlement Amount($)", type: "number" },
            { name: "dateOfPayment", label: "Date of Payment", type: "date" },
            { name: "assetReturn", label: "Asset Return", type: "dynamic-table" },
            { name: "accessRemovalDate", label: "Date of Access Removal", type: "date" },
            { name: "accessRemovalConfirmation", label: "Confirmation", type: "checkbox", options: ["All Access Revoked"] },
            { name: "taskCompletionStatus", label: "Task Completion Status", type: "checkbox", options: ["Documentation Complete", "Records Updated", "Benefits Removed"] },
            { name: "offboardingDate", label: "Offical Last Date of Employment", type: "date" },
            { name: "departureConfirmation", label: "Departure's Confirmation", type: "text" },
            { name: "alumniContactEmail", label: "Contact Information for Alumni (E-mail)", type: "email" },
            { name: "alumniContactNumber", label: "Contact Number", type: "tel" },
            { name: "alumniNetworkInvitation", label: "Alumni Network Invitation", type: "toggle" },
        ],
        validationSchema: Yup.object({
            outstandingSalary: Yup.number().required('Outstanding Salary is required').positive('Amount must be positive'),
            accruedVacation: Yup.number().required('Accrued Vacation is required').positive('Amount must be positive'),
            anyDeductions: Yup.number(),
            finalSettlementAmount: Yup.number().required('Final Settlement Amount is required').positive('Amount must be positive'),
            dateOfPayment: Yup.date().required('Date of Payment is required'),
            accessRemovalDate: Yup.date().required('Date of Access Removal is required'),
            accessRemovalConfirmation: Yup.array().of(Yup.string()).min(1, 'Access removal confirmation is required.'),
            taskCompletionStatus: Yup.array().of(Yup.string()).min(3, 'All task completion statuses must be checked.'),
            offboardingDate: Yup.date().required('Offical Last Date of Employment is required'),
            departureConfirmation: Yup.string().required('Departure\'s Confirmation is required'),
            alumniContactEmail: Yup.string().email('Invalid email format').required('Alumni email is required'),
            alumniContactNumber: Yup.string().matches(/^\d{10}$/, 'Invalid phone number').required('Alumni contact number is required'),
        }),
        initialValues: {
            outstandingSalary: '',
            accruedVacation: '',
            anyDeductions: '',
            finalSettlementAmount: '',
            dateOfPayment: '',
            assetReturn: [],
            accessRemovalDate: '',
            accessRemovalConfirmation: [],
            taskCompletionStatus: [],
            offboardingDate: '',
            departureConfirmation: '',
            alumniContactEmail: '',
            alumniContactNumber: '',
            alumniNetworkInvitation: false,
        }
    }
];