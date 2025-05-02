import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { ContentItem, PageContent, ContentUpdate } from './types';

// Initial content for the Home page
const initialHomeContent: PageContent = {
    pageName: 'home',
    sections: {
        heroBanner: {
            title: 'Hero Banner',
            items: [
                {
                    id: 'heroBanner-heading',
                    type: 'heading',
                    content: "Explore Vietnam's Top State Schools with Us",
                },
                {
                    id: 'heroBanner-paragraph1',
                    type: 'paragraph',
                    content: "Welcome to UCV - we aim to bridge top schools in Vietnam and international universities. We're a unique connector - we have years of experience on both the university and the school side.",
                },
                {
                    id: 'heroBanner-paragraph2',
                    type: 'paragraph',
                    content: "Specializing in crafting quality school tours across Central and Northern Vietnam, we focus primarily on state schools (mostly Schools for gifted students).",
                },
                {
                    id: 'heroBanner-tour-title',
                    type: 'heading',
                    content: "Tour Spring 2025",
                },
                {
                    id: 'heroBanner-tour-desc',
                    type: 'paragraph',
                    content: "Short Descripton At IUC, we're passionate about bridging the gap between ...",
                },
                {
                    id: 'heroBanner-button',
                    type: 'button',
                    content: "Find out more",
                },
                {
                    id: 'heroBanner-carousel-images',
                    type: 'image',
                    content: '',
                    metadata: {
                        images: [
                            "/hero-banner-1.png",
                            "/hero-banner-2.png",
                            "/hero-banner-3.png",
                        ]
                    }
                }
            ]
        },
        aboutUs: {
            title: 'About Us Section',
            items: [
                {
                    id: 'aboutUs-heading',
                    type: 'heading',
                    content: "ABOUT US",
                },
                {
                    id: 'aboutUs-subheading',
                    type: 'heading',
                    content: "We're passionate about bridging the gap between international universities and Vietnam's top state schools.",
                },
                {
                    id: 'aboutUs-paragraph1',
                    type: 'paragraph',
                    content: "At UCV, we're passionate about bridging the gap between international universities and Vietnam's top state schools. Based in the heart of Vietnam, we've spent years cultivating relationships with leading educational institutions in Central and Northern regions.",
                },
                {
                    id: 'aboutUs-paragraph2',
                    type: 'paragraph',
                    content: "Our mission? To help university representatives like you unlock access to these schools. With our local expertise and tailored approach, we make your outreach seamless, impactful, and rewarding.",
                },
                {
                    id: 'aboutUs-button',
                    type: 'button',
                    content: "Get to Know Us Better",
                },
                {
                    id: 'aboutUs-image',
                    type: 'image',
                    content: "/about-us.png",
                },
                {
                    id: 'aboutUs-stat1',
                    type: 'statistic',
                    content: "03",
                    metadata: {
                        title: "Successful",
                        subtitle: "Tours Organized",
                        icon: "/edu-icon.svg"
                    }
                },
                {
                    id: 'aboutUs-stat2',
                    type: 'statistic',
                    content: "41",
                    metadata: {
                        title: "Collaborations",
                        subtitle: "with Schools",
                        icon: "School"
                    }
                },
                {
                    id: 'aboutUs-stat3',
                    type: 'statistic',
                    content: "06",
                    metadata: {
                        title: "Returning",
                        subtitle: "UNIS",
                        icon: "/person-icon.svg"
                    }
                },
                {
                    id: 'aboutUs-tourHeading',
                    type: 'heading',
                    content: "Our tours are your key to Vietnam's top state schools.",
                },
                // Location card
                {
                    id: 'aboutUs-location-title',
                    type: 'heading',
                    content: "LOCATIONS",
                },
                {
                    id: 'aboutUs-location-icon',
                    type: 'image',
                    content: "/map-pin.svg",
                },
                {
                    id: 'aboutUs-location-content',
                    type: 'paragraph',
                    content: "Currently we focus on Central and Northern Vietnam.",
                },
                // What We Offer card
                {
                    id: 'aboutUs-offer-title',
                    type: 'heading',
                    content: "WHAT WE OFFER",
                },
                {
                    id: 'aboutUs-offer-icon',
                    type: 'image',
                    content: "/edu.svg",
                },
                {
                    id: 'aboutUs-offer-content',
                    type: 'paragraph',
                    content: "Guided visits with school administrators and faculty.\nIn-school preparation before the tour through workshops.\nOpportunities to present your university and network with students through a mix of the following:\n- Panel talks\n- Elevator pitches\n- Workshops\n- Mini fairs\nCultural insights to enhance your experience.",
                },
                // Our Support card
                {
                    id: 'aboutUs-support-title',
                    type: 'heading',
                    content: "OUR SUPPORT",
                },
                {
                    id: 'aboutUs-support-icon',
                    type: 'image',
                    content: "/support.svg",
                },
                {
                    id: 'aboutUs-support-content',
                    type: 'paragraph',
                    content: "2 - 3 school visits per day\nFull logistics (Support throughout the tour and school visits)\nOne stall at each school fair\nIntra and inter city transport (on the ground travel - not including flights)\nReception dinner\nDaily lunches\nCoffee breaks\nGroup dinners (75% of the time)\nHotel suggestions & discounts\n1 - 2 pages in university booklet for schools",
                },
            ]
        },
        discoverTour: {
            title: 'Discover School Tour Section',
            items: [
                {
                    id: 'discoverTour-heading',
                    type: 'heading',
                    content: "DISCOVER OUR SCHOOL TOURS",
                },
                {
                    id: 'discoverTour-title',
                    type: 'heading',
                    content: "Exclusive access to prestigious state schools, hand-picked for their academic excellence.",
                },
                {
                    id: 'discoverTour-description',
                    type: 'paragraph',
                    content: "As we know the intense schedule university reps have, we tailor our tours to be highly productive and fun at the same time. We want you to leave feeling you've experienced new parts of this beautiful country, enjoying the culinary gems along the way. You won't be disappointed.",
                },
                {
                    id: 'discoverTour-button',
                    type: 'button',
                    content: "Explore All Our Tours",
                },
                // Tour Card 1
                {
                    id: 'discoverTour-card1-date',
                    type: 'heading',
                    content: "INCOMING • JULY 4",
                },
                {
                    id: 'discoverTour-card1-title',
                    type: 'heading',
                    content: "Tour Spring 2025",
                },
                {
                    id: 'discoverTour-card1-description',
                    type: 'paragraph',
                    content: "Short Description At IUC, we're passionate about bridging the gap between international universities ...",
                },
                {
                    id: 'discoverTour-card1-button',
                    type: 'button',
                    content: "Find out more",
                },
                {
                    id: 'discoverTour-card1-price',
                    type: 'heading',
                    content: "$2065",
                },
                // Tour Card 2
                {
                    id: 'discoverTour-card2-date',
                    type: 'heading',
                    content: "INCOMING • JULY 4",
                },
                {
                    id: 'discoverTour-card2-title',
                    type: 'heading',
                    content: "Tour Spring 2025",
                },
                {
                    id: 'discoverTour-card2-description',
                    type: 'paragraph',
                    content: "Short Description At IUC, we're passionate about bridging the gap between international universities ...",
                },
                {
                    id: 'discoverTour-card2-button',
                    type: 'button',
                    content: "Find out more",
                },
                {
                    id: 'discoverTour-card2-price',
                    type: 'heading',
                    content: "$2065",
                },
                // Tour Card 3
                {
                    id: 'discoverTour-card3-date',
                    type: 'heading',
                    content: "INCOMING • JULY 4",
                },
                {
                    id: 'discoverTour-card3-title',
                    type: 'heading',
                    content: "Tour Spring 2025",
                },
                {
                    id: 'discoverTour-card3-description',
                    type: 'paragraph',
                    content: "Short Description At IUC, we're passionate about bridging the gap between international universities ...",
                },
                {
                    id: 'discoverTour-card3-button',
                    type: 'button',
                    content: "Find out more",
                },
                {
                    id: 'discoverTour-card3-price',
                    type: 'heading',
                    content: "$2065",
                }
            ]
        },
        testimonials: {
            title: 'Testimonials Section',
            items: [
                {
                    id: 'testimonials-heading',
                    type: 'heading',
                    content: "TESTIMONIALS",
                },
                {
                    id: 'testimonials-title',
                    type: 'heading',
                    content: "What Universities Say About Us",
                },
                // Testimonial 1
                {
                    id: 'testimonial-1-content',
                    type: 'paragraph',
                    content: "Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text ever since the 1500s, when an unknown printer took.",
                },
                {
                    id: 'testimonial-1-university',
                    type: 'heading',
                    content: "Alberta University",
                },
                {
                    id: 'testimonial-1-subtitle',
                    type: 'heading',
                    content: "Title something",
                },
                // Testimonial 2
                {
                    id: 'testimonial-2-content',
                    type: 'paragraph',
                    content: "Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text ever since the 1500s, when an unknown printer took.",
                },
                {
                    id: 'testimonial-2-university',
                    type: 'heading',
                    content: "Alberta University",
                },
                {
                    id: 'testimonial-2-subtitle',
                    type: 'heading',
                    content: "Title something",
                },
                // Testimonial 3
                {
                    id: 'testimonial-3-content',
                    type: 'paragraph',
                    content: "Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text ever since the 1500s, when an unknown printer took.",
                },
                {
                    id: 'testimonial-3-university',
                    type: 'heading',
                    content: "Alberta University",
                },
                {
                    id: 'testimonial-3-subtitle',
                    type: 'heading',
                    content: "Title something",
                }
            ]
        },
        footer: {
            title: 'Footer Section',
            items: [
                {
                    id: 'footer-description',
                    type: 'paragraph',
                    content: "Help university representatives like you unlock access to these schools through expertly curated tours.",
                },
                {
                    id: 'footer-phone',
                    type: 'heading',
                    content: "+84 (0)34444 8680",
                },
                {
                    id: 'footer-email1',
                    type: 'heading',
                    content: "bernd@iucconsulting.com",
                },
                {
                    id: 'footer-email2',
                    type: 'heading',
                    content: "bfwidemann@gmail.com",
                },
                {
                    id: 'footer-copyright',
                    type: 'heading',
                    content: "2025©UCV. All rights reserved.",
                },
                {
                    id: 'footer-contact-heading',
                    type: 'heading',
                    content: "GET IN TOUCH",
                },
                {
                    id: 'footer-contact-title',
                    type: 'heading',
                    content: "Build partnerships, explore opportunities, and experience Vietnam's vibrant education landscape firsthand.",
                }
            ]
        }
    }
};

