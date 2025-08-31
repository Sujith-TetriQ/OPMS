import React, { useState, useEffect } from "react";
import { FaCaretDown, FaGlobe, FaCaretUp } from "react-icons/fa";
import { GiPartyPopper } from "react-icons/gi";
import { format, differenceInCalendarDays } from "date-fns";
import "./index.css";
import { MdAccessTime } from "react-icons/md";

const HolidayCard = ({ holidays }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [currentTime, setCurrentTime] = useState(new Date());

  // update every second
  useEffect(() => {
    const timer = setInterval(() => setCurrentTime(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  const toggleDropdown = (e) => {
    e.stopPropagation();
    setIsOpen((prev) => !prev);
  };

  // Helper: get "in X days"
  const getDaysLeft = (holidayDate) => {
    const today = new Date();
    const target = new Date(holidayDate);
    const diff = differenceInCalendarDays(target, today);
    if (diff < 0) return "passed";
    if (diff === 0) return "today";
    if (diff === 1) return "tomorrow";
    return `in ${diff} days`;
  };

  return (
    <div className="dropdown-container">
      {/* Header */}
      <div
        className="dropdown-header d-flex align-items-center justify-content-between"
        onClick={toggleDropdown}
      >
        <div className="holiday-box">
          {/* Date Badge (first holiday) */}
          <div className="date-badge">
            <span className="month">{format(new Date(holidays[0].date), "MMM").toUpperCase()}</span>
            <span className="day">{format(new Date(holidays[0].date), "dd")}</span>
          </div>

          {/* Content */}
          <div className="holiday-content">
            <div className="holiday-top">
              <span className="holiday-title">
                {holidays[0].name} <GiPartyPopper className="text-pink-500" />
              </span>
              <span className="more-link">+{holidays.length - 1} more</span>
            </div>
            <div className="holiday-bottom">
              {holidays[0].type === "public" && <span className="public-badge">Public</span>}
              <span className="days-left">{getDaysLeft(holidays[0].date)}</span>
              <div className="caret">{isOpen ? <FaCaretUp /> : <FaCaretDown />}</div>
            </div>
          </div>
        </div>
      </div>

      {/* Dropdown */}
      {isOpen && (
        <div className="dropdown-menu show">
          <div className="holiday-header d-flex align-items-center justify-content-between px-2">
            <h6 className="fw-semibold mb-0 title">All Upcoming Holidays</h6>
            <button className="add-btn">+ Add</button>
          </div>

          <div className="holidays-list">
            {holidays.map((holiday, index) => (
              <div key={index} className="holiday-item d-flex align-items-center">
                <div className="date-badge">
                  {/*formatted as ex: SEP 01 */}
                  <div className="month">{format(new Date(holiday.date), "MMM").toUpperCase()}</div>
                  <div className="day">{format(new Date(holiday.date), "dd")}</div>
                </div>
                <div className="holiday-details ms-2">
                  <div className="holiday-title">{holiday.name}</div>
                  <div className="holiday-meta">
                    {holiday.type === "public" && <span className="badge-public">public</span>}
                    <span className="days-left">{getDaysLeft(holiday.date)}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Current Time */}
      <div className="time-section ">
        <div className="d-flex align-items-center">
          <MdAccessTime color="#2563eb" />
          <span className="time-label fw-semibold">Current Time</span>
        </div>

        <div className="time-display mb-2">
          <span className="time">{format(currentTime, "hh:mm:ss")}</span>
          <span className="ampm">{format(currentTime, "a")}</span>
        </div>

        <div className="date mb-2">{format(currentTime, "EEEE, MMMM d, yyyy")}</div>

        <div className="timezone d-flex align-items-center mb-3">
          <FaGlobe className="me-2" /> Asia/Kolkata
        </div>

        <div className="row text-center time-breakdown">
          <div className="col">
            <div className="breakdown-value">{format(currentTime, "hh")}</div>
            <div className="breakdown-label">Hours</div>
          </div>
          <div className="col">
            <div className="breakdown-value">{format(currentTime, "mm")}</div>
            <div className="breakdown-label">Minutes</div>
          </div>
          <div className="col">
            <div className="breakdown-value">{format(currentTime, "ss")}</div>
            <div className="breakdown-label">Seconds</div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default HolidayCard;
