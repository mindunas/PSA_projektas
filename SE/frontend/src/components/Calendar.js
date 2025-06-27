import React, { useState, useEffect } from 'react';
import { Calendar as BigCalendar, dateFnsLocalizer } from 'react-big-calendar';
import { format, parse, startOfWeek, getDay, add } from 'date-fns';
import enUS from 'date-fns/locale/en-US';
import 'react-big-calendar/lib/css/react-big-calendar.css';
import axios from 'axios';

const locales = { 'en-US': enUS };
const localizer = dateFnsLocalizer({ format, parse, startOfWeek, getDay, locales });

export default function CalendarView({ currentUser }) {
  const [events, setEvents] = useState([]);

  // Load all events on mount
  useEffect(() => {
    (async () => {
      try {
        const res = await axios.get('/api/events');
        setEvents(res.data.map(ev => ({
          id: ev._id, // event identifier
          title: ev.title, // event title
          user: ev.user, // user who created the event
          start: new Date(ev.date), // start date of the event
          end: add(new Date(ev.date), { hours: 1 }), // end date of the event (1 hour later)
          createdAt: ev.createdAt 
        })));
      } catch (err) {
        console.error(err);
      }
    })();
  }, []);

  // Add a new event
  const handleSelectSlot = async ({ start }) => {
    const title = prompt('Enter event title:');
    if (!title) return;
    try {
      const res = await axios.post('/api/events', {
        date: start.toISOString(),
        title,
        user: currentUser.username
      });
      const ev = res.data;
      setEvents(prev => [
        ...prev,
        {
          id: ev._id,
          title: ev.title,
          user: ev.user,
          start: new Date(ev.date),
          end: add(new Date(ev.date), { hours: 1 }),
          allDay: true,
          createdAt: ev.createdAt
        }
      ]);
    } catch (err) {
      console.error(err);
    }
  };

  // Edit an existing event
  const handleSelectEvent = async (event) => {
    const newTitle = prompt('Edit title:', event.title);
    if (newTitle == null) return;
    try {
      const res = await axios.put(`/api/events/${event.id}`, {
        title: newTitle,
        date: event.start.toISOString()
      });
      const updated = res.data;
      setEvents(prev => prev.map(ev =>
        ev.id === updated._id
          ? { ...ev, title: updated.title }
          : ev
      ));
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div style={{ height: '80vh' }}>
      <BigCalendar
        key={events.length}
        localizer={localizer}
        events={events}
        startAccessor="start"
        endAccessor="end"
        selectable
        onSelectSlot={handleSelectSlot}
        onSelectEvent={handleSelectEvent}
        views={[ 'month', 'week', 'day' ]}
        defaultView="month"
        tooltipAccessor={evt =>
          `By ${evt.user} on ${new Date(evt.createdAt).toLocaleString()}`
        }
      />
    </div>
  );
}