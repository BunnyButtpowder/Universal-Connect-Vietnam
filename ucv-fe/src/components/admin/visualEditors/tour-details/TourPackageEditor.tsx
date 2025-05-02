import { PageContent } from '../../../../lib/types';
import { InlineEditableField } from '../InlineEditableField';

interface TourPackageEditorProps {
  pageContent: PageContent;
}

export function TourPackageEditor({ pageContent }: TourPackageEditorProps) {
  return (
    <div className="tour-package-editor mb-10">
      <h3 className="text-xl font-bold mb-4 border-b pb-2">Package Section</h3>
      <div className="bg-blue-50 p-6 rounded-lg">
        <div className="mb-6">
          <label className="block text-sm font-medium text-gray-700 mb-1">Section Heading</label>
          <InlineEditableField
            pageName="tour-details"
            sectionId="packageSection"
            item={pageContent.sections.packageSection.items.find(item => item.id === 'package-heading')}
            className="text-sm font-bold"
          />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="bg-white p-4 rounded-lg border border-gray-200">
            <label className="block text-sm font-medium text-gray-700 mb-2">Package Items (Left Column)</label>
            <InlineEditableField
              pageName="tour-details"
              sectionId="packageSection"
              item={pageContent.sections.packageSection.items.find(item => item.id === 'package-items1')}
              className="text-sm"
              multiline={true}
            />
            <p className="mt-2 text-xs text-gray-500">
              Note: Use line breaks to separate items
            </p>
          </div>
          
          <div className="bg-white p-4 rounded-lg border border-gray-200">
            <label className="block text-sm font-medium text-gray-700 mb-2">Package Items (Right Column)</label>
            <InlineEditableField
              pageName="tour-details"
              sectionId="packageSection"
              item={pageContent.sections.packageSection.items.find(item => item.id === 'package-items2')}
              className="text-sm"
              multiline={true}
            />
            <p className="mt-2 text-xs text-gray-500">
              Note: Use line breaks to separate items
            </p>
          </div>
        </div>

        <div className="mt-4 bg-yellow-50 p-4 rounded-lg border border-yellow-200">
          <p className="text-sm text-yellow-700">
            Display image upload functionality will be available in a future update.
          </p>
        </div>
      </div>
    </div>
  );
} 