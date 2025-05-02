import { useState } from 'react';
import { ContentItem, ContentUpdate } from '../../../lib/types';
import { useContentStore } from '../../../lib/contentStore';
import { School } from 'lucide-react';

interface StatisticsEditorProps {
  item: ContentItem;
  pageName: string;
  sectionId: string;
}

export function StatisticsEditor({ item, pageName, sectionId }: StatisticsEditorProps) {
  const [isEditing, setIsEditing] = useState(false);
  const [value, setValue] = useState(item.content);
  const [title, setTitle] = useState(item.metadata?.title || '');
  const [subtitle, setSubtitle] = useState(item.metadata?.subtitle || '');
  const updateContent = useContentStore(state => state.updateContent);
  
  const handleSave = () => {
    const update: ContentUpdate = {
      pageName,
      sectionId,
      itemId: item.id,
      content: value,
      metadata: {
        ...item.metadata,
        title,
        subtitle
      }
    };
    
    updateContent(update);
    setIsEditing(false);
  };
  
  const handleCancel = () => {
    setValue(item.content);
    setTitle(item.metadata?.title || '');
    setSubtitle(item.metadata?.subtitle || '');
    setIsEditing(false);
  };
  
  // Render the statistic in a visually appealing format
  if (!isEditing) {
    return (
      <div 
        className="bg-white p-4 rounded-lg border border-gray-200 hover:border-blue-300 transition-colors cursor-pointer"
        onClick={() => setIsEditing(true)}
      >
        <div className="flex items-center space-x-3">
          {item.metadata?.icon === 'School' ? (
            <School className="text-blue-500 w-7 h-7" />
          ) : (
            <div className="w-7 h-7 bg-blue-100 rounded-full flex items-center justify-center">
              <span className="text-blue-500 font-semibold">{value.charAt(0)}</span>
            </div>
          )}
          
          <span className="text-2xl font-bold text-gray-800">{value}</span>
          
          <div className="flex flex-col">
            <span className="text-sm font-medium text-gray-700">{title}</span>
            <span className="text-xs text-gray-500">{subtitle}</span>
          </div>
        </div>
        <div className="mt-2 text-xs text-blue-500">Click to edit</div>
      </div>
    );
  }
  
  // Edit mode
  return (
    <div className="bg-blue-50 p-4 rounded-lg border border-blue-200">
      <h4 className="font-medium text-gray-700 mb-3">Edit Statistic</h4>
      
      <div className="space-y-3">
        <div>
          <label className="block text-xs font-medium text-gray-700 mb-1">Value:</label>
          <input
            type="text"
            value={value}
            onChange={(e) => setValue(e.target.value)}
            className="w-full p-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>
        
        <div>
          <label className="block text-xs font-medium text-gray-700 mb-1">Title:</label>
          <input
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            className="w-full p-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>
        
        <div>
          <label className="block text-xs font-medium text-gray-700 mb-1">Subtitle:</label>
          <input
            type="text"
            value={subtitle}
            onChange={(e) => setSubtitle(e.target.value)}
            className="w-full p-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>
        
        <div className="flex space-x-2 mt-4">
          <button
            onClick={handleSave}
            className="px-3 py-1 bg-green-500 text-white text-sm rounded hover:bg-green-600"
          >
            Save
          </button>
          <button
            onClick={handleCancel}
            className="px-3 py-1 bg-gray-300 text-gray-700 text-sm rounded hover:bg-gray-400"
          >
            Cancel
          </button>
        </div>
      </div>
    </div>
  );
} 