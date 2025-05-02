import { PageContent, ContentItem } from '../../../../lib/types';
import { InlineEditableField } from '../InlineEditableField';

interface AboutUsContentEditorProps {
  pageContent: PageContent;
  sectionId: string;
}

export function AboutUsContentEditor({ pageContent, sectionId }: AboutUsContentEditorProps) {
  const section = pageContent.sections[sectionId];
  
  // Helper function to find items by ID
  const getItemById = (id: string): ContentItem | undefined => {
    return section.items.find(item => item.id === id);
  };
  
  // Get content items - title and content
  const title = getItemById(`${sectionId}-title`);
  const content = getItemById(`${sectionId}-content`);
  
  return (
    <div className="preview-container space-y-8">
      <div className="border border-gray-200 rounded-lg p-4 bg-gray-50">
        <h3 className="font-semibold text-gray-700 mb-4">{section.title}</h3>
        
        <div className="space-y-6">
          {/* Title */}
          <div className="bg-blue-50 p-4 rounded">
            <div className="font-semibold text-gray-500 text-xs mb-1">Section Title:</div>
            {title && (
              <InlineEditableField
                item={title}
                pageName={pageContent.pageName}
                sectionId={sectionId}
                className="text-lg font-semibold text-blue-500"
              />
            )}
          </div>
          
          {/* Content */}
          <div className="bg-blue-50 p-4 rounded">
            <div className="font-semibold text-gray-500 text-xs mb-1">Section Content:</div>
            {content && (
              <InlineEditableField
                item={content}
                pageName={pageContent.pageName}
                sectionId={sectionId}
                className="text-gray-700"
                multiline
              />
            )}
          </div>
        </div>
      </div>
    </div>
  );
} 