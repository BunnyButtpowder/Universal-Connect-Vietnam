import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import { Carousel, CarouselContent, CarouselItem, type CarouselApi, CarouselPrevious, CarouselNext } from "@/components/ui/carousel";
import { ArrowRight, Settings2 } from "lucide-react";
import { useState, useEffect } from "react";
import Autoplay from "embla-carousel-autoplay";
import { useContentStore } from "../lib/contentStore";

// Define Tour type
interface Tour {
    id: number;
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
                        />
                    </div>
                </div>
            </div>
            <div className="px-6 mb-5 mt-2 space-y-3">
                <h3 className="font-bold text-base text-content">{tour.title}</h3>
                <p className="text-xs text-slate-500 line-clamp-3 lg:line-clamp-2 group-hover/card:text-blue-950 transition-colors duration-300">
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

export default function SpringTourDetails() {
    const [api, setApi] = useState<CarouselApi>();
    const [current, setCurrent] = useState(1);
    // const [selectedDate, setSelectedDate] = useState<Date | undefined>(new Date());
    // const [showCalendar, setShowCalendar] = useState(false);
    // const [menuType, setMenuType] = useState<string | null>(null);
    // const [daysToAdd, setDaysToAdd] = useState('');
    const count = 4;
    const getItemById = useContentStore(state => state.getItemById);

    // Custom content for Spring Tour 2026
    const tourDate = getItemById('spring-tour-details', 'bannerSection', 'tourBanner-date')?.content || "INCOMING • 31 MARCH - 10 APRIL 2026";
    const tourTitle = getItemById('spring-tour-details', 'bannerSection', 'tourBanner-title')?.content || "Spring Tour 2026";
    const tourDescription = getItemById('spring-tour-details', 'bannerSection', 'tourBanner-description')?.content || "Explore the vibrant educational landscape of Northern, Central & Southern Vietnam's best institutions. This spring tour offers unique access to top-rated schools in Hanoi, Hai Phong, Hue, Da Nang & Ho Chi Minh City.\n\nThis tour has been carefully designed to showcase schools with strong English programs and students particularly interested in international education opportunities. Each school visit is optimized for meaningful connections and productive discussions.";
    const tourLocation = getItemById('spring-tour-details', 'bannerSection', 'tourBanner-location')?.content || "Northern Vietnam (Hanoi, Hai Duong)";
    const tourDuration = getItemById('spring-tour-details', 'bannerSection', 'tourBanner-duration')?.content || "10 schools across 3 northern cities over 5 days.";
    const tourCustomize = getItemById('spring-tour-details', 'bannerSection', 'tourBanner-customize')?.content || "Select from the full experience or customize to specific regions.";
    const tourStartDate = getItemById('spring-tour-details', 'bannerSection', 'tourBanner-startDate')?.content || "April, 2026";

    // Get tour data from content store for other tours section
    // Card 1 content (Fall Tour 2025) - using fallback values since tour cards are now API-driven
    const card1Date = "1 - 8 OCTOBER 2025";
    const card1Title = "Fall Tour 2025";
    const card1Description = "Visiting a mix of top public and private high schools in Hanoi, Hai Duong, Hue & Da Nang. The participating schools demonstrate a keen interest in international education. We've curated our selection with local experts considering socio-economic demographics to ensure a valuable visit for you.";
    const card1Price = "$2065";
    const card1DetailsUrl = "/tour-details";
    const card1Button = "Find out more";

    // Create tour cards data from contentStore items
    const otherTours: Tour[] = [
        {
            id: 1,
            title: card1Title,
            description: card1Description,
            imageUrl: "/hero-banner-1.png",
            price: card1Price,
            date: card1Date,
            detailsUrl: card1DetailsUrl,
            buttonText: card1Button
        }
    ];

    useEffect(() => {
        if (!api) {
            return;
        }

        setCurrent(api.selectedScrollSnap() + 1);

        api.on("select", () => {
            setCurrent(api.selectedScrollSnap() + 1);
        });
    }, [api]);

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
                            src="/hero-banner-2.png"
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
                    <div className="block lg:hidden text-content text-sm font-medium my-4 px-2">
                        {tourDescription.split('\n\n')[0]}
                    </div>

                    {/* Tour Info Card Overlay */}
                    <div className="absolute bottom-0 lg:bottom-10 lg:ms-28 lg:me-48 tour-info-card-bg rounded-2xl px-4 lg:px-6 pb-4 lg:pb-6">
                        <div className="relative inline-block bg-content text-white rounded-lg px-5 py-1 -top-4">
                            <span className="font-medium text-xs">{tourDate}</span>
                        </div>
                        <div className="flex flex-col lg:flex-row justify-between border-b border-blue-200/50 pb-3 lg:mx-3">
                            <h2 className="text-3xl lg:text-4xl font-medium text-content pb-3">{tourTitle}</h2>
                            <div className="flex flex-row gap-2 items-center">
                                <span className="text-content text-sm font-medium me-3">Share</span>
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
                                    {tourDescription}
                                </p>
                                <a href="/sign-up/spring-tour-2026">
                                    <button
                                        type="submit"
                                        className="lg:absolute lg:bottom-6 w-full md:w-auto bg-blue-950 text-white text-sm font-medium min-w-[130px] px-5 py-3 rounded-full group flex items-center justify-center transition-all duration-300 hover:min-w-[150px] cursor-pointer space-x-2"
                                    >
                                        Sign Up Now
                                        <img src="/send-icon.svg" alt="Send Icon" className="h-3 w-3 ms-2 group-hover:translate-x-2 transition-transform duration-300" />
                                    </button>
                                </a>
                            </div>
                            <div className="lg:col-span-2">
                                <div className="flex flex-col gap-5">
                                    <div className="flex items-center gap-2">
                                        <img src="/map-pin-blue-950.svg" alt="Map Pin" className="w-6 h-6" />
                                        <div className="flex flex-col gap-1">
                                            <span className="text-content text-xs font-bold uppercase">LOCATION</span>
                                            <span className="text-content text-sm">{tourLocation}</span>
                                        </div>
                                    </div>
                                    <div className="flex items-center gap-2">
                                        <img src="/duration.svg" alt="Duration Icon" className="w-6 h-6" />
                                        <div className="flex flex-col gap-1">
                                            <span className="text-content text-xs font-bold uppercase">DURATION</span>
                                            <span className="text-content text-sm">{tourDuration}</span>
                                        </div>
                                    </div>
                                    <div className="flex items-center gap-2">
                                        <Settings2 className="w-6 h-6 text-blue-950" />
                                        <div className="flex flex-col gap-1">
                                            <span className="text-content text-xs font-bold uppercase">CUSTOMIZE</span>
                                            <span className="text-content text-sm">{tourCustomize}</span>
                                        </div>
                                    </div>
                                    <div className="flex items-center gap-2">
                                        <img src="/calender.svg" alt="Calender Icon" className="w-6 h-6" />
                                        <div className="flex flex-col gap-1">
                                            <span className="text-content text-xs font-bold uppercase">Tour dates</span>
                                            <span className="text-content text-sm">{tourStartDate}</span>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Events in the Schools */}
            <div className="mx-4 lg:mx-48 2xl:mx-48 my-10 grid grid-cols-1 lg:grid-cols-5 gap-10 lg:gap-20">
                <div className="grid lg:col-span-2 grid-rows-6 lg:grid-rows-10">
                    <div className="flex flex-row lg:row-span-2">
                        <span className="text-header text-md font-bold uppercase">
                            {getItemById('spring-tour-details', 'eventsSection', 'events-heading')?.content || "EVENTS IN THE SCHOOLS"}
                        </span>
                    </div>
                    <div className="flex flex-col row-span-5 lg:row-span-7 justify-center">
                        <a href="#" className="hover:bg-blue-200/50 transition-all duration-300">
                            <div className="flex flex-row gap-6 px-6 py-8 border-y border-blue-200/50">
                                <img src="/edu-icon.svg" alt="Event 1" className="w-6 h-6" />
                                <span className="text-content text-md font-medium">
                                    {getItemById('spring-tour-details', 'eventsSection', 'events-item1')?.content || "In-school preparation workshops (by IUC)"}
                                </span>
                            </div>
                        </a>
                        <a href="#" className="hover:bg-blue-200/50 transition-all duration-300">
                            <div className="flex flex-row gap-6 px-6 py-8 border-b border-blue-200/50">
                                <img src="/speak.svg" alt="Event 2" className="w-6 h-6" />
                                <span className="text-content text-md font-medium">
                                    {getItemById('spring-tour-details', 'eventsSection', 'events-item2')?.content || "University spotlight presentations"}
                                </span>
                            </div>
                        </a>
                        <a href="#" className="hover:bg-blue-200/50 transition-all duration-300">
                            <div className="flex flex-row gap-6 px-6 py-8 border-b border-blue-200/50">
                                <img src="/speak.svg" alt="Event 3" className="w-6 h-6" />
                                <span className="text-content text-md font-medium">
                                    {getItemById('spring-tour-details', 'eventsSection', 'events-item3')?.content || "Interactive Q&A sessions"}
                                </span>
                            </div>
                        </a>
                        <a href="#" className="hover:bg-blue-200/50 transition-all duration-300">
                            <div className="flex flex-row gap-6 px-6 py-8 border-b border-blue-200/50">
                                <img src="/edu.svg" alt="Event 4" className="w-6 h-6" />
                                <span className="text-content text-md font-medium">
                                    {getItemById('spring-tour-details', 'eventsSection', 'events-item4')?.content || "Student recruitment workshops"}
                                </span>
                            </div>
                        </a>
                        <a href="#" className="hover:bg-blue-200/50 transition-all duration-300">
                            <div className="flex flex-row gap-6 px-6 py-8 border-b border-blue-200/50">
                                <img src="/mountain.svg" alt="Event 5" className="w-6 h-6" />
                                <span className="text-content text-md font-medium">
                                    {getItemById('spring-tour-details', 'eventsSection', 'events-item5')?.content || "Education fairs with local students"}
                                </span>
                            </div>
                        </a>
                    </div>
                </div>
                <div className="grid lg:col-span-3 lg:grid-rows-10">
                    <div className="flex flex-row lg:row-span-2 mb-10 lg:mb-0">
                        <span className="text-content text-3xl lg:text-4xl font-semibold">
                            {getItemById('spring-tour-details', 'eventsSection', 'events-title')?.content || "Engage directly with qualified students through diverse and interactive events."}
                        </span>
                    </div>
                    {/* Carousel */}
                    <div className="relative rounded-3xl overflow-hidden flex flex-row lg:row-span-7">
                        <Carousel className="w-full" setApi={setApi} plugins={[Autoplay({ delay: 4000 })]}>
                            <CarouselContent>
                                <CarouselItem>
                                    <div className="carousel-image-container h-[500px] relative">
                                        <img
                                            src="/classroom.png"
                                            alt="University presentation"
                                            className="w-full h-full object-cover"
                                        />
                                    </div>
                                </CarouselItem>
                                <CarouselItem>
                                    <div className="carousel-image-container h-[500px] relative">
                                        <img
                                            src="/display1.png"
                                            alt="Classroom session"
                                            className="w-full h-full object-cover"
                                        />
                                    </div>
                                </CarouselItem>
                                <CarouselItem>
                                    <div className="carousel-image-container h-[500px] relative">
                                        <img
                                            src="/display2.png"
                                            alt="School collaboration"
                                            className="w-full h-full object-cover"
                                        />
                                    </div>
                                </CarouselItem>
                            </CarouselContent>

