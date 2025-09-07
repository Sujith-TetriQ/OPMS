import React, { useState } from "react";
import { FiFilter, FiUsers } from "react-icons/fi";
import { AiOutlineClockCircle, AiOutlineExclamationCircle } from "react-icons/ai";
import { PiCoffeeLight } from "react-icons/pi";
import { LuLogOut } from "react-icons/lu";
import Select, { components } from "react-select";
import { MdCheck } from "react-icons/md";
import { useTheme } from '@context/ThemeContext';
import "./index.css";


// Custom Option with Tick Mark
const CustomOption = (props) => {
  const { isSelected, data } = props;
  return (
    <components.Option {...props}>
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          width: "100%",
        }}
      >
        <span>{data.label}</span>
        {isSelected && <MdCheck size={18} style={{ color: "gray" }} />}
      </div>
    </components.Option>
  );
};

// ✅ Custom Single Value Renderer
const CustomSingleValue = (props) => (
  <components.SingleValue {...props}>
    {props.data.label}
  </components.SingleValue>
);

const customStyles = {
  control: (provided, state) => ({
    ...provided,
    minWidth: "200px",
    maxWidth: "200px",
    backgroundColor: "#f5f5f5",
    borderColor: "#ccc",
    boxShadow: "none",
    "&:hover": {
      borderColor: "#999",
    },
  }),
  menu: (provided) => ({
    ...provided,
    minWidth: "200px",
    maxWidth: "200px",
  }),
  menuList: (provided) => ({
    ...provided,
    maxHeight: "300px",
    overflowY: "auto",
    overflowX: "hidden",
  }),
};

const TeamAttendance = ({ employees }) => {
   const { themeMode } = useTheme();
  const [selectedTeam, setSelectedTeam] = useState({
    value: "All Teams",
    label: "All Teams",
  });

  // Dropdown Teams
  const teams = [
    { value: "All Teams", label: "All Teams" },
    { value: "Engineering", label: "Engineering" },
    { value: "Marketing", label: "Marketing" },
    { value: "Sales", label: "Sales" },
    { value: "Human Resources", label: "Human Resources" },
    { value: "Finance", label: "Finance" },
    { value: "Design", label: "Design" },
    { value: "Product", label: "Product" },
  ];

  // Filter Employees
  const filteredEmployees =
    selectedTeam.value === "All Teams"
      ? employees
      : employees.filter((emp) => emp.team === selectedTeam.value);

  // Sort employees by desired status order
  const statusOrder = {
    "Late": 1,
    "Clocked Out": 2,
    "Leave": 3,
    "On Break": 4,
    "Clocked In": 5,
  };

  const sortedEmployees = [...filteredEmployees].sort((a, b) => {
    const orderDiff = (statusOrder[a.status] || 999) - (statusOrder[b.status] || 999);
    if (orderDiff !== 0) return orderDiff;
    return a.name.localeCompare(b.name); // tie-breaker: alphabetical
  });

  // Count Status
  const activeCount = filteredEmployees.filter((emp) => emp.status === "Clocked In").length;
  const breakCount = filteredEmployees.filter((emp) => emp.status === "On Break").length;
  const lateCount = filteredEmployees.filter((emp) => emp.status === "Late").length;

  // Status Badge
  const getStatusBadge = (status) => {
    switch (status) {
      case "Clocked In":
        return (
          <span className="status green">
            <AiOutlineClockCircle size={20} /> Clocked In
          </span>
        );
      case "On Break":
        return (
          <span className="status orange">
            <PiCoffeeLight size={20} /> On Break
          </span>
        );
      case "Late":
        return (
          <span className="status red">
            <AiOutlineExclamationCircle size={20} /> Late
          </span>
        );
      case "Clocked Out":
        return (
          <span className="status gray">
            <LuLogOut size={20} /> Clocked Out
          </span>
        );
      case "Leave":
        return (
          <span className="status gray">
            <LuLogOut size={20} /> Leave
          </span>
        );
      default:
        return null;
    }
  };

  return (
    <div className={`team-attendance ${themeMode === "dark" ? "dark-mode" : ""}`}>
      {/* Header */}
      <div className="header">
        {/* Left Side */}
        <h3>
          <FiUsers /> Team Attendance
        </h3>

        {/* Right Side */}
        <div className="header-right">
          <div className="summary">
            <span className="badge green">{activeCount} Active</span>
            <span className="badge yellow">{breakCount} Break</span>
            <span className="badge orange">{lateCount} Late</span>
          </div>
          <div className="filters">
            <FiFilter size={22} color="gray" />
            {/* React Select with tick mark */}
            <Select
              options={teams}
              value={selectedTeam}
              onChange={setSelectedTeam}
              components={{
                Option: CustomOption,
                SingleValue: CustomSingleValue,
              }}
              styles={customStyles}
              isSearchable={false}
              className="team-select"
              classNamePrefix="react-select"
            />
          </div>
        </div>
      </div>

      {/* Employee Cards */}
      <div className="cards">
        {sortedEmployees.map((emp) => (
          <div key={emp.id} className="card">
            <div className="user-info">
              <img src={emp.avatar} alt={emp.name} className="avatar" />
              <div>
                <h4 className="employee-Name">{emp.name}</h4>
                <p className="employee-role">{emp.role}</p>
              </div>
            </div>
            <div className="emp-card">
              <div className="emp-row-top">{getStatusBadge(emp.status)}</div>
              <div className="emp-row-bottom">
                <p className="clock">Clock In: {emp.time}</p>
                <p className="type">{emp.type}</p>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default TeamAttendance;

