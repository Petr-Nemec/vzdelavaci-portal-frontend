// pages/organizations/[id].jsx - Profil organizace
import { useRouter } from 'next/router';
import Head from 'next/head';
import { useQuery } from 'react-query';
import { fetchOrganization, fetchOrganizationEvents } from '../../api/organizations';
import OrganizationProfile from '../../components/organizations/OrganizationProfile';
import EventList from '../../components/events/EventList';
import LoadingSpinner from '../../components/common/LoadingSpinner';
import ErrorMessage from '../../components/common/ErrorMessage';

export default function OrganizationPage() {
  const router = useRouter();
  const { id } = router.query;
  
  const { data: organization, isLoading: isLoadingOrg, error: orgError } = useQuery(
    ['organization', id],
    () => fetchOrganization(id),
    {
      enabled: !!id,
    }
  );
  
  const { data: eventsData, isLoading: isLoadingEvents } = useQuery(
    ['organizationEvents', id],
    () => fetchOrganizationEvents(id),
    {
      enabled: !!id,
    }
  );
  
  const isLoading = isLoadingOrg || isLoadingEvents;
  
  if (isLoading) return <LoadingSpinner />;
  if (orgError) return <ErrorMessage message="Nepodařilo se načíst organizaci" />;
  if (!organization) return null;

  return (
    <div className="container mx-auto px-4 py-8">
      <Head>
        <title>{organization.name} | Organizace</title>
        <meta name="description" content={organization.description} />
      </Head>
      
      <OrganizationProfile organization={organization} />
      
      <div className="mt-12">
        <h2 className="text-2xl font-bold mb-4">Akce organizace</h2>
        {eventsData && eventsData.events && eventsData.events.length > 0 ? (
          <EventList 
            events={eventsData.events}
            totalPages={eventsData.totalPages}
            currentPage={eventsData.currentPage}
            onPageChange={(page) => router.push(`/organizations/${id}?page=${page}`)}
          />
        ) : (
          <p className="text-gray-500">Tato organizace zatím nemá žádné akce.</p>
        )}
      </div>
    </div>
  );
}
