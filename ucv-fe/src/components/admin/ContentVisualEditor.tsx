import { useState } from 'react';
import { PageContent } from '../../lib/types';
import { HeroBannerEditor } from './visualEditors/HeroBannerEditor';
import { AboutUsEditor } from './visualEditors/AboutUsEditor';
import { DiscoverTourEditor } from './visualEditors/DiscoverTourEditor';
import { TestimonialsEditor } from './visualEditors/TestimonialsEditor';
import { FooterEditor } from './visualEditors/FooterEditor';
import { AboutUsBannerEditor } from './visualEditors/aboutus/AboutUsBannerEditor';
import { AboutUsCarouselEditor } from './visualEditors/aboutus/AboutUsCarouselEditor';
import { AboutUsContentEditor } from './visualEditors/aboutus/AboutUsContentEditor';
import { AboutUsStatisticsEditor } from './visualEditors/aboutus/AboutUsStatisticsEditor';
import { OurToursHeaderEditor } from './visualEditors/our-tours/OurToursHeaderEditor';
import { TourDetailsEditor } from './visualEditors/TourDetailsEditor';
import { SignUpFormEditor } from './visualEditors/SignUpFormEditor';

interface ContentVisualEditorProps {
  pageContent: PageContent;
}

export function ContentVisualEditor({ pageContent }: ContentVisualEditorProps) {
  const [activeView, setActiveView] = useState('visual');
  
  if (!pageContent) return null;
  
  const renderEditor = () => {
    switch (pageContent.pageName) {
      case 'home':
        return (
          <>
            <HeroBannerEditor pageContent={pageContent} />
            <AboutUsEditor pageContent={pageContent} />
            <DiscoverTourEditor pageContent={pageContent} />
            <TestimonialsEditor pageContent={pageContent} />
            <FooterEditor pageContent={pageContent} />
          </>
        );
      case 'about-us':
        return (
          <>
            <AboutUsBannerEditor pageContent={pageContent} />
            <AboutUsCarouselEditor pageContent={pageContent} />
            <AboutUsContentEditor pageContent={pageContent} sectionId="whoWeAre" />
            <AboutUsContentEditor pageContent={pageContent} sectionId="ourMission" />
            <AboutUsStatisticsEditor pageContent={pageContent} />
          </>
        );
      case 'our-tours':
        return <OurToursHeaderEditor pageContent={pageContent} />;
      case 'tour-details':
        return <TourDetailsEditor pageContent={pageContent} />;
      case 'signup-form':
        return <SignUpFormEditor pageContent={pageContent} />;
      default:
        return <div>No visual editor available for this page.</div>;
    }
  };
  
  return (
    <div className="mt-6">
      <div className="flex space-x-2 mb-4">
        <button
          onClick={() => setActiveView('visual')}
          className={`px-4 py-2 rounded-md ${
            activeView === 'visual'
              ? 'bg-blue-500 text-white'
              : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
          }`}
        >
          Visual Editor
        </button>
        <button
          onClick={() => setActiveView('raw')}
          className={`px-4 py-2 rounded-md ${
            activeView === 'raw'
              ? 'bg-blue-500 text-white'
              : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
          }`}
        >
          Raw Editor
        </button>
      </div>
      
      {activeView === 'visual' ? (
        renderEditor()
      ) : (
        <div className="bg-gray-50 p-4 rounded-md mb-4">
          <p className="text-gray-700 mb-2">
            Raw section editor is not recommended for regular use. Please use the visual editor for a better experience.
          </p>
          <pre className="bg-gray-800 text-gray-200 p-4 rounded-md overflow-auto max-h-96">
            {JSON.stringify(pageContent, null, 2)}
          </pre>
        </div>
      )}
    </div>
  );
} 