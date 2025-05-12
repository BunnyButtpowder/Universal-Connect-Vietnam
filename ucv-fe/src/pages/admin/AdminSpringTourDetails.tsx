import { useEffect, useState } from 'react';
import { AdminNavbar } from '../../components/admin/AdminNavbar';
import { SectionManager } from '../../components/admin/SectionManager';
import { useContentStore } from '../../lib/contentStore';
import { PageContent } from '../../lib/types';

export default function AdminSpringTourDetails() {
  const getPageContent = useContentStore(state => state.getPageContent);
  const resetToDefault = useContentStore(state => state.resetToDefault);
  
  const [springTourDetailsContent, setSpringTourDetailsContent] = useState<PageContent | undefined>(getPageContent('spring-tour-details'));
  
  // Refresh the content once when component mounts
  useEffect(() => {
    const content = getPageContent('spring-tour-details');
    if (content) {
      setSpringTourDetailsContent(content);
    }
  }, [getPageContent]);
  
  // Refresh content periodically to catch updates
  useEffect(() => {
    const interval = setInterval(() => {
      setSpringTourDetailsContent(getPageContent('spring-tour-details'));
    }, 1000);
    
    return () => clearInterval(interval);
  }, [getPageContent]);
  
  const handleReset = () => {
    if (window.confirm('Are you sure you want to reset Spring Tour Details content to default values? This cannot be undone.')) {
      resetToDefault();
      const refreshedContent = getPageContent('spring-tour-details');
      setSpringTourDetailsContent(refreshedContent);
    }
  };
  
  const handleRefresh = () => {
    const refreshedContent = getPageContent('spring-tour-details');
    setSpringTourDetailsContent(refreshedContent);
  };
  
  // If content is not available, show an error/loading state
  if (!springTourDetailsContent) {
    return (
      <div>
        <AdminNavbar />
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <h1 className="text-2xl font-bold mb-4">Spring Tour Details Page Content Management</h1>
          <div className="bg-yellow-50 border border-yellow-400 text-yellow-700 px-4 py-3 rounded">
            <p>Loading Spring Tour Details page content or content not found. You may need to add Spring Tour Details to the content store.</p>
            <div className="mt-4 flex space-x-4">
              <button 
                onClick={handleRefresh}
                className="bg-blue-500 text-white px-4 py-2 rounded-md hover:bg-blue-600 cursor-pointer"
              >
                Refresh
              </button>
              <button 
                onClick={handleReset}
                className="bg-red-600 text-white px-4 py-2 rounded-md hover:bg-red-700 cursor-pointer"
              >
                Reset to Defaults
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
          <h1 className="text-2xl font-bold">Spring Tour Details Page Content Management</h1>
          <div className="space-x-2">
            <button 
              onClick={handleRefresh}
              className="bg-blue-500 text-white px-4 py-2 rounded-md hover:bg-blue-600 cursor-pointer"
            >
              Refresh
            </button>
            <button 
              onClick={handleReset}
              className="bg-red-600 text-white px-4 py-2 rounded-md hover:bg-red-700 cursor-pointer"
            >
              Reset to Defaults
            </button>
          </div>
        </div>
        <p className="mb-6 text-gray-600">
          Edit the content elements below to update the Spring Tour Details page. Changes will be visible immediately on the website.
          Note that image uploads and the "Other Tours" section editing are not yet implemented.
        </p>
        
        <SectionManager pageContent={springTourDetailsContent} />
      </div>
    </div>
  );
} 