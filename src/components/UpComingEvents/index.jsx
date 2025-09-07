import React, { useState, useRef, useEffect } from "react";
import { useKeenSlider } from "keen-slider/react";
import {
  FaChevronLeft,
  FaChevronRight,
  FaBirthdayCake,
  FaArrowUp,
  FaBriefcase,
} from "react-icons/fa";
import { GiPartyPopper } from "react-icons/gi";
import "keen-slider/keen-slider.min.css";
import "./index.css"; // Your styles
import { useTheme } from '@context/ThemeContext';

const UpcomingEvents = ({ events }) => {
   const { themeMode } = useTheme();
  /**
   * Utility: Get event icon based on type
   */
  const getEventIcon = (type) => {
    switch (type) {
      case "Birthday":
        return <FaBirthdayCake className="event-icon" />;
      case "Promotion":
        return <FaArrowUp className="event-icon" />;
      case "Work Anniversary":
        return <FaBriefcase className="event-icon" />;
      default:
        return null;
    }
  };

  /**
   * Utility: Get "when" label (Today, Tomorrow, In X days, etc.)
   */
  const getWhenLabel = (eventDateStr) => {
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const eventDate = new Date(eventDateStr);
    eventDate.setHours(0, 0, 0, 0);

    const diffTime = eventDate - today;
    const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24));

    if (diffDays < 0) return null; // Past events → hide
    if (diffDays === 0) return "Today";
    if (diffDays === 1) return "Tomorrow";
    if (diffDays === 7) return "Next Week";
    if (diffDays > 30) return null; // Only show events within 30 days
    return `In ${diffDays} days`;
  };

  /**
   * Utility: Get initials (fallback avatar)
   */
  const getInitials = (name) => {
    if (!name) return "?";
    const parts = name.split(" ");
    const initials = parts
      .map((p) => p.charAt(0).toUpperCase())
      .slice(0, 2) // only first 2 parts
      .join(" "); // put space between letters
    return initials;
  };

  /**
   * Preprocess events → add "when" and filter past/outside range
   */
  const upcomingEvents = events
    .map((e) => ({ ...e, when: getWhenLabel(e.eventDate) }))
    .filter((e) => e.when !== null);

  /**
   * Group events by type
   */
  const groupedEvents = upcomingEvents.reduce((acc, event) => {
    if (!acc[event.eventType]) acc[event.eventType] = [];
    acc[event.eventType].push(event);
    return acc;
  }, {});

  const eventTypes = Object.keys(groupedEvents);

  // Slider state
  const [currentSlide, setCurrentSlide] = useState(0);
  const [pause, setPause] = useState(false);
  const eventListRef = useRef(null);

  // Keen slider setup
  const [sliderRef, instanceRef] = useKeenSlider(
    {
      initial: 0,
      slideChanged(s) {
        setCurrentSlide(s.track.details.rel);
      },
      loop: true,
    },
    [
      (slider) => {
        let timeout;
        let mouseOver = false;
        function clearNextTimeout() {
          clearTimeout(timeout);
        }
        function nextTimeout() {
          clearTimeout(timeout);
          if (!mouseOver && !pause) {
            timeout = setTimeout(() => {
              slider.next();
            }, 5000); // Auto-slide every 5s
          }
        }
        slider.on("created", () => {
          slider.container.addEventListener("mouseover", () => {
            mouseOver = true;
            clearNextTimeout();
          });
          slider.container.addEventListener("mouseout", () => {
            mouseOver = false;
            nextTimeout();
          });
          nextTimeout();
        });
        slider.on("dragStarted", clearNextTimeout);
        slider.on("animationEnded", nextTimeout);
        slider.on("updated", nextTimeout);
      },
    ]
  );

  /**
   * Pause auto-slide when scrolling inside event list
   */
  useEffect(() => {
    const listEl = eventListRef.current;
    const sectionEl = document.querySelector(".upcoming-events");
    if (!listEl || !sectionEl) return;

    // Pause when scrolling inside event list
    const handleScroll = () => {
      setPause(true);
      clearTimeout(listEl._scrollTimeout);
      listEl._scrollTimeout = setTimeout(() => setPause(false), 1000);
    };

    // Pause when hovering entire section
    const handleMouseEnter = () => setPause(true);
    const handleMouseLeave = () => setPause(false);

    listEl.addEventListener("scroll", handleScroll);
    sectionEl.addEventListener("mouseenter", handleMouseEnter);
    sectionEl.addEventListener("mouseleave", handleMouseLeave);

    return () => {
      listEl.removeEventListener("scroll", handleScroll);
      sectionEl.removeEventListener("mouseenter", handleMouseEnter);
      sectionEl.removeEventListener("mouseleave", handleMouseLeave);
    };
  }, []);

  // Fallback when no events
  if (upcomingEvents.length === 0) {
    return (
      <div className="upcoming-events no-events">
        <div className="no-events-message">
          <h4>No Upcoming Events</h4>
          <p>Check back later 🎉</p>
        </div>
      </div>
    );
  }

  return (
       <div className={`upcoming-events ${themeMode === "dark" ? "dark-mode" : ""}`}>
      {/* Header */}
      <div className="header">
        <h3>
          <GiPartyPopper className="text-pink-500" /> Upcoming Events
        </h3>
        <div className="nav-buttons">
          <button
            className="nav-icons"
            onClick={() => instanceRef.current?.prev()}
          >
            <FaChevronLeft />
          </button>
          <button
            className="nav-icons"
            onClick={() => instanceRef.current?.next()}
          >
            <FaChevronRight />
          </button>
        </div>
      </div>

      <div ref={sliderRef} className="keen-slider">
        {eventTypes.map((type) => (
          <div key={`slide-${type}`} className="keen-slider__slide">
            <div className="sub-header-with-line">
              <span className="line" />
              <span className="icon-text">
                {getEventIcon(type)} {type}
              </span>
              <span className="line" />
            </div>

            <div ref={eventListRef} className="event-list scrollable">
              {groupedEvents[type].map((e, idx) => (
                <div key={`${type}-${e.id}-${idx}`} className="event-card">
                  {e.avatar ? (
                    <img src={e.avatar} alt={e.name} className="avatar" />
                  ) : (
                    <div className="avatar-fallback">{getInitials(e.name)}</div>
                  )}
                  <div className="info">
                    <h4>{e.name}</h4>
                    <p>{e.team}</p>
                  </div>
                  <div className="when">{e.when}</div>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>

      <div className="dots">
        {eventTypes.map((type, idx) => (
          <span
            key={`dot-${type}`}
            className={idx === currentSlide ? "dot active" : "dot"}
            onClick={() => instanceRef.current?.moveToIdx(idx)}
          />
        ))}
      </div>

    </div>
  );
};

export default UpcomingEvents;
