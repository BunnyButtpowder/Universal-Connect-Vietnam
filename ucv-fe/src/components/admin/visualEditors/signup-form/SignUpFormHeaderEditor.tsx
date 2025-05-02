import { PageContent } from '../../../../lib/types';
import { InlineEditableField } from '../InlineEditableField';

interface SignUpFormHeaderEditorProps {
  pageContent: PageContent;
}

export function SignUpFormHeaderEditor({ pageContent }: SignUpFormHeaderEditorProps) {
  return (
    <div className="signup-form-header-editor mb-10">
      <h3 className="text-xl font-bold mb-4 border-b pb-2">Header Section</h3>
      <div className="bg-blue-50 p-6 rounded-lg">
        <div className="grid grid-cols-1 gap-6">
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700 mb-1">Main Title</label>
            <InlineEditableField
              pageName="signup-form"
              sectionId="headerSection"
              item={pageContent.sections.headerSection.items.find(item => item.id === 'signup-header-title')}
              className="text-2xl font-bold"
            />
          </div>

          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
            <InlineEditableField
              pageName="signup-form"
              sectionId="headerSection"
              item={pageContent.sections.headerSection.items.find(item => item.id === 'signup-header-description')}
              className="text-sm"
              multiline={true}
            />
          </div>
        </div>
      </div>
    </div>
  );
} 