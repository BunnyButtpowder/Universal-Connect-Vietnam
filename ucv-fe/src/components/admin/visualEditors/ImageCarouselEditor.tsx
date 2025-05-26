import { PageContent, ContentItem } from '../../../lib/types';
import { ImageEditor } from '../ImageEditor';
import { useContentStore } from '../../../lib/contentStore';

interface ImageCarouselEditorProps {
  pageContent: PageContent;
}

export function ImageCarouselEditor({ pageContent }: ImageCarouselEditorProps) {
  const sectionId = 'imageCarousel';
  const getItemById = useContentStore(state => state.getItemById);
  const fetchContent = useContentStore(state => state.fetchContent);
  
  // First try to get section from pageContent, then fallback to content store
  const section = pageContent.sections[sectionId];
  
  // Helper function to find items by ID with fallback to content store
  const getCarouselItemById = (id: string): ContentItem | undefined => {
    // First try from the section in pageContent
    if (section?.items) {
      const item = section.items.find(item => item.id === id);
      if (item) return item;
    }
    
    // Fallback to content store
    return getItemById('home', sectionId, id);
  };
  
  // Create default carousel images if they don't exist
  const createDefaultCarouselImages = (): { id: number; item: ContentItem }[] => {
    const defaultImages = [
      { src: '/display1.png', alt: 'Students at an event' },
      { src: '/display2.png', alt: 'Academic conference' },
      { src: '/display3.jpg', alt: 'Classroom session' },
      { src: '/display5.jpg', alt: 'Classroom session' },
      { src: '/display6.jpg', alt: 'Classroom session' },
      { src: '/display7.jpg', alt: 'Classroom session' },
      { src: '/display8.jpg', alt: 'Classroom session' },
      { src: '/display9.jpg', alt: 'Classroom session' },
      { src: '/display4.png', alt: 'Students collaborating' },
      { src: '/university-event.png', alt: 'School exhibition' },
    ];
    
    return defaultImages.map((img, index) => ({
      id: index + 1,
      item: {
        id: `carousel-image-${index + 1}`,
        type: 'image' as const,
        content: img.src,
        metadata: { alt: img.alt }
      }
    }));
  };
  
  // Get all carousel images
  let carouselImages = [];
  for (let i = 1; i <= 10; i++) {
    const image = getCarouselItemById(`carousel-image-${i}`);
    if (image) {
      carouselImages.push({ id: i, item: image });
    }
  }
  
  // If no images found, use default ones
  if (carouselImages.length === 0) {
    carouselImages = createDefaultCarouselImages();
  }
  
  // Debug information
  console.log('ImageCarouselEditor Debug:', {
    pageName: pageContent.pageName,
    sectionExists: !!section,
    sectionItemsCount: section?.items?.length || 0,
    carouselImagesFound: carouselImages.length,
    availableSections: Object.keys(pageContent.sections)
  });
  
  const handleRefreshContent = () => {
    fetchContent();
  };
  
  return (
    <div className="preview-container space-y-8 mt-5">
      <div className="border border-gray-200 rounded-lg p-4 bg-gray-50">
        <div className="flex justify-between items-center mb-4">
          <h3 className="font-semibold text-gray-700">Image Carousel</h3>
          <button
            onClick={handleRefreshContent}
            className="px-3 py-1 bg-blue-500 text-white rounded text-sm hover:bg-blue-600"
          >
            Refresh Content
          </button>
        </div>
        <p className="text-sm text-gray-600 mb-6">
          Manage the 10 images that appear in the rotating carousel on the home page. These images showcase various educational events and activities.
        </p>
        
        {/* Carousel Images Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
          {carouselImages.map(({ id, item }) => (
            <div key={id} className="bg-white p-4 rounded-lg border border-gray-200">
              <div className="font-semibold text-gray-500 text-xs mb-2">
                Carousel Image {id}:
              </div>
              <ImageEditor
                item={item}
                pageName="home"
                sectionId={sectionId}
                className="w-full"
                label={`Change Image ${id}`}
                imageClassName="h-32 object-cover mx-auto rounded"
              />
            </div>
          ))}
        </div>
        
        {carouselImages.length === 0 && (
          <div className="text-center py-8">
            <p className="text-gray-500">No carousel images found and fallback failed.</p>
            <p className="text-sm text-gray-400 mt-2">
              Please check the content store configuration.
            </p>
            <p className="text-xs text-gray-400 mt-2">
              Available sections: {Object.keys(pageContent.sections).join(', ')}
            </p>
          </div>
        )}
      </div>
    </div>
  );
} 