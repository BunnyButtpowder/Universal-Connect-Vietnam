import React, { useState } from 'react';
import { toursApi, TourCreateInput } from '../../lib/api';
import { ImageUploader } from './ImageUploader';

interface CreateTemplateTourModalProps {
  onClose: () => void;
}

export const CreateTemplateTourModal: React.FC<CreateTemplateTourModalProps> = ({ onClose }) => {
  const [formState, setFormState] = useState({
    title: '',
    shortDescription: 'More information and Registration COMING SOON',
    imageUrl: '',
    date: '',
    location: '',
    duration: '',
  });

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

  // Handle main image upload
  const handleMainImageUploaded = (imageUrl: string) => {
    setFormState(prev => ({
      ...prev,
      imageUrl
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError(null);

    try {
      // Create template tour with minimal data and isComingSoon flag
      const tourData: TourCreateInput = {
        title: formState.title,
        description: 'More information and registration will be available soon. Stay tuned!',
        shortDescription: formState.shortDescription,
        imageUrl: formState.imageUrl,
        // Placeholder pricing (will be hidden on frontend)
        earlyBirdPrice: 0,
        earlyBirdUniversityPrice: 0,
        standardRegularPrice: 0,
        standardUniversityPrice: 0,
        date: formState.date,
        location: formState.location,
        duration: formState.duration || 'TBA',
        isComingSoon: true, // This flag indicates it's a template/coming soon tour
        // Optional fields left empty for template tours
        cities: [],
        eventTypes: [],
        packageIncludes: [],
        additionalImages: [],
        customizeOptions: [],
        timelineEvents: []
      };

      await toursApi.create(tourData);

      setSuccess(true);
      setTimeout(() => {
        onClose();
      }, 2000);
    } catch (error) {
      console.error('Error creating template tour:', error);
      setError(error instanceof Error ? error.message : 'An unknown error occurred');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
      <div className="bg-white rounded-lg shadow-xl p-6 w-full max-w-2xl max-h-[90vh] overflow-y-auto">
        <div className="flex justify-between items-center mb-4">
          <div>
            <h2 className="text-xl font-bold">Create Template Tour</h2>
            <p className="text-sm text-gray-600 mt-1">
              Create a placeholder tour for upcoming events with minimal information
            </p>
          </div>
          <button 
            onClick={onClose} 
            className="text-gray-500 hover:text-gray-700 cursor-pointer"
          >
            ✕
          </button>
        </div>

        {success ? (
          <div className="bg-green-50 border border-green-400 text-green-700 px-4 py-3 rounded mb-4">
            Template tour created successfully! Redirecting...
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-4">
            {error && (
              <div className="bg-red-50 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
                {error}
              </div>
            )}

            <div className="bg-blue-50 border border-blue-300 rounded-lg p-4 mb-4">
              <div className="flex items-start">
                <div className="flex-shrink-0">
                  <svg className="h-5 w-5 text-blue-400 mt-0.5" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
                  </svg>
                </div>
                <div className="ml-3">
                  <h3 className="text-sm font-medium text-blue-800">About Template Tours</h3>
                  <div className="mt-2 text-sm text-blue-700">
                    <p>Template tours are placeholders for upcoming events. They display "Coming Soon" messaging and don't require full details like pricing, itinerary, or package information.</p>
                  </div>
                </div>
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700">Tour Title*</label>
              <input
                type="text"
                name="title"
                value={formState.title}
                onChange={handleChange}
                required
                placeholder="e.g., Spring Tour 2026"
                className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700">Cover Image*</label>
              <div className="mt-1 flex items-center">
                {formState.imageUrl ? (
                  <div className="relative group mr-2">
                    <img 
                      src={formState.imageUrl} 
                      alt="Tour cover image" 
                      className="h-20 w-20 object-cover rounded image-preview"
                    />
                    <button
                      type="button"
                      onClick={() => setFormState(prev => ({ ...prev, imageUrl: '' }))}
                      className="absolute -top-1 -right-1 bg-red-500 text-white rounded-full w-5 h-5 flex items-center justify-center text-xs remove-image-button cursor-pointer"
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
                  className="mt-2 block w-full border border-gray-300 rounded-md shadow-sm p-2 text-sm image-url-input"
                />
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700">Display Date*</label>
              <input
                type="text"
                name="date"
                value={formState.date}
                onChange={handleChange}
                required
                placeholder="e.g., SPRING 2026 or JULY 2026"
                className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2"
              />
              <p className="mt-1 text-xs text-gray-500">Display format (not actual calendar date)</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700">Location*</label>
                <input
                  type="text"
                  name="location"
                  value={formState.location}
                  onChange={handleChange}
                  required
                  placeholder="e.g., Vietnam"
                  className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700">Duration</label>
                <input
                  type="text"
                  name="duration"
                  value={formState.duration}
                  onChange={handleChange}
                  placeholder="e.g., 7 Days or TBA"
                  className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2"
                />
                <p className="mt-1 text-xs text-gray-500">Optional - defaults to "TBA"</p>
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700">Short Description</label>
              <textarea
                name="shortDescription"
                value={formState.shortDescription}
                onChange={handleChange}
                rows={2}
                placeholder="Brief description shown on the card"
                className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2"
              />
            </div>

            <div className="bg-yellow-50 border border-yellow-300 rounded-lg p-3">
              <p className="text-sm text-yellow-800">
                <strong>Note:</strong> This tour will display "More information and Registration COMING SOON" on the frontend. 
                You can convert it to a full tour later by editing it and adding complete details.
              </p>
            </div>

            <div className="flex justify-end space-x-3 pt-4 border-t">
              <button
                type="button"
                onClick={onClose}
                className="px-4 py-2 bg-gray-200 text-gray-800 rounded-md hover:bg-gray-300 cancel-button cursor-pointer"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={isLoading || !formState.imageUrl || !formState.title}
                className={`px-4 py-2 bg-green-600 text-white rounded-md cursor-pointer create-template-tour-button ${
                  isLoading || !formState.imageUrl || !formState.title ? 'opacity-70 cursor-not-allowed' : 'hover:bg-green-700'
                }`}
              >
                {isLoading ? 'Creating...' : 'Create Template Tour'}
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
};

