import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import { Testimonials } from "@/components/Testimonials";
import { Button } from "@/components/ui/button";
import { Carousel, CarouselContent, CarouselItem, type CarouselApi } from "@/components/ui/carousel";
import { ArrowUpRight, School } from "lucide-react"
import { useState, useEffect } from "react";

export default function AboutUs() {
    const [api, setApi] = useState<CarouselApi>();
    const [current, setCurrent] = useState(1);
    const count = 3;

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
            number: "03",
            icon: <img src="/edu-icon.svg" />,
            title: "Successful",
            subtitle: "Tours Organized"
        },
        {
            number: "41",
            icon: <School className="text-[#438EFF] w-7 h-7" />,
            title: "Collaborations",
            subtitle: "with Schools"
        },
        {
            number: "06",
            icon: <img src="/person-icon.svg" />,
            title: "Returning",
            subtitle: "UNIS"
        }
    ]

    return (
        <div>
            <Navbar />
            <div className="mt-20">
                <div className="mx-4 md:mx-6 lg:mx-20 rounded-3xl overflow-hidden">
                    <img src="/about-us.png" alt="University Event" className="w-full h-auto" />
                </div>

                {/* About Section */}
                <div className="mx-4 md:mx-6 lg:mx-20 mt-16 px-4 md:px-6 lg:px-26">
                    <div className="grid grid-cols-1 lg:grid-cols-5 gap-20">
                        {/* Left Column */}
                        <div className="flex flex-col lg:col-span-3 gap-6">
                            {/* Header */}
                            <div className="about-header">
                                <h1 className="text-3xl md:text-5xl/14 font-medium text-content">
                                    We're passionate about bridging the gap between international universities and Vietnam's top state schools.
                                </h1>
                            </div>

                            {/* Carousel */}
                            <div className="about-carousel-container relative rounded-3xl overflow-hidden">
                                <Carousel className="w-full" setApi={setApi}>
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
                                    <div className="absolute bottom-4 right-4 px-4 py-2 font-medium text-lg items-center gap-2 flex">
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
                                    <div className="absolute bottom-8 left-8">
                                        <button
                                            className="bg-blue-500 hover:bg-blue-950 text-white text-base font-medium min-w-[130px] px-5 py-4 rounded-full group flex items-center justify-between transition-all duration-300 hover:min-w-[140px] cursor-pointer space-x-2"
                                        >
                                            <span>CHECK OUT OUR PORTFOLIO</span>
                                            <ArrowUpRight className="h-4 w-4 group-hover:translate-x-1 transition-all duration-300 group-hover:w-7 " />
                                        </button>
                                    </div>
                                </Carousel>
                            </div>
                        </div>

                        {/* Right Column */}
                        <div className="about-right-column flex flex-col lg:col-span-2 gap-8">
                            {/* Who We Are */}
                            <div className="pb-9 border-b-1">
                                <h2 className="text-lg font-semibold text-blue-500 mb-3">WHO WE ARE</h2>
                                <p className="text-content font-medium text-sm">
                                    At UCV, we're passionate about bridging the gap between international universities and Vietnam's top state schools. Based in the heart of Vietnam, we've spent years cultivating relationships with leading educational institutions in Central and Northern regions.
                                </p>
                            </div>

                            {/* Our Mission */}
                            <div className="">
                                <h2 className="text-lg font-semibold text-blue-500 mb-3">OUR MISSION</h2>
                                <p className="text-content font-medium text-sm">
                                    To help university representatives like you unlock access to these schools. With our local expertise and tailored approach, we make your outreach seamless, impactful, and rewarding.
                                </p>
                            </div>

                            {/* Statistics */}
                            <div className="grid grid-cols-1 gap-8 border-y-1 border-accent-blue divide-y divide-blue-200">
                                {stats.map((stat, index) => (
                                    <div key={index} className="flex items-center space-x-4 py-5 px-5">
                                        <div>{stat.icon}</div>
                                        <span className="text-6xl font-semibold text-content ms-2">{stat.number}</span>
                                        <div className="flex flex-col ms-2">
                                            <span className="text-base font-medium text-content">{stat.title}</span>
                                            <span className="text-base font-medium text-content">{stat.subtitle}</span>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>
                </div>

                <div className="mx-4 md:mx-6 lg:mx-20">
                    <Testimonials />
                </div>
            </div>
            <Footer />
        </div>
    )
}
