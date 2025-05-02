import { PageContent } from '../../../../lib/types';
import { InlineEditableField } from '../InlineEditableField';

interface SignUpFormStep2EditorProps {
  pageContent: PageContent;
}

export function SignUpFormStep2Editor({ pageContent }: SignUpFormStep2EditorProps) {
  return (
    <div className="signup-form-step2-editor mb-10">
      <h3 className="text-xl font-bold mb-4 border-b pb-2">Step 2 - Tour Package</h3>
      <div className="bg-blue-50 p-6 rounded-lg">
        <div className="grid grid-cols-1 gap-6">
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700 mb-1">Section Heading</label>
            <InlineEditableField
              pageName="signup-form"
              sectionId="step2Section"
              item={pageContent.sections.step2Section.items.find(item => item.id === 'step2-heading')}
              className="text-xl font-bold"
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 bg-white p-4 rounded-md">
            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700 mb-1">Tour Date Label</label>
              <InlineEditableField
                pageName="signup-form"
                sectionId="step2Section"
                item={pageContent.sections.step2Section.items.find(item => item.id === 'step2-tour-date')}
                className="text-sm font-medium"
              />
            </div>

            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700 mb-1">Tour Title</label>
              <InlineEditableField
                pageName="signup-form"
                sectionId="step2Section"
                item={pageContent.sections.step2Section.items.find(item => item.id === 'step2-tour-title')}
                className="text-sm font-medium"
              />
            </div>

            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700 mb-1">Location Title</label>
              <InlineEditableField
                pageName="signup-form"
                sectionId="step2Section"
                item={pageContent.sections.step2Section.items.find(item => item.id === 'step2-location-title')}
                className="text-sm font-medium"
              />
            </div>

            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700 mb-1">Location Content</label>
              <InlineEditableField
                pageName="signup-form"
                sectionId="step2Section"
                item={pageContent.sections.step2Section.items.find(item => item.id === 'step2-location-content')}
                className="text-sm"
              />
            </div>

            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700 mb-1">Duration Title</label>
              <InlineEditableField
                pageName="signup-form"
                sectionId="step2Section"
                item={pageContent.sections.step2Section.items.find(item => item.id === 'step2-duration-title')}
                className="text-sm font-medium"
              />
            </div>

            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700 mb-1">Duration Content</label>
              <InlineEditableField
                pageName="signup-form"
                sectionId="step2Section"
                item={pageContent.sections.step2Section.items.find(item => item.id === 'step2-duration-content')}
                className="text-sm"
                multiline={true}
              />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 bg-white p-4 rounded-md">
            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700 mb-1">Registration Title</label>
              <InlineEditableField
                pageName="signup-form"
                sectionId="step2Section"
                item={pageContent.sections.step2Section.items.find(item => item.id === 'step2-registration-title')}
                className="text-sm font-medium"
              />
            </div>

            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700 mb-1">Returning University Label</label>
              <InlineEditableField
                pageName="signup-form"
                sectionId="step2Section"
                item={pageContent.sections.step2Section.items.find(item => item.id === 'step2-returning-title')}
                className="text-sm font-medium"
              />
            </div>

            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700 mb-1">Early Bird Title</label>
              <InlineEditableField
                pageName="signup-form"
                sectionId="step2Section"
                item={pageContent.sections.step2Section.items.find(item => item.id === 'step2-earlybird-title')}
                className="text-sm font-medium"
              />
            </div>

            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700 mb-1">Price Label</label>
              <InlineEditableField
                pageName="signup-form"
                sectionId="step2Section"
                item={pageContent.sections.step2Section.items.find(item => item.id === 'step2-price')}
                className="text-sm font-medium"
              />
            </div>
          </div>

          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700 mb-1">Include Title</label>
            <InlineEditableField
              pageName="signup-form"
              sectionId="step2Section"
              item={pageContent.sections.step2Section.items.find(item => item.id === 'step2-include-title')}
              className="text-sm font-medium"
            />
          </div>

          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700 mb-1">Include List</label>
            <InlineEditableField
              pageName="signup-form"
              sectionId="step2Section"
              item={pageContent.sections.step2Section.items.find(item => item.id === 'step2-include-list')}
              className="text-sm"
              multiline={true}
            />
            <div className="mt-1 text-xs text-blue-600">Note: Each item should be on a new line</div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 bg-white p-4 rounded-md">
            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700 mb-1">Preferences Title</label>
              <InlineEditableField
                pageName="signup-form"
                sectionId="step2Section"
                item={pageContent.sections.step2Section.items.find(item => item.id === 'step2-preferences-title')}
                className="text-sm font-medium"
              />
            </div>

            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700 mb-1">Cities Section Title</label>
              <InlineEditableField
                pageName="signup-form"
                sectionId="step2Section"
                item={pageContent.sections.step2Section.items.find(item => item.id === 'step2-cities-title')}
                className="text-sm font-medium"
              />
            </div>

            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700 mb-1">Hue Label</label>
              <InlineEditableField
                pageName="signup-form"
                sectionId="step2Section"
                item={pageContent.sections.step2Section.items.find(item => item.id === 'step2-hue-label')}
                className="text-sm"
              />
            </div>

            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700 mb-1">Danang Label</label>
              <InlineEditableField
                pageName="signup-form"
                sectionId="step2Section"
                item={pageContent.sections.step2Section.items.find(item => item.id === 'step2-danang-label')}
                className="text-sm"
              />
            </div>

            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700 mb-1">Tam Ky Label</label>
              <InlineEditableField
                pageName="signup-form"
                sectionId="step2Section"
                item={pageContent.sections.step2Section.items.find(item => item.id === 'step2-tamky-label')}
                className="text-sm"
              />
            </div>

            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700 mb-1">Transfers Title</label>
              <InlineEditableField
                pageName="signup-form"
                sectionId="step2Section"
                item={pageContent.sections.step2Section.items.find(item => item.id === 'step2-transfers-title')}
                className="text-sm font-medium"
              />
            </div>

            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700 mb-1">Hotel Label</label>
              <InlineEditableField
                pageName="signup-form"
                sectionId="step2Section"
                item={pageContent.sections.step2Section.items.find(item => item.id === 'step2-hotel-label')}
                className="text-sm"
              />
            </div>

            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700 mb-1">Travel Label</label>
              <InlineEditableField
                pageName="signup-form"
                sectionId="step2Section"
                item={pageContent.sections.step2Section.items.find(item => item.id === 'step2-travel-label')}
                className="text-sm"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700 mb-1">Back Button Text</label>
              <InlineEditableField
                pageName="signup-form"
                sectionId="step2Section"
                item={pageContent.sections.step2Section.items.find(item => item.id === 'step2-back-button')}
                className="text-sm font-medium"
              />
            </div>

            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700 mb-1">Next Button Text</label>
              <InlineEditableField
                pageName="signup-form"
                sectionId="step2Section"
                item={pageContent.sections.step2Section.items.find(item => item.id === 'step2-next-button')}
                className="text-sm font-medium"
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
} 