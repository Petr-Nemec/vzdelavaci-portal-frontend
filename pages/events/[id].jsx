// pages/events/[id].jsx - Detail události
import { useRouter } from 'next/router';
import Head from 'next/head';
import { useQuery } from 'react-query';
import { fetchEvent } from '../../api/events';
import EventDetails from '../../components/events/EventDetails';
import LoadingSpinner from '../../components/common/LoadingSpinner';
import ErrorMessage from '../../components/common/ErrorMessage';

export default function EventPage() {
  const router = useRouter();
  const { id } = router.query;
  
  const { data: event, isLoading, error } = useQuery(
    ['event', id],
    () => fetchEvent(id),
    {
      enabled: !!id, // Spustit dotaz pouze pokud máme ID
    }
  );

  if (isLoading) return <LoadingSpinner />;
  if (error) return <ErrorMessage message="Nepodařilo se načíst událost" />;
  if (!event) return null;

  return (
    <div className="container mx-auto px-4 py-8">
      <Head>
        <title>{event.title} | Vzdělávací akce</title>
        <meta name="description" content={event.shortDescription} />
      </Head>
      
      <EventDetails event={event} />
    </div>
  );
}