// Initial content for the About Us page
const initialAboutUsContent: PageContent = {
    pageName: 'about-us',
    sections: {
        mainBanner: {
            title: 'Main Banner Section',
            items: [
                {
                    id: 'mainBanner-heading',
                    type: 'heading',
                    content: "We're passionate about bridging the gap between international universities and Vietnam's top state schools.",
                },
                {
                    id: 'mainBanner-image',
                    type: 'image',
                    content: "/about-us.png",
                }
            ]
        },
        carouselSection: {
            title: 'Carousel Section',
            items: [
                {
                    id: 'carousel-image1',
                    type: 'image',
                    content: "/classroom.png",
                },
                {
                    id: 'carousel-image2',
                    type: 'image',
                    content: "/display1.png",
                },
                {
                    id: 'carousel-image3',
                    type: 'image',
                    content: "/display2.png",
                },
                {
                    id: 'carousel-button',
                    type: 'button',
                    content: "CHECK OUT OUR PORTFOLIO",
                }
            ]
        },
        whoWeAre: {
            title: 'Who We Are Section',
            items: [
                {
                    id: 'whoWeAre-title',
                    type: 'heading',
                    content: "WHO WE ARE",
                },
                {
                    id: 'whoWeAre-content',
                    type: 'paragraph',
                    content: "At UCV, we're passionate about bridging the gap between international universities and Vietnam's top state schools. Based in the heart of Vietnam, we've spent years cultivating relationships with leading educational institutions in Central and Northern regions.",
                }
            ]
        },
        ourMission: {
            title: 'Our Mission Section',
            items: [
                {
                    id: 'ourMission-title',
                    type: 'heading',
                    content: "OUR MISSION",
                },
                {
                    id: 'ourMission-content',
                    type: 'paragraph',
                    content: "To help university representatives like you unlock access to these schools. With our local expertise and tailored approach, we make your outreach seamless, impactful, and rewarding.",
                }
            ]
        },
        statistics: {
            title: 'Statistics Section',
            items: [
                {
                    id: 'statistics-stat1',
                    type: 'statistic',
                    content: "03",
                    metadata: {
                        title: "Successful",
                        subtitle: "Tours Organized",
                        icon: "/edu-icon.svg"
                    }
                },
                {
                    id: 'statistics-stat2',
                    type: 'statistic',
                    content: "41",
                    metadata: {
                        title: "Collaborations",
                        subtitle: "with Schools",
                        icon: "School"
                    }
                },
                {
                    id: 'statistics-stat3',
                    type: 'statistic',
                    content: "06",
                    metadata: {
                        title: "Returning",
                        subtitle: "UNIS",
                        icon: "/person-icon.svg"
                    }
                }
            ]
        }
    }
};

