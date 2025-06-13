import React, { useState, useEffect } from 'react';
import { toursApi, TourCreateInput, City, EventType, PackageItem, TourFull, CustomizeOption, TimelineEvent } from '../../lib/api';
import { TourImageEditor } from './TourImageEditor';

// Base API URL for production
const API_BASE_URL = 'https://api.ucv.com.vn';
// const API_BASE_URL = 'http://localhost:3000';

interface EditTourModalProps {
  tourId: string;
  onClose: () => void;
}

export const EditTourModal: React.FC<EditTourModalProps> = ({ tourId, onClose }) => {
  const [formState, setFormState] = useState({
    title: '',
    description: '',
    shortDescription: '',
    imageUrl: '',
    // Structured pricing
    earlyBirdPrice: '',
    earlyBirdUniversityPrice: '',
    standardRegularPrice: '',
    standardUniversityPrice: '',
    date: '',
    location: '',
    duration: '',
    tourDates: '',
    customize: '',
    earlyBirdDeadline: '',
    standardDeadline: '',
  });

  // Available shared entities from API
  const [availableCities, setAvailableCities] = useState<City[]>([]);
  const [availableEventTypes, setAvailableEventTypes] = useState<EventType[]>([]);
  const [availablePackageItems, setAvailablePackageItems] = useState<PackageItem[]>([]);

  // Selected entities for this tour
  const [selectedCities, setSelectedCities] = useState<City[]>([]);
  const [selectedEventTypes, setSelectedEventTypes] = useState<EventType[]>([]);
  const [selectedPackageItems, setSelectedPackageItems] = useState<PackageItem[]>([]);

  // Customize options
  const [customizeOptions, setCustomizeOptions] = useState<CustomizeOption[]>([]);
  const [newCustomizeOption, setNewCustomizeOption] = useState<CustomizeOption>({
    key: '',
    name: '',
    description: '',
    pricing: {
      earlyBird: { regular: 0, returningUniversity: 0 },
      standard: { regular: 0, returningUniversity: 0 }
    }
  });

  // Timeline events
  const [timelineEvents, setTimelineEvents] = useState<TimelineEvent[]>([]);
  const [newTimelineEvent, setNewTimelineEvent] = useState<TimelineEvent>({
    dateRange: '',
    location: '',
    description: '',
    sortOrder: 0
  });

  // New entity creation forms
  const [newCity, setNewCity] = useState<{ name: string; imageUrl: string; wikiUrl: string }>({ 
    name: '', 
    imageUrl: '', 
    wikiUrl: '' 
  });
  const [newEventType, setNewEventType] = useState('');
  const [newPackageItem, setNewPackageItem] = useState('');
  
  const [additionalImages, setAdditionalImages] = useState<string[]>([]);

  const [isLoading, setIsLoading] = useState(false);
  const [isLoadingTour, setIsLoadingTour] = useState(true);
  const [isLoadingEntities, setIsLoadingEntities] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<boolean>(false);
  const [tour, setTour] = useState<TourFull | null>(null);

  // Load tour data and shared entities on component mount
  useEffect(() => {
    loadTourData();
    loadSharedEntities();
  }, [tourId]);

  const loadTourData = async () => {
    try {
      setIsLoadingTour(true);
      const tourData = await toursApi.getById(tourId);
      setTour(tourData);
      
      // Helper function to convert ISO date string to YYYY-MM-DD format
      const formatDateForInput = (isoDateString: string | undefined): string => {
        if (!isoDateString) return '';
        try {
          // For date-only values that got converted to ISO strings with timezone info,
          // we need to handle the timezone offset correctly
          if (isoDateString.includes('T')) {
            // If this looks like a date-only value that was converted from UTC+7 to UTC
            // (pattern: ends with T17:00:00.000Z indicating original date was midnight in UTC+7)
            if (isoDateString.includes('T17:00:00.000Z')) {
              // Extract the date part and add one day to get the original date
              const datePart = isoDateString.split('T')[0];
              const date = new Date(datePart + 'T00:00:00.000Z');
              date.setUTCDate(date.getUTCDate() + 1);
              return date.toISOString().split('T')[0];
            }
            
            // For midnight UTC times, just return the date part as-is
            if (isoDateString.includes('T00:00:00.000Z')) {
              return isoDateString.split('T')[0];
            }
            
            // For other times, return the date part
            return isoDateString.split('T')[0];
          }
          
          // If it's already just a date string (YYYY-MM-DD), return as-is
          return isoDateString;
        } catch (error) {
          console.error('Error formatting date:', error);
          return '';
        }
      };
      
      // Populate form with existing tour data
      setFormState({
        title: tourData.title || '',
        description: tourData.description || '',
        shortDescription: tourData.shortDescription || '',
        imageUrl: tourData.imageUrl || '',
        // Handle the actual API response structure for pricing
        earlyBirdPrice: String(tourData.pricing?.earlyBird?.regular || ''),
        earlyBirdUniversityPrice: String(tourData.pricing?.earlyBird?.returningUniversity || ''),
        standardRegularPrice: String(tourData.pricing?.standard?.regular || ''),
        standardUniversityPrice: String(tourData.pricing?.standard?.returningUniversity || ''),
        date: tourData.date || '',
        location: tourData.location || '',
        duration: tourData.duration || '',
        tourDates: tourData.tourDates || '',
        customize: tourData.customize || '',
        earlyBirdDeadline: formatDateForInput(tourData.earlyBirdDeadline),
        standardDeadline: formatDateForInput(tourData.standardDeadline),
      });

      // Set additional images
      setAdditionalImages(tourData.additionalImages || []);
      
      // Set timeline events
      if (tourData.timelineEvents && Array.isArray(tourData.timelineEvents)) {
        setTimelineEvents(tourData.timelineEvents);
      } else {
        setTimelineEvents([]);
      }
      
      // Set customize options - handle the actual API response structure
      if (tourData.customizeOptions && Array.isArray(tourData.customizeOptions)) {
        const formattedCustomizeOptions = tourData.customizeOptions.map(option => ({
          key: option.key,
          name: option.name,
          description: option.description || '',
          pricing: {
            earlyBird: {
              regular: typeof option.pricing.earlyBird.regular === 'string' 
                ? parseFloat(option.pricing.earlyBird.regular) 
                : option.pricing.earlyBird.regular,
              returningUniversity: typeof option.pricing.earlyBird.returningUniversity === 'string'
                ? parseFloat(option.pricing.earlyBird.returningUniversity)
                : option.pricing.earlyBird.returningUniversity
            },
            standard: {
              regular: typeof option.pricing.standard.regular === 'string'
                ? parseFloat(option.pricing.standard.regular)
                : option.pricing.standard.regular,
              returningUniversity: typeof option.pricing.standard.returningUniversity === 'string'
                ? parseFloat(option.pricing.standard.returningUniversity)
                : option.pricing.standard.returningUniversity
            }
          }
        }));
        setCustomizeOptions(formattedCustomizeOptions);
      } else {
        setCustomizeOptions([]);
      }
      
    } catch (error) {
      console.error('Error loading tour data:', error);
      setError('Failed to load tour data');
    } finally {
      setIsLoadingTour(false);
    }
  };

  const loadSharedEntities = async () => {
    try {
      setIsLoadingEntities(true);
      const [cities, eventTypes, packageItems] = await Promise.all([
        toursApi.getCities(),
        toursApi.getEventTypes(),
        toursApi.getPackageItems()
      ]);
      
      setAvailableCities(cities);
      setAvailableEventTypes(eventTypes);
      setAvailablePackageItems(packageItems);
    } catch (error) {
      console.error('Error loading shared entities:', error);
      setError('Failed to load cities, event types, and package items');
    } finally {
      setIsLoadingEntities(false);
    }
  };

  // Populate selected entities when both tour data and entities are loaded
  useEffect(() => {
    if (tour && availableCities.length > 0 && availableEventTypes.length > 0 && availablePackageItems.length > 0) {
      // Convert tour cities to selected cities format
      const tourCities = tour.cities.map(city => {
        const foundCity = availableCities.find(c => c.id === city.id || c.name === city.name);
        return foundCity || {
          id: city.id || -1, // Use the city's ID if available, otherwise temporary ID
          name: city.name,
          imageUrl: city.imageUrl,
          wikiUrl: city.wikiUrl
        };
      });
      setSelectedCities(tourCities);

      // Convert tour event types to selected event types format
      const tourEventTypes = tour.eventTypes.map(eventTypeName => {
        const foundEventType = availableEventTypes.find(et => et.name === eventTypeName);
        return foundEventType || {
          id: -1, // Temporary ID for event types not in available list
          name: eventTypeName
        };
      });
      setSelectedEventTypes(tourEventTypes);

      // Convert tour package includes to selected package items format
      const tourPackageItems = tour.packageIncludes.map(packageItemName => {
        const foundPackageItem = availablePackageItems.find(pi => pi.name === packageItemName);
        return foundPackageItem || {
          id: -1, // Temporary ID for package items not in available list
          name: packageItemName
        };
      });
      setSelectedPackageItems(tourPackageItems);
    }
  }, [tour, availableCities, availableEventTypes, availablePackageItems]);
  
  // Handle main form changes
  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormState(prev => ({
      ...prev,
      [name]: value
    }));
  };

  // Handle city form changes
  const handleCityChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setNewCity(prev => ({
      ...prev,
      [name]: value
    }));
  };

  // Handle main image upload
  const handleMainImageUploaded = (imageUrl: string) => {
    setFormState(prev => ({
      ...prev,
      imageUrl
    }));
  };

  // Handle city image upload
  const handleCityImageUploaded = (imageUrl: string) => {
    setNewCity(prev => ({
      ...prev,
      imageUrl
    }));
  };

  // Handle additional image upload
  const handleAdditionalImageUploaded = (imageUrl: string) => {
    setAdditionalImages(prev => [...prev, imageUrl]);
  };

  // Select existing city
  const selectCity = (city: City) => {
    if (!selectedCities.find(c => c.id === city.id)) {
      setSelectedCities(prev => [...prev, city]);
    }
  };

  // Create and select new city
  const createAndSelectCity = async (e: React.FormEvent) => {
    e.preventDefault();
    if (newCity.name && newCity.imageUrl) {
      try {
        const createdCity = await toursApi.createCity(newCity);
        setAvailableCities(prev => [...prev, createdCity]);
        setSelectedCities(prev => [...prev, createdCity]);
        setNewCity({ name: '', imageUrl: '', wikiUrl: '' });
      } catch (error) {
        console.error('Error creating city:', error);
        setError('Failed to create city');
      }
    }
  };

  // Remove selected city
  const removeSelectedCity = (cityId: number) => {
    setSelectedCities(prev => prev.filter(c => c.id !== cityId));
  };

  // Select existing event type
  const selectEventType = (eventType: EventType) => {
    if (!selectedEventTypes.find(et => et.id === eventType.id)) {
      setSelectedEventTypes(prev => [...prev, eventType]);
    }
  };

  // Create and select new event type
  const createAndSelectEventType = async (e: React.FormEvent) => {
    e.preventDefault();
    if (newEventType.trim()) {
      try {
        const createdEventType = await toursApi.createEventType({ name: newEventType.trim() });
        setAvailableEventTypes(prev => [...prev, createdEventType]);
        setSelectedEventTypes(prev => [...prev, createdEventType]);
        setNewEventType('');
      } catch (error) {
        console.error('Error creating event type:', error);
        setError('Failed to create event type');
      }
    }
  };

  // Remove selected event type
  const removeSelectedEventType = (eventTypeId: number) => {
    setSelectedEventTypes(prev => prev.filter(et => et.id !== eventTypeId));
  };

  // Select existing package item
  const selectPackageItem = (packageItem: PackageItem) => {
    if (!selectedPackageItems.find(pi => pi.id === packageItem.id)) {
      setSelectedPackageItems(prev => [...prev, packageItem]);
    }
  };

  // Create and select new package item
  const createAndSelectPackageItem = async (e: React.FormEvent) => {
    e.preventDefault();
    if (newPackageItem.trim()) {
      try {
        const createdPackageItem = await toursApi.createPackageItem({ name: newPackageItem.trim() });
        setAvailablePackageItems(prev => [...prev, createdPackageItem]);
        setSelectedPackageItems(prev => [...prev, createdPackageItem]);
        setNewPackageItem('');
      } catch (error) {
        console.error('Error creating package item:', error);
        setError('Failed to create package item');
      }
    }
  };

  // Remove selected package item
  const removeSelectedPackageItem = (packageItemId: number) => {
    setSelectedPackageItems(prev => prev.filter(pi => pi.id !== packageItemId));
  };

  // Remove additional image
  const removeImage = async (index: number) => {
    const imageUrl = additionalImages[index];
    
    try {
      // Call the backend to delete the image
      const response = await fetch(`${API_BASE_URL}/upload/image/delete`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ imageUrl }),
      });

      if (!response.ok) {
        console.warn('Failed to delete image from server, but removing from list anyway');
      }
    } catch (error) {
      console.warn('Error deleting image from server:', error);
    }
    
    // Remove from the local state regardless of server response
    setAdditionalImages(prev => prev.filter((_, i) => i !== index));
  };

  // Handle customize option form changes
  const handleCustomizeOptionChange = (field: string, value: string | number) => {
    if (field.includes('.')) {
      const [section, subsection, key] = field.split('.');
      if (section === 'pricing' && (subsection === 'earlyBird' || subsection === 'standard')) {
        setNewCustomizeOption(prev => ({
          ...prev,
          pricing: {
            ...prev.pricing,
            [subsection]: {
              ...prev.pricing[subsection],
              [key]: typeof value === 'string' ? parseFloat(value) || 0 : value
            }
          }
        }));
      }
    } else {
      setNewCustomizeOption(prev => ({
        ...prev,
        [field]: value
      }));
    }
  };

  // Add customize option
  const addCustomizeOption = () => {
    if (newCustomizeOption.key && newCustomizeOption.name) {
      // Check if key already exists
      if (customizeOptions.find(opt => opt.key === newCustomizeOption.key)) {
        setError('Customize option key already exists');
        return;
      }
      
      setCustomizeOptions(prev => [...prev, { ...newCustomizeOption }]);
      setNewCustomizeOption({
        key: '',
        name: '',
        description: '',
        pricing: {
          earlyBird: { regular: 0, returningUniversity: 0 },
          standard: { regular: 0, returningUniversity: 0 }
        }
      });
      setError(null);
    }
  };

  // Remove customize option
  const removeCustomizeOption = (key: string) => {
    setCustomizeOptions(prev => prev.filter(opt => opt.key !== key));
  };

  // Handle timeline event form changes
  const handleTimelineEventChange = (field: string, value: string | number) => {
    setNewTimelineEvent(prev => ({
      ...prev,
      [field]: field === 'sortOrder' ? Number(value) : value
    }));
  };

  // Add timeline event
  const addTimelineEvent = () => {
    if (newTimelineEvent.dateRange && newTimelineEvent.location) {
      const eventWithSortOrder = {
        ...newTimelineEvent,
        sortOrder: timelineEvents.length
      };
      setTimelineEvents(prev => [...prev, eventWithSortOrder]);
      setNewTimelineEvent({
        dateRange: '',
        location: '',
        description: '',
        sortOrder: timelineEvents.length + 1
      });
    }
  };

  // Remove timeline event
  const removeTimelineEvent = (index: number) => {
    setTimelineEvents(prev => prev.filter((_, i) => i !== index));
  };

  // Drag and drop handlers for timeline events
  const handleDragStart = (e: React.DragEvent, index: number) => {
    e.dataTransfer.setData('text/plain', index.toString());
    e.dataTransfer.effectAllowed = 'move';
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    e.dataTransfer.dropEffect = 'move';
  };

  const handleDrop = (e: React.DragEvent, dropIndex: number) => {
    e.preventDefault();
    const dragIndex = parseInt(e.dataTransfer.getData('text/plain'), 10);
    
    if (dragIndex === dropIndex) return;
    
    const updatedEvents = [...timelineEvents];
    const [draggedEvent] = updatedEvents.splice(dragIndex, 1);
    updatedEvents.splice(dropIndex, 0, draggedEvent);
    
    // Update sortOrder for all events
    const reorderedEvents = updatedEvents.map((event, index) => ({
      ...event,
      sortOrder: index
    }));
    
    setTimelineEvents(reorderedEvents);
  };

  // Add preset timeline events
  const addPresetTimelineEvents = (tourType: 'fall' | 'spring') => {
    if (tourType === 'fall') {
      setTimelineEvents([
        { dateRange: '01 - 02.10', location: 'HUE', description: 'School visits in Hue', sortOrder: 0 },
        { dateRange: '03 - 04.10', location: 'DA NANG', description: 'School visits in Da Nang', sortOrder: 1 },
        { dateRange: '05 - 06.10', location: 'TAM KY', description: 'School visits in Tam Ky', sortOrder: 2 }
      ]);
    } else if (tourType === 'spring') {
      setTimelineEvents([
        { dateRange: '01 - 02.04', location: 'HANOI', description: 'School visits in Hanoi', sortOrder: 0 },
        { dateRange: '03 - 04.04', location: 'HAI PHONG', description: 'School visits in Hai Phong', sortOrder: 1 },
        { dateRange: '06.04', location: 'HUE', description: 'School visits in Hue', sortOrder: 2 },
        { dateRange: '07 - 08.04', location: 'DA NANG', description: 'School visits in Da Nang', sortOrder: 3 },
        { dateRange: '09 - 10.04', location: 'HO CHI MINH CITY', description: 'School visits in Ho Chi Minh City', sortOrder: 4 }
      ]);
    }
  };

  // Quick add preset customize options
  const addPresetCustomizeOptions = (type: 'fall' | 'spring') => {
    const fallOptions: CustomizeOption[] = [
      {
        key: 'northern',
        name: 'Northern Vietnam Tour',
        description: 'Experience the northern regions of Vietnam',
        pricing: {
          earlyBird: { regular: 2065, returningUniversity: 1720 },
          standard: { regular: 2295, returningUniversity: 1950 }
        }
      },
      {
        key: 'central',
        name: 'Central Vietnam Tour',
        description: 'Explore the central regions of Vietnam',
        pricing: {
          earlyBird: { regular: 2160, returningUniversity: 1800 },
          standard: { regular: 2400, returningUniversity: 2040 }
        }
      },
      {
        key: 'grandTotal',
        name: 'Full Tour Package',
        description: 'Complete tour experience covering all regions',
        pricing: {
          earlyBird: { regular: 4225, returningUniversity: 3520 },
          standard: { regular: 4695, returningUniversity: 3990 }
        }
      }
    ];

    const springOptions: CustomizeOption[] = [
      {
        key: 'northern',
        name: 'Northern Vietnam Tour',
        description: 'Experience the northern regions of Vietnam including Hanoi & Hai Phong',
        pricing: {
          earlyBird: { regular: 2635, returningUniversity: 2200 },
          standard: { regular: 2930, returningUniversity: 2490 }
        }
      },
      {
        key: 'central',
        name: 'Central Vietnam Tour',
        description: 'Explore the central regions of Vietnam including Da Nang & Hue',
        pricing: {
          earlyBird: { regular: 2160, returningUniversity: 1800 },
          standard: { regular: 2400, returningUniversity: 2040 }
        }
      },
      {
        key: 'southern',
        name: 'Southern Vietnam Tour',
        description: 'Discover southern Vietnam including Ho Chi Minh City',
        pricing: {
          earlyBird: { regular: 1375, returningUniversity: 1145 },
          standard: { regular: 1530, returningUniversity: 1300 }
        }
      },
      {
        key: 'grandTotal',
        name: 'Full Tour Package',
        description: 'Complete tour experience covering all three regions',
        pricing: {
          earlyBird: { regular: 6170, returningUniversity: 5145 },
          standard: { regular: 6860, returningUniversity: 5830 }
        }
      }
    ];

    const options = type === 'fall' ? fallOptions : springOptions;
    setCustomizeOptions(options);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError(null);

    try {
      // Convert string values to appropriate types
      const earlyBirdPrice = parseFloat(formState.earlyBirdPrice);
      const earlyBirdUniversityPrice = parseFloat(formState.earlyBirdUniversityPrice);
      const standardRegularPrice = parseFloat(formState.standardRegularPrice);
      const standardUniversityPrice = parseFloat(formState.standardUniversityPrice);

      const tourData: TourCreateInput = {
        title: formState.title,
        description: formState.description,
        shortDescription: formState.shortDescription,
        imageUrl: formState.imageUrl,
        // Structured pricing
        earlyBirdPrice,
        earlyBirdUniversityPrice,
        standardRegularPrice,
        standardUniversityPrice,
        date: formState.date,
        location: formState.location,
        duration: formState.duration,
        tourDates: formState.tourDates,
        customize: formState.customize,
        earlyBirdDeadline: formState.earlyBirdDeadline || undefined,
        standardDeadline: formState.standardDeadline || undefined,
        cities: selectedCities.filter(city => city.id !== -1), // Only include cities with valid IDs
        eventTypes: selectedEventTypes.filter(et => et.id !== -1), // Only include event types with valid IDs
        packageIncludes: selectedPackageItems.filter(pi => pi.id !== -1), // Only include package items with valid IDs
        additionalImages,
        customizeOptions,
        timelineEvents
      };

      await toursApi.update(tourId, tourData);

      setSuccess(true);
      setTimeout(() => {
        onClose();
      }, 2000);
    } catch (error) {
      console.error('Error updating tour:', error);
      setError(error instanceof Error ? error.message : 'An unknown error occurred');
    } finally {
      setIsLoading(false);
    }
  };

  if (isLoadingTour || isLoadingEntities) {
    return (
      <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
        <div className="bg-white rounded-lg shadow-xl p-6">
          <div className="flex items-center">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
            <span className="ml-3">Loading tour data...</span>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
      <div className="bg-white rounded-lg shadow-xl p-6 w-full max-w-4xl max-h-[90vh] overflow-y-auto">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-bold">Edit Tour: {tour?.title}</h2>
          <button 
            onClick={onClose} 
            className="text-gray-500 hover:text-gray-700"
          >
            ✕
          </button>
        </div>

        {success ? (
          <div className="bg-green-50 border border-green-400 text-green-700 px-4 py-3 rounded mb-4">
            Tour updated successfully! Redirecting...
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-4">
            {error && (
              <div className="bg-red-50 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
                {error}
              </div>
            )}

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700">Title*</label>
                <input
                  type="text"
                  name="title"
                  value={formState.title}
                  onChange={handleChange}
                  required
                  className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700">Main Image*</label>
                <div className="mt-1 flex items-center">
                  {formState.imageUrl ? (
                    <div className="relative group mr-2">
                      <img 
                        src={formState.imageUrl} 
                        alt="Main tour image" 
                        className="h-16 w-16 object-cover rounded"
                      />
                      <button
                        type="button"
                        onClick={() => setFormState(prev => ({ ...prev, imageUrl: '' }))}
                        className="absolute -top-1 -right-1 bg-red-500 text-white rounded-full w-5 h-5 flex items-center justify-center text-xs"
                      >
                        ✕
                      </button>
                    </div>
                  ) : null}
                  <TourImageEditor 
                    currentImageUrl={formState.imageUrl}
                    onImageUploaded={handleMainImageUploaded}
                    label={formState.imageUrl ? "Change Image" : "Upload Image"}
                  />
                </div>
                {!formState.imageUrl && (
                  <input
                    type="text"
                    name="imageUrl"
                    value={formState.imageUrl}
                    onChange={handleChange}
                    placeholder="Or enter image URL manually"
                    className="mt-2 block w-full border border-gray-300 rounded-md shadow-sm p-2 text-sm"
                  />
                )}
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700">Short Description*</label>
              <input
                type="text"
                name="shortDescription"
                value={formState.shortDescription}
                onChange={handleChange}
                required
                className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700">Full Description*</label>
              <textarea
                name="description"
                value={formState.description}
                onChange={handleChange}
                required
                rows={4}
                className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2"
              />
            </div>

            {/* Pricing Section */}
            <div className="border border-gray-200 rounded-lg p-4 bg-gray-50">
              <h3 className="text-lg font-medium text-gray-900 mb-3">Pricing Structure</h3>
              <p className="text-sm text-gray-600 mb-4">
                Set the four different pricing tiers for your tour. Early Bird prices apply before the early bird deadline.
              </p>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Early Bird Pricing */}
                <div className="border border-blue-200 rounded-lg p-3 bg-blue-50">
                  <h4 className="font-medium text-blue-900 mb-3">Early Bird Pricing</h4>
                  <div className="space-y-3">
                    <div>
                      <label className="block text-sm font-medium text-gray-700">Regular Students*</label>
                      <input
                        type="number"
                        name="earlyBirdPrice"
                        value={formState.earlyBirdPrice}
                        onChange={handleChange}
                        required
                        min="0"
                        step="0.01"
                        placeholder="e.g. 1800"
                        className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700">Returning University Students*</label>
                      <input
                        type="number"
                        name="earlyBirdUniversityPrice"
                        value={formState.earlyBirdUniversityPrice}
                        onChange={handleChange}
                        required
                        min="0"
                        step="0.01"
                        placeholder="e.g. 1600"
                        className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2"
                      />
                    </div>
                  </div>
                </div>

                {/* Standard Pricing */}
                <div className="border border-orange-200 rounded-lg p-3 bg-orange-50">
                  <h4 className="font-medium text-orange-900 mb-3">Standard Pricing</h4>
                  <div className="space-y-3">
                    <div>
                      <label className="block text-sm font-medium text-gray-700">Regular Students*</label>
                      <input
                        type="number"
                        name="standardRegularPrice"
                        value={formState.standardRegularPrice}
                        onChange={handleChange}
                        required
                        min="0"
                        step="0.01"
                        placeholder="e.g. 2000"
                        className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700">Returning University Students*</label>
                      <input
                        type="number"
                        name="standardUniversityPrice"
                        value={formState.standardUniversityPrice}
                        onChange={handleChange}
                        required
                        min="0"
                        step="0.01"
                        placeholder="e.g. 1800"
                        className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2"
                      />
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700">Display Date*</label>
                <input
                  type="text"
                  name="date"
                  value={formState.date}
                  onChange={handleChange}
                  required
                  placeholder="e.g. JULY 4"
                  className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700">Tour Dates</label>
                <input
                  type="text"
                  name="tourDates"
                  value={formState.tourDates}
                  onChange={handleChange}
                  placeholder="e.g. JULY 4 - JULY 11"
                  className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700">Location*</label>
                <input
                  type="text"
                  name="location"
                  value={formState.location}
                  onChange={handleChange}
                  required
                  className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700">Duration*</label>
                <input
                  type="text"
                  name="duration"
                  value={formState.duration}
                  onChange={handleChange}
                  required
                  placeholder="e.g. 7 Days"
                  className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700">Customize Options</label>
              <textarea
                name="customize"
                value={formState.customize}
                onChange={handleChange}
                placeholder="e.g. You can choose between the full tour, the northern tour or the central tour."
                rows={2}
                className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2"
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700">Early Bird Deadline</label>
                <input
                  type="date"
                  name="earlyBirdDeadline"
                  value={formState.earlyBirdDeadline}
                  onChange={handleChange}
                  className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700">Standard Deadline</label>
                <input
                  type="date"
                  name="standardDeadline"
                  value={formState.standardDeadline}
                  onChange={handleChange}
                  className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2"
                />
              </div>
            </div>

            {/* Cities Section */}
            <div className="border-t pt-4 mt-6">
              <h3 className="text-lg font-medium mb-2">Cities</h3>
              
              {/* Selected Cities */}
              <div className="mb-4">
                <h4 className="text-sm font-medium text-gray-700 mb-2">Selected Cities ({selectedCities.length})</h4>
                {selectedCities.length === 0 ? (
                  <p className="text-gray-500 text-sm">No cities selected yet</p>
                ) : (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-2 mb-4">
                    {selectedCities.map((city, index) => (
                      <div key={city.id !== -1 ? city.id : `temp-${index}`} className="flex items-center justify-between bg-blue-50 p-2 rounded">
                        <div className="flex items-center">
                          <img 
                            src={city.imageUrl} 
                            alt={city.name}
                            className="h-10 w-10 object-cover rounded mr-3"
                            onError={(e) => {
                              (e.target as HTMLImageElement).src = 'https://via.placeholder.com/40?text=Error';
                            }}
                          />
                          <div>
                            <span className="font-medium">{city.name}</span>
                            {city.wikiUrl && (
                              <div className="text-xs text-gray-500">
                                <a href={city.wikiUrl} target="_blank" rel="noopener noreferrer" className="text-blue-500 hover:underline">
                                  Wiki Link
                                </a>
                              </div>
                            )}
                            {city.id === -1 && (
                              <div className="text-xs text-orange-500">Existing city</div>
                            )}
                          </div>
                        </div>
                        <button 
                          type="button" 
                          onClick={() => removeSelectedCity(city.id)}
                          className="text-red-500 hover:text-red-700 text-sm"
                        >
                          Remove
                        </button>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              {/* Available Cities */}
              <div className="mb-4">
                <h4 className="text-sm font-medium text-gray-700 mb-2">Available Cities</h4>
                {availableCities.length === 0 ? (
                  <p className="text-gray-500 text-sm">No cities available</p>
                ) : (
                  <div className="max-h-32 overflow-y-auto border border-gray-200 rounded p-2">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-1">
                      {availableCities
                        .filter(city => !selectedCities.find(sc => sc.id === city.id))
                        .map((city) => (
                        <button
                          key={city.id}
                          type="button"
                          onClick={() => selectCity(city)}
                          className="flex items-center p-2 text-left hover:bg-gray-50 rounded text-sm"
                        >
                          <img 
                            src={city.imageUrl} 
                            alt={city.name}
                            className="h-6 w-6 object-cover rounded mr-2"
                            onError={(e) => {
                              (e.target as HTMLImageElement).src = 'https://via.placeholder.com/24?text=E';
                            }}
                          />
                          <span>{city.name}</span>
                        </button>
                      ))}
                    </div>
                  </div>
                )}
              </div>

              {/* Create New City */}
              <div className="border border-gray-200 rounded p-3 bg-gray-50">
                <h4 className="text-sm font-medium text-gray-700 mb-2">Create New City</h4>
                <div className="grid grid-cols-1 md:grid-cols-4 gap-2">
                  <input
                    type="text"
                    name="name"
                    value={newCity.name}
                    onChange={handleCityChange}
                    placeholder="City Name"
                    className="border border-gray-300 rounded-md shadow-sm p-2 text-sm"
                  />
                  <div className="flex items-center space-x-2">
                    {newCity.imageUrl && (
                      <img 
                        src={newCity.imageUrl} 
                        alt="City preview" 
                        className="h-8 w-8 object-cover rounded"
                      />
                    )}
                    <TourImageEditor 
                      currentImageUrl={newCity.imageUrl}
                      onImageUploaded={handleCityImageUploaded}
                      label="City Image"
                      className="flex-1"
                    />
                  </div>
                  <input
                    type="text"
                    name="wikiUrl"
                    value={newCity.wikiUrl}
                    onChange={handleCityChange}
                    placeholder="Wiki URL (optional)"
                    className="border border-gray-300 rounded-md shadow-sm p-2 text-sm"
                  />
                  <button
                    type="button"
                    onClick={createAndSelectCity}
                    disabled={!newCity.name || !newCity.imageUrl}
                    className={`px-3 py-2 rounded-md text-white text-sm ${
                      !newCity.name || !newCity.imageUrl
                        ? 'bg-gray-300 cursor-not-allowed'
                        : 'bg-blue-500 hover:bg-blue-600'
                    }`}
                  >
                    Create & Add
                  </button>
                </div>
              </div>
            </div>

            {/* Event Types Section */}
            <div className="border-t pt-4">
              <h3 className="text-lg font-medium mb-2">Event Types</h3>
              
              {/* Selected Event Types */}
              <div className="mb-4">
                <h4 className="text-sm font-medium text-gray-700 mb-2">Selected Event Types ({selectedEventTypes.length})</h4>
                {selectedEventTypes.length === 0 ? (
                  <p className="text-gray-500 text-sm">No event types selected yet</p>
                ) : (
                  <div className="flex flex-wrap gap-2 mb-4">
                    {selectedEventTypes.map((eventType, index) => (
                      <div key={eventType.id !== -1 ? eventType.id : `temp-${index}`} className="flex items-center bg-blue-50 px-3 py-1 rounded">
                        <span>{eventType.name}</span>
                        {eventType.id === -1 && (
                          <span className="ml-1 text-xs text-orange-500">(existing)</span>
                        )}
                        <button 
                          type="button" 
                          onClick={() => removeSelectedEventType(eventType.id)}
                          className="ml-2 text-red-500 hover:text-red-700"
                        >
                          ✕
                        </button>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              {/* Available Event Types */}
              <div className="mb-4">
                <h4 className="text-sm font-medium text-gray-700 mb-2">Available Event Types</h4>
                {availableEventTypes.length === 0 ? (
                  <p className="text-gray-500 text-sm">No event types available</p>
                ) : (
                  <div className="max-h-32 overflow-y-auto border border-gray-200 rounded p-2">
                    <div className="flex flex-wrap gap-1">
                      {availableEventTypes
                        .filter(eventType => !selectedEventTypes.find(set => set.id === eventType.id))
                        .map((eventType) => (
                        <button
                          key={eventType.id}
                          type="button"
                          onClick={() => selectEventType(eventType)}
                          className="px-2 py-1 text-sm bg-gray-100 hover:bg-gray-200 rounded border"
                        >
                          {eventType.name}
                        </button>
                      ))}
                    </div>
                  </div>
                )}
              </div>

              {/* Create New Event Type */}
              <div className="border border-gray-200 rounded p-3 bg-gray-50">
                <h4 className="text-sm font-medium text-gray-700 mb-2">Create New Event Type</h4>
                <div className="flex gap-2">
                  <input
                    type="text"
                    value={newEventType}
                    onChange={(e) => setNewEventType(e.target.value)}
                    placeholder="Event type name"
                    className="flex-1 border border-gray-300 rounded-md shadow-sm p-2 text-sm"
                  />
                  <button
                    type="button"
                    onClick={createAndSelectEventType}
                    disabled={!newEventType.trim()}
                    className={`px-3 py-2 rounded-md text-white text-sm ${
                      !newEventType.trim() 
                        ? 'bg-gray-300 cursor-not-allowed' 
                        : 'bg-blue-500 hover:bg-blue-600'
                    }`}
                  >
                    Create & Add
                  </button>
                </div>
              </div>
            </div>

            {/* Package Includes Section */}
            <div className="border-t pt-4">
              <h3 className="text-lg font-medium mb-2">Package Includes</h3>
              
              {/* Selected Package Items */}
              <div className="mb-4">
                <h4 className="text-sm font-medium text-gray-700 mb-2">Selected Package Items ({selectedPackageItems.length})</h4>
                {selectedPackageItems.length === 0 ? (
                  <p className="text-gray-500 text-sm">No package items selected yet</p>
                ) : (
                  <ul className="list-disc pl-5 mb-4 space-y-1">
                    {selectedPackageItems.map((item, index) => (
                      <li key={item.id !== -1 ? item.id : `temp-${index}`} className="flex items-center justify-between">
                        <span>
                          {item.name}
                          {item.id === -1 && (
                            <span className="ml-1 text-xs text-orange-500">(existing)</span>
                          )}
                        </span>
                        <button 
                          type="button" 
                          onClick={() => removeSelectedPackageItem(item.id)}
                          className="text-red-500 hover:text-red-700 text-sm ml-4"
                        >
                          Remove
                        </button>
                      </li>
                    ))}
                  </ul>
                )}
              </div>

              {/* Available Package Items */}
              <div className="mb-4">
                <h4 className="text-sm font-medium text-gray-700 mb-2">Available Package Items</h4>
                {availablePackageItems.length === 0 ? (
                  <p className="text-gray-500 text-sm">No package items available</p>
                ) : (
                  <div className="max-h-32 overflow-y-auto border border-gray-200 rounded p-2">
                    <div className="space-y-1">
                      {availablePackageItems
                        .filter(item => !selectedPackageItems.find(spi => spi.id === item.id))
                        .map((item) => (
                        <button
                          key={item.id}
                          type="button"
                          onClick={() => selectPackageItem(item)}
                          className="block w-full text-left px-2 py-1 text-sm hover:bg-gray-50 rounded border-b border-gray-100"
                        >
                          {item.name}
                        </button>
                      ))}
                    </div>
                  </div>
                )}
              </div>

              {/* Create New Package Item */}
              <div className="border border-gray-200 rounded p-3 bg-gray-50">
                <h4 className="text-sm font-medium text-gray-700 mb-2">Create New Package Item</h4>
                <div className="flex gap-2">
                  <input
                    type="text"
                    value={newPackageItem}
                    onChange={(e) => setNewPackageItem(e.target.value)}
                    placeholder="Package item description"
                    className="flex-1 border border-gray-300 rounded-md shadow-sm p-2 text-sm"
                  />
                  <button
                    type="button"
                    onClick={createAndSelectPackageItem}
                    disabled={!newPackageItem.trim()}
                    className={`px-3 py-2 rounded-md text-white text-sm ${
                      !newPackageItem.trim() 
                        ? 'bg-gray-300 cursor-not-allowed' 
                        : 'bg-blue-500 hover:bg-blue-600'
                    }`}
                  >
                    Create & Add
                  </button>
                </div>
              </div>
            </div>

            {/* Additional Images Section */}
            <div className="border-t pt-4">
              <h3 className="text-lg font-medium mb-2">Additional Images</h3>
              <div className="mb-4">
                <div className="mb-4">
                  <TourImageEditor 
                    onImageUploaded={handleAdditionalImageUploaded}
                    label="Upload Additional Image"
                  />
                  <p className="text-xs text-gray-500 mt-1">Upload images one by one</p>
                </div>
                
                {additionalImages.length === 0 ? (
                  <p className="text-gray-500 text-sm">No additional images added yet</p>
                ) : (
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-2 mb-4">
                    {additionalImages.map((imageUrl, index) => (
                      <div key={index} className="relative group border border-gray-200 rounded-lg p-2 bg-white">
                        <img 
                          src={imageUrl} 
                          alt={`Additional image ${index + 1}`}
                          className="h-24 w-full object-cover rounded border mb-2"
                          onError={(e) => {
                            (e.target as HTMLImageElement).src = 'https://via.placeholder.com/150?text=Image+Error';
                          }}
                        />
                        <div className="flex justify-between items-center">
                          <TourImageEditor 
                            currentImageUrl={imageUrl}
                            onImageUploaded={(newImageUrl) => {
                              const newImages = [...additionalImages];
                              newImages[index] = newImageUrl;
                              setAdditionalImages(newImages);
                            }}
                            label="Replace"
                            className="flex-1 mr-2"
                            imageClassName="hidden"
                          />
                          <button 
                            type="button" 
                            onClick={() => removeImage(index)}
                            className="bg-red-500 text-white rounded px-2 py-1 text-xs hover:bg-red-600"
                          >
                            Remove
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>

            {/* Timeline Events Section */}
            <div className="border-t pt-4">
              <h3 className="text-lg font-medium mb-2">Timeline Events</h3>
              <p className="text-sm text-gray-600 mb-4">
                Add events that occur during the tour.
              </p>
              
              {/* Quick Add Presets for Timeline */}
              <div className="mb-4 p-3 bg-green-50 rounded-lg">
                <h4 className="text-sm font-medium text-green-900 mb-2">Quick Add Timeline Presets</h4>
                <div className="flex gap-2">
                  <button
                    type="button"
                    onClick={() => addPresetTimelineEvents('fall')}
                    className="px-3 py-1 bg-green-500 text-white rounded text-sm hover:bg-green-600"
                  >
                    Add Fall Timeline
                  </button>
                  <button
                    type="button"
                    onClick={() => addPresetTimelineEvents('spring')}
                    className="px-3 py-1 bg-blue-500 text-white rounded text-sm hover:bg-blue-600"
                  >
                    Add Spring Timeline
                  </button>
                  <button
                    type="button"
                    onClick={() => setTimelineEvents([])}
                    className="px-3 py-1 bg-gray-500 text-white rounded text-sm hover:bg-gray-600"
                  >
                    Clear Timeline
                  </button>
                </div>
              </div>

              {/* Selected Timeline Events */}
              <div className="mb-4">
                <h4 className="text-sm font-medium text-gray-700 mb-2">Selected Timeline Events ({timelineEvents.length})</h4>
                {timelineEvents.length === 0 ? (
                  <p className="text-gray-500 text-sm">No timeline events added yet</p>
                ) : (
                  <div className="space-y-3">
                    <p className="text-xs text-blue-600 mb-2">💡 Tip: Drag and drop events to reorder them</p>
                    {timelineEvents.map((event, index) => (
                      <div 
                        key={index} 
                        className="border border-gray-200 rounded-lg p-3 cursor-move hover:border-blue-300 hover:shadow-sm transition-all duration-150"
                        draggable
                        onDragStart={(e) => handleDragStart(e, index)}
                        onDragOver={handleDragOver}
                        onDrop={(e) => handleDrop(e, index)}
                      >
                        <div className="flex justify-between items-start mb-2">
                          <div className="flex items-start space-x-3">
                            <div className="flex-shrink-0 mt-1">
                              <svg className="w-4 h-4 text-gray-400" fill="currentColor" viewBox="0 0 20 20">
                                <path d="M7 2a1 1 0 00-1 1v1H4a1 1 0 000 2h1v1a1 1 0 002 0V6h1a1 1 0 100-2H7V3a1 1 0 00-1-1zM7 8a1 1 0 00-1 1v1H4a1 1 0 100 2h1v1a1 1 0 002 0v-1h1a1 1 0 100-2H7V9a1 1 0 00-1-1zM7 14a1 1 0 00-1 1v1H4a1 1 0 100 2h1v1a1 1 0 002 0v-1h1a1 1 0 100-2H7v-1a1 1 0 00-1-1z"/>
                              </svg>
                            </div>
                            <div>
                              <div className="flex items-center space-x-2">
                                <span className="text-xs bg-blue-100 text-blue-800 px-2 py-1 rounded">#{index + 1}</span>
                                <h5 className="font-medium text-gray-900">{event.dateRange}</h5>
                              </div>
                              <p className="text-sm text-gray-600">{event.location}</p>
                              {event.description && (
                                <p className="text-sm text-gray-500 mt-1">{event.description}</p>
                              )}
                            </div>
                          </div>
                          <button
                            type="button"
                            onClick={() => removeTimelineEvent(index)}
                            className="text-red-500 hover:text-red-700 text-sm flex-shrink-0"
                          >
                            Remove
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              {/* Add New Timeline Event */}
              <div className="border border-gray-200 rounded p-3 bg-gray-50">
                <h4 className="text-sm font-medium text-gray-700 mb-2">Add New Timeline Event</h4>
                <div className="space-y-3">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                    <div>
                      <label className="block text-xs font-medium text-gray-700 mb-1">Date Range*</label>
                      <input
                        type="text"
                        value={newTimelineEvent.dateRange}
                        onChange={(e) => handleTimelineEventChange('dateRange', e.target.value)}
                        placeholder="e.g. 01 - 02.10"
                        className="w-full border border-gray-300 rounded-md shadow-sm p-2 text-sm"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-medium text-gray-700 mb-1">Location*</label>
                      <input
                        type="text"
                        value={newTimelineEvent.location}
                        onChange={(e) => handleTimelineEventChange('location', e.target.value)}
                        placeholder="e.g. HUE"
                        className="w-full border border-gray-300 rounded-md shadow-sm p-2 text-sm"
                      />
                    </div>
                  </div>
                  
                  <div>
                    <label className="block text-xs font-medium text-gray-700 mb-1">Description</label>
                    <input
                      type="text"
                      value={newTimelineEvent.description}
                      onChange={(e) => handleTimelineEventChange('description', e.target.value)}
                      placeholder="e.g. School visits in Hue"
                      className="w-full border border-gray-300 rounded-md shadow-sm p-2 text-sm"
                    />
                  </div>

                  <div className="flex justify-end">
                    <button
                      type="button"
                      onClick={addTimelineEvent}
                      disabled={!newTimelineEvent.dateRange || !newTimelineEvent.location}
                      className={`px-4 py-2 rounded-md text-white text-sm ${
                        !newTimelineEvent.dateRange || !newTimelineEvent.location
                          ? 'bg-gray-300 cursor-not-allowed'
                          : 'bg-blue-500 hover:bg-blue-600'
                      }`}
                    >
                      Add Timeline Event
                    </button>
                  </div>
                </div>
              </div>
            </div>

            {/* Customize Options Section */}
            <div className="border-t pt-4">
              <h3 className="text-lg font-medium mb-2">Customize Options</h3>
              <p className="text-sm text-gray-600 mb-4">
                Add different tour segments with their own pricing (e.g., Northern, Central, Southern, Full Tour).
              </p>
              
              {/* Quick Add Presets */}
              <div className="mb-4 p-3 bg-blue-50 rounded-lg">
                <h4 className="text-sm font-medium text-blue-900 mb-2">Quick Add Presets</h4>
                <div className="flex gap-2">
                  <button
                    type="button"
                    onClick={() => addPresetCustomizeOptions('fall')}
                    className="px-3 py-1 bg-blue-500 text-white rounded text-sm hover:bg-blue-600"
                  >
                    Add Fall Tour Options
                  </button>
                  <button
                    type="button"
                    onClick={() => addPresetCustomizeOptions('spring')}
                    className="px-3 py-1 bg-green-500 text-white rounded text-sm hover:bg-green-600"
                  >
                    Add Spring Tour Options
                  </button>
                  <button
                    type="button"
                    onClick={() => setCustomizeOptions([])}
                    className="px-3 py-1 bg-gray-500 text-white rounded text-sm hover:bg-gray-600"
                  >
                    Clear All
                  </button>
                </div>
              </div>

              {/* Current Customize Options */}
              <div className="mb-4">
                <h4 className="text-sm font-medium text-gray-700 mb-2">Current Customize Options ({customizeOptions.length})</h4>
                {customizeOptions.length === 0 ? (
                  <p className="text-gray-500 text-sm">No customize options added yet</p>
                ) : (
                  <div className="space-y-3">
                    {customizeOptions.map((option) => (
                      <div key={option.key} className="border border-gray-200 rounded-lg p-3 bg-gray-50">
                        <div className="flex justify-between items-start mb-2">
                          <div>
                            <h5 className="font-medium text-gray-900">{option.name}</h5>
                            <p className="text-sm text-gray-600">Key: {option.key}</p>
                            {option.description && (
                              <p className="text-sm text-gray-500 mt-1">{option.description}</p>
                            )}
                          </div>
                          <button
                            type="button"
                            onClick={() => removeCustomizeOption(option.key)}
                            className="text-red-500 hover:text-red-700 text-sm"
                          >
                            Remove
                          </button>
                        </div>
                        <div className="grid grid-cols-2 gap-4 text-xs">
                          <div className="bg-blue-100 p-2 rounded">
                            <div className="font-medium text-blue-900 mb-1">Early Bird</div>
                            <div>Regular: ${option.pricing.earlyBird.regular}</div>
                            <div>University: ${option.pricing.earlyBird.returningUniversity}</div>
                          </div>
                          <div className="bg-orange-100 p-2 rounded">
                            <div className="font-medium text-orange-900 mb-1">Standard</div>
                            <div>Regular: ${option.pricing.standard.regular}</div>
                            <div>University: ${option.pricing.standard.returningUniversity}</div>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              {/* Add New Customize Option */}
              <div className="border border-gray-200 rounded-lg p-4 bg-gray-50">
                <h4 className="text-sm font-medium text-gray-700 mb-3">Add New Customize Option</h4>
                <div className="space-y-3">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                    <div>
                      <label className="block text-xs font-medium text-gray-700 mb-1">Option Key*</label>
                      <input
                        type="text"
                        value={newCustomizeOption.key}
                        onChange={(e) => handleCustomizeOptionChange('key', e.target.value)}
                        placeholder="e.g. northern, central, grandTotal"
                        className="w-full border border-gray-300 rounded-md shadow-sm p-2 text-sm"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-medium text-gray-700 mb-1">Option Name*</label>
                      <input
                        type="text"
                        value={newCustomizeOption.name}
                        onChange={(e) => handleCustomizeOptionChange('name', e.target.value)}
                        placeholder="e.g. Northern Vietnam Tour"
                        className="w-full border border-gray-300 rounded-md shadow-sm p-2 text-sm"
                      />
                    </div>
                  </div>
                  
                  <div>
                    <label className="block text-xs font-medium text-gray-700 mb-1">Description</label>
                    <input
                      type="text"
                      value={newCustomizeOption.description}
                      onChange={(e) => handleCustomizeOptionChange('description', e.target.value)}
                      placeholder="e.g. Experience the northern regions of Vietnam"
                      className="w-full border border-gray-300 rounded-md shadow-sm p-2 text-sm"
                    />
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {/* Early Bird Pricing */}
                    <div className="border border-blue-200 rounded-lg p-3 bg-blue-50">
                      <h5 className="font-medium text-blue-900 mb-2 text-sm">Early Bird Pricing</h5>
                      <div className="space-y-2">
                        <div>
                          <label className="block text-xs font-medium text-gray-700">Regular Students</label>
                          <input
                            type="number"
                            value={newCustomizeOption.pricing.earlyBird.regular}
                            onChange={(e) => handleCustomizeOptionChange('pricing.earlyBird.regular', e.target.value)}
                            min="0"
                            step="0.01"
                            className="w-full border border-gray-300 rounded-md shadow-sm p-1 text-sm"
                          />
                        </div>
                        <div>
                          <label className="block text-xs font-medium text-gray-700">University Students</label>
                          <input
                            type="number"
                            value={newCustomizeOption.pricing.earlyBird.returningUniversity}
                            onChange={(e) => handleCustomizeOptionChange('pricing.earlyBird.returningUniversity', e.target.value)}
                            min="0"
                            step="0.01"
                            className="w-full border border-gray-300 rounded-md shadow-sm p-1 text-sm"
                          />
                        </div>
                      </div>
                    </div>

                    {/* Standard Pricing */}
                    <div className="border border-orange-200 rounded-lg p-3 bg-orange-50">
                      <h5 className="font-medium text-orange-900 mb-2 text-sm">Standard Pricing</h5>
                      <div className="space-y-2">
                        <div>
                          <label className="block text-xs font-medium text-gray-700">Regular Students</label>
                          <input
                            type="number"
                            value={newCustomizeOption.pricing.standard.regular}
                            onChange={(e) => handleCustomizeOptionChange('pricing.standard.regular', e.target.value)}
                            min="0"
                            step="0.01"
                            className="w-full border border-gray-300 rounded-md shadow-sm p-1 text-sm"
                          />
                        </div>
                        <div>
                          <label className="block text-xs font-medium text-gray-700">University Students</label>
                          <input
                            type="number"
                            value={newCustomizeOption.pricing.standard.returningUniversity}
                            onChange={(e) => handleCustomizeOptionChange('pricing.standard.returningUniversity', e.target.value)}
                            min="0"
                            step="0.01"
                            className="w-full border border-gray-300 rounded-md shadow-sm p-1 text-sm"
                          />
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="flex justify-end">
                    <button
                      type="button"
                      onClick={addCustomizeOption}
                      disabled={!newCustomizeOption.key || !newCustomizeOption.name}
                      className={`px-4 py-2 rounded-md text-white text-sm ${
                        !newCustomizeOption.key || !newCustomizeOption.name
                          ? 'bg-gray-300 cursor-not-allowed'
                          : 'bg-blue-500 hover:bg-blue-600'
                      }`}
                    >
                      Add Customize Option
                    </button>
                  </div>
                </div>
              </div>
            </div>

            <div className="flex justify-end space-x-3 pt-4 border-t">
              <button
                type="button"
                onClick={onClose}
                className="px-4 py-2 bg-gray-200 text-gray-800 rounded-md hover:bg-gray-300"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={isLoading || !formState.imageUrl}
                className={`px-4 py-2 bg-blue-600 text-white rounded-md ${
                  isLoading || !formState.imageUrl ? 'opacity-70 cursor-not-allowed' : 'hover:bg-blue-700'
                }`}
              >
                {isLoading ? 'Updating...' : 'Update Tour'}
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
}; 