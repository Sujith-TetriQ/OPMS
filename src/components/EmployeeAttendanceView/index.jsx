import React, { useState, useEffect, useMemo, useCallback, useRef } from 'react';
import { useParams } from 'react-router-dom';
import Calendar from 'react-calendar';
import Button from '@components/common/Button';
import {
  format,
  isSameMonth,
  isSameDay,
  parseISO,
  getDay,
} from 'date-fns';
import { useTheme } from '@context/ThemeContext';
import { FaHome, FaRegFileAlt, FaUser, FaCoffee } from 'react-icons/fa';
import { employeeAttendanceData } from '@data/mockData';
import { Offcanvas } from 'bootstrap';
import './index.css';

export default function EmployeeAttendanceView() {
  const { id } = useParams();
  const { themeMode } = useTheme();
  const [currentTime, setCurrentTime] = useState(new Date());
  const [currentMonth, setCurrentMonth] = useState(new Date());
  const [employee, setEmployee] = useState(null);
  const offcanvasRef = useRef(null); // Ref for the offcanvas element
  const todayIndex = getDay(currentTime);
  const weekDays = ['S', 'M', 'T', 'W', 'T', 'F', 'S'];

  // Manually initialize the offcanvas using a ref
  useEffect(() => {
    if (offcanvasRef.current) {
      // eslint-disable-next-line no-unused-vars
      const offcanvas = new Offcanvas(offcanvasRef.current);
    }
  }, []);

  const attendanceStatuses = useMemo(() => [
    { status: 'On Time', text: 'Present' },
    { status: 'Late', text: 'Late' },
    { status: 'Leave', text: 'Leave' },
    { status: 'WFH', text: 'Work From Home' },
    { status: 'Absent', text: 'Absent' },
    { status: 'Weekend', text: 'Weekend' },
  ], []);

  useEffect(() => {
    const foundEmployee = employeeAttendanceData.find(emp => emp.employeeId === id);
    if (foundEmployee) {
      setEmployee(foundEmployee);
    } else {
      console.error(`Employee with ID ${id} not found.`);
    }
  }, [id]);

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentTime(new Date());
    }, 1000);
    return () => clearInterval(interval);
  }, []);

  const getStatusInfo = useCallback((logStatus) => {
    switch (logStatus) {
      case 'On Time':
        return { text: 'Present', class: 'status-OnTime badge-success' };
      case 'Late':
        return { text: 'Late', class: 'status-Late badge-warning' };
      case 'Leave':
        return { text: 'Leave', class: 'status-Leave badge-info' };
      case 'WFH':
        return { text: 'WFH', class: 'status-WFH badge-primary' };
      case 'Absent':
        return { text: 'Absent', class: 'status-Absent badge-danger' };
      case 'Weekend':
        return { text: 'Weekend', class: 'status-Weekend' };
      default:
        return { text: 'None', class: 'status-None' };
    }
  }, []);

  const tileClassName = ({ date, view }) => {
    if (view === 'month' && employee) {
      const dayLog = employee.attendanceLogs.find(log => isSameDay(parseISO(log.date), date));
      const status = dayLog ? dayLog.status : (getDay(date) === 0 || getDay(date) === 6 ? 'Weekend' : 'None');
      const { class: statusClass } = getStatusInfo(status);

      const isCurrentDay = isSameDay(date, currentTime);
      const todayClass = isCurrentDay ? ' react-calendar__tile--today' : '';

      return `${statusClass} ${todayClass}`;
    }
  };

  const tileContent = ({ date, view }) => {
    if (view === 'month' && employee) {
      const dayLog = employee.attendanceLogs.find(log => isSameDay(parseISO(log.date), date));
      const status = dayLog ? dayLog.status : (getDay(date) === 0 || getDay(date) === 6 ? 'Weekend' : null);
      const { text: statusText } = getStatusInfo(status);

      if (status && statusText !== 'None') {
        return (
          <small className={`calendar-status-text text-truncate ${status === 'Weekend' ? 'text-muted' : ''}`}>
            {statusText}
          </small>
        );
      }
    }
    return null;
  };

  const currentMonthLogs = useMemo(() => {
    if (!employee) return [];
    return employee.attendanceLogs
      .filter(log => isSameMonth(parseISO(log.date), currentMonth))
      .sort((a, b) => parseISO(a.date).getTime() - parseISO(b.date).getTime());
  }, [employee, currentMonth]);

  if (!employee) {
    return (
      <div className={`admin-attendance py-5 text-center ${themeMode}`}>
        <p>Loading employee data...</p>
      </div>
    );
  }

  return (
    <div className={`admin-attendance py-3 ${themeMode}`}>
      <div className="container">
        {/* Employee Name Header */}
        <h3 className={`mb-4 ${themeMode === 'dark' ? 'text-light' : 'text-dark'}`}>
          Attendance for {employee.firstName} {employee.lastName} ({employee.employeeId})
        </h3>
        {/* ... (existing stat cards and timings card) */}
        <div className="row g-4">

          {/* Final Monthly Attendance Summary with Note */}
          <div className="col-12 col-md-6 col-lg-4">
            <div className="card attendance-card shadow-sm h-100">
              <div className="card-body d-flex flex-column justify-content-between h-100">
                <div>
                  <div className="d-flex justify-content-between align-items-center mb-3">
                    <h6 className="card-title mb-0">Monthly Attendance Summary</h6>
                    <small className="text-muted">{format(currentMonth, 'MMMM')}</small>
                  </div>
                  <div className="d-flex flex-column gap-3">
                    <div className="d-flex justify-content-between align-items-center">
                      <div className="d-flex align-items-center gap-2">
                        <span className="badge bg-success-subtle text-success p-2 rounded-circle">
                          <FaUser />
                        </span>
                        <strong>No. of Days On Time</strong>
                      </div>
                      <span className="fw-bold">{currentMonthLogs.filter(log => log.status === 'On Time').length}</span>
                    </div>
                    <div className="d-flex justify-content-between align-items-center">
                      <div className="d-flex align-items-center gap-2">
                        <span className="badge bg-warning-subtle text-warning p-2 rounded-circle">
                          <FaRegFileAlt />
                        </span>
                        <strong>Late Arrivals</strong>
                      </div>
                      <span className="fw-bold">{currentMonthLogs.filter(log => log.status === 'Late').length}</span>
                    </div>
                    <div className="d-flex justify-content-between align-items-center">
                      <div className="d-flex align-items-center gap-2">
                        <span className="badge bg-info-subtle text-info p-2 rounded-circle">
                          <FaHome />
                        </span>
                        <strong>Leaves</strong>
                      </div>
                      <span className="fw-bold">{currentMonthLogs.filter(log => log.status === 'Leave').length}</span>
                    </div>
                  </div>
                </div>

                {/* Bottom Note */}
                <hr className="my-3" />
                <p className="small text-muted mb-0">
                  Note: Monthly summary is based on current logs visible in the calendar view.
                </p>
              </div>
            </div>
          </div>

          {/* Timings Overview */}
          <div className="col-12 col-md-6 col-lg-4">
            <div className="card timings-card shadow-sm h-100">
              <div className="card-body">
                <h6 className="card-title mb-3">Timings Overview</h6>
                <div className="d-flex justify-content-start gap-2 mb-3">
                  {weekDays.map((day, idx) => (
                    <span
                      key={idx}
                      className={`badge rounded-circle ${todayIndex === idx ? 'bg-info text-white' : 'bg-light text-muted'}`}
                      style={{ width: 30, height: 30, display: 'flex', alignItems: 'center', justifyContent: 'center' }}
                    >
                      {day}
                    </span>
                  ))}
                </div>
                <p className="small mb-2">Standard (9:00 AM - 6:00 PM)</p>
                <div className="progress" style={{ height: '10px' }}>
                  <div className="progress-bar bg-primary" style={{ width: '40%' }} title="Expected Work" />
                  <div className="progress-bar bg-secondary" style={{ width: '20%' }} title="Actual Overtime" />
                  <div className="progress-bar bg-primary" style={{ width: '40%' }} title="Expected Work" />
                </div>
                <div className="d-flex justify-content-between small mt-1">
                  <span>Standard: 9h 0m</span>
                  <span><FaCoffee /> Break: 60 min</span>
                </div>
                <hr className="my-3" />
                <p className="small text-muted mb-2">Note: Actual daily timings are shown in the logs below.</p>
              </div>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="col-12 col-lg-4">
            <div className="card actions-card shadow-sm h-100">
              <div className="card-body text-center d-flex flex-column justify-content-center">
                <div>
                  <h2 className="mb-0" style={{ fontSize: '30px' }}>{format(currentTime, 'hh:mm:ss a')}</h2>
                  <p className={`${themeMode === 'dark' ? 'text-light-muted' : 'text-muted'}`}>{format(currentTime, 'EEE, dd MMM yyyy')}</p>
                </div>
                <div className="d-flex flex-column gap-2 mt-3">
                  <button
                    className={`btn btn-link ${themeMode === 'dark' ? 'text-light' : 'text-danger'} d-flex align-items-center gap-2 justify-content-center`}
                    type="button"
                    data-bs-toggle="offcanvas"
                    data-bs-target="#wfhOffcanvas"
                    aria-controls="wfhOffcanvas"
                  >
                    <FaHome size={16} /> Request Work From Home
                  </button>
                  <button className={`btn btn-link ${themeMode === 'dark' ? 'text-light' : 'text-danger'} d-flex align-items-center gap-2 justify-content-center`}>
                    <FaRegFileAlt size={16} /> View Leave Requests
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>


        {/* Attendance Calendar Grid with react-calendar */}
        <div className="card shadow-sm mt-4 calendar-grid-container">
          <div className="card-body">
            <div className="mb-3 d-flex justify-content-between align-items-center">
              <h5 className="mb-0 card-title">Attendance Overview</h5>
              <span className="text-muted small">{format(currentMonth, 'MMMM yyyy')}</span>
            </div>
            <Calendar
              onChange={setCurrentMonth}
              value={currentMonth}
              view="month"
              tileClassName={tileClassName}
              tileContent={tileContent}
              onActiveStartDateChange={({ activeStartDate }) => setCurrentMonth(activeStartDate)}
              next2Label={null}
              prev2Label={null}
              className={`react-calendar ${themeMode}`}
            />
            {/* Calendar Legend */}
            <div className="calendar-legend mt-4 pt-3 border-top">
              <div className="legend-items">
                {attendanceStatuses.map((item, index) => (
                  <div key={index} className="legend-item">
                    <span className={`legend-color-box ${getStatusInfo(item.status).class}`}></span>
                    <span className="legend-text">{item.text}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Logs Table */}
        <div className="card shadow-sm mt-4 logs-table-container">
          <div className="card-header bg-transparent pb-0">
            <h5 className="mb-3 card-title">Attendance Logs for {format(currentMonth, 'MMMM yyyy')}</h5>
          </div>
          <div className="card-body p-0">
            <div className="table-responsive">
              <table className={`table table-hover mb-0 ${themeMode === 'dark' ? 'table-dark' : ''}`}>
                <thead>
                  <tr>
                    <th>Date</th>
                    <th>Status</th>
                    <th>Check-in</th>
                    <th>Check-out</th>
                    <th>Work Duration</th>
                    <th>Remarks</th>
                  </tr>
                </thead>
                <tbody>
                  {currentMonthLogs.length === 0 ? (
                    <tr>
                      <td colSpan="6" className="text-center py-4">No attendance logs for this month.</td>
                    </tr>
                  ) : (
                    currentMonthLogs.map((log, index) => (
                      <tr key={index}>
                        <td>{format(parseISO(log.date), 'dd MMM yyyy')}</td>
                        <td>
                          <span className={`badge ${getStatusInfo(log.status).class}`}>
                            {getStatusInfo(log.status).text}
                          </span>
                        </td>
                        <td>{log.checkIn || 'N/A'}</td>
                        <td>{log.checkOut || 'N/A'}</td>
                        <td>{log.workDuration || 'N/A'}</td>
                        <td>{log.remarks || 'N/A'}</td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>

      {/* Bootstrap Offcanvas */}
      <div
        className={`offcanvas offcanvas-end ${themeMode === 'dark' ? 'text-bg-dark' : ''}`}
        tabIndex="-1"
        id="wfhOffcanvas"
        aria-labelledby="wfhOffcanvasLabel"
        ref={offcanvasRef}
      >
        <div className="offcanvas-header">
          <h5 className="offcanvas-title" id="wfhOffcanvasLabel">Request Work From Home</h5>
          <button type="button" className="btn-close text-reset" data-bs-dismiss="offcanvas" aria-label="Close"></button>
        </div>
        <div className="offcanvas-body">
          <form>
            <div className="mb-3">
              <label htmlFor="wfhDate" className="form-label">Date</label>
              <input type="date" className="form-control" id="wfhDate" />
            </div>
            <div className="mb-3">
              <label htmlFor="doc" className='form-label'>Document</label>
              <input type="file" className='form-control' id='doc' />
            </div>
            <div className="mb-3">
              <label htmlFor="wfhReason" className="form-label">Reason</label>
              <textarea className="form-control" id="wfhReason" rows="3"></textarea>
            </div>
            <Button variant='solid' size='sm' label={'Submit Request'} type='submit' />
          </form>
        </div>
      </div>
    </div>
  );
}