// Initial content for the Our Tours page
const initialOurToursContent: PageContent = {
    pageName: 'our-tours',
    sections: {
        headerSection: {
            title: 'Header Section',
            items: [
                {
                    id: 'headerSection-title',
                    type: 'heading',
                    content: "Exclusive access to prestigious state schools, hand-picked for their academic excellence.",
                },
                {
                    id: 'headerSection-description',
                    type: 'paragraph',
                    content: "As we know the intense schedule university reps have, we tailor our tours to be highly productive and fun at the same time. We want you to leave feeling you've experienced new parts of this beautiful country, enjoying the culinary gems along the way. You won't be disappointed.",
                }
            ]
        }
    }
};

// Initial content for the Tour Details page
const initialTourDetailsContent: PageContent = {
    pageName: 'tour-details',
    sections: {
        bannerSection: {
            title: 'Banner Section',
            items: [
                {
                    id: 'tourBanner-date',
                    type: 'heading',
                    content: "INCOMING • JULY 4",
                },
                {
                    id: 'tourBanner-title',
                    type: 'heading',
                    content: "Tour Spring 2025",
                },
                {
                    id: 'tourBanner-description',
                    type: 'paragraph',
                    content: "Visiting a mix of top public and private high schools in Hue, Danang and Tam Ky. We are adding two promising schools in Tam Ky, which is the capital of Quang Nam province - home to the beautiful Hoi An. The participating schools demonstrate a keen interest in international education.\n\nWe've curated our selection with local experts considering socio-economic demographics to ensure a valuable visit for you.",
                },
                {
                    id: 'tourBanner-location',
                    type: 'heading',
                    content: "Central Vietnam (Hue, Da Nang)",
                },
                {
                    id: 'tourBanner-duration',
                    type: 'paragraph',
                    content: "We are aiming to visit 10 - 12 schools, in these 3 cities over 4 days.",
                },
                {
                    id: 'tourBanner-startDate',
                    type: 'heading',
                    content: "July, 2025",
                },
            ]
        },
        eventsSection: {
            title: 'Events Section',
            items: [
                {
                    id: 'events-heading',
                    type: 'heading',
                    content: "EVENTS IN THE SCHOOLS",
                },
                {
                    id: 'events-title',
                    type: 'heading',
                    content: "Make the school visits more productive and memorable for both you and the students.",
                },
                {
                    id: 'events-item1',
                    type: 'paragraph',
                    content: "In-school preparation workshops (by IUC)",
                },
                {
                    id: 'events-item2',
                    type: 'paragraph',
                    content: "Panel talks",
                },
                {
                    id: 'events-item3',
                    type: 'paragraph',
                    content: "Elevator pitches",
                },
                {
                    id: 'events-item4',
                    type: 'paragraph',
                    content: "Workshops",
                },
                {
                    id: 'events-item5',
                    type: 'paragraph',
                    content: "Mini fairs",
                },
            ]
        },
        locationsSection: {
            title: 'Locations Section',
            items: [
                {
                    id: 'locations-heading',
                    type: 'heading',
                    content: "SPRING TOUR",
                },
                {
                    id: 'locations-title',
                    type: 'heading',
                    content: "We are aiming to visit 10 - 12 schools, in these 3 cities over 4 days.",
                },
                {
                    id: 'locations-hue',
                    type: 'heading',
                    content: "Hue",
                },
                {
                    id: 'locations-danang',
                    type: 'heading',
                    content: "Da Nang",
                },
                {
                    id: 'locations-tamky',
                    type: 'heading',
                    content: "Tam Ky/Hoi An",
                },
            ]
        },
        pricingSection: {
            title: 'Pricing Section',
            items: [
                {
                    id: 'pricing-heading',
                    type: 'heading',
                    content: "PRICING",
                },
                {
                    id: 'pricing-title',
                    type: 'heading',
                    content: "We offer an Early Bird discount as well as an extra discount for returning universities",
                },
                {
                    id: 'pricing-earlybird-deadline',
                    type: 'heading',
                    content: "Early Bird - 24 Dec 2024",
                },
                {
                    id: 'pricing-earlybird-price',
                    type: 'heading',
                    content: "USD $2065",
                },
                {
                    id: 'pricing-earlybird-returning',
                    type: 'heading',
                    content: "USD $1700",
                },
                {
                    id: 'pricing-standard-deadline',
                    type: 'heading',
                    content: "Standard - 15 Jan 2025",
                },
                {
                    id: 'pricing-standard-price',
                    type: 'heading',
                    content: "USD $2430",
                },
                {
                    id: 'pricing-standard-returning',
                    type: 'heading',
                    content: "USD $2065",
                },
                {
                    id: 'pricing-custom-title',
                    type: 'heading',
                    content: "Tailor your perfect tour",
                },
                {
                    id: 'pricing-custom-description',
                    type: 'paragraph',
                    content: "Customized school tours connecting top Vietnamese schools with international universities.",
                },
            ]
        },
        packageSection: {
            title: 'Package Section',
            items: [
                {
                    id: 'package-heading',
                    type: 'heading',
                    content: "THE PACKAGE INCLUDES",
                },
                {
                    id: 'package-items1',
                    type: 'paragraph',
                    content: "9 - 11 school visits in 3 cities.\nSupport throughout the tour and school visits.\nOne stall at each school fair.\nReception dinner.",
                },
                {
                    id: 'package-items2',
                    type: 'paragraph',
                    content: "Refreshments and snacks between sessions.\nLunch, coffee and dinner on all 4 days (no dinner on final day).\nIntra and inter city transport (in Hue, Danang and Tam Ky).\nHotel suggestions & discount.",
                },
            ]
        },
    }
};

