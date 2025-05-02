import { PageContent } from '../../../../lib/types';
import { InlineEditableField } from '../InlineEditableField';

interface TourEventsEditorProps {
  pageContent: PageContent;
}

export function TourEventsEditor({ pageContent }: TourEventsEditorProps) {
  return (
    <div className="tour-events-editor mb-10">
      <h3 className="text-xl font-bold mb-4 border-b pb-2">Events Section</h3>
      <div className="bg-blue-50 p-6 rounded-lg">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700 mb-1">Section Heading</label>
              <InlineEditableField
                pageName="tour-details"
                sectionId="eventsSection"
                item={pageContent.sections.eventsSection.items.find(item => item.id === 'events-heading')}
                className="text-sm font-bold"
              />
            </div>

            <div className="mb-6">
              <label className="block text-sm font-medium text-gray-700 mb-1">Section Title</label>
              <InlineEditableField
                pageName="tour-details"
                sectionId="eventsSection"
                item={pageContent.sections.eventsSection.items.find(item => item.id === 'events-title')}
                className="text-xl font-medium"
              />
            </div>

            <div className="bg-yellow-50 p-4 rounded-lg border border-yellow-200 mb-4">
              <p className="text-sm text-yellow-700">
                Image functionality will be available in a future update.
              </p>
            </div>
          </div>

          <div>
            <h4 className="font-medium mb-3">Event Items</h4>
            
            <div className="space-y-3">
              <div className="bg-white p-3 rounded border border-gray-200">
                <label className="block text-sm font-medium text-gray-700 mb-1">Event 1</label>
                <InlineEditableField
                  pageName="tour-details"
                  sectionId="eventsSection"
                  item={pageContent.sections.eventsSection.items.find(item => item.id === 'events-item1')}
                  className="text-sm"
                />
              </div>
              
              <div className="bg-white p-3 rounded border border-gray-200">
                <label className="block text-sm font-medium text-gray-700 mb-1">Event 2</label>
                <InlineEditableField
                  pageName="tour-details"
                  sectionId="eventsSection"
                  item={pageContent.sections.eventsSection.items.find(item => item.id === 'events-item2')}
                  className="text-sm"
                />
              </div>
              
              <div className="bg-white p-3 rounded border border-gray-200">
                <label className="block text-sm font-medium text-gray-700 mb-1">Event 3</label>
                <InlineEditableField
                  pageName="tour-details"
                  sectionId="eventsSection"
                  item={pageContent.sections.eventsSection.items.find(item => item.id === 'events-item3')}
                  className="text-sm"
                />
              </div>
              
              <div className="bg-white p-3 rounded border border-gray-200">
                <label className="block text-sm font-medium text-gray-700 mb-1">Event 4</label>
                <InlineEditableField
                  pageName="tour-details"
                  sectionId="eventsSection"
                  item={pageContent.sections.eventsSection.items.find(item => item.id === 'events-item4')}
                  className="text-sm"
                />
              </div>
              
              <div className="bg-white p-3 rounded border border-gray-200">
                <label className="block text-sm font-medium text-gray-700 mb-1">Event 5</label>
                <InlineEditableField
                  pageName="tour-details"
                  sectionId="eventsSection"
                  item={pageContent.sections.eventsSection.items.find(item => item.id === 'events-item5')}
                  className="text-sm"
                />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
} 