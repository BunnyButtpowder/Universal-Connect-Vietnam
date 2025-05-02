import { useState, useEffect } from 'react';
import { ContentItem, ContentUpdate } from '../../lib/types';
import { useContentStore } from '../../lib/contentStore';

interface ContentEditorProps {
  pageName: string;
  sectionId: string;
  item: ContentItem;
}

export function ContentEditor({ pageName, sectionId, item }: ContentEditorProps) {
  const updateContent = useContentStore(state => state.updateContent);
  const getItemById = useContentStore(state => state.getItemById);
  const [isEditing, setIsEditing] = useState(false);
  const [editedContent, setEditedContent] = useState(item.content);
  const [editedMetadata, setEditedMetadata] = useState<any>(item.metadata || {});
  const [displayContent, setDisplayContent] = useState<ContentItem>(item);

  // Refresh the display content whenever the component mounts or when the item changes
  useEffect(() => {
    setDisplayContent(item);
    setEditedContent(item.content);
    setEditedMetadata(item.metadata || {});
  }, [item]);

  const handleSave = () => {
    const update: ContentUpdate = {
      pageName,
      sectionId,
      itemId: item.id,
      content: editedContent,
      metadata: item.metadata ? editedMetadata : undefined
    };

    updateContent(update);
    setIsEditing(false);
    
    // Update the displayed content immediately after saving
    const updatedItem = getItemById(pageName, sectionId, item.id);
    if (updatedItem) {
      setDisplayContent(updatedItem);
    } else {
      // Fallback in case getItemById doesn't return the updated item yet
      setDisplayContent({
        ...item,
        content: editedContent,
        metadata: item.metadata ? editedMetadata : undefined
      });
    }
  };

  const handleCancel = () => {
    setEditedContent(item.content);
    setEditedMetadata(item.metadata || {});
    setIsEditing(false);
  };

  const renderEditor = () => {
    switch (displayContent.type) {
      case 'heading':
      case 'paragraph':
      case 'button':
        // Determine the number of rows based on content type and line count
        const lineCount = displayContent.content.split('\n').length;
        const minRows = displayContent.type === 'paragraph' ? 4 : 2;
        const rows = Math.max(minRows, lineCount);
        
        return (
          <textarea
            value={editedContent}
            onChange={(e) => setEditedContent(e.target.value)}
            className="w-full p-2 border border-gray-300 rounded-md"
            rows={rows}
          />
        );
      case 'image':
        // For images, just show a placeholder message since image upload isn't supported yet
        return (
          <div className="p-2 bg-yellow-50 border border-yellow-300 rounded-md">
            <p className="text-sm text-yellow-700">
              Image editing is currently disabled. Server-side image uploading will be implemented in a future update.
            </p>
            <p className="text-sm text-yellow-700 mt-1">
              Current image path: <span className="font-mono">{displayContent.content}</span>
            </p>
          </div>
        );
      case 'statistic':
        return (
          <div className="space-y-2">
            <div>
              <label className="block text-sm font-medium text-gray-700">Value</label>
              <input
                type="text"
                value={editedContent}
                onChange={(e) => setEditedContent(e.target.value)}
                className="w-full p-2 border border-gray-300 rounded-md"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">Title</label>
              <input
                type="text"
                value={editedMetadata.title || ''}
                onChange={(e) => setEditedMetadata({ ...editedMetadata, title: e.target.value })}
                className="w-full p-2 border border-gray-300 rounded-md"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">Subtitle</label>
              <input
                type="text"
                value={editedMetadata.subtitle || ''}
                onChange={(e) => setEditedMetadata({ ...editedMetadata, subtitle: e.target.value })}
                className="w-full p-2 border border-gray-300 rounded-md"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">Icon</label>
              <input
                type="text"
                value={editedMetadata.icon || ''}
                onChange={(e) => setEditedMetadata({ ...editedMetadata, icon: e.target.value })}
                className="w-full p-2 border border-gray-300 rounded-md"
              />
            </div>
          </div>
        );
      default:
        return <div>Unsupported content type</div>;
    }
  };

  const renderContent = () => {
    switch (displayContent.type) {
      case 'heading':
        return <h3 className="text-lg font-bold">{displayContent.content}</h3>;
      case 'paragraph':
        // Check if this is a multi-line paragraph that represents a list
        if (displayContent.content.includes('\n')) {
          const lines = displayContent.content.split('\n');
          return (
            <div>
              {lines.map((line, idx) => (
                <p key={idx} className="text-gray-700 mb-1">
                  {line.startsWith('-') ? <span>• {line.substring(2)}</span> : line}
                </p>
              ))}
            </div>
          );
        }
        return <p className="text-gray-700">{displayContent.content}</p>;
      case 'button':
        return (
          <button className="px-4 py-2 bg-blue-500 text-white rounded-md">
            {displayContent.content}
          </button>
        );
      case 'image':
        if (displayContent.metadata?.images) {
          // Multiple images (carousel)
          return (
            <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
              {displayContent.metadata.images.map((image: string, index: number) => (
                <div key={index} className="relative aspect-video bg-gray-100 rounded-md overflow-hidden">
                  <img src={image} alt={`Image ${index + 1}`} className="object-cover w-full h-full" />
                </div>
              ))}
            </div>
          );
        } else {
          // Single image
          return (
            <div className="relative aspect-video bg-gray-100 rounded-md overflow-hidden">
              <img src={displayContent.content} alt="Content image" className="object-cover w-full h-full" />
            </div>
          );
        }
      case 'statistic':
        return (
          <div className="flex items-center space-x-2">
            {displayContent.metadata?.icon && (
              <div className="w-8 h-8 flex items-center justify-center">
                {displayContent.metadata.icon.startsWith('/') ? (
                  <img src={displayContent.metadata.icon} alt="Stat icon" className="w-6 h-6" />
                ) : (
                  <span>{displayContent.metadata.icon}</span>
                )}
              </div>
            )}
            <span className="text-2xl font-bold">{displayContent.content}</span>
            <div className="flex flex-col">
              <span className="text-sm font-medium">{displayContent.metadata?.title}</span>
              <span className="text-xs text-gray-500">{displayContent.metadata?.subtitle}</span>
            </div>
          </div>
        );
      default:
        return <div>Unsupported content type</div>;
    }
  };

  // For image type items, don't provide any edit functionality
  if (displayContent.type === 'image') {
    return (
      <div className="border border-gray-200 rounded-md p-4 mb-4 bg-white">
        <div className="flex justify-between items-center mb-2">
          <div className="font-medium text-gray-700 capitalize">
            {displayContent.type}: {displayContent.id}
          </div>
          <div className="text-xs text-orange-500 bg-orange-50 p-1 rounded">
            Image upload not available
          </div>
        </div>
        <div className="mt-2">
          {renderContent()}
        </div>
      </div>
    );
  }

  return (
    <div className="border border-gray-200 rounded-md p-4 mb-4 bg-white">
      <div className="flex justify-between items-center mb-2">
        <div className="font-medium text-gray-700 capitalize">
          {displayContent.type}: {displayContent.id}
        </div>
        <div>
          {isEditing ? (
            <div className="flex space-x-2">
              <button
                onClick={handleSave}
                className="px-3 py-1 bg-green-500 text-white text-sm rounded-md cursor-pointer"
              >
                Save
              </button>
              <button
                onClick={handleCancel}
                className="px-3 py-1 bg-gray-500 text-white text-sm rounded-md cursor-pointer"
              >
                Cancel
              </button>
            </div>
          ) : (
            <button
              onClick={() => setIsEditing(true)}
              className="px-3 py-1 bg-blue-500 text-white text-sm rounded-md cursor-pointer"
            >
              Edit
            </button>
          )}
        </div>
      </div>

      <div className="mt-2">
        {isEditing ? renderEditor() : renderContent()}
      </div>
    </div>
  );
} 