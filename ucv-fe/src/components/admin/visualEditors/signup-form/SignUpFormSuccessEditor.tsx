import { PageContent } from '../../../../lib/types';
import { InlineEditableField } from '../InlineEditableField';

interface SignUpFormSuccessEditorProps {
  pageContent: PageContent;
}

export function SignUpFormSuccessEditor({ pageContent }: SignUpFormSuccessEditorProps) {
  return (
    <div className="signup-form-success-editor mb-10">
      <h3 className="text-xl font-bold mb-4 border-b pb-2">Success Screen</h3>
      <div className="bg-blue-50 p-6 rounded-lg">
        <div className="grid grid-cols-1 gap-6">
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700 mb-1">Success Heading</label>
            <InlineEditableField
              pageName="signup-form"
              sectionId="successSection"
              item={pageContent.sections.successSection.items.find(item => item.id === 'success-heading')}
              className="text-2xl font-bold"
            />
          </div>

          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700 mb-1">Success Message</label>
            <InlineEditableField
              pageName="signup-form"
              sectionId="successSection"
              item={pageContent.sections.successSection.items.find(item => item.id === 'success-message')}
              className="text-sm"
              multiline={true}
            />
          </div>

          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700 mb-1">Back to Tours Button</label>
            <InlineEditableField
              pageName="signup-form"
              sectionId="successSection"
              item={pageContent.sections.successSection.items.find(item => item.id === 'success-button')}
              className="text-sm font-medium"
            />
          </div>

          <div className="p-4 bg-yellow-50 rounded-lg border border-yellow-200">
            <p className="text-sm text-yellow-700">
              The success image (party popper) upload functionality will be available in a future update.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
} 