import { PageContent, ContentItem } from '../../../../lib/types';
import { StatisticsEditor } from '../StatisticsEditor';

interface AboutUsStatisticsEditorProps {
  pageContent: PageContent;
}

export function AboutUsStatisticsEditor({ pageContent }: AboutUsStatisticsEditorProps) {
  const sectionId = 'statistics';
  const section = pageContent.sections[sectionId];
  
  // Helper function to find items by ID
  const getItemById = (id: string): ContentItem | undefined => {
    return section.items.find(item => item.id === id);
  };
  
  // Get the statistics
  const stat1 = getItemById('statistics-stat1');
  const stat2 = getItemById('statistics-stat2');
  const stat3 = getItemById('statistics-stat3');
  
  return (
    <div className="preview-container space-y-8">
      <div className="border border-gray-200 rounded-lg p-4 bg-gray-50">
        <h3 className="font-semibold text-gray-700 mb-4">Statistics</h3>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {stat1 && (
            <StatisticsEditor
              item={stat1}
              pageName={pageContent.pageName}
              sectionId={sectionId}
            />
          )}
          
          {stat2 && (
            <StatisticsEditor
              item={stat2}
              pageName={pageContent.pageName}
              sectionId={sectionId}
            />
          )}
          
          {stat3 && (
            <StatisticsEditor
              item={stat3}
              pageName={pageContent.pageName}
              sectionId={sectionId}
            />
          )}
        </div>
      </div>
    </div>
  );
} 