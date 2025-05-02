import { useState } from 'react';
import { ContentItem } from '../../../lib/types';
import { InlineEditableField } from './InlineEditableField';
import { ArrowRight } from 'lucide-react';

interface TourCardEditorProps {
  dateItem: ContentItem | undefined;
  titleItem: ContentItem | undefined;
  descriptionItem: ContentItem | undefined;
  buttonItem: ContentItem | undefined;
  priceItem: ContentItem | undefined;
  cardNumber: number;
  imageSrc: string;
  pageName: string;
  sectionId: string;
}

export function TourCardEditor({
  dateItem,
  titleItem,
  descriptionItem,
  buttonItem,
  priceItem,
  cardNumber,
  imageSrc,
  pageName,
  sectionId
}: TourCardEditorProps) {
  const [isExpanded, setIsExpanded] = useState(false);
  
  // Compact view when not expanded
  if (!isExpanded) {
    return (
      <div 
        className="bg-white rounded-lg overflow-hidden shadow-sm cursor-pointer hover:shadow-md transition-shadow"
        onClick={() => setIsExpanded(true)}
      >
        <div className="h-40 bg-gray-100 relative">
          <img src={imageSrc} alt={`Tour card ${cardNumber}`} className="w-full h-full object-cover" />
          <div className="absolute top-3 left-3 bg-white rounded-md px-2 py-1">
            <span className="text-xs font-bold text-gray-800">
              {dateItem?.content || `CARD ${cardNumber}`}
            </span>
          </div>
        </div>
        <div className="p-4">
          <h3 className="font-bold text-base text-gray-800">
            {titleItem?.content || `Tour Card ${cardNumber}`}
          </h3>
          <p className="text-xs text-gray-500 line-clamp-2 mt-1">
            {descriptionItem?.content || 'Description'}
          </p>
          <div className="mt-3 text-xs text-blue-500">Click to edit this card</div>
        </div>
      </div>
    );
  }
  
  // Expanded edit view
  return (
    <div className="bg-blue-50 rounded-lg overflow-hidden border border-blue-200 shadow-md">
      <div className="p-4 bg-blue-100 flex justify-between items-center">
        <h3 className="font-semibold text-blue-800">Editing Tour Card {cardNumber}</h3>
        <button
          onClick={() => setIsExpanded(false)}
          className="text-xs bg-blue-500 text-white px-3 py-1 rounded hover:bg-blue-600"
        >
          Done
        </button>
      </div>
      
      <div className="p-4 space-y-4">
        <div className="relative h-40 bg-gray-100 rounded overflow-hidden">
          <img src={imageSrc} alt={`Tour card ${cardNumber}`} className="w-full h-full object-cover" />
          <div className="absolute top-0 left-0 right-0 bg-white/80 p-2">
            <div className="font-semibold text-gray-500 text-xs mb-1">Date/Label:</div>
            {dateItem && (
              <InlineEditableField
                item={dateItem}
                pageName={pageName}
                sectionId={sectionId}
                className="font-bold text-xs text-gray-800"
              />
            )}
          </div>
        </div>
        
        <div className="bg-white p-3 rounded">
          <div className="font-semibold text-gray-500 text-xs mb-1">Title:</div>
          {titleItem && (
            <InlineEditableField
              item={titleItem}
              pageName={pageName}
              sectionId={sectionId}
              className="font-bold text-base text-gray-800"
            />
          )}
        </div>
        
        <div className="bg-white p-3 rounded">
          <div className="font-semibold text-gray-500 text-xs mb-1">Description:</div>
          {descriptionItem && (
            <InlineEditableField
              item={descriptionItem}
              pageName={pageName}
              sectionId={sectionId}
              className="text-xs text-gray-600"
              multiline
            />
          )}
        </div>
        
        <div className="flex lg:flex-row flex-col justify-between items-start lg:items-center gap-4">
          <div className="bg-white p-3 rounded w-full lg:w-auto">
            <div className="font-semibold text-gray-500 text-xs mb-1">Button Text:</div>
            {buttonItem && (
              <div className="flex items-center justify-between px-2 py-1 bg-blue-500 text-white text-xs rounded-full">
                <div className="bg-white rounded-full p-1 flex items-center justify-center mr-2">
                  <ArrowRight className="h-3 w-3 text-blue-500" />
                </div>
                <InlineEditableField
                  item={buttonItem}
                  pageName={pageName}
                  sectionId={sectionId}
                  className="flex-1 text-center text-white"
                />
              </div>
            )}
          </div>
          
          <div className="bg-white p-3 rounded w-full lg:w-auto">
            <div className="font-semibold text-gray-500 text-xs mb-1">Price:</div>
            <div className="flex items-center space-x-1">
              <span className="text-xs">Start from</span>
              {priceItem && (
                <InlineEditableField
                  item={priceItem}
                  pageName={pageName}
                  sectionId={sectionId}
                  className="font-bold text-gray-800"
                />
              )}
              <span className="text-xs text-gray-500">USD</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
} 