import React, { useState } from "react";
import { FaChevronLeft, FaChevronRight, FaBirthdayCake, FaArrowUp, FaBriefcase } from "react-icons/fa";
import { GiPartyPopper } from "react-icons/gi";
import './index.css';



const UpcomingEvents = () => {
  // Sample Data
  const events = [
    {
      id: 1,
      name: "Sarah Johnson",
      team: "Engineering",
      eventType: "Birthday",
      when: "Tomorrow",
      avatar: "https://randomuser.me/api/portraits/women/44.jpg",
    },
    {
      id: 2,
      name: "Michael Chen",
      team: "Marketing",
      eventType: "Work Anniversary",
      when: "In 3 days",
      avatar: "https://randomuser.me/api/portraits/men/32.jpg",
    },
    {
      id: 3,
      name: "Emily Davis",
      team: "Sales",
      eventType: "Promotion",
      when: "Today",
      avatar: "https://randomuser.me/api/portraits/women/68.jpg",
    },
    {
      id: 4,
      name: "David Wilson",
      team: "HR",
      eventType: "Birthday",
      when: "In 5 days",
      avatar: "https://randomuser.me/api/portraits/men/12.jpg",
    },
    {
      id: 5,
      name: "Olivia Brown",
      team: "Finance",
      eventType: "Birthday",
      when: "Next Week",
      avatar: "https://randomuser.me/api/portraits/women/21.jpg",
    },
    {
      id: 6,
      name: "James Smith",
      team: "Design",
      eventType: "Work Anniversary",
      when: "Today",
      avatar: "https://randomuser.me/api/portraits/men/45.jpg",
    },
  ];
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


  // Show 2 per slide
  const itemsPerSlide = 2;
  const totalSlides = Math.ceil(events.length / itemsPerSlide);

  const [currentSlide, setCurrentSlide] = useState(0);

  // Next/Prev Slide
  const nextSlide = () => {
    setCurrentSlide((prev) => (prev + 1) % totalSlides);
  };

  const prevSlide = () => {
    setCurrentSlide((prev) => (prev - 1 + totalSlides) % totalSlides);
  };

  // Slice events for current slide
  const startIndex = currentSlide * itemsPerSlide;
  const currentEvents = events.slice(startIndex, startIndex + itemsPerSlide);

  return (
    <div className="upcoming-events">
      {/* Header */}
      <div className="header">
        <h3>  <GiPartyPopper className="text-pink-500" /> Upcoming Events</h3>
        <div className="nav-buttons">
          <button className="nav-icons" onClick={prevSlide}><FaChevronLeft /></button>
          <button className="nav-icons" onClick={nextSlide}><FaChevronRight /></button>
        </div>
      </div>

      {/* Event Cards */}
      <div className="event-list">
        {currentEvents.map((e) => (
          <div key={e.id} className="event-card">
            <img src={e.avatar} alt={e.name} className="avatar" />
            <div className="info">
              <h4>{e.name}</h4>
              <p>{e.team}</p>
              <span className={`badge ${e.eventType.toLowerCase().replace(" ", "-")}`}>
                {getEventIcon(e.eventType)} {e.eventType}
              </span>

            </div>
            <div className="when">{e.when}</div>
          </div>
        ))}
      </div>

      {/* Carousel Dots */}
      <div className="dots">
        {Array.from({ length: totalSlides }).map((_, idx) => (
          <span
            key={idx}
            className={idx === currentSlide ? "dot active" : "dot"}
            onClick={() => setCurrentSlide(idx)}
          />
        ))}
      </div>
    </div>
  );
};

export default UpcomingEvents;
