import React, { useState, useCallback } from 'react';
import { useTheme } from '@context/ThemeContext';
import Button from '@components/common/Button';
import Calendar from 'react-calendar';
import { MdEvent } from 'react-icons/md';
import { VerticalTimeline, VerticalTimelineElement } from 'react-vertical-timeline-component';
import './index.css';

// Initial event data (static for now)
const initialEvents = {
    '2023-01-01': [
        'New Year (Holiday)',
        'Company Anniversary (US)',
        'Robert (C.E.O) - Vacation Leave',
        'Team Anniversary (India)'
    ],
    '2023-01-13': [
        'Pongal Festival (Holiday)',
        'Meeting with US Client (Vacation Leave)'
    ],
    '2023-01-26': ['Republic Day (Holiday)'],
    '2023-01-12': ['Sankranthi']
};

export default function EventCalendar() {
    const { themeMode, themeColor } = useTheme();

    // Selected date in the calendar
    const [selectedDate, setSelectedDate] = useState(new Date('2023-01-13'));
    // To toggle event creation form
    const [showForm, setShowForm] = useState(false);
    // State for new event form inputs
    const [formData, setFormData] = useState({ name: '', date: '', description: '' });
    // Event data (dynamic + initial events)
    const [eventData, setEventData] = useState(initialEvents);

    // Utility: format date into YYYY-MM-DD
    const formatDateKey = useCallback((date) => date.toISOString().split('T')[0], []);

    // Convert eventData object into sorted list for timeline
    const groupedEvents = Object.entries(eventData)
        .map(([dateStr, events]) => ({ date: new Date(dateStr), events }))
        .sort((a, b) => a.date - b.date);

    // Handle input change in event creation form
    const handleInputChange = useCallback((e) => {
        const { name, value } = e.target;
        setFormData((prev) => ({ ...prev, [name]: value }));
    }, []);

    // Add new event to eventData
    const handleAddEvent = useCallback(() => {
        const { name, date, description } = formData;
        if (!name || !date || !description) {
            alert('Please fill in all fields.');
            return;
        }

        setEventData((prevEventData) => {
            const updatedData = { ...prevEventData };
            if (!updatedData[date]) updatedData[date] = [];
            updatedData[date].push(`${name} (${description})`);
            return updatedData;
        });

        setShowForm(false);
        setFormData({ name: '', date: '', description: '' });
    }, [formData]);

    // Close form and reset state
    const handleCloseForm = useCallback(() => {
        setShowForm(false);
        setFormData({ name: '', date: '', description: '' });
    }, []);

    // Highlight dates in the calendar (selected / with events)
    const tileClassName = useCallback(
        ({ date }) => {
            const dateKey = formatDateKey(date);
            const selectedKey = formatDateKey(selectedDate);
            if (dateKey === selectedKey) return 'ec-selected-day';
            return eventData[dateKey] ? 'ec-marked-day' : '';
        },
        [eventData, selectedDate, formatDateKey]
    );

    return (
        <div className={`ec-container ${themeMode} ${themeColor} bg-${themeMode}-two`}>
            <div className="container">
                {/* Header */}
                <div className="row mb-3">
                    <div className="col-12">
                        <div className={`event-calender-header bg-${themeMode}-one`}>
                            <h4>Event Calendar</h4>
                            <Button
                                variant="solid"
                                size="sm"
                                label={<span className='d-none d-md-block'>Create Event</span>}
                                iconLeft={<MdEvent />}
                                onClick={() => setShowForm(true)}
                            />
                        </div>
                    </div>
                </div>

                <div className="row">
                    {/* Events Timeline */}
                    <div className="col-md-6 mb-4">
                        <div className={`ec-event-card bg-${themeMode}-one`}>
                            <h5 className="ec-heading">Events</h5>
                            <VerticalTimeline className="ec-timeline">
                                {groupedEvents.map(({ date, events }, idx) => (
                                    <VerticalTimelineElement
                                        key={idx}
                                        date={date.toLocaleDateString('en-GB', {
                                            day: 'numeric',
                                            month: 'long',
                                            year: 'numeric',
                                        })}
                                        icon={<MdEvent />}
                                        iconClassName="ec-timeline-icon"
                                        contentClassName="ec-timeline-content"
                                        contentArrowStyle={{ borderRight: '7px solid var(--theme-color)' }}
                                    >
                                        <div className="ec-event-wrapper">
                                            {events.map((event, i) => (
                                                <p key={i} className="ec-event-text">{event}</p>
                                            ))}
                                        </div>
                                    </VerticalTimelineElement>
                                ))}
                            </VerticalTimeline>
                        </div>
                    </div>

                    {/* Calendar */}
                    <div className="col-md-6 d-flex justify-content-center">
                        <div className={`ec-calendar-card bg-${themeMode}-one`}>
                            <Calendar
                                onChange={setSelectedDate}
                                value={selectedDate}
                                tileClassName={tileClassName}
                            />
                        </div>
                    </div>
                </div>
            </div>

            {/* Offcanvas Form */}
            <div className={`offcanvas offcanvas-end ${showForm ? 'show d-block' : ''}`} tabIndex="-1" style={{ visibility: showForm ? 'visible' : 'hidden' }}>
                <div className="offcanvas-header">
                    <h5 className="offcanvas-title">Add Event</h5>
                    <button type="button" className="btn-close" onClick={handleCloseForm}></button>
                </div>
                <div className="offcanvas-body">
                    <label className="form-label">Event Name*</label>
                    <input
                        type="text"
                        className="form-control"
                        name="name"
                        value={formData.name}
                        onChange={handleInputChange}
                    />

                    <label className="form-label">Date*</label>
                    <input
                        type="date"
                        className="form-control"
                        name="date"
                        value={formData.date}
                        onChange={handleInputChange}
                    />

                    <label className="form-label">Description*</label>
                    <textarea
                        className="form-control"
                        name="description"
                        value={formData.description}
                        onChange={handleInputChange}
                    ></textarea>

                    <div className="d-flex justify-content-end gap-2 mt-3">
                        <Button variant='outline' size='sm' label={'Cancel'} onClick={handleCloseForm} />
                        <Button variant='solid' size='sm' label={'Apply'} onClick={handleAddEvent} />
                    </div>
                </div>
            </div>
        </div>
    );
}
