// components/events/EventCard.jsx
import Link from 'next/link';
import Image from 'next/image';
import { CalendarIcon, MapPinIcon, ClockIcon, TagIcon } from '@heroicons/react/24/outline';
import { formatDate, formatTime } from '../../utils/dateFormat';

const EventCard = ({ event }) => {
  const {
    _id,
    title,
    shortDescription,
    startDate,
    endDate,
    location,
    eventType,
    organizerId,
    images,
  } = event;

  // Výchozí obrázek, pokud event nemá vlastní
  const imageUrl = images && images.length > 0
    ? images[0]
    : '/images/event-placeholder.jpg';

  // Funkce pro získání barvy podle typu události
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

  return (
    <div className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow duration-300">
      <Link href={`/events/${_id}`}>
        <div className="relative h-48 w-full">
          <Image
            src={imageUrl}
            alt={title}
            layout="fill"
            objectFit="cover"
            className="transition-transform duration-300 hover:scale-105"
          />
        </div>
      </Link>

      <div className="p-4">
        <div className="flex items-center mb-2">
          <span className={`text-xs font-semibold px-2 py-1 rounded-full ${getEventTypeColor(eventType)}`}>
            {eventType}
          </span>
          {organizerId && organizerId.logo && (
            <Link href={`/organizations/${organizerId._id}`}>
              <div className="ml-auto flex items-center">
                <Image
                  src={organizerId.logo}
                  alt={organizerId.name}
                  width={24}
                  height={24}
                  className="rounded-full"
                />
                <span className="ml-1 text-sm text-gray-600">{organizerId.name}</span>
              </div>
            </Link>
          )}
        </div>

        <Link href={`/events/${_id}`}>
          <h3 className="text-lg font-semibold mb-2 hover:text-blue-600">{title}</h3>
        </Link>

        <p className="text-gray-600 text-sm mb-4 line-clamp-2">{shortDescription}</p>

        <div className="flex items-center text-xs text-gray-500 mb-2">
          <CalendarIcon className="h-4 w-4 mr-1" />
          <span>{formatDate(startDate)}</span>
        </div>

        <div className="flex items-center text-xs text-gray-500 mb-2">
          <ClockIcon className="h-4 w-4 mr-1" />
          <span>{formatTime(startDate)} - {formatTime(endDate)}</span>
        </div>

        <div className="flex items-center text-xs text-gray-500">
          <MapPinIcon className="h-4 w-4 mr-1" />
          <span>{location.city}</span>
        </div>
      </div>
    </div>
  );
};

export default EventCard;
