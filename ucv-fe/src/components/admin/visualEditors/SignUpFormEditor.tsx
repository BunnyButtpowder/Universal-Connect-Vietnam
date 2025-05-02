import { PageContent } from '../../../lib/types';
import { SignUpFormHeaderEditor } from './signup-form/SignUpFormHeaderEditor';
import { SignUpFormStep1Editor } from './signup-form/SignUpFormStep1Editor';
import { SignUpFormStep2Editor } from './signup-form/SignUpFormStep2Editor';
import { SignUpFormStep3Editor } from './signup-form/SignUpFormStep3Editor';
import { SignUpFormSuccessEditor } from './signup-form/SignUpFormSuccessEditor';

interface SignUpFormEditorProps {
  pageContent: PageContent;
}

export function SignUpFormEditor({ pageContent }: SignUpFormEditorProps) {
  if (!pageContent) return null;
  
  return (
    <div className="space-y-8">
      <div className="bg-white p-6 rounded-lg shadow-sm">
        <h2 className="text-2xl font-bold mb-6">Sign Up Form Editor</h2>
        <p className="text-gray-600 mb-4">
          Edit the content in the sign-up form below. Changes will be reflected immediately on the Sign Up Form page.
          Note that form field input elements and functionality cannot be modified through this editor.
        </p>
        
        <div className="p-4 bg-blue-50 rounded-lg mb-8">
          <h3 className="font-medium text-blue-700 mb-2">Form Steps</h3>
          <p className="text-sm text-blue-600">
            The sign-up form has 3 steps and a success screen. Use the editors below to modify the text content for each step.
          </p>
          <div className="flex flex-wrap gap-2 mt-4">
            <div className="inline-block px-3 py-1 bg-blue-100 rounded-md text-blue-800 text-sm">Step 1: Basic Information</div>
            <div className="inline-block px-3 py-1 bg-blue-100 rounded-md text-blue-800 text-sm">Step 2: Tour Package</div>
            <div className="inline-block px-3 py-1 bg-blue-100 rounded-md text-blue-800 text-sm">Step 3: Contract Details</div>
            <div className="inline-block px-3 py-1 bg-blue-100 rounded-md text-blue-800 text-sm">Success Screen</div>
          </div>
        </div>
        
        <div className="mt-8">
          <SignUpFormHeaderEditor pageContent={pageContent} />
          <SignUpFormStep1Editor pageContent={pageContent} />
          <SignUpFormStep2Editor pageContent={pageContent} />
          <SignUpFormStep3Editor pageContent={pageContent} />
          <SignUpFormSuccessEditor pageContent={pageContent} />
        </div>

        <div className="mt-6 p-4 bg-blue-50 rounded-lg">
          <h3 className="font-medium text-blue-700 mb-2">Note</h3>
          <p className="text-sm text-blue-600">
            Image uploads and form input field functionality are not included in this editor.
            These features will be implemented in a future update.
          </p>
        </div>
      </div>
    </div>
  );
} 