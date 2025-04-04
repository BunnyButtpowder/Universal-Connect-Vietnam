import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import { Testimonials } from "@/components/Testimonials";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Carousel, CarouselContent, CarouselItem, CarouselNext, CarouselPrevious } from "@/components/ui/carousel";

export default function AboutUs() {
    return (
        <div>
            <Navbar />
            <div className="mt-20">
                <div className="mx-4 md:mx-6 lg:mx-20 rounded-3xl overflow-hidden">
                    <img src="/about-us.png" alt="University Event" className="w-full h-auto" />
                </div>
                
                {/* About Section */}
                <div className="mx-4 md:mx-6 lg:mx-20 my-16 px-4 md:px-6 lg:px-20">
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                        {/* Left Column */}
                        <div className="flex flex-col gap-6">
                            {/* Header */}
                            <div className="about-header">
                                <h1 className="text-3xl md:text-4xl font-medium text-content">
                                    We're passionate about bridging the gap between international universities and Vietnam's top state schools.
                                </h1>
                            </div>
                            
                            {/* Carousel */}
                            <div className="about-carousel-container relative rounded-3xl overflow-hidden">
                                <Carousel className="w-full">
                                    <CarouselContent>
                                        <CarouselItem>
                                            <div className="carousel-image-container h-[400px] relative">
                                                <img 
                                                    src="/classroom.png" 
                                                    alt="University presentation" 
                                                    className="w-full h-full object-cover"
                                                />
                                            </div>
                                        </CarouselItem>
                                        <CarouselItem>
                                            <div className="carousel-image-container h-[400px] relative">
                                                <img 
                                                    src="/display1.png" 
                                                    alt="Classroom session" 
                                                    className="w-full h-full object-cover"
                                                />
                                            </div>
                                        </CarouselItem>
                                        <CarouselItem>
                                            <div className="carousel-image-container h-[400px] relative">
                                                <img 
                                                    src="/display2.png" 
                                                    alt="School collaboration" 
                                                    className="w-full h-full object-cover"
                                                />
                                            </div>
                                        </CarouselItem>
                                    </CarouselContent>
                                    
                                    {/* Carousel Navigation */}
                                    <div className="absolute bottom-4 right-4 flex gap-2">
                                        <CarouselPrevious className="h-8 w-8 p-0" />
                                        <CarouselNext className="h-8 w-8 p-0" />
                                    </div>
                                    
                                    {/* Portfolio Button */}
                                    <div className="absolute bottom-4 left-4">
                                        <Button 
                                            variant="default" 
                                            className="portfolio-button bg-blue-600 text-white hover:bg-blue-700 flex items-center gap-2"
                                        >
                                            CHECK OUT OUR PORTFOLIO
                                            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                                <path d="M5 12h14M12 5l7 7-7 7" />
                                            </svg>
                                        </Button>
                                    </div>
                                </Carousel>
                            </div>
                        </div>
                        
                        {/* Right Column */}
                        <div className="about-right-column flex flex-col gap-8">
                            {/* Who We Are */}
                            <Card className="who-we-are-section p-6 border-0 shadow-sm">
                                <h2 className="text-xl font-semibold text-blue-600 mb-3">WHO WE ARE</h2>
                                <p className="text-gray-700">
                                    At UCV, we're passionate about bridging the gap between international universities and Vietnam's top state schools. Based in the heart of Vietnam, we've spent years cultivating relationships with leading educational institutions in Central and Northern regions.
                                </p>
                            </Card>
                            
                            {/* Our Mission */}
                            <Card className="our-mission-section p-6 border-0 shadow-sm">
                                <h2 className="text-xl font-semibold text-blue-600 mb-3">OUR MISSION</h2>
                                <p className="text-gray-700">
                                    To help university representatives like you unlock access to these schools. With our local expertise and tailored approach, we make your outreach seamless, impactful, and rewarding.
                                </p>
                            </Card>
                            
                            {/* Statistics */}
                            <div className="statistics-section grid grid-cols-3 gap-4">
                                <Card className="statistic-card p-4 flex flex-col items-center border-0 shadow-sm">
                                    <div className="statistic-icon text-blue-600 mb-2">
                                        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                            <path d="M17 3a2.85 2.83 0 1 1 4 4L7.5 20.5 2 22l1.5-5.5L17 3Z" />
                                        </svg>
                                    </div>
                                    <h3 className="text-4xl font-bold text-blue-900">03</h3>
                                    <p className="text-sm text-gray-700 text-center">
                                        Successful<br />Tours Organized
                                    </p>
                                </Card>
                                
                                <Card className="statistic-card p-4 flex flex-col items-center border-0 shadow-sm">
                                    <div className="statistic-icon text-blue-600 mb-2">
                                        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                            <rect width="18" height="18" x="3" y="3" rx="2" />
                                            <path d="M7 7h.01M12 7h.01M17 7h.01M7 12h.01M12 12h.01M17 12h.01M7 17h.01M12 17h.01M17 17h.01" />
                                        </svg>
                                    </div>
                                    <h3 className="text-4xl font-bold text-blue-900">41</h3>
                                    <p className="text-sm text-gray-700 text-center">
                                        Collaborations<br />with Schools
                                    </p>
                                </Card>
                                
                                <Card className="statistic-card p-4 flex flex-col items-center border-0 shadow-sm">
                                    <div className="statistic-icon text-blue-600 mb-2">
                                        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                            <path d="M17 11l0 8a2 2 0 0 1-2 2l-10 0a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2l10 0a2 2 0 0 1 2 2v1" />
                                            <path d="M13 14h9" />
                                            <path d="M16 11l-3 3 3 3" />
                                        </svg>
                                    </div>
                                    <h3 className="text-4xl font-bold text-blue-900">06</h3>
                                    <p className="text-sm text-gray-700 text-center">
                                        Returning<br />UNIS
                                    </p>
                                </Card>
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
