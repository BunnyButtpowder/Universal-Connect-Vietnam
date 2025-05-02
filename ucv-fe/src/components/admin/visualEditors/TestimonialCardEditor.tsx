import { useState } from 'react';
import { ContentItem } from '../../../lib/types';
import { InlineEditableField } from './InlineEditableField';

interface TestimonialCardEditorProps {
  contentItem: ContentItem | undefined;
  universityItem: ContentItem | undefined;
  subtitleItem: ContentItem | undefined;
  cardNumber: number;
  pageName: string;
  sectionId: string;
}

export function TestimonialCardEditor({
  contentItem,
  universityItem,
  subtitleItem,
  cardNumber,
  pageName,
  sectionId
}: TestimonialCardEditorProps) {
  const [isExpanded, setIsExpanded] = useState(false);
  
  // Compact view when not expanded
  if (!isExpanded) {
    return (
      <div 
        className="bg-blue-50 hover:bg-blue-950 group cursor-pointer transition-all duration-300 rounded-lg shadow-sm p-4"
        onClick={() => setIsExpanded(true)}
      >
        <p className="text-blue-950 group-hover:text-white transition-all duration-300 font-medium text-xs line-clamp-3 mb-4">
          {contentItem?.content || `Testimonial ${cardNumber} content...`}
        </p>
        <div className="border-t-2 border-blue-300 group-hover:border-white/10 pt-3"></div>
        <div className="flex items-center gap-2">
          <div className="bg-blue-50 group-hover:bg-blue-950 transition-all duration-300 p-2 rounded">
            <img src="/testimonial-icon.svg" alt="Testimonial icon" className="w-4 h-4" />
          </div>
          <div>
            <h4 className="text-blue-500 group-hover:text-white transition-all duration-300 font-medium text-xs">
              {universityItem?.content || `University ${cardNumber}`}
            </h4>
            <p className="text-blue-300 group-hover:text-white/70 transition-all duration-300 text-xs">
              {subtitleItem?.content || 'Title'}
            </p>
          </div>
        </div>
        <div className="mt-2 text-xs text-blue-500 group-hover:text-white">Click to edit</div>
      </div>
    );
  }
  
  // Expanded edit view
  return (
    <div className="bg-white rounded-lg border border-blue-200 shadow-md overflow-hidden">
      <div className="p-4 bg-blue-100 flex justify-between items-center">
        <h3 className="font-semibold text-blue-800">Editing Testimonial {cardNumber}</h3>
        <button
          onClick={() => setIsExpanded(false)}
          className="text-xs bg-blue-500 text-white px-3 py-1 rounded hover:bg-blue-600"
        >
          Done
        </button>
      </div>
      
      <div className="p-4 space-y-4">
        <div className="bg-blue-50 p-3 rounded">
          <div className="font-semibold text-gray-500 text-xs mb-1">Testimonial Content:</div>
          {contentItem && (
            <InlineEditableField
              item={contentItem}
              pageName={pageName}
              sectionId={sectionId}
              className="text-blue-950 font-medium text-sm"
              multiline
            />
          )}
        </div>
        
        <div className="bg-blue-50 p-3 rounded">
          <div className="font-semibold text-gray-500 text-xs mb-1">University/Organization:</div>
          {universityItem && (
            <InlineEditableField
              item={universityItem}
              pageName={pageName}
              sectionId={sectionId}
              className="text-blue-700 font-medium"
            />
          )}
        </div>
        
        <div className="bg-blue-50 p-3 rounded">
          <div className="font-semibold text-gray-500 text-xs mb-1">Subtitle/Title:</div>
          {subtitleItem && (
            <InlineEditableField
              item={subtitleItem}
              pageName={pageName}
              sectionId={sectionId}
              className="text-blue-600"
            />
          )}
        </div>
      </div>
    </div>
  );
} 