import { PageContent, ContentItem } from '../../../lib/types';
import { InlineEditableField } from './InlineEditableField';
import { Phone, Mail } from 'lucide-react';

interface FooterEditorProps {
  pageContent: PageContent;
}

export function FooterEditor({ pageContent }: FooterEditorProps) {
  const sectionId = 'footer';
  const section = pageContent.sections[sectionId];
  
  // Helper function to find items by ID
  const getItemById = (id: string): ContentItem | undefined => {
    return section.items.find(item => item.id === id);
  };
  
  // Get footer content
  const description = getItemById('footer-description');
  const phone = getItemById('footer-phone');
  const email1 = getItemById('footer-email1');
  const email2 = getItemById('footer-email2');
  const copyright = getItemById('footer-copyright');
  const contactHeading = getItemById('footer-contact-heading');
  const contactTitle = getItemById('footer-contact-title');
  
  // Region option labels with fallbacks
  const regionNorthern = getItemById('footer-region-northern');
  const northernLabel = regionNorthern ? regionNorthern.content : 'Northern Vietnam (Hanoi and surrounding areas)';
  
  const regionCentral = getItemById('footer-region-central');
  const centralLabel = regionCentral ? regionCentral.content : 'Central Vietnam (Da Nang and surrounding areas)';
  
  const regionSouthern = getItemById('footer-region-southern');
  const southernLabel = regionSouthern ? regionSouthern.content : 'Southern Vietnam (HCMC and surrounding areas)';
  
  return (
    <div className="preview-container space-y-8 mt-5">
      <div className="border border-gray-200 rounded-lg bg-gray-700 text-white p-6">
        <h3 className="font-semibold text-white mb-6 border-b border-gray-600 pb-2">Footer Content</h3>
        
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          {/* Left Side - Logo and Description */}
          <div className="space-y-4 lg:col-span-3">
            <div className="flex items-center gap-2 mb-4">
              <img
                src="/ucv-logo-white.svg"
                alt="UCV Logo"
                className="h-10 w-auto"
              />
              <div className="flex flex-col ps-2">
                <span className="text-xs font-medium text-white">UNIVERSAL</span>
                <span className="text-xs font-medium text-white">CONNECT</span>
                <span className="text-xs font-medium text-white">VN</span>
              </div>
            </div>
            
            <div className="bg-gray-600 p-3 rounded-lg">
              <div className="font-semibold text-gray-300 text-xs mb-1">Description:</div>
              {description && (
                <InlineEditableField
                  item={description}
                  pageName={pageContent.pageName}
                  sectionId={sectionId}
                  className="text-xs text-gray-300"
                  multiline
                />
              )}
            </div>
            
            {/* Contact Info */}
            <div className="space-y-3 mt-4">
              <div className="flex gap-4 items-center bg-gray-600 p-3 rounded-lg">
                <Phone className="h-5 w-5 text-blue-400" />
                <div>
                  <div className="font-semibold text-gray-300 text-xs mb-1">Phone:</div>
                  {phone && (
                    <InlineEditableField
                      item={phone}
                      pageName={pageContent.pageName}
                      sectionId={sectionId}
                      className="text-xs text-white"
                    />
                  )}
                </div>
              </div>
              
              <div className="flex gap-4 items-center bg-gray-600 p-3 rounded-lg">
                <Mail className="h-5 w-5 text-blue-400" />
                <div className="space-y-2">
                  <div className="font-semibold text-gray-300 text-xs mb-1">Email 1:</div>
                  {email1 && (
                    <InlineEditableField
                      item={email1}
                      pageName={pageContent.pageName}
                      sectionId={sectionId}
                      className="text-xs text-white"
                    />
                  )}
                  
                  <div className="font-semibold text-gray-300 text-xs mb-1">Email 2:</div>
                  {email2 && (
                    <InlineEditableField
                      item={email2}
                      pageName={pageContent.pageName}
                      sectionId={sectionId}
                      className="text-xs text-white"
                    />
                  )}
                </div>
              </div>
            </div>
            
            <div className="bg-gray-600 p-3 rounded-lg mt-6">
              <div className="font-semibold text-gray-300 text-xs mb-1">Copyright:</div>
              {copyright && (
                <InlineEditableField
                  item={copyright}
                  pageName={pageContent.pageName}
                  sectionId={sectionId}
                  className="text-xs text-gray-400"
                />
              )}
            </div>
          </div>
          
          <div className="lg:col-span-1"></div>
          
          {/* Right Side - Contact Form */}
          <div className="space-y-4 lg:col-span-8">
            <div className="bg-gray-600 p-3 rounded-lg">
              <div className="font-semibold text-gray-300 text-xs mb-1">Contact Heading:</div>
              {contactHeading && (
                <InlineEditableField
                  item={contactHeading}
                  pageName={pageContent.pageName}
                  sectionId={sectionId}
                  className="text-sm font-semibold text-white"
                />
              )}
            </div>
            
            <div className="bg-gray-600 p-3 rounded-lg">
              <div className="font-semibold text-gray-300 text-xs mb-1">Contact Title:</div>
              {contactTitle && (
                <InlineEditableField
                  item={contactTitle}
                  pageName={pageContent.pageName}
                  sectionId={sectionId}
                  className="text-lg text-white"
                  multiline
                />
              )}
            </div>
            
            {/* Tour Regions Options */}
            <div className="bg-gray-600 p-3 rounded-lg">
              <div className="font-semibold text-gray-300 text-xs mb-3">Tour Region Options:</div>
              <div className="space-y-4">
                <div>
                  <div className="font-semibold text-gray-300 text-xs mb-1">Northern Region:</div>
                  {regionNorthern ? (
                    <InlineEditableField
                      item={regionNorthern}
                      pageName={pageContent.pageName}
                      sectionId={sectionId}
                      className="text-xs text-white"
                    />
                  ) : (
                    <div className="text-xs text-gray-400">
                      {northernLabel} <span className="text-gray-500">(Default - Add content item to edit)</span>
                    </div>
                  )}
                </div>
                <div>
                  <div className="font-semibold text-gray-300 text-xs mb-1">Central Region:</div>
                  {regionCentral ? (
                    <InlineEditableField
                      item={regionCentral}
                      pageName={pageContent.pageName}
                      sectionId={sectionId}
                      className="text-xs text-white"
                    />
                  ) : (
                    <div className="text-xs text-gray-400">
                      {centralLabel} <span className="text-gray-500">(Default - Add content item to edit)</span>
                    </div>
                  )}
                </div>
                <div>
                  <div className="font-semibold text-gray-300 text-xs mb-1">Southern Region:</div>
                  {regionSouthern ? (
                    <InlineEditableField
                      item={regionSouthern}
                      pageName={pageContent.pageName}
                      sectionId={sectionId}
                      className="text-xs text-white"
                    />
                  ) : (
                    <div className="text-xs text-gray-400">
                      {southernLabel} <span className="text-gray-500">(Default - Add content item to edit)</span>
                    </div>
                  )}
                </div>
              </div>
            </div>
            
            <div className="bg-gray-800 p-4 rounded-lg mt-4">
              <div className="text-center text-gray-400 text-xs p-4">
                Contact Form (Non-editable, handled by system)
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
} 