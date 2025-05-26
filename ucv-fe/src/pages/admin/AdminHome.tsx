import { useEffect, useState } from 'react';
import { AdminNavbar } from '../../components/admin/AdminNavbar';
import { SectionManager } from '../../components/admin/SectionManager';
import { useContentStore } from '../../lib/contentStore';

export default function AdminHome() {
  const getPageContent = useContentStore(state => state.getPageContent);
  const resetToDefault = useContentStore(state => state.resetToDefault);
  const resetPageContent = useContentStore(state => state.resetPageContent);
  const fetchContent = useContentStore(state => state.fetchContent);
  const isLoading = useContentStore(state => state.isLoading);
  const error = useContentStore(state => state.error);
  
  const [homeContent, setHomeContent] = useState(getPageContent('home'));
  
  // Fetch content when component mounts if not already loaded
  useEffect(() => {
    if (!homeContent) {
      fetchContent();
    }
  }, [fetchContent, homeContent]);
  
  // Update local state when content changes
  useEffect(() => {
    setHomeContent(getPageContent('home'));
  }, [getPageContent]);
  
  const handleReset = () => {
    if (window.confirm('Are you sure you want to reset all content to default values? This cannot be undone.')) {
      resetToDefault();
    }
  };
  
  const handleResetPage = () => {
    if (window.confirm('Are you sure you want to reset the home page content to default? This cannot be undone.')) {
      resetPageContent('home');
    }
  };
  
  const handleRefresh = () => {
    fetchContent();
  };
  
  if (isLoading) {
    return (
      <div>
        <AdminNavbar />
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <h1 className="text-2xl font-bold mb-4">Home Page Content Management</h1>
          <div className="flex items-center justify-center py-16">
            <div className="text-center">
              <div className="w-16 h-16 border-4 border-blue-500 border-t-transparent rounded-full animate-spin mx-auto"></div>
              <p className="mt-4 text-lg text-gray-700">Loading content...</p>
            </div>
          </div>
        </div>
      </div>
    );
  }
  
  if (error) {
    return (
      <div>
        <AdminNavbar />
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <h1 className="text-2xl font-bold mb-4">Home Page Content Management</h1>
          <div className="bg-red-50 border border-red-400 text-red-700 px-4 py-3 rounded">
            <p className="text-lg font-semibold">Error loading content</p>
            <p className="mb-4">{error}</p>
            <button 
              onClick={handleRefresh}
              className="bg-blue-500 text-white px-4 py-2 rounded-md hover:bg-blue-600"
            >
              Try Again
            </button>
          </div>
        </div>
      </div>
    );
  }
  
  if (!homeContent) {
    return (
      <div>
        <AdminNavbar />
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <h1 className="text-2xl font-bold mb-4">Home Page Content Management</h1>
          <div className="bg-yellow-50 border border-yellow-400 text-yellow-700 px-4 py-3 rounded">
            <p>No content found for home page. Please check your data or initialize default content.</p>
            <div className="mt-4 space-x-2">
              <button 
                onClick={handleRefresh}
                className="bg-blue-500 text-white px-4 py-2 rounded-md hover:bg-blue-600"
              >
                Refresh
              </button>
              <button 
                onClick={handleResetPage}
                className="bg-yellow-600 text-white px-4 py-2 rounded-md hover:bg-yellow-700"
              >
                Initialize Home Page
              </button>
              <button 
                onClick={handleReset}
                className="bg-red-600 text-white px-4 py-2 rounded-md hover:bg-red-700"
              >
                Reset All Pages
              </button>
            </div>
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
          <h1 className="text-2xl font-bold">Home Page Content Management</h1>
          <div className="space-x-2">
            <button 
              onClick={handleRefresh}
              className="bg-blue-500 text-white px-4 py-2 rounded-md hover:bg-blue-600"
            >
              Refresh
            </button>
            <button 
              onClick={handleResetPage}
              className="bg-yellow-600 text-white px-4 py-2 rounded-md hover:bg-yellow-700"
            >
              Reset This Page
            </button>
            <button 
              onClick={handleReset}
              className="bg-red-600 text-white px-4 py-2 rounded-md hover:bg-red-700"
            >
              Reset All Pages
            </button>
          </div>
        </div>
        
        <div className="bg-blue-50 border border-blue-200 p-4 rounded-md mb-6">
          <p className="text-gray-600">
            <span className="font-semibold">Note:</span> All changes are saved to the database and will be immediately visible to all users on all devices.
          </p>
        </div>
        
        <SectionManager pageContent={homeContent} />
      </div>
    </div>
  );
} 