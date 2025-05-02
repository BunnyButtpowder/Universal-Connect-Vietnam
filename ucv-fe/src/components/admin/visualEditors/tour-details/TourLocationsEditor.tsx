import { PageContent } from '../../../../lib/types';
import { InlineEditableField } from '../InlineEditableField';

interface TourLocationsEditorProps {
  pageContent: PageContent;
}

export function TourLocationsEditor({ pageContent }: TourLocationsEditorProps) {
  return (
    <div className="tour-locations-editor mb-10">
      <h3 className="text-xl font-bold mb-4 border-b pb-2">Locations Section</h3>
      <div className="bg-blue-50 p-6 rounded-lg">
        <div className="mb-6">
          <label className="block text-sm font-medium text-gray-700 mb-1">Section Heading</label>
          <InlineEditableField
            pageName="tour-details"
            sectionId="locationsSection"
            item={pageContent.sections.locationsSection.items.find(item => item.id === 'locations-heading')}
            className="text-sm font-bold"
          />
        </div>

        <div className="mb-6">
          <label className="block text-sm font-medium text-gray-700 mb-1">Section Title</label>
          <InlineEditableField
            pageName="tour-details"
            sectionId="locationsSection"
            item={pageContent.sections.locationsSection.items.find(item => item.id === 'locations-title')}
            className="text-xl font-medium"
          />
        </div>

        <div className="bg-white p-4 rounded-lg border border-gray-200 mb-4">
          <h4 className="font-medium mb-3">Location Names</h4>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="p-3 rounded border border-gray-200">
              <div className="mb-2">
                <label className="block text-sm font-medium text-gray-700 mb-1">Location 1</label>
                <InlineEditableField
                  pageName="tour-details"
                  sectionId="locationsSection"
                  item={pageContent.sections.locationsSection.items.find(item => item.id === 'locations-hue')}
                  className="text-sm font-medium"
                />
              </div>
              <div className="bg-yellow-50 py-2 px-3 rounded text-xs text-yellow-700">
                Image upload will be available in future updates
              </div>
            </div>
            
            <div className="p-3 rounded border border-gray-200">
              <div className="mb-2">
                <label className="block text-sm font-medium text-gray-700 mb-1">Location 2</label>
                <InlineEditableField
                  pageName="tour-details"
                  sectionId="locationsSection"
                  item={pageContent.sections.locationsSection.items.find(item => item.id === 'locations-danang')}
                  className="text-sm font-medium"
                />
              </div>
              <div className="bg-yellow-50 py-2 px-3 rounded text-xs text-yellow-700">
                Image upload will be available in future updates
              </div>
            </div>
            
            <div className="p-3 rounded border border-gray-200">
              <div className="mb-2">
                <label className="block text-sm font-medium text-gray-700 mb-1">Location 3</label>
                <InlineEditableField
                  pageName="tour-details"
                  sectionId="locationsSection"
                  item={pageContent.sections.locationsSection.items.find(item => item.id === 'locations-tamky')}
                  className="text-sm font-medium"
                />
              </div>
              <div className="bg-yellow-50 py-2 px-3 rounded text-xs text-yellow-700">
                Image upload will be available in future updates
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
} 