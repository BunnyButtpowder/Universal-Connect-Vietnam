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

export function HeroBanner() {
    const getItemById = useContentStore(state => state.getItemById);
    
    // Get content from store
    const headingContent = getItemById('home', 'heroBanner', 'heroBanner-heading')?.content || 
        "Explore Vietnam's Top State Schools with Us";
    const paragraph1Content = getItemById('home', 'heroBanner', 'heroBanner-paragraph1')?.content || 
        "Welcome to UCV - we aim to bridge top schools in Vietnam and international universities. We're a unique connector - we have years of experience on both the university and the school side.";
    const paragraph2Content = getItemById('home', 'heroBanner', 'heroBanner-paragraph2')?.content || 
        "Specializing in crafting quality school tours across Central and Northern Vietnam, we focus primarily on state schools (mostly Schools for gifted students).";
    const tourTitleContent = getItemById('home', 'heroBanner', 'heroBanner-tour-title')?.content || 
        "Tour Spring 2025";
    const tourDescContent = getItemById('home', 'heroBanner', 'heroBanner-tour-desc')?.content || 
        "Short Descripton At IUC, we're passionate about bridging the gap between ...";
    const buttonContent = getItemById('home', 'heroBanner', 'heroBanner-button')?.content || 
        "Find out more";
    
    const carouselItem = getItemById('home', 'heroBanner', 'heroBanner-carousel-images');
    const carouselImages = carouselItem?.metadata?.images || [
        "/hero-banner-1.png",
        "/hero-banner-2.png",
        "/hero-banner-3.png",
    ];

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
                </div>

                {/* Right Carousel - 4 columns with Tour Card Overlay */}
                <div className="relative lg:col-span-4">
                    <Carousel className="w-full" setApi={setApi} plugins={[Autoplay({ delay: 4000 })]}>
                        <CarouselContent>
                            {carouselImages.map((image: string, index: number) => (
                                <CarouselItem key={index}>
                                    <div className="relative w-full overflow-hidden rounded-2xl"
                                        style={{
                                            height: typeof window !== 'undefined' && window.innerWidth < 1024
                                                ? "500px"
                                                : "700px"
                                        }}>
                                        <img
                                            src={image}
                                            alt={`Tour image ${index + 1}`}
                                            className="w-full h-full object-cover"
                                        />
                                        {/* Tour Info Card Overlay */}
                                        <div className="absolute bottom-2 lg:bottom-3 left-2 lg:left-3 max-w-xs lg:max-w-md bg-white rounded-2xl shadow-lg px-4 lg:px-6 pb-4 lg:pb-6">
                                            <div className="relative inline-block bg-content text-white rounded-lg px-5 py-1 -top-4">
                                                <span className="font-medium text-xs">INCOMING • JULY 4</span>
                                            </div>

                                            <h2 className="text-2xl lg:text-4xl font-medium text-content pb-3 border-b-2 border-accent-blue">
                                                {tourTitleContent}
                                            </h2>

                                            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mt-3">
                                                <p className="text-content text-xs">
                                                    {tourDescContent}
                                                </p>
                                                <a href="/tour-details">
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