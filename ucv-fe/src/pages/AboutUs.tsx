import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import { Testimonials } from "@/components/Testimonials";
import { Carousel, CarouselContent, CarouselItem, type CarouselApi } from "@/components/ui/carousel";
import { School } from "lucide-react"
import { useState, useEffect } from "react";
import Autoplay from "embla-carousel-autoplay";
import { useContentStore } from "@/lib/contentStore";

export default function AboutUs() {
    const [api, setApi] = useState<CarouselApi>();
    const [current, setCurrent] = useState(1);
    const count = 3;

    // Get content from store
    const getItemById = useContentStore(state => state.getItemById);

    // Main banner content
    const mainBannerHeading = getItemById('about-us', 'mainBanner', 'mainBanner-heading')?.content ||
        "We're passionate about bridging the gap between international universities and Vietnam's top state schools.";
    const mainBannerImage = getItemById('about-us', 'mainBanner', 'mainBanner-image')?.content ||
        "/about-us.png";

    // Carousel content
    const carouselImage1 = getItemById('about-us', 'carouselSection', 'carousel-image1')?.content ||
        "/classroom.png";
    const carouselImage2 = getItemById('about-us', 'carouselSection', 'carousel-image2')?.content ||
        "/display1.png";
    const carouselImage3 = getItemById('about-us', 'carouselSection', 'carousel-image3')?.content ||
        "/display2.png";
    // const carouselButton = getItemById('about-us', 'carouselSection', 'carousel-button')?.content ||
    //     "CHECK OUT OUR PORTFOLIO";

    // Who We Are content
    const whoWeAreTitle = getItemById('about-us', 'whoWeAre', 'whoWeAre-title')?.content ||
        "WHO WE ARE";
    const whoWeAreContent = getItemById('about-us', 'whoWeAre', 'whoWeAre-content')?.content ||
        "At UCV, we're passionate about bridging the gap between international universities and Vietnam's top state schools. Based in the heart of Vietnam, we've spent years cultivating relationships with leading educational institutions in Central and Northern regions.";

    // Our Mission content
    const ourMissionTitle = getItemById('about-us', 'ourMission', 'ourMission-title')?.content ||
        "OUR MISSION";
    const ourMissionContent = getItemById('about-us', 'ourMission', 'ourMission-content')?.content ||
        "To help university representatives like you unlock access to these schools. With our local expertise and tailored approach, we make your outreach seamless, impactful, and rewarding.";

    // Statistics content
    const stat1 = getItemById('about-us', 'statistics', 'statistics-stat1');
    const stat2 = getItemById('about-us', 'statistics', 'statistics-stat2');
    const stat3 = getItemById('about-us', 'statistics', 'statistics-stat3');

    useEffect(() => {
        if (!api) {
            return;
        }

        setCurrent(api.selectedScrollSnap() + 1);

        api.on("select", () => {
            setCurrent(api.selectedScrollSnap() + 1);
        });
    }, [api]);

    const stats = [
        {
            number: stat1?.content || "03",
            icon: <img src={stat1?.metadata?.icon || "/edu-icon.svg"} />,
            title: stat1?.metadata?.title || "Successful",
            subtitle: stat1?.metadata?.subtitle || "Tours Organized"
        },
        {
            number: stat2?.content || "41",
            icon: stat2?.metadata?.icon === "School" ?
                <School className="text-[#438EFF] w-7 h-7" /> :
                <img src={stat2?.metadata?.icon || "/person-icon.svg"} />,
            title: stat2?.metadata?.title || "Collaborations",
            subtitle: stat2?.metadata?.subtitle || "with Schools"
        },
        {
            number: stat3?.content || "06",
            icon: <img src={stat3?.metadata?.icon || "/person-icon.svg"} />,
            title: stat3?.metadata?.title || "Returning",
            subtitle: stat3?.metadata?.subtitle || "UNIS"
        }
    ]

    return (
        <div>
            <Navbar />
            <div className="mt-20">
                <div className="mx-4 lg:mx-0 md:mx-6 lg:px-20 overflow-hidden relative"
                    style={{
                        height: typeof window !== 'undefined' && window.innerWidth < 1024
                            ? "650px"
                            : "700px"
                    }}>
                    {/* Decorative Image - Upper Left */}
                    <img
                        src="/vector.svg"
                        alt="Decorative element"
                        className="absolute -top-3 lg:top-10 left-0 lg:-left-20 max-w-none w-[200%] lg:w-300 h-[180px] lg:h-70 pointer-events-none -z-1"
                    />
                    <div className="relative w-full h-auto mt-16 lg:mt-0">
                        <img
                            src={mainBannerImage}
                            alt="University Event"
                            className="w-full rounded-3xl object-cover"
                            style={{
                                height: typeof window !== 'undefined' && window.innerWidth < 1024
                                    ? "480px"
                                    : "700px"
                            }}
                        />
                    </div>
                    {/* Decorative Image - Lower Right */}
                    <img
                        src="/vector-1.svg"
                        alt="Decorative element"
                        className="absolute -bottom-3 -right-50 lg:right-0 w-140 h-25 pointer-events-none -z-1"
                    />
                </div>

                {/* About Section */}
                <div className="md:mx-6 lg:mx-20 mt-2 lg:mt-16 px-4 md:px-6 lg:px-26">
                    <div className="grid grid-cols-1 lg:grid-cols-5 gap-10 lg:gap-20">
                        {/* Left Column */}
                        <div className="flex flex-col lg:col-span-3 gap-6">
                            {/* Header */}
                            <div className="about-header">
                                <h1 className="text-3xl md:text-5xl/14 font-medium text-content">
                                    {mainBannerHeading}
                                </h1>
                            </div>

                            {/* Carousel */}
                            <div className="relative rounded-3xl overflow-hidden">
                                <Carousel className="w-full" setApi={setApi} plugins={[Autoplay({ delay: 4000 })]}>
                                    <CarouselContent>
                                        <CarouselItem>
                                            <div className="carousel-image-container h-[500px] relative">
                                                <img
                                                    src={carouselImage1}
                                                    alt="University presentation"
                                                    className="w-full h-full object-cover"
                                                />
                                            </div>
                                        </CarouselItem>
                                        <CarouselItem>
                                            <div className="carousel-image-container h-[500px] relative">
                                                <img
                                                    src={carouselImage2}
                                                    alt="Classroom session"
                                                    className="w-full h-full object-cover"
                                                />
                                            </div>
                                        </CarouselItem>
                                        <CarouselItem>
                                            <div className="carousel-image-container h-[500px] relative">
                                                <img
                                                    src={carouselImage3}
                                                    alt="School collaboration"
                                                    className="w-full h-full object-cover"
                                                />
                                            </div>
                                        </CarouselItem>
                                    </CarouselContent>

                                    {/* Pagination Indicator - Visible on all screens */}
                                    <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 lg:left-auto lg:translate-x-0 lg:right-4 px-4 py-2 font-medium text-lg items-center gap-2 flex">
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

                                    {/* Portfolio Button */}
                                    {/* <div className="absolute bottom-14 left-9 lg:bottom-8 lg:left-8">
                                        <button
                                            className="bg-blue-500 hover:bg-blue-950 text-white text-base font-medium min-w-[130px] px-5 py-4 rounded-full group flex items-center justify-between transition-all duration-300 hover:min-w-[140px] cursor-pointer space-x-2"
                                        >
                                            <span>{carouselButton}</span>
                                            <ArrowUpRight className="h-4 w-4 group-hover:translate-x-1 transition-all duration-300 group-hover:w-7 " />
                                        </button>
                                    </div> */}
                                </Carousel>
                            </div>
                        </div>

                        {/* Right Column */}
                        <div className="flex flex-col lg:col-span-2 gap-8 lg:h-full lg:justify-end right-column-container">
                            {/* Who We Are */}
                            <div className="pb-9 border-b-1">
                                <h2 className="text-lg font-semibold text-blue-500 mb-3">{whoWeAreTitle}</h2>
                                <p className="text-content font-medium text-sm">
                                    {whoWeAreContent}
                                </p>
                            </div>

                            {/* Our Mission */}
                            <div className="">
                                <h2 className="text-lg font-semibold text-blue-500 mb-3">{ourMissionTitle}</h2>
                                <p className="text-content font-medium text-sm">
                                    {ourMissionContent}
                                </p>
                                <p className="text-content font-medium text-sm mt-5">
                                    Vietnam is experiencing an impressive period of development, with socio-economic levels increasing rapidly all over the country. This means there are up and coming areas of the country with highly talented students, who are looking at studying abroad. Many of these have not been properly explored, as the main focus for universities has been the two main hubs, Ha Noi and HCMC. Access to public school can be tricky without support. This is where we come in to give you direct access to a wide range of top public, as well as private schools. So, we're working hard on giving universities and students in additional areas the chance to explore and connect.
                                </p>
                            </div>
                        </div>
                    </div>

                    {/* Statistics Section */}
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-8 border-y-1 border-accent-blue divide-y lg:divide-y-0 lg:divide-x-1 divide-blue-200 mt-10">
                        {stats.map((stat, index) => (
                            <div key={index} className="flex items-center space-x-4 py-5 px-5">
                                <div>{stat.icon}</div>
                                <span className="text-6xl font-medium text-content">{stat.number}</span>
                                <div className="flex flex-col">
                                    <span className="text-sm font-medium text-content">{stat.title}</span>
                                    <span className="text-sm font-medium text-content">{stat.subtitle}</span>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>

                <div className="md:mx-6 lg:mx-20">
                    <Testimonials />
                </div>
            </div>
            <Footer />
        </div>
    )
}
