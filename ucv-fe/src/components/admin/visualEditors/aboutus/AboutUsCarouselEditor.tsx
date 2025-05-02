import { PageContent, ContentItem } from '../../../../lib/types';
import { InlineEditableField } from '../InlineEditableField';

interface AboutUsCarouselEditorProps {
  pageContent: PageContent;
}

export function AboutUsCarouselEditor({ pageContent }: AboutUsCarouselEditorProps) {
  const sectionId = 'carouselSection';
  const section = pageContent.sections[sectionId];
  
  // Helper function to find items by ID
  const getItemById = (id: string): ContentItem | undefined => {
    return section.items.find(item => item.id === id);
  };
  
  // Get content items
  const image1 = getItemById('carousel-image1');
  const image2 = getItemById('carousel-image2');
  const image3 = getItemById('carousel-image3');
  const button = getItemById('carousel-button');
  
  return (
    <div className="preview-container space-y-8">
      <div className="border border-gray-200 rounded-lg p-4 bg-gray-50">
        <h3 className="font-semibold text-gray-700 mb-4">Image Carousel</h3>
        
        {/* Button Text */}
        <div className="bg-blue-50 p-4 rounded mb-6">
          <div className="font-semibold text-gray-500 text-xs mb-1">Portfolio Button Text:</div>
          {button && (
            <InlineEditableField
              item={button}
              pageName={pageContent.pageName}
              sectionId={sectionId}
              className="inline-block bg-blue-500 text-white px-4 py-2 rounded-md text-sm font-medium cursor-pointer"
            />
          )}
        </div>
        
        {/* Carousel Images */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {/* Image 1 */}
          <div className="bg-white p-4 rounded-lg border border-gray-200">
            <div className="font-semibold text-gray-500 text-xs mb-2">Carousel Image 1:</div>
            {image1 && (
              <div className="text-center">
                <img 
                  src={image1.content} 
                  alt="Carousel 1" 
                  className="h-40 object-cover mx-auto rounded"
                />
                <div className="mt-2 text-xs text-gray-500">
                  Image path: {image1.content}
                </div>
                <div className="mt-2 text-xs text-orange-500">
                  Image editing is currently disabled
                </div>
              </div>
            )}
          </div>
          
          {/* Image 2 */}
          <div className="bg-white p-4 rounded-lg border border-gray-200">
            <div className="font-semibold text-gray-500 text-xs mb-2">Carousel Image 2:</div>
            {image2 && (
              <div className="text-center">
                <img 
                  src={image2.content} 
                  alt="Carousel 2" 
                  className="h-40 object-cover mx-auto rounded"
                />
                <div className="mt-2 text-xs text-gray-500">
                  Image path: {image2.content}
                </div>
                <div className="mt-2 text-xs text-orange-500">
                  Image editing is currently disabled
                </div>
              </div>
            )}
          </div>
          
          {/* Image 3 */}
          <div className="bg-white p-4 rounded-lg border border-gray-200">
            <div className="font-semibold text-gray-500 text-xs mb-2">Carousel Image 3:</div>
            {image3 && (
              <div className="text-center">
                <img 
                  src={image3.content} 
                  alt="Carousel 3" 
                  className="h-40 object-cover mx-auto rounded"
                />
                <div className="mt-2 text-xs text-gray-500">
                  Image path: {image3.content}
                </div>
                <div className="mt-2 text-xs text-orange-500">
                  Image editing is currently disabled
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
} 