import { ArrowUpRight, ArrowRight } from "lucide-react"
import { useContentStore } from "../lib/contentStore"
import { useTranslatedContent } from "../hooks/useTranslatedContent"
import { useState, useEffect } from "react"
import { toursApi, TourBasic } from "../lib/api"
import { generateTourDetailsUrl } from "../lib/utils"

// Define Tour type for local use (extending TourBasic with additional properties)
interface Tour extends TourBasic {
    detailsUrl: string;
    buttonText: string;
}

export function DiscoverSchoolTourHome() {
    const getItemById = useContentStore(state => state.getItemById);
    const { getContentItem } = useTranslatedContent();
    const [tours, setTours] = useState<Tour[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    // Helper function to format price with commas
    const formatPrice = (price: number) => {
        // Convert to number and check if it has meaningful decimal places
        const numPrice = parseFloat(price.toString());
        const hasDecimals = numPrice % 1 !== 0;
        
        return numPrice.toLocaleString('en-US', {
            minimumFractionDigits: hasDecimals ? 2 : 0,
            maximumFractionDigits: 2
        });
    };

    // Fetch tours from API
    useEffect(() => {
        const fetchTours = async () => {
            try {
                setLoading(true);
                const fetchedTours = await toursApi.getAll();
                
                // Transform API tours to include additional properties
                const transformedTours: Tour[] = fetchedTours.map(tour => ({
                    ...tour,
                    detailsUrl: generateTourDetailsUrl(tour.title), // Generate URL based on tour title slug
                    buttonText: "Find out more" // Default button text
                }));
                
                setTours(transformedTours);
                setError(null);
            } catch (err) {
                console.error('Failed to fetch tours:', err);
                setError('Failed to load tours');
                setTours([]);
            } finally {
                setLoading(false);
            }
        };

        fetchTours();
    }, []);

    // Get translated content - using the useTranslatedContent hook for proper translation support
    const headingContent = getContentItem('discoverTour-heading') ||
        getItemById('home', 'discoverTour', 'discoverTour-heading')?.content ||
        "DISCOVER OUR SCHOOL TOURS";
    const titleContent = getContentItem('discoverTour-title') ||
        getItemById('home', 'discoverTour', 'discoverTour-title')?.content ||
        "Exclusive access to prestigious state schools, hand-picked for their academic excellence.";
    const descriptionContent = getContentItem('discoverTour-description') ||
        getItemById('home', 'discoverTour', 'discoverTour-description')?.content ||
        "As we know the intense schedule university reps have, we tailor our tours to be highly productive and fun at the same time. We want you to leave feeling you've experienced new parts of this beautiful country, enjoying the culinary gems along the way. You won't be disappointed.";
    const buttonContent = getContentItem('discoverTour-button') ||
        getItemById('home', 'discoverTour', 'discoverTour-button')?.content ||
        "Explore All Our Tours";

    return (
        <section className="relative px-4 sm:px-6 lg:px-20 py-12 overflow-hidden">
            {/* Decorative Image - Upper Left */}
            <img
                src="/vector.svg"
                alt="Decorative element"
                className="absolute -top-3 lg:-top-15 left-0 max-w-none w-[200%] lg:w-240 h-[180px] lg:h-70 pointer-events-none -z-1"
            />

            {/* Content Container */}
            <div className="relative z-10 bg-blue-100 rounded-xl mt-3 p-7">
                {/* Content Layout - 2 columns on desktop, stacked on mobile */}
                <div className="grid grid-cols-1 lg:grid-cols-6 mb-10">
                    <div className="space-y-6 lg:col-span-1 me-10">
                        <h3 className="text-header font-bold text-lg">{headingContent}</h3>
                    </div>

                    <div className="lg:col-span-1"></div>

                    <div className="space-y-6 lg:col-span-4">
                        <h2 className="text-3xl lg:text-4xl font-medium text-content">
                            {titleContent}
                        </h2>

                        <p className="text-sm text-content">
                            {descriptionContent}
                        </p>

                        <a href="/our-tours">
                            <button className="flex items-center space-x-2 bg-content hover:bg-blue-500 text-white text-xs font-medium px-5 py-3 rounded-full group hover:translate-x-2 hover:min-w-[140px] transition-all duration-300 cursor-pointer">
                                <span>{buttonContent}</span>
                                <ArrowUpRight className="h-4 w-4 group-hover:translate-x-1 transition-transform duration-300" />
                            </button>
                        </a>
                    </div>
                </div>

                {/* Tour Cards - 2 columns on desktop, stacked on mobile */}
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                    {loading ? (
                        // Loading state
                        <>
                            <div className="bg-white rounded-xl overflow-hidden">
                                <div className="h-90 bg-gray-200 animate-pulse rounded-xl"></div>
                                <div className="px-4 lg:px-6 mb-4 lg:mb-10 mt-2 space-y-3">
                                    <div className="h-4 bg-gray-200 animate-pulse rounded"></div>
                                    <div className="h-3 bg-gray-200 animate-pulse rounded"></div>
                                    <div className="h-3 bg-gray-200 animate-pulse rounded w-3/4"></div>
                                </div>
                            </div>
                            <div className="bg-white rounded-xl overflow-hidden">
                                <div className="h-90 bg-gray-200 animate-pulse rounded-xl"></div>
                                <div className="px-4 lg:px-6 mb-4 lg:mb-10 mt-2 space-y-3">
                                    <div className="h-4 bg-gray-200 animate-pulse rounded"></div>
                                    <div className="h-3 bg-gray-200 animate-pulse rounded"></div>
                                    <div className="h-3 bg-gray-200 animate-pulse rounded w-3/4"></div>
                                </div>
                            </div>
                        </>
                    ) : error ? (
                        // Error state
                        <div className="col-span-1 lg:col-span-2 bg-white rounded-xl p-6 text-center">
                            <p className="text-gray-500">{error}</p>
                        </div>
                    ) : tours.length === 0 ? (
                        // Empty state
                        <div className="col-span-1 lg:col-span-2 bg-white rounded-xl p-6 text-center">
                            <p className="text-gray-500">No tours available at the moment</p>
                        </div>
                    ) : (
                        // Map through the fetched tours data
                        tours.map((tour) => (
                            <a key={tour.id} href={tour.detailsUrl}>
                                <div className="bg-white hover:bg-sky-50 rounded-xl overflow-hidden cursor-pointer group/card transition-colors duration-300">
                                    <div className="relative h-90 overflow-hidden rounded-xl">
                                        <div className="absolute top-6 left-6 flex space-x-2 z-10 bg-white rounded-md px-3 py-2">
                                            <span className="font-bold text-xs text-content">INCOMING • {tour.date}</span>
                                        </div>
                                        <div className="h-full w-full p-2 lg:p-3">
                                            <div className="relative h-full w-full overflow-hidden rounded-xl">
                                                <img
                                                    src={tour.imageUrl}
                                                    alt={`${tour.title} image`}
                                                    className="w-full h-full object-cover transition-transform duration-300 group-hover/card:scale-110"
                                                />
                                            </div>
                                        </div>
                                    </div>
                                    <div className="px-4 lg:px-6 mb-4 lg:mb-10 mt-2 space-y-3">
                                        <h3 className="font-bold text-base text-content">{tour.title}</h3>
                                        <p className="text-xs text-slate-500 line-clamp-2 group-hover/card:text-blue-950 transition-colors duration-300">
                                            {tour.shortDescription}
                                        </p>
                                        <div className="flex lg:flex-row flex-col justify-between items-start lg:items-center pt-2 gap-4">
                                            <button className="bg-blue-500 text-white text-xs min-w-[130px] px-2 py-2 rounded-full group flex items-center justify-between transition-all duration-300 cursor-pointer group-hover/card:translate-x-1 group-hover/card:min-w-[140px] group-hover/card:bg-blue-950">
                                                <div className="bg-white rounded-full p-1.5 flex items-center justify-center">
                                                    <ArrowRight className="h-3 w-3 text-blue-500 transition-transform duration-300" />
                                                </div>
                                                <span className="flex-1 text-center group-hover:translate-x-1 transition-transform duration-300 font-medium group-hover/card:translate-x-1">{tour.buttonText}</span>
                                            </button>
                                            <div className="flex items-center space-x-1 text-navy-800">
                                                <span className="text-xs">Start from</span>
                                                <span className="font-bold text-content">${formatPrice(tour.price)}</span>
                                                <span className="text-xs text-gray-500 font-medium">USD</span>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </a>
                        ))
                    )}
                </div>
            </div>

            {/* Decorative Image - Lower Right */}
            <img
                src="/vector-1.svg"
                alt="Decorative element"
                className="absolute bottom-0 -right-50 lg:right-0 w-140 h-25 pointer-events-none -z-1"
            />
        </section>
    )
}