// Initial content for the Sign Up Form page
const initialSignUpFormContent: PageContent = {
    pageName: 'signup-form',
    sections: {
        headerSection: {
            title: 'Header Section',
            items: [
                {
                    id: 'signup-header-title',
                    type: 'heading',
                    content: "Join Our Next Tour",
                },
                {
                    id: 'signup-header-description',
                    type: 'paragraph',
                    content: "Ready to connect with Vietnam's top state schools? Sign up now to secure your spot on one of our exclusive tours. Simply fill out the form below, and we'll reach out with the next steps.",
                }
            ]
        },
        step1Section: {
            title: 'Step 1 - Basic Information',
            items: [
                {
                    id: 'step1-heading',
                    type: 'heading',
                    content: "Share Your Details & Let's Connect!",
                },
                {
                    id: 'step1-fullname-label',
                    type: 'heading',
                    content: "Full name",
                },
                {
                    id: 'step1-organization-label',
                    type: 'heading',
                    content: "University/Organization",
                },
                {
                    id: 'step1-phone-label',
                    type: 'heading',
                    content: "Phone number",
                },
                {
                    id: 'step1-email-label',
                    type: 'heading',
                    content: "Email",
                },
                {
                    id: 'step1-callback-label',
                    type: 'paragraph',
                    content: "Check this box if you'd like to discuss any details - we're happy to schedule a call and answer your questions!",
                },
                {
                    id: 'step1-next-button',
                    type: 'heading',
                    content: "Next Step",
                }
            ]
        },
        step2Section: {
            title: 'Step 2 - Tour Package',
            items: [
                {
                    id: 'step2-heading',
                    type: 'heading',
                    content: "Tailor Your Tour",
                },
                {
                    id: 'step2-tour-date',
                    type: 'heading',
                    content: "INCOMING • JULY 4",
                },
                {
                    id: 'step2-tour-title',
                    type: 'heading',
                    content: "Tour Spring 2025",
                },
                {
                    id: 'step2-location-title',
                    type: 'heading',
                    content: "LOCATION",
                },
                {
                    id: 'step2-location-content',
                    type: 'paragraph',
                    content: "Central Vietnam (Hue, Da Nang)",
                },
                {
                    id: 'step2-duration-title',
                    type: 'heading',
                    content: "DURATION",
                },
                {
                    id: 'step2-duration-content',
                    type: 'paragraph',
                    content: "We are aiming to visit 10 - 12 schools, in these 3 cities over 4 days.",
                },
                {
                    id: 'step2-registration-title',
                    type: 'heading',
                    content: "Registration",
                },
                {
                    id: 'step2-returning-title',
                    type: 'heading',
                    content: "Returning University",
                },
                {
                    id: 'step2-earlybird-title',
                    type: 'heading',
                    content: "Early Bird - 24 December 2024",
                },
                {
                    id: 'step2-include-title',
                    type: 'heading',
                    content: "Price include",
                },
                {
                    id: 'step2-include-list',
                    type: 'paragraph',
                    content: "9 - 11 school visits in 3 cities.\nSupport throughout the tour and school visits.\nOne stall at each school fair.\nReception dinner.\nRefreshments and snacks between sessions.\nLunch, coffee and dinner on all 4 days (no dinner on final day).\nIntra and inter city transport (in Hue, Danang and Tam Ky).\nHotel suggestions & discount.",
                },
                {
                    id: 'step2-preferences-title',
                    type: 'heading',
                    content: "Adjust everything to fit your preferences!",
                },
                {
                    id: 'step2-cities-title',
                    type: 'heading',
                    content: "School Visits in Selected Cities",
                },
                {
                    id: 'step2-hue-label',
                    type: 'heading',
                    content: "Hue",
                },
                {
                    id: 'step2-danang-label',
                    type: 'heading',
                    content: "Danang",
                },
                {
                    id: 'step2-tamky-label',
                    type: 'heading',
                    content: "Tam Ky/Hoi An",
                },
                {
                    id: 'step2-transfers-title',
                    type: 'heading',
                    content: "Seamless Stay & City Transfers",
                },
                {
                    id: 'step2-hotel-label',
                    type: 'heading',
                    content: "Hotel for 4 days",
                },
                {
                    id: 'step2-travel-label',
                    type: 'heading',
                    content: "Travel Between 3 Cities",
                },
                {
                    id: 'step2-price',
                    type: 'heading',
                    content: "USD $1700",
                },
                {
                    id: 'step2-back-button',
                    type: 'heading',
                    content: "Back",
                },
                {
                    id: 'step2-next-button',
                    type: 'heading',
                    content: "Next Step",
                }
            ]
        },
        step3Section: {
            title: 'Step 3 - Contract Details',
            items: [
                {
                    id: 'step3-heading',
                    type: 'heading',
                    content: "Final Details for Your Tour",
                },
                {
                    id: 'step3-organization-label',
                    type: 'heading',
                    content: "Organization",
                },
                {
                    id: 'step3-headoffice-label',
                    type: 'heading',
                    content: "Head office address",
                },
                {
                    id: 'step3-registration-label',
                    type: 'heading',
                    content: "Business registration number",
                },
                {
                    id: 'step3-representative-label',
                    type: 'heading',
                    content: "Legal representative",
                },
                {
                    id: 'step3-position-label',
                    type: 'heading',
                    content: "Position",
                },
                {
                    id: 'step3-phone-label',
                    type: 'heading',
                    content: "Phone",
                },
                {
                    id: 'step3-email-label',
                    type: 'heading',
                    content: "Email",
                },
                {
                    id: 'step3-account-label',
                    type: 'heading',
                    content: "Company account number",
                },
                {
                    id: 'step3-bank-label',
                    type: 'heading',
                    content: "at bank",
                },
                {
                    id: 'step3-swift-label',
                    type: 'heading',
                    content: "SWIFT (Optional)",
                },
                {
                    id: 'step3-back-button',
                    type: 'heading',
                    content: "Back",
                },
                {
                    id: 'step3-submit-button',
                    type: 'heading',
                    content: "Done! Let's Get Started",
                }
            ]
        },
        successSection: {
            title: 'Success Screen',
            items: [
                {
                    id: 'success-heading',
                    type: 'heading',
                    content: "You're all set!",
                },
                {
                    id: 'success-message',
                    type: 'paragraph',
                    content: "Thank you for completing the form. Our team will review your details and get in touch with you shortly. If you have any questions, feel free to reach out!\n\nYour contract will be emailed to you soon.",
                },
                {
                    id: 'success-button',
                    type: 'heading',
                    content: "Back to Tours",
                }
            ]
        }
    }
};

