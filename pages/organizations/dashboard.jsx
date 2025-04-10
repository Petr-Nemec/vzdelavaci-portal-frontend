// pages/organizations/dashboard.jsx - Přehled organizace
import { useState } from 'react';
import Head from 'next/head';
import { useAuth } from '../../hooks/useAuth';
import OrganizationEvents from '../../components/organizations/OrganizationEvents';
import OrganizationProfile from '../../components/organizations/OrganizationProfile';
import OrganizationTabs from '../../components/organizations/OrganizationTabs';
import ProtectedRoute from '../../components/auth/ProtectedRoute';

const tabs = [
  { id: 'events', label: 'Moje akce' },
  { id: 'profile', label: 'Profil organizace' },
];

export default function OrganizationDashboard() {
  const { user } = useAuth();
  const [activeTab, setActiveTab] = useState('events');

  return (
    <ProtectedRoute allowedRoles={['organization']}>
      <div className="container mx-auto px-4 py-8">
        <Head>
          <title>Přehled organizace | Vzdělávací akce</title>
        </Head>

        <h1 className="text-3xl font-bold mb-6">Přehled organizace</h1>

        {!user?.isApproved && (
          <div className="bg-yellow-100 border-l-4 border-yellow-500 text-yellow-700 p-4 mb-6">
            <p>Vaše organizace čeká na schválení administrátorem. Po schválení budete moci přidávat akce.</p>
          </div>
        )}

        <OrganizationTabs tabs={tabs} activeTab={activeTab} onTabChange={setActiveTab} />

        <div className="mt-6">
          {activeTab === 'events' && <OrganizationEvents />}
          {activeTab === 'profile' && <OrganizationProfile isEditable={true} />}
        </div>
      </div>
    </ProtectedRoute>
  );
}
