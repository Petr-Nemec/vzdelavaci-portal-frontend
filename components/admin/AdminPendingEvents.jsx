// components/admin/AdminPendingEvents.jsx
import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from 'react-query';
import Link from 'next/link';
import { 
  fetchPendingEvents, 
  approveEvent, 
  rejectEvent 
} from '../../api/admin';
import LoadingSpinner from '../common/LoadingSpinner';
import ErrorMessage from '../common/ErrorMessage';
import { formatDate, formatTime } from '../../utils/dateFormat';
import toast from 'react-hot-toast';

const AdminPendingEvents = () => {
  const queryClient = useQueryClient();
  const [expandedId, setExpandedId] = useState(null);

  const { data: events, isLoading, error } = useQuery(
    'pendingEvents',
    fetchPendingEvents
  );

  const approveMutation = useMutation(
    (id) => approveEvent(id),
    {
      onSuccess: () => {
        queryClient.invalidateQueries('pendingEvents');
        toast.success('Akce byla schválena');
      },
      onError: () => {
        toast.error('Při schvalování akce došlo k chybě');
      }
    }
  );

  const rejectMutation = useMutation(
    (id) => rejectEvent(id),
    {
      onSuccess: () => {
        queryClient.invalidateQueries('pendingEvents');
        toast.success('Akce byla zamítnuta');
      },
      onError: () => {
        toast.error('Při zamítání akce došlo k chybě');
      }
    }
  );

  const toggleExpand = (id) => {
    setExpandedId(expandedId === id ? null : id);
  };

  if (isLoading) return <LoadingSpinner />;
  if (error) return <ErrorMessage message="Nepodařilo se načíst čekající akce" />;
  if (!events || events.length === 0) {
    return (
      <div className="bg-white rounded-lg shadow p-6 mt-4">
        <p className="text-gray-500">Žádné akce nečekají na schválení.</p>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-lg shadow overflow-hidden">
      <div className="px-4 py-5 sm:px-6">
        <h3 className="text-lg font-medium leading-6 text-gray-900">
          Akce čekající na schválení
        </h3>
        <p className="mt-1 max-w-2xl text-sm text-gray-500">
          Zkontrolujte a schvalte nebo zamítněte nové akce
        </p>
      </div>

      <ul className="divide-y divide-gray-200">
        {events.map((event) => (
          <li key={event._id} className="px-4 py-4">
            <div className="flex justify-between items-start">
              <div>
                <h4 className="text-lg font-semibold">{event.title}</h4>
                <p className="text-sm text-gray-500">
                  Organizátor: {event.organizerId?.name || 'Neznámý organizátor'}
                </p>
                <p className="text-sm text-gray-500">
                  Datum: {formatDate(event.startDate)}, {formatTime(event.startDate)} - {formatTime(event.endDate)}
                </p>
                <p className="text-sm text-gray-500">
                  Místo: {event.location.city}
                </p>
              </div>

              <div className="flex space-x-2">
                <button
                  onClick={() => approveMutation.mutate(event._id)}
                  disabled={approveMutation.isLoading}
                  className="inline-flex items-center px-3 py-1.5 border border-transparent text-xs font-medium rounded-md shadow-sm text-white bg-green-600 hover:bg-green-700 focus:outline-none"
                >
                  Schválit
                </button>
                <button
                  onClick={() => rejectMutation.mutate(event._id)}
                  disabled={rejectMutation.isLoading}
                  className="inline-flex items-center px-3 py-1.5 border border-gray-300 text-xs font-medium rounded-md shadow-sm text-gray-700 bg-white hover:bg-gray-50 focus:outline-none"
                >
                  Zamítnout
                </button>
                <button
                  onClick={() => toggleExpand(event._id)}
                  className="inline-flex items-center px-3 py-1.5 border border-gray-300 text-xs font-medium rounded-md shadow-sm text-gray-700 bg-white hover:bg-gray-50 focus:outline-none"
                >
                  {expandedId === event._id ? 'Skrýt' : 'Zobrazit detail'}
                </button>
              </div>
            </div>

            {expandedId === event._id && (
              <div className="mt-4 pl-4 pr-4">
                <div className="bg-gray-50 p-4 rounded-lg">
                  <p className="text-sm text-gray-600">{event.shortDescription}</p>
                  
                  <div className="mt-3">
                    <h5 className="text-sm font-medium text-gray-700 mb-1">Popis akce</h5>
                    <div className="text-sm text-gray-600 prose max-w-none" dangerouslySetInnerHTML={{ __html: event.description }} />
                  </div>

                  <div className="mt-4 grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <h5 className="text-sm font-medium text-gray-700 mb-1">Detaily události</h5>
                      <p className="text-sm text-gray-600">
                        Typ: {event.eventType}
                      </p>
                      <p className="text-sm text-gray-600">
                        Věková skupina: {event.ageRange.min} - {event.ageRange.max} let
                      </p>
                      <p className="text-sm text-gray-600">
                        Cena: {event.price.isFree ? 'Zdarma' : `${event.price.amount} ${event.price.currency}`}
                      </p>
                      {event.registrationUrl && (
                        <p className="text-sm text-gray-600">
                          Registrace: <a href={event.registrationUrl} target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline">Odkaz</a>
                        </p>
                      )}
                    </div>

                    <div>
                      <h5 className="text-sm font-medium text-gray-700 mb-1">Adresa</h5>
                      <p className="text-sm text-gray-600">
                        {event.location.name && `${event.location.name}, `}
                        {event.location.address && `${event.location.address}, `}
                        {event.location.city}
                        {event.location.postalCode && `, ${event.location.postalCode}`}
                      </p>
                    </div>
                  </div>

                  <div className="mt-3 flex justify-end">
                    <Link href={`/events/${event._id}`}>
                      <a className="text-sm text-blue-600 hover:text-blue-800">
                        Zobrazit celou akci
                      </a>
                    </Link>
                  </div>
                </div>
              </div>
            )}
          </li>
        ))}
      </ul>
    </div>
  );
};

export default AdminPendingEvents;
