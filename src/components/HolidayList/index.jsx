import React, { useState, useEffect } from "react";
import { FaCaretDown, FaClock, FaGlobe, FaCaretUp } from "react-icons/fa";
import { GiPartyPopper } from "react-icons/gi";
import { format } from "date-fns";
import "./index.css";
import { MdAccessTime } from "react-icons/md";



const HolidayCard = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [currentTime, setCurrentTime] = useState(new Date());

  const holidays = [
    { date: "Sep 01", name: "Labor Day", type: "public", days: "in 18 days" },
    { date: "Jul 04", name: "Independence Day", type: "public", days: "in 45 days" },
    { date: "Nov 28", name: "Thanksgiving", type: "public", days: "in 106 days" },
    { date: "Dec 25", name: "Christmas Day", type: "public", days: "in 133 days" },
  ];

  // update every second
  useEffect(() => {
    const timer = setInterval(() => setCurrentTime(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  const toggleDropdown = (e) => {
    e.stopPropagation();
    setIsOpen((prev) => !prev);
  };

  return (
    <div className="dropdown-container">
      {/* Header */}
      <div
        className="dropdown-header d-flex align-items-center justify-content-between"
        onClick={toggleDropdown}
      >
        <div className="holiday-box">
          {/* Date Badge */}
          <div className="date-badge">
            <span className="month">SEP</span>
            <span className="day">01</span>
          </div>

          {/* Content */}
          <div className="holiday-content">
            <div className="holiday-top">
              <span className="holiday-title">
                Labor Day <GiPartyPopper className="text-pink-500" />
              </span>
              <span className="more-link">+5 more</span>
            </div>
            <div className="holiday-bottom">
              <span className="public-badge">Public</span>
              <span className="days-left">in 18 days</span>
              {/* <span className="caret">▼</span> */}
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
                  <div className="month">{holiday.date.split(" ")[0]}</div>
                  <div className="day">{holiday.date.split(" ")[1]}</div>
                </div>
                <div className="holiday-details ms-2">
                  <div className="holiday-title">{holiday.name}</div>
                  <div className="holiday-meta">
                    {holiday.type === "public" && <span className="badge-public">public</span>}
                    <span className="days-left">{holiday.days}</span>
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
          {/* <FaClock className="me-2 text-primary" /> */}
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
