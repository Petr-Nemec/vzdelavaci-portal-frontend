// pages/calendar.jsx - Kalendářové zobrazení
import { useState, useEffect } from 'react';
import Head from 'next/head';
import FullCalendar from '@fullcalendar/react';
import dayGridPlugin from '@fullcalendar/daygrid';
import timeGridPlugin from '@fullcalendar/timegrid';
import interactionPlugin from '@fullcalendar/interaction';
import csLocale from '@fullcalendar/core/locales/cs';
import { useRouter } from 'next/router';
import { fetchCalendarEvents } from '../api/events';
import EventFilter from '../components/events/EventFilter';

export default function CalendarPage() {
  const router = useRouter();
  const [events, setEvents] = useState([]);
  const [filters, setFilters] = useState({
    city: '',
    eventType: ''
  });
  const [dateRange, setDateRange] = useState({
    start: '',
    end: ''
  });

  const loadEvents = async () => {
    try {
      const data = await fetchCalendarEvents({
        ...filters,
        start: dateRange.start,
        end: dateRange.end
      });
      setEvents(data);
    } catch (error) {
      console.error('Error loading calendar events:', error);
    }
  };

  // Načtení událostí při změně filtrů nebo rozsahu data
  useEffect(() => {
    if (dateRange.start && dateRange.end) {
      loadEvents();
    }
  }, [filters, dateRange]);

  const handleFilterChange = (newFilters) => {
    setFilters({ ...filters, ...newFilters });
  };

  // Aktualizace rozsahu dat při změně zobrazení kalendáře
  const handleDatesSet = (info) => {
    setDateRange({
      start: info.startStr,
      end: info.endStr
    });
  };

  // Přesměrování na detail události po kliknutí
  const handleEventClick = (info) => {
    router.push(`/events/${info.event.id}`);
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <Head>
        <title>Kalendář akcí | Vzdělávací akce</title>
        <meta name="description" content="Kalendář vzdělávacích akcí v Moravskoslezském kraji" />
      </Head>

      <h1 className="text-3xl font-bold mb-6">Kalendář vzdělávacích akcí</h1>

      <div className="mb-6">
        <EventFilter 
          filters={filters} 
          onFilterChange={handleFilterChange}
          simplified={true} // Zjednodušená verze filtrů pro kalendář
        />
      </div>

      <div className="bg-white rounded-lg shadow-md p-4">
        <FullCalendar
          plugins={[dayGridPlugin, timeGridPlugin, interactionPlugin]}
          initialView="dayGridMonth"
          headerToolbar={{
            left: 'prev,next today',
            center: 'title',
            right: 'dayGridMonth,timeGridWeek,timeGridDay'
          }}
          locale={csLocale}
          events={events}
          eventClick={handleEventClick}
          datesSet={handleDatesSet}
          height="auto"
          eventTimeFormat={{
            hour: '2-digit',
            minute: '2-digit',
            hour12: false
          }}
          eventContent={(eventInfo) => (
            <div className="text-xs p-1">
              <div className="font-semibold">{eventInfo.event.title}</div>
              <div>{eventInfo.event.extendedProps.location}</div>
            </div>
          )}
        />
      </div>
    </div>
  );
}
