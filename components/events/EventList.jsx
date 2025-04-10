// components/events/EventList.jsx
import Link from 'next/link';
import EventCard from './EventCard';
import Pagination from '../common/Pagination';
import LoadingSpinner from '../common/LoadingSpinner';

const EventList = ({ events, isLoading, totalPages, currentPage, onPageChange }) => {
  if (isLoading) return <LoadingSpinner />;

  if (!events || events.length === 0) {
    return (
      <div className="text-center py-12">
        <h3 className="text-xl font-medium text-gray-600">Žádné akce nebyly nalezeny</h3>
        <p className="mt-2 text-gray-500">Zkuste změnit filtry nebo se vraťte později.</p>
      </div>
    );
  }

  return (
    <div>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {events.map((event) => (
          <EventCard key={event._id} event={event} />
        ))}
      </div>

      {totalPages > 1 && (
        <div className="mt-8">
          <Pagination
            currentPage={currentPage}
            totalPages={totalPages}
            onPageChange={onPageChange}
          />
        </div>
      )}
    </div>
  );
};

export default EventList;
