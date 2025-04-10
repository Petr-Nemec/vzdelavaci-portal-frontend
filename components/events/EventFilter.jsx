// components/events/EventFilter.jsx
import { useState } from 'react';
import { cities, eventTypes } from '../../constants/filterOptions';
import { SearchIcon, AdjustmentsHorizontalIcon } from '@heroicons/react/24/outline';

const EventFilter = ({ filters, onFilterChange, simplified = false }) => {
  const [showAdvanced, setShowAdvanced] = useState(false);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    onFilterChange({ [name]: value });
  };

  const handleReset = () => {
    onFilterChange({
      city: '',
      eventType: '',
      startDate: '',
      endDate: '',
      minAge: '',
      maxAge: '',
      search: ''
    });
  };

  return (
    <div className="bg-white rounded-lg shadow-md p-4">
      <div className="flex flex-col sm:flex-row gap-4 mb-4">
        {/* Vyhledávací pole */}
        <div className="relative w-full sm:w-1/3">
          <input
            type="text"
            name="search"
            value={filters.search || ''}
            onChange={handleInputChange}
            placeholder="Hledat akce..."
            className="w-full px-4 py-2 border border-gray-300 rounded-lg pl-10"
          />
          <SearchIcon className="absolute left-3 top-2.5 h-5 w-5 text-gray-400" />
        </div>

        {/* Základní filtry */}
        <div className="w-full sm:w-1/3">
          <select
            name="city"
            value={filters.city || ''}
            onChange={handleInputChange}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg"
          >
            <option value="">Všechna města</option>
            {cities.map((city) => (
              <option key={city} value={city}>
                {city}
              </option>
            ))}
          </select>
        </div>

        <div className="w-full sm:w-1/3">
          <select
            name="eventType"
            value={filters.eventType || ''}
            onChange={handleInputChange}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg"
          >
            <option value="">Všechny typy akcí</option>
            {eventTypes.map((type) => (
              <option key={type.value} value={type.value}>
                {type.label}
              </option>
            ))}
          </select>
        </div>
      </div>

      {!simplified && (
        <>
          <div className="flex items-center justify-between mb-2">
            <button
              type="button"
              onClick={() => setShowAdvanced(!showAdvanced)}
              className="flex items-center text-sm text-blue-600 hover:text-blue-800"
            >
              <AdjustmentsHorizontalIcon className="h-4 w-4 mr-1" />
              {showAdvanced ? 'Skrýt rozšířené filtry' : 'Zobrazit rozšířené filtry'}
            </button>

            <button
              type="button"
              onClick={handleReset}
              className="text-sm text-gray-600 hover:text-gray-800"
            >
              Resetovat filtry
            </button>
          </div>

          {showAdvanced && (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Datum od</label>
                <input
                  type="date"
                  name="startDate"
                  value={filters.startDate || ''}
                  onChange={handleInputChange}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Datum do</label>
                <input
                  type="date"
                  name="endDate"
                  value={filters.endDate || ''}
                  onChange={handleInputChange}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg"
                />
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Věk od</label>
                  <input
                    type="number"
                    name="minAge"
                    min="0"
                    max="100"
                    value={filters.minAge || ''}
                    onChange={handleInputChange}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Věk do</label>
                  <input
                    type="number"
                    name="maxAge"
                    min="0"
                    max="100"
                    value={filters.maxAge || ''}
                    onChange={handleInputChange}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg"
                  />
                </div>
              </div>
            </div>
          )}
        </>
      )}
    </div>
  );
};

export default EventFilter;
