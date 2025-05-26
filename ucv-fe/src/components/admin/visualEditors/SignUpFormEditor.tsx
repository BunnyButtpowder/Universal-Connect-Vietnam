import { PageContent } from '../../../lib/types';
import { SignUpFormHeaderEditor } from './signup-form/SignUpFormHeaderEditor';
import { SignUpFormStep1Editor } from './signup-form/SignUpFormStep1Editor';
// import { SignUpFormStep2Editor } from './signup-form/SignUpFormStep2Editor';
import { SignUpFormStep3Editor } from './signup-form/SignUpFormStep3Editor';
import { SignUpFormSuccessEditor } from './signup-form/SignUpFormSuccessEditor';
import { useContentStore } from '../../../lib/contentStore';
import { useState } from 'react';

interface SignUpFormEditorProps {
  pageContent: PageContent;
}

export function SignUpFormEditor({ pageContent }: SignUpFormEditorProps) {
  const resetPageContent = useContentStore(state => state.resetPageContent);
  const [isResetDialogOpen, setIsResetDialogOpen] = useState(false);
  
  if (!pageContent) return null;
  
  const handleResetContent = () => {
    resetPageContent('signup-form');
    setIsResetDialogOpen(false);
    
    // Add a small delay before reloading to ensure state is updated
    setTimeout(() => {
      window.location.reload();
    }, 500);
  };
  
  return (
    <div className="space-y-8">
      <div className="bg-white p-6 rounded-lg shadow-sm">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-bold">Sign Up Form Editor</h2>
          <button
            onClick={() => setIsResetDialogOpen(true)}
            className="px-4 py-2 bg-red-50 text-red-700 rounded-md hover:bg-red-100 text-sm font-medium flex items-center"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
            </svg>
            Reset Content
          </button>
        </div>
        
        {isResetDialogOpen && (
          <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
            <div className="bg-white rounded-lg max-w-md w-full p-6">
              <h3 className="text-lg font-bold text-red-700 mb-2">Reset Content</h3>
              <p className="text-gray-700 mb-4">
                This will reset all Sign Up Form content to default values. Any customizations you've made will be lost.
                This action cannot be undone.
              </p>
              <div className="flex justify-end space-x-3">
                <button
                  onClick={() => setIsResetDialogOpen(false)}
                  className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50"
                >
                  Cancel
                </button>
                <button
                  onClick={handleResetContent}
                  className="px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700"
                >
                  Reset Content
                </button>
              </div>
            </div>
          </div>
        )}
        
        <p className="text-gray-600 mb-4">
          Edit the content in the sign-up form below. Changes will be reflected immediately on the Sign Up Form page.
          The form allows clients to register for tours with options for different locations and promotions.
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
          {/* <SignUpFormStep2Editor pageContent={pageContent} /> */}
          <SignUpFormStep3Editor pageContent={pageContent} />
          <SignUpFormSuccessEditor pageContent={pageContent} />
        </div>

        <div className="mt-6 p-4 bg-blue-50 rounded-lg">
          <h3 className="font-medium text-blue-700 mb-2">Note</h3>
          <p className="text-sm text-blue-600">
            This editor allows you to modify text labels and content, but pricing details, location options, 
            and document processing functionality are managed separately in the system.
          </p>
        </div>
      </div>
    </div>
  );
} 