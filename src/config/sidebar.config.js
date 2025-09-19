import {
    MdOutlineDashboard, MdDashboard,
    MdOutlinePeople, MdPeople,
    MdOutlineCalendarToday, MdCalendarToday,
    MdOutlineEventBusy, MdEventBusy,
    MdOutlineAttachMoney, MdAttachMoney,
    MdOutlineInbox, MdInbox,
    MdOutlinePerson, MdPerson,
    MdOutlineWork, MdWork,
    MdOutlinePayments, MdPayments,
    MdOutlineHistory, MdHistory,
    MdOutlineReceipt, MdReceipt,
    MdOutlineExitToApp, MdExitToApp
} from 'react-icons/md';

export const SIDEBAR_MENU = {
    admin: [
        {
            path: "/admin/dashboard",
            label: "Dashboard",
            icon: MdOutlineDashboard,
            activeIcon: MdDashboard,
        },
        {
            path: "/admin/employees",
            label: "Employees",
            icon: MdOutlinePeople,
            activeIcon: MdPeople,
        },
        {
            path: "/admin/attendance",
            label: "Attendance",
            icon: MdOutlineCalendarToday,
            activeIcon: MdCalendarToday,
        },
        {
            path: "/admin/leaves",
            label: "Leaves",
            icon: MdOutlineEventBusy,
            activeIcon: MdEventBusy,
        },
        {
            path: "/admin/payroll",
            label: "Payroll",
            icon: MdOutlineAttachMoney,
            activeIcon: MdAttachMoney,
        },
    ],

    employee: [
        {
            path: "/employee/dashboard",
            label: "Dashboard",
            icon: MdOutlineDashboard,
            activeIcon: MdDashboard,
        },
        {
            label: "Me",
            icon: MdOutlinePeople,
            activeIcon: MdPeople,
            subMenu: [
                {
                    path: "/employee/me/profile/1",
                    label: "Who Am I",
                    icon: MdOutlinePerson,
                    activeIcon: MdPerson
                },
                {
                    path: "/employee/me/job",
                    label: "Job",
                    icon: MdOutlineWork,
                    activeIcon: MdWork
                },
                {
                    path: "/employee/me/attendance",
                    label: "Attendance",
                    icon: MdOutlineCalendarToday,
                    activeIcon: MdCalendarToday
                },
                {
                    label: "My Finance",
                    icon: MdOutlinePayments,
                    activeIcon: MdPayments,
                    subMenu: [
                        {
                            path: "/employee/me/finance/salary",
                            label: "Salary",
                            icon: MdOutlineAttachMoney,
                            activeIcon: MdAttachMoney
                        },
                        {
                            path: "/employee/me/finance/timeline",
                            label: "Timeline of Salary",
                            icon: MdOutlineHistory,
                            activeIcon: MdHistory
                        },
                        {
                            path: "/employee/me/finance/payslips",
                            label: "Payslips",
                            icon: MdOutlineReceipt,
                            activeIcon: MdReceipt
                        },
                    ],
                },
                {
                    path: "/employee/me/separation",
                    label: "Separation",
                    icon: MdOutlineExitToApp,
                    activeIcon: MdExitToApp
                },
            ],
        },

        {
            path: "/employee/inbox",
            label: "Inbox",
            icon: MdOutlineInbox,
            activeIcon: MdInbox,
        },
    ],
};