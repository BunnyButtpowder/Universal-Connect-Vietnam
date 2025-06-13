import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import { Carousel, CarouselContent, CarouselItem, type CarouselApi, CarouselPrevious, CarouselNext } from "@/components/ui/carousel";
import { ArrowRight, SlidersVertical } from "lucide-react";
import { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import Autoplay from "embla-carousel-autoplay";
import { toursApi, TourFull, TourBasic } from "@/lib/api";
import { useContentStore } from "@/lib/contentStore";
import { useTranslatedContent } from '../hooks/useTranslatedContent';
import { generateTourDetailsUrl } from "@/lib/utils";

// TourCard component - updated to use TourBasic from API
function TourCard({ tour, formatPrice }: { tour: TourBasic; formatPrice: (price: string | number) => string }) {
    return (
        <a href={generateTourDetailsUrl(tour.title)} className="bg-white hover:bg-sky-50 rounded-xl overflow-hidden cursor-pointer group/card transition-colors duration-300 border-2 border-blue-200/50">
            <div className="relative  overflow-hidden rounded-xl">
                <div className="absolute top-6 left-6 flex space-x-2 z-10 bg-white rounded-md px-3 py-2">
                    <span className="font-bold text-xs text-content">INCOMING • {tour.date}</span>
                </div>
                <div className=" p-3">
                    <div className="relative h-full w-full overflow-hidden rounded-xl">
                        <img
                            src={tour.imageUrl}
                            alt="Tour image"
                            className="w-full h-full object-cover transition-transform duration-300 group-hover/card:scale-110"
                            onError={(e) => {
                                (e.target as HTMLImageElement).src = "/hero-banner-1.png";
                            }}
                        />
                    </div>
                </div>
            </div>
            <div className="px-6 mb-5 mt-2 space-y-3">
                <h3 className="font-bold text-base text-content">{tour.title}</h3>
                <p className="text-xs text-slate-500 line-clamp-3 lg:line-clamp-2 group-hover/card:text-blue-950 transition-colors duration-300">
                    {tour.shortDescription}
                </p>
                <div className="flex justify-between items-center pt-2">
                    <button className="bg-blue-500 text-white text-xs min-w-[130px] px-2 py-2 rounded-full group flex items-center justify-between transition-all duration-300 cursor-pointer group-hover/card:translate-x-1 group-hover/card:min-w-[140px] group-hover/card:bg-blue-950">
                        <div className="bg-white rounded-full p-1.5 flex items-center justify-center">
                            <ArrowRight className="h-3 w-3 text-blue-500 transition-transform duration-300" />
                        </div>
                        <span className="flex-1 text-center group-hover:translate-x-1 transition-transform duration-300 font-medium group-hover/card:translate-x-1">Find out more</span>
                    </button>
                    <div className="flex items-center space-x-1 text-navy-800">
                        <span className="text-xs">Start from</span>
                        <span className="font-bold text-content">${formatPrice(tour.price)}</span>
                        <span className="text-xs text-gray-500 font-medium">USD</span>
                    </div>
                </div>
            </div>
        </a>
    );
}

export default function TourDetails() {
    const { slug } = useParams<{ slug: string }>();
    const [api, setApi] = useState<CarouselApi>();
    const [current, setCurrent] = useState(1);
    const [tour, setTour] = useState<TourFull | null>(null);
    const [otherTours, setOtherTours] = useState<TourBasic[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const count = 4;

    // Content store hook and translation hook
    const getItemById = useContentStore(state => state.getItemById);
    const { getContentItem } = useTranslatedContent();

    // Fetch tour data and other tours
    useEffect(() => {
        const fetchData = async () => {
            if (!slug) {
                setError("Tour slug not provided");
                setLoading(false);
                return;
            }

            try {
                setLoading(true);

                // Fetch current tour and all tours in parallel
                const [tourData, allToursData] = await Promise.all([
                    toursApi.getBySlug(slug),
                    toursApi.getAll()
                ]);

                setTour(tourData);

                // Filter out the current tour from other tours
                const filteredTours = allToursData.filter(t => t.id.toString() !== tourData.id.toString());
                setOtherTours(filteredTours);

                setError(null);
            } catch (err) {
                console.error('Error fetching data:', err);
                setError('Failed to load tour details. Please try again later.');
            } finally {
                setLoading(false);
            }
        };

        fetchData();
    }, [slug]);

    // Helper function to format date
    const formatDate = (dateString: string) => {
        try {
            const date = new Date(dateString);
            return date.toLocaleDateString('en-US', {
                year: 'numeric',
                month: 'long',
                day: 'numeric'
            });
        } catch {
            return dateString;
        }
    };

    // Helper function to format price with commas
    const formatPrice = (price: string | number) => {
        const numPrice = typeof price === 'string' ? parseFloat(price) : price;
        return numPrice.toLocaleString('en-US', {
            maximumFractionDigits: 0
        });
    };

    // Helper function to split package items into two columns
    const splitPackageItems = (items: string[]) => {
        const midpoint = Math.ceil(items.length / 2);
        return {
            column1: items.slice(0, midpoint),
            column2: items.slice(midpoint)
        };
    };

    useEffect(() => {
        if (!api) {
            return;
        }

        setCurrent(api.selectedScrollSnap() + 1);

        api.on("select", () => {
            setCurrent(api.selectedScrollSnap() + 1);
        });
    }, [api]);

    if (loading) {
        return (
            <div>
                <Navbar />
                <div className="mt-20 flex justify-center items-center py-20">
                    <div className="text-xl text-gray-600">Loading tour details...</div>
                </div>
                <Footer />
            </div>
        );
    }

    if (error || !tour) {
        return (
            <div>
                <Navbar />
                <div className="mt-20 flex justify-center items-center py-20">
                    <div className="text-xl text-red-600">{error || "Tour not found"}</div>
                </div>
                <Footer />
            </div>
        );
    }

    // Split package items for two columns
    const packageColumns = splitPackageItems(tour.packageIncludes || []);

    return (
        <div>
            <Navbar />
            <div className="mt-20">
                <div className="mx-4 lg:mx-0 md:mx-6 lg:px-20 overflow-hidden relative flex flex-col"
                    style={{
                        height: typeof window !== 'undefined' && window.innerWidth < 1024
                            ? "1320px"
                            : "850px"
                    }}>
                    {/* Decorative Image - Upper Left */}
                    <img
                        src="/vector.svg"
                        alt="Decorative element"
                        className="absolute -top-3 lg:top-10 left-0 lg:-left-20 max-w-none w-[200%] lg:w-300 h-[180px] lg:h-70 pointer-events-none -z-1"
                    />
                    <div className="relative w-full h-auto mt-16 lg:mt-0">
                        <img
                            src={tour.imageUrl || "/hero-banner-1.png"}
                            alt="University Event"
                            className="w-full rounded-3xl object-cover"
                            style={{
                                height: typeof window !== 'undefined' && window.innerWidth < 1024
                                    ? "480px"
                                    : "600px"
                            }}
                        />
                    </div>

                    {/* Description - only appears on mobile */}
                    {/* <div className="block lg:hidden text-content text-sm font-medium my-4 px-2">
                        {tour.description?.split('\n\n')[0]}
                    </div> */}

                    {/* Tour Info Card Overlay */}
                    <div className="absolute bottom-10 lg:ms-28 lg:me-48 tour-info-card-bg rounded-2xl px-4 lg:px-6 pb-4 lg:pb-6">
                        <div className="relative inline-block bg-content text-white rounded-lg px-5 py-1 -top-4">
                            <span className="font-medium text-xs">INCOMING • {tour.date}</span>
                        </div>
                        <div className="flex flex-col lg:flex-row justify-between border-b border-blue-200/50 pb-3 lg:mx-3">
                            <h2 className="text-3xl lg:text-4xl font-medium text-content pb-3">{tour.title}</h2>
                            <div className="flex flex-row gap-2 items-center">
                                <span className="text-content text-sm font-medium me-3">{getContentItem('tourBanner-shareLabel') || getItemById('tour-details', 'bannerSection', 'tourBanner-shareLabel')?.content || "Share"}</span>
                                <a href="#" target="_blank" rel="noopener noreferrer">
                                    <div className="p-2 bg-white rounded-full">
                                        <img src="/facebook.svg" alt="Facebook Icon" className="w-5 h-5 cursor-pointer hover:scale-130 transition-all duration-300" />
                                    </div>
                                </a>
                                <a href="#" target="_blank" rel="noopener noreferrer">
                                    <div className="p-2 bg-white rounded-full">
                                        <img src="/linkedin.svg" alt="Twitter Icon" className="w-4 h-4 cursor-pointer hover:scale-130 transition-all duration-300" />
                                    </div>
                                </a>
                                <a href="#" target="_blank" rel="noopener noreferrer">
                                    <div className="p-2 bg-white rounded-full">
                                        <img src="/gmail.svg" alt="LinkedIn Icon" className="w-4 h-4 cursor-pointer hover:scale-130 transition-all duration-300" />
                                    </div>
                                </a>
                                <a href="#" target="_blank" rel="noopener noreferrer">
                                    <div className="p-2 bg-white rounded-full">
                                        <img src="/link.svg" alt="LinkedIn Icon" className="w-5 h-5 cursor-pointer hover:scale-130 transition-all duration-300" />
                                    </div>
                                </a>
                            </div>
                        </div>

                        <div className="grid grid-cols-1 lg:grid-cols-5 justify-between items-start gap-5 lg:gap-10 mt-6 lg:mx-3">
                            <div className="lg:col-span-3">
                                <p className="text-content font-medium text-sm mb-4 whitespace-pre-line line-clamp-11 lg:line-clamp-6 overflow-hidden">
                                    {tour.description}
                                </p>
                                <div className="grid grid-cols-1 md:grid-cols-7 gap-2 md:gap-0">
                                    <div className="md:col-span-2 flex items-center">
                                        <a href={`/sign-up/${tour.id}`} className="w-full md:mr-5">
                                            <button
                                                type="submit"
                                                className="w-full bg-blue-950 text-white text-sm font-medium min-w-[130px] px-5 py-3 rounded-full group flex items-center justify-center transition-all duration-300 hover:min-w-[150px] cursor-pointer space-x-2"
                                            >
                                                {getContentItem('tourBanner-signUpButton') || getItemById('tour-details', 'bannerSection', 'tourBanner-signUpButton')?.content || "Sign Up Now"}
                                                <img src="/send-icon.svg" alt="Send Icon" className="h-3 w-3 ms-2 group-hover:translate-x-2 transition-transform duration-300" />
                                            </button>
                                        </a>
                                    </div>

                                    <div className="md:col-span-5 flex items-center gap-3 bg-orange-100 rounded-xl px-4 py-2">
                                        <SlidersVertical className="w-8 h-8 text-orange-500" />
                                        <div>
                                            <span className="text-content text-sm font-bold">{getContentItem('tourBanner-customizeLabel') || getItemById('tour-details', 'bannerSection', 'tourBanner-customizeLabel')?.content || "CUSTOMIZE"} </span>
                                            <span className="text-content text-sm">{tour.customize}</span>
                                        </div>
                                    </div>
                                </div>
                            </div>
                            <div className="lg:col-span-2">
                                <div className="flex flex-col gap-5">
                                    <div className="flex items-center gap-5">
                                        <img src="/map-pin-blue-950.svg" alt="Map Pin" className="w-6 h-6" />
                                        <div className="flex flex-col gap-1">
                                            <span className="text-content text-xs font-bold uppercase">{getContentItem('tourBanner-locationLabel') || getItemById('tour-details', 'bannerSection', 'tourBanner-locationLabel')?.content || "LOCATION"}</span>
                                            <span className="text-content text-sm">{tour.location}</span>
                                        </div>
                                    </div>
                                    <div className="flex items-center gap-5">
                                        <img src="/duration.svg" alt="Duration Icon" className="w-6 h-6" />
                                        <div className="flex flex-col gap-1">
                                            <span className="text-content text-xs font-bold uppercase">{getContentItem('tourBanner-durationLabel') || getItemById('tour-details', 'bannerSection', 'tourBanner-durationLabel')?.content || "DURATION"}</span>
                                            <span className="text-content text-sm">{tour.duration}</span>
                                        </div>
                                    </div>
                                    <div className="flex items-center gap-5">
                                        <img src="/calender.svg" alt="Calender Icon" className="w-6 h-6" />
                                        <div className="flex flex-col gap-1">
                                            <span className="text-content text-xs font-bold uppercase">{getContentItem('tourBanner-tourDatesLabel') || getItemById('tour-details', 'bannerSection', 'tourBanner-tourDatesLabel')?.content || "Tour dates"}</span>
                                            <span className="text-content text-sm">{tour.tourDates}</span>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Tour Timelines Section */}
                <div className="px-4 md:px-6 lg:px-48 bg-blue-50 py-16 px-8 lg:px-16 mt-20 lg:mt-0">
                    <div className="grid grid-cols-1 lg:grid-cols-9 gap-10 mt-5">
                        {/* Header and description - 3/9 of grid */}
                        <div className="flex flex-col space-y-6 lg:col-span-3">
                            <h3 className="text-header font-bold text-lg">
                                {getContentItem('timelines-heading') || getItemById('tour-details', 'timelinesSection', 'timelines-heading')?.content || "TOUR TIMELINES"}
                            </h3>
                            <h2 className="text-content text-3xl lg:text-4xl/11 font-medium">
                                {getContentItem('timelines-title') || getItemById('tour-details', 'timelinesSection', 'timelines-title')?.content || "Tentative Schedule for the 2025/26 School Year"}
                            </h2>
                        </div>

                        {/* Timeline Events - 6/9 of grid */}
                        <div className="lg:col-span-6">
                            {tour.timelineEvents && tour.timelineEvents.length > 0 ? (
                                (() => {
                                    const sortedEvents = tour.timelineEvents.sort((a, b) => (a.sortOrder || 0) - (b.sortOrder || 0));
                                    const totalEvents = sortedEvents.length;
                                    const leftColumnCount = Math.ceil(totalEvents / 2);
                                    const leftColumnEvents = sortedEvents.slice(0, leftColumnCount);
                                    const rightColumnEvents = sortedEvents.slice(leftColumnCount);
                                    
                                    return (
                                        <div className="grid grid-cols-1 md:grid-cols-2">
                                            {/* Left Column */}
                                            <div className="space-y-5 mb-5 lg:mb-0">
                                                {leftColumnEvents.map((event, index) => (
                                                    <div key={`left-${index}`} className="relative">
                                                        <div className="flex items-start space-x-4">
                                                            {/* Location Pin Icon */}
                                                            <div className="flex-shrink-0 mt-1 relative">
                                                                <div className="w-11 h-11 bg-blue-100 rounded-lg flex items-center justify-center relative z-10">
                                                                    <svg className="w-5 h-5 text-blue-500" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
                                                                        <path fillRule="evenodd" d="M5.05 4.05a7 7 0 119.9 9.9L10 18.9l-4.95-4.95a7 7 0 010-9.9zM10 11a2 2 0 100-4 2 2 0 000 4z" clipRule="evenodd" />
                                                                    </svg>
                                                                </div>
                                                                {/* Connecting line logic:
                                                                    - Desktop: only connect if not the last event in this column
                                                                    - Mobile: CSS will handle making lines longer to connect between columns
                                                                */}
                                                                {index < leftColumnEvents.length - 1 && (
                                                                    <div className="absolute top-10 left-1/2 transform -translate-x-1/2 w-px bg-blue-200 h-14 md:h-8"></div>
                                                                )}
                                                                {/* Mobile-only connecting line from last left column event to first right column event */}
                                                                {index === leftColumnEvents.length - 1 && rightColumnEvents.length > 0 && (
                                                                    <div className="absolute top-10 left-1/2 transform -translate-x-1/2 w-px bg-blue-200 h-14 md:hidden"></div>
                                                                )}
                                                            </div>
                                                            
                                                            {/* Event Content */}
                                                            <div className="flex-1 min-w-0">
                                                                {/* Date Range and Location */}
                                                                <div className="flex flex-col sm:flex-row sm:items-center sm:space-x-3 space-y-1 sm:space-y-0">
                                                                    <span className="text-blue-600 font-semibold text-sm tracking-wide">
                                                                        {event.dateRange}
                                                                    </span>
                                                                    <span className="hidden sm:inline text-blue-600">•</span>
                                                                    <h4 className="text-content font-bold text-md uppercase tracking-wide truncate">
                                                                        {event.location}
                                                                    </h4>
                                                                </div>
                                                                
                                                                {/* Description */}
                                                                {event.description && (
                                                                    <p className="text-sm leading-relaxed break-words">
                                                                        {event.description}
                                                                    </p>
                                                                )}
                                                            </div>
                                                        </div>
                                                    </div>
                                                ))}
                                            </div>
                                            
                                            {/* Right Column */}
                                            <div className="space-y-5">
                                                {rightColumnEvents.map((event, index) => (
                                                    <div key={`right-${index}`} className="relative">
                                                        <div className="flex items-start space-x-4">
                                                            {/* Location Pin Icon */}
                                                            <div className="flex-shrink-0 mt-1 relative">
                                                                <div className="w-11 h-11 bg-blue-100 rounded-lg flex items-center justify-center relative z-10">
                                                                    <svg className="w-5 h-5 text-blue-500" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
                                                                        <path fillRule="evenodd" d="M5.05 4.05a7 7 0 119.9 9.9L10 18.9l-4.95-4.95a7 7 0 010-9.9zM10 11a2 2 0 100-4 2 2 0 000 4z" clipRule="evenodd" />
                                                                    </svg>
                                                                </div>
                                                                {/* Connecting line logic:
                                                                    - Mobile: never show (right column events are handled by left column in mobile)
                                                                    - Desktop: all events in right column except the last one
                                                                */}
                                                                {(
                                                                    // Right column connecting lines only show on desktop and only for non-last events
                                                                    index < rightColumnEvents.length - 1
                                                                ) && (
                                                                    <div className="absolute top-10 left-1/2 transform -translate-x-1/2 w-px h-14 lg:h-8 bg-blue-200"></div>
                                                                )}
                                                            </div>
                                                            
                                                            {/* Event Content */}
                                                            <div className="flex-1 min-w-0">
                                                                {/* Date Range and Location */}
                                                                <div className="flex flex-col sm:flex-row sm:items-center sm:space-x-3 space-y-1 sm:space-y-0">
                                                                    <span className="text-blue-600 font-semibold text-sm tracking-wide">
                                                                        {event.dateRange}
                                                                    </span>
                                                                    <span className="hidden sm:inline text-blue-600">•</span>
                                                                    <h4 className="text-content font-bold text-md uppercase tracking-wide truncate">
                                                                        {event.location}
                                                                    </h4>
                                                                </div>
                                                                
                                                                {/* Description */}
                                                                {event.description && (
                                                                    <p className="text-sm leading-relaxed break-words">
                                                                        {event.description}
                                                                    </p>
                                                                )}
                                                            </div>
                                                        </div>
                                                    </div>
                                                ))}
                                            </div>
                                        </div>
                                    );
                                })()
                            ) : (
                                /* Fallback to waiting message if no timeline events */
                                <div className="location-carousel-container relative">
                                    <div className="flex flex-col items-center justify-center py-16 px-8 text-center">
                                        {/* Timeline Icon */}
                                        <div className="mb-6">
                                            <svg className="w-16 h-16 text-blue-200" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
                                                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-12a1 1 0 10-2 0v4a1 1 0 00.293.707l2.828 2.829a1 1 0 101.415-1.415L11 9.586V6z" clipRule="evenodd" />
                                            </svg>
                                        </div>

                                        {/* Main Message */}
                                        <h4 className="text-2xl font-semibold text-gray-800 mb-3">
                                            Timeline Coming Soon
                                        </h4>

                                        {/* Description */}
                                        <p className="text-gray-600 text-lg mb-6 max-w-md">
                                            We're crafting a detailed timeline for this amazing journey. Check back soon for the complete itinerary!
                                        </p>

                                        {/* Decorative Elements */}
                                        <div className="flex space-x-2 opacity-60">
                                            <div className="w-3 h-3 bg-blue-300 rounded-full animate-pulse"></div>
                                            <div className="w-3 h-3 bg-blue-400 rounded-full animate-pulse" style={{ animationDelay: '0.2s' }}></div>
                                            <div className="w-3 h-3 bg-blue-500 rounded-full animate-pulse" style={{ animationDelay: '0.4s' }}></div>
                                        </div>
                                    </div>
                                </div>
                            )}
                        </div>
                    </div>
                </div>

                {/* Events in the Schools */}
                <div className="mx-4 lg:mx-48 2xl:mx-48 my-10 grid grid-cols-1 lg:grid-cols-5 gap-10 lg:gap-20">
                    <div className="grid lg:col-span-2 grid-rows-6 lg:grid-rows-10">
                        <div className="flex flex-row lg:row-span-2">
                            <span className="text-header text-md font-bold uppercase">
                                {getContentItem('events-heading') || getItemById('tour-details', 'eventsSection', 'events-heading')?.content || "EVENTS IN THE SCHOOLS"}
                            </span>
                        </div>
                        <div className="flex flex-col row-span-5 lg:row-span-7 justify-center">
                            {(tour.eventTypes || []).map((eventType, index) => (
                                <a key={index} href="#" className="hover:bg-blue-200/50 transition-all duration-300">
                                    <div className="flex flex-row gap-6 px-6 py-8 border-b border-blue-200/50">
                                        <img
                                            src={index === 0 ? "/edu-icon.svg" : index === 1 || index === 2 ? "/speak.svg" : index === 3 ? "/edu.svg" : "/mountain.svg"}
                                            alt={`Event ${index + 1}`}
                                            className="w-6 h-6"
                                        />
                                        <span className="text-content text-md font-medium">
                                            {eventType}
                                        </span>
                                    </div>
                                </a>
                            ))}
                        </div>
                    </div>
                    <div className="grid lg:col-span-3 lg:grid-rows-10">
                        <div className="flex flex-row lg:row-span-2 mb-10 lg:mb-0">
                            <span className="text-content text-3xl lg:text-4xl font-semibold">
                                {getContentItem('events-title') || getItemById('tour-details', 'eventsSection', 'events-title')?.content || "Make the school visits more productive and memorable for both you and the students."}
                            </span>
                        </div>
                        {/* Carousel */}
                        <div className="relative rounded-3xl overflow-hidden flex flex-row lg:row-span-7">
                            <Carousel className="w-full" setApi={setApi} plugins={[Autoplay({ delay: 4000 })]}>
                                <CarouselContent>
                                    {(tour.additionalImages && tour.additionalImages.length > 0 ? tour.additionalImages : ["/classroom.png", "/display1.png", "/display2.png"]).map((image, index) => (
                                        <CarouselItem key={index}>
                                            <div className="carousel-image-container h-[500px] relative">
                                                <img
                                                    src={image}
                                                    alt={`Tour activity ${index + 1}`}
                                                    className="w-full h-full object-cover"
                                                />
                                            </div>
                                        </CarouselItem>
                                    ))}
                                </CarouselContent>

                                {/* Pagination Indicator - Visible on all screens */}
                                <div className="absolute bottom-4 -right-5 lg:left-1/2 transform -translate-x-1/2 lg:left-auto lg:translate-x-0 lg:right-4 px-4 py-2 font-medium text-lg items-center gap-2 flex">
                                    <div className="flex space-x-1 items-center">
                                        {Array.from({ length: Math.max(tour.additionalImages?.length || 0, 3) }).map((_, i) => (
                                            <span
                                                key={i}
                                                className={`block rounded-full ${current === i + 1
                                                    ? 'bg-neutral-50 h-2 w-2 mt-1 mx-1'
                                                    : 'bg-gray-300 h-1 w-1 mx-1'
                                                    } transition-all duration-300`}
                                                style={{
                                                    transform: current === i + 1 ? 'translateY(-2px)' : 'translateY(0)'
                                                }}
                                            />
                                        ))}
                                    </div>
                                </div>
                            </Carousel>
                        </div>
                    </div>
                </div>

                {/* Tour Locations Section */}
                <div className="px-4 md:px-6 lg:px-48 bg-blue-50 py-16 px-8 lg:px-16 mt-20 lg:mt-0">
                    <div className="grid grid-cols-1 lg:grid-cols-4 gap-10 mt-5">
                        {/* Header and description - 1/4 of grid */}
                        <div className="flex flex-col space-y-6">
                            <h3 className="text-header font-bold text-lg">
                                {getContentItem('locations-heading') || getItemById('tour-details', 'locationsSection', 'locations-heading')?.content || "TOUR LOCATIONS"}
                            </h3>
                            <h2 className="text-content text-3xl lg:text-4xl font-medium">
                                {getContentItem('locations-title') || getItemById('tour-details', 'locationsSection', 'locations-title')?.content || "We are aiming to visit"} {tour.duration}
                            </h2>
                        </div>

                        {/* Location cards - 3/4 of grid */}
                        <div className="lg:col-span-3">
                            {/* Location Cards Carousel */}
                            <div className="location-carousel-container relative">
                                <Carousel
                                    className="location-carousel w-full"
                                    opts={{
                                        align: "start",
                                        loop: true,
                                    }}
                                    setApi={setApi}
                                >
                                    <CarouselContent className="location-carousel-content">
                                        {(tour.cities || []).map((city, index) => (
                                            <CarouselItem key={index} className="basis-full md:basis-1/3">
                                                <div className="location-card-container rounded-xl overflow-hidden">
                                                    <div className="w-full h-50 lg:h-70 rounded-3xl overflow-hidden">
                                                        <img
                                                            src={city.imageUrl}
                                                            alt={city.name}
                                                            className="location-image w-full h-full object-cover"
                                                            onError={(e) => {
                                                                (e.target as HTMLImageElement).src = "/hero-banner-1.png";
                                                            }}
                                                        />
                                                    </div>
                                                    <div className="location-details p-4 flex items-center gap-4">
                                                        <span className="location-name font-semibold text-content">
                                                            {city.name}
                                                        </span>
                                                        {city.wikiUrl && (
                                                            <a
                                                                href={city.wikiUrl}
                                                                target="_blank"
                                                                rel="noopener noreferrer"
                                                                className="location-link flex items-center text-sm text-blue-500 cursor-pointer"
                                                            >
                                                                <img src="/link.svg" alt="Wikipedia" className="link-icon w-4 h-4 mr-1" />
                                                                Wikipedia
                                                            </a>
                                                        )}
                                                    </div>
                                                </div>
                                            </CarouselItem>
                                        ))}
                                    </CarouselContent>

                                    {/* Navigation buttons */}
                                    <div className="carousel-navigation flex items-center justify-between">
                                        <CarouselPrevious className="carousel-prev-button relative -left-0 translate-y-0 lg:-left-0 cursor-pointer" />
                                        <CarouselNext className="carousel-next-button relative -right-0 translate-y-0 lg:-right-0 cursor-pointer" />
                                    </div>

                                    {/* Carousel indicators */}
                                    <div className="carousel-indicators flex justify-center mt-4">
                                        <div className="carousel-indicator-container flex space-x-2 items-center">
                                            {Array.from({ length: Math.min(tour.cities?.length || 0, count) }).map((_, i) => (
                                                <span
                                                    key={i}
                                                    className={`carousel-indicator block rounded-full cursor-pointer ${current === i + 1
                                                        ? 'carousel-indicator-active bg-blue-500 h-2 w-2'
                                                        : 'carousel-indicator-inactive bg-gray-300 h-1.5 w-1.5'
                                                        } transition-all duration-300`}
                                                    onClick={() => api?.scrollTo(i)}
                                                />
                                            ))}
                                        </div>
                                    </div>
                                </Carousel>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Pricing Section */}
                <div className="mx-4 md:mx-6 lg:mx-48 mt-20 mb-2 bg-blue-950 py-4 lg:py-10 px-4 lg:px-8 rounded-3xl text-white">
                    <div className="grid grid-cols-1 lg:grid-cols-5">
                        {/* Header and content - 2/5 of grid */}
                        <div className="lg:col-span-2 flex flex-col space-y-6">
                            <h3 className="text-header font-bold text-lg uppercase">
                                {getContentItem('pricing-heading') || getItemById('tour-details', 'pricingSection', 'pricing-heading')?.content || "PRICING"}
                            </h3>
                            <h2 className="text-white text-3xl lg:text-4xl font-medium leading-tight mb-10 lg:mb-0">
                                {getContentItem('pricing-title') || getItemById('tour-details', 'pricingSection', 'pricing-title')?.content || "We offer an Early Bird discount as well as an extra discount for returning universities"}
                            </h2>
                        </div>

                        {/* Pricing table - 3/5 of grid */}
                        <div className="lg:col-span-3">
                            <div className="overflow-hidden rounded-3xl">
                                {/* Table Header */}
                                <div className="grid grid-cols-6 lg:grid-cols-7 bg-blue-500 text-white">
                                    <div className="col-span-2 lg:col-span-3 py-4 lg:py-2 px-2 lg:px-4 font-semibold border-r-3 border-white text-sm">
                                        {getContentItem('pricing-tableHeader1') || getItemById('tour-details', 'pricingSection', 'pricing-tableHeader1')?.content || "Registration Deadline"}
                                    </div>
                                    <div className="col-span-2 py-4 lg:py-2 px-2 lg:px-4 font-semibold border-r-3 border-white text-sm">
                                        {getContentItem('pricing-tableHeader2') || getItemById('tour-details', 'pricingSection', 'pricing-tableHeader2')?.content || "Standard Price"}
                                    </div>
                                    <div className="col-span-2 py-4 lg:py-2 px-2 lg:px-4 font-semibold text-sm">
                                        {getContentItem('pricing-tableHeader3') || getItemById('tour-details', 'pricingSection', 'pricing-tableHeader3')?.content || "Returning University"}
                                    </div>
                                </div>

                                {/* Row 1 - Early Bird */}
                                <div className="grid grid-cols-6 lg:grid-cols-7 bg-white text-content border-b border-blue-200">
                                    <div className="col-span-2 lg:col-span-3 px-2 py-4 lg:p-4 font-bold">
                                        Early Bird - {formatDate(tour.earlyBirdDeadline || "")}
                                    </div>
                                    <div className="col-span-2 px-2 py-4 lg:p-4 font-medium">
                                        USD ${formatPrice(tour.pricing?.earlyBird?.regular || "0")}
                                    </div>
                                    <div className="col-span-2 px-2 py-4 lg:p-4 font-medium">
                                        USD ${formatPrice(tour.pricing?.earlyBird?.returningUniversity || "0")}
                                    </div>
                                </div>

                                {/* Row 2 - Standard */}
                                <div className="grid grid-cols-6 lg:grid-cols-7 bg-white text-content border-b border-blue-200">
                                    <div className="col-span-2 lg:col-span-3 px-2 py-4 lg:p-4 font-bold">
                                        Standard - {formatDate(tour.standardDeadline || "")}
                                    </div>
                                    <div className="col-span-2 px-2 py-4 lg:p-4 font-medium">
                                        USD ${formatPrice(tour.pricing?.standard?.regular || "0")}
                                    </div>
                                    <div className="col-span-2 px-2 py-4 lg:p-4 font-medium">
                                        USD ${formatPrice(tour.pricing?.standard?.returningUniversity || "0")}
                                    </div>
                                </div>

                                {/* Row 3 - Larger row */}
                                <div className="lg:grid lg:grid-cols-7 bg-white">
                                    <div className="col-span-2 p-4 ">
                                        <p className="font-bold text-content">
                                            {getContentItem('pricing-custom-title') || getItemById('tour-details', 'pricingSection', 'pricing-custom-title')?.content || "Tailor your perfect tour"}
                                        </p>
                                        <p className="text-xs text-gray-600 mt-2">
                                            {getContentItem('pricing-custom-description') || getItemById('tour-details', 'pricingSection', 'pricing-custom-description')?.content || "Customized school tours connecting top Vietnamese schools with international universities."}
                                        </p>
                                    </div>
                                    <div className="md:col-span-3 flex items-center gap-3 bg-orange-100 rounded-xl px-4 md:my-4 mx-4 md:m-2">
                                        <SlidersVertical className="w-15 h-15 text-orange-500 " />
                                        <div>
                                            <span className="text-content text-sm font-bold">{getContentItem('tourBanner-customizeLabel') || getItemById('tour-details', 'bannerSection', 'tourBanner-customizeLabel')?.content || "CUSTOMIZE"} </span>
                                            <span className="text-content text-sm">{tour.customize}</span>
                                        </div>
                                    </div>
                                    <div className="col-span-2 flex items-center mx-4 md:mx-0 my-2 pb-5 md:pb-0 md:mr-2">
                                        <a href={`/sign-up/${tour.id}`} className="w-full">
                                            <button
                                                type="submit"
                                                className="w-full bg-blue-950 text-white text-sm font-medium px-5 py-3 rounded-full group flex items-center justify-center transition-all duration-300 cursor-pointer space-x-2 "
                                            >
                                                {getContentItem('pricing-custom-button') || getItemById('tour-details', 'pricingSection', 'pricing-custom-button')?.content || "Sign Up Now"}
                                                <img src="/send-icon.svg" alt="Send Icon" className="h-3 w-3 ms-2 group-hover:translate-x-2 transition-transform duration-300" />
                                            </button>
                                        </a>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
                <div className="mx-4 md:mx-6 lg:mx-48 mb-20">
                    <div className="grid grid-cols-1 lg:grid-cols-4 gap-2">
                        {/* The package includes - 2/4 of grid */}
                        <div className="lg:col-span-2 flex flex-col space-y-6 overflow-hidden rounded-3xl tour-info-card-bg py-10 px-8">
                            <div className="flex flex-row items-center gap-4 border-b border-blue-200/70 pb-6">
                                <img src="/backpack.svg" alt="Backpack" className="w-6 h-6" />
                                <h3 className="text-header font-bold text-lg uppercase">
                                    {getContentItem('package-heading') || getItemById('tour-details', 'packageSection', 'package-heading')?.content || "THE PACKAGE INCLUDES"}
                                </h3>
                            </div>
                            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                                <div className="flex flex-col ">
                                    {packageColumns.column1.map((item, index) => (
                                        <div key={index} className="flex items-center">
                                            <div className="text-content text-lg mr-2">•</div>
                                            <p className="text-content text-sm font-medium">{item}</p>
                                        </div>
                                    ))}
                                </div>
                                <div className="flex flex-col ">
                                    {packageColumns.column2.map((item, index) => (
                                        <div key={index} className="flex items-center">
                                            <div className="text-content text-lg mr-2">•</div>
                                            <p className="text-content text-sm font-medium">{item}</p>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </div>

                        {/* Display Image - 2/4 of grid */}
                        <div className="lg:col-span-2 h-full">
                            <div className="overflow-hidden rounded-3xl h-full">
                                <img src={tour.additionalImages[1]} alt="Backpack" className="w-full h-full object-cover" />
                            </div>
                        </div>
                    </div>
                </div>

                <div className="mx-4 md:mx-6 lg:mx-48 mb-20">
                    <h3 className="text-header font-bold text-lg uppercase mb-5 text-center lg:text-left">{getContentItem('otherTours-heading') || getItemById('tour-details', 'otherToursSection', 'otherTours-heading')?.content || "OTHER TOURS"}</h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {otherTours.map(tour => (
                            <TourCard key={tour.id} tour={tour} formatPrice={formatPrice} />
                        ))}
                    </div>
                </div>

            </div>
            <Footer />
        </div>
    )
}
