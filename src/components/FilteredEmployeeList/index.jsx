import React, { useEffect, useState } from 'react';
import axios from 'axios';
import EmployeeRecordCard from '@components/EmployeeRecordCard'; // assume reusable card
import { Spinner } from 'react-bootstrap';
import noDataFoundImg from '@assets/no-data-found.png';

export default function FilteredEmployeeList({ filterKey }) {
    const [loading, setLoading] = useState(true);
    const [filteredData, setFilteredData] = useState([]);

    useEffect(() => {
        async function fetchData() {
            setLoading(true);
            try {
                const response = await axios.get(`https://sogo-temp-backend.onrender.com/api/employees?q=${filterKey}`);
                setFilteredData(response.data.data);
            } catch (err) {
                console.error("Error fetching filtered employees:", err);
            }
            setLoading(false);
        }
        fetchData();
    }, [filterKey]);

    if (loading) return <div className="text-center my-4"><Spinner animation="border" /></div>;

    if (filteredData.length === 0) {
        return (
            <div className="text-center my-5">
                <img src={noDataFoundImg} style={{maxWidth: '250px'}} alt="no-data-found" />
                <h5 className="text-muted">No employees found for this filter.</h5>
            </div>
        );
    }

    return (
        <div className="row mt-3">
            {filteredData.map(emp => (
                <EmployeeRecordCard employee={emp} key={emp.id}/>
            ))}
        </div>
    );
}
