## Overview
HRMS (Human Resource Management System) is a MERN-stack-based web application that provides a robust platform for managing employee records, attendance, onboarding, and other HR-related tasks. This system supports role-based dashboards, dynamic theming, reusable components, and a responsive UI optimized for both light and dark modes.

## Tech Stack
- **Frontend**: React, Bootstrap, React-Bootstrap, React Icons
- **Backend**: Node.js, Express.js
- **Database**: 
- **Others**: Axios, React Router, Toastify, Date-fns, Context API, papaparse, formik, yup, props-type, bootstrap, react-icons, react-datepicker, react-select


## Project Structure (Frontend)
src/
│
├── components/          # Reusable UI components (Button, Modal, etc.)
├── pages/               # Page-level components (AdminDashboard, EmployeeRecords)
├── context/             # Theme and Auth context
├── config/              # Contain all modules config files
├── utils/               # Utility functions and config
├── assets/              # Images, icons, and other assets
├── routes/              # App routing
├── App.jsx              # Main App file
└── main.jsx             # App entry point


## Component & File Descriptions
### 1. `components/Button.jsx`
- Description: Reusable button component supporting multiple theme colors and variants.
- Usage: Used across the app for all buttons (`solid`/`outline`) based on the selected theme.

### 2. `pages/AdminDashboard.jsx`
- Description: Admin landing page showing stats, quick links, and overview.
- Usage: Route - `/admin/dashboard`

### 3. `pages/EmployeeRecords.jsx`
- Description: Displays employee cards with filters (Department, Location).
- Components Used: `EmployeeRecordCard`, `Popover`, `DropdownFilter`
- Route: `/admin/employees`

### 4. `pages/EmployeeProfile.jsx`
- Description: Tab-based view showing personal, job, and document info.
- Behavior: Tabs show icons on mobile, icon+text on desktop.
- Route: `/admin/employees/:id`

### 5. `context/ThemeContext.js`
- Description: Global context managing `themeColor` and `themeMode`.
- Used In: App root and all theme-dependent components


## Theme & Customization
- Theme colors supported: Violet (default), Blue, Green, Rose, Orange
- Light/Dark mode supported via Context
- Dynamic classNames and CSS variables used


## Component & File Descriptions

### `components/`
This folder contains all modular, reusable, and page-level UI components used throughout the HRMS application.

---

### `common/`

#### 🔹 `Button.jsx`
- Reusable button component with support for multiple `themeColor` options (violet, blue, green, etc.) and button variants (solid, outline).
- Used throughout the application for consistent button UI.

#### 🔹 `Button.css`
- Contains theme-based styling for the `Button` component.

---

### `EmployeeAttendanceView/`

#### 🔹 `index.jsx`
- Detailed monthly view of an individual employee's attendance.
- Includes calendar, daily status, stats cards, and logs.
- Route: `/admin/attendance/:id`

#### 🔹 `index.css`
- Custom styles for the attendance calendar, stat widgets, and responsive layouts.

---

### `EmployeeOnboardForm/`

#### 🔹 `index.jsx`
- Step-based form UI for onboarding a single employee.
- Handles input fields related to personal, job, and work details.

#### 🔹 `index.css`
- Styles the form layout, stepper progress, input alignment, and button positions.

---

### `EmployeeOnboarding/`

#### 🔹 `index.jsx`
- Parent component managing the onboarding process across steps.
- Dynamically renders steps based on configuration (`onboardingSteps`).
- Handles validation and navigation between sections.

#### 🔹 `index.css`
- Styles for the entire onboarding flow and stepper interface.

---

### `EmployeeOverview/`

#### 🔹 `index.jsx`
- Default sub-view under Employees section.
- Shows a dashboard-style summary of employees (stat cards, widgets).

#### 🔹 `index.css`
- Provides styles for overview layout, card responsiveness, and visual stats.

---

### `EmployeeProfile/`

#### 🔹 `index.jsx`
- Tab-based profile page displaying employee-specific information.
- Tabs include: `ABOUT`, `PROFILE`, `JOB`, and `DOCUMENTS`.
- Responsive UI: tabs show only icons on mobile, icons with labels on wider screens.

#### 🔹 `index.css`
- Contains custom styles for the profile layout, tabs, and tab content.

---

### `EmployeeRecords/`

#### 🔹 `index.jsx`
- Displays all employees in a responsive card layout with filtering options.
- Uses a reusable `EmployeeRecordCard` component.
- Popover actions (like contact info) are implemented per employee.

#### 🔹 `index.css`
- Grid layout for cards, theme-based styling, filter dropdowns.

---

### `MultiEmployeeForm/`

#### 🔹 `index.jsx`
- Used for onboarding multiple employees at once.
- May support features like Excel upload or batch form entry.

---

Each component folder is organized for modular use with separate `index.jsx` and `index.css` files for logic and styles respectively. All components follow the global theming system and responsive layout practices.


## Setup Instructions   
1. Clone the repository:
```bash
git clone https://github.com/pavan-kurme-tech/sogo-software.git
cd sogo-software
npm install
npm run dev