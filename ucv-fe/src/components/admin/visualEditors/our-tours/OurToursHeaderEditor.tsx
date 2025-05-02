import { PageContent } from '../../../../lib/types';
import { InlineEditableField } from '../InlineEditableField';

interface OurToursHeaderEditorProps {
  pageContent: PageContent;
}

export function OurToursHeaderEditor({ pageContent }: OurToursHeaderEditorProps) {
  const sectionId = 'headerSection';
  
  // Get the specific content items
  const title = pageContent.sections[sectionId]?.items.find(
    item => item.id === 'headerSection-title'
  );
  
  const description = pageContent.sections[sectionId]?.items.find(
    item => item.id === 'headerSection-description'
  );
  
  if (!title || !description) {
    return (
      <div className="bg-red-50 border border-red-300 text-red-700 p-4 rounded-md">
        <p>Missing required content items. Please check content configuration.</p>
      </div>
    );
  }

  return (
    <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-100">
      <h2 className="text-xl font-bold text-gray-800 mb-4 border-b pb-2">
        Header Section Editor
      </h2>
      
      <div className="bg-gray-50 p-4 rounded-lg">
        <div className="bg-blue-50 p-6 rounded-lg mb-6">
          <h3 className="text-lg font-semibold text-gray-700 mb-4">Header Content Preview</h3>
          
          <div className="relative mx-auto p-6 overflow-hidden bg-white rounded-lg border border-gray-200">
            <div className="grid grid-cols-1">
              <div className="space-y-4">
                <h2 className="text-2xl font-medium text-gray-800">
                  {title.content}
                </h2>
                <p className="text-sm text-gray-600 font-medium">
                  {description.content}
                </p>
              </div>
            </div>
          </div>
        </div>
        
        <div className="grid grid-cols-1 gap-6">
          <div className="bg-white p-4 rounded-lg shadow-sm">
            <div className="font-semibold text-gray-500 text-xs mb-2">Header Title:</div>
            <InlineEditableField
              item={title}
              pageName={pageContent.pageName}
              sectionId={sectionId}
              className="text-xl font-semibold text-blue-700"
              multiline
            />
          </div>
          
          <div className="bg-white p-4 rounded-lg shadow-sm">
            <div className="font-semibold text-gray-500 text-xs mb-2">Header Description:</div>
            <InlineEditableField
              item={description}
              pageName={pageContent.pageName}
              sectionId={sectionId}
              className="text-gray-700"
              multiline
            />
          </div>
        </div>
      </div>
    </div>
  );
} 