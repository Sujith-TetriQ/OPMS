import {
  MdOutlineDashboard, MdDashboard,
  MdOutlinePeople, MdPeople,
  MdOutlineCalendarToday, MdCalendarToday,
  MdOutlineEventBusy, MdEventBusy,
  MdOutlineAttachMoney, MdAttachMoney,
  MdOutlineExitToApp, MdExitToApp,
} from 'react-icons/md';

export const SIDEBAR_MENU = [
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
  {
    path: "/admin/exit",
    label: "Exit",
    icon: MdOutlineExitToApp,
    activeIcon: MdExitToApp,
  },
];
