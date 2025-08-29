import React from 'react'
import { mockEmployees } from '../../data/mockData'

export default function EmployeeRecords() {
    return (
        <section className="employee-records bg-dark">
            <div className="container">
                <ul className="row" style={{listStyle: 'none'}}>
                    {mockEmployees.map(eachEmp => (
                        <li className="col-12 col-md-6 col-lg-4 mt-3">
                            <div className="employee-card shadow-sm rounded p-3">
                                <div className="profile-container">
                                    <img src={eachEmp.profileUrl || 'https://placehold.co/150x150'} className='profile-pic' alt="Employee Profile" />
                                </div>
                                <div className="employee-info">
                                    <h6>{eachEmp.displayName}</h6>
                                    <span>{eachEmp.designation}</span>
                                </div>
                            </div>
                        </li>
                    ))}
                </ul>
            </div>
        </section>
    )
}
