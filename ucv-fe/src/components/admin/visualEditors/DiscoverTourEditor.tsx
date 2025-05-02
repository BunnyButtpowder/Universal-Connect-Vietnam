import { PageContent, ContentItem } from '../../../lib/types';
import { InlineEditableField } from './InlineEditableField';
import { TourCardEditor } from './TourCardEditor';

interface DiscoverTourEditorProps {
  pageContent: PageContent;
}

export function DiscoverTourEditor({ pageContent }: DiscoverTourEditorProps) {
  const sectionId = 'discoverTour';
  const section = pageContent.sections[sectionId];
  
  // Helper function to find items by ID
  const getItemById = (id: string): ContentItem | undefined => {
    return section.items.find(item => item.id === id);
  };
  
  // Get main content
  const heading = getItemById('discoverTour-heading');
  const title = getItemById('discoverTour-title');
  const description = getItemById('discoverTour-description');
  const button = getItemById('discoverTour-button');
  
  // Card 1 content
  const card1Date = getItemById('discoverTour-card1-date');
  const card1Title = getItemById('discoverTour-card1-title');
  const card1Description = getItemById('discoverTour-card1-description');
  const card1Button = getItemById('discoverTour-card1-button');
  const card1Price = getItemById('discoverTour-card1-price');
  
  // Card 2 content
  const card2Date = getItemById('discoverTour-card2-date');
  const card2Title = getItemById('discoverTour-card2-title');
  const card2Description = getItemById('discoverTour-card2-description');
  const card2Button = getItemById('discoverTour-card2-button');
  const card2Price = getItemById('discoverTour-card2-price');
  
  // Card 3 content
  const card3Date = getItemById('discoverTour-card3-date');
  const card3Title = getItemById('discoverTour-card3-title');
  const card3Description = getItemById('discoverTour-card3-description');
  const card3Button = getItemById('discoverTour-card3-button');
  const card3Price = getItemById('discoverTour-card3-price');
  
  return (
    <div className="preview-container space-y-8">
      {/* Main Content */}
      <div className="border border-gray-200 rounded-lg p-4 bg-blue-50">
        <h3 className="font-semibold text-gray-700 mb-4">Main Content</h3>
        
        <div className="grid grid-cols-1 lg:grid-cols-6 gap-4">
          <div className="lg:col-span-1 space-y-4">
            <div className="bg-white p-4 rounded">
              <div className="font-semibold text-gray-500 text-xs mb-1">Section Heading:</div>
              <InlineEditableField
                item={heading}
                pageName={pageContent.pageName}
                sectionId={sectionId}
                className="text-lg font-bold text-blue-900"
              />
            </div>
          </div>
          
          <div className="lg:col-span-1"></div>
          
          <div className="lg:col-span-4 space-y-4">
            <div className="bg-white p-4 rounded">
              <div className="font-semibold text-gray-500 text-xs mb-1">Main Title:</div>
              <InlineEditableField
                item={title}
                pageName={pageContent.pageName}
                sectionId={sectionId}
                className="text-xl font-semibold text-blue-700"
                multiline
              />
            </div>
            
            <div className="bg-white p-4 rounded">
              <div className="font-semibold text-gray-500 text-xs mb-1">Description:</div>
              <InlineEditableField
                item={description}
                pageName={pageContent.pageName}
                sectionId={sectionId}
                className="text-gray-700"
                multiline
              />
            </div>
            
            <div className="bg-white p-4 rounded">
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
      
      {/* Tour Cards */}
      <div className="border border-gray-200 rounded-lg p-4 bg-gray-50">
        <h3 className="font-semibold text-gray-700 mb-4">Tour Cards</h3>
        
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
          {/* Card 1 */}
          <TourCardEditor
            dateItem={card1Date}
            titleItem={card1Title}
            descriptionItem={card1Description}
            buttonItem={card1Button}
            priceItem={card1Price}
            cardNumber={1}
            imageSrc="/hero-banner-1.png"
            pageName={pageContent.pageName}
            sectionId={sectionId}
          />
          
          {/* Card 2 */}
          <TourCardEditor
            dateItem={card2Date}
            titleItem={card2Title}
            descriptionItem={card2Description}
            buttonItem={card2Button}
            priceItem={card2Price}
            cardNumber={2}
            imageSrc="/hero-banner-2.png"
            pageName={pageContent.pageName}
            sectionId={sectionId}
          />
          
          {/* Card 3 */}
          <TourCardEditor
            dateItem={card3Date}
            titleItem={card3Title}
            descriptionItem={card3Description}
            buttonItem={card3Button}
            priceItem={card3Price}
            cardNumber={3}
            imageSrc="/hero-banner-3.png"
            pageName={pageContent.pageName}
            sectionId={sectionId}
          />
        </div>
      </div>
    </div>
  );
} 