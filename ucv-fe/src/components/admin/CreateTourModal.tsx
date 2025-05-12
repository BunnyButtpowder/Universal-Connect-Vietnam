import React, { useState } from 'react';
import { toursApi, TourCreateInput } from '../../lib/api';
import { ImageUploader } from './ImageUploader';

interface CreateTourModalProps {
  onClose: () => void;
}

interface City {
  name: string;
  imageUrl: string;
  wikiUrl: string;
}

export const CreateTourModal: React.FC<CreateTourModalProps> = ({ onClose }) => {
  const [formState, setFormState] = useState({
    title: '',
    description: '',
    shortDescription: '',
    imageUrl: '',
    price: '',
    standardPrice: '',
    returningUniversityPrice: '',
    date: '',
    location: '',
    duration: '',
    plannedStartDate: '',
    earlyBirdDeadline: '',
    standardDeadline: '',
  });

  // Additional tour data
  const [cities, setCities] = useState<City[]>([]);
  const [newCity, setNewCity] = useState<City>({ name: '', imageUrl: '', wikiUrl: '' });
  
  const [eventTypes, setEventTypes] = useState<string[]>([]);
  const [newEventType, setNewEventType] = useState('');
  
  const [packageIncludes, setPackageIncludes] = useState<string[]>([]);
  const [newPackageItem, setNewPackageItem] = useState('');
  
  const [additionalImages, setAdditionalImages] = useState<string[]>([]);

  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<boolean>(false);
  
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

  // Add city to list
  const addCity = (e: React.FormEvent) => {
    e.preventDefault();
    if (newCity.name && newCity.imageUrl) {
      setCities(prev => [...prev, { ...newCity }]);
      setNewCity({ name: '', imageUrl: '', wikiUrl: '' });
    }
  };

  // Remove city from list
  const removeCity = (index: number) => {
    setCities(prev => prev.filter((_, i) => i !== index));
  };

  // Add event type
  const addEventType = (e: React.FormEvent) => {
    e.preventDefault();
    if (newEventType.trim()) {
      setEventTypes(prev => [...prev, newEventType.trim()]);
      setNewEventType('');
    }
  };

  // Remove event type
  const removeEventType = (index: number) => {
    setEventTypes(prev => prev.filter((_, i) => i !== index));
  };

  // Add package item
  const addPackageItem = (e: React.FormEvent) => {
    e.preventDefault();
    if (newPackageItem.trim()) {
      setPackageIncludes(prev => [...prev, newPackageItem.trim()]);
      setNewPackageItem('');
    }
  };

  // Remove package item
  const removePackageItem = (index: number) => {
    setPackageIncludes(prev => prev.filter((_, i) => i !== index));
  };

  // Remove additional image
  const removeImage = (index: number) => {
    setAdditionalImages(prev => prev.filter((_, i) => i !== index));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError(null);

    try {
      // Convert string values to appropriate types
      const tourData: TourCreateInput = {
        ...formState,
        price: parseFloat(formState.price),
        standardPrice: formState.standardPrice ? parseFloat(formState.standardPrice) : undefined,
        returningUniversityPrice: formState.returningUniversityPrice ? parseFloat(formState.returningUniversityPrice) : undefined,
        cities,
        eventTypes,
        packageIncludes,
        additionalImages
      };

      await toursApi.create(tourData);

      setSuccess(true);
      setTimeout(() => {
        onClose();
      }, 2000);
    } catch (error) {
      console.error('Error creating tour:', error);
      setError(error instanceof Error ? error.message : 'An unknown error occurred');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
      <div className="bg-white rounded-lg shadow-xl p-6 w-full max-w-3xl max-h-[90vh] overflow-y-auto">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-bold">Create New Tour</h2>
          <button 
            onClick={onClose} 
            className="text-gray-500 hover:text-gray-700"
          >
            ✕
          </button>
        </div>

        {success ? (
          <div className="bg-green-50 border border-green-400 text-green-700 px-4 py-3 rounded mb-4">
            Tour created successfully! Redirecting...
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
                  <ImageUploader 
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

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700">Price (Basic)*</label>
                <input
                  type="number"
                  name="price"
                  value={formState.price}
                  onChange={handleChange}
                  required
                  min="0"
                  step="0.01"
                  className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700">Standard Price</label>
                <input
                  type="number"
                  name="standardPrice"
                  value={formState.standardPrice}
                  onChange={handleChange}
                  min="0"
                  step="0.01"
                  className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700">Returning University Price</label>
                <input
                  type="number"
                  name="returningUniversityPrice"
                  value={formState.returningUniversityPrice}
                  onChange={handleChange}
                  min="0"
                  step="0.01"
                  className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2"
                />
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
                <label className="block text-sm font-medium text-gray-700">Planned Start Date</label>
                <input
                  type="date"
                  name="plannedStartDate"
                  value={formState.plannedStartDate}
                  onChange={handleChange}
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
              <div className="mb-4">
                {cities.length === 0 ? (
                  <p className="text-gray-500 text-sm">No cities added yet</p>
                ) : (
                  <div className="space-y-2 mb-4">
                    {cities.map((city, index) => (
                      <div key={index} className="flex items-center justify-between bg-gray-50 p-2 rounded">
                        <div className="flex items-center">
                          {city.imageUrl && (
                            <img 
                              src={city.imageUrl} 
                              alt={city.name}
                              className="h-10 w-10 object-cover rounded mr-3"
                              onError={(e) => {
                                (e.target as HTMLImageElement).src = 'https://via.placeholder.com/40?text=Error';
                              }}
                            />
                          )}
                          <div>
                            <span className="font-medium">{city.name}</span>
                            {city.wikiUrl && (
                              <div className="text-xs text-gray-500">
                                <a href={city.wikiUrl} target="_blank" rel="noopener noreferrer" className="text-blue-500 hover:underline">
                                  Wiki Link
                                </a>
                              </div>
                            )}
                          </div>
                        </div>
                        <button 
                          type="button" 
                          onClick={() => removeCity(index)}
                          className="text-red-500 hover:text-red-700"
                        >
                          Remove
                        </button>
                      </div>
                    ))}
                  </div>
                )}

                <div className="grid grid-cols-1 md:grid-cols-3 gap-2">
                  <div>
                    <input
                      type="text"
                      name="name"
                      value={newCity.name}
                      onChange={handleCityChange}
                      placeholder="City Name"
                      className="w-full border border-gray-300 rounded-md shadow-sm p-2 text-sm"
                    />
                  </div>
                  <div>
                    <div className="flex items-center space-x-2">
                      {newCity.imageUrl && (
                        <img 
                          src={newCity.imageUrl} 
                          alt="City preview" 
                          className="h-8 w-8 object-cover rounded"
                        />
                      )}
                      <ImageUploader 
                        onImageUploaded={handleCityImageUploaded}
                        label="City Image"
                        className="flex-1"
                      />
                    </div>
                    {!newCity.imageUrl && (
                      <input
                        type="text"
                        name="imageUrl"
                        value={newCity.imageUrl}
                        onChange={handleCityChange}
                        placeholder="Or enter image URL"
                        className="mt-1 w-full border border-gray-300 rounded-md shadow-sm p-2 text-sm"
                      />
                    )}
                  </div>
                  <div className="flex flex-col">
                    <input
                      type="text"
                      name="wikiUrl"
                      value={newCity.wikiUrl}
                      onChange={handleCityChange}
                      placeholder="Wiki URL (optional)"
                      className="w-full border border-gray-300 rounded-md shadow-sm p-2 text-sm mb-1"
                    />
                    <button
                      type="button"
                      onClick={addCity}
                      disabled={!newCity.name || !newCity.imageUrl}
                      className={`px-3 py-1 rounded-md text-white text-sm ${
                        !newCity.name || !newCity.imageUrl
                          ? 'bg-gray-300 cursor-not-allowed'
                          : 'bg-blue-500 hover:bg-blue-600'
                      }`}
                    >
                      Add City
                    </button>
                  </div>
                </div>
              </div>
            </div>

            {/* Event Types Section */}
            <div className="border-t pt-4">
              <h3 className="text-lg font-medium mb-2">Event Types</h3>
              <div className="mb-4">
                {eventTypes.length === 0 ? (
                  <p className="text-gray-500 text-sm">No event types added yet</p>
                ) : (
                  <div className="flex flex-wrap gap-2 mb-4">
                    {eventTypes.map((type, index) => (
                      <div key={index} className="flex items-center bg-blue-50 px-3 py-1 rounded">
                        <span>{type}</span>
                        <button 
                          type="button" 
                          onClick={() => removeEventType(index)}
                          className="ml-2 text-red-500 hover:text-red-700"
                        >
                          ✕
                        </button>
                      </div>
                    ))}
                  </div>
                )}

                <div className="flex">
                  <input
                    type="text"
                    value={newEventType}
                    onChange={(e) => setNewEventType(e.target.value)}
                    placeholder="Add an event type"
                    className="w-full border border-gray-300 rounded-md shadow-sm p-2"
                  />
                  <button
                    type="button"
                    onClick={addEventType}
                    disabled={!newEventType.trim()}
                    className={`ml-2 px-3 rounded-md text-white ${
                      !newEventType.trim() 
                        ? 'bg-gray-300 cursor-not-allowed' 
                        : 'bg-blue-500 hover:bg-blue-600'
                    }`}
                  >
                    Add
                  </button>
                </div>
              </div>
            </div>

            {/* Package Includes Section */}
            <div className="border-t pt-4">
              <h3 className="text-lg font-medium mb-2">Package Includes</h3>
              <div className="mb-4">
                {packageIncludes.length === 0 ? (
                  <p className="text-gray-500 text-sm">No package items added yet</p>
                ) : (
                  <ul className="list-disc pl-5 mb-4 space-y-1">
                    {packageIncludes.map((item, index) => (
                      <li key={index} className="flex items-center justify-between">
                        <span>{item}</span>
                        <button 
                          type="button" 
                          onClick={() => removePackageItem(index)}
                          className="text-red-500 hover:text-red-700 text-sm"
                        >
                          Remove
                        </button>
                      </li>
                    ))}
                  </ul>
                )}

                <div className="flex">
                  <input
                    type="text"
                    value={newPackageItem}
                    onChange={(e) => setNewPackageItem(e.target.value)}
                    placeholder="Add a package item"
                    className="w-full border border-gray-300 rounded-md shadow-sm p-2"
                  />
                  <button
                    type="button"
                    onClick={addPackageItem}
                    disabled={!newPackageItem.trim()}
                    className={`ml-2 px-3 rounded-md text-white ${
                      !newPackageItem.trim() 
                        ? 'bg-gray-300 cursor-not-allowed' 
                        : 'bg-blue-500 hover:bg-blue-600'
                    }`}
                  >
                    Add
                  </button>
                </div>
              </div>
            </div>

            {/* Additional Images Section */}
            <div className="border-t pt-4">
              <h3 className="text-lg font-medium mb-2">Additional Images</h3>
              <div className="mb-4">
                <div className="mb-4">
                  <ImageUploader 
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
                      <div key={index} className="relative group">
                        <img 
                          src={imageUrl} 
                          alt={`Additional image ${index + 1}`}
                          className="h-24 w-full object-cover rounded border"
                          onError={(e) => {
                            (e.target as HTMLImageElement).src = 'https://via.placeholder.com/150?text=Image+Error';
                          }}
                        />
                        <button 
                          type="button" 
                          onClick={() => removeImage(index)}
                          className="absolute top-1 right-1 bg-red-500 text-white rounded-full w-6 h-6 flex items-center justify-center opacity-0 group-hover:opacity-100"
                        >
                          ✕
                        </button>
                      </div>
                    ))}
                  </div>
                )}
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
                {isLoading ? 'Creating...' : 'Create Tour'}
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
}; 