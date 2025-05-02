import { PageContent, ContentItem } from '../../../lib/types';
import { InlineEditableField } from './InlineEditableField';

interface HeroBannerEditorProps {
  pageContent: PageContent;
}

export function HeroBannerEditor({ pageContent }: HeroBannerEditorProps) {
  const sectionId = 'heroBanner';
  const section = pageContent.sections[sectionId];
  
  // Helper function to find items by ID
  const getItemById = (id: string): ContentItem | undefined => {
    return section.items.find(item => item.id === id);
  };
  
  // Get hero banner content items
  const heading = getItemById('heroBanner-heading');
  const paragraph1 = getItemById('heroBanner-paragraph1');
  const paragraph2 = getItemById('heroBanner-paragraph2');
  const tourTitle = getItemById('heroBanner-tour-title');
  const tourDesc = getItemById('heroBanner-tour-desc');
  const button = getItemById('heroBanner-button');
  const carouselImages = getItemById('heroBanner-carousel-images');
  
  return (
    <div className="preview-container">
      {/* Visual representation of Hero Banner */}
      <div className="border border-gray-200 rounded-lg p-4 bg-gray-50 overflow-hidden">
        <div className="flex flex-col md:flex-row gap-8">
          {/* Left Content */}
          <div className="md:w-1/2 space-y-4 relative z-10">
            <div className="bg-blue-50 p-4 rounded mb-2">
              <div className="font-semibold text-gray-500 text-xs mb-1">Main Heading:</div>
              <InlineEditableField
                item={heading}
                pageName={pageContent.pageName}
                sectionId={sectionId}
                className="text-3xl font-bold text-blue-900"
              />
            </div>
            
            <div className="bg-blue-50 p-4 rounded mb-2">
              <div className="font-semibold text-gray-500 text-xs mb-1">Paragraph 1:</div>
              <InlineEditableField
                item={paragraph1}
                pageName={pageContent.pageName}
                sectionId={sectionId}
                className="text-gray-700"
              />
            </div>
            
            <div className="bg-blue-50 p-4 rounded mb-2">
              <div className="font-semibold text-gray-500 text-xs mb-1">Paragraph 2:</div>
              <InlineEditableField
                item={paragraph2}
                pageName={pageContent.pageName}
                sectionId={sectionId}
                className="text-gray-700"
              />
            </div>
            
            <div className="bg-blue-50 p-4 rounded mb-2">
              <div className="font-semibold text-gray-500 text-xs mb-1">Tour Title:</div>
              <InlineEditableField
                item={tourTitle}
                pageName={pageContent.pageName}
                sectionId={sectionId}
                className="text-xl font-semibold text-blue-700"
              />
            </div>
            
            <div className="bg-blue-50 p-4 rounded mb-2">
              <div className="font-semibold text-gray-500 text-xs mb-1">Tour Description:</div>
              <InlineEditableField
                item={tourDesc}
                pageName={pageContent.pageName}
                sectionId={sectionId}
                className="text-gray-700"
              />
            </div>
            
            <div className="bg-blue-50 p-4 rounded mb-2">
              <div className="font-semibold text-gray-500 text-xs mb-1">Button Text:</div>
              <InlineEditableField
                item={button}
                pageName={pageContent.pageName}
                sectionId={sectionId}
                className="inline-block bg-blue-500 text-white px-4 py-2 rounded-full text-sm font-medium"
              />
            </div>
          </div>
          
          {/* Right Content - Image Carousel (Preview Only) */}
          <div className="md:w-1/2 bg-gray-100 rounded-lg flex items-center justify-center p-4 h-80 overflow-hidden">
            <div className="text-center">
              <div className="font-semibold text-gray-500 text-xs mb-2">Carousel Images Preview:</div>
              {carouselImages?.metadata?.images && (
                <div className="grid grid-cols-3 gap-2">
                  {carouselImages.metadata.images.map((image: string, index: number) => (
                    <div key={index} className="aspect-video bg-white p-1 rounded">
                      <img 
                        src={image} 
                        alt={`Carousel image ${index + 1}`} 
                        className="w-full h-full object-cover rounded"
                      />
                    </div>
                  ))}
                </div>
              )}
              <div className="mt-2 text-xs text-orange-500">Image editing is currently disabled</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
} 