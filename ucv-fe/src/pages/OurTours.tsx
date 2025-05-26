import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import { ArrowRight } from "lucide-react";
import { useState, useEffect } from "react";
import { useContentStore } from "@/lib/contentStore";
import { toursApi, TourBasic } from "@/lib/api";

import {
    Pagination,
    PaginationContent,
    PaginationEllipsis,
    PaginationItem,
    PaginationLink,
    PaginationNext,
    PaginationPrevious,
} from "@/components/ui/pagination";

// Update Tour type to match API response
interface Tour {
    id: string;
    title: string;
    description: string;
    imageUrl: string;
    price: string;
    date: string;
    detailsUrl: string;
    buttonText: string;
}

// TourCard component
function TourCard({ tour }: { tour: Tour }) {
    return (
        <a href={tour.detailsUrl} className="bg-white hover:bg-sky-50 rounded-xl overflow-hidden cursor-pointer group/card transition-colors duration-300 border-2 border-blue-200/50">
            <div className="relative h-90 overflow-hidden rounded-xl">
                <div className="absolute top-6 left-6 flex space-x-2 z-10 bg-white rounded-md px-3 py-2">
                    <span className="font-bold text-xs text-content">INCOMING • {tour.date}</span>
                </div>
                <div className="h-full w-full p-3">
                    <div className="relative h-full w-full overflow-hidden rounded-xl">
                        <img
                            src={tour.imageUrl}
                            alt="Tour image"
                            className="w-full h-full object-cover transition-transform duration-300 group-hover/card:scale-110"
                        />
                    </div>
                </div>
            </div>
            <div className="px-6 mb-10 mt-2 space-y-3">
                <h3 className="font-bold text-base text-content">{tour.title}</h3>
                <p className="text-xs text-slate-500 line-clamp-2 group-hover/card:text-blue-950 transition-colors duration-300">
                    {tour.description}
                </p>
                <div className="flex justify-between items-center pt-2">
                    <button className="bg-blue-500 text-white text-xs min-w-[130px] px-2 py-2 rounded-full group flex items-center justify-between transition-all duration-300 cursor-pointer group-hover/card:translate-x-1 group-hover/card:min-w-[140px] group-hover/card:bg-blue-950">
                        <div className="bg-white rounded-full p-1.5 flex items-center justify-center">
                            <ArrowRight className="h-3 w-3 text-blue-500 transition-transform duration-300" />
                        </div>
                        <span className="flex-1 text-center group-hover:translate-x-1 transition-transform duration-300 font-medium group-hover/card:translate-x-1">{tour.buttonText}</span>
                    </button>
                    <div className="flex items-center space-x-1 text-navy-800">
                        <span className="text-xs">Start from</span>
                        <span className="font-bold text-content">{tour.price}</span>
                        <span className="text-xs text-gray-500 font-medium">USD</span>
                    </div>
                </div>
            </div>
        </a>
    );
}

