import { PageContent } from '../../../../lib/types';
import { InlineEditableField } from '../InlineEditableField';

interface SignUpFormStep3EditorProps {
  pageContent: PageContent;
}

export function SignUpFormStep3Editor({ pageContent }: SignUpFormStep3EditorProps) {
  return (
    <div className="signup-form-step3-editor mb-10">
      <h3 className="text-xl font-bold mb-4 border-b pb-2">Step 3 - Contract Details</h3>
      <div className="bg-blue-50 p-6 rounded-lg">
        <div className="grid grid-cols-1 gap-6">
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700 mb-1">Section Heading</label>
            <InlineEditableField
              pageName="signup-form"
              sectionId="step3Section"
              item={pageContent.sections.step3Section.items.find(item => item.id === 'step3-heading')}
              className="text-xl font-bold"
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 bg-white p-4 rounded-md">
            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700 mb-1">Organization Label</label>
              <InlineEditableField
                pageName="signup-form"
                sectionId="step3Section"
                item={pageContent.sections.step3Section.items.find(item => item.id === 'step3-organization-label')}
                className="text-sm font-medium"
              />
              <div className="mt-1 bg-gray-100 p-2 rounded text-xs text-gray-500">Auto-filled field (not editable)</div>
            </div>

            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700 mb-1">Head Office Label <span className="text-red-500">*</span></label>
              <InlineEditableField
                pageName="signup-form"
                sectionId="step3Section"
                item={pageContent.sections.step3Section.items.find(item => item.id === 'step3-headoffice-label')}
                className="text-sm font-medium"
              />
              <div className="mt-1 bg-gray-100 p-2 rounded text-xs text-gray-500">Input field (not editable)</div>
            </div>
          </div>
          
          <div className="grid grid-cols-1 gap-4 bg-white p-4 rounded-md">
            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700 mb-1">Legal Representative Label <span className="text-red-500">*</span></label>
              <InlineEditableField
                pageName="signup-form"
                sectionId="step3Section"
                item={pageContent.sections.step3Section.items.find(item => item.id === 'step3-representative-label')}
                className="text-sm font-medium"
              />
              <div className="mt-1 bg-gray-100 p-2 rounded text-xs text-gray-500">Input field (not editable)</div>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 bg-white p-4 rounded-md">
            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700 mb-1">Position Label <span className="text-red-500">*</span></label>
              <InlineEditableField
                pageName="signup-form"
                sectionId="step3Section"
                item={pageContent.sections.step3Section.items.find(item => item.id === 'step3-position-label')}
                className="text-sm font-medium"
              />
              <div className="mt-1 bg-gray-100 p-2 rounded text-xs text-gray-500">Input field (not editable)</div>
            </div>

            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700 mb-1">Phone Label</label>
              <InlineEditableField
                pageName="signup-form"
                sectionId="step3Section"
                item={pageContent.sections.step3Section.items.find(item => item.id === 'step3-phone-label')}
                className="text-sm font-medium"
              />
              <div className="mt-1 bg-gray-100 p-2 rounded text-xs text-gray-500">Auto-filled field (not editable)</div>
            </div>

            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700 mb-1">Email Label</label>
              <InlineEditableField
                pageName="signup-form"
                sectionId="step3Section"
                item={pageContent.sections.step3Section.items.find(item => item.id === 'step3-email-label')}
                className="text-sm font-medium"
              />
              <div className="mt-1 bg-gray-100 p-2 rounded text-xs text-gray-500">Auto-filled field (not editable)</div>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700 mb-1">Back Button Text</label>
              <InlineEditableField
                pageName="signup-form"
                sectionId="step3Section"
                item={pageContent.sections.step3Section.items.find(item => item.id === 'step3-back-button')}
                className="text-sm font-medium"
              />
            </div>

            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700 mb-1">Submit Button Text</label>
              <InlineEditableField
                pageName="signup-form"
                sectionId="step3Section"
                item={pageContent.sections.step3Section.items.find(item => item.id === 'step3-submit-button')}
                className="text-sm font-medium"
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
} 