import { PageContent } from '../../../../lib/types';
import { InlineEditableField } from '../InlineEditableField';

interface SignUpFormStep2EditorProps {
  pageContent: PageContent;
}

export function SignUpFormStep2Editor({ pageContent }: SignUpFormStep2EditorProps) {
  // Safety check to ensure the section and items exist
  if (!pageContent?.sections?.step2Section?.items) {
    return (
      <div className="signup-form-step2-editor mb-10">
        <h3 className="text-xl font-bold mb-4 border-b pb-2">Step 2 - Tour Package</h3>
        <div className="bg-blue-50 p-6 rounded-lg">
          <p className="text-red-500">Content not found. Please refresh the page.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="signup-form-step2-editor mb-10">
      <h3 className="text-xl font-bold mb-4 border-b pb-2">Step 2 - Tour Package</h3>
      <div className="bg-blue-50 p-6 rounded-lg">
        <div className="grid grid-cols-1 gap-6">
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700 mb-1">Section Heading</label>
            <InlineEditableField
              pageName="signup-form"
              sectionId="step2Section"
              item={pageContent.sections.step2Section.items.find(item => item.id === 'step2-heading') || {
                id: 'step2-heading',
                type: 'heading',
                content: "Tailor Your Tour"
              }}
              className="text-xl font-bold"
            />
          </div>

          {/* Tour-Specific Content Sections */}
          <div className="p-4 bg-amber-50 rounded-md mb-6 border border-amber-200">
            <h4 className="text-lg font-semibold text-amber-800 mb-3">Tour-Specific Content</h4>
            <p className="text-sm text-amber-700 mb-4">
              Each tour has different details. Use these sections to edit content for each specific tour.
            </p>

            {/* Fall Tour 2025 Settings */}
            <div className="mb-6 bg-white p-4 rounded-md border border-blue-100">
              <div className="flex items-center mb-3">
                <span className="bg-blue-100 text-blue-800 px-3 py-1 rounded-md text-sm font-medium">Fall Tour 2025</span>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="mb-4">
                  <label className="block text-sm font-medium text-gray-700 mb-1">Tour Date</label>
                  <InlineEditableField
                    pageName="signup-form"
                    sectionId="step2Section"
                    item={pageContent.sections.step2Section.items.find(item => item.id === 'step2-fall-tour-date') || {
                      id: 'step2-fall-tour-date',
                      type: 'heading',
                      content: "1 - 8 OCTOBER 2025"
                    }}
                    className="text-sm font-medium"
                  />
                </div>

                <div className="mb-4">
                  <label className="block text-sm font-medium text-gray-700 mb-1">Tour Location</label>
                  <InlineEditableField
                    pageName="signup-form"
                    sectionId="step2Section"
                    item={pageContent.sections.step2Section.items.find(item => item.id === 'step2-fall-location-content') || {
                      id: 'step2-fall-location-content',
                      type: 'paragraph',
                      content: "Central Vietnam (Hue, Da Nang)"
                    }}
                    className="text-sm"
                  />
                </div>
              </div>

              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 mb-1">Tour Duration</label>
                <InlineEditableField
                  pageName="signup-form"
                  sectionId="step2Section"
                  item={pageContent.sections.step2Section.items.find(item => item.id === 'step2-fall-duration-content') || {
                    id: 'step2-fall-duration-content',
                    type: 'paragraph',
                    content: "We are aiming to visit 10 - 12 schools, in these 3 cities over 4 days."
                  }}
                  className="text-sm"
                  multiline={true}
                />
              </div>

              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 mb-1">Early Bird Deadline</label>
                <InlineEditableField
                  pageName="signup-form"
                  sectionId="step2Section"
                  item={pageContent.sections.step2Section.items.find(item => item.id === 'step2-fall-earlybird-title') || {
                    id: 'step2-fall-earlybird-title',
                    type: 'heading',
                    content: "Early Bird - 24 December 2024"
                  }}
                  className="text-sm font-medium"
                />
              </div>

              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 mb-1">Include List (Fall Tour 2025)</label>
                <InlineEditableField
                  pageName="signup-form"
                  sectionId="step2Section"
                  item={pageContent.sections.step2Section.items.find(item => item.id === 'step2-include-list-fall') || {
                    id: 'step2-include-list-fall',
                    type: 'paragraph',
                    content: "9 - 11 school visits in 3 cities.\nSupport throughout the tour and school visits.\nOne stall at each school fair.\nReception dinner.\nRefreshments and snacks between sessions.\nLunch, coffee and dinner on all 4 days (no dinner on final day).\nIntra and inter city transport (in Hue, Danang and Tam Ky).\nHotel suggestions & discount."
                  }}
                  className="text-sm"
                  multiline={true}
                />
                <div className="mt-1 text-xs text-blue-600">Note: Each item should be on a new line</div>
              </div>
            </div>

            {/* Spring Tour 2026 Settings */}
            <div className="bg-white p-4 rounded-md border border-green-100">
              <div className="flex items-center mb-3">
                <span className="bg-green-100 text-green-800 px-3 py-1 rounded-md text-sm font-medium">Spring Tour 2026</span>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="mb-4">
                  <label className="block text-sm font-medium text-gray-700 mb-1">Tour Date</label>
                  <InlineEditableField
                    pageName="signup-form"
                    sectionId="step2Section"
                    item={pageContent.sections.step2Section.items.find(item => item.id === 'step2-spring-tour-date') || {
                      id: 'step2-spring-tour-date',
                      type: 'heading',
                      content: "31 MARCH - 10 APRIL 2026"
                    }}
                    className="text-sm font-medium"
                  />
                </div>

                <div className="mb-4">
                  <label className="block text-sm font-medium text-gray-700 mb-1">Tour Location</label>
                  <InlineEditableField
                    pageName="signup-form"
                    sectionId="step2Section"
                    item={pageContent.sections.step2Section.items.find(item => item.id === 'step2-spring-location-content') || {
                      id: 'step2-spring-location-content',
                      type: 'paragraph',
                      content: "Northern Vietnam (Hanoi, Hai Duong)"
                    }}
                    className="text-sm"
                  />
                </div>
              </div>

              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 mb-1">Tour Duration</label>
                <InlineEditableField
                  pageName="signup-form"
                  sectionId="step2Section"
                  item={pageContent.sections.step2Section.items.find(item => item.id === 'step2-spring-duration-content') || {
                    id: 'step2-spring-duration-content',
                    type: 'paragraph',
                    content: "10 schools across 3 northern cities over 5 days."
                  }}
                  className="text-sm"
                  multiline={true}
                />
              </div>

              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 mb-1">Early Bird Deadline</label>
                <InlineEditableField
                  pageName="signup-form"
                  sectionId="step2Section"
                  item={pageContent.sections.step2Section.items.find(item => item.id === 'step2-spring-earlybird-title') || {
                    id: 'step2-spring-earlybird-title',
                    type: 'heading',
                    content: "Early Bird - 15 August 2025"
                  }}
                  className="text-sm font-medium"
                />
              </div>

              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 mb-1">Include List (Spring Tour 2026)</label>
                <InlineEditableField
                  pageName="signup-form"
                  sectionId="step2Section"
                  item={pageContent.sections.step2Section.items.find(item => item.id === 'step2-include-list-spring') || {
                    id: 'step2-include-list-spring',
                    type: 'paragraph',
                    content: "12 - 15 school visits across 3 regions.\nComprehensive tour support throughout all visits.\nPremium stall location at each school fair.\nWelcome and farewell dinners.\nRefreshments and snacks between sessions.\nAll meals included on tour days.\nIntra and inter city transport in all visited regions.\nPremium hotel arrangements with special rates."
                  }}
                  className="text-sm"
                  multiline={true}
                />
                <div className="mt-1 text-xs text-green-600">Note: Each item should be on a new line</div>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 bg-white p-4 rounded-md">
            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700 mb-1">Location Title</label>
              <InlineEditableField
                pageName="signup-form"
                sectionId="step2Section"
                item={pageContent.sections.step2Section.items.find(item => item.id === 'step2-location-title') || {
                  id: 'step2-location-title',
                  type: 'heading',
                  content: "LOCATION"
                }}
                className="text-sm font-medium"
              />
            </div>

            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700 mb-1">Duration Title</label>
              <InlineEditableField
                pageName="signup-form"
                sectionId="step2Section"
                item={pageContent.sections.step2Section.items.find(item => item.id === 'step2-duration-title') || {
                  id: 'step2-duration-title',
                  type: 'heading',
                  content: "DURATION"
                }}
                className="text-sm font-medium"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 bg-white p-4 rounded-md">
            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700 mb-1">Registration Title</label>
              <InlineEditableField
                pageName="signup-form"
                sectionId="step2Section"
                item={pageContent.sections.step2Section.items.find(item => item.id === 'step2-registration-title') || {
                  id: 'step2-registration-title',
                  type: 'heading',
                  content: "Registration"
                }}
                className="text-sm font-medium"
              />
            </div>

            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700 mb-1">Include Title</label>
              <InlineEditableField
                pageName="signup-form"
                sectionId="step2Section"
                item={pageContent.sections.step2Section.items.find(item => item.id === 'step2-include-title') || {
                  id: 'step2-include-title',
                  type: 'heading',
                  content: "Price include"
                }}
                className="text-sm font-medium"
              />
            </div>
          </div>

          {/* City and Promotion labels */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 bg-white p-4 rounded-md">
            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700 mb-1">Hanoi & Hai Duong Label</label>
              <InlineEditableField
                pageName="signup-form"
                sectionId="step2Section"
                item={pageContent.sections.step2Section.items.find(item => item.id === 'step2-hanoiHaiDuong-label') || {
                  id: 'step2-hanoiHaiDuong-label',
                  type: 'heading',
                  content: "Ha Noi & Hai Duong"
                }}
                className="text-sm"
              />
            </div>

            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700 mb-1">Hue & Da Nang Label</label>
              <InlineEditableField
                pageName="signup-form"
                sectionId="step2Section"
                item={pageContent.sections.step2Section.items.find(item => item.id === 'step2-hueDaNang-label') || {
                  id: 'step2-hueDaNang-label',
                  type: 'heading',
                  content: "Hue & Da Nang"
                }}
                className="text-sm"
              />
            </div>

            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700 mb-1">Ho Chi Minh City Label</label>
              <InlineEditableField
                pageName="signup-form"
                sectionId="step2Section"
                item={pageContent.sections.step2Section.items.find(item => item.id === 'step2-hcmc-label') || {
                  id: 'step2-hcmc-label',
                  type: 'heading',
                  content: "Ho Chi Minh City"
                }}
                className="text-sm"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 bg-white p-4 rounded-md">
            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700 mb-1">Promotions Title</label>
              <InlineEditableField
                pageName="signup-form"
                sectionId="step2Section"
                item={pageContent.sections.step2Section.items.find(item => item.id === 'step2-promotions-title') || {
                  id: 'step2-promotions-title',
                  type: 'heading',
                  content: "Promotions"
                }}
                className="text-sm font-medium"
              />
            </div>

            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700 mb-1">Early Bird Discount Label</label>
              <InlineEditableField
                pageName="signup-form"
                sectionId="step2Section"
                item={pageContent.sections.step2Section.items.find(item => item.id === 'step2-earlybird-label') || {
                  id: 'step2-earlybird-label',
                  type: 'heading',
                  content: "Early Bird Discount"
                }}
                className="text-sm"
              />
            </div>

            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700 mb-1">Returning Client Discount Label</label>
              <InlineEditableField
                pageName="signup-form"
                sectionId="step2Section"
                item={pageContent.sections.step2Section.items.find(item => item.id === 'step2-returning-label') || {
                  id: 'step2-returning-label',
                  type: 'heading',
                  content: "Returning Client Discount"
                }}
                className="text-sm"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700 mb-1">Back Button Text</label>
              <InlineEditableField
                pageName="signup-form"
                sectionId="step2Section"
                item={pageContent.sections.step2Section.items.find(item => item.id === 'step2-back-button') || {
                  id: 'step2-back-button',
                  type: 'heading',
                  content: "Back"
                }}
                className="text-sm font-medium"
              />
            </div>

            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700 mb-1">Next Button Text</label>
              <InlineEditableField
                pageName="signup-form"
                sectionId="step2Section"
                item={pageContent.sections.step2Section.items.find(item => item.id === 'step2-next-button') || {
                  id: 'step2-next-button',
                  type: 'heading',
                  content: "Next Step"
                }}
                className="text-sm font-medium"
              />
            </div>
          </div>

          {/* Legacy/Common Fields Section */}
          <details className="mt-4 border-t pt-3">
            <summary className="text-sm text-amber-700 cursor-pointer font-medium">Common & Legacy Content</summary>
            <div className="mt-3 p-3 bg-gray-50 rounded-md">
              <div className="mb-3">
                <label className="block text-sm font-medium text-gray-700 mb-1">Generic Tour Date</label>
                <InlineEditableField
                  pageName="signup-form"
                  sectionId="step2Section"
                  item={pageContent.sections.step2Section.items.find(item => item.id === 'step2-tour-date') || {
                    id: 'step2-tour-date',
                    type: 'heading',
                    content: "INCOMING • JULY 4"
                  }}
                  className="text-sm"
                />
              </div>
              <div className="mb-3">
                <label className="block text-sm font-medium text-gray-700 mb-1">Generic Tour Title</label>
                <InlineEditableField
                  pageName="signup-form"
                  sectionId="step2Section"
                  item={pageContent.sections.step2Section.items.find(item => item.id === 'step2-tour-title') || {
                    id: 'step2-tour-title',
                    type: 'heading',
                    content: "Tour Spring 2025"
                  }}
                  className="text-sm"
                />
              </div>
              <div className="mb-3">
                <label className="block text-sm font-medium text-gray-700 mb-1">Generic Location Content</label>
                <InlineEditableField
                  pageName="signup-form"
                  sectionId="step2Section"
                  item={pageContent.sections.step2Section.items.find(item => item.id === 'step2-location-content') || {
                    id: 'step2-location-content',
                    type: 'paragraph',
                    content: "Central Vietnam (Hue, Da Nang)"
                  }}
                  className="text-sm"
                />
              </div>
              <div className="mb-3">
                <label className="block text-sm font-medium text-gray-700 mb-1">Generic Duration Content</label>
                <InlineEditableField
                  pageName="signup-form"
                  sectionId="step2Section"
                  item={pageContent.sections.step2Section.items.find(item => item.id === 'step2-duration-content') || {
                    id: 'step2-duration-content',
                    type: 'paragraph',
                    content: "We are aiming to visit 10 - 12 schools, in these 3 cities over 4 days."
                  }}
                  className="text-sm"
                  multiline={true}
                />
              </div>
              <div className="mb-3">
                <label className="block text-sm font-medium text-gray-700 mb-1">Generic Early Bird Title</label>
                <InlineEditableField
                  pageName="signup-form"
                  sectionId="step2Section"
                  item={pageContent.sections.step2Section.items.find(item => item.id === 'step2-earlybird-title') || {
                    id: 'step2-earlybird-title',
                    type: 'heading',
                    content: "Early Bird - 24 December 2024"
                  }}
                  className="text-sm"
                />
              </div>
              <div className="mb-3">
                <label className="block text-sm font-medium text-gray-700 mb-1">Generic Include List</label>
                <InlineEditableField
                  pageName="signup-form"
                  sectionId="step2Section"
                  item={pageContent.sections.step2Section.items.find(item => item.id === 'step2-include-list') || {
                    id: 'step2-include-list',
                    type: 'paragraph',
                    content: "School visits in selected cities.\nSupport throughout the tour and school visits.\nOne stall at each school fair.\nReception dinners.\nRefreshments and snacks between sessions.\nMeals on tour days.\nTransport in visited cities.\nHotel arrangements."
                  }}
                  className="text-sm"
                  multiline={true}
                />
                <div className="mt-1 text-xs text-gray-600">
                  Note: This is a generic fallback list used when tour-specific content isn't available.
                </div>
              </div>
            </div>
          </details>
        </div>
      </div>
    </div>
  );
} 