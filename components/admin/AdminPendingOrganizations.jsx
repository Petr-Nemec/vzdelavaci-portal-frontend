// components/admin/AdminPendingOrganizations.jsx
import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from 'react-query';
import Image from 'next/image';
import { 
  fetchPendingOrganizations, 
  approveOrganization, 
  rejectOrganization 
} from '../../api/admin';
import LoadingSpinner from '../common/LoadingSpinner';
import ErrorMessage from '../common/ErrorMessage';
import toast from 'react-hot-toast';

const AdminPendingOrganizations = () => {
  const queryClient = useQueryClient();
  const [expandedId, setExpandedId] = useState(null);

  const { data: organizations, isLoading, error } = useQuery(
    'pendingOrganizations',
    fetchPendingOrganizations
  );

  const approveMutation = useMutation(
    (id) => approveOrganization(id),
    {
      onSuccess: () => {
        queryClient.invalidateQueries('pendingOrganizations');
        toast.success('Organizace byla schválena');
      },
      onError: () => {
        toast.error('Při schvalování organizace došlo k chybě');
      }
    }
  );

  const rejectMutation = useMutation(
    (id) => rejectOrganization(id),
    {
      onSuccess: () => {
        queryClient.invalidateQueries('pendingOrganizations');
        toast.success('Organizace byla zamítnuta');
      },
      onError: () => {
        toast.error('Při zamítání organizace došlo k chybě');
      }
    }
  );

  const toggleExpand = (id) => {
    setExpandedId(expandedId === id ? null : id);
  };

  if (isLoading) return <LoadingSpinner />;
  if (error) return <ErrorMessage message="Nepodařilo se načíst čekající organizace" />;
  if (!organizations || organizations.length === 0) {
    return (
      <div className="bg-white rounded-lg shadow p-6 mt-4">
        <p className="text-gray-500">Žádné organizace nečekají na schválení.</p>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-lg shadow overflow-hidden">
      <div className="px-4 py-5 sm:px-6">
        <h3 className="text-lg font-medium leading-6 text-gray-900">
          Organizace čekající na schválení
        </h3>
        <p className="mt-1 max-w-2xl text-sm text-gray-500">
          Zkontrolujte a schvalte nebo zamítněte nové organizace
        </p>
      </div>

      <ul className="divide-y divide-gray-200">
        {organizations.map((org) => (
          <li key={org._id} className="px-4 py-4">
            <div className="flex justify-between items-start">
              <div className="flex items-center">
                {org.logo ? (
                  <div className="flex-shrink-0 h-12 w-12 relative">
                    <Image
                      src={org.logo}
                      alt={org.name}
                      layout="fill"
                      objectFit="cover"
                      className="rounded-full"
                    />
                  </div>
                ) : (
                  <div className="flex-shrink-0 h-12 w-12 bg-gray-200 rounded-full flex items-center justify-center">
                    <span className="text-lg font-medium text-gray-500">
                      {org.name.substring(0, 2).toUpperCase()}
                    </span>
                  </div>
                )}
                <div className="ml-4">
                  <h4 className="text-lg font-semibold">{org.name}</h4>
                  <p className="text-sm text-gray-500">
                    Vytvořil: {org.createdBy?.name || 'Neznámý uživatel'}
                  </p>
                  <p className="text-sm text-gray-500">
                    Kontakt: {org.contactEmail}
                  </p>
                </div>
              </div>

              <div className="flex space-x-2">
                <button
                  onClick={() => approveMutation.mutate(org._id)}
                  disabled={approveMutation.isLoading}
                  className="inline-flex items-center px-3 py-1.5 border border-transparent text-xs font-medium rounded-md shadow-sm text-white bg-green-600 hover:bg-green-700 focus:outline-none"
                >
                  Schválit
                </button>
                <button
                  onClick={() => rejectMutation.mutate(org._id)}
                  disabled={rejectMutation.isLoading}
                  className="inline-flex items-center px-3 py-1.5 border border-gray-300 text-xs font-medium rounded-md shadow-sm text-gray-700 bg-white hover:bg-gray-50 focus:outline-none"
                >
                  Zamítnout
                </button>
                <button
                  onClick={() => toggleExpand(org._id)}
                  className="inline-flex items-center px-3 py-1.5 border border-gray-300 text-xs font-medium rounded-md shadow-sm text-gray-700 bg-white hover:bg-gray-50 focus:outline-none"
                >
                  {expandedId === org._id ? 'Skrýt' : 'Zobrazit detail'}
                </button>
              </div>
            </div>

            {expandedId === org._id && (
              <div className="mt-4 pl-16 pr-4">
                <div className="bg-gray-50 p-4 rounded-lg">
                  <h5 className="text-sm font-medium text-gray-700 mb-2">Popis organizace</h5>
                  <p className="text-sm text-gray-600">{org.description}</p>

                  <div className="mt-4 grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <h5 className="text-sm font-medium text-gray-700 mb-2">Kontaktní informace</h5>
                      <p className="text-sm text-gray-600">
                        Email: {org.contactEmail}
                      </p>
                      {org.contactPhone && (
                        <p className="text-sm text-gray-600">
                          Telefon: {org.contactPhone}
                        </p>
                      )}
                      {org.website && (
                        <p className="text-sm text-gray-600">
                          Web: {org.website}
                        </p>
                      )}
                    </div>

                    <div>
                      <h5 className="text-sm font-medium text-gray-700 mb-2">Adresa</h5>
                      {org.address && (
                        <p className="text-sm text-gray-600">
                          {org.address.street && `${org.address.street}, `}
                          {org.address.city && `${org.address.city}, `}
                          {org.address.postalCode && org.address.postalCode}
                        </p>
                      )}
                    </div>
                  </div>

                  <div className="mt-4">
                    <h5 className="text-sm font-medium text-gray-700 mb-2">Vytvořeno</h5>
                    <p className="text-sm text-gray-600">
                      {new Date(org.createdAt).toLocaleDateString()} 
                      {' '} 
                      {new Date(org.createdAt).toLocaleTimeString()}
                    </p>
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

export default AdminPendingOrganizations;
