// components/organizations/OrganizationEvents.jsx
import { useState } from 'react';
import Link from 'next/link';
import { useQuery } from 'react-query';
import { useAuth } from '../../hooks/useAuth';
import { fetchOrganizationEvents } from '../../api/organizations';
import EventList from '../events/EventList';
import LoadingSpinner from '../common/LoadingSpinner';
import ErrorMessage from '../common/ErrorMessage';

const OrganizationEvents = () => {
  const { user } = useAuth();
  const [currentPage, setCurrentPage] = useState(1);

  const { data, isLoading, error } = useQuery(
    ['organizationEvents', user?.organization?._id, currentPage],
    () => fetchOrganizationEvents(user?.organization?._id, { page: currentPage }),
    {
      enabled: !!user?.organization?._id
    }
  );

  if (isLoading) return <LoadingSpinner />;
  if (error) return <ErrorMessage message="Nepodařilo se načíst akce" />;

  // Pokud organizace nemá žádné akce nebo není schválena
  if (!user?.isApproved) {
    return (
      <div className="bg-white rounded-lg shadow p-6">
        <p className="text-gray-500 mb-4">
          Vaše organizace čeká na schválení administrátorem. Po schválení budete moci přidávat akce.
        </p>
      </div>
    );
  }

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-xl font-bold">Vaše akce</h2>
        <Link href="/events/create">
          <a className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700">
            Přidat novou akci
          </a>
        </Link>
      </div>

      {data?.events && data.events.length > 0 ? (
        <EventList 
          events={data.events}
          totalPages={data.totalPages}
          currentPage={data.currentPage}
          onPageChange={setCurrentPage}
        />
      ) : (
        <div className="bg-white rounded-lg shadow p-6">
          <p className="text-gray-500 mb-4">
            Zatím nemáte žádné akce. Začněte vytvořením své první akce.
          </p>
          <Link href="/events/create">
            <a className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700">
              Vytvořit první akci
            </a>
          </Link>
        </div>
      )}
    </div>
  );
};

export default OrganizationEvents;
