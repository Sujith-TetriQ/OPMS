import React, { useEffect, useState, useMemo } from "react";
import { useParams } from "react-router-dom";
import EmployeeRecordCard from "@components/EmployeeRecordCard";
import { Form, Row, Col } from "react-bootstrap";
import noDataFoundImg from "@assets/no-data-found.png";
import { useTheme } from "@context/ThemeContext";
import { useLoading } from "@context/LoadingContext";

// Import mock employees
import { mockEmployees } from "@data/mockData";

export default function FilteredEmployeeList() {
    const { filterKey } = useParams(); //  route param
    const [allEmployees, setAllEmployees] = useState([]);
    const { themeMode } = useTheme();
    const { showLoading, hideLoading } = useLoading();

    // 🔹 Filter States
    const [searchName, setSearchName] = useState("");
    const [department, setDepartment] = useState("");
    const [location, setLocation] = useState("");
    const [designation, setDesignation] = useState("");

    // 🔹 Extract unique dropdown values dynamically
    const uniqueDepartments = useMemo(() => {
        return [...new Set(mockEmployees.map((e) => e.department?.trim()))].filter(Boolean);
    }, []);

    const uniqueLocations = useMemo(() => {
        return [...new Set(mockEmployees.map((e) => e.location?.trim()))].filter(Boolean);
    }, []);

    const uniqueDesignations = useMemo(() => {
        return [...new Set(mockEmployees.map((e) => e.designation?.trim()))].filter(Boolean);
    }, []);

    // 🔹 Simulate API fetch with mock data
    useEffect(() => {
        const fetchData = async () => {
            showLoading({
                type: "spinner",
                size: "lg",
                message: "Loading employees...",
                fullScreen: true,
            });

            let filtered = [];
            switch (filterKey) {
                case "total-employees":
                    filtered = mockEmployees;
                    break;

                case "on-probation":
                    filtered = mockEmployees.filter((e) => e.status?.toLowerCase() === "on probation");
                    break;

                case "new-joiners":
                    filtered = mockEmployees.filter((e) => e.status?.toLowerCase() === "new joiner");
                    break;

                case "exit-employees":
                    filtered = mockEmployees.filter((e) => e.status?.toLowerCase() === "exited");
                    break;

                case "full-time":
                    filtered = mockEmployees.filter((e) => e.employmentType?.toLowerCase() === "full time");
                    break;

                case "contingent":
                    filtered = mockEmployees.filter((e) => e.employmentType?.toLowerCase() === "contingent");
                    break;

                case "onboarded":
                    filtered = mockEmployees.filter((e) => e.status?.toLowerCase() === "onboarded");
                    break;

                case "pending-onboarding":
                    filtered = mockEmployees.filter((e) => e.status?.toLowerCase() === "pending onboarding");
                    break;

                case "uiux":
                    filtered = mockEmployees.filter((e) => e.department?.toLowerCase().includes("ui/ux"));
                    break;

                default:
                    filtered = [];
            }

            setAllEmployees(filtered);

            //  Hide loader after 3s
            const timer = setTimeout(() => {
                hideLoading();
            }, 3000);

            //  Cleanup timer if component unmounts
            return () => clearTimeout(timer);
        };

        fetchData();
    }, [filterKey, showLoading, hideLoading]);

    // 🔹 Apply local filters
    const filteredData = useMemo(() => {
        return allEmployees.filter((emp) => {
            const matchesName = searchName
                ? (emp.firstName + " " + emp.lastName)
                    .toLowerCase()
                    .includes(searchName.toLowerCase())
                : true;

            const matchesDept = department
                ? emp.department?.toLowerCase().trim() === department.toLowerCase().trim()
                : true;

            const matchesLocation = location
                ? emp.location?.toLowerCase().trim() === location.toLowerCase().trim()
                : true;

            const matchesDesignation = designation
                ? emp.designation?.toLowerCase().trim() === designation.toLowerCase().trim()
                : true;

            return matchesName && matchesDept && matchesLocation && matchesDesignation;
        });
    }, [allEmployees, searchName, department, location, designation]);

    return (
        <div className="container">
            {/* 🔹 Filters Bar */}
            <Form
                className={`mb-3 p-3 border rounded shadow-sm mt-3 ${themeMode === "dark" ? "bg-dark text-light" : "bg-white text-dark"
                    }`}
            >
                <Row className="g-2">
                    <Col md={3} sm={6}>
                        <Form.Control
                            type="text"
                            placeholder="Search by Name"
                            value={searchName}
                            onChange={(e) => setSearchName(e.target.value)}
                            className={themeMode === "dark" ? "bg-secondary text-light" : ""}
                        />
                    </Col>

                    <Col md={3} sm={6}>
                        <Form.Select
                            value={department}
                            onChange={(e) => setDepartment(e.target.value)}
                            className={themeMode === "dark" ? "bg-secondary text-light" : ""}
                        >
                            <option value="">All Departments</option>
                            {uniqueDepartments.map((dept, idx) => (
                                <option key={idx} value={dept}>
                                    {dept}
                                </option>
                            ))}
                        </Form.Select>
                    </Col>

                    <Col md={3} sm={6}>
                        <Form.Select
                            value={location}
                            onChange={(e) => setLocation(e.target.value)}
                            className={themeMode === "dark" ? "bg-secondary text-light" : ""}
                        >
                            <option value="">All Locations</option>
                            {uniqueLocations.map((loc, idx) => (
                                <option key={idx} value={loc}>
                                    {loc}
                                </option>
                            ))}
                        </Form.Select>
                    </Col>

                    <Col md={3} sm={6}>
                        <Form.Select
                            value={designation}
                            onChange={(e) => setDesignation(e.target.value)}
                            className={themeMode === "dark" ? "bg-secondary text-light" : ""}
                        >
                            <option value="">All Designations</option>
                            {uniqueDesignations.map((desig, idx) => (
                                <option key={idx} value={desig}>
                                    {desig}
                                </option>
                            ))}
                        </Form.Select>
                    </Col>
                </Row>
            </Form>

            {/* 🔹 No Data */}
            {filteredData.length === 0 && (
                <div className="text-center my-5">
                    <img
                        src={noDataFoundImg}
                        style={{ maxWidth: "250px" }}
                        alt="no-data-found"
                    />
                    <h5 className="text-muted">No employees found for this filter.</h5>
                </div>
            )}

            {/* 🔹 Employee Cards (equal height per row) */}
            <div className="row mt-3">
                {filteredData.map((emp) => (
                    <div key={emp.id} className="col-md-4 d-flex align-items-stretch">
                        <EmployeeRecordCard employee={emp} className="w-100" />
                    </div>
                ))}
            </div>
        </div>
    );
}
