import { useEffect, useState } from 'react';
import { AdminNavbar } from '../../components/admin/AdminNavbar';
import { SectionManager } from '../../components/admin/SectionManager';
import { useContentStore } from '../../lib/contentStore';

export default function AdminOurTours() {
  const getPageContent = useContentStore(state => state.getPageContent);
  const resetToDefault = useContentStore(state => state.resetToDefault);
  const [ourToursContent, setOurToursContent] = useState(getPageContent('our-tours'));
  
  // Refresh the content periodically
  useEffect(() => {
    const interval = setInterval(() => {
      setOurToursContent(getPageContent('our-tours'));
    }, 1000);
    
    return () => clearInterval(interval);
  }, [getPageContent]);
  
  const handleReset = () => {
    if (window.confirm('Are you sure you want to reset all content to default values? This cannot be undone.')) {
      resetToDefault();
      setOurToursContent(getPageContent('our-tours'));
    }
  };
  
  const handleRefresh = () => {
    setOurToursContent(getPageContent('our-tours'));
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
          Edit the header section content below. The tour cards are managed separately and are not editable through this interface.
        </p>
        
        <SectionManager pageContent={ourToursContent} />
      </div>
    </div>
  );
}
