import { PageContent } from '../../../../lib/types';
import { InlineEditableField } from '../InlineEditableField';

interface TourPricingEditorProps {
  pageContent: PageContent;
}

export function TourPricingEditor({ pageContent }: TourPricingEditorProps) {
  return (
    <div className="tour-pricing-editor mb-10">
      <h3 className="text-xl font-bold mb-4 border-b pb-2">Pricing Section</h3>
      <div className="bg-blue-50 p-6 rounded-lg">
        <div className="mb-6">
          <label className="block text-sm font-medium text-gray-700 mb-1">Section Heading</label>
          <InlineEditableField
            pageName="tour-details"
            sectionId="pricingSection"
            item={pageContent.sections.pricingSection.items.find(item => item.id === 'pricing-heading')}
            className="text-sm font-bold"
          />
        </div>

        <div className="mb-6">
          <label className="block text-sm font-medium text-gray-700 mb-1">Section Title</label>
          <InlineEditableField
            pageName="tour-details"
            sectionId="pricingSection"
            item={pageContent.sections.pricingSection.items.find(item => item.id === 'pricing-title')}
            className="text-xl font-medium"
          />
        </div>

        <div className="bg-white p-4 rounded-lg border border-gray-200 mb-4">
          <h4 className="font-medium mb-3">Early Bird Pricing</h4>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Deadline</label>
              <InlineEditableField
                pageName="tour-details"
                sectionId="pricingSection"
                item={pageContent.sections.pricingSection.items.find(item => item.id === 'pricing-earlybird-deadline')}
                className="text-sm font-medium"
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Standard Price</label>
              <InlineEditableField
                pageName="tour-details"
                sectionId="pricingSection"
                item={pageContent.sections.pricingSection.items.find(item => item.id === 'pricing-earlybird-price')}
                className="text-sm font-medium"
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Returning University Price</label>
              <InlineEditableField
                pageName="tour-details"
                sectionId="pricingSection"
                item={pageContent.sections.pricingSection.items.find(item => item.id === 'pricing-earlybird-returning')}
                className="text-sm font-medium"
              />
            </div>
          </div>
          
          <h4 className="font-medium mb-3 mt-6">Standard Pricing</h4>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Deadline</label>
              <InlineEditableField
                pageName="tour-details"
                sectionId="pricingSection"
                item={pageContent.sections.pricingSection.items.find(item => item.id === 'pricing-standard-deadline')}
                className="text-sm font-medium"
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Standard Price</label>
              <InlineEditableField
                pageName="tour-details"
                sectionId="pricingSection"
                item={pageContent.sections.pricingSection.items.find(item => item.id === 'pricing-standard-price')}
                className="text-sm font-medium"
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Returning University Price</label>
              <InlineEditableField
                pageName="tour-details"
                sectionId="pricingSection"
                item={pageContent.sections.pricingSection.items.find(item => item.id === 'pricing-standard-returning')}
                className="text-sm font-medium"
              />
            </div>
          </div>
        </div>
        
        <div className="bg-white p-4 rounded-lg border border-gray-200">
          <h4 className="font-medium mb-3">Custom Tour Option</h4>
          
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700 mb-1">Title</label>
            <InlineEditableField
              pageName="tour-details"
              sectionId="pricingSection"
              item={pageContent.sections.pricingSection.items.find(item => item.id === 'pricing-custom-title')}
              className="text-sm font-bold"
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
            <InlineEditableField
              pageName="tour-details"
              sectionId="pricingSection"
              item={pageContent.sections.pricingSection.items.find(item => item.id === 'pricing-custom-description')}
              className="text-sm"
            />
          </div>
        </div>
      </div>
    </div>
  );
} 