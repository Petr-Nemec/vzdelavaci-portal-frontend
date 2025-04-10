// components/organizations/OrganizationProfile.jsx
import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from 'react-query';
import Image from 'next/image';
import { useAuth } from '../../hooks/useAuth';
import { fetchOrganization, updateOrganization } from '../../api/organizations';
import LoadingSpinner from '../common/LoadingSpinner';
import ErrorMessage from '../common/ErrorMessage';
import { cities } from '../../constants/filterOptions';
import toast from 'react-hot-toast';

const OrganizationProfile = ({ organization: initialOrg = null, isEditable = false }) => {
  const { user } = useAuth();
  const queryClient = useQueryClient();
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    logo: '',
    contactEmail: '',
    contactPhone: '',
    website: '',
    address: {
      street: '',
      city: '',
      postalCode: ''
    },
    socialMedia: {
      facebook: '',
      instagram: '',
      twitter: '',
      linkedin: ''
    }
  });

  // Fetch organization data if not provided
  const organizationId = initialOrg?._id || user?.organization?._id;
  const { data: fetchedOrg, isLoading, error } = useQuery(
    ['organization', organizationId],
    () => fetchOrganization(organizationId),
    {
      enabled: !initialOrg && !!organizationId,
      onSuccess: (data) => {
        if (!initialOrg && !isEditing) {
          setFormData({
            name: data.name || '',
            description: data.description || '',
            logo: data.logo || '',
            contactEmail: data.contactEmail || '',
            contactPhone: data.contactPhone || '',
            website: data.website || '',
            address: {
              street: data.address?.street || '',
              city: data.address?.city || '',
              postalCode: data.address?.postalCode || ''
            },
            socialMedia: {
              facebook: data.socialMedia?.facebook || '',
              instagram: data.socialMedia?.instagram || '',
              twitter: data.socialMedia?.twitter || '',
              linkedin: data.socialMedia?.linkedin || ''
            }
          });
        }
      }
    }
  );

  const organization = initialOrg || fetchedOrg;

  // Update mutation
  const updateMutation = useMutation(
    (data) => updateOrganization(organizationId, data),
    {
      onSuccess: () => {
        queryClient.invalidateQueries(['organization', organizationId]);
        toast.success('Profil organizace byl aktualizován');
        setIsEditing(false);
      },
      onError: () => {
        toast.error('Při aktualizaci profilu došlo k chybě');
      }
    }
  );

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    
    if (name.includes('.')) {
      const [parent, child] = name.split('.');
      setFormData({
        ...formData,
        [parent]: {
          ...formData[parent],
          [child]: value
        }
      });
    } else {
      setFormData({
        ...formData,
        [name]: value
      });
    }
  };

  const handleEditClick = () => {
    setFormData({
      name: organization?.name || '',
      description: organization?.description || '',
      logo: organization?.logo || '',
      contactEmail: organization?.contactEmail || '',
      contactPhone: organization?.contactPhone || '',
      website: organization?.website || '',
      address: {
        street: organization?.address?.street || '',
        city: organization?.address?.city || '',
        postalCode: organization?.address?.postalCode || ''
      },
      socialMedia: {
        facebook: organization?.socialMedia?.facebook || '',
        instagram: organization?.socialMedia?.instagram || '',
        twitter: organization?.socialMedia?.twitter || '',
        linkedin: organization?.socialMedia?.linkedin || ''
      }
    });
    setIsEditing(true);
  };

  const handleCancelEdit = () => {
    setIsEditing(false);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    updateMutation.mutate(formData);
  };

  if (isLoading) return <LoadingSpinner />;
  if (error) return <ErrorMessage message="Nepodařilo se načíst profil organizace" />;
  if (!organization && !isEditable) return null;

  // View mode - zobrazení profilu
  if (!isEditing) {
    return (
      <div className="bg-white rounded-lg shadow-md overflow-hidden">
        <div className="relative h-48 bg-gradient-to-r from-blue-600 to-blue-800">
          {organization?.logo && (
            <div className="absolute bottom-0 left-6 transform translate-y-1/2">
              <div className="h-24 w-24 rounded-full border-4 border-white bg-white relative overflow-hidden">
                <Image
                  src={organization.logo}
                  alt={organization.name}
                  layout="fill"
                  objectFit="cover"
                />
              </div>
            </div>
          )}
          {isEditable && (
            <div className="absolute top-4 right-4">
              <button
                onClick={handleEditClick}
                className="px-4 py-2 bg-white text-blue-600 rounded-md shadow-sm text-sm font-medium hover:bg-gray-50"
              >
                Upravit profil
              </button>
            </div>
          )}
        </div>

        <div className="pt-16 px-6 pb-6">
          <h1 className="text-2xl font-bold">{organization.name}</h1>
          <p className="mt-4 text-gray-600">{organization.description}</p>

          <div className="mt-8 grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <h2 className="text-lg font-semibold mb-3">Kontaktní informace</h2>
              <ul className="space-y-2">
                <li className="flex items-start">
                  <span className="text-gray-500 w-24">Email:</span>
                  <a href={`mailto:${organization.contactEmail}`} className="text-blue-600 hover:underline">
                    {organization.contactEmail}
                  </a>
                </li>
                {organization.contactPhone && (
                  <li className="flex items-start">
                    <span className="text-gray-500 w-24">Telefon:</span>
                    <a href={`tel:${organization.contactPhone}`} className="text-blue-600 hover:underline">
                      {organization.contactPhone}
                    </a>
                  </li>
                )}
                {organization.website && (
                  <li className="flex items-start">
                    <span className="text-gray-500 w-24">Web:</span>
                    <a href={organization.website} target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline">
                      {organization.website}
                    </a>
                  </li>
                )}
              </ul>
            </div>

            <div>
              <h2 className="text-lg font-semibold mb-3">Adresa</h2>
              <address className="not-italic">
                {organization.address?.street && (
                  <p>{organization.address.street}</p>
                )}
                {organization.address?.city && (
                  <p>
                    {organization.address.city}
                    {organization.address.postalCode && `, ${organization.address.postalCode}`}
                  </p>
                )}
              </address>
            </div>
          </div>

          {(organization.socialMedia?.facebook || 
            organization.socialMedia?.instagram || 
            organization.socialMedia?.twitter || 
            organization.socialMedia?.linkedin) && (
            <div className="mt-8">
              <h2 className="text-lg font-semibold mb-3">Sociální sítě</h2>
              <div className="flex space-x-4">
                {organization.socialMedia?.facebook && (
                  <a href={organization.socialMedia.facebook} target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:text-blue-800">
                    Facebook
                  </a>
                )}
                {organization.socialMedia?.instagram && (
                  <a href={organization.socialMedia.instagram} target="_blank" rel="noopener noreferrer" className="text-pink-600 hover:text-pink-800">
                    Instagram
                  </a>
                )}
                {organization.socialMedia?.twitter && (
                  <a href={organization.socialMedia.twitter} target="_blank" rel="noopener noreferrer" className="text-blue-400 hover:text-blue-600">
                    Twitter
                  </a>
                )}
                {organization.socialMedia?.linkedin && (
                  <a href={organization.socialMedia.linkedin} target="_blank" rel="noopener noreferrer" className="text-blue-700 hover:text-blue-900">
                    LinkedIn
                  </a>
                )}
              </div>
            </div>
          )}
        </div>
      </div>
    );
  }

  // Edit mode - úprava profilu
  return (
    <div className="bg-white rounded-lg shadow-md overflow-hidden">
      <div className="p-6">
        <h1 className="text-2xl font-bold mb-6">Upravit profil organizace</h1>
        
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Název organizace *
              </label>
              <input
                type="text"
                name="name"
                value={formData.name}
                onChange={handleInputChange}
                required
                className="w-full px-4 py-2 border border-gray-300 rounded-lg"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Popis organizace *
              </label>
              <textarea
                name="description"
                value={formData.description}
                onChange={handleInputChange}
                required
                rows={4}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                URL loga (obrázek)
              </label>
              <input
                type="url"
                name="logo"
                value={formData.logo}
                onChange={handleInputChange}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg"
                placeholder="např. https://example.com/logo.png"
              />
              {formData.logo && (
                <div className="mt-2">
                  <p className="text-sm text-gray-500 mb-1">Náhled:</p>
                  <div className="h-16 w-16 relative">
                    <Image
                      src={formData.logo}
                      alt="Logo preview"
                      layout="fill"
                      objectFit="cover"
                      className="rounded-lg"
                    />
                  </div>
                </div>
              )}
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-4">
              <h2 className="text-lg font-semibold">Kontaktní informace</h2>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Kontaktní email *
                </label>
                <input
                  type="email"
                  name="contactEmail"
                  value={formData.contactEmail}
                  onChange={handleInputChange}
                  required
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Telefon
                </label>
                <input
                  type="tel"
                  name="contactPhone"
                  value={formData.contactPhone}
                  onChange={handleInputChange}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Webové stránky
                </label>
                <input
                  type="url"
                  name="website"
                  value={formData.website}
                  onChange={handleInputChange}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg"
                  placeholder="např. https://www.example.cz"
                />
              </div>
            </div>

            <div className="space-y-4">
              <h2 className="text-lg font-semibold">Adresa</h2>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Ulice a č.p.
                </label>
                <input
                  type="text"
                  name="address.street"
                  value={formData.address.street}
                  onChange={handleInputChange}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Město *
                </label>
                <select
                  name="address.city"
                  value={formData.address.city}
                  onChange={handleInputChange}
                  required
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg"
                >
                  <option value="">Vyberte město</option>
                  {cities.map((city) => (
                    <option key={city} value={city}>
                      {city}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  PSČ
                </label>
                <input
                  type="text"
                  name="address.postalCode"
                  value={formData.address.postalCode}
                  onChange={handleInputChange}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg"
                  placeholder="např. 708 00"
                />
              </div>
            </div>
          </div>

          <div className="space-y-4">
            <h2 className="text-lg font-semibold">Sociální sítě</h2>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Facebook
                </label>
                <input
                  type="url"
                  name="socialMedia.facebook"
                  value={formData.socialMedia.facebook}
                  onChange={handleInputChange}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg"
                  placeholder="např. https://facebook.com/vase-organizace"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Instagram
                </label>
                <input
                  type="url"
                  name="socialMedia.instagram"
                  value={formData.socialMedia.instagram}
                  onChange={handleInputChange}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg"
                  placeholder="např. https://instagram.com/vase-organizace"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Twitter
                </label>
                <input
                  type="url"
                  name="socialMedia.twitter"
                  value={formData.socialMedia.twitter}
                  onChange={handleInputChange}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg"
                  placeholder="např. https://twitter.com/vase-organizace"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  LinkedIn
                </label>
                <input
                  type="url"
                  name="socialMedia.linkedin"
                  value={formData.socialMedia.linkedin}
                  onChange={handleInputChange}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg"
                  placeholder="např. https://linkedin.com/company/vase-organizace"
                />
              </div>
            </div>
          </div>

          <div className="flex justify-end space-x-3">
            <button
              type="button"
              onClick={handleCancelEdit}
              className="px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50"
            >
              Zrušit
            </button>
            <button
              type="submit"
              disabled={updateMutation.isLoading}
              className="px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 disabled:bg-blue-400"
            >
              {updateMutation.isLoading ? 'Ukládání...' : 'Uložit změny'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default OrganizationProfile;
