import React, { useState, useRef } from 'react';
import { ContentItem, ContentUpdate } from '../../lib/types';
import { useContentStore } from '../../lib/contentStore';

// Base API URL for production
const API_BASE_URL = 'https://api.ucv.com.vn';
// const API_BASE_URL = 'http://localhost:3000';

interface ImageEditorProps {
  item: ContentItem | undefined;
  pageName: string;
  sectionId: string;
  className?: string;
  label?: string;
  imageClassName?: string;
}

export const ImageEditor: React.FC<ImageEditorProps> = ({ 
  item,
  pageName,
  sectionId,
  className = '',
  label = 'Change Image',
  imageClassName = 'h-40 object-cover mx-auto rounded'
}) => {
  const [isUploading, setIsUploading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [progress, setProgress] = useState(0);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const updateContent = useContentStore(state => state.updateContent);

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
      
      // Include old image URL if it exists
      if (item?.content) {
        formData.append('oldImageUrl', item.content);
      }

      // Simulate upload progress
      const progressInterval = setInterval(() => {
        setProgress(prev => {
          const newProgress = Math.min(prev + 10, 90);
          return newProgress;
        });
      }, 200);

      // Make API call to replace the image
      const response = await fetch(`${API_BASE_URL}/upload/image/replace`, {
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
      
      // Update the content with the new image URL
      if (item) {
        const update: ContentUpdate = {
          pageName,
          sectionId,
          itemId: item.id,
          content: data.imageUrl,
          metadata: item.metadata
        };
        
        updateContent(update);
      }
      
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

  if (!item) {
    return (
      <div className={`${className}`}>
        <div className="p-4 bg-gray-50 border border-gray-200 rounded text-center">
          <p className="text-sm text-gray-500">No image item found</p>
        </div>
      </div>
    );
  }

  return (
    <div className={`${className}`}>
      {/* Current Image Display */}
      {item.content && (
        <div className="text-center mb-4">
          <img 
            src={item.content} 
            alt="Current image" 
            className={imageClassName}
          />
          <div className="mt-2 text-xs text-gray-500">
            Current image: {item.content.split('/').pop()}
          </div>
        </div>
      )}
      
      {/* Upload Controls */}
      <div className="text-center">
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
          className={`px-4 py-2 rounded text-sm font-medium ${
            isUploading 
              ? 'bg-gray-300 text-gray-700 cursor-not-allowed' 
              : 'bg-blue-500 text-white hover:bg-blue-600'
          }`}
        >
          {isUploading ? 'Uploading...' : label}
        </button>
        
        {isUploading && (
          <div className="mt-3">
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
          <p className="text-xs text-red-500 mt-2">{error}</p>
        )}
        
        <p className="text-xs text-gray-500 mt-2">
          {item.content ? 'Upload a new image to replace the current one' : 'Upload an image'}
        </p>
      </div>
    </div>
  );
}; 