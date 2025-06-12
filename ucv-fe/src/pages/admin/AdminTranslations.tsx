import { useState, useEffect } from 'react';
import { AdminNavbar } from '../../components/admin/AdminNavbar';
import { translationApi } from '../../lib/translationApi';
import { useContentStore } from '../../lib/contentStore';
import { TranslationEditor } from '../../components/admin/TranslationEditor';
import { ContentItem } from '../../lib/types';
import { toast } from 'sonner';
import { Globe, Search, Filter, Languages, CheckCircle, AlertCircle, Loader2 } from 'lucide-react';

interface TranslationStatus {
  item: ContentItem;
  pageName: string;
  sectionId: string;
  hasVietnamese: boolean;
  vietnameseContent?: string;
}

export default function AdminTranslations() {
  const [translationStatuses, setTranslationStatuses] = useState<TranslationStatus[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState<'all' | 'translated' | 'untranslated'>('all');
  const [selectedPage, setSelectedPage] = useState<string>('all');
  const [serviceStatus, setServiceStatus] = useState<any>(null);
  
  const { pages, getTranslatedContent } = useContentStore();

  useEffect(() => {
    fetchTranslationStatuses();
    fetchServiceStatus();
  }, [pages]);

  const fetchServiceStatus = async () => {
    try {
      const status = await translationApi.getServiceStatus();
      setServiceStatus(status);
    } catch (error) {
      console.error('Error fetching service status:', error);
    }
  };

  const fetchTranslationStatuses = async () => {
    setIsLoading(true);
    try {
      const statuses: TranslationStatus[] = [];
      
      // Loop through all pages to check translation status
      pages.forEach((pageContent) => {
        if (pageContent && pageContent.sections) {
          Object.entries(pageContent.sections).forEach(([sectionId, section]) => {
            section.items.forEach((item) => {
              // Skip images for translation
              if (item.type !== 'image') {
                const vietnameseContent = getTranslatedContent(item.id, 'vi');
                const hasVietnamese = vietnameseContent !== item.content && vietnameseContent.trim() !== '';
                
                statuses.push({
                  item,
                  pageName: pageContent.pageName,
                  sectionId,
                  hasVietnamese,
                  vietnameseContent: hasVietnamese ? vietnameseContent : undefined
                });
              }
            });
          });
        }
      });
      
      setTranslationStatuses(statuses);
    } catch (error) {
      console.error('Error fetching translation statuses:', error);
      toast.error('Failed to load translation statuses');
    } finally {
      setIsLoading(false);
    }
  };

  // Filter and search logic
  const filteredStatuses = translationStatuses.filter((status) => {
    const matchesSearch = status.item.content.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         status.item.id.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesPage = selectedPage === 'all' || status.pageName === selectedPage;
    
    const matchesFilter = filterStatus === 'all' ||
                         (filterStatus === 'translated' && status.hasVietnamese) ||
                         (filterStatus === 'untranslated' && !status.hasVietnamese);
    
    return matchesSearch && matchesPage && matchesFilter;
  });

  const uniquePages = Array.from(new Set(translationStatuses.map(s => s.pageName)));
  const totalItems = translationStatuses.length;
  const translatedItems = translationStatuses.filter(s => s.hasVietnamese).length;
  const translationProgress = totalItems > 0 ? Math.round((translatedItems / totalItems) * 100) : 0;

  if (isLoading) {
    return (
      <div>
        <AdminNavbar />
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="flex items-center justify-center py-16">
            <div className="text-center">
              <Loader2 className="h-16 w-16 animate-spin mx-auto text-blue-500" />
              <p className="mt-4 text-lg text-gray-700">Loading translation data...</p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div>
      <AdminNavbar />
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center gap-3 mb-4">
            <Globe className="h-8 w-8 text-blue-600" />
            <h1 className="text-3xl font-bold text-gray-900">Translation Management</h1>
          </div>
          <p className="text-gray-600">
            Manage Vietnamese translations for all content items across your website.
          </p>
        </div>

        {/* Service Status */}
        {serviceStatus && (
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-6">
            <div className="flex items-center gap-2 mb-2">
              <Languages className="h-5 w-5 text-blue-600" />
              <h3 className="font-semibold text-blue-900">Translation Service Status</h3>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4 text-sm">
              <div>
                <span className="text-gray-600">Provider:</span>
                <span className={`ml-2 px-2 py-1 rounded text-xs font-medium ${
                  serviceStatus.provider === 'google' 
                    ? 'bg-green-100 text-green-800' 
                    : 'bg-yellow-100 text-yellow-800'
                }`}>
                  {serviceStatus.provider === 'google' ? 'Google Translate' : 'Smart Fallback'}
                </span>
              </div>
              <div>
                <span className="text-gray-600">Google API:</span>
                <span className={`ml-2 ${serviceStatus.googleTranslateAvailable ? 'text-green-600' : 'text-red-600'}`}>
                  {serviceStatus.googleTranslateAvailable ? 'Available' : 'Not Available'}
                </span>
              </div>
              <div>
                <span className="text-gray-600">Fallback Phrases:</span>
                <span className="ml-2 text-blue-600">{serviceStatus.fallbackTranslationsCount}</span>
              </div>
              <div>
                <span className="text-gray-600">Languages:</span>
                <span className="ml-2 text-blue-600">{serviceStatus.supportedLanguages?.join(', ')}</span>
              </div>
            </div>
          </div>
        )}

        {/* Progress Overview */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <div className="bg-white p-6 rounded-lg shadow-sm border">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-blue-100 rounded-lg">
                <Globe className="h-6 w-6 text-blue-600" />
              </div>
              <div>
                <h3 className="text-lg font-semibold text-gray-900">Total Items</h3>
                <p className="text-2xl font-bold text-blue-600">{totalItems}</p>
              </div>
            </div>
          </div>
          
          <div className="bg-white p-6 rounded-lg shadow-sm border">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-green-100 rounded-lg">
                <CheckCircle className="h-6 w-6 text-green-600" />
              </div>
              <div>
                <h3 className="text-lg font-semibold text-gray-900">Translated</h3>
                <p className="text-2xl font-bold text-green-600">{translatedItems}</p>
              </div>
            </div>
          </div>
          
          <div className="bg-white p-6 rounded-lg shadow-sm border">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-orange-100 rounded-lg">
                <AlertCircle className="h-6 w-6 text-orange-600" />
              </div>
              <div>
                <h3 className="text-lg font-semibold text-gray-900">Pending</h3>
                <p className="text-2xl font-bold text-orange-600">{totalItems - translatedItems}</p>
              </div>
            </div>
          </div>
          
          <div className="bg-white p-6 rounded-lg shadow-sm border">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-purple-100 rounded-lg">
                <div className="h-6 w-6 bg-purple-600 rounded-full flex items-center justify-center">
                  <span className="text-white text-xs font-bold">{translationProgress}%</span>
                </div>
              </div>
              <div>
                <h3 className="text-lg font-semibold text-gray-900">Progress</h3>
                <div className="w-full bg-gray-200 rounded-full h-2 mt-1">
                  <div 
                    className="bg-purple-600 h-2 rounded-full transition-all duration-300" 
                    style={{ width: `${translationProgress}%` }}
                  ></div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Filters and Search */}
        <div className="bg-white p-6 rounded-lg shadow-sm border mb-8">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            {/* Search */}
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
              <input
                type="text"
                placeholder="Search content..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10 w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>

            {/* Page Filter */}
            <div className="relative">
              <Filter className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
              <select
                value={selectedPage}
                onChange={(e) => setSelectedPage(e.target.value)}
                className="pl-10 w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent appearance-none"
              >
                <option value="all">All Pages</option>
                {uniquePages.map(page => (
                  <option key={page} value={page}>
                    {page.charAt(0).toUpperCase() + page.slice(1).replace('-', ' ')}
                  </option>
                ))}
              </select>
            </div>

            {/* Status Filter */}
            <select
              value={filterStatus}
              onChange={(e) => setFilterStatus(e.target.value as any)}
              className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              <option value="all">All Items</option>
              <option value="translated">Translated</option>
              <option value="untranslated">Untranslated</option>
            </select>

            {/* Refresh Button */}
            <button
              onClick={fetchTranslationStatuses}
              className="bg-blue-500 text-white px-4 py-2 rounded-md hover:bg-blue-600 flex items-center gap-2"
            >
              <Globe className="h-4 w-4" />
              Refresh
            </button>
          </div>
        </div>

        {/* Content Items List */}
        <div className="space-y-4">
          {filteredStatuses.length === 0 ? (
            <div className="text-center py-12 bg-white rounded-lg shadow-sm border">
              <Globe className="h-12 w-12 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">No content items found</h3>
              <p className="text-gray-500">
                {searchTerm || filterStatus !== 'all' || selectedPage !== 'all'
                  ? 'Try adjusting your search or filter criteria.'
                  : 'No content items available for translation.'}
              </p>
            </div>
          ) : (
            filteredStatuses.map((status, index) => (
              <div key={`${status.item.id}-${index}`} className="bg-white rounded-lg shadow-sm border p-6">
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-2">
                      <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                        {status.pageName}
                      </span>
                      <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-gray-100 text-gray-800">
                        {status.item.type}
                      </span>
                      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                        status.hasVietnamese 
                          ? 'bg-green-100 text-green-800' 
                          : 'bg-orange-100 text-orange-800'
                      }`}>
                        {status.hasVietnamese ? (
                          <>
                            <CheckCircle className="h-3 w-3 mr-1" />
                            Translated
                          </>
                        ) : (
                          <>
                            <AlertCircle className="h-3 w-3 mr-1" />
                            Needs Translation
                          </>
                        )}
                      </span>
                    </div>
                    
                    <h3 className="text-sm font-medium text-gray-500 mb-1">ID: {status.item.id}</h3>
                    <p className="text-gray-900 mb-2 line-clamp-3">{status.item.content}</p>
                    
                    {status.hasVietnamese && status.vietnameseContent && (
                      <div className="mt-3 p-3 bg-green-50 rounded-md border border-green-200">
                        <p className="text-sm font-medium text-green-800 mb-1">Vietnamese Translation:</p>
                        <p className="text-green-700 line-clamp-2">{status.vietnameseContent}</p>
                      </div>
                    )}
                  </div>
                  
                  <div className="ml-6">
                    <TranslationEditor
                      item={status.item}
                      pageName={status.pageName}
                      sectionId={status.sectionId}
                    />
                  </div>
                </div>
              </div>
            ))
          )}
        </div>

        {/* Summary */}
        {filteredStatuses.length > 0 && (
          <div className="mt-8 text-center text-gray-500">
            Showing {filteredStatuses.length} of {totalItems} content items
            {searchTerm && ` matching "${searchTerm}"`}
            {selectedPage !== 'all' && ` on ${selectedPage} page`}
            {filterStatus !== 'all' && ` that are ${filterStatus}`}
          </div>
        )}
      </div>
    </div>
  );
}