import { PageContent } from '../../../../lib/types';
import { InlineEditableField } from '../InlineEditableField';

interface SignUpFormStep1EditorProps {
  pageContent: PageContent;
}

export function SignUpFormStep1Editor({ pageContent }: SignUpFormStep1EditorProps) {
  return (
    <div className="signup-form-step1-editor mb-10">
      <h3 className="text-xl font-bold mb-4 border-b pb-2">Step 1 - Basic Information</h3>
      <div className="bg-blue-50 p-6 rounded-lg">
        <div className="grid grid-cols-1 gap-6">
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700 mb-1">Section Heading</label>
            <InlineEditableField
              pageName="signup-form"
              sectionId="step1Section"
              item={pageContent.sections.step1Section.items.find(item => item.id === 'step1-heading')}
              className="text-xl font-bold"
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 bg-white p-4 rounded-md">
            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700 mb-1">Full Name Label</label>
              <InlineEditableField
                pageName="signup-form"
                sectionId="step1Section"
                item={pageContent.sections.step1Section.items.find(item => item.id === 'step1-fullname-label')}
                className="text-sm font-medium"
              />
              <div className="mt-1 bg-gray-100 p-2 rounded text-xs text-gray-500">Input field (not editable)</div>
            </div>

            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700 mb-1">Organization Label</label>
              <InlineEditableField
                pageName="signup-form"
                sectionId="step1Section"
                item={pageContent.sections.step1Section.items.find(item => item.id === 'step1-organization-label')}
                className="text-sm font-medium"
              />
              <div className="mt-1 bg-gray-100 p-2 rounded text-xs text-gray-500">Input field (not editable)</div>
            </div>

            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700 mb-1">Phone Label</label>
              <InlineEditableField
                pageName="signup-form"
                sectionId="step1Section"
                item={pageContent.sections.step1Section.items.find(item => item.id === 'step1-phone-label')}
                className="text-sm font-medium"
              />
              <div className="mt-1 bg-gray-100 p-2 rounded text-xs text-gray-500">Input field (not editable)</div>
            </div>

            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700 mb-1">Email Label</label>
              <InlineEditableField
                pageName="signup-form"
                sectionId="step1Section"
                item={pageContent.sections.step1Section.items.find(item => item.id === 'step1-email-label')}
                className="text-sm font-medium"
              />
              <div className="mt-1 bg-gray-100 p-2 rounded text-xs text-gray-500">Input field (not editable)</div>
            </div>
          </div>

          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700 mb-1">Callback Text</label>
            <InlineEditableField
              pageName="signup-form"
              sectionId="step1Section"
              item={pageContent.sections.step1Section.items.find(item => item.id === 'step1-callback-label')}
              className="text-sm"
              multiline={true}
            />
          </div>

          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700 mb-1">Next Button Text</label>
            <InlineEditableField
              pageName="signup-form"
              sectionId="step1Section"
              item={pageContent.sections.step1Section.items.find(item => item.id === 'step1-next-button')}
              className="text-sm font-medium"
            />
          </div>
        </div>
      </div>
    </div>
  );
} 