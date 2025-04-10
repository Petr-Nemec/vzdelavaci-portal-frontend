// pages/index.jsx - Hlavní stránka
import Head from 'next/head';
import { useState } from 'react';
import EventList from '../components/events/EventList';
import EventFilter from '../components/events/EventFilter';
import CallToAction from '../components/common/CallToAction';
import { useAuth } from '../hooks/useAuth';
import { useEvents } from '../hooks/useEvents';

export default function Home() {
  const { isAuthenticated, isOrganization } = useAuth();
  const [filters, setFilters] = useState({
    city: '',
    eventType: '',
    startDate: '',
    endDate: '',
    minAge: '',
    maxAge: '',
    search: ''
  });
  
  const { events, isLoading, totalPages, currentPage, setPage } = useEvents(filters);

  const handleFilterChange = (newFilters) => {
    setFilters({ ...filters, ...newFilters });
    setPage(1); // Při změně filtrů resetujeme stránkování
  };

  return (
    <div>
      <Head>
        <title>Vzdělávací akce Moravskoslezského kraje</title>
        <meta name="description" content="Objevte vzdělávací akce, stáže, soutěže a další příležitosti v Moravskoslezském kraji" />
      </Head>

      <section className="bg-gradient-to-r from-blue-600 to-blue-800 py-12 text-white">
        <div className="container mx-auto px-4">
          <h1 className="text-4xl font-bold mb-4">Vzdělávací příležitosti pro studenty</h1>
          <p className="text-xl mb-8">
            Objevte workshopy, kurzy, soutěže a další vzdělávací akce v Moravskoslezském kraji
          </p>
          
          {!isAuthenticated && (
            <CallToAction
              text="Jste organizace? Přidejte se k nám a sdílejte své akce"
              buttonText="Přihlásit se"
              href="/login"
            />
          )}
          
          {isAuthenticated && isOrganization && (
            <CallToAction
              text="Chcete přidat novou akci?"
              buttonText="Vytvořit akci"
              href="/events/create"
            />
          )}
        </div>
      </section>

      <section className="container mx-auto px-4 py-8">
        <EventFilter filters={filters} onFilterChange={handleFilterChange} />
        
        <div className="mt-8">
          <EventList 
            events={events} 
            isLoading={isLoading} 
            totalPages={totalPages}
            currentPage={currentPage}
            onPageChange={setPage}
          />
        </div>
      </section>
    </div>
  );
}
