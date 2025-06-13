import { useEffect, useState } from 'react';
import { AdminNavbar } from '../../components/admin/AdminNavbar';
import { useContentStore } from '../../lib/contentStore';
import { PageContent, ContentItem } from '../../lib/types';
import { InlineEditableField } from '../../components/admin/visualEditors/InlineEditableField';

export default function AdminTourDetails() {
  const getPageContent = useContentStore(state => state.getPageContent);
  const resetToDefault = useContentStore(state => state.resetToDefault);
  const resetPageContent = useContentStore(state => state.resetPageContent);
  
  const [tourDetailsContent, setTourDetailsContent] = useState<PageContent | undefined>(getPageContent('tour-details'));
  
  // Refresh the content once when component mounts
  useEffect(() => {
    const content = getPageContent('tour-details');
    if (content) {
      setTourDetailsContent(content);
    }
  }, [getPageContent]);
  
  // Refresh content periodically to catch updates
  useEffect(() => {
    const interval = setInterval(() => {
      setTourDetailsContent(getPageContent('tour-details'));
    }, 1000);
    
    return () => clearInterval(interval);
  }, [getPageContent]);
  
  const handleReset = () => {
    if (window.confirm('Are you sure you want to reset Tour Details content to default values? This cannot be undone.')) {
      resetToDefault();
      const refreshedContent = getPageContent('tour-details');
      setTourDetailsContent(refreshedContent);
    }
  };

  const handleResetPageOnly = () => {
    if (window.confirm('Are you sure you want to reset only the Tour Details page content to include all new items? This will preserve other pages but reset this page.')) {
      resetPageContent('tour-details');
      const refreshedContent = getPageContent('tour-details');
      setTourDetailsContent(refreshedContent);
    }
  };
  
  const handleRefresh = () => {
    const refreshedContent = getPageContent('tour-details');
    setTourDetailsContent(refreshedContent);
  };
  
  // Helper function to find an item by ID or create a default one
  const findItem = (sectionId: string, itemId: string): ContentItem | undefined => {
    const existingItem = tourDetailsContent?.sections[sectionId]?.items.find(item => item.id === itemId);
    if (existingItem) {
      return existingItem;
    }
    
    // Return undefined for missing items - InlineEditableField will handle this gracefully
    return undefined;
  };
  
  // Check if any items are missing
  const checkMissingItems = () => {
    const requiredItems = [
      { section: 'bannerSection', items: ['tourBanner-locationLabel', 'tourBanner-durationLabel', 'tourBanner-customizeLabel', 'tourBanner-tourDatesLabel', 'tourBanner-signUpButton', 'tourBanner-shareLabel'] },
      { section: 'eventsSection', items: ['events-heading', 'events-title'] },
      { section: 'locationsSection', items: ['locations-heading', 'locations-title'] },
      { section: 'timelinesSection', items: ['timelines-heading', 'timelines-title'] },
      { section: 'pricingSection', items: ['pricing-heading', 'pricing-title', 'pricing-tableHeader1', 'pricing-tableHeader2', 'pricing-tableHeader3', 'pricing-custom-title', 'pricing-custom-description', 'pricing-custom-button'] },
      { section: 'packageSection', items: ['package-heading'] },
      { section: 'otherToursSection', items: ['otherTours-heading'] }
    ];
    
    let missingCount = 0;
    requiredItems.forEach(({ section, items }) => {
      items.forEach(itemId => {
        if (!findItem(section, itemId)) {
          missingCount++;
        }
      });
    });
    
    return missingCount;
  };
  
  const missingItemsCount = checkMissingItems();
  
  // If content is not available, show an error/loading state
  if (!tourDetailsContent) {
    return (
      <div>
        <AdminNavbar />
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <h1 className="text-2xl font-bold mb-4">Tour Details Page Content Management</h1>
          <div className="bg-yellow-50 border border-yellow-400 text-yellow-700 px-4 py-3 rounded">
            <p>Loading Tour Details page content...</p>
            <div className="mt-4 flex space-x-4">
              <button 
                onClick={handleRefresh}
                className="bg-blue-500 text-white px-4 py-2 rounded-md hover:bg-blue-600 cursor-pointer"
              >
                Refresh
              </button>
              <button 
                onClick={handleReset}
                className="bg-red-600 text-white px-4 py-2 rounded-md hover:bg-red-700 cursor-pointer"
              >
                Reset to Defaults
              </button>
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
        <div className="flex justify-between items-center mb-4">
          <h1 className="text-2xl font-bold">Tour Details Page Content Management</h1>
          <div className="space-x-2">
            <button 
              onClick={handleRefresh}
              className="bg-blue-500 text-white px-4 py-2 rounded-md hover:bg-blue-600 cursor-pointer"
            >
              Refresh
            </button>
            <button 
              onClick={handleResetPageOnly}
              className="bg-orange-500 text-white px-4 py-2 rounded-md hover:bg-orange-600 cursor-pointer"
            >
              Reset Page Content
            </button>
            <button 
              onClick={handleReset}
              className="bg-red-600 text-white px-4 py-2 rounded-md hover:bg-red-700 cursor-pointer"
            >
              Reset All Content
            </button>
          </div>
        </div>
        
        {missingItemsCount > 0 && (
          <div className="mb-6 p-4 bg-orange-50 rounded-lg border border-orange-200">
            <h3 className="font-medium text-orange-700 mb-2">Missing Content Items Detected</h3>
            <p className="text-sm text-orange-600 mb-3">
              {missingItemsCount} content items are missing from your current content store. This usually happens when new editable elements are added to the page.
            </p>
            <button 
              onClick={handleResetPageOnly}
              className="bg-orange-500 text-white px-4 py-2 rounded-md hover:bg-orange-600 cursor-pointer text-sm"
            >
              Add Missing Items (Reset Page Content)
            </button>
          </div>
        )}
        
        <div className="mb-6 p-4 bg-blue-50 rounded-lg border border-blue-200">
          <h3 className="font-medium text-blue-700 mb-2">What You Can Edit</h3>
          <p className="text-sm text-blue-600 mb-2">
            This editor allows you to modify static text elements like section headings, labels, and button text. 
            The following elements are <strong>not editable</strong> here as they come from the tour database:
          </p>
          <ul className="text-sm text-blue-600 list-disc list-inside space-y-1">
            <li>Tour titles, descriptions, and dates</li>
            <li>Tour locations, duration, and customization details</li>
            <li>Pricing amounts and deadlines</li>
            <li>Package inclusion details</li>
            <li>Event types and city information</li>
            <li>Images and tour cards</li>
          </ul>
          <p className="text-sm text-blue-600 mt-2">
            To edit tour-specific content, locate to <strong>Our Tours - Manage Tours</strong> section in the admin panel.
          </p>
        </div>
        
        {/* Custom Editor for Static Text Elements */}
        <div className="space-y-8">
          
          {/* Banner Section Labels */}
          <div className="bg-white p-6 rounded-lg shadow-sm">
            <h2 className="text-xl font-bold mb-4 border-b pb-2">Banner Section Labels</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Location Label</label>
                <InlineEditableField
                  pageName="tour-details"
                  sectionId="bannerSection"
                  item={findItem('bannerSection', 'tourBanner-locationLabel')}
                  itemId="tourBanner-locationLabel"
                  defaultContent="LOCATION"
                  className="text-sm font-bold uppercase"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Duration Label</label>
                <InlineEditableField
                  pageName="tour-details"
                  sectionId="bannerSection"
                  item={findItem('bannerSection', 'tourBanner-durationLabel')}
                  itemId="tourBanner-durationLabel"
                  defaultContent="DURATION"
                  className="text-sm font-bold uppercase"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Customize Label</label>
                <InlineEditableField
                  pageName="tour-details"
                  sectionId="bannerSection"
                  item={findItem('bannerSection', 'tourBanner-customizeLabel')}
                  itemId="tourBanner-customizeLabel"
                  defaultContent="CUSTOMIZE"
                  className="text-sm font-bold"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Tour Dates Label</label>
                <InlineEditableField
                  pageName="tour-details"
                  sectionId="bannerSection"
                  item={findItem('bannerSection', 'tourBanner-tourDatesLabel')}
                  itemId="tourBanner-tourDatesLabel"
                  defaultContent="Tour dates"
                  className="text-sm font-bold uppercase"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Share Label</label>
                <InlineEditableField
                  pageName="tour-details"
                  sectionId="bannerSection"
                  item={findItem('bannerSection', 'tourBanner-shareLabel')}
                  itemId="tourBanner-shareLabel"
                  defaultContent="Share"
                  className="text-sm font-medium"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Sign Up Button Text</label>
                <InlineEditableField
                  pageName="tour-details"
                  sectionId="bannerSection"
                  item={findItem('bannerSection', 'tourBanner-signUpButton')}
                  itemId="tourBanner-signUpButton"
                  defaultContent="Sign Up Now"
                  className="text-sm font-medium"
                />
              </div>
            </div>
          </div>

          {/* Events Section */}
          <div className="bg-white p-6 rounded-lg shadow-sm">
            <h2 className="text-xl font-bold mb-4 border-b pb-2">Events Section</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Section Heading</label>
                <InlineEditableField
                  pageName="tour-details"
                  sectionId="eventsSection"
                  item={findItem('eventsSection', 'events-heading')}
                  itemId="events-heading"
                  defaultContent="EVENTS IN THE SCHOOLS"
                  className="text-lg font-bold uppercase"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Section Title</label>
                <InlineEditableField
                  pageName="tour-details"
                  sectionId="eventsSection"
                  item={findItem('eventsSection', 'events-title')}
                  itemId="events-title"
                  defaultContent="Make the school visits more productive and memorable for both you and the students."
                  className="text-xl font-semibold"
                  multiline={true}
                />
              </div>
            </div>
          </div>

          {/* Tour Locations Section */}
          <div className="bg-white p-6 rounded-lg shadow-sm">
            <h2 className="text-xl font-bold mb-4 border-b pb-2">Tour Locations Section</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Section Heading</label>
                <InlineEditableField
                  pageName="tour-details"
                  sectionId="locationsSection"
                  item={findItem('locationsSection', 'locations-heading')}
                  itemId="locations-heading"
                  defaultContent="TOUR LOCATIONS"
                  className="text-lg font-bold uppercase"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Section Title Prefix</label>
                <InlineEditableField
                  pageName="tour-details"
                  sectionId="locationsSection"
                  item={findItem('locationsSection', 'locations-title')}
                  itemId="locations-title"
                  defaultContent="We are aiming to visit"
                  className="text-xl font-medium"
                />
                <p className="text-xs text-gray-500 mt-1">Note: This text appears before the tour duration from the database</p>
              </div>
            </div>
          </div>

          {/* Tour Timelines Section */}
          <div className="bg-white p-6 rounded-lg shadow-sm">
            <h2 className="text-xl font-bold mb-4 border-b pb-2">Tour Timelines Section</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Section Heading</label>
                <InlineEditableField
                  pageName="tour-details"
                  sectionId="timelinesSection"
                  item={findItem('timelinesSection', 'timelines-heading')}
                  itemId="timelines-heading"
                  defaultContent="TOUR TIMELINES"
                  className="text-lg font-bold uppercase"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Section Title</label>
                <InlineEditableField
                  pageName="tour-details"
                  sectionId="timelinesSection"
                  item={findItem('timelinesSection', 'timelines-title')}
                  itemId="timelines-title"
                  defaultContent="Tentative Schedule for the 2025/26 School Year"
                  className="text-xl font-medium"
                />
              </div>
            </div>
          </div>

          {/* Pricing Section */}
          <div className="bg-white p-6 rounded-lg shadow-sm">
            <h2 className="text-xl font-bold mb-4 border-b pb-2">Pricing Section</h2>
            <div className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Section Heading</label>
                  <InlineEditableField
                    pageName="tour-details"
                    sectionId="pricingSection"
                    item={findItem('pricingSection', 'pricing-heading')}
                    itemId="pricing-heading"
                    defaultContent="PRICING"
                    className="text-lg font-bold uppercase"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Section Title</label>
                  <InlineEditableField
                    pageName="tour-details"
                    sectionId="pricingSection"
                    item={findItem('pricingSection', 'pricing-title')}
                    itemId="pricing-title"
                    defaultContent="We offer an Early Bird discount as well as an extra discount for returning universities"
                    className="text-xl font-medium"
                    multiline={true}
                  />
                </div>
              </div>
              
              <div>
                <h3 className="text-lg font-semibold mb-3">Table Headers</h3>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Header 1</label>
                    <InlineEditableField
                      pageName="tour-details"
                      sectionId="pricingSection"
                      item={findItem('pricingSection', 'pricing-tableHeader1')}
                      itemId="pricing-tableHeader1"
                      defaultContent="Registration Deadline"
                      className="text-sm font-semibold"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Header 2</label>
                    <InlineEditableField
                      pageName="tour-details"
                      sectionId="pricingSection"
                      item={findItem('pricingSection', 'pricing-tableHeader2')}
                      itemId="pricing-tableHeader2"
                      defaultContent="Standard Price"
                      className="text-sm font-semibold"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Header 3</label>
                    <InlineEditableField
                      pageName="tour-details"
                      sectionId="pricingSection"
                      item={findItem('pricingSection', 'pricing-tableHeader3')}
                      itemId="pricing-tableHeader3"
                      defaultContent="Returning University"
                      className="text-sm font-semibold"
                    />
                  </div>
                </div>
              </div>

              <div>
                <h3 className="text-lg font-semibold mb-3">Custom Tour Section</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Custom Tour Title</label>
                    <InlineEditableField
                      pageName="tour-details"
                      sectionId="pricingSection"
                      item={findItem('pricingSection', 'pricing-custom-title')}
                      itemId="pricing-custom-title"
                      defaultContent="Tailor your perfect tour"
                      className="text-lg font-bold"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Custom Tour Description</label>
                    <InlineEditableField
                      pageName="tour-details"
                      sectionId="pricingSection"
                      item={findItem('pricingSection', 'pricing-custom-description')}
                      itemId="pricing-custom-description"
                      defaultContent="Customized school tours connecting top Vietnamese schools with international universities."
                      className="text-sm"
                      multiline={true}
                    />
                  </div>
                </div>
                <div className="mt-4">
                  <label className="block text-sm font-medium text-gray-700 mb-1">Custom Tour Button Text</label>
                  <InlineEditableField
                    pageName="tour-details"
                    sectionId="pricingSection"
                    item={findItem('pricingSection', 'pricing-custom-button')}
                    itemId="pricing-custom-button"
                    defaultContent="Sign Up Now"
                    className="text-sm font-medium"
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Package Section */}
          <div className="bg-white p-6 rounded-lg shadow-sm">
            <h2 className="text-xl font-bold mb-4 border-b pb-2">Package Section</h2>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Section Heading</label>
              <InlineEditableField
                pageName="tour-details"
                sectionId="packageSection"
                item={findItem('packageSection', 'package-heading')}
                itemId="package-heading"
                defaultContent="THE PACKAGE INCLUDES"
                className="text-lg font-bold uppercase"
              />
            </div>
          </div>

          {/* Other Tours Section */}
          <div className="bg-white p-6 rounded-lg shadow-sm">
            <h2 className="text-xl font-bold mb-4 border-b pb-2">Other Tours Section</h2>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Section Heading</label>
              <InlineEditableField
                pageName="tour-details"
                sectionId="otherToursSection"
                item={findItem('otherToursSection', 'otherTours-heading')}
                itemId="otherTours-heading"
                defaultContent="OTHER TOURS"
                className="text-lg font-bold uppercase"
              />
            </div>
          </div>

        </div>
      </div>
    </div>
  );
}
