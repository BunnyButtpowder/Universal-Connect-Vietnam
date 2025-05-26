import { PageContent } from '../../../../lib/types';
import { InlineEditableField } from '../InlineEditableField';
import { ImageEditor } from '../../ImageEditor';

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

          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700 mb-1">Success Image (Party Popper)</label>
            <div className="bg-white p-4 rounded-lg border border-gray-200">
              <ImageEditor
                item={pageContent.sections.successSection.items.find(item => item.id === 'success-image')}
                pageName="signup-form"
                sectionId="successSection"
                className="w-full"
                label="Change Success Image"
                imageClassName="w-58 h-58 lg:w-68 lg:h-68 mx-auto object-contain"
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
} 