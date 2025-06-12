// import { Button } from "@/components/ui/button"
import {
    Carousel,
    CarouselContent,
    CarouselItem,
    CarouselNext,
    CarouselPrevious,
} from "./ui/carousel"
import { ArrowRight } from "lucide-react"
import { useState, useEffect } from "react"
import Autoplay from "embla-carousel-autoplay";
import { useContentStore } from "../lib/contentStore";
import { useTranslatedContent } from "../hooks/useTranslatedContent";
import { toursApi, TourBasic } from "../lib/api";

// Define Tour type for local use (extending TourBasic with detailsUrl)
interface Tour extends TourBasic {
    detailsUrl: string;
}

export function HeroBanner() {
    const getItemById = useContentStore(state => state.getItemById);
    const { getContentItem } = useTranslatedContent();
    const [tours, setTours] = useState<Tour[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    // Fetch tours from API
    useEffect(() => {
        const fetchTours = async () => {
            try {
                setLoading(true);
                const fetchedTours = await toursApi.getAll();
                
                // Transform API tours to include detailsUrl
                const transformedTours: Tour[] = fetchedTours.map(tour => ({
                    ...tour,
                    detailsUrl: `/tour-details/${tour.id}` // Generate URL based on tour ID
                }));
                
                setTours(transformedTours);
                setError(null);
            } catch (err) {
                console.error('Failed to fetch tours:', err);
                setError('Failed to load tours');
                // Fallback to empty array or could use hardcoded data as fallback
                setTours([]);
            } finally {
                setLoading(false);
            }
        };

        fetchTours();
    }, []);

    // Get translated content - using the useTranslatedContent hook for proper translation support
    const headingContent = getContentItem('heroBanner-heading') ||
        getItemById('home', 'heroBanner', 'heroBanner-heading')?.content ||
        "Explore Vietnam's Top State Schools with Us";
    const paragraph1Content = getContentItem('heroBanner-paragraph1') ||
        getItemById('home', 'heroBanner', 'heroBanner-paragraph1')?.content ||
        "Welcome to UCV - we aim to bridge top schools in Vietnam and international universities. We're a unique connector - we have years of experience on both the university and the school side.";
    const paragraph2Content = getContentItem('heroBanner-paragraph2') ||
        getItemById('home', 'heroBanner', 'heroBanner-paragraph2')?.content ||
        "Specializing in crafting quality school tours across Vietnam, we focus primarily on state schools (mostly Schools for gifted students).";
    const paragraph3Content = getContentItem('heroBanner-paragraph3') ||
        getItemById('home', 'heroBanner', 'heroBanner-paragraph3')?.content ||
        "Join us to build partnerships, explore opportunities, and experience Vietnam's vibrant education landscape.";
    const buttonContent = getContentItem('heroBanner-button') ||
        getItemById('home', 'heroBanner', 'heroBanner-button')?.content ||
        "Find out more";

    const [api, setApi] = useState<any>()
    const [current, setCurrent] = useState(0)
    const [count, setCount] = useState(0)

    useEffect(() => {
        if (!api) {
            return
        }

        setCount(api.scrollSnapList().length)
        setCurrent(api.selectedScrollSnap() + 1)

        api.on("select", () => {
            setCurrent(api.selectedScrollSnap() + 1)
        })
    }, [api])

    // Show loading state
    if (loading) {
        return (
            <section className="relative mx-auto px-4 sm:px-6 lg:px-20 py-12 overflow-hidden">
                <div className="grid grid-cols-1 lg:grid-cols-6 gap-8 items-center">
                    <div className="space-y-6 lg:col-span-2 me-5">
                        <h1 className="text-4xl/10 lg:text-5xl/14 text-content font-medium">
                            {headingContent}
                        </h1>
                        <p className="text-sm text-content font-medium">
                            {paragraph1Content}
                        </p>
                        <p className="text-sm text-content font-medium">
                            {paragraph2Content}
                        </p>
                        <p className="text-sm text-content font-medium">
                            {paragraph3Content}
                        </p>
                    </div>
                    <div className="relative lg:col-span-4">
                        <div className="w-full h-[500px] lg:h-[700px] bg-gray-200 rounded-2xl flex items-center justify-center">
                            <p className="text-gray-500">Loading tours...</p>
                        </div>
                    </div>
                </div>
            </section>
        );
    }

    // Show error state or empty state
    if (error || tours.length === 0) {
        return (
            <section className="relative mx-auto px-4 sm:px-6 lg:px-20 py-12 overflow-hidden">
                <div className="grid grid-cols-1 lg:grid-cols-6 gap-8 items-center">
                    <div className="space-y-6 lg:col-span-2 me-5">
                        <h1 className="text-4xl/10 lg:text-5xl/14 text-content font-medium">
                            {headingContent}
                        </h1>
                        <p className="text-sm text-content font-medium">
                            {paragraph1Content}
                        </p>
                        <p className="text-sm text-content font-medium">
                            {paragraph2Content}
                        </p>
                        <p className="text-sm text-content font-medium">
                            {paragraph3Content}
                        </p>
                    </div>
                    <div className="relative lg:col-span-4">
                        <div className="w-full h-[500px] lg:h-[700px] bg-gray-200 rounded-2xl flex items-center justify-center">
                            <p className="text-gray-500">
                                {error || "No tours available at the moment"}
                            </p>
                        </div>
                    </div>
                </div>
            </section>
        );
    }

    return (
        <section className="relative mx-auto px-4 sm:px-6 lg:px-20 py-12 overflow-hidden">
            {/* Decorative Image - Upper Left */}
            <img
                src="/vector.svg"
                alt="Decorative element"
                className="absolute -top-3 lg:top-0 left-0 lg:-left-15 max-w-none w-[200%] lg:w-240 h-[180px] lg:h-70 pointer-events-none -z-1"
            />

            <div className="grid grid-cols-1 lg:grid-cols-6 gap-8 items-center">
                {/* Left Content - 2 columns */}
                <div className="space-y-6 lg:col-span-2 me-5">
                    <h1 className="text-4xl/10 lg:text-5xl/14 text-content font-medium">
                        {headingContent}
                    </h1>

                    <p className="text-sm text-content font-medium">
                        {paragraph1Content}
                    </p>

                    <p className="text-sm text-content font-medium">
                        {paragraph2Content}
                    </p>
                    <p className="text-sm text-content font-medium">
                        {paragraph3Content}
                    </p>
                </div>

                {/* Right Carousel - 4 columns with Tour Card Overlay */}
                <div className="relative lg:col-span-4">
                    <Carousel className="w-full" setApi={setApi} plugins={[Autoplay({ delay: 4000 })]}>
                        <CarouselContent>
                            {tours.map((tour) => (
                                <CarouselItem key={tour.id}>
                                    <div className="relative w-full overflow-hidden rounded-2xl"
                                        style={{
                                            height: typeof window !== 'undefined' && window.innerWidth < 1024
                                                ? "500px"
                                                : "700px"
                                        }}>
                                        <img
                                            src={tour.imageUrl}
                                            alt={`${tour.title} image`}
                                            className="w-full h-full object-cover"
                                        />
                                        {/* Tour Info Card Overlay */}
                                        <div className="absolute bottom-2 lg:bottom-3 left-2 lg:left-3 max-w-xs lg:max-w-md bg-white rounded-2xl shadow-lg px-4 lg:px-6 pb-4 lg:pb-6">
                                            <div className="relative inline-block bg-content text-white rounded-lg px-5 py-1 -top-4">
                                                <span className="font-medium text-xs">INCOMING • {tour.date}</span>
                                            </div>

                                            <h2 className="text-2xl lg:text-4xl font-medium text-content pb-3 border-b-2 border-accent-blue">
                                                {tour.title}
                                            </h2>

                                            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mt-3">
                                                <p className="text-content text-xs line-clamp-2">
                                                    {tour.shortDescription}
                                                </p>
                                                <a href={tour.detailsUrl}>
                                                    <button className="bg-blue-500 hover:bg-blue-950 text-white text-xs min-w-[130px] px-2 py-2 rounded-full group flex items-center justify-between transition-all duration-300 hover:-translate-x-2 hover:min-w-[140px] cursor-pointer">
                                                        <div className="bg-white rounded-full p-1.5 flex items-center justify-center">
                                                            <ArrowRight className="h-3 w-3 text-blue-500 transition-transform duration-300" />
                                                        </div>
                                                        <span className="flex-1 text-center group-hover:-translate-x-1 transition-transform duration-300 font-medium">
                                                            {buttonContent}
                                                        </span>
                                                    </button>
                                                </a>
                                            </div>
                                        </div>
                                    </div>
                                </CarouselItem>
                            ))}
                        </CarouselContent>

                        {/* Navigation Arrows - Hidden on Mobile */}
                        <div className="hidden lg:block">
                            <CarouselPrevious className="absolute left-4 top-1/2 cursor-pointer" />
                            <CarouselNext className="absolute right-4 top-1/2 cursor-pointer" />
                        </div>

                        {/* Pagination Indicator - Hidden on Mobile */}
                        <div className="absolute bottom-3 right-4 px-4 py-2 font-medium text-lg items-center gap-2 hidden lg:flex">
                            <div className="flex space-x-1 items-center">
                                {Array.from({ length: count }).map((_, i) => (
                                    <span
                                        key={i}
                                        className={`block rounded-full ${current === i + 1
                                            ? 'bg-neutral-50 h-2 w-2 mt-1 mx-1'
                                            : 'bg-gray-400 h-1 w-1 mx-1'
                                            } transition-all duration-300`}
                                        style={{
                                            transform: current === i + 1 ? 'translateY(-2px)' : 'translateY(0)'
                                        }}
                                    />
                                ))}
                            </div>
                            <span className="ms-5 text-white text-6xl font-medium">
                                {current < 10 ? `0${current}` : current}
                            </span>
                        </div>
                    </Carousel>
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