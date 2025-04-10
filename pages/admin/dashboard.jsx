// pages/admin/dashboard.jsx - Administrátorské rozhraní
import { useState } from 'react';
import Head from 'next/head';
import { useAuth } from '../../hooks/useAuth';
import AdminPendingOrganizations from '../../components/admin/AdminPendingOrganizations';
import AdminPendingEvents from '../../components/admin/AdminPendingEvents';
import AdminTabs from '../../components/admin/AdminTabs';
import AdminUsers from '../../components/admin/AdminUsers';
import ProtectedRoute from '../../components/auth/ProtectedRoute';

const tabs = [
  { id: 'pending-organizations', label: 'Čekající organizace' },
  { id: 'pending-events', label: 'Čekající akce' },
  { id: 'users', label: 'Uživatelé' },
];

export default function AdminDashboard() {
  const { isAdmin } = useAuth();
  const [activeTab, setActiveTab] = useState('pending-organizations');

  return (
    <ProtectedRoute allowedRoles={['admin']}>
      <div className="container mx-auto px-4 py-8">
        <Head>
          <title>Administrace | Vzdělávací akce</title>
        </Head>

        <h1 className="text-3xl font-bold mb-6">Administrace portálu</h1>

        <AdminTabs tabs={tabs} activeTab={activeTab} onTabChange={setActiveTab} />

        <div className="mt-6">
          {activeTab === 'pending-organizations' && <AdminPendingOrganizations />}
          {activeTab === 'pending-events' && <AdminPendingEvents />}
          {activeTab === 'users' && <AdminUsers />}
        </div>
      </div>
    </ProtectedRoute>
  );
}
