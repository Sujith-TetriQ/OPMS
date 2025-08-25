import React, { useState, useEffect, useRef, useMemo, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { useTheme } from '@context/ThemeContext';
import Select from 'react-select';
import DatePicker from 'react-datepicker';
import { employeeAttendanceData } from '@data/mockData';
import './admin.css';

// Import date-fns functions
import {
  format,
  isSameDay,
  isWithinInterval,
  getDay,
  parseISO,
  parse,
  startOfDay,
  endOfDay,
  subDays,
  startOfToday,
} from 'date-fns';

// Import React Icons
import { FaEllipsisV, FaUserSlash, FaUserCheck, FaTrashAlt, FaMapMarkerAlt } from 'react-icons/fa';

// Import the common Button component
import Button from '@components/common/Button';

// Utility function to get dates for a given period
const getPeriodDates = (period) => {
  const today = new Date();
  switch (period) {
    case '30days':
      return {
        startDate: subDays(startOfToday(), 29),
        endDate: endOfDay(today),
      };
    case 'last3months':
      const threeMonthsAgo = subDays(startOfToday(), 90);
      return {
        startDate: threeMonthsAgo,
        endDate: endOfDay(today),
      };
    case 'custom':
    default:
      // For custom, return null to allow the user to select
      return {
        startDate: null,
        endDate: null,
      };
  }
};

const AdminAttendance = () => {
  const navigate = useNavigate();
  const { themeMode } = useTheme();

  // State for attendance summary statistics for "Today"
  const [attendanceSummary, setAttendanceSummary] = useState({
    totalEmployees: 0,
    present: 0,
    late: 0,
    onLeave: 0,
    absent: 0,
  });

  // State for the full list of employees after initial processing
  const [allAttendanceRecords, setAllAttendanceRecords] = useState([]);

  // Filter states, setting default to '30days'
  const [activeFilter, setActiveFilter] = useState('30days');
  const [departmentFilter, setDepartmentFilter] = useState(null);
  const [locationFilter, setLocationFilter] = useState(null);
  const [searchName, setSearchName] = useState('');
  // Set initial dates to the '30days' period
  const initialDates = getPeriodDates('30days');
  const [startDate, setStartDate] = useState(initialDates.startDate);
  const [endDate, setEndDate] = useState(initialDates.endDate);

  // Pagination states
  const [filteredLogs, setFilteredLogs] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [employeesPerPage, setEmployeesPerPage] = useState(10);
  const [rowsPerPageOptions] = useState([10, 20, 50, 100]);

  // State for popover and geolocation modal
  const [popoverOpen, setPopoverOpen] = useState(false);
  const [popoverPosition, setPopoverPosition] = useState({ top: 0, left: 0 });
  const [selectedEmployeeForPopover, setSelectedEmployeeForPopover] = useState(null);
  const popoverRef = useRef(null);

  const [showGeoModal, setShowGeoModal] = useState(false);
  const [selectedGeoLocation, setSelectedGeoLocation] = useState(null);
  const [selectedGeoEmployeeName, setSelectedGeoEmployeeName] = useState('');
  const [selectedGeoDate, setSelectedGeoDate] = useState('');

  // State to manage employee active/inactive status
  const [activeEmployees, setActiveEmployees] = useState(
    new Map(employeeAttendanceData.map(emp => [emp.employeeId, true]))
  );

  // Memoized list of unique departments and locations for the select dropdowns
  const departmentOptions = useMemo(() => {
    return Array.from(new Set(employeeAttendanceData.map(emp => emp.department)))
      .map(dept => ({ value: dept, label: dept }));
  }, []);

  const locationOptions = useMemo(() => {
    return Array.from(new Set(employeeAttendanceData.map(emp => emp.officeLocation)))
      .map(loc => ({ value: loc, label: loc }));
  }, []);

  // Helper function to format date for display
  const formatDisplayDate = useCallback((date) => {
    if (!date) return 'N/A';
    return format(date, 'MMMM dd, yyyy');
  }, []);

  // Helper to check if check-in time is late
  const isLate = useCallback((checkInTime) => {
    if (!checkInTime) return false;
    const lateCutoff = parse('09:10:00', 'HH:mm:ss', new Date());
    const checkInDateTime = parse(checkInTime, 'HH:mm:ss', new Date());
    return checkInDateTime > lateCutoff;
  }, []);

  // Helper to check for weekend
  const isWeekend = useCallback((date) => {
    const day = getDay(date);
    return day === 0 || day === 6; // Sunday (0) or Saturday (6)
  }, []);

  // Effect to calculate summary statistics for 'today' and initialize the full attendance records
  useEffect(() => {
    let presentCount = 0;
    let lateCount = 0;
    let onLeaveCount = 0;
    let absentCount = 0;
    const today = new Date();

    const processedAttendance = employeeAttendanceData.flatMap(employee => {
      const todayLog = employee.attendanceLogs.find(log =>
        isSameDay(parseISO(log.date), today)
      );

      // Generate a synthetic 'Absent' log for today if one doesn't exist and it's not a weekend
      if (!todayLog && !isWeekend(today)) {
        absentCount++;
        return {
          employeeName: `${employee.firstName} ${employee.lastName}`,
          employeeId: employee.employeeId,
          designation: employee.designation,
          department: employee.department,
          officeLocation: employee.officeLocation,
          log: {
            date: format(today, 'yyyy-MM-dd'),
            status: 'Absent',
            checkIn: null,
            checkOut: null,
            workDuration: null,
            leaveType: null,
            remarks: 'Auto-marked Absent',
            geoLocation: null
          },
        };
      }

      // Count stats for today's logs
      if (todayLog) {
        if (todayLog.status === 'On Time') {
          if (isLate(todayLog.checkIn)) {
            lateCount++;
          } else {
            presentCount++;
          }
        } else if (todayLog.status === 'Late') {
          lateCount++;
        } else if (todayLog.status === 'Leave') {
          onLeaveCount++;
        }
      }

      // Flatten all logs from the original data for filtering
      return employee.attendanceLogs.map(log => ({
        employeeName: `${employee.firstName} ${employee.lastName}`,
        employeeId: employee.employeeId,
        designation: employee.designation,
        department: employee.department,
        officeLocation: employee.officeLocation,
        log: log,
      }));
    });

    // Update the summary statistics
    setAttendanceSummary({
      totalEmployees: employeeAttendanceData.length,
      present: presentCount,
      late: lateCount,
      onLeave: onLeaveCount,
      absent: absentCount,
    });

    // Store all processed records for filtering
    setAllAttendanceRecords(processedAttendance);
  }, [isWeekend, isLate]);

  // Effect to apply all filters and sort the results
  useEffect(() => {
    let tempFilteredLogs = allAttendanceRecords;

    // Apply date range filter first
    tempFilteredLogs = tempFilteredLogs.filter(record => {
      // Check if both start and end dates are selected before filtering
      if (!startDate || !endDate) return true;
      const logDate = parseISO(record.log.date);
      return isWithinInterval(logDate, { start: startOfDay(startDate), end: endOfDay(endDate) });
    });

    // Apply other custom filters
    if (departmentFilter) {
      tempFilteredLogs = tempFilteredLogs.filter(record =>
        record.department === departmentFilter.value
      );
    }

    if (locationFilter) {
      tempFilteredLogs = tempFilteredLogs.filter(record =>
        record.officeLocation === locationFilter.value
      );
    }

    if (searchName) {
      tempFilteredLogs = tempFilteredLogs.filter(record =>
        record.employeeName.toLowerCase().includes(searchName.toLowerCase()) ||
        record.employeeId.toLowerCase().includes(searchName.toLowerCase())
      );
    }

    // Sort by date, then by employee name
    tempFilteredLogs.sort((a, b) => {
      const dateA = parseISO(a.log.date);
      const dateB = parseISO(b.log.date);
      if (dateA > dateB) return 1;
      if (dateA < dateB) return -1;
      return a.employeeName.localeCompare(b.employeeName);
    });

    setFilteredLogs(tempFilteredLogs);
    setCurrentPage(1); // Reset to first page whenever filters change
  }, [allAttendanceRecords, departmentFilter, locationFilter, searchName, startDate, endDate]);

  // Handle period filter clicks (e.g., 'Last 30 Days')
  const handlePeriodFilter = useCallback((period) => {
    setActiveFilter(period);
    const { startDate, endDate } = getPeriodDates(period);
    setStartDate(startDate);
    setEndDate(endDate);
  }, []);

  // Handler for the date range picker
  const handleDateRangeChange = (update) => {
    const [start, end] = update;
    setStartDate(start);
    setEndDate(end);
    setActiveFilter('custom'); // Set filter to custom when a date range is selected
  };

  // Calculate total pages for pagination
  const totalPages = useMemo(() => {
    return Math.ceil(filteredLogs.length / employeesPerPage);
  }, [filteredLogs, employeesPerPage]);

  // Get current employees for the visible page
  const currentEmployeesForTable = useMemo(() => {
    const indexOfLastEmployee = currentPage * employeesPerPage;
    const indexOfFirstEmployee = indexOfLastEmployee - employeesPerPage;
    return filteredLogs.slice(indexOfFirstEmployee, indexOfLastEmployee);
  }, [currentPage, employeesPerPage, filteredLogs]);

  // Handle a row click to navigate to a detailed view
  const handleRowClick = useCallback((employeeId) => {
    navigate(`/admin/attendance/${employeeId}`);
  }, [navigate]);

  // Toggle popover for three dots menu
  const togglePopover = useCallback((event, employee) => {
    event.stopPropagation();
    const rect = event.currentTarget.getBoundingClientRect();
    setPopoverPosition({
      top: rect.bottom + window.scrollY + 5,
      left: rect.left + window.scrollX,
    });
    setSelectedEmployeeForPopover(employee);
    setPopoverOpen(prev => !prev);
  }, []);

  // Close popover when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (popoverRef.current && !popoverRef.current.contains(event.target)) {
        setPopoverOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  // Handle popover option clicks
  const handlePopoverOptionClick = useCallback((option, employee) => {
    setPopoverOpen(false);
    if (option === 'toggleActive') {
      setActiveEmployees(prev => {
        const newMap = new Map(prev);
        newMap.set(employee.employeeId, !newMap.get(employee.employeeId));
        return newMap;
      });
      alert(`Employee ${employee.employeeName} status updated!`);
    } else if (option === 'delete') {
      if (window.confirm(`Are you sure you want to delete ${employee.employeeName}? This action cannot be undone.`)) {
        alert(`Employee ${employee.employeeName} deleted! (This is a mock action)`);
      }
    } else {
      alert(`Option "${option}" clicked for ${employee.employeeName}`);
    }
  }, []);

  // Show geolocation modal
  const handleViewGeoLocation = useCallback((event, log, employeeName, employeeId) => {
    event.stopPropagation();
    const employeeData = employeeAttendanceData.find(emp => emp.employeeId === employeeId);
    if (!employeeData) return;
    const currentLog = employeeData.attendanceLogs.find(l => isSameDay(parseISO(l.date), parseISO(log.date)));

    if (currentLog && currentLog.geoLocation) {
      setSelectedGeoLocation(currentLog.geoLocation);
      setSelectedGeoEmployeeName(employeeName);
      setSelectedGeoDate(currentLog.date);
      setShowGeoModal(true);
    } else {
      alert("No geolocation data available for this entry.");
    }
  }, []);


  // Function to render the Google Map (mock representation)
  const renderGoogleMap = useCallback((location) => {
    if (!location) return <p>No geolocation data available.</p>;
    const mapUrl = `https://maps.google.com/?q=${location.lat},${location.lng}`;
    return (
      <div>
        <p className={themeMode === 'dark' ? 'text-light-muted' : 'text-muted'}>
          Latitude: {location.lat}, Longitude: {location.lng}
        </p>
        <div style={{ height: '300px', width: '100%', backgroundColor: '#e0e0e0', display: 'flex', justifyContent: 'center', alignItems: 'center', borderRadius: '8px' }}>
          <a href={mapUrl} target="_blank" rel="noopener noreferrer" className="btn btn-sm btn-info">
            View on Google Maps
          </a>
        </div>
        <p className={`mt-2 ${themeMode === 'dark' ? 'text-light-muted' : 'text-muted'}`}>
          (Actual map integration requires Google Maps API. This is a placeholder.)
        </p>
      </div>
    );
  }, [themeMode]);

  // Change page handler for pagination
  const paginate = useCallback((pageNumber) => setCurrentPage(pageNumber), []);

  // Render pagination buttons
  const renderPaginationButtons = useCallback(() => {
    const pageNumbers = [];
    for (let i = 1; i <= totalPages; i++) {
      pageNumbers.push(i);
    }

    return (
      <nav aria-label="Page navigation">
        <ul className="pagination justify-content-end custom-pagination">
          <li className={`page-item ${currentPage === 1 ? 'disabled' : ''}`}>
            <Button variant='solid' size='sm' onClick={() => paginate(currentPage - 1)} disabled={currentPage === 1} label={'Previous'} />
          </li>
          {pageNumbers.map((number) => (
            <li key={number} className={`page-item ${currentPage === number ? 'active' : ''}`}>
              <Button variant='outline' size='sm' onClick={() => paginate(number)} label={number} />
            </li>
          ))}
          <li className={`page-item ${currentPage === totalPages ? 'disabled' : ''}`}>
            <Button variant='solid' size='sm' onClick={() => paginate(currentPage + 1)} disabled={currentPage === totalPages} label={'Next'} />
          </li>
        </ul>
      </nav>
    );
  }, [currentPage, totalPages, paginate]);


  return (
    <div className={`container py-4 ${themeMode === 'dark' ? 'dark-mode' : ''}`}>
      {/* Header Section */}
      <div className="d-flex justify-content-between align-items-center mb-4">
        <h5 className="mb-0 main-heading">Attendance Management</h5>
        <div className="d-flex align-items-center">
          <Button
            label="My Attendance"
            variant="outline"
            size="sm"
            className="me-3"
            onClick={() => navigate('/my-attendance')}
          />
        </div>
      </div>
      <hr className="hr-line" />

      {/* Stat Cards */}
      <div className="row mb-4">
        <div className="col-md-3 mt-2">
          <div className={`card stat-card present-card`}>
            <div className="card-body">
              <h5 className="card-title text-muted">Present Today</h5>
              <p className="card-text stat-number">{attendanceSummary.present}</p>
            </div>
          </div>
        </div>
        <div className="col-md-3 mt-2">
          <div className={`card stat-card late-card`}>
            <div className="card-body">
              <h5 className="card-title text-muted">Late Today</h5>
              <p className="card-text stat-number">{attendanceSummary.late}</p>
            </div>
          </div>
        </div>
        <div className="col-md-3 mt-2">
          <div className={`card stat-card on-leave-card`}>
            <div className="card-body">
              <h5 className="card-title text-muted">On Leave Today</h5>
              <p className="card-text stat-number">{attendanceSummary.onLeave}</p>
            </div>
          </div>
        </div>
        <div className="col-md-3 mt-2">
          <div className={`card stat-card absent-card`}>
            <div className="card-body">
              <h5 className="card-title text-muted">Absent Today</h5>
              <p className="card-text stat-number">{attendanceSummary.absent}</p>
            </div>
          </div>
        </div>
      </div>

      {/* Filters Section */}
      <div className="card mb-4 filter-card">
        <div className="card-header card-header-custom">
          <div className="d-flex justify-content-between align-items-center flex-wrap gap-2">
            <h5 className="mb-0">Filter Attendance</h5>
            <div className="btn-group gap-1" role="group">
              <Button
                variant={activeFilter === 'custom' ? 'solid' : 'outline'}
                size="sm"
                onClick={() => handlePeriodFilter('custom')}
                label="Custom"
              />
              <Button
                variant={activeFilter === '30days' ? 'solid' : 'outline'}
                size="sm"
                onClick={() => handlePeriodFilter('30days')}
                label="Last 30 Days"
              />
              <Button
                variant={activeFilter === 'last3months' ? 'solid' : 'outline'}
                size="sm"
                onClick={() => handlePeriodFilter('last3months')}
                label="Last 3 Months"
              />
            </div>
          </div>
        </div>

        {activeFilter === 'custom' && (
          <div className="card-body">
            <div className="row g-3">
              <div className="col-md-3">
                <label htmlFor="searchName" className="form-label">Search by Name/ID</label>
                <input
                  type="text"
                  className="form-control"
                  id="searchName"
                  placeholder="Employee Name or ID"
                  value={searchName}
                  onChange={(e) => setSearchName(e.target.value)}
                />
              </div>

              <div className="col-md-3">
                <label htmlFor="departmentFilter" className="form-label">Department</label>
                <Select
                  id="departmentFilter"
                  options={departmentOptions}
                  value={departmentFilter}
                  onChange={setDepartmentFilter}
                  isClearable
                  placeholder="Select Department"
                  classNamePrefix="react-select"
                  className={themeMode === 'dark' ? 'react-select-dark' : ''}
                />
              </div>

              <div className="col-md-3">
                <label htmlFor="locationFilter" className="form-label">Location</label>
                <Select
                  id="locationFilter"
                  options={locationOptions}
                  value={locationFilter}
                  onChange={setLocationFilter}
                  isClearable
                  placeholder="Select Location"
                  classNamePrefix="react-select"
                  className={themeMode === 'dark' ? 'react-select-dark' : ''}
                />
              </div>

              <div className="col-md-3">
                <label htmlFor="dateRange" className="form-label">Date Range</label>
                <DatePicker
                  selectsRange
                  startDate={startDate}
                  endDate={endDate}
                  onChange={handleDateRangeChange}
                  isClearable
                  className="form-control custom-datepicker-input"
                  dateFormat="yyyy-MM-dd"
                  calendarClassName={themeMode === 'dark' ? 'dark-datepicker-calendar' : ''}
                  placeholderText="Select date range"
                />
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Attendance Table */}
      <div className="card table-card">
        <div className="card-header card-header-custom">
          <h5 className="mb-0">Employee Attendance Details ({formatDisplayDate(startDate)} - {formatDisplayDate(endDate)})</h5>
        </div>
        <div className="card-body p-0">
          <div className="table-responsive">
            <table className={`table table-hover mb-0 ${themeMode === 'dark' ? 'table-dark' : ''} attendance-table`}>
              <thead>
                <tr>
                  <th>Employee Name</th>
                  <th>Employee ID</th>
                  <th>Designation</th>
                  <th>Department</th>
                  <th>Status</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {currentEmployeesForTable.length === 0 ? (
                  <tr>
                    <td colSpan="6" className="text-center py-4">No attendance data found for the selected filters.</td>
                  </tr>
                ) : (
                  currentEmployeesForTable.map((record) => {
                    const status = record.log.status;
                    let statusBadge;
                    if (status === 'On Time') {
                      statusBadge = <span className="badge bg-success">On Time</span>;
                    } else if (status === 'Late') {
                      statusBadge = <span className="badge bg-warning text-dark">Late</span>;
                    } else if (status === 'Leave') {
                      statusBadge = <span className="badge bg-info">On Leave</span>;
                    } else if (status === 'WFH') {
                      statusBadge = <span className="badge bg-purple">WFH</span>;
                    } else if (status === 'Absent') {
                      statusBadge = <span className="badge bg-danger">Absent</span>;
                    } else {
                      statusBadge = <span className="badge bg-secondary">N/A</span>;
                    }

                    return (
                      <tr key={`${record.employeeId}-${record.log.date}`} className="table-row-clickable">
                        <td onClick={() => handleRowClick(record.employeeId)}>{record.employeeName}</td>
                        <td onClick={() => handleRowClick(record.employeeId)}>{record.employeeId}</td>
                        <td onClick={() => handleRowClick(record.employeeId)}>{record.designation}</td>
                        <td onClick={() => handleRowClick(record.employeeId)}>{record.department}</td>
                        <td onClick={() => handleRowClick(record.employeeId)}>
                          {statusBadge}
                          {record.log.geoLocation && (
                            <FaMapMarkerAlt
                              className="ms-2 geolocation-icon"
                              onClick={(e) => handleViewGeoLocation(e, record.log, record.employeeName, record.employeeId)}
                              title="View Geolocation"
                            />
                          )}
                        </td>
                        <td>
                          <div className="dropdown">
                            <button className="btn" onClick={(e) => togglePopover(e, record)}>
                              <FaEllipsisV />
                            </button>
                          </div>
                        </td>
                      </tr>
                    );
                  })
                )}
              </tbody>
            </table>
          </div>
        </div>
        {/* Pagination and Rows per Page Controls */}
        <div className="card-footer py-3 d-flex justify-content-between align-items-center">
          <div className="d-flex align-items-center">
            <span>Rows per page:</span>
            <select
              className="form-select form-select-sm ms-2"
              value={employeesPerPage}
              onChange={(e) => setEmployeesPerPage(Number(e.target.value))}
              style={{ width: '60px' }}
            >
              {rowsPerPageOptions.map(option => (
                <option key={option} value={option}>{option}</option>
              ))}
            </select>
          </div>
          {renderPaginationButtons()}
        </div>
      </div>

      {/* Popover for three dots (manual positioning) */}
      {popoverOpen && selectedEmployeeForPopover && (
        <div
          ref={popoverRef}
          className={`card custom-popover ${themeMode === 'dark' ? 'dark-mode-popover' : ''}`}
          style={{ top: popoverPosition.top, left: popoverPosition.left }}
        >
          <ul className="list-group list-group-flush">
            <li className={`list-group-item popover-item ${themeMode === 'dark' ? 'dark-mode-popover-item' : ''}`} onClick={() => handlePopoverOptionClick('View Profile', selectedEmployeeForPopover)}>
              View Profile
            </li>
            <li className={`list-group-item popover-item ${themeMode === 'dark' ? 'dark-mode-popover-item' : ''}`} onClick={() => handlePopoverOptionClick('Edit Details', selectedEmployeeForPopover)}>
              Edit Details
            </li>
            <li className={`list-group-item popover-item ${themeMode === 'dark' ? 'dark-mode-popover-item' : ''}`} onClick={() => handlePopoverOptionClick('Send Message', selectedEmployeeForPopover)}>
              Send Message
            </li>
            <li className={`list-group-item popover-item ${themeMode === 'dark' ? 'dark-mode-popover-item' : ''}`} onClick={() => handlePopoverOptionClick('toggleActive', selectedEmployeeForPopover)}>
              {activeEmployees.get(selectedEmployeeForPopover.employeeId) ? (
                <> <FaUserSlash className="me-2" /> Inactive </>
              ) : (
                <> <FaUserCheck className="me-2" /> Active </>
              )}
            </li>
            <li className={`list-group-item popover-item text-danger ${themeMode === 'dark' ? 'dark-mode-popover-item' : ''}`} onClick={() => handlePopoverOptionClick('delete', selectedEmployeeForPopover)}>
              <FaTrashAlt className="me-2" /> Delete
            </li>
          </ul>
        </div>
      )}

      {/* Geolocation Modal */}
      {showGeoModal && (
        <>
          <div className={`modal fade show d-block custom-modal`} tabIndex="-1" role="dialog">
            <div className="modal-dialog modal-dialog-centered modal-dialog-scrollable">
              <div className={`modal-content ${themeMode === 'dark' ? 'bg-dark text-light' : ''}`}>
                <div className="modal-header">
                  <h5 className="modal-title">Geolocation for {selectedGeoEmployeeName} on {formatDisplayDate(parseISO(selectedGeoDate))}</h5>
                  <button type="button" className={`btn-close ${themeMode === 'dark' ? 'btn-close-white' : ''}`} onClick={() => setShowGeoModal(false)} aria-label="Close"></button>
                </div>
                <div className="modal-body">
                  {renderGoogleMap(selectedGeoLocation)}
                </div>
                <div className="modal-footer">
                  <Button type="button" variant="secondary" label="Close" onClick={() => setShowGeoModal(false)} />
                </div>
              </div>
            </div>
          </div>
          <div className="modal-backdrop fade show"></div>
        </>
      )}
    </div>
  );
};

export default AdminAttendance;