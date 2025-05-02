import { useEffect, useState } from 'react';
import { AdminNavbar } from '../../components/admin/AdminNavbar';
import { SectionManager } from '../../components/admin/SectionManager';
import { useContentStore } from '../../lib/contentStore';

export default function AdminHome() {
  const getPageContent = useContentStore(state => state.getPageContent);
  const resetToDefault = useContentStore(state => state.resetToDefault);
  const [homeContent, setHomeContent] = useState(getPageContent('home'));
  
  // Refresh the content periodically
  useEffect(() => {
    const interval = setInterval(() => {
      setHomeContent(getPageContent('home'));
    }, 1000);
    
    return () => clearInterval(interval);
  }, [getPageContent]);
  
  const handleReset = () => {
    if (window.confirm('Are you sure you want to reset all content to default values? This cannot be undone.')) {
      resetToDefault();
      setHomeContent(getPageContent('home'));
    }
  };
  
  const handleRefresh = () => {
    setHomeContent(getPageContent('home'));
  };
  
  if (!homeContent) {
    return (
      <div>
        <AdminNavbar />
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <h1 className="text-2xl font-bold mb-4">Home Page Content Management</h1>
          <div className="bg-red-50 border border-red-400 text-red-700 px-4 py-3 rounded">
            <p>No content found for home page. Please check your data or initialize default content.</p>
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
          <h1 className="text-2xl font-bold">Home Page Content Management</h1>
          <div className="space-x-2">
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
        <p className="mb-6 text-gray-600">
          Edit the content elements below to update the home page. Click "Save" to apply changes, which will be visible immediately on the website.
        </p>
        
        <SectionManager pageContent={homeContent} />
      </div>
    </div>
  );
} 