interface ContentStore {
    pages: PageContent[];
    getPageContent: (pageName: string) => PageContent | undefined;
    getItemById: (pageName: string, sectionId: string, itemId: string) => ContentItem | undefined;
    updateContent: (update: ContentUpdate) => void;
    resetToDefault: () => void;
}

export const useContentStore = create<ContentStore>()(
    persist(
        (set, get) => ({
            pages: [initialHomeContent, initialAboutUsContent, initialOurToursContent, initialTourDetailsContent, initialSignUpFormContent],
            
            getPageContent: (pageName: string) => {
                return get().pages.find(page => page.pageName === pageName);
            },
            
            getItemById: (pageName: string, sectionId: string, itemId: string) => {
                const page = get().pages.find(page => page.pageName === pageName);
                if (!page) return undefined;
                
                const section = page.sections[sectionId];
                if (!section) return undefined;
                
                return section.items.find(item => item.id === itemId);
            },
            
            updateContent: (update: ContentUpdate) => {
                set(state => {
                    const newPages = [...state.pages];
                    const pageIndex = newPages.findIndex(page => page.pageName === update.pageName);
                    
                    if (pageIndex === -1) return state;
                    
                    const page = { ...newPages[pageIndex] }; // Create a shallow copy of the page
                    newPages[pageIndex] = page; // Replace the page in newPages with the copy
                    
                    const section = { ...page.sections[update.sectionId] }; // Create a shallow copy of the section
                    page.sections = { ...page.sections, [update.sectionId]: section }; // Replace the section in the page copy
                    
                    if (!section) return state;
                    
                    const itemIndex = section.items.findIndex(item => item.id === update.itemId);
                    
                    if (itemIndex === -1) return state;
                    
                    // Create a new items array with the updated item
                    const updatedItems = [...section.items];
                    const updatedItem = {
                        ...updatedItems[itemIndex],
                        content: update.content
                    };
                    
                    if (update.metadata) {
                        updatedItem.metadata = {
                            ...updatedItem.metadata,
                            ...update.metadata
                        };
                    }
                    
                    updatedItems[itemIndex] = updatedItem;
                    section.items = updatedItems;
                    
                    // Force a re-render by returning a new object
                    return { pages: newPages };
                });
            },
            
            // Add a function to reset the content to default values
            resetToDefault: () => {
                set({ pages: [initialHomeContent, initialAboutUsContent, initialOurToursContent, initialTourDetailsContent, initialSignUpFormContent] });
            }
        }),
        {
            name: 'content-storage',
            onRehydrateStorage: () => {
                return (state, error) => {
                    if (error || !state) {
                        console.log('Error rehydrating storage:', error);
                        return;
                    }
                    
                    // Check if we need to merge in new sections that aren't in the stored state
                    const homeContent = state.pages.find(page => page.pageName === 'home');
                    if (homeContent) {
                        let needsUpdate = false;
                        const updatedSections = { ...homeContent.sections };
                        
                        // Check for new sections in initialHomeContent
                        Object.entries(initialHomeContent.sections).forEach(([sectionId, section]) => {
                            if (!homeContent.sections[sectionId]) {
                                updatedSections[sectionId] = section;
                                needsUpdate = true;
                            }
                        });
                        
                        // If we found new sections, update the store
                        if (needsUpdate) {
                            const updatedPages = [...state.pages];
                            const pageIndex = updatedPages.findIndex(page => page.pageName === 'home');
                            updatedPages[pageIndex] = {
                                ...updatedPages[pageIndex],
                                sections: updatedSections
                            };
                            
                            state.pages = updatedPages;
                        }
                    }
                    
                    // Check if About Us page exists, if not add it
                    if (!state.pages.find(page => page.pageName === 'about-us')) {
                        state.pages.push(initialAboutUsContent);
                    } else {
                        // Similar to home, check for new sections in the About Us page
                        const aboutUsContent = state.pages.find(page => page.pageName === 'about-us');
                        if (aboutUsContent) {
                            let needsUpdate = false;
                            const updatedSections = { ...aboutUsContent.sections };
                            
                            // Check for new sections in initialAboutUsContent
                            Object.entries(initialAboutUsContent.sections).forEach(([sectionId, section]) => {
                                if (!aboutUsContent.sections[sectionId]) {
                                    updatedSections[sectionId] = section;
                                    needsUpdate = true;
                                }
                            });
                            
                            // If we found new sections, update the store
                            if (needsUpdate) {
                                const updatedPages = [...state.pages];
                                const pageIndex = updatedPages.findIndex(page => page.pageName === 'about-us');
                                updatedPages[pageIndex] = {
                                    ...updatedPages[pageIndex],
                                    sections: updatedSections
                                };
                                
                                state.pages = updatedPages;
                            }
                        }
                    }
                    
                    // Check if Our Tours page exists, if not add it
                    if (!state.pages.find(page => page.pageName === 'our-tours')) {
                        state.pages.push(initialOurToursContent);
                    } else {
                        // Similar to home, check for new sections in the Our Tours page
                        const ourToursContent = state.pages.find(page => page.pageName === 'our-tours');
                        if (ourToursContent) {
                            let needsUpdate = false;
                            const updatedSections = { ...ourToursContent.sections };
                            
                            // Check for new sections in initialOurToursContent
                            Object.entries(initialOurToursContent.sections).forEach(([sectionId, section]) => {
                                if (!ourToursContent.sections[sectionId]) {
                                    updatedSections[sectionId] = section;
                                    needsUpdate = true;
                                }
                            });
                            
                            // If we found new sections, update the store
                            if (needsUpdate) {
                                const updatedPages = [...state.pages];
                                const pageIndex = updatedPages.findIndex(page => page.pageName === 'our-tours');
                                updatedPages[pageIndex] = {
                                    ...updatedPages[pageIndex],
                                    sections: updatedSections
                                };
                                
                                state.pages = updatedPages;
                            }
                        }
                    }
                    
                    // Check if Tour Details page exists, if not add it
                    if (!state.pages.find(page => page.pageName === 'tour-details')) {
                        state.pages.push(initialTourDetailsContent);
                    } else {
                        // Similar to other pages, check for new sections in the Tour Details page
                        const tourDetailsContent = state.pages.find(page => page.pageName === 'tour-details');
                        if (tourDetailsContent) {
                            let needsUpdate = false;
                            const updatedSections = { ...tourDetailsContent.sections };
                            
                            // Check for new sections in initialTourDetailsContent
                            Object.entries(initialTourDetailsContent.sections).forEach(([sectionId, section]) => {
                                if (!tourDetailsContent.sections[sectionId]) {
                                    updatedSections[sectionId] = section;
                                    needsUpdate = true;
                                }
                            });
                            
                            // If we found new sections, update the store
                            if (needsUpdate) {
                                const updatedPages = [...state.pages];
                                const pageIndex = updatedPages.findIndex(page => page.pageName === 'tour-details');
                                updatedPages[pageIndex] = {
                                    ...updatedPages[pageIndex],
                                    sections: updatedSections
                                };
                                
                                state.pages = updatedPages;
                            }
                        }
                    }
                    
                    // Check if Sign Up Form page exists, if not add it
                    if (!state.pages.find(page => page.pageName === 'signup-form')) {
                        state.pages.push(initialSignUpFormContent);
                    } else {
                        // Similar to other pages, check for new sections in the Sign Up Form page
                        const signUpFormContent = state.pages.find(page => page.pageName === 'signup-form');
                        if (signUpFormContent) {
                            let needsUpdate = false;
                            const updatedSections = { ...signUpFormContent.sections };
                            
                            // Check for new sections in initialSignUpFormContent
                            Object.entries(initialSignUpFormContent.sections).forEach(([sectionId, section]) => {
                                if (!signUpFormContent.sections[sectionId]) {
                                    updatedSections[sectionId] = section;
                                    needsUpdate = true;
                                }
                            });
                            
                            // If we found new sections, update the store
                            if (needsUpdate) {
                                const updatedPages = [...state.pages];
                                const pageIndex = updatedPages.findIndex(page => page.pageName === 'signup-form');
                                updatedPages[pageIndex] = {
                                    ...updatedPages[pageIndex],
                                    sections: updatedSections
                                };
                                
                                state.pages = updatedPages;
                            }
                        }
                    }
                };
            }
        }
    )
); 