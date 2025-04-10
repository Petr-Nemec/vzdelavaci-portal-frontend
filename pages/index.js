import { useState, useEffect } from 'react';
import Head from 'next/head';

export default function Home() {
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    async function fetchEvents() {
      try {
        const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/events`);
        const data = await response.json();
        setEvents(data.events);
        setLoading(false);
      } catch (err) {
        console.error('Error fetching events:', err);
        setError('Chyba při načítání událostí');
        setLoading(false);
      }
    }

    fetchEvents();
  }, []);

  return (
    <div className="container mx-auto px-4 py-8">
      <Head>
        <title>Vzdělávací akce Moravskoslezského kraje</title>
        <meta name="description" content="Vzdělávací akce a příležitosti v MSK" />
      </Head>

      <h1 className="text-3xl font-bold mb-6">Vzdělávací akce Moravskoslezského kraje</h1>
      
      {loading && <p>Načítání...</p>}
      {error && <p className="text-red-500">{error}</p>}
      
      {!loading && !error && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {events.map(event => (
            <div key={event._id} className="border rounded-lg p-4 shadow-md">
              <h2 className="text-xl font-semibold">{event.title}</h2>
              <p className="text-gray-600 mt-2">{event.shortDescription}</p>
              <div className="mt-4">
                <p><strong>Místo:</strong> {event.location.city}</p>
                <p><strong>Datum:</strong> {new Date(event.startDate).toLocaleDateString()}</p>
                <p><strong>Typ:</strong> {event.eventType}</p>
                <p><strong>Organizátor:</strong> {event.organizerId.name}</p>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
