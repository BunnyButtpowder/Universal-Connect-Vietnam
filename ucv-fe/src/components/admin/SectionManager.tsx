import { useState, useEffect } from 'react';
import { PageContent } from '../../lib/types';
import { ContentEditor } from './ContentEditor';
import { ContentVisualEditor } from './ContentVisualEditor';
import { useContentStore } from '../../lib/contentStore';

interface SectionManagerProps {
  pageContent: PageContent;
}

export function SectionManager({ pageContent }: SectionManagerProps) {
  const [content, setContent] = useState<PageContent>(pageContent);
  const [viewMode, setViewMode] = useState<'list' | 'visual'>('visual');
  const getPageContent = useContentStore(state => state.getPageContent);
  
  // Update the displayed content whenever pageContent changes or when the store updates
  useEffect(() => {
    setContent(pageContent);
    
    // Set up an interval to check for content updates from the store
    const checkInterval = setInterval(() => {
      const freshContent = getPageContent(pageContent.pageName);
      if (freshContent) {
        setContent(freshContent);
      }
    }, 500); // Check every half second
    
    return () => clearInterval(checkInterval);
  }, [pageContent, getPageContent]);
  
  return (
    <div className="space-y-8">
      <div className="bg-white p-4 rounded-lg shadow-sm mb-6 flex justify-end space-x-2">
        <button 
          onClick={() => setViewMode('visual')}
          className={`px-4 py-2 rounded-md cursor-pointer ${viewMode === 'visual' ? 'bg-blue-500 text-white' : 'bg-gray-200 text-gray-700'}`}
        >
          Visual Mode
        </button>
        <button 
          onClick={() => setViewMode('list')}
          className={`px-4 py-2 rounded-md cursor-pointer ${viewMode === 'list' ? 'bg-blue-500 text-white' : 'bg-gray-200 text-gray-700'}`}
        >
          List Mode
        </button>
      </div>

      {viewMode === 'visual' ? (
        <ContentVisualEditor pageContent={content} />
      ) : (
        // Original list view
        <>
          {Object.entries(content.sections).map(([sectionId, section]) => (
            <div key={sectionId} className="bg-gray-50 p-6 rounded-lg shadow-sm">
              <h2 className="text-xl font-bold text-gray-800 mb-4 border-b pb-2">
                {section.title}
              </h2>
              
              <div className="space-y-2">
                {section.items.map(item => (
                  <ContentEditor
                    key={`${item.id}-${item.content}`}
                    pageName={content.pageName}
                    sectionId={sectionId}
                    item={item}
                  />
                ))}
              </div>
            </div>
          ))}
        </>
      )}
    </div>
  );
} 