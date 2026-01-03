import React, { useState, useEffect } from 'react';
import { Calendar, momentLocalizer } from 'react-big-calendar';
import moment from 'moment';
import 'react-big-calendar/lib/css/react-big-calendar.css';
import '../App.css'; // Ensure we have styles

const localizer = momentLocalizer(moment);

const CalendarView = () => {
    const [events, setEvents] = useState([]);

    useEffect(() => {
        const fetchEvents = async () => {
            const user = JSON.parse(localStorage.getItem('user'));
            if (!user) return;

            try {
                const response = await fetch(`http://localhost:5000/api/users/${user.id}/calendar`);
                if (response.ok) {
                    const data = await response.json();
                    
                    // Convert date strings to Date objects
                    const formattedEvents = data.map(event => ({
                        ...event,
                        start: new Date(event.start),
                        end: new Date(event.end)
                    }));
                    
                    setEvents(formattedEvents);
                } else {
                    console.error('Failed to fetch calendar events');
                }
            } catch (error) {
                console.error('Error fetching calendar:', error);
            }
        };

        fetchEvents();
    }, []);

    const eventStyleGetter = (event, start, end, isSelected) => {
        let style = {
            backgroundColor: '#3174ad',
            borderRadius: '5px',
            opacity: 0.8,
            color: 'white',
            border: '0px',
            display: 'block'
        };
        return { style };
    };

    return (
        <div style={{ height: '80vh', padding: '20px' }}>
            <h2>My Trip Calendar</h2>
            <Calendar
                localizer={localizer}
                events={events}
                startAccessor="start"
                endAccessor="end"
                style={{ height: '100%' }}
                eventPropGetter={eventStyleGetter}
                onSelectEvent={event => alert(`${event.title}: ${event.resource.destination} ($${event.resource.budget})`)}
            />
        </div>
    );
};

export default CalendarView;
