// components/organizations/EventForm.jsx
import { useState } from 'react';
import { useRouter } from 'next/router';
import { cities, eventTypes } from '../../constants/filterOptions';
import { createEvent, updateEvent } from '../../api/events';
import toast from 'react-hot-toast';

const EventForm = ({ event = null, onSuccess }) => {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    title: event?.title || '',
    shortDescription: event?.shortDescription || '',
    description: event?.description || '',
    startDate: event?.startDate ? new Date(event.startDate).toISOString().split('T')[0] : '',
    startTime: event?.startDate ? new Date(event.startDate).toTimeString().split(' ')[0].substring(0, 5) : '',
    endDate: event?.endDate ? new Date(event.endDate).toISOString().split('T')[0] : '',
    endTime: event?.endDate ? new Date(event.endDate).toTimeString().split(' ')[0].substring(0, 5) : '',
    location: {
      name: event?.location?.name || '',
      address: event?.location?.address || '',
      city: event?.location?.city || '',
      postalCode: event?.location?.postalCode || '',
      coordinates: event?.location?.coordinates || { lat: null, lng: null }
    },
    eventType: event?.eventType || '',
    ageRange: {
      min: event?.ageRange?.min || 0,
      max: event?.ageRange?.max || 26
    },
    registrationUrl: event?.registrationUrl || '',
    price: {
      isFree: event?.price?.isFree ?? true,
      amount: event?.price?.amount || 0,
      currency: event?.price?.currency || 'CZK'
    },
    images: event?.images || []
  });

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

  const handleCheckboxChange = (e) => {
    const { name, checked } = e.target;
    setFormData({
      ...formData,
      price: {
        ...formData.price,
        isFree: checked
      }
    });
  };

  const validateForm = () => {
    // Validace povinných polí
    const requiredFields = [
      'title', 'shortDescription', 'description', 'startDate', 
      'startTime', 'endDate', 'endTime', 'eventType'
    ];
    
    for (const field of requiredFields) {
      if (!formData[field]) {
        toast.error(`Pole ${field} je povinné`);
        return false;
      }
    }

    // Validace polí lokace
    if (!formData.location.city) {
      toast.error('Pole město je povinné');
      return false;
    }

    // Validace věkového rozsahu
    if (
      formData.ageRange.min < 0 || 
      formData.ageRange.max > 100 || 
      parseInt(formData.ageRange.min) > parseInt(formData.ageRange.max)
    ) {
      toast.error('Neplatný věkový rozsah');
      return false;
    }

    // Validace data a času
    const startDateTime = new Date(`${formData.startDate}T${formData.startTime}`);
    const endDateTime = new Date(`${formData.endDate}T${formData.endTime}`);
    
    if (endDateTime <= startDateTime) {
      toast.error('Datum a čas konce musí být později než datum a čas začátku');
      return false;
    }

    return true;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }

    try {
      setLoading(true);

      // Příprava dat pro odeslání
      const startDateTime = new Date(`${formData.startDate}T${formData.startTime}`);
      const endDateTime = new Date(`${formData.endDate}T${formData.endTime}`);

      const eventData = {
        ...formData,
        startDate: startDateTime.toISOString(),
        endDate: endDateTime.toISOString()
      };

      // Odstraníme pole, která nejsou v modelu
      delete eventData.startTime;
      delete eventData.endTime;

      let result;
      if (event?._id) {
        result = await updateEvent(event._id, eventData);
        toast.success('Událost byla úspěšně aktualizována');
      } else {
        result = await createEvent(eventData);
        toast.success('Událost byla úspěšně vytvořena');
      }

      if (onSuccess) {
        onSuccess(result);
      } else {
        router.push('/organizations/dashboard');
      }
    } catch (error) {
      console.error('Error saving event:', error);
      toast.error('Při ukládání události došlo k chybě');
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="bg-white rounded-lg shadow-md p-6">
        <h2 className="text-xl font-semibold mb-4">Základní informace</h2>
        
        <div className="grid grid-cols-1 gap-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Název události *
            </label>
            <input
              type="text"
              name="title"
              value={formData.title}
              onChange={handleInputChange}
              required
              className="w-full px-4 py-2 border border-gray-300 rounded-lg"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Krátký popis (max 200 znaků) *
            </label>
            <textarea
              name="shortDescription"
              value={formData.shortDescription}
              onChange={handleInputChange}
              required
              maxLength={200}
              rows={2}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Podrobný popis události *
            </label>
            <textarea
              name="description"
              value={formData.description}
              onChange={handleInputChange}
              required
              rows={6}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg"
            />
          </div>
        </div>
      </div>

      <div className="bg-white rounded-lg shadow-md p-6">
        <h2 className="text-xl font-semibold mb-4">Datum a čas</h2>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Datum začátku *
            </label>
            <input
              type="date"
              name="startDate"
              value={formData.startDate}
              onChange={handleInputChange}
              required
              className="w-full px-4 py-2 border border-gray-300 rounded-lg"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Čas začátku *
            </label>
            <input
              type="time"
              name="startTime"
              value={formData.startTime}
              onChange={handleInputChange}
              required
              className="w-full px-4 py-2 border border-gray-300 rounded-lg"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Datum konce *
            </label>
            <input
              type="date"
              name="endDate"
              value={formData.endDate}
              onChange={handleInputChange}
              required
              className="w-full px-4 py-2 border border-gray-300 rounded-lg"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Čas konce *
            </label>
            <input
              type="time"
              name="endTime"
              value={formData.endTime}
              onChange={handleInputChange}
              required
              className="w-full px-4 py-2 border border-gray-300 rounded-lg"
            />
          </div>
        </div>
      </div>

      <div className="bg-white rounded-lg shadow-md p-6">
        <h2 className="text-xl font-semibold mb-4">Místo konání</h2>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Název místa
            </label>
            <input
              type="text"
              name="location.name"
              value={formData.location.name}
              onChange={handleInputChange}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg"
              placeholder="např. VŠB-TUO, Fakulta elektrotechniky a informatiky"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Adresa
            </label>
            <input
              type="text"
              name="location.address"
              value={formData.location.address}
              onChange={handleInputChange}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg"
              placeholder="např. 17. listopadu 2172/15"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Město *
            </label>
            <select
              name="location.city"
              value={formData.location.city}
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
              name="location.postalCode"
              value={formData.location.postalCode}
              onChange={handleInputChange}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg"
              placeholder="např. 708 00"
            />
          </div>
        </div>
      </div>

      <div className="bg-white rounded-lg shadow-md p-6">
        <h2 className="text-xl font-semibold mb-4">Další informace</h2>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Typ události *
            </label>
            <select
              name="eventType"
              value={formData.eventType}
              onChange={handleInputChange}
              required
              className="w-full px-4 py-2 border border-gray-300 rounded-lg"
            >
              <option value="">Vyberte typ</option>
              {eventTypes.map((type) => (
                <option key={type.value} value={type.value}>
                  {type.label}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Odkaz na registraci
            </label>
            <input
              type="url"
              name="registrationUrl"
              value={formData.registrationUrl}
              onChange={handleInputChange}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg"
              placeholder="např. https://www.mojeakce.cz/registrace"
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Věk od *
              </label>
              <input
                type="number"
                name="ageRange.min"
                value={formData.ageRange.min}
                onChange={handleInputChange}
                required
                min="0"
                max="100"
                className="w-full px-4 py-2 border border-gray-300 rounded-lg"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Věk do *
              </label>
              <input
                type="number"
                name="ageRange.max"
                value={formData.ageRange.max}
                onChange={handleInputChange}
                required
                min="0"
                max="100"
                className="w-full px-4 py-2 border border-gray-300 rounded-lg"
              />
            </div>
          </div>

          <div>
            <div className="flex items-center mb-2">
              <input
                type="checkbox"
                id="isFree"
                checked={formData.price.isFree}
                onChange={handleCheckboxChange}
                className="h-4 w-4 text-blue-600 border-gray-300 rounded"
              />
              <label htmlFor="isFree" className="ml-2 text-sm text-gray-700">
                Akce je zdarma
              </label>
            </div>

            {!formData.price.isFree && (
              <div className="grid grid-cols-2 gap-4 mt-2">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Cena
                  </label>
                  <input
                    type="number"
                    name="price.amount"
                    value={formData.price.amount}
                    onChange={handleInputChange}
                    min="0"
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Měna
                  </label>
                  <select
                    name="price.currency"
                    value={formData.price.currency}
                    onChange={handleInputChange}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg"
                  >
                    <option value="CZK">CZK</option>
                    <option value="EUR">EUR</option>
                  </select>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      <div className="flex justify-end mt-8">
        <button
          type="button"
          onClick={() => router.back()}
          className="mr-4 px-6 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50"
        >
          Zrušit
        </button>
        <button
          type="submit"
          disabled={loading}
          className="px-6 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 disabled:bg-blue-400"
        >
          {loading ? 'Ukládání...' : event?._id ? 'Aktualizovat událost' : 'Vytvořit událost'}
        </button>
      </div>
    </form>
  );
};

export default EventForm;
