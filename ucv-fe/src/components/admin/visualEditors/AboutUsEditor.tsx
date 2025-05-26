import { PageContent, ContentItem } from '../../../lib/types';
import { InlineEditableField } from './InlineEditableField';
import { StatisticsEditor } from './StatisticsEditor';
import { ImageEditor } from '../ImageEditor';

interface AboutUsEditorProps {
  pageContent: PageContent;
}

export function AboutUsEditor({ pageContent }: AboutUsEditorProps) {
  const sectionId = 'aboutUs';
  const section = pageContent.sections[sectionId];
  
  // Helper function to find items by ID
  const getItemById = (id: string): ContentItem | undefined => {
    return section.items.find(item => item.id === id);
  };
  
  // Get About Us content items
  const heading = getItemById('aboutUs-heading');
  const subheading = getItemById('aboutUs-subheading');
  const paragraph1 = getItemById('aboutUs-paragraph1');
  const paragraph2 = getItemById('aboutUs-paragraph2');
  const button = getItemById('aboutUs-button');
  const image = getItemById('aboutUs-image');
  
  // Statistics
  const stat1 = getItemById('aboutUs-stat1');
  const stat2 = getItemById('aboutUs-stat2');
  const stat3 = getItemById('aboutUs-stat3');
  
  // Tour information
  const tourHeading = getItemById('aboutUs-tourHeading');
  
  // Location card
  const locationTitle = getItemById('aboutUs-location-title');
  const locationContent = getItemById('aboutUs-location-content');
  
  // What We Offer card
  const offerTitle = getItemById('aboutUs-offer-title');
  const offerContent = getItemById('aboutUs-offer-content');
  
  // Our Support card
  const supportTitle = getItemById('aboutUs-support-title');
  const supportContent = getItemById('aboutUs-support-content');
  
  return (
    <div className="preview-container space-y-8">
      {/* Main Content Grid */}
      <div className="border border-gray-200 rounded-lg p-4 bg-gray-50">
        <h3 className="font-semibold text-gray-700 mb-4">Main About Us Content</h3>
        
        <div className="grid grid-cols-1 lg:grid-cols-6 gap-4">
          {/* Left Content */}
          <div className="lg:col-span-2 space-y-4">
            <div className="bg-blue-50 p-4 rounded">
              <div className="font-semibold text-gray-500 text-xs mb-1">Section Heading:</div>
              <InlineEditableField
                item={heading}
                pageName={pageContent.pageName}
                sectionId={sectionId}
                className="text-xl font-bold text-blue-900"
              />
            </div>
            
            <div className="aspect-video bg-white p-1 rounded border border-gray-200 flex items-center justify-center">
              {image && (
                <ImageEditor
                  item={image}
                  pageName={pageContent.pageName}
                  sectionId={sectionId}
                  className="w-full"
                  label="Change About Us Image"
                  imageClassName="max-h-40 object-contain mx-auto"
                />
              )}
            </div>
          </div>
          
          {/* Right Content */}
          <div className="lg:col-span-4 space-y-4">
            <div className="bg-blue-50 p-4 rounded">
              <div className="font-semibold text-gray-500 text-xs mb-1">Subheading:</div>
              <InlineEditableField
                item={subheading}
                pageName={pageContent.pageName}
                sectionId={sectionId}
                className="text-xl font-semibold text-blue-700"
                multiline
              />
            </div>
            
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
              <div className="bg-blue-50 p-4 rounded">
                <div className="font-semibold text-gray-500 text-xs mb-1">Paragraph 1:</div>
                <InlineEditableField
                  item={paragraph1}
                  pageName={pageContent.pageName}
                  sectionId={sectionId}
                  className="text-gray-700"
                  multiline
                />
              </div>
              
              <div className="bg-blue-50 p-4 rounded">
                <div className="font-semibold text-gray-500 text-xs mb-1">Paragraph 2:</div>
                <InlineEditableField
                  item={paragraph2}
                  pageName={pageContent.pageName}
                  sectionId={sectionId}
                  className="text-gray-700"
                  multiline
                />
              </div>
            </div>
            
            <div className="bg-blue-50 p-4 rounded">
              <div className="font-semibold text-gray-500 text-xs mb-1">Button Text:</div>
              <InlineEditableField
                item={button}
                pageName={pageContent.pageName}
                sectionId={sectionId}
                className="inline-block bg-blue-500 text-white px-4 py-2 rounded-full text-sm font-medium"
              />
            </div>
          </div>
        </div>
      </div>
      
      {/* Statistics Section */}
      <div className="border border-gray-200 rounded-lg p-4 bg-gray-50">
        <h3 className="font-semibold text-gray-700 mb-4">Statistics</h3>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {stat1 && (
            <StatisticsEditor
              item={stat1}
              pageName={pageContent.pageName}
              sectionId={sectionId}
            />
          )}
          
          {stat2 && (
            <StatisticsEditor
              item={stat2}
              pageName={pageContent.pageName}
              sectionId={sectionId}
            />
          )}
          
          {stat3 && (
            <StatisticsEditor
              item={stat3}
              pageName={pageContent.pageName}
              sectionId={sectionId}
            />
          )}
        </div>
      </div>
      
      {/* Tour Information Section */}
      <div className="border border-gray-200 rounded-lg p-4 bg-gray-50">
        <h3 className="font-semibold text-gray-700 mb-4">Tour Information</h3>
        
        <div className="bg-blue-50 p-4 rounded mb-6">
          <div className="font-semibold text-gray-500 text-xs mb-1">Tour Section Heading:</div>
          <InlineEditableField
            item={tourHeading}
            pageName={pageContent.pageName}
            sectionId={sectionId}
            className="text-xl font-semibold text-blue-700"
            multiline
          />
        </div>
        
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
          {/* Location Card */}
          <div className="bg-white p-4 rounded-lg shadow-sm">
            <div className="mb-3">
              <div className="font-semibold text-gray-500 text-xs mb-1">Location Card Title:</div>
              <InlineEditableField
                item={locationTitle}
                pageName={pageContent.pageName}
                sectionId={sectionId}
                className="text-lg font-semibold text-blue-500"
              />
            </div>
            
            <div className="border-t border-gray-200 pt-3">
              <div className="font-semibold text-gray-500 text-xs mb-1">Location Content:</div>
              <InlineEditableField
                item={locationContent}
                pageName={pageContent.pageName}
                sectionId={sectionId}
                className="text-gray-700 text-sm"
                multiline
              />
            </div>
          </div>
          
          {/* What We Offer Card */}
          <div className="bg-white p-4 rounded-lg shadow-sm">
            <div className="mb-3">
              <div className="font-semibold text-gray-500 text-xs mb-1">What We Offer Title:</div>
              <InlineEditableField
                item={offerTitle}
                pageName={pageContent.pageName}
                sectionId={sectionId}
                className="text-lg font-semibold text-blue-500"
              />
            </div>
            
            <div className="border-t border-gray-200 pt-3">
              <div className="font-semibold text-gray-500 text-xs mb-1">What We Offer Content:</div>
              <InlineEditableField
                item={offerContent}
                pageName={pageContent.pageName}
                sectionId={sectionId}
                className="text-gray-700 text-sm"
                multiline
              />
            </div>
          </div>
          
          {/* Our Support Card */}
          <div className="bg-white p-4 rounded-lg shadow-sm">
            <div className="mb-3">
              <div className="font-semibold text-gray-500 text-xs mb-1">Our Support Title:</div>
              <InlineEditableField
                item={supportTitle}
                pageName={pageContent.pageName}
                sectionId={sectionId}
                className="text-lg font-semibold text-blue-500"
              />
            </div>
            
            <div className="border-t border-gray-200 pt-3">
              <div className="font-semibold text-gray-500 text-xs mb-1">Our Support Content:</div>
              <InlineEditableField
                item={supportContent}
                pageName={pageContent.pageName}
                sectionId={sectionId}
                className="text-gray-700 text-sm"
                multiline
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
} 