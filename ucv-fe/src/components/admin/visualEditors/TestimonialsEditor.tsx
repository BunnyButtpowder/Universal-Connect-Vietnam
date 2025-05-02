import { PageContent, ContentItem } from '../../../lib/types';
import { InlineEditableField } from './InlineEditableField';
import { TestimonialCardEditor } from './TestimonialCardEditor';

interface TestimonialsEditorProps {
  pageContent: PageContent;
}

export function TestimonialsEditor({ pageContent }: TestimonialsEditorProps) {
  const sectionId = 'testimonials';
  const section = pageContent.sections[sectionId];
  
  // Helper function to find items by ID
  const getItemById = (id: string): ContentItem | undefined => {
    return section.items.find(item => item.id === id);
  };
  
  // Get section headings
  const heading = getItemById('testimonials-heading');
  const title = getItemById('testimonials-title');
  
  // Testimonial 1
  const testimonial1Content = getItemById('testimonial-1-content');
  const testimonial1University = getItemById('testimonial-1-university');
  const testimonial1Subtitle = getItemById('testimonial-1-subtitle');
  
  // Testimonial 2
  const testimonial2Content = getItemById('testimonial-2-content');
  const testimonial2University = getItemById('testimonial-2-university');
  const testimonial2Subtitle = getItemById('testimonial-2-subtitle');
  
  // Testimonial 3
  const testimonial3Content = getItemById('testimonial-3-content');
  const testimonial3University = getItemById('testimonial-3-university');
  const testimonial3Subtitle = getItemById('testimonial-3-subtitle');
  
  return (
    <div className="preview-container space-y-8">
      {/* Headings */}
      <div className="border border-gray-200 rounded-lg p-4 bg-gray-50">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-4 items-center">
          <div className="lg:col-span-3 space-y-4">
            <div className="bg-blue-50 p-4 rounded">
              <div className="font-semibold text-gray-500 text-xs mb-1">Section Label:</div>
              <InlineEditableField
                item={heading}
                pageName={pageContent.pageName}
                sectionId={sectionId}
                className="text-base font-bold text-blue-900"
              />
            </div>
            
            <div className="bg-blue-50 p-4 rounded">
              <div className="font-semibold text-gray-500 text-xs mb-1">Section Title:</div>
              <InlineEditableField
                item={title}
                pageName={pageContent.pageName}
                sectionId={sectionId}
                className="text-xl font-medium text-gray-800"
                multiline
              />
            </div>
          </div>
          
          <div className="lg:col-span-9">
            <div className="text-center text-gray-600 text-sm mb-4">
              Testimonial Cards Preview
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {/* Testimonial Card 1 */}
              <TestimonialCardEditor
                contentItem={testimonial1Content}
                universityItem={testimonial1University}
                subtitleItem={testimonial1Subtitle}
                cardNumber={1}
                pageName={pageContent.pageName}
                sectionId={sectionId}
              />
              
              {/* Testimonial Card 2 */}
              <TestimonialCardEditor
                contentItem={testimonial2Content}
                universityItem={testimonial2University}
                subtitleItem={testimonial2Subtitle}
                cardNumber={2}
                pageName={pageContent.pageName}
                sectionId={sectionId}
              />
              
              {/* Testimonial Card 3 */}
              <TestimonialCardEditor
                contentItem={testimonial3Content}
                universityItem={testimonial3University}
                subtitleItem={testimonial3Subtitle}
                cardNumber={3}
                pageName={pageContent.pageName}
                sectionId={sectionId}
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
} 