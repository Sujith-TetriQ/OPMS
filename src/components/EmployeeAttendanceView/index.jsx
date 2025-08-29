import React, { useState, useEffect, useMemo, useCallback, useRef } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
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
import { FaHome, FaRegFileAlt, FaUser, FaCoffee, FaEllipsisV } from 'react-icons/fa';
import { IoMdArrowRoundBack } from "react-icons/io";
import { employeeAttendanceData } from '@data/mockData';
import { Offcanvas } from 'bootstrap';
import { Dropdown } from 'react-bootstrap';
import Loading from '@components/common/Loading';
import './index.css';

export default function EmployeeAttendanceView() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { themeMode } = useTheme();

  // State variables
  const [currentTime, setCurrentTime] = useState(new Date());
  const [currentMonth, setCurrentMonth] = useState(new Date());
  const [calendarView, setCalendarView] = useState('month'); // Added state for calendar view
  const [employee, setEmployee] = useState(null);
  const [offcanvasMode, setOffcanvasMode] = useState(null);
  const [selectedDate, setSelectedDate] = useState(null);
  const offcanvasRef = useRef(null);

  const todayIndex = getDay(currentTime);
  const weekDays = ['S', 'M', 'T', 'W', 'T', 'F', 'S'];

  // Initialize Bootstrap Offcanvas
  useEffect(() => {
    if (offcanvasRef.current) {
      // eslint-disable-next-line no-unused-vars
      const offcanvasInstance = new Offcanvas(offcanvasRef.current);
    }
  }, []);

  // Attendance status definitions
  const attendanceStatuses = useMemo(() => [
    { status: 'On Time', text: 'Present' },
    { status: 'Late', text: 'Late' },
    { status: 'Leave', text: 'Leave' },
    { status: 'WFH', text: 'Work From Home' },
    { status: 'Absent', text: 'Absent' },
    { status: 'CompOff', text: 'Comp Off' },
    { status: 'Weekend', text: 'Weekend' },
    { status: 'Holiday', text: 'Holiday' },
  ], []);

  /**
   * Finds the employee based on URL parameter `id`.
   */
  useEffect(() => {
    const foundEmployee = employeeAttendanceData.find(
      (emp) => emp.employeeId === parseInt(id, 10)
    );
    if (foundEmployee) {
      setEmployee(foundEmployee);
    } else {
      console.error(`Employee with ID ${id} not found.`);
    }
  }, [id]);

  /**
   * Updates current time every second for live clock.
   */
  useEffect(() => {
    const interval = setInterval(() => setCurrentTime(new Date()), 1000);
    return () => clearInterval(interval);
  }, []);

  /**
   * Returns badge class and display text based on attendance status.
   * @param {string} status
   */
  const getStatusInfo = useCallback((status) => {
    switch (status) {
      case 'On Time': return { text: 'Present', class: 'status-on-time badge-success' };
      case 'Late': return { text: 'Late', class: 'status-late badge-warning' };
      case 'Leave': return { text: 'Leave', class: 'status-leave badge-info' };
      case 'WFH': return { text: 'WFH', class: 'status-wfh badge-primary' };
      case 'Absent': return { text: 'Absent', class: 'status-absent badge-danger' };
      case 'Comp Off': return { text: 'Comp Off', class: 'status-compoff badge-purple' }; // <-- Fixed
      case 'Weekend': return { text: 'Weekend', class: 'status-weekend' };
      case 'Holiday': return { text: 'Holiday', class: 'status-holiday badge-secondary' };
      default: return { text: 'None', class: '' };
    }
  }, []);

  /**
   * Adds class names for calendar tiles based on attendance status.
   */
  const tileClassName = ({ date, view }) => {
    if (view !== 'month' || !employee) return '';

    const dayLog = employee.attendanceLogs.find(log => isSameDay(parseISO(log.date), date));
    const status = dayLog
      ? dayLog.status
      : (getDay(date) === 0 || getDay(date) === 6 ? 'Weekend' : 'None');

    const { class: statusClass } = getStatusInfo(status);
    const todayClass = isSameDay(date, currentTime) ? ' react-calendar__tile--today' : '';
    return `${statusClass}${todayClass}`;
  };

  /**
   * Adds content (status text) to calendar tiles.
   */
  const tileContent = ({ date, view }) => {
    if (view !== 'month' || !employee) return null;

    const dayLog = employee.attendanceLogs.find(log => isSameDay(parseISO(log.date), date));
    const status = dayLog
      ? dayLog.status
      : (getDay(date) === 0 || getDay(date) === 6 ? 'Weekend' : null);

    if (!status) return null;

    const { text: statusText } = getStatusInfo(status);
    if (statusText === 'None') return null;

    return (
      <small className={`calendar-status-text text-truncate ${status === 'Weekend' || status === 'Holiday' ? 'text-muted' : ''}`}>
        {statusText}
      </small>
    );
  };

  /**
   * Returns attendance logs for the currently selected month.
   */
  const currentMonthLogs = useMemo(() => {
    if (!employee) return [];
    return employee.attendanceLogs
      .filter(log => isSameMonth(parseISO(log.date), currentMonth))
      .sort((a, b) => parseISO(a.date).getTime() - parseISO(b.date).getTime());
  }, [employee, currentMonth]);

  if (!employee) {
    return (
      <div className={`admin-attendance py-5 text-center ${themeMode}`}>
        <Loading type='spinner' />
      </div>
    );
  }

  return (
    <div className={`admin-attendance py-3 ${themeMode}`}>
      <div className="container">

        {/* Employee Header */}
        <div className="d-flex justify-content-between align-items-center">
          <h3 className={`mb-4 ${themeMode === 'dark' ? 'text-light' : 'text-dark'}`}>
            Attendance for {employee.firstName} {employee.lastName} ({employee.employeeId})
          </h3>
          <button className="border-0 bg-transparent" title='Go Back' onClick={() => navigate("/admin/attendance")}>
            <IoMdArrowRoundBack size={30} className={`mb-3 bg-${themeMode}-two p-1 rounded-5`} />
          </button>
        </div>

        {/* Stat Cards */}
        <div className="row g-4">
          {/* Monthly Attendance Summary */}
          <div className="col-12 col-md-6 col-lg-4">
            <div className="card attendance-card shadow-sm h-100">
              <div className="card-body d-flex flex-column justify-content-between h-100">
                <div>
                  <div className="d-flex justify-content-between align-items-center mb-3">
                    <h6 className="card-title mb-0">Monthly Attendance Summary</h6>
                    <small className="text-muted">{format(currentMonth, 'MMMM')}</small>
                  </div>
                  <div className="d-flex flex-column gap-3">
                    {['On Time', 'Late', 'Leave', 'CompOff'].map(statusKey => (
                      <div key={statusKey} className="d-flex justify-content-between align-items-center">
                        <div className="d-flex align-items-center gap-2">
                          <span className={`badge p-2 rounded-circle ${statusKey === 'On Time' ? 'bg-success-subtle text-success' :
                            statusKey === 'Late' ? 'bg-warning-subtle text-warning' :
                              statusKey === 'Leave' ? 'bg-info-subtle text-info' :
                                'bg-purple-subtle text-purple'
                            }`}>
                            {statusKey === 'On Time' ? <FaUser /> :
                              statusKey === 'Late' ? <FaRegFileAlt /> :
                                statusKey === 'Leave' ? <FaHome /> : <FaUser />}
                          </span>
                          <strong>{getStatusInfo(statusKey).text}</strong>
                        </div>
                        <span className="fw-bold">{currentMonthLogs.filter(log => log.status === statusKey).length}</span>
                      </div>
                    ))}
                  </div>
                </div>
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

          {/* Action Cards */}
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

        {/* Attendance Calendar */}
        <div className="card shadow-sm mt-4 calendar-grid-container">
          <div className="card-body">
            <div className="mb-3 d-flex justify-content-between align-items-center">
              <h5 className="mb-0 card-title">Attendance Overview</h5>
              <span className="text-muted small">{format(currentMonth, 'MMMM yyyy')}</span>
            </div>
            <Calendar
              onChange={date => {
                setCurrentMonth(date);
                setCalendarView('month');
              }}
              value={currentMonth}
              view={calendarView} // Use the new state variable
              onViewChange={({ view }) => setCalendarView(view)} // Update state on view change
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
                    <th>Action</th>
                  </tr>
                </thead>
                <tbody>
                  {currentMonthLogs.length === 0 ? (
                    <tr>
                      <td colSpan="7" className="text-center py-4">No attendance logs for this month.</td>
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
                        <td>
                          <Dropdown>
                            <Dropdown.Toggle variant="link" className={`p-0 action-dropdown bg-${themeMode}-two`}>
                              <FaEllipsisV />
                            </Dropdown.Toggle>
                            <Dropdown.Menu className={`bg-${themeMode}-one table-dropdown-menu`}>
                              <Dropdown.Item
                                className={`table-dropdown-item`}
                                onClick={() => {
                                  setOffcanvasMode('regularize');
                                  setSelectedDate(log.date);
                                  new Offcanvas(offcanvasRef.current).show();
                                }}
                              >
                                Regularize
                              </Dropdown.Item>
                              <Dropdown.Item
                                className={`table-dropdown-item mt-1`}
                                onClick={() => {
                                  setOffcanvasMode('leave');
                                  setSelectedDate(log.date);
                                  new Offcanvas(offcanvasRef.current).show();
                                }}
                              >
                                Apply for Leave
                              </Dropdown.Item>
                            </Dropdown.Menu>
                          </Dropdown>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>

      {/* Work From Home Offcanvas */}
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

      {/* Action Offcanvas */}
      <div
        className={`offcanvas offcanvas-end ${themeMode === 'dark' ? 'text-bg-dark' : ''}`}
        tabIndex="-1"
        id="actionOffcanvas"
        aria-labelledby="actionOffcanvasLabel"
        ref={offcanvasRef}
      >
        <div className="offcanvas-header">
          <h5 className="offcanvas-title" id="actionOffcanvasLabel">
            {offcanvasMode === 'regularize' ? 'Regularize Attendance' : 'Apply for Leave'}
          </h5>
          <button type="button" className="btn-close text-reset" data-bs-dismiss="offcanvas" aria-label="Close"></button>
        </div>
        <div className="offcanvas-body">
          {selectedDate && (
            <form>
              {/* Display Selected Date */}
              <div className="mb-3">
                <label className="form-label">Date</label>
                <input type="text" className="form-control" value={format(parseISO(selectedDate), 'dd MMM yyyy')} disabled />
              </div>

              {/* Regularize Attendance Form */}
              {offcanvasMode === 'regularize' && (
                <div className="mb-3">
                  <label className="form-label">Note</label>
                  <textarea className="form-control" rows="3" placeholder="Add note for regularization..."></textarea>
                </div>
              )}

              {/* Apply for Leave Form */}
              {offcanvasMode === 'leave' && (
                <>
                  <div className="mb-3">
                    <label className="form-label">Type of Leave</label>
                    <select className={`form-select bg-${themeMode}-two`}>
                      <option value="">Select</option>
                      <option value="sick">Sick Leave</option>
                      <option value="casual">Casual Leave</option>
                      <option value="earned">Earned Leave</option>
                    </select>
                  </div>
                  <div className="mb-3">
                    <label className="form-label">Note</label>
                    <textarea className="form-control" rows="3" placeholder="Add reason for leave..."></textarea>
                  </div>
                </>
              )}

              <Button variant="solid" size="sm" label="Submit" type="submit" />
            </form>
          )}
        </div>
      </div>
    </div>
  );
}