                            {/* Pagination Indicator - Visible on all screens */}
                            <div className="absolute bottom-4 -right-5 lg:left-1/2 transform -translate-x-1/2 lg:left-auto lg:translate-x-0 lg:right-4 px-4 py-2 font-medium text-lg items-center gap-2 flex">
                                <div className="flex space-x-1 items-center">
                                    {Array.from({ length: count }).map((_, i) => (
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
            <div className="px-4 md:px-6 lg:px-48 bg-blue-50 py-16 px-8 lg:px-16 rounded-3xl mt-20 lg:mt-0">
                <div className="grid grid-cols-1 lg:grid-cols-4 gap-10 mt-5">
                    {/* Header and description - 1/4 of grid */}
                    <div className="flex flex-col space-y-6">
                        <h3 className="text-header font-bold text-lg">
                            {getItemById('spring-tour-details', 'locationsSection', 'locations-heading')?.content || "SPRING TOUR"}
                        </h3>
                        <h2 className="text-content text-3xl lg:text-4xl font-medium">
                            {getItemById('spring-tour-details', 'locationsSection', 'locations-title')?.content || "Visiting 10 leading schools across Northern Vietnam's educational hubs."}
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
                                    {/* Ha Noi Location */}
                                    <CarouselItem className="basis-full md:basis-1/3">
                                        <div className="location-card-container rounded-xl overflow-hidden">
                                            <div className="w-full h-50 lg:h-70 rounded-3xl overflow-hidden">
                                                <img
                                                    src="/HaNoi.jpg"
                                                    alt="HaNoi"
                                                    className="location-image w-full h-full object-cover"
                                                    onError={(e) => {
                                                        (e.target as HTMLImageElement).src = "/hero-banner-2.png";
                                                    }}
                                                />
                                            </div>
                                            <div className="location-details p-4 flex items-center gap-4">
                                                <span className="location-name font-semibold text-content">
                                                    {getItemById('spring-tour-details', 'locationsSection', 'locations-hanoi')?.content || "Ha Noi"}
                                                </span>
                                                <a
                                                    href="https://en.wikipedia.org/wiki/Hanoi"
                                                    target="_blank"
                                                    rel="noopener noreferrer"
                                                    className="location-link flex items-center text-sm text-blue-500 cursor-pointer"
                                                >
                                                    <img src="/link.svg" alt="Wikipedia" className="link-icon w-4 h-4 mr-1" />
                                                    Wikipedia
                                                </a>
                                            </div>
                                        </div>
                                    </CarouselItem>

                                    {/* Hai Phong Location */}
                                    <CarouselItem className="basis-full md:basis-1/3">
                                        <div className="location-card-container rounded-xl overflow-hidden">
                                            <div className="w-full h-50 lg:h-70 rounded-3xl overflow-hidden">
                                                <img
                                                    src="/HaiPhong.jpg"
                                                    alt="HaiPhong"
                                                    className="location-image w-full h-full object-cover"
                                                    onError={(e) => {
                                                        (e.target as HTMLImageElement).src = "/hero-banner-2.png";
                                                    }}
                                                />
                                            </div>
                                            <div className="location-details p-4 flex items-center gap-4">
                                                <span className="location-name font-semibold text-content">
                                                    {getItemById('spring-tour-details', 'locationsSection', 'locations-haiphong')?.content || "Hai Phong"}
                                                </span>
                                                <a
                                                    href="https://en.wikipedia.org/wiki/Haiphong"
                                                    target="_blank"
                                                    rel="noopener noreferrer"
                                                    className="location-link flex items-center text-sm text-blue-500 cursor-pointer"
                                                >
                                                    <img src="/link.svg" alt="Wikipedia" className="link-icon w-4 h-4 mr-1" />
                                                    Wikipedia
                                                </a>
                                            </div>
                                        </div>
                                    </CarouselItem>

                                    {/* Hue Location */}
                                    <CarouselItem className="basis-full md:basis-1/3">
                                        <div className="location-card-container rounded-xl overflow-hidden">
                                            <div className="w-full h-50 lg:h-70 rounded-3xl overflow-hidden">
                                                <img
                                                    src="/Hue.png"
                                                    alt="Hue"
                                                    className="location-image w-full h-full object-cover"
                                                    onError={(e) => {
                                                        (e.target as HTMLImageElement).src = "/hero-banner-1.png";
                                                    }}
                                                />
                                            </div>
                                            <div className="location-details p-4 flex items-center gap-4">
                                                <span className="location-name font-semibold text-content">
                                                    {getItemById('tour-details', 'locationsSection', 'locations-hue')?.content || "Hue"}
                                                </span>
                                                <a
                                                    href="https://en.wikipedia.org/wiki/Hu%E1%BA%BF"
                                                    target="_blank"
                                                    rel="noopener noreferrer"
                                                    className="location-link flex items-center text-sm text-blue-500 cursor-pointer"
                                                >
                                                    <img src="/link.svg" alt="Wikipedia" className="link-icon w-4 h-4 mr-1" />
                                                    Wikipedia
                                                </a>
                                            </div>
                                        </div>
                                    </CarouselItem>

                                    {/* Danang Location */}
                                    <CarouselItem className="basis-full md:basis-1/3">
                                        <div className="location-card-container rounded-xl overflow-hidden">
                                            <div className="w-full h-50 lg:h-70 rounded-3xl overflow-hidden">
                                                <img
                                                    src="/DaNang.png"
                                                    alt="DaNang"
                                                    className="location-image w-full h-full object-cover"
                                                    onError={(e) => {
                                                        (e.target as HTMLImageElement).src = "/hero-banner-1.png";
                                                    }}
                                                />
                                            </div>
                                            <div className="location-details p-4 flex items-center gap-4">
                                                <span className="location-name font-semibold text-content">
                                                    {getItemById('tour-details', 'locationsSection', 'locations-danang')?.content || "Da Nang"}
                                                </span>
                                                <a
                                                    href="https://en.wikipedia.org/wiki/Da_Nang"
                                                    target="_blank"
                                                    rel="noopener noreferrer"
                                                    className="location-link flex items-center text-sm text-blue-500 cursor-pointer"
                                                >
                                                    <img src="/link.svg" alt="Wikipedia" className="link-icon w-4 h-4 mr-1" />
                                                    Wikipedia
                                                </a>
                                            </div>
                                        </div>
                                    </CarouselItem>

                                    {/* HCMC Location */}
                                    <CarouselItem className="basis-full md:basis-1/3">
                                        <div className="location-card-container rounded-xl overflow-hidden">
                                            <div className="w-full h-50 lg:h-70 rounded-3xl overflow-hidden">
                                                <img
                                                    src="/HCMC.jpg"
                                                    alt="HCMC"
                                                    className="location-image w-full h-full object-cover"
                                                    onError={(e) => {
                                                        (e.target as HTMLImageElement).src = "/hero-banner-1.png";
                                                    }}
                                                />
                                            </div>
                                            <div className="location-details p-4 flex items-center gap-4">
                                                <span className="location-name font-semibold text-content">
                                                    {getItemById('tour-details', 'locationsSection', 'locations-hcmc')?.content || "HCMC"}
                                                </span>
                                                <a
                                                    href="https://en.wikipedia.org/wiki/Ho_Chi_Minh_City"
                                                    target="_blank"
                                                    rel="noopener noreferrer"
                                                    className="location-link flex items-center text-sm text-blue-500 cursor-pointer"
                                                >
                                                    <img src="/link.svg" alt="Wikipedia" className="link-icon w-4 h-4 mr-1" />
                                                    Wikipedia
                                                </a>
                                            </div>
                                        </div>
                                    </CarouselItem>
                                </CarouselContent>

                                {/* Navigation buttons */}
                                <div className="carousel-navigation flex items-center justify-between">
                                    <CarouselPrevious className="carousel-prev-button relative -left-0 translate-y-0 lg:-left-0 cursor-pointer" />
                                    <CarouselNext className="carousel-next-button relative -right-0 translate-y-0 lg:-right-0 cursor-pointer" />
                                </div>

                                {/* Carousel indicators */}
                                <div className="carousel-indicators flex justify-center mt-4">
                                    <div className="carousel-indicator-container flex space-x-2 items-center">
                                        {Array.from({ length: count }).map((_, i) => (
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
                            {getItemById('spring-tour-details', 'pricingSection', 'pricing-heading')?.content || "PRICING"}
                        </h3>
                        <h2 className="text-white text-3xl lg:text-4xl font-medium leading-tight mb-10 lg:mb-0">
                            {getItemById('spring-tour-details', 'pricingSection', 'pricing-title')?.content || "Special early bird discount available for the Spring 2026 tour"}
                        </h2>
                    </div>

                    {/* Pricing table - 3/5 of grid */}
                    <div className="lg:col-span-3">
                        <div className="overflow-hidden rounded-3xl">
                            {/* Table Header */}
                            <div className="grid grid-cols-6 lg:grid-cols-7 bg-blue-500 text-white">
                                <div className="col-span-2 lg:col-span-3 py-4 lg:py-2 px-2 lg:px-4 font-semibold border-r-3 border-white text-sm">
                                    Registration Deadline
                                </div>
                                <div className="col-span-2 py-4 lg:py-2 px-2 lg:px-4 font-semibold border-r-3 border-white text-sm">
                                    Standard Price
                                </div>
                                <div className="col-span-2 py-4 lg:py-2 px-2 lg:px-4 font-semibold text-sm">
                                    Returning University
                                </div>
                            </div>

                            {/* Row 1 */}
                            <div className="grid grid-cols-6 lg:grid-cols-7 bg-white text-content border-b border-blue-200">
                                <div className="col-span-2 lg:col-span-3 px-2 py-4 lg:p-4 font-bold">
                                    {getItemById('spring-tour-details', 'pricingSection', 'pricing-earlybird-deadline')?.content || "Early Bird - 15 Aug 2025"}
                                </div>
                                <div className="col-span-2 px-2 py-4 lg:p-4 font-medium">
                                    {getItemById('spring-tour-details', 'pricingSection', 'pricing-earlybird-price')?.content || "USD $2250"}
                                </div>
                                <div className="col-span-2 px-2 py-4 lg:p-4 font-medium">
                                    {getItemById('spring-tour-details', 'pricingSection', 'pricing-earlybird-returning')?.content || "USD $1900"}
                                </div>
                            </div>

                            {/* Row 2 */}
                            <div className="grid grid-cols-6 lg:grid-cols-7 bg-white text-content border-b border-blue-200">
                                <div className="col-span-2 lg:col-span-3 px-2 py-4 lg:p-4 font-bold">
                                    {getItemById('spring-tour-details', 'pricingSection', 'pricing-standard-deadline')?.content || "Standard - 30 Oct 2025"}
                                </div>
                                <div className="col-span-2 px-2 py-4 lg:p-4 font-medium">
                                    {getItemById('spring-tour-details', 'pricingSection', 'pricing-standard-price')?.content || "USD $2600"}
                                </div>
                                <div className="col-span-2 px-2 py-4 lg:p-4 font-medium">
                                    {getItemById('spring-tour-details', 'pricingSection', 'pricing-standard-returning')?.content || "USD $2200"}
                                </div>
                            </div>

                            {/* Row 3 - Larger row */}
                            <div className="lg:grid lg:grid-cols-7 bg-white text-content">
                                <div className="col-span-5 p-4 ">
                                    <p className="font-bold text-content">
                                        {getItemById('spring-tour-details', 'pricingSection', 'pricing-custom-title')?.content || "Customize your Spring 2026 experience"}
                                    </p>
                                    <p className="text-sm text-gray-600 mt-2">
                                        {getItemById('spring-tour-details', 'pricingSection', 'pricing-custom-description')?.content || "Work with our team to design a Northern Vietnam tour specifically suited to your university's recruitment goals."}
                                    </p>
                                </div>
                                <div className="col-span-2 p-4 flex items-center ">
                                    <a href="/sign-up/spring-tour-2026">
                                        <button
                                            type="submit"
                                            className="w-full bg-blue-950 text-white text-sm font-medium min-w-[130px] px-5 py-3 rounded-full group flex items-center justify-center transition-all duration-300 hover:min-w-[150px] cursor-pointer space-x-2"
                                        >
                                            Sign Up Now
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
                                {getItemById('spring-tour-details', 'packageSection', 'package-heading')?.content || "THE PACKAGE INCLUDES"}
                            </h3>
                        </div>
                        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                            <div className="flex flex-col ">
                                {(getItemById('spring-tour-details', 'packageSection', 'package-items1')?.content || "10 school visits across 3 northern cities.\nFull in-country support team.\nDedicated exhibition space at each venue.\nWelcome reception with school officials.").split('\n').map((item, index) => (
                                    <div key={index} className="flex items-center">
                                        <div className="text-content text-lg mr-2">•</div>
                                        <p className="text-content text-sm font-medium">{item}</p>
                                    </div>
                                ))}
                            </div>
                            <div className="flex flex-col ">
                                {(getItemById('spring-tour-details', 'packageSection', 'package-items2')?.content || "Daily refreshments and snacks.\nAll meals during the tour (5 days).\nTransportation between venues and cities.\nPremium hotel arrangements available.").split('\n').map((item, index) => (
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
                            <img src="/display1.png" alt="Spring Tour Display" className="w-full h-full object-cover" />
                        </div>
                    </div>
                </div>
            </div>

            <div className="mx-4 md:mx-6 lg:mx-48 mb-20">
                <h3 className="text-header font-bold text-lg uppercase mb-5 text-center lg:text-left">OTHER TOURS</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {otherTours.map(tour => (
                        <TourCard key={tour.id} tour={tour} />
                    ))}
                </div>
            </div>

            <Footer />
        </div>
    );
} 