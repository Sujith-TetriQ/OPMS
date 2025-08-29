import React, { useState, useEffect, useRef, useMemo, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { useTheme } from '@context/ThemeContext';
import Select from 'react-select';
import DatePicker from 'react-datepicker';
import { employeeAttendanceData } from '@data/mockData';
import './AdminAttendance.css';

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

import {
  FaEllipsisV,
  FaMapMarkerAlt,
  FaUser,
  FaClipboardCheck,
  FaSuitcase,
  FaHome,
} from 'react-icons/fa';

import Button from '@components/common/Button';

/** Utility: pre-defined date windows for quick filters */
const getPeriodDates = (period) => {
  const today = new Date();
  switch (period) {
    case '30days':
      return { startDate: subDays(startOfToday(), 29), endDate: endOfDay(today) };
    case 'last3months':
      return { startDate: subDays(startOfToday(), 90), endDate: endOfDay(today) };
    case 'custom':
    default:
      return { startDate: null, endDate: null };
  }
};

const AdminAttendance = () => {
  const navigate = useNavigate();
  const { themeMode } = useTheme();

  /** -------------------- STATE -------------------- */
  const [attendanceSummary, setAttendanceSummary] = useState({
    totalEmployees: 0, present: 0, late: 0, onLeave: 0, absent: 0,
  });

  const [allAttendanceRecords, setAllAttendanceRecords] = useState([]);

  // Filters
  const [activeFilter, setActiveFilter] = useState('30days');
  const [departmentFilter, setDepartmentFilter] = useState(null);
  const [locationFilter, setLocationFilter] = useState(null);
  const [searchName, setSearchName] = useState('');

  // Initial date = last 30 days
  const initialDates = getPeriodDates('30days');
  const [startDate, setStartDate] = useState(initialDates.startDate);
  const [endDate, setEndDate] = useState(initialDates.endDate);

  // Pagination
  const [filteredLogs, setFilteredLogs] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [employeesPerPage, setEmployeesPerPage] = useState(10);
  const [rowsPerPageOptions] = useState([10, 20, 50, 100]);

  // Row actions floating menu
  const [menuOpen, setMenuOpen] = useState(false);
  const [menuPos, setMenuPos] = useState({ top: 0, left: 0 });
  const [menuArrowAt, setMenuArrowAt] = useState('right');
  const [menuRow, setMenuRow] = useState(null);
  const menuRef = useRef(null);

  // Close-on-scroll: include table scrollable area, too
  const tableScrollRef = useRef(null);

  // Geolocation modal
  const [showGeoModal, setShowGeoModal] = useState(false);
  const [selectedGeoLocation, setSelectedGeoLocation] = useState(null);
  const [selectedGeoEmployeeName, setSelectedGeoEmployeeName] = useState('');
  const [selectedGeoDate, setSelectedGeoDate] = useState('');

  // Action modals (Regularize / Leave / WFH)
  const [showRegularize, setShowRegularize] = useState(false);
  const [showLeave, setShowLeave] = useState(false);
  const [showWFH, setShowWFH] = useState(false);
  const [selectedDate, setSelectedDate] = useState('');

  // NEW: Status Details modal (for clickable stat cards)
  const [statusModalOpen, setStatusModalOpen] = useState(false);
  const [statusModalTitle, setStatusModalTitle] = useState('');
  const [statusModalList, setStatusModalList] = useState([]);

  /** -------------------- MEMO DATA -------------------- */
  const departmentOptions = useMemo(
    () => Array.from(new Set(employeeAttendanceData.map(emp => emp.department)))
      .map(dept => ({ value: dept, label: dept })),
    []
  );

  const locationOptions = useMemo(
    () => Array.from(new Set(employeeAttendanceData.map(emp => emp.location)))
      .map(loc => ({ value: loc, label: loc })),
    []
  );

  /** -------------------- HELPERS -------------------- */
  const formatDisplayDate = useCallback((date) => (date ? format(date, 'MMMM dd, yyyy') : ''), []);

  const isLate = useCallback((checkInTime) => {
    if (!checkInTime) return false;
    const lateCutoff = parse('09:10:00', 'HH:mm:ss', new Date());
    const checkInDateTime = parse(checkInTime, 'HH:mm:ss', new Date());
    return checkInDateTime > lateCutoff;
  }, []);

  const isWeekend = useCallback((date) => {
    const d = getDay(date);
    return d === 0 || d === 6;
  }, []);

  /** -------------------- BOOTSTRAP DATA -------------------- */
  useEffect(() => {
    let present = 0, late = 0, onLeave = 0, absent = 0;
    const today = new Date();

    const processed = employeeAttendanceData.flatMap(employee => {
      const todayLog = employee.attendanceLogs.find(log => isSameDay(parseISO(log.date), today));

      if (!todayLog && !isWeekend(today)) {
        absent++;
        return [{
          employeeName: `${employee.firstName} ${employee.lastName}`,
          employeeId: employee.employeeId,
          designation: employee.designation,
          department: employee.department,
          officeLocation: employee.location,
          log: {
            date: format(today, 'yyyy-MM-dd'),
            status: 'Absent',
            checkIn: null,
            checkOut: null,
            workDuration: null,
            leaveType: null,
            remarks: 'Auto-marked Absent',
            geoLocation: null,
          },
        }];
      }

      // Normalize status for today’s log
      let normalizedStatus = todayLog?.status || 'Absent';
      if (todayLog) {
        if (todayLog.status === 'On Time') {
          if (isLate(todayLog.checkIn)) {
            normalizedStatus = 'Late';
            late++;
          } else {
            normalizedStatus = 'On Time';
            present++;
          }
        } else if (todayLog.status === 'Late') {
          late++;
        } else if (todayLog.status === 'Leave') {
          onLeave++;
        } else if (todayLog.status === 'Absent') {
          absent++;
        }
      } else {
        absent++;
      }

      return employee.attendanceLogs.map(log => ({
        employeeName: `${employee.firstName} ${employee.lastName}`,
        employeeId: employee.employeeId,
        designation: employee.designation,
        department: employee.department,
        officeLocation: employee.location,
        log: {
          ...log,
          status: isSameDay(parseISO(log.date), today) ? normalizedStatus : log.status,
        },
      }));
    });

    setAttendanceSummary({
      totalEmployees: employeeAttendanceData.length,
      present, late, onLeave, absent,
    });

    setAllAttendanceRecords(processed);
  }, [isWeekend, isLate]);

  /**
   * NEW: Build the **today** list for a given category so that counts match the stat cards.
   * category: 'present' | 'late' | 'onLeave' | 'absent'
   */
  const buildTodayCategoryList = useCallback((category) => {
    const today = startOfToday();
    const list = [];

    employeeAttendanceData.forEach((employee) => {
      const base = {
        employeeName: `${employee.firstName} ${employee.lastName}`,
        employeeId: employee.employeeId,
        designation: employee.designation,
        department: employee.department,
        officeLocation: employee.location,
      };

      const todayLog = employee.attendanceLogs.find(log => isSameDay(parseISO(log.date), today));

      if (!todayLog) {
        // No log today ➜ mark Absent only on weekdays
        if (!isWeekend(today) && category === 'absent') {
          list.push({ ...base, status: 'Absent', checkIn: '-', checkOut: '-', remarks: 'Auto-marked' });
        }
        return;
      }

      // Normalize classification so it mirrors summary logic
      let group = '';
      if (todayLog.status === 'Leave') group = 'onLeave';
      else if (todayLog.status === 'Late') group = 'late';
      else if (todayLog.status === 'On Time') group = isLate(todayLog.checkIn) ? 'late' : 'present';
      else if (todayLog.status === 'Absent') group = 'absent'

      if (group === category) {
        list.push({
          ...base,
          status: todayLog.status,
          checkIn: todayLog.checkIn || '-',
          checkOut: todayLog.checkOut || '-',
          remarks: todayLog.remarks || '-',
        });
      }
    });

    return list;
  }, [isLate, isWeekend]);

  /** -------------------- FILTER + SORT (table) -------------------- */
  useEffect(() => {
    let list = allAttendanceRecords;

    // Date range filter ➜ if dates are null, we include **all** logs
    list = list.filter(rec => {
      if (!startDate && !endDate) return true;
      if (!startDate || !endDate) return true;
      const d = parseISO(rec.log.date);
      return isWithinInterval(d, { start: startOfDay(startDate), end: endOfDay(endDate) });
    });

    // department filters
    if (departmentFilter) list = list.filter(r => r.department === departmentFilter.value);

    // location filters
    if (locationFilter) {
      list = list.filter(officeLoc => officeLoc.officeLocation === locationFilter.value);
    }

    // search by name and id
    if (searchName) {
      const q = searchName.toLowerCase();
      list = list.filter(r =>
        r.employeeName?.toLowerCase().includes(q) ||
        r.employeeId?.toString().toLowerCase().includes(q)
      );
    }

    // Sort by date asc, then by name
    list.sort((a, b) => {
      const aDate = parseISO(a.log.date);
      const bDate = parseISO(b.log.date);
      if (aDate > bDate) return 1;
      if (aDate < bDate) return -1;
      return a.employeeName.localeCompare(b.employeeName);
    });

    setFilteredLogs(list);
    setCurrentPage(1);
  }, [allAttendanceRecords, departmentFilter, locationFilter, searchName, startDate, endDate]);

  /** -------------------- PERIOD BUTTONS + PICKER -------------------- */
  const handlePeriodFilter = useCallback((period) => {
    setActiveFilter(period);
    const { startDate, endDate } = getPeriodDates(period);
    setStartDate(startDate);
    setEndDate(endDate);
  }, []);

  const handleDateRangeChange = (update) => {
    const [start, end] = update;
    setStartDate(start);
    setEndDate(end);
    setActiveFilter('custom');
  };

  /** -------------------- PAGINATION -------------------- */
  const totalPages = useMemo(
    () => Math.ceil(filteredLogs.length / employeesPerPage),
    [filteredLogs, employeesPerPage]
  );

  const currentEmployeesForTable = useMemo(() => {
    const last = currentPage * employeesPerPage;
    const first = last - employeesPerPage;
    return filteredLogs.slice(first, last);
  }, [currentPage, employeesPerPage, filteredLogs]);

  const paginate = useCallback((n) => setCurrentPage(n), []);

  const renderPaginationButtons = useCallback(() => {
    // Define the number of pages you want to show
    const maxButtonsToShow = 5;
    const half = Math.floor(maxButtonsToShow / 2);
    let start = Math.max(1, currentPage - half);
    let end = Math.min(totalPages, start + maxButtonsToShow - 1);

    // Adjust the range if we are at the end of the total pages
    if (end - start + 1 < maxButtonsToShow) {
      start = Math.max(1, end - maxButtonsToShow + 1);
    }

    const visiblePageNumbers = Array.from({ length: (end - start + 1) }, (_, i) => start + i);

    return (
      <nav aria-label="Page navigation">
        <ul className="pagination justify-content-end custom-pagination">
          {/* Previous Button */}
          <li className={`page-item ${currentPage === 1 ? 'disabled' : ''}`}>
            <Button
              variant="solid"
              size="sm"
              onClick={() => paginate(currentPage - 1)}
              disabled={currentPage === 1}
              label="Previous"
            />
          </li>

          {/* First page and ellipsis */}
          {start > 1 && (
            <>
              <li className="page-item">
                <Button variant="outline" size="sm" onClick={() => paginate(1)} label={1} />
              </li>
              {start > 2 && (
                <li className="page-item disabled">
                  <span className="page-link">...</span>
                </li>
              )}
            </>
          )}

          {/* Visible Page Buttons */}
          {visiblePageNumbers.map(n => (
            <li key={n} className={`page-item ${currentPage === n ? 'active' : ''}`}>
              <Button variant="outline" size="sm" onClick={() => paginate(n)} label={n} />
            </li>
          ))}

          {/* Last page and ellipsis */}
          {end < totalPages && (
            <>
              {end < totalPages - 1 && (
                <li className="page-item disabled">
                  <span className="page-link">...</span>
                </li>
              )}
              <li className="page-item">
                <Button variant="outline" size="sm" onClick={() => paginate(totalPages)} label={totalPages} />
              </li>
            </>
          )}

          {/* Next Button */}
          <li className={`page-item ${currentPage === totalPages ? 'disabled' : ''}`}>
            <Button
              variant="solid"
              size="sm"
              onClick={() => paginate(currentPage + 1)}
              disabled={currentPage === totalPages}
              label="Next"
            />
          </li>
        </ul>
      </nav>
    );
  }, [currentPage, totalPages, paginate]);

  /** -------------------- ROW ACTIONS MENU -------------------- */
  const handleRowClick = useCallback((employeeId) => {
    navigate(`/admin/attendance/${employeeId}`);
  }, [navigate]);

  const openMenu = useCallback((event, record) => {
    event.stopPropagation();
    const rect = event.currentTarget.getBoundingClientRect();
    const menuWidth = 240;
    const menuHeight = 196; // approx (4 items)
    const gap = 8;

    let top = rect.bottom + gap;
    let left = rect.right - menuWidth; // right aligned to button by default
    let arrowSide = 'right';

    // Clamp inside viewport horizontally
    const maxLeft = window.innerWidth - menuWidth - 8;
    if (left > maxLeft) left = maxLeft;
    if (left < 8) { left = 8; arrowSide = 'left'; }

    // If bottom is out of viewport, flip above
    if (top + menuHeight > window.innerHeight) {
      top = Math.max(8, rect.top - menuHeight - gap);
    }

    setMenuPos({ top, left });
    setMenuArrowAt(arrowSide);
    setMenuRow(record);
    setSelectedDate(record?.log?.date || '');
    setMenuOpen(true);
  }, []);

  const closeMenu = useCallback(() => setMenuOpen(false), []);

  // Close menu on: outside click, ESC, window scroll/resize, wheel/touch, and inner table scroll
  useEffect(() => {
    const handleDocClick = (ev) => {
      if (menuRef.current && !menuRef.current.contains(ev.target)) closeMenu();
    };
    const handleEsc = (ev) => { if (ev.key === 'Escape') closeMenu(); };
    const handleWinScroll = () => closeMenu();

    document.addEventListener('mousedown', handleDocClick);
    document.addEventListener('keydown', handleEsc);
    window.addEventListener('scroll', handleWinScroll, { passive: true });
    window.addEventListener('resize', handleWinScroll, { passive: true });
    window.addEventListener('wheel', handleWinScroll, { passive: true });
    window.addEventListener('touchmove', handleWinScroll, { passive: true });

    const sc = tableScrollRef.current;
    if (sc) sc.addEventListener('scroll', handleWinScroll, { passive: true });

    return () => {
      document.removeEventListener('mousedown', handleDocClick);
      document.removeEventListener('keydown', handleEsc);
      window.removeEventListener('scroll', handleWinScroll);
      window.removeEventListener('resize', handleWinScroll);
      window.removeEventListener('wheel', handleWinScroll);
      window.removeEventListener('touchmove', handleWinScroll);
      if (sc) sc.removeEventListener('scroll', handleWinScroll);
    };
  }, [closeMenu]);

  // Route or open modals from the menu
  const launchAction = useCallback((type) => {
    closeMenu();
    if (!menuRow) return;
    if (type === 'view') return navigate(`/admin/employees/${menuRow.employeeId}`);
    if (type === 'regularize') return setShowRegularize(true);
    if (type === 'leave') return setShowLeave(true);
    if (type === 'wfh') return setShowWFH(true);
  }, [menuRow, navigate, closeMenu]);

  const closeAllActionModals = () => { setShowRegularize(false); setShowLeave(false); setShowWFH(false); };
  const submitRegularize = (e) => { e.preventDefault(); closeAllActionModals(); alert('Regularization submitted'); };
  const submitLeave = (e) => { e.preventDefault(); closeAllActionModals(); alert('Leave request submitted'); };
  const submitWFH = (e) => { e.preventDefault(); closeAllActionModals(); alert('WFH request submitted'); };

  /** -------------------- GEO MODAL HELPERS -------------------- */
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
      alert('No geolocation data available for this entry.');
    }
  }, []);

  // Simple map placeholder
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

  /** -------------------- RENDER -------------------- */
  // Header text ➜ hide "N/A - N/A" when no dates selected
  const headerText = (!startDate && !endDate)
    ? 'Employee Attendance Details'
    : `Employee Attendance Details (${formatDisplayDate(startDate)} - ${formatDisplayDate(endDate)})`;

  // NEW: handlers to open the status details modal from cards
  const openStatusModal = useCallback((category) => {
    const titleMap = {
      present: 'Present Today',
      late: 'Late Today',
      onLeave: 'On Leave Today',
      absent: 'Absent Today',
    };
    const list = buildTodayCategoryList(category);
    setStatusModalList(list);
    setStatusModalTitle(`${titleMap[category]} (${list.length})`);
    setStatusModalOpen(true);
  }, [buildTodayCategoryList]);

  return (
    <div className={`container py-4 ${themeMode === 'dark' ? 'dark-mode' : ''}`}>
      {/* Header */}
      <div className="d-flex justify-content-between align-items-center mb-4">
        <h5 className="mb-0 main-heading">Attendance Management</h5>
        <div className="d-flex align-items-center">
          <Button label="My Attendance" variant="outline" size="sm" className="me-3" onClick={() => navigate('/my-attendance')} />
        </div>
      </div>
      <hr className="hr-line" />

      {/* Stat Cards (CLICKABLE) */}
      <div className="row mb-4">
        <div className="col-md-6 col-lg-3 mt-2">
          <div
            className="card stat-card present-card"
            role="button"
            tabIndex={0}
            onClick={() => openStatusModal('present')}
            onKeyDown={(e) => e.key === 'Enter' && openStatusModal('present')}
            style={{ cursor: 'pointer' }}
          >
            <div className="card-body">
              <h5 className="card-title text-muted">Present Today</h5>
              <p className="card-text stat-number">{attendanceSummary.present}</p>
            </div>
          </div>
        </div>

        <div className="col-md-6 col-lg-3 mt-2">
          <div
            className="card stat-card late-card"
            role="button"
            tabIndex={0}
            onClick={() => openStatusModal('late')}
            onKeyDown={(e) => e.key === 'Enter' && openStatusModal('late')}
            style={{ cursor: 'pointer' }}
          >
            <div className="card-body">
              <h5 className="card-title text-muted">Late Today</h5>
              <p className="card-text stat-number">{attendanceSummary.late}</p>
            </div>
          </div>
        </div>

        <div className="col-md-6 col-lg-3 mt-2">
          <div
            className="card stat-card on-leave-card"
            role="button"
            tabIndex={0}
            onClick={() => openStatusModal('onLeave')}
            onKeyDown={(e) => e.key === 'Enter' && openStatusModal('onLeave')}
            style={{ cursor: 'pointer' }}
          >
            <div className="card-body">
              <h5 className="card-title text-muted">On Leave Today</h5>
              <p className="card-text stat-number">{attendanceSummary.onLeave}</p>
            </div>
          </div>
        </div>

        <div className="col-md-6 col-lg-3 mt-2">
          <div
            className="card stat-card absent-card"
            role="button"
            tabIndex={0}
            onClick={() => openStatusModal('absent')}
            onKeyDown={(e) => e.key === 'Enter' && openStatusModal('absent')}
            style={{ cursor: 'pointer' }}
          >
            <div className="card-body">
              <h5 className="card-title text-muted">Absent Today</h5>
              <p className="card-text stat-number">{attendanceSummary.absent}</p>
            </div>
          </div>
        </div>
      </div>

      {/* Filters */}
      <div className="card mb-4 filter-card">
        <div className="card-header card-header-custom">
          <div className="d-flex justify-content-between align-items-center flex-wrap gap-2">
            <h5 className="mb-0">Filter Attendance</h5>
            <div className="btn-group gap-1" role="group">
              <Button variant={activeFilter === 'custom' ? 'solid' : 'outline'} size="sm" onClick={() => handlePeriodFilter('custom')} label="Custom" />
              <Button variant={activeFilter === '30days' ? 'solid' : 'outline'} size="sm" onClick={() => handlePeriodFilter('30days')} label="Last 30 Days" />
              <Button variant={activeFilter === 'last3months' ? 'solid' : 'outline'} size="sm" onClick={() => handlePeriodFilter('last3months')} label="Last 3 Months" />
            </div>
          </div>
        </div>

        {activeFilter === 'custom' && (
          <div className="card-body">
            <div className="row g-3">
              <div className="col-md-3">
                <label className="form-label">Search by Name/ID</label>
                <input
                  type="text"
                  className="form-control"
                  placeholder="Employee Name or ID"
                  value={searchName}
                  onChange={(e) => setSearchName(e.target.value)}
                />
              </div>

              <div className="col-md-3">
                <label className="form-label">Department</label>
                <Select
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
                <label className="form-label">Location</label>
                <Select
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
                <label className="form-label">Date Range</label>
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

      {/* Table */}
      <div className="card table-card">
        <div className="card-header card-header-custom">
          <h5 className="mb-0">{headerText}</h5>
        </div>
        <div className="card-body p-0">
          <div className="table-responsive" ref={tableScrollRef}>
            <table className={`table table-hover mb-0 ${themeMode === 'dark' ? 'table-dark' : ''} attendance-table`}>
              <thead>
                <tr>
                  <th>Employee Name</th>
                  <th>Employee ID</th>
                  <th>Designation</th>
                  <th>Department</th>
                  <th>Status</th>
                  <th className="text-end">Actions</th>
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
                    if (status === 'On Time') statusBadge = <span className="badge bg-success">On Time</span>;
                    else if (status === 'Late') statusBadge = <span className="badge bg-warning text-dark">Late</span>;
                    else if (status === 'Leave') statusBadge = <span className="badge bg-info">On Leave</span>;
                    else if (status === 'WFH') statusBadge = <span className="badge bg-purple">WFH</span>;
                    else if (status === 'Absent') statusBadge = <span className="badge bg-danger">Absent</span>;
                    else statusBadge = <span className="badge bg-secondary">N/A</span>;

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
                              className="ms-2 geolocation-icon text-secondary"
                              size={20}
                              onClick={(e) => handleViewGeoLocation(e, record.log, record.employeeName, record.employeeId)}
                              title="View Geolocation"
                            />
                          )}
                        </td>
                        <td className="text-end">
                          <button
                            className="btn btn-sm btn-outline-secondary action-btn"
                            onClick={(e) => openMenu(e, record)}
                            aria-label="Row actions"
                          >
                            <FaEllipsisV />
                          </button>
                        </td>
                      </tr>
                    );
                  })
                )}
              </tbody>
            </table>
          </div>
        </div>

        {/* Footer controls */}
        <div className="card-footer py-3 d-flex justify-content-between align-items-center">
          <div className="d-flex align-items-center">
            <span>Rows per page:</span>
            <select
              className="form-select form-select-sm ms-2"
              value={employeesPerPage}
              onChange={(e) => setEmployeesPerPage(Number(e.target.value))}
              style={{ width: '60px' }}
            >
              {rowsPerPageOptions.map(opt => (
                <option key={opt} value={opt}>{opt}</option>
              ))}
            </select>
          </div>
          {renderPaginationButtons()}
        </div>
      </div>

      {/* Floating actions menu (viewport-positioned, auto-closes on any scroll/resize/ESC) */}
      {menuOpen && menuRow && (
        <div
          ref={menuRef}
          className={`action-menu ${themeMode} ${menuArrowAt}`}
          style={{ top: menuPos.top, left: menuPos.left }}
        >
          <button className="item" onClick={() => launchAction('view')}>
            <span className="icon"><FaUser /></span>
            <span className="text">View Profile</span>
          </button>
          <button className="item" onClick={() => launchAction('regularize')}>
            <span className="icon"><FaClipboardCheck /></span>
            <span className="text">Regularize</span>
          </button>
          <button className="item" onClick={() => launchAction('leave')}>
            <span className="icon"><FaSuitcase /></span>
            <span className="text">Request Leave</span>
          </button>
          <button className="item" onClick={() => launchAction('wfh')}>
            <span className="icon"><FaHome /></span>
            <span className="text">Apply WFH Request</span>
          </button>
        </div>
      )}

      {/* NEW: Status Details Modal (from stat cards) */}
      {statusModalOpen && (
        <>
          <div className="modal fade show d-block custom-modal" tabIndex="-1" role="dialog">
            <div className="modal-dialog modal-lg modal-dialog-centered modal-dialog-scrollable">
              <div className={`modal-content ${themeMode === 'dark' ? 'bg-dark text-light' : ''}`}>
                <div className="modal-header">
                  <h5 className="modal-title">{statusModalTitle}</h5>
                  <button
                    type="button"
                    className={`btn-close ${themeMode === 'dark' ? 'btn-close-white' : ''}`}
                    onClick={() => setStatusModalOpen(false)}
                    aria-label="Close"
                  ></button>
                </div>

                <div className="modal-body">
                  {statusModalList.length === 0 ? (
                    <p className="mb-0">No employees in this category for today.</p>
                  ) : (
                    <div className="table-responsive">
                      <table className={`table table-sm ${themeMode === 'dark' ? 'table-dark' : ''}`}>
                        <thead>
                          <tr>
                            <th>Employee</th>
                            <th>ID</th>
                            <th>Department</th>
                            <th>Designation</th>
                            <th>Check-in</th>
                            <th>Check-out</th>
                            <th>Status</th>
                          </tr>
                        </thead>
                        <tbody>
                          {statusModalList.map((emp) => {
                            let statusBadge;
                            if (emp.status === 'On Time')
                              statusBadge = <span className="badge bg-success">On Time</span>;
                            else if (emp.status === 'Late')
                              statusBadge = <span className="badge bg-warning text-dark">Late</span>;
                            else if (emp.status === 'Leave')
                              statusBadge = <span className="badge bg-info">On Leave</span>;
                            else if (emp.status === 'WFH')
                              statusBadge = <span className="badge bg-purple">WFH</span>;
                            else if (emp.status === 'Absent')
                              statusBadge = <span className="badge bg-danger">Absent</span>;
                            else statusBadge = <span className="badge bg-secondary">N/A</span>;

                            return (
                              <tr key={emp.employeeId}>
                                <td>{emp.employeeName}</td>
                                <td>{emp.employeeId}</td>
                                <td>{emp.department}</td>
                                <td>{emp.designation}</td>
                                <td>{emp.checkIn}</td>
                                <td>{emp.checkOut}</td>
                                <td>{statusBadge}</td>
                              </tr>
                            );
                          })}
                        </tbody>
                      </table>
                    </div>
                  )}
                </div>

                <div className="modal-footer">
                  <Button
                    type="button"
                    variant="solid"
                    label="Close"
                    size="sm"
                    onClick={() => setStatusModalOpen(false)}
                  />
                </div>
              </div>
            </div>
          </div>
          <div className="modal-backdrop fade show"></div>
        </>
      )}

      {/* Geolocation Modal */}
      {showGeoModal && (
        <>
          <div className="modal fade show d-block custom-modal" tabIndex="-1" role="dialog">
            <div className="modal-dialog modal-dialog-centered modal-dialog-scrollable">
              <div className={`modal-content ${themeMode === 'dark' ? 'bg-dark text-light' : ''}`}>
                <div className="modal-header">
                  <h5 className="modal-title">Geolocation for {selectedGeoEmployeeName} on {selectedGeoDate ? formatDisplayDate(parseISO(selectedGeoDate)) : '-'}</h5>
                  <button type="button" className={`btn-close ${themeMode === 'dark' ? 'btn-close-white' : ''}`} onClick={() => setShowGeoModal(false)} aria-label="Close"></button>
                </div>
                <div className="modal-body">{renderGoogleMap(selectedGeoLocation)}</div>
                <div className="modal-footer">
                  <Button type="button" variant="solid" size='sm' label="Close" onClick={() => setShowGeoModal(false)} />
                </div>
              </div>
            </div>
          </div>
          <div className="modal-backdrop fade show"></div>
        </>
      )}

      {/* Regularize Modal */}
      {showRegularize && (
        <>
          <div className="modal fade show d-block custom-modal" tabIndex="-1">
            <div className="modal-dialog modal-dialog-centered">
              <div className={`modal-content ${themeMode === 'dark' ? 'bg-dark text-light' : ''}`}>
                <div className="modal-header">
                  <h5 className="modal-title">Regularize Attendance</h5>
                  <button type="button" className={`btn-close ${themeMode === 'dark' ? 'btn-close-white' : ''}`} onClick={closeAllActionModals}></button>
                </div>
                <form onSubmit={submitRegularize}>
                  <div className="modal-body">
                    <div className="mb-3">
                      <label className="form-label">Date</label>
                      <input className="form-control" type="date" value={selectedDate || ''} onChange={(e) => setSelectedDate(e.target.value)} />
                    </div>
                    <div className="row g-2">
                      <div className="col">
                        <label className="form-label">Check-in</label>
                        <input className="form-control" type="time" required />
                      </div>
                      <div className="col">
                        <label className="form-label">Check-out</label>
                        <input className="form-control" type="time" required />
                      </div>
                    </div>
                    <div className="mt-3">
                      <label className="form-label">Remarks</label>
                      <textarea className="form-control" rows="3" />
                    </div>
                  </div>
                  <div className="modal-footer">
                    <Button variant="secondary" label="Cancel" onClick={closeAllActionModals} />
                    <Button variant="solid" type="submit" label="Submit" />
                  </div>
                </form>
              </div>
            </div>
          </div>
          <div className="modal-backdrop fade show"></div>
        </>
      )}

      {/* Leave Modal */}
      {showLeave && (
        <>
          <div className="modal fade show d-block custom-modal" tabIndex="-1">
            <div className="modal-dialog modal-dialog-centered">
              <div className={`modal-content ${themeMode === 'dark' ? 'bg-dark text-light' : ''}`}>
                <div className="modal-header">
                  <h5 className="modal-title">Request Leave</h5>
                  <button type="button" className={`btn-close ${themeMode === 'dark' ? 'btn-close-white' : ''}`} onClick={closeAllActionModals}></button>
                </div>
                <form onSubmit={submitLeave}>
                  <div className="modal-body">
                    <div className="mb-3">
                      <label className="form-label">Date</label>
                      <input className="form-control" type="date" value={selectedDate || ''} onChange={(e) => setSelectedDate(e.target.value)} />
                    </div>
                    <div className="mb-3">
                      <label className="form-label">Leave Type</label>
                      <select className="form-select" required>
                        <option value="">Select type</option>
                        <option>Casual Leave</option>
                        <option>Sick Leave</option>
                        <option>Paid Leave</option>
                      </select>
                    </div>
                    <div>
                      <label className="form-label">Reason</label>
                      <textarea className="form-control" rows="3" required />
                    </div>
                  </div>
                  <div className="modal-footer">
                    <Button variant="secondary" label="Cancel" onClick={closeAllActionModals} />
                    <Button variant="solid" type="submit" label="Submit" />
                  </div>
                </form>
              </div>
            </div>
          </div>
          <div className="modal-backdrop fade show"></div>
        </>
      )}

      {/* WFH Modal */}
      {showWFH && (
        <>
          <div className="modal fade show d-block custom-modal" tabIndex="-1">
            <div className="modal-dialog modal-dialog-centered">
              <div className={`modal-content ${themeMode === 'dark' ? 'bg-dark text-light' : ''}`}>
                <div className="modal-header">
                  <h5 className="modal-title">Apply WFH Request</h5>
                  <button type="button" className={`btn-close ${themeMode === 'dark' ? 'btn-close-white' : ''}`} onClick={closeAllActionModals}></button>
                </div>
                <form onSubmit={submitWFH}>
                  <div className="modal-body">
                    <div className="mb-3">
                      <label className="form-label">Date</label>
                      <input className="form-control" type="date" value={selectedDate || ''} onChange={(e) => setSelectedDate(e.target.value)} />
                    </div>
                    <div className="mb-3">
                      <label className="form-label">Reason</label>
                      <textarea className="form-control" rows="3" required />
                    </div>
                    <div className="mb-3">
                      <label className="form-label">Attachment (optional)</label>
                      <input className="form-control" type="file" />
                    </div>
                  </div>
                  <div className="modal-footer">
                    <Button variant="secondary" label="Cancel" onClick={closeAllActionModals} />
                    <Button variant="solid" type="submit" label="Submit" />
                  </div>
                </form>
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
