import React, { useEffect, useState, useMemo } from 'react';
import axios from 'axios';
import EmployeeRecordCard from '@components/EmployeeRecordCard';
import { Spinner, Form, Row, Col } from 'react-bootstrap';
import Loading from '@components/common/Loading';
import noDataFoundImg from '@assets/no-data-found.png';
import { useTheme } from '@context/ThemeContext';

export default function FilteredEmployeeList({ filterKey }) {
    const [loading, setLoading] = useState(true);
    const [allEmployees, setAllEmployees] = useState([]); // store all employees
    const { themeMode } = useTheme();

    // 🔹 Filter States
    const [searchName, setSearchName] = useState("");
    const [department, setDepartment] = useState("");
    const [location, setLocation] = useState("");
    const [designation, setDesignation] = useState("");

    // 🔹 Fetch employees once when filterKey changes
    useEffect(() => {
        async function fetchData() {
            setLoading(true);
            try {
                const response = await axios.get(
                    `https://sogo-temp-backend.onrender.com/api/employees`,
                    {
                        params: { q: filterKey }
                    }
                );
                setAllEmployees(response.data.data || []);
            } catch (err) {
                console.error("Error fetching employees:", err);
                setAllEmployees([]);
            }
            setLoading(false);
        }
        fetchData();
    }, [filterKey]);

    // 🔹 Apply filters locally
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
                ? emp.jobTitle?.toLowerCase().trim() === designation.toLowerCase().trim()
                : true;

            return matchesName && matchesDept && matchesLocation && matchesDesignation;
        });
    }, [allEmployees, searchName, department, location, designation]);


    return (
        <div>
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
                            <option value="HR">HR</option>
                            <option value="Engineering">Engineering</option>
                            <option value="Sales">Sales</option>
                            <option value="Marketing">Marketing</option>
                        </Form.Select>
                    </Col>
                    <Col md={3} sm={6}>
                        <Form.Select
                            value={location}
                            onChange={(e) => setLocation(e.target.value)}
                            className={themeMode === "dark" ? "bg-secondary text-light" : ""}
                        >
                            <option value="">All Locations</option>
                            <option value="Bangalore">Bangalore</option>
                            <option value="Hyderabad">Hyderabad</option>
                            <option value="Delhi">Delhi</option>
                            <option value="Mumbai">Mumbai</option>
                        </Form.Select>
                    </Col>
                    <Col md={3} sm={6}>
                        <Form.Select
                            value={designation}
                            onChange={(e) => setDesignation(e.target.value)}
                            className={themeMode === "dark" ? "bg-secondary text-light" : ""}
                        >
                            <option value="">All Designations</option>
                            <option value="Software Engineer">Software Engineer</option>
                            <option value="Developer">Developer</option>
                            <option value="Product Manager">Product Manager</option>
                            <option value="Intern">Intern</option>
                        </Form.Select>
                    </Col>
                </Row>
            </Form>

            {/* 🔹 Loader */}
            {loading && (
                <div className="text-center my-4">
                    {/* <Spinner animation="border" /> */}
                    <Loading type='spinner' size="lg" fullScreen message="Loading employees..." />
                </div>
            )}

            {/* 🔹 No Data */}
            {!loading && filteredData.length === 0 && (
                <div className="text-center my-5">
                    <img src={noDataFoundImg} style={{ maxWidth: "250px" }} alt="no-data-found" />
                    <h5 className="text-muted">No employees found for this filter.</h5>
                </div>
            )}

            {/* 🔹 Employee Cards */}
            <div className="row mt-3">
                {filteredData.map((emp) => (
                    <EmployeeRecordCard employee={emp} key={emp.id} />
                ))}
            </div>
        </div>
    );
}
