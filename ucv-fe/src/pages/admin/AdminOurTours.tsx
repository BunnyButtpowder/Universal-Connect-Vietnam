import { useEffect, useState } from 'react';
import { AdminNavbar } from '../../components/admin/AdminNavbar';
import { SectionManager } from '../../components/admin/SectionManager';
import { useContentStore } from '../../lib/contentStore';
import { CreateTourModal } from '../../components/admin/CreateTourModal';
import { toursApi, TourBasic } from '../../lib/api';

export default function AdminOurTours() {
  const getPageContent = useContentStore(state => state.getPageContent);
  const resetToDefault = useContentStore(state => state.resetToDefault);
  const [ourToursContent, setOurToursContent] = useState(getPageContent('our-tours'));
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [tours, setTours] = useState<TourBasic[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  
  // Fetch tours on initial load
  useEffect(() => {
    fetchTours();
  }, []);
  
  // Refresh the content periodically
  useEffect(() => {
    const interval = setInterval(() => {
      setOurToursContent(getPageContent('our-tours'));
    }, 1000);
    
    return () => clearInterval(interval);
  }, [getPageContent]);
  
  const fetchTours = async () => {
    setIsLoading(true);
    setError(null);
    
    try {
      const fetchedTours = await toursApi.getAll();
      setTours(fetchedTours);
    } catch (error) {
      console.error('Error fetching tours:', error);
      setError(error instanceof Error ? error.message : 'Failed to load tours');
    } finally {
      setIsLoading(false);
    }
  };
  
  const handleReset = () => {
    if (window.confirm('Are you sure you want to reset all content to default values? This cannot be undone.')) {
      resetToDefault();
      setOurToursContent(getPageContent('our-tours'));
    }
  };
  
  const handleRefresh = () => {
    setOurToursContent(getPageContent('our-tours'));
    fetchTours();
  };
  
  const openCreateModal = () => {
    setIsCreateModalOpen(true);
  };
  
  const closeCreateModal = () => {
    setIsCreateModalOpen(false);
    // Refresh tours after closing modal to show the newly created one
    fetchTours();
  };
  
  const handleDeleteTour = async (id: string, tourName: string) => {
    if (window.confirm(`Are you sure you want to delete the tour "${tourName}"? This cannot be undone.`)) {
      try {
        await toursApi.delete(id);
        fetchTours(); // Refresh the list
      } catch (error) {
        console.error('Error deleting tour:', error);
        alert('Failed to delete tour. Please try again.');
      }
    }
  };
  
  if (!ourToursContent) {
    return (
      <div>
        <AdminNavbar />
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <h1 className="text-2xl font-bold mb-4">Our Tours Page Content Management</h1>
          <div className="bg-red-50 border border-red-400 text-red-700 px-4 py-3 rounded">
            <p>No content found for Our Tours page. Please check your data or initialize default content.</p>
            <button 
              onClick={handleReset}
              className="mt-4 bg-red-600 text-white px-4 py-2 rounded-md hover:bg-red-700"
            >
              Reset to Defaults
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div>
      <AdminNavbar />
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex justify-between items-center mb-4">
          <h1 className="text-2xl font-bold">Our Tours Page Content Management</h1>
          <div className="space-x-2">
            <button 
              onClick={openCreateModal}
              className="bg-green-500 text-white px-4 py-2 rounded-md hover:bg-green-600"
            >
              Create New Tour
            </button>
            <button 
              onClick={handleRefresh}
              className="bg-blue-500 text-white px-4 py-2 rounded-md hover:bg-blue-600"
            >
              Refresh
            </button>
            <button 
              onClick={handleReset}
              className="bg-red-600 text-white px-4 py-2 rounded-md hover:bg-red-700"
            >
              Reset to Defaults
            </button>
          </div>
        </div>
        
        <div className="mb-10">
          <h2 className="text-xl font-semibold mb-4">Page Header Content</h2>
          <p className="mb-6 text-gray-600">
            Edit the header section content below. This appears at the top of the Our Tours page.
          </p>
          <SectionManager pageContent={ourToursContent} />
        </div>
        
        <div>
          <h2 className="text-xl font-semibold mb-4">Manage Tours</h2>
          {error && (
            <div className="bg-red-50 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
              {error}
            </div>
          )}
          
          {isLoading ? (
            <div className="flex justify-center py-8">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-700"></div>
            </div>
          ) : tours.length === 0 ? (
            <div className="bg-gray-50 border border-gray-300 text-gray-700 px-4 py-8 rounded text-center">
              <p className="mb-4">No tours available.</p>
              <button 
                onClick={openCreateModal}
                className="bg-blue-500 text-white px-4 py-2 rounded-md hover:bg-blue-600"
              >
                Create Your First Tour
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {tours.map(tour => (
                <div key={tour.id} className="border rounded-lg overflow-hidden shadow-md">
                  <div className="h-48 bg-gray-200 relative">
                    {tour.imageUrl ? (
                      <img 
                        src={tour.imageUrl} 
                        alt={tour.title} 
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <div className="flex items-center justify-center h-full text-gray-500">No image</div>
                    )}
                  </div>
                  <div className="p-4">
                    <h3 className="font-bold text-lg mb-1">{tour.title}</h3>
                    <div className="flex items-center text-sm text-gray-600 mb-2">
                      <span className="mr-3">{tour.date}</span>
                      <span>{tour.location}</span>
                    </div>
                    <p className="text-gray-700 text-sm line-clamp-2 mb-3">{tour.shortDescription}</p>
                    <div className="flex justify-between items-center">
                      <span className="font-bold text-lg">${tour.price}</span>
                      <div className="space-x-2">
                        <button 
                          className="px-3 py-1 bg-blue-500 text-white rounded hover:bg-blue-600"
                          onClick={() => window.location.href = `/admin/tours/${tour.id}`}
                        >
                          Edit
                        </button>
                        <button 
                          className="px-3 py-1 bg-red-500 text-white rounded hover:bg-red-600"
                          onClick={() => handleDeleteTour(tour.id, tour.title)}
                        >
                          Delete
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
      
      {isCreateModalOpen && (
        <CreateTourModal onClose={closeCreateModal} />
      )}
    </div>
  );
}
