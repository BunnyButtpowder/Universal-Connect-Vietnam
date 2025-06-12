import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useContentStore } from '@/lib/contentStore';
import { ContentItem } from '@/lib/types';
import { translationApi } from '@/lib/translationApi';
import { toast } from 'sonner';
import { Globe, Save, Wand2 } from 'lucide-react';

interface TranslationEditorProps {
  item: ContentItem;
  pageName: string;
  sectionId: string;
}

export function TranslationEditor({ item }: TranslationEditorProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [vietnameseContent, setVietnameseContent] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isAutoTranslating, setIsAutoTranslating] = useState(false);

  const getTranslatedContent = useContentStore(state => state.getTranslatedContent);
  const updateTranslation = useContentStore(state => state.updateTranslation);

  // Load existing Vietnamese translation when dialog opens
  useEffect(() => {
    if (isOpen) {
      const existingTranslation = getTranslatedContent(item.id, 'vi');
      setVietnameseContent(existingTranslation);
    }
  }, [isOpen, item.id, getTranslatedContent]);

  const handleSave = async () => {
    setIsLoading(true);
    try {
      // Save to database via API
      await translationApi.updateTranslation({
        id: item.id,
        language: 'vi',
        content: vietnameseContent
      });

      // Update in local store
      updateTranslation(item.id, 'vi', vietnameseContent);

      toast.success('Translation saved to database successfully');
      setIsOpen(false);
    } catch (error) {
      console.error('Error saving translation:', error);
      toast.error('Failed to save translation to database');
    } finally {
      setIsLoading(false);
    }
  };

  const handleAutoTranslate = async () => {
    setIsAutoTranslating(true);
    try {
      // Use the real auto-translation API with Google Translate
      const response = await fetch('https://api.ucv.com.vn/translations/auto-translate', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          text: item.content,
          from: 'en',
          to: 'vi',
        }),
      });

      if (!response.ok) {
        throw new Error(`Translation failed: ${response.statusText}`);
      }

      const result = await response.json();
      setVietnameseContent(result.translatedText);
      
      // Show different success messages based on provider
      const successMessage = result.provider === 'google' 
        ? 'Auto-translation completed (powered by Google Translate)'
        : result.provider === 'fallback'
        ? 'Auto-translation completed (using smart fallback)'
        : 'Auto-translation completed';
        
      toast.success(successMessage);
    } catch (error) {
      console.error('Error auto-translating:', error);
      
      // Final fallback if API is completely unavailable
      const localFallbacks: Record<string, string> = {
        'About Us': 'Về chúng tôi',
        'Our Tours': 'Tours của chúng tôi',
        'Contact': 'Liên hệ',
        'Home': 'Trang chủ',
        'Read More': 'Đọc thêm',
        'Learn More': 'Tìm hiểu thêm',
        'Get Started': 'Bắt đầu',
        'Sign Up': 'Đăng ký',
        'Submit': 'Gửi',
        'Cancel': 'Hủy',
        'Save': 'Lưu',
        'Edit': 'Chỉnh sửa',
        'Delete': 'Xóa',
      };

      const autoTranslated = localFallbacks[item.content] || `[Tự động dịch] ${item.content}`;
      setVietnameseContent(autoTranslated);
      toast.warning('Auto-translation completed (using local fallback)');
    } finally {
      setIsAutoTranslating(false);
    }
  };

  const isTextArea = item.type === 'paragraph' || item.content.length > 100;

  if (!isOpen) {
    return (
      <Button 
        variant="outline" 
        size="sm" 
        className="h-8"
        onClick={() => setIsOpen(true)}
      >
        <Globe className="h-3 w-3 mr-1" />
        Translate
      </Button>
    );
  }

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg p-6 w-full max-w-2xl mx-4">
        <div className="flex items-center gap-2 mb-4">
          <Globe className="h-5 w-5" />
          <h2 className="text-lg font-semibold">Translation Editor</h2>
        </div>
        
        <div className="space-y-4">
          {/* Original English Content */}
          <div>
            <Label className="text-sm font-medium text-gray-700">
              Original (English)
            </Label>
            <div className="mt-1 p-3 bg-gray-50 rounded-md border">
              <p className="text-sm text-gray-900">{item.content}</p>
            </div>
          </div>

          {/* Vietnamese Translation */}
          <div>
            <div className="flex items-center justify-between">
              <Label htmlFor="vietnamese-content" className="text-sm font-medium text-gray-700">
                Vietnamese Translation
              </Label>
              <Button
                variant="outline"
                size="sm"
                onClick={handleAutoTranslate}
                disabled={isAutoTranslating}
                className="h-8"
              >
                <Wand2 className="h-3 w-3 mr-1" />
                {isAutoTranslating ? 'Translating...' : 'Auto Translate'}
              </Button>
            </div>
            
            {isTextArea ? (
              <textarea
                id="vietnamese-content"
                value={vietnameseContent}
                onChange={(e: React.ChangeEvent<HTMLTextAreaElement>) => setVietnameseContent(e.target.value)}
                placeholder="Enter Vietnamese translation..."
                className="mt-1 w-full min-h-[100px] p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            ) : (
              <Input
                id="vietnamese-content"
                value={vietnameseContent}
                onChange={(e: React.ChangeEvent<HTMLInputElement>) => setVietnameseContent(e.target.value)}
                placeholder="Enter Vietnamese translation..."
                className="mt-1"
              />
            )}
          </div>

          {/* Action Buttons */}
          <div className="flex justify-end gap-2 pt-4">
            <Button variant="outline" onClick={() => setIsOpen(false)}>
              Cancel
            </Button>
            <Button onClick={handleSave} disabled={isLoading}>
              <Save className="h-4 w-4 mr-1" />
              {isLoading ? 'Saving...' : 'Save Translation'}
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
} 