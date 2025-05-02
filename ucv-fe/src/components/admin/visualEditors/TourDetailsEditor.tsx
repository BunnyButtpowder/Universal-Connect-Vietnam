import { PageContent } from '../../../lib/types';
import { TourBannerEditor } from './tour-details/TourBannerEditor';
import { TourEventsEditor } from './tour-details/TourEventsEditor';
import { TourLocationsEditor } from './tour-details/TourLocationsEditor';
import { TourPricingEditor } from './tour-details/TourPricingEditor';
import { TourPackageEditor } from './tour-details/TourPackageEditor';

interface TourDetailsEditorProps {
  pageContent: PageContent;
}

export function TourDetailsEditor({ pageContent }: TourDetailsEditorProps) {
  if (!pageContent) return null;
  
  return (
    <div className="space-y-8">
      <div className="bg-white p-6 rounded-lg shadow-sm">
        <h2 className="text-2xl font-bold mb-6">Tour Details Editor</h2>
        <p className="text-gray-600 mb-4">
          Edit the tour details content below. Changes will be reflected immediately on the Tour Details page.
        </p>
        
        <div className="mt-8">
          <TourBannerEditor pageContent={pageContent} />
          <TourEventsEditor pageContent={pageContent} />
          <TourLocationsEditor pageContent={pageContent} />
          <TourPricingEditor pageContent={pageContent} />
          <TourPackageEditor pageContent={pageContent} />
        </div>

        <div className="mt-6 p-4 bg-blue-50 rounded-lg">
          <h3 className="font-medium text-blue-700 mb-2">Note</h3>
          <p className="text-sm text-blue-600">
            Image uploads and the "Other Tours" section editing (TourCard components) are not included in this editor.
            These features will be implemented in a future update.
          </p>
        </div>
      </div>
    </div>
  );
} 