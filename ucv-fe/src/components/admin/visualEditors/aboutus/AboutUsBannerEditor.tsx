import { PageContent, ContentItem } from '../../../../lib/types';
import { InlineEditableField } from '../InlineEditableField';
import { ImageEditor } from '../../ImageEditor';

interface AboutUsBannerEditorProps {
  pageContent: PageContent;
}

export function AboutUsBannerEditor({ pageContent }: AboutUsBannerEditorProps) {
  const sectionId = 'mainBanner';
  const section = pageContent.sections[sectionId];
  
  // Helper function to find items by ID
  const getItemById = (id: string): ContentItem | undefined => {
    return section.items.find(item => item.id === id);
  };
  
  // Get content items
  const heading = getItemById('mainBanner-heading');
  const image = getItemById('mainBanner-image');
  
  return (
    <div className="preview-container space-y-8">
      <div className="border border-gray-200 rounded-lg p-4 bg-gray-50">
        <h3 className="font-semibold text-gray-700 mb-4">Main Banner</h3>
        
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
          {/* Heading */}
          <div className="bg-blue-50 p-4 rounded">
            <div className="font-semibold text-gray-500 text-xs mb-1">Main Heading:</div>
            {heading && (
              <InlineEditableField
                item={heading}
                pageName={pageContent.pageName}
                sectionId={sectionId}
                className="text-xl font-semibold text-blue-700"
                multiline
              />
            )}
          </div>
          
          {/* Image */}
          <div className="bg-white p-4 rounded-lg border border-gray-200">
            <div className="font-semibold text-gray-500 text-xs mb-2">Banner Image:</div>
            {image && (
              <ImageEditor
                item={image}
                pageName={pageContent.pageName}
                sectionId={sectionId}
                className="w-full"
                label="Change Banner Image"
                imageClassName="h-40 object-cover mx-auto rounded"
              />
            )}
          </div>
        </div>
      </div>
    </div>
  );
} 