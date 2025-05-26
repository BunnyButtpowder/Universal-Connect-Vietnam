import { PageContent, ContentItem } from '../../../lib/types';
import { InlineEditableField } from './InlineEditableField';
import { useContentStore } from '../../../lib/contentStore';

interface HeroBannerEditorProps {
  pageContent: PageContent;
}

export function HeroBannerEditor({ pageContent }: HeroBannerEditorProps) {
  const sectionId = 'heroBanner';
  const section = pageContent.sections[sectionId];
  const contentStore = useContentStore();
  
  // Helper function to find items by ID with fallback to content store
  const getItemById = (id: string): ContentItem | undefined => {
    // First try to find the item in the section
    const item = section.items.find(item => item.id === id);
    if (item) return item;
    
    // If not found, try to get it from the global content store
    return contentStore.getItemById('home', sectionId, id);
  };
  
  // Get hero banner content items (only main content, not tours)
  const heading = getItemById('heroBanner-heading');
  const paragraph1 = getItemById('heroBanner-paragraph1');
  const paragraph2 = getItemById('heroBanner-paragraph2');
  const paragraph3 = getItemById('heroBanner-paragraph3');
  const button = getItemById('heroBanner-button');
  
  // Create fallback content items if any are missing
  const createFallbackItem = (id: string, type: "heading" | "paragraph" | "button" | "image" | "statistic", defaultContent: string): ContentItem => ({
    id,
    type,
    content: defaultContent
  });
  
  // Apply fallbacks for main content
  const headingWithFallback = heading || createFallbackItem('heroBanner-heading', 'heading', "Explore Vietnam's Top State Schools with Us");
  const paragraph1WithFallback = paragraph1 || createFallbackItem('heroBanner-paragraph1', 'paragraph', "Welcome to UCV - we aim to bridge top schools in Vietnam and international universities. We're a unique connector - we have years of experience on both the university and the school side.");
  const paragraph2WithFallback = paragraph2 || createFallbackItem('heroBanner-paragraph2', 'paragraph', "Specializing in crafting quality school tours across Vietnam, we focus primarily on state schools (mostly Schools for gifted students).");
  const paragraph3WithFallback = paragraph3 || createFallbackItem('heroBanner-paragraph3', 'paragraph', "Join us to build partnerships, explore opportunities, and experience Vietnam's vibrant education landscape.");
  const buttonWithFallback = button || createFallbackItem('heroBanner-button', 'button', "Find out more");
  
  return (
    <div className="hero-banner-editor-container preview-container">
      <h2 className="hero-banner-editor-title text-2xl font-bold mb-4">Hero Banner Editor</h2>
      
      {/* Visual representation of Hero Banner */}
      <div className="hero-banner-preview-container border border-gray-200 rounded-lg p-4 bg-gray-50 overflow-hidden mb-6">
        <div className="hero-banner-content-wrapper flex flex-col md:flex-row gap-8">
          {/* Left Content */}
          <div className="hero-banner-left-content md:w-1/2 space-y-4 relative z-10">
            <div className="hero-banner-heading-wrapper bg-blue-50 p-4 rounded mb-2">
              <div className="hero-banner-field-label font-semibold text-gray-500 text-xs mb-1">Main Heading:</div>
              <InlineEditableField
                item={headingWithFallback}
                pageName={pageContent.pageName}
                sectionId={sectionId}
                className="hero-banner-heading-content text-3xl font-bold text-blue-900"
              />
            </div>
            
            <div className="hero-banner-paragraph1-wrapper bg-blue-50 p-4 rounded mb-2">
              <div className="hero-banner-field-label font-semibold text-gray-500 text-xs mb-1">Paragraph 1:</div>
              <InlineEditableField
                item={paragraph1WithFallback}
                pageName={pageContent.pageName}
                sectionId={sectionId}
                className="hero-banner-paragraph1-content text-gray-700"
              />
            </div>
            
            <div className="hero-banner-paragraph2-wrapper bg-blue-50 p-4 rounded mb-2">
              <div className="hero-banner-field-label font-semibold text-gray-500 text-xs mb-1">Paragraph 2:</div>
              <InlineEditableField
                item={paragraph2WithFallback}
                pageName={pageContent.pageName}
                sectionId={sectionId}
                className="hero-banner-paragraph2-content text-gray-700"
              />
            </div>
            
            <div className="hero-banner-paragraph3-wrapper bg-blue-50 p-4 rounded mb-2">
              <div className="hero-banner-field-label font-semibold text-gray-500 text-xs mb-1">Paragraph 3:</div>
              <InlineEditableField
                item={paragraph3WithFallback}
                pageName={pageContent.pageName}
                sectionId={sectionId}
                className="hero-banner-paragraph3-content text-gray-700"
              />
            </div>
            
            <div className="hero-banner-button-wrapper bg-blue-50 p-4 rounded mb-2">
              <div className="hero-banner-field-label font-semibold text-gray-500 text-xs mb-1">Button Text:</div>
              <InlineEditableField
                item={buttonWithFallback}
                pageName={pageContent.pageName}
                sectionId={sectionId}
                className="hero-banner-button-content inline-block bg-blue-500 text-white px-4 py-2 rounded-full text-sm font-medium"
              />
            </div>
          </div>
          
          {/* Right Content - Tour Cards Info */}
          <div className="hero-banner-tour-info md:w-1/2 bg-gray-100 rounded-lg p-4 overflow-hidden">
            <div className="tour-info-header mb-4">
              <h3 className="tour-info-title font-semibold text-gray-700 text-base mb-2">Tour Cards Information</h3>
              <div className="bg-yellow-50 border border-yellow-400 text-yellow-700 px-4 py-3 rounded">
                <p className="text-sm">
                  <strong>Note:</strong> Tour cards in the Hero Banner are populated from the API and cannot be edited here. 
                  To manage tours, please use the Tours Management section in the admin panel.
                </p>
              </div>
            </div>
            
            <div className="tour-preview-placeholder bg-white p-4 rounded-md shadow-sm">
              <div className="space-y-3">
                <div className="h-4 bg-gray-200 rounded animate-pulse"></div>
                <div className="h-3 bg-gray-200 rounded animate-pulse w-3/4"></div>
                <div className="h-3 bg-gray-200 rounded animate-pulse w-1/2"></div>
                <div className="flex justify-between items-center mt-4">
                  <div className="h-8 bg-blue-200 rounded-full w-24 animate-pulse"></div>
                  <div className="h-4 bg-gray-200 rounded w-16 animate-pulse"></div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
} 