import { create } from 'zustand';
import { ContentItem, PageContent, ContentUpdate } from './types';
import { contentApi } from './api';

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
                    content: "Specializing in crafting quality school tours across Vietnam, we focus primarily on state schools (mostly Schools for gifted students).",
                },
                {
                    id: 'heroBanner-paragraph3',
                    type: 'paragraph',
                    content: "Join us to build partnerships, explore opportunities, and experience Vietnam's vibrant education landscape.",
                },
                {
                    id: 'heroBanner-button',
                    type: 'button',
                    content: "Find out more",
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
                    content: "Thank you so much for this perfectly organized tour! We had a wonderful opportunity to introduce our school to the students in the middle of Vietnam. We've also learned a lot from your team's hospitality! Thanks to you and your team!",
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
                    content: "Once again, I would like to thank you, Berni and all of your team members! The tour was incredibly well-organized, everyone was thoughtful, and we had a meaningful time visiting many high schools.",
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
                    content: "Thank you for this lovely experience. I really appreciate all the time and organization a tour like this would have taken. You (and your team) were exceptional! I hope to have the opportunity to work with you in the future.",
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
                    content: "info@ucv.com.vn",
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
        },
        imageCarousel: {
            title: 'Image Carousel Section',
            items: [
                {
                    id: 'carousel-image-1',
                    type: 'image',
                    content: '/display1.png',
                    metadata: {
                        alt: 'Students at an event'
                    }
                },
                {
                    id: 'carousel-image-2',
                    type: 'image',
                    content: '/display2.png',
                    metadata: {
                        alt: 'Academic conference'
                    }
                },
                {
                    id: 'carousel-image-3',
                    type: 'image',
                    content: '/display3.jpg',
                    metadata: {
                        alt: 'Classroom session'
                    }
                },
                {
                    id: 'carousel-image-4',
                    type: 'image',
                    content: '/display5.jpg',
                    metadata: {
                        alt: 'Classroom session'
                    }
                },
                {
                    id: 'carousel-image-5',
                    type: 'image',
                    content: '/display6.jpg',
                    metadata: {
                        alt: 'Classroom session'
                    }
                },
                {
                    id: 'carousel-image-6',
                    type: 'image',
                    content: '/display7.jpg',
                    metadata: {
                        alt: 'Classroom session'
                    }
                },
                {
                    id: 'carousel-image-7',
                    type: 'image',
                    content: '/display8.jpg',
                    metadata: {
                        alt: 'Classroom session'
                    }
                },
                {
                    id: 'carousel-image-8',
                    type: 'image',
                    content: '/display9.jpg',
                    metadata: {
                        alt: 'Classroom session'
                    }
                },
                {
                    id: 'carousel-image-9',
                    type: 'image',
                    content: '/display4.png',
                    metadata: {
                        alt: 'Students collaborating'
                    }
                },
                {
                    id: 'carousel-image-10',
                    type: 'image',
                    content: '/university-event.png',
                    metadata: {
                        alt: 'School exhibition'
                    }
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
                    content: "Visiting a mix of top public and private high schools in Hanoi, Hai Duong, Hue & Da Nang. The participating schools demonstrate a keen interest in international education. We've curated our selection with local experts considering socio-economic demographics to ensure a valuable visit for you.",
                },
                {
                    id: 'tourBanner-location',
                    type: 'heading',
                    content: "Central Vietnam (Hue, Da Nang)",
                },
                {
                    id: 'tourBanner-duration',
                    type: 'paragraph',
                    content: "We are aiming to visit",
                },
                {
                    id: 'tourBanner-startDate',
                    type: 'heading',
                    content: "July, 2025",
                },
                {
                    id: 'tourBanner-locationLabel',
                    type: 'heading',
                    content: "LOCATION",
                },
                {
                    id: 'tourBanner-durationLabel',
                    type: 'heading',
                    content: "DURATION",
                },
                {
                    id: 'tourBanner-customizeLabel',
                    type: 'heading',
                    content: "CUSTOMIZE",
                },
                {
                    id: 'tourBanner-tourDatesLabel',
                    type: 'heading',
                    content: "Tour dates",
                },
                {
                    id: 'tourBanner-signUpButton',
                    type: 'button',
                    content: "Sign Up Now",
                },
                {
                    id: 'tourBanner-shareLabel',
                    type: 'heading',
                    content: "Share",
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
                    content: "TOUR LOCATIONS",
                },
                {
                    id: 'locations-title',
                    type: 'heading',
                    content: "We are aiming to visit",
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
                    id: 'pricing-tableHeader1',
                    type: 'heading',
                    content: "Registration Deadline",
                },
                {
                    id: 'pricing-tableHeader2',
                    type: 'heading',
                    content: "Standard Price",
                },
                {
                    id: 'pricing-tableHeader3',
                    type: 'heading',
                    content: "Returning University",
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
                {
                    id: 'pricing-custom-button',
                    type: 'button',
                    content: "Sign Up Now",
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
        otherToursSection: {
            title: 'Other Tours Section',
            items: [
                {
                    id: 'otherTours-heading',
                    type: 'heading',
                    content: "OTHER TOURS",
                },
            ]
        },
    }
};

// Initial content for the Spring Tour Details page
const initialSpringTourDetailsContent: PageContent = {
    pageName: 'spring-tour-details',
    sections: {
        bannerSection: {
            title: 'Banner Section',
            items: [
                {
                    id: 'tourBanner-date',
                    type: 'heading',
                    content: "INCOMING • 31 MARCH - 10 APRIL 2026",
                },
                {
                    id: 'tourBanner-title',
                    type: 'heading',
                    content: "Spring Tour 2026",
                },
                {
                    id: 'tourBanner-description',
                    type: 'paragraph',
                    content: "Explore the vibrant educational landscape of Northern, Central & Southern Vietnam's best institutions. This spring tour offers unique access to top-rated schools in Hanoi, Hai Phong, Hue, Da Nang & Ho Chi Minh City.\n\nThis tour has been carefully designed to showcase schools with strong English programs and students particularly interested in international education opportunities. Each school visit is optimized for meaningful connections and productive discussions.",
                },
                {
                    id: 'tourBanner-location',
                    type: 'heading',
                    content: "Northern Vietnam (Hanoi, Hai Duong)",
                },
                {
                    id: 'tourBanner-duration',
                    type: 'paragraph',
                    content: "10 schools across 3 northern cities over 5 days.",
                },
                {
                    id: 'tourBanner-customize',
                    type: 'paragraph',
                    content: "Select from the full experience or customize to specific regions.",
                },
                {
                    id: 'tourBanner-startDate',
                    type: 'heading',
                    content: "April, 2026",
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
                    content: "Engage directly with qualified students through diverse and interactive events.",
                },
                {
                    id: 'events-item1',
                    type: 'paragraph',
                    content: "In-school preparation workshops (by IUC)",
                },
                {
                    id: 'events-item2',
                    type: 'paragraph',
                    content: "University spotlight presentations",
                },
                {
                    id: 'events-item3',
                    type: 'paragraph',
                    content: "Interactive Q&A sessions",
                },
                {
                    id: 'events-item4',
                    type: 'paragraph',
                    content: "Student recruitment workshops",
                },
                {
                    id: 'events-item5',
                    type: 'paragraph',
                    content: "Education fairs with local students",
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
                    content: "Visiting 10 leading schools across Northern Vietnam's educational hubs.",
                },
                {
                    id: 'locations-hanoi',
                    type: 'heading',
                    content: "Ha Noi",
                },
                {
                    id: 'locations-haiphong',
                    type: 'heading',
                    content: "Hai Phong",
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
                    id: 'locations-hcmc',
                    type: 'heading',
                    content: "HCMC",
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
                    content: "Special early bird discount available for the Spring 2026 tour",
                },
                {
                    id: 'pricing-earlybird-deadline',
                    type: 'heading',
                    content: "Early Bird - 15 Aug 2025",
                },
                {
                    id: 'pricing-earlybird-price',
                    type: 'heading',
                    content: "USD $2250",
                },
                {
                    id: 'pricing-earlybird-returning',
                    type: 'heading',
                    content: "USD $1900",
                },
                {
                    id: 'pricing-standard-deadline',
                    type: 'heading',
                    content: "Standard - 30 Oct 2025",
                },
                {
                    id: 'pricing-standard-price',
                    type: 'heading',
                    content: "USD $2600",
                },
                {
                    id: 'pricing-standard-returning',
                    type: 'heading',
                    content: "USD $2200",
                },
                {
                    id: 'pricing-custom-title',
                    type: 'heading',
                    content: "Customize your Spring 2026 experience",
                },
                {
                    id: 'pricing-custom-description',
                    type: 'paragraph',
                    content: "Work with our team to design a Northern Vietnam tour specifically suited to your university's recruitment goals.",
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
                    content: "10 school visits across 3 northern cities.\nFull in-country support team.\nDedicated exhibition space at each venue.\nWelcome reception with school officials.",
                },
                {
                    id: 'package-items2',
                    type: 'paragraph',
                    content: "Daily refreshments and snacks.\nAll meals during the tour (5 days).\nTransportation between venues and cities.\nPremium hotel arrangements available.",
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
                    id: 'step2-include-list-fall',
                    type: 'paragraph',
                    content: "9 - 11 school visits in 3 cities.\nSupport throughout the tour and school visits.\nOne stall at each school fair.\nReception dinner.\nRefreshments and snacks between sessions.\nLunch, coffee and dinner on all 4 days (no dinner on final day).\nIntra and inter city transport (in Hue, Danang and Tam Ky).\nHotel suggestions & discount.",
                },
                {
                    id: 'step2-include-list-spring',
                    type: 'paragraph',
                    content: "12 - 15 school visits across 3 regions.\nComprehensive tour support throughout all visits.\nPremium stall location at each school fair.\nWelcome and farewell dinners.\nRefreshments and snacks between sessions.\nAll meals included on tour days.\nIntra and inter city transport in all visited regions.\nPremium hotel arrangements with special rates.",
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
                    id: 'step2-hanoiHaiDuong-label',
                    type: 'heading',
                    content: "Ha Noi & Hai Duong",
                },
                {
                    id: 'step2-hueDaNang-label',
                    type: 'heading',
                    content: "Hue & Da Nang",
                },
                {
                    id: 'step2-hcmc-label',
                    type: 'heading',
                    content: "Ho Chi Minh City",
                },
                {
                    id: 'step2-promotions-title',
                    type: 'heading',
                    content: "Promotions",
                },
                {
                    id: 'step2-earlybird-label',
                    type: 'heading',
                    content: "Early Bird Discount",
                },
                {
                    id: 'step2-returning-label',
                    type: 'heading',
                    content: "Returning Client Discount",
                },
                {
                    id: 'step2-transfers-title',
                    type: 'heading',
                    content: "Travel",
                },
                {
                    id: 'step2-hotel-label',
                    type: 'heading',
                    content: "Accommodation for Northern Vietnam tour",
                },
                {
                    id: 'step2-travel-label',
                    type: 'heading',
                    content: "Accommodation for Central Vietnam tour",
                },
                {
                    id: 'step2-flight-label',
                    type: 'heading',
                    content: "One way flight from Hanoi (Northern Vietnam) to Hue (Central Vietnam)",
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
                },
                {
                    id: 'step2-fall-tour-date',
                    type: 'heading',
                    content: "1 - 8 OCTOBER 2025"
                },
                {
                    id: 'step2-spring-tour-date',
                    type: 'heading',
                    content: "31 MARCH - 10 APRIL 2026"
                },
                {
                    id: 'step2-fall-location-content',
                    type: 'paragraph',
                    content: "Central Vietnam (Hue, Da Nang)"
                },
                {
                    id: 'step2-spring-location-content',
                    type: 'paragraph',
                    content: "Northern Vietnam (Hanoi, Hai Duong)"
                },
                {
                    id: 'step2-fall-duration-content',
                    type: 'paragraph',
                    content: "We are aiming to visit 10 - 12 schools, in these 3 cities over 4 days."
                },
                {
                    id: 'step2-spring-duration-content',
                    type: 'paragraph',
                    content: "10 schools across 3 northern cities over 5 days."
                },
                {
                    id: 'step2-fall-earlybird-title',
                    type: 'heading',
                    content: "Early Bird - 24 December 2024"
                },
                {
                    id: 'step2-spring-earlybird-title',
                    type: 'heading',
                    content: "Early Bird - 15 August 2025"
                },
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
                    content: "Name of University Representative",
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
                },
                {
                    id: 'success-image',
                    type: 'image',
                    content: "/party-popper.png",
                }
            ]
        }
    }
};

// Default content array for resets
const defaultContent = [
    initialHomeContent,
    initialAboutUsContent,
    initialOurToursContent,
    initialTourDetailsContent,
    initialSpringTourDetailsContent,
    initialSignUpFormContent
];

interface ContentStore {
    pages: PageContent[];
    isLoading: boolean;
    error: string | null;
    getPageContent: (pageName: string) => PageContent | undefined;
    getItemById: (pageName: string, sectionId: string, itemId: string) => ContentItem | undefined;
    updateContent: (update: ContentUpdate) => void;
    resetToDefault: () => void;
    resetPageContent: (pageName: string) => void;
    fetchContent: () => Promise<void>;
}

export const useContentStore = create<ContentStore>((set, get) => ({
    pages: defaultContent,
    isLoading: false,
    error: null,
    
    fetchContent: async () => {
        set({ isLoading: true, error: null });
        try {
            // Use the API to fetch all content
            const pages = await contentApi.getAll();
            
            // Check if any pages are missing and add default content
            const pageNames = pages.map(page => page.pageName);
            
            for (const defaultPage of defaultContent) {
                if (!pageNames.includes(defaultPage.pageName)) {
                    pages.push(defaultPage);
                }
            }
            
            set({ pages, isLoading: false });
        } catch (error) {
            console.error('Error fetching content:', error);
            set({ 
                error: error instanceof Error ? error.message : 'Failed to fetch content', 
                isLoading: false,
                // Fall back to default content on error
                pages: defaultContent
            });
        }
    },
    
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
    
    updateContent: async (update: ContentUpdate) => {
        try {
            // Update locally in state first for immediate feedback
            set(state => {
                const newPages = [...state.pages];
                const pageIndex = newPages.findIndex(page => page.pageName === update.pageName);
                
                if (pageIndex === -1) return state;
                
                const page = { ...newPages[pageIndex] };
                newPages[pageIndex] = page;
                
                const section = { ...page.sections[update.sectionId] };
                page.sections = { ...page.sections, [update.sectionId]: section };
                
                if (!section) return state;
                
                const itemIndex = section.items.findIndex(item => item.id === update.itemId);
                
                if (itemIndex === -1) return state;
                
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
                
                return { pages: newPages };
            });
            
            // Then update on the server using the API
            await contentApi.updateItem(update);
            
        } catch (error) {
            console.error('Error updating content:', error);
            // If there's an error, refresh the content from the server to ensure consistency
            await get().fetchContent();
        }
    },
    
    resetToDefault: async () => {
        try {
            set({ isLoading: true, error: null });
            
            // Reset content on server using the API
            await contentApi.resetAll(defaultContent);
            
            // Update local state
            set({ pages: defaultContent, isLoading: false });
        } catch (error) {
            console.error('Error resetting content:', error);
            set({ 
                error: error instanceof Error ? error.message : 'Failed to reset content', 
                isLoading: false 
            });
        }
    },
    
    resetPageContent: async (pageName: string) => {
        try {
            set({ isLoading: true, error: null });
            
            // Find the default content for the specified page
            let defaultPageContent;
            switch (pageName) {
                case 'home':
                    defaultPageContent = initialHomeContent;
                    break;
                case 'about-us':
                    defaultPageContent = initialAboutUsContent;
                    break;
                case 'our-tours':
                    defaultPageContent = initialOurToursContent;
                    break;
                case 'tour-details':
                    defaultPageContent = initialTourDetailsContent;
                    break;
                case 'spring-tour-details':
                    defaultPageContent = initialSpringTourDetailsContent;
                    break;
                case 'signup-form':
                    defaultPageContent = initialSignUpFormContent;
                    break;
                default:
                    set({ 
                        error: `No default content found for page: ${pageName}`, 
                        isLoading: false 
                    });
                    return;
            }
            
            // Reset content on server using the API
            await contentApi.resetPage(pageName, defaultPageContent);
            
            // Update local state
            set(state => {
                const newPages = [...state.pages];
                const pageIndex = newPages.findIndex(page => page.pageName === pageName);
                
                if (pageIndex !== -1) {
                    newPages[pageIndex] = defaultPageContent;
                } else {
                    newPages.push(defaultPageContent);
                }
                
                return { pages: newPages, isLoading: false };
            });
        } catch (error) {
            console.error(`Error resetting page content for ${pageName}:`, error);
            set({ 
                error: error instanceof Error ? error.message : `Failed to reset content for ${pageName}`, 
                isLoading: false 
            });
        }
    }
})); 