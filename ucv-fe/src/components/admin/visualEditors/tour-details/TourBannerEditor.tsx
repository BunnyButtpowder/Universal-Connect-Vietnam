import { PageContent } from '../../../../lib/types';
import { InlineEditableField } from '../InlineEditableField';

interface TourBannerEditorProps {
  pageContent: PageContent;
}

export function TourBannerEditor({ pageContent }: TourBannerEditorProps) {
  return (
    <div className="tour-banner-editor mb-10">
      <h3 className="text-xl font-bold mb-4 border-b pb-2">Banner Section</h3>
      <div className="bg-blue-50 p-6 rounded-lg">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700 mb-1">Tour Date</label>
              <InlineEditableField
                pageName="tour-details"
                sectionId="bannerSection"
                item={pageContent.sections.bannerSection.items.find(item => item.id === 'tourBanner-date')}
                className="text-sm font-bold"
              />
            </div>

            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700 mb-1">Tour Title</label>
              <InlineEditableField
                pageName="tour-details"
                sectionId="bannerSection"
                item={pageContent.sections.bannerSection.items.find(item => item.id === 'tourBanner-title')}
                className="text-2xl font-bold"
              />
            </div>

            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700 mb-1">Tour Description</label>
              <InlineEditableField
                pageName="tour-details"
                sectionId="bannerSection"
                item={pageContent.sections.bannerSection.items.find(item => item.id === 'tourBanner-description')}
                multiline={true}
                className="text-sm"
              />
            </div>
          </div>

          <div>
            <div className="bg-white p-4 rounded-lg border border-gray-200">
              <h4 className="font-medium mb-3">Tour Details</h4>
              
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 mb-1">Location</label>
                <InlineEditableField
                  pageName="tour-details"
                  sectionId="bannerSection"
                  item={pageContent.sections.bannerSection.items.find(item => item.id === 'tourBanner-location')}
                  className="text-sm"
                />
              </div>
              
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 mb-1">Duration</label>
                <InlineEditableField
                  pageName="tour-details"
                  sectionId="bannerSection"
                  item={pageContent.sections.bannerSection.items.find(item => item.id === 'tourBanner-duration')}
                  className="text-sm"
                  multiline={true}
                />
              </div>

              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 mb-1">Customize</label>
                <InlineEditableField
                  pageName="tour-details"
                  sectionId="bannerSection"
                  item={pageContent.sections.bannerSection.items.find(item => item.id === 'tourBanner-customize')}
                  className="text-sm"
                />
              </div>
              
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 mb-1">Tour Dates</label>
                <InlineEditableField
                  pageName="tour-details"
                  sectionId="bannerSection"
                  item={pageContent.sections.bannerSection.items.find(item => item.id === 'tourBanner-startDate')}
                  className="text-sm"
                />
              </div>
            </div>

            <div className="mt-4 bg-yellow-50 p-4 rounded-lg border border-yellow-200">
              <p className="text-sm text-yellow-700">
                Banner image upload functionality will be available in a future update.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
} 