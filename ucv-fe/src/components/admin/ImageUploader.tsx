import React, { useState, useRef } from 'react';

// Base API URL for production
const API_BASE_URL = 'https://api.ucv.com.vn';
// const API_BASE_URL = 'http://localhost:3000';

interface ImageUploaderProps {
  onImageUploaded: (imageUrl: string) => void;
  label?: string;
  className?: string;
}

export const ImageUploader: React.FC<ImageUploaderProps> = ({ 
  onImageUploaded, 
  label = 'Upload Image', 
  className = '' 
}) => {
  const [isUploading, setIsUploading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [progress, setProgress] = useState(0);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    // Validate file type
    if (!file.type.startsWith('image/')) {
      setError('Only image files are allowed');
      return;
    }

    // Validate file size (max 5MB)
    if (file.size > 5 * 1024 * 1024) {
      setError('File size should not exceed 5MB');
      return;
    }

    try {
      setIsUploading(true);
      setError(null);
      setProgress(0);

      const formData = new FormData();
      formData.append('image', file);

      // Simulate upload progress
      const progressInterval = setInterval(() => {
        setProgress(prev => {
          const newProgress = Math.min(prev + 10, 90);
          return newProgress;
        });
      }, 200);

      // Make API call to upload the image
      const response = await fetch(`${API_BASE_URL}/upload/image`, {
        method: 'POST',
        body: formData,
      });

      clearInterval(progressInterval);

      // Get the response text first to check if it's valid JSON
      const responseText = await response.text();
      
      let data;
      try {
        // Try to parse the response as JSON
        data = JSON.parse(responseText);
      } catch (parseError) {
        console.error('Failed to parse response:', responseText);
        throw new Error('Failed to parse server response. Please try again later.');
      }

      if (!response.ok) {
        throw new Error(data.message || `Upload failed with status: ${response.status}`);
      }

      if (!data || !data.imageUrl) {
        throw new Error('Invalid response from server: Missing image URL');
      }

      setProgress(100);
      
      // Call the callback with the uploaded image URL
      onImageUploaded(data.imageUrl);
      
      // Reset the file input
      if (fileInputRef.current) {
        fileInputRef.current.value = '';
      }
    } catch (error) {
      console.error('Error uploading image:', error);
      setError(error instanceof Error ? error.message : 'An unknown error occurred');
    } finally {
      setIsUploading(false);
    }
  };

  const handleButtonClick = () => {
    fileInputRef.current?.click();
  };

  return (
    <div className={`${className}`}>
      <input
        type="file"
        ref={fileInputRef}
        onChange={handleFileChange}
        accept="image/*"
        className="hidden"
      />
      <button
        type="button"
        onClick={handleButtonClick}
        disabled={isUploading}
        className={`px-3 py-1.5 rounded text-sm font-medium ${
          isUploading 
            ? 'bg-gray-300 text-gray-700 cursor-not-allowed' 
            : 'bg-blue-500 text-white hover:bg-blue-600'
        }`}
      >
        {isUploading ? 'Uploading...' : label}
      </button>
      
      {isUploading && (
        <div className="mt-2">
          <div className="w-full bg-gray-200 rounded-full h-2.5">
            <div 
              className="bg-blue-600 h-2.5 rounded-full transition-all duration-300" 
              style={{ width: `${progress}%` }}
            ></div>
          </div>
          <p className="text-xs text-gray-500 mt-1">Uploading: {progress}%</p>
        </div>
      )}
      
      {error && (
        <p className="text-xs text-red-500 mt-1">{error}</p>
      )}
    </div>
  );
}; 