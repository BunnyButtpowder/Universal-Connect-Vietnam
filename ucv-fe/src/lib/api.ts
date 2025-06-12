// API utility functions for the UCV app
import { PageContent, ContentUpdate } from './types';

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
  price: number; // Display price (early bird return university price)
  date: string;
  location: string;
  duration: string;
}

export interface CustomizeOption {
  key: string;
  name: string;
  description?: string;
  pricing: {
    earlyBird: {
      regular: number;
      returningUniversity: number;
    };
    standard: {
      regular: number;
      returningUniversity: number;
    };
  };
}

export interface TourFull extends TourBasic {
  description: string;
  // Structured pricing
  earlyBirdPrice: number;
  earlyBirdUniversityPrice: number;
  standardRegularPrice: number;
  standardUniversityPrice: number;
  pricing: {
    earlyBird: {
      regular: number | string;
      returningUniversity: number | string;
    };
    standard: {
      regular: number | string;
      returningUniversity: number | string;
    };
  };
  tourDates?: string;
  customize?: string;
  earlyBirdDeadline?: string;
  standardDeadline?: string;
  cities: {
    id?: number;
    name: string;
    imageUrl: string;
    wikiUrl?: string;
  }[];
  eventTypes: string[];
  packageIncludes: string[];
  additionalImages: string[];
  customizeOptions: (CustomizeOption & { id?: number })[];
  timelineEvents: TimelineEvent[];
  created_at?: string;
}

// City, Event Type, and Package Item types
export interface City {
  id: number;
  name: string;
  imageUrl: string;
  wikiUrl?: string;
}

export interface EventType {
  id: number;
  name: string;
}

export interface PackageItem {
  id: number;
  name: string;
}

export interface TimelineEvent {
  id?: number;
  tourId?: number;
  dateRange: string;
  location: string;
  description?: string;
  sortOrder?: number;
}

export interface TourCreateInput {
  title: string;
  description: string;
  shortDescription: string;
  imageUrl: string;
  earlyBirdPrice: number;
  earlyBirdUniversityPrice: number;
  standardRegularPrice: number;
  standardUniversityPrice: number;
  date: string;
  location: string;
  duration: string;
  tourDates?: string;
  customize?: string;
  earlyBirdDeadline?: string;
  standardDeadline?: string;
  cities?: (City | { name: string; imageUrl: string; wikiUrl?: string })[];
  eventTypes?: (EventType | string)[];
  packageIncludes?: (PackageItem | string)[];
  additionalImages?: string[];
  customizeOptions?: CustomizeOption[];
  timelineEvents?: TimelineEvent[];
}

