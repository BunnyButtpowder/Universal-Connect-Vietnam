// API utility functions for the UCV app

interface ApiResponse<T> {
  status: string;
  data?: T;
  message?: string;
  results?: number;
}

// Tour types
export interface TourBasic {
  id: string;
  title: string;
  shortDescription: string;
  imageUrl: string;
  price: number;
  date: string;
  location: string;
  duration: string;
}

export interface TourFull extends TourBasic {
  description: string;
  standardPrice?: number;
  returningUniversityPrice?: number;
  plannedStartDate?: string;
  earlyBirdDeadline?: string;
  standardDeadline?: string;
  cities: {
    name: string;
    imageUrl: string;
    wikiUrl?: string;
  }[];
  eventTypes: string[];
  packageIncludes: string[];
  additionalImages: string[];
  created_at?: string;
}

export interface TourCreateInput {
  title: string;
  description: string;
  shortDescription: string;
  imageUrl: string;
  price: number;
  standardPrice?: number;
  returningUniversityPrice?: number;
  date: string;
  location: string;
  duration: string;
  plannedStartDate?: string;
  earlyBirdDeadline?: string;
  standardDeadline?: string;
  cities?: {
    name: string;
    imageUrl: string;
    wikiUrl?: string;
  }[];
  eventTypes?: string[];
  packageIncludes?: string[];
  additionalImages?: string[];
}

// Base API path - Production URL
const API_BASE = 'https://api.ucv.com.vn';
// const API_BASE = 'http://localhost:3000';

// API utility for tours
export const toursApi = {
  // Get all tours
  getAll: async (): Promise<TourBasic[]> => {
    try {
      const response = await fetch(`${API_BASE}/tours`);
      
      if (!response.ok) {
        throw new Error(`Failed to fetch tours: ${response.status}`);
      }
      
      const data: ApiResponse<{ tours: TourBasic[] }> = await response.json();
      return data.data?.tours || [];
    } catch (error) {
      console.error('Error fetching tours:', error);
      throw error;
    }
  },
  
  // Get a single tour by ID
  getById: async (id: string): Promise<TourFull> => {
    try {
      const response = await fetch(`${API_BASE}/tours/${id}`);
      
      if (!response.ok) {
        throw new Error(`Failed to fetch tour: ${response.status}`);
      }
      
      const data: ApiResponse<{ tour: TourFull }> = await response.json();
      
      if (!data.data?.tour) {
        throw new Error('Tour not found');
      }
      
      return data.data.tour;
    } catch (error) {
      console.error(`Error fetching tour ${id}:`, error);
      throw error;
    }
  },
  
  // Create a new tour
  create: async (tourData: TourCreateInput): Promise<TourFull> => {
    try {
      const response = await fetch(`${API_BASE}/tours`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(tourData),
      });
      
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || `Failed to create tour: ${response.status}`);
      }
      
      const data: ApiResponse<{ tour: TourFull }> = await response.json();
      return data.data?.tour as TourFull;
    } catch (error) {
      console.error('Error creating tour:', error);
      throw error;
    }
  },
  
  // Update an existing tour
  update: async (id: string, tourData: Partial<TourCreateInput>): Promise<TourFull> => {
    try {
      const response = await fetch(`${API_BASE}/tours/${id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(tourData),
      });
      
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || `Failed to update tour: ${response.status}`);
      }
      
      const data: ApiResponse<{ tour: TourFull }> = await response.json();
      return data.data?.tour as TourFull;
    } catch (error) {
      console.error(`Error updating tour ${id}:`, error);
      throw error;
    }
  },
  
  // Delete a tour
  delete: async (id: string): Promise<boolean> => {
    try {
      const response = await fetch(`${API_BASE}/tours/${id}`, {
        method: 'DELETE',
      });
      
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || `Failed to delete tour: ${response.status}`);
      }
      
      return true;
    } catch (error) {
      console.error(`Error deleting tour ${id}:`, error);
      throw error;
    }
  }
};

// API utility for contact forms
export const contactApi = {
  // Submit documents to email
  submitDocuments: async (formData: any, documentFiles: File[]): Promise<boolean> => {
    try {
      // Create form data for multipart/form-data submission
      const formDataObj = new FormData();
      
      // Add JSON form data
      formDataObj.append('formData', JSON.stringify(formData));
      
      // Add document files
      documentFiles.forEach(file => {
        formDataObj.append('documents', file);
      });
      
      const response = await fetch(`${API_BASE}/contact/submit-documents`, {
        method: 'POST',
        body: formDataObj, // No Content-Type header - browser sets it with boundary
      });
      
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || `Failed to submit documents: ${response.status}`);
      }
      
      return true;
    } catch (error) {
      console.error('Error submitting documents:', error);
      throw error;
    }
  }
}; 