export default function OurTours() {
    const [currentPage, setCurrentPage] = useState(1);
    const [toursPerPage, setToursPerPage] = useState(9); // 9 cards per page in desktop view
    const [tours, setTours] = useState<Tour[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    
    const getPageContent = useContentStore(state => state.getPageContent);
    const ourToursContent = getPageContent('our-tours');
    
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
    
    // Header section content
    const headerTitle = ourToursContent?.sections.headerSection?.items.find(
        item => item.id === 'headerSection-title'
    )?.content || "Exclusive access to prestigious state schools, hand-picked for their academic excellence.";
    
    const headerDescription = ourToursContent?.sections.headerSection?.items.find(
        item => item.id === 'headerSection-description'
    )?.content || "As we know the intense schedule university reps have, we tailor our tours to be highly productive and fun at the same time. We want you to leave feeling you've experienced new parts of this beautiful country, enjoying the culinary gems along the way. You won't be disappointed.";

    // Fetch tours from API
    useEffect(() => {
        const fetchTours = async () => {
            try {
                setLoading(true);
                const toursData = await toursApi.getAll();
                
                // Map TourBasic to Tour interface
                const mappedTours: Tour[] = toursData.map((tour: TourBasic) => ({
                    id: tour.id,
                    title: tour.title,
                    description: tour.shortDescription,
                    imageUrl: tour.imageUrl,
                    price: `$${formatPrice(tour.price)}`,
                    date: tour.date,
                    detailsUrl: `/tour-details/${tour.id}`,
                    buttonText: "Find out more"
                }));
                
                setTours(mappedTours);
                setError(null);
            } catch (err) {
                console.error('Error fetching tours:', err);
                setError('Failed to load tours. Please try again later.');
            } finally {
                setLoading(false);
            }
        };

        fetchTours();
    }, []);
    
    const totalPages = Math.ceil(tours.length / toursPerPage);

    // Update toursPerPage based on window width
    useEffect(() => {
        const handleResize = () => {
            setToursPerPage(window.innerWidth < 768 ? 6 : 9);
        };

        // Set initial value
        handleResize();

        // Add event listener
        window.addEventListener('resize', handleResize);

        // Cleanup
        return () => {
            window.removeEventListener('resize', handleResize);
        };
    }, []);

    // Get current page tours
    const indexOfLastTour = currentPage * toursPerPage;
    const indexOfFirstTour = indexOfLastTour - toursPerPage;
    const currentTours = tours.slice(indexOfFirstTour, indexOfLastTour);

    // Function to handle page change
    const handlePageChange = (page: number) => {
        setCurrentPage(page);
        // Scroll to top when changing pages
        window.scrollTo({ top: 0, behavior: 'smooth' });
    };

    // Generate page items for pagination
    const renderPaginationItems = () => {
        const items = [];
        
        // First page is always shown
        items.push(
            <PaginationItem key="page-1">
                <PaginationLink 
                    onClick={() => handlePageChange(1)}
                    isActive={currentPage === 1}
                    className={`cursor-pointer hover:bg-blue-200/30 transition-colors ${
                        currentPage === 1 ? "bg-blue-200 border-none" : ""
                    }`}
                >
                    1
                </PaginationLink>
            </PaginationItem>
        );
        
        // Add ellipsis if needed before middle pages
        if (currentPage > 3) {
            items.push(
                <PaginationItem key="ellipsis-1">
                    <PaginationEllipsis />
                </PaginationItem>
            );
        }
        
        // Add middle pages
        for (let page = Math.max(2, currentPage - 1); page <= Math.min(totalPages - 1, currentPage + 1); page++) {
            if (page <= 1 || page >= totalPages) continue;
            
            items.push(
                <PaginationItem key={`page-${page}`}>
                    <PaginationLink 
                        onClick={() => handlePageChange(page)}
                        isActive={currentPage === page}
                        className={`cursor-pointer hover:bg-blue-200/30 transition-colors ${
                            currentPage === page ? "bg-blue-200 border-none" : ""
                        }`}
                    >
                        {page}
                    </PaginationLink>
                </PaginationItem>
            );
        }
        
        // Add ellipsis if needed after middle pages
        if (currentPage < totalPages - 2) {
            items.push(
                <PaginationItem key="ellipsis-2">
                    <PaginationEllipsis />
                </PaginationItem>
            );
        }
        
        // Last page is always shown if there are more than 1 page
        if (totalPages > 1) {
            items.push(
                <PaginationItem key={`page-${totalPages}`}>
                    <PaginationLink 
                        onClick={() => handlePageChange(totalPages)}
                        isActive={currentPage === totalPages}
                        className={`cursor-pointer hover:bg-blue-200/30 transition-colors ${
                            currentPage === totalPages ? "bg-blue-200 border-none" : ""
                        }`}
                    >
                        {totalPages}
                    </PaginationLink>
                </PaginationItem>
            );
        }
        
        return items;
    };

    return (
        <div className="">
            <Navbar />
            <main className="pt-24 pb-16 lg:mx-10">
                {/* Decorative Image */}
                <img
                    src="/vector.svg"
                    alt="Decorative element"
                    className="absolute top-28 lg:top-28 left-0 lg:-left-20 max-w-none w-full lg:w-300 lg:h-70 pointer-events-none -z-1  sm:w-[200%]"
                />
                {/* Header Section */}
                <section className="relative mx-auto px-4 sm:px-6 lg:px-20 pt-12 overflow-hidden">
                    {/* Content Container */}
                    <div className="relative z-10">
                        <div className="grid grid-cols-1 lg:grid-cols-8">
                            <div className="space-y-6 lg:col-span-6">
                                <h2 className="text-3xl lg:text-5xl font-medium text-content">
                                    {headerTitle}
                                </h2>

                                <p className="text-sm text-content font-medium">
                                    {headerDescription}
                                </p>
                            </div>
                        </div>
                    </div>
                </section>

                {/* Tours Section */}
                <section className="relative mx-auto px-4 sm:px-6 lg:px-20 py-12">
                    {loading && (
                        <div className="flex justify-center items-center py-12">
                            <div className="text-lg text-gray-600">Loading tours...</div>
                        </div>
                    )}

                    {error && (
                        <div className="flex justify-center items-center py-12">
                            <div className="text-lg text-red-600">{error}</div>
                        </div>
                    )}

                    {!loading && !error && tours.length === 0 && (
                        <div className="flex justify-center items-center py-12">
                            <div className="text-lg text-gray-600">No tours available at the moment.</div>
                        </div>
                    )}

                    {!loading && !error && tours.length > 0 && (
                        <>
                            <div className="tours-grid grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                                {currentTours.map(tour => (
                                    <TourCard key={tour.id} tour={tour} />
                                ))}
                            </div>

                            {/* Shadcn Pagination */}
                            {totalPages > 1 && (
                                <div className="mt-10">
                                    <Pagination>
                                        <PaginationContent>
                                            <PaginationItem>
                                                <PaginationPrevious 
                                                    onClick={() => handlePageChange(Math.max(1, currentPage - 1))} 
                                                    aria-disabled={currentPage === 1}
                                                    className={`cursor-pointer hover:bg-blue-200/30 transition-colors ${
                                                        currentPage === 1 ? "pointer-events-none opacity-50" : ""
                                                    }`}
                                                />
                                            </PaginationItem>
                                            
                                            {renderPaginationItems()}
                                            
                                            <PaginationItem>
                                                <PaginationNext 
                                                    onClick={() => handlePageChange(Math.min(totalPages, currentPage + 1))} 
                                                    aria-disabled={currentPage === totalPages}
                                                    className={`cursor-pointer hover:bg-blue-200/30 transition-colors ${
                                                        currentPage === totalPages ? "pointer-events-none opacity-50" : ""
                                                    }`}
                                                />
                                            </PaginationItem>
                                        </PaginationContent>
                                    </Pagination>
                                </div>
                            )}
                        </>
                    )}
                </section>
            </main>

            <Footer />
        </div>
    );
}

