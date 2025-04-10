// components/events/EventDetails.jsx
import Image from 'next/image';
import Link from 'next/link';
import { 
  CalendarIcon, 
  MapPinIcon, 
  ClockIcon, 
  UserGroupIcon, 
  CurrencyDollarIcon,
  ArrowTopRightOnSquareIcon
} from '@heroicons/react/24/outline';
import { formatDate, formatTime, formatDateRange } from '../../utils/dateFormat';

const EventDetails = ({ event }) => {
  const {
    title,
    description,
    startDate,
    endDate,
    location,
    eventType,
    ageRange,
    registrationUrl,
    price,
    organizerId,
    images
  } = event;

  const getEventTypeColor = (type) => {
    const colors = {
      'workshop': 'bg-blue-100 text-blue-800',
      'conference': 'bg-purple-100 text-purple-800',
      'lecture': 'bg-green-100 text-green-800',
      'competition': 'bg-red-100 text-red-800',
      'internship': 'bg-yellow-100 text-yellow-800',
      'course': 'bg-indigo-100 text-indigo-800',
      'hackathon': 'bg-pink-100 text-pink-800',
      'exhibition': 'bg-teal-100 text-teal-800',
    };
    return colors[type] || 'bg-gray-100 text-gray-800';
  };

  // Výchozí obrázek, pokud event nemá vlastní
  const imageUrl = images && images.length > 0
    ? images[0]
    : '/images/event-placeholder.jpg';

  return (
    <div className="bg-white rounded-lg shadow-lg overflow-hidden">
      <div className="relative h-64 md:h-96 w-full">
        <Image
          src={imageUrl}
          alt={title}
          layout="fill"
          objectFit="cover"
          priority
        />
      </div>

      <div className="p-6">
        <div className="flex items-center mb-4">
          <span className={`text-sm font-semibold px-3 py-1 rounded-full ${getEventTypeColor(eventType)}`}>
            {eventType}
          </span>
          
          {organizerId && (
            <Link href={`/organizations/${organizerId._id}`} className="ml-auto flex items-center group">
              {organizerId.logo && (
                <Image
                  src={organizerId.logo}
                  alt={organizerId.name}
                  width={32}
                  height={32}
                  className="rounded-full"
                />
              )}
              <span className="ml-2 text-gray-700 group-hover:text-blue-600">{organizerId.name}</span>
            </Link>
          )}
        </div>

        <h1 className="text-3xl font-bold mb-4">{title}</h1>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
          <div className="space-y-4">
            <div className="flex items-center">
              <CalendarIcon className="h-5 w-5 text-blue-600 mr-2" />
              <span>{formatDateRange(startDate, endDate)}</span>
            </div>

            <div className="flex items-center">
              <ClockIcon className="h-5 w-5 text-blue-600 mr-2" />
              <span>{formatTime(startDate)} - {formatTime(endDate)}</span>
            </div>

            <div className="flex items-center">
              <MapPinIcon className="h-5 w-5 text-blue-600 mr-2" />
              <span>
                {location.name && `${location.name}, `}
                {location.address && `${location.address}, `}
                {location.city}
                {location.postalCode && `, ${location.postalCode}`}
              </span>
            </div>
          </div>

          <div className="space-y-4">
            <div className="flex items-center">
              <UserGroupIcon className="h-5 w-5 text-blue-600 mr-2" />
              <span>Věková skupina: {ageRange.min} - {ageRange.max} let</span>
            </div>

            <div className="flex items-center">
              <CurrencyDollarIcon className="h-5 w-5 text-blue-600 mr-2" />
              <span>
                {price.isFree 
                  ? 'Zdarma' 
                  : `${price.amount} ${price.currency}`}
              </span>
            </div>
          </div>
        </div>

        <div className="prose max-w-none mb-8">
          <h2 className="text-xl font-semibold mb-4">O události</h2>
          <div dangerouslySetInnerHTML={{ __html: description }} />
        </div>

        {registrationUrl && (
          <div className="mt-8">
            <a
              href={registrationUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center justify-center px-6 py-3 border border-transparent rounded-md shadow-sm text-base font-medium text-white bg-blue-600 hover:bg-blue-700 transition-colors duration-300"
            >
              Registrovat se
              <ArrowTopRightOnSquareIcon className="ml-2 -mr-1 h-5 w-5" />
            </a>
          </div>
        )}
      </div>
    </div>
  );
};

export default EventDetails;
