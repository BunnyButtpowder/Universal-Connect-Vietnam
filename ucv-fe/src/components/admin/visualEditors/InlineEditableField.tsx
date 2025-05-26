import { useState, useEffect, useRef } from 'react';
import { ContentItem, ContentUpdate } from '../../../lib/types';
import { useContentStore } from '../../../lib/contentStore';

interface InlineEditableFieldProps {
  item: ContentItem | undefined;
  pageName: string;
  sectionId: string;
  className?: string;
  multiline?: boolean;
  itemId?: string;
  defaultContent?: string;
}

export function InlineEditableField({ 
  item, 
  pageName, 
  sectionId, 
  className = '', 
  multiline = false,
  itemId,
  defaultContent = 'Click to add content'
}: InlineEditableFieldProps) {
  const [isEditing, setIsEditing] = useState(false);
  const [content, setContent] = useState(item?.content || defaultContent);
  const textAreaRef = useRef<HTMLTextAreaElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const updateContent = useContentStore(state => state.updateContent);
  
  // Update local content when item changes
  useEffect(() => {
    if (item) {
      setContent(item.content);
    } else {
      setContent(defaultContent);
    }
  }, [item, defaultContent]);
  
  // Focus input when entering edit mode
  useEffect(() => {
    if (isEditing) {
      if (multiline && textAreaRef.current) {
        textAreaRef.current.focus();
      } else if (inputRef.current) {
        inputRef.current.focus();
      }
    }
  }, [isEditing, multiline]);
  
  const handleSave = () => {
    const update: ContentUpdate = {
      pageName,
      sectionId,
      itemId: item?.id || itemId || 'unknown',
      content,
      metadata: item?.metadata
    };
    
    updateContent(update);
    setIsEditing(false);
  };
  
  const handleCancel = () => {
    setContent(item?.content || defaultContent);
    setIsEditing(false);
  };
  
  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey && !multiline) {
      handleSave();
    } else if (e.key === 'Escape') {
      handleCancel();
    }
  };

  // Show a different style for missing items
  const isMissing = !item;
  const displayContent = content || defaultContent;
  
  if (isEditing) {
    return (
      <div className="inline-edit-container">
        {multiline ? (
          <textarea
            ref={textAreaRef}
            value={content}
            onChange={(e) => setContent(e.target.value)}
            onKeyDown={handleKeyDown}
            className="w-full p-2 border border-blue-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500 min-h-[80px]"
            autoFocus
          />
        ) : (
          <input
            ref={inputRef}
            type="text"
            value={content}
            onChange={(e) => setContent(e.target.value)}
            onKeyDown={handleKeyDown}
            className="w-full p-2 border border-blue-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
            autoFocus
          />
        )}
        <div className="flex space-x-2 mt-2">
          <button
            onClick={handleSave}
            className="px-3 py-1 bg-green-500 text-white text-xs rounded hover:bg-green-600"
          >
            Save
          </button>
          <button
            onClick={handleCancel}
            className="px-3 py-1 bg-gray-300 text-gray-700 text-xs rounded hover:bg-gray-400"
          >
            Cancel
          </button>
        </div>
      </div>
    );
  }
  
  return (
    <div 
      onClick={() => setIsEditing(true)}
      className={`cursor-pointer hover:bg-blue-100 transition-colors px-2 py-1 rounded ${className} ${isMissing ? 'border border-dashed border-orange-300 bg-orange-50' : ''}`}
    >
      <span className={isMissing ? 'text-orange-600 italic' : ''}>{displayContent}</span>
      {isMissing && <span className="ml-2 text-orange-500 text-xs">(Missing - click to create)</span>}
      {!isMissing && <span className="ml-2 text-blue-500 opacity-0 group-hover:opacity-100 text-xs">(Click to edit)</span>}
    </div>
  );
} 