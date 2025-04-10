// components/admin/AdminUsers.jsx
import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from 'react-query';
import Image from 'next/image';
import { fetchUsers, updateUserRole } from '../../api/admin';
import LoadingSpinner from '../common/LoadingSpinner';
import ErrorMessage from '../common/ErrorMessage';
import toast from 'react-hot-toast';

const UserRoleBadge = ({ role }) => {
  const colors = {
    student: 'bg-green-100 text-green-800',
    organization: 'bg-blue-100 text-blue-800',
    admin: 'bg-purple-100 text-purple-800'
  };

  const labels = {
    student: 'Student',
    organization: 'Organizace',
    admin: 'Administrátor'
  };

  return (
    <span className={`px-2 py-1 text-xs font-medium rounded-full ${colors[role]}`}>
      {labels[role]}
    </span>
  );
};

const AdminUsers = () => {
  const queryClient = useQueryClient();
  const [search, setSearch] = useState('');

  const { data: users, isLoading, error } = useQuery(
    'users',
    fetchUsers
  );

  const updateRoleMutation = useMutation(
    ({ userId, role }) => updateUserRole(userId, role),
    {
      onSuccess: () => {
        queryClient.invalidateQueries('users');
        toast.success('Role uživatele byla aktualizována');
      },
      onError: () => {
        toast.error('Při aktualizaci role došlo k chybě');
      }
    }
  );

  const handleRoleChange = (userId, newRole) => {
    updateRoleMutation.mutate({ userId, role: newRole });
  };

  if (isLoading) return <LoadingSpinner />;
  if (error) return <ErrorMessage message="Nepodařilo se načíst uživatele" />;
  if (!users || users.length === 0) {
    return (
      <div className="bg-white rounded-lg shadow p-6 mt-4">
        <p className="text-gray-500">Žádní uživatelé nebyli nalezeni.</p>
      </div>
    );
  }

  // Filtrování uživatelů podle vyhledávání
  const filteredUsers = users.filter(user => 
    user.name.toLowerCase().includes(search.toLowerCase()) ||
    user.email.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="bg-white rounded-lg shadow overflow-hidden">
      <div className="px-4 py-5 sm:px-6">
        <h3 className="text-lg font-medium leading-6 text-gray-900">
          Správa uživatelů
        </h3>
        <p className="mt-1 max-w-2xl text-sm text-gray-500">
          Spravujte uživatele a jejich role
        </p>
      </div>

      <div className="px-4 py-3 border-b border-gray-200">
        <div className="relative">
          <input
            type="text"
            placeholder="Vyhledat uživatele..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg"
          />
        </div>
      </div>

      <table className="min-w-full divide-y divide-gray-200">
        <thead className="bg-gray-50">
          <tr>
            <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Uživatel
            </th>
            <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Role
            </th>
            <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Organizace
            </th>
            <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Status
            </th>
            <th scope="col" className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
              Akce
            </th>
          </tr>
        </thead>
        <tbody className="bg-white divide-y divide-gray-200">
          {filteredUsers.map((user) => (
            <tr key={user._id}>
              <td className="px-6 py-4 whitespace-nowrap">
                <div className="flex items-center">
                  <div className="flex-shrink-0 h-10 w-10 relative">
                    {user.profileImage ? (
                      <Image
                        src={user.profileImage}
                        alt={user.name}
                        layout="fill"
                        objectFit="cover"
                        className="rounded-full"
                      />
                    ) : (
                      <div className="h-10 w-10 rounded-full bg-gray-200 flex items-center justify-center">
                        <span className="text-sm font-medium text-gray-500">
                          {user.name.substring(0, 2).toUpperCase()}
                        </span>
                      </div>
                    )}
                  </div>
                  <div className="ml-4">
                    <div className="text-sm font-medium text-gray-900">{user.name}</div>
                    <div className="text-sm text-gray-500">{user.email}</div>
                  </div>
                </div>
              </td>
              <td className="px-6 py-4 whitespace-nowrap">
                <UserRoleBadge role={user.role} />
              </td>
              <td className="px-6 py-4 whitespace-nowrap">
                <div className="text-sm text-gray-900">
                  {user.organizationId ? user.organizationId.name : '-'}
                </div>
              </td>
              <td className="px-6 py-4 whitespace-nowrap">
                <span className={`px-2 py-1 text-xs font-medium rounded-full ${
                  user.isApproved 
                    ? 'bg-green-100 text-green-800' 
                    : 'bg-yellow-100 text-yellow-800'
                }`}>
                  {user.isApproved ? 'Schváleno' : 'Čeká na schválení'}
                </span>
              </td>
              <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                <select
                  value={user.role}
                  onChange={(e) => handleRoleChange(user._id, e.target.value)}
                  className="text-sm border border-gray-300 rounded py-1 px-2"
                  disabled={updateRoleMutation.isLoading}
                >
                  <option value="student">Student</option>
                  <option value="organization">Organizace</option>
                  <option value="admin">Administrátor</option>
                </select>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default AdminUsers;