// Get the API base URL from environment variable if available
const API_BASE = import.meta.env.VITE_API_URL || 'https://api.ucv.com.vn';
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
  },

  // Get all available cities
  getCities: async (): Promise<City[]> => {
    try {
      const response = await fetch(`${API_BASE}/tours/shared/cities`);
      
      if (!response.ok) {
        throw new Error(`Failed to fetch cities: ${response.status}`);
      }
      
      const data: ApiResponse<{ cities: City[] }> = await response.json();
      return data.data?.cities || [];
    } catch (error) {
      console.error('Error fetching cities:', error);
      throw error;
    }
  },

  // Create a new city
  createCity: async (cityData: { name: string; imageUrl: string; wikiUrl?: string }): Promise<City> => {
    try {
      const response = await fetch(`${API_BASE}/tours/shared/cities`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(cityData),
      });
      
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || `Failed to create city: ${response.status}`);
      }
      
      const data: ApiResponse<{ city: City }> = await response.json();
      return data.data?.city as City;
    } catch (error) {
      console.error('Error creating city:', error);
      throw error;
    }
  },

  // Get all available event types
  getEventTypes: async (): Promise<EventType[]> => {
    try {
      const response = await fetch(`${API_BASE}/tours/shared/event-types`);
      
      if (!response.ok) {
        throw new Error(`Failed to fetch event types: ${response.status}`);
      }
      
      const data: ApiResponse<{ eventTypes: EventType[] }> = await response.json();
      return data.data?.eventTypes || [];
    } catch (error) {
      console.error('Error fetching event types:', error);
      throw error;
    }
  },

  // Create a new event type
  createEventType: async (eventTypeData: { name: string }): Promise<EventType> => {
    try {
      const response = await fetch(`${API_BASE}/tours/shared/event-types`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(eventTypeData),
      });
      
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || `Failed to create event type: ${response.status}`);
      }
      
      const data: ApiResponse<{ eventType: EventType }> = await response.json();
      return data.data?.eventType as EventType;
    } catch (error) {
      console.error('Error creating event type:', error);
      throw error;
    }
  },

  // Get all available package items
  getPackageItems: async (): Promise<PackageItem[]> => {
    try {
      const response = await fetch(`${API_BASE}/tours/shared/package-items`);
      
      if (!response.ok) {
        throw new Error(`Failed to fetch package items: ${response.status}`);
      }
      
      const data: ApiResponse<{ packageItems: PackageItem[] }> = await response.json();
      return data.data?.packageItems || [];
    } catch (error) {
      console.error('Error fetching package items:', error);
      throw error;
    }
  },

  // Create a new package item
  createPackageItem: async (packageItemData: { name: string }): Promise<PackageItem> => {
    try {
      const response = await fetch(`${API_BASE}/tours/shared/package-items`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(packageItemData),
      });
      
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || `Failed to create package item: ${response.status}`);
      }
      
      const data: ApiResponse<{ packageItem: PackageItem }> = await response.json();
      return data.data?.packageItem as PackageItem;
    } catch (error) {
      console.error('Error creating package item:', error);
      throw error;
    }
  },

  // Timeline Events API
  // Get timeline events for a tour
  getTimelineEvents: async (tourId: string): Promise<TimelineEvent[]> => {
    try {
      const response = await fetch(`${API_BASE}/tours/${tourId}/timeline`);
      
      if (!response.ok) {
        throw new Error(`Failed to fetch timeline events: ${response.status}`);
      }
      
      const data: ApiResponse<{ timelineEvents: TimelineEvent[] }> = await response.json();
      return data.data?.timelineEvents || [];
    } catch (error) {
      console.error('Error fetching timeline events:', error);
      throw error;
    }
  },

  // Create timeline event for a tour
  createTimelineEvent: async (tourId: string, eventData: Omit<TimelineEvent, 'id' | 'tourId'>): Promise<TimelineEvent> => {
    try {
      const response = await fetch(`${API_BASE}/tours/${tourId}/timeline`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(eventData),
      });
      
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || `Failed to create timeline event: ${response.status}`);
      }
      
      const data: ApiResponse<{ timelineEvent: TimelineEvent }> = await response.json();
      return data.data?.timelineEvent as TimelineEvent;
    } catch (error) {
      console.error('Error creating timeline event:', error);
      throw error;
    }
  },

  // Update timeline event
  updateTimelineEvent: async (tourId: string, eventId: string, eventData: Partial<TimelineEvent>): Promise<TimelineEvent> => {
    try {
      const response = await fetch(`${API_BASE}/tours/${tourId}/timeline/${eventId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(eventData),
      });
      
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || `Failed to update timeline event: ${response.status}`);
      }
      
      const data: ApiResponse<{ timelineEvent: TimelineEvent }> = await response.json();
      return data.data?.timelineEvent as TimelineEvent;
    } catch (error) {
      console.error('Error updating timeline event:', error);
      throw error;
    }
  },

  // Delete timeline event
  deleteTimelineEvent: async (tourId: string, eventId: string): Promise<boolean> => {
    try {
      const response = await fetch(`${API_BASE}/tours/${tourId}/timeline/${eventId}`, {
        method: 'DELETE',
      });
      
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || `Failed to delete timeline event: ${response.status}`);
      }
      
      return true;
    } catch (error) {
      console.error('Error deleting timeline event:', error);
      throw error;
    }
  },
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

// API utility for content management
export const contentApi = {
  // Get all page content
  getAll: async (): Promise<PageContent[]> => {
    try {
      const response = await fetch(`${API_BASE}/content`);
      
      if (!response.ok) {
        throw new Error(`Failed to fetch content: ${response.status}`);
      }
      
      const data = await response.json();
      return data.map((item: any) => item.content);
    } catch (error) {
      console.error('Error fetching all content:', error);
      throw error;
    }
  },
  
  // Get content for a specific page
  getByPage: async (pageName: string): Promise<PageContent> => {
    try {
      const response = await fetch(`${API_BASE}/content/${pageName}`);
      
      if (!response.ok) {
        throw new Error(`Failed to fetch content for page ${pageName}: ${response.status}`);
      }
      
      const data = await response.json();
      return data.content;
    } catch (error) {
      console.error(`Error fetching content for page ${pageName}:`, error);
      throw error;
    }
  },
  
  // Save or update content for a specific page
  savePage: async (pageName: string, pageContent: PageContent): Promise<void> => {
    try {
      const response = await fetch(`${API_BASE}/content/${pageName}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(pageContent),
      });
      
      if (!response.ok) {
        throw new Error(`Failed to save content for page ${pageName}: ${response.status}`);
      }
    } catch (error) {
      console.error(`Error saving content for page ${pageName}:`, error);
      throw error;
    }
  },
  
  // Update a specific content item
  updateItem: async (update: ContentUpdate): Promise<void> => {
    try {
      const response = await fetch(
        `${API_BASE}/content/${update.pageName}/${update.sectionId}/${update.itemId}`, 
        {
          method: 'PATCH',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            content: update.content,
            metadata: update.metadata,
          }),
        }
      );
      
      if (!response.ok) {
        throw new Error(`Failed to update content item: ${response.status}`);
      }
    } catch (error) {
      console.error('Error updating content item:', error);
      throw error;
    }
  },
  
  // Reset all content to default values
  resetAll: async (defaultContent: PageContent[]): Promise<void> => {
    try {
      const response = await fetch(`${API_BASE}/content/reset`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(defaultContent),
      });
      
      if (!response.ok) {
        throw new Error(`Failed to reset all content: ${response.status}`);
      }
    } catch (error) {
      console.error('Error resetting all content:', error);
      throw error;
    }
  },
  
  // Reset a specific page to default content
  resetPage: async (pageName: string, defaultPageContent: PageContent): Promise<void> => {
    try {
      const response = await fetch(`${API_BASE}/content/reset/${pageName}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(defaultPageContent),
      });
      
      if (!response.ok) {
        throw new Error(`Failed to reset content for page ${pageName}: ${response.status}`);
      }
    } catch (error) {
      console.error(`Error resetting content for page ${pageName}:`, error);
      throw error;
    }
  },
}; 