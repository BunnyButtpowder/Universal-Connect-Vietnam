"use client";

import React from "react";
import {
    Carousel,
    CarouselContent,
    CarouselItem,
} from "@/components/ui/carousel";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ChevronLeft, ChevronRight } from "lucide-react";

// Define the testimonial type
interface Testimonial {
    id: number;
    content: string;
    university: string;
    subtitle: string;
    image?: string;
}

export function Testimonials() {
    // Sample testimonials data - replace with your actual data
    const testimonials: Testimonial[] = [
        {
            id: 1,
            content: "Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text ever since the 1500s, when an unknown printer took.",
            university: "Alberta University",
            subtitle: "Title something",
        },
        {
            id: 2,
            content: "Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text ever since the 1500s, when an unknown printer took.",
            university: "Alberta University",
            subtitle: "Title something",
        },
        {
            id: 3,
            content: "Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text ever since the 1500s, when an unknown printer took.",
            university: "Alberta University",
            subtitle: "Title something",
            image: "/university-event.jpg", // Replace with actual image path
        },
    ];

    // Create api reference for the carousel
    const [api, setApi] = React.useState<any>(null);

    // Custom handlers using our carousel API
    const handlePrevious = React.useCallback(() => {
        api?.scrollPrev();
    }, [api]);

    const handleNext = React.useCallback(() => {
        api?.scrollNext();
    }, [api]);

    return (
        <section className="py-12 md:py-16 px-4 md:px-6 lg:px-20">
            <div className="container mx-auto">
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-2 lg:gap-8 items-center">
                    {/* Left column - Title and navigation arrows */}
                    <div className="lg:col-span-3 space-y-6">
                        <div className="space-y-2">
                            <h4 className="text-header text-base font-bold">TESTIMONIALS</h4>
                            <h2 className="text-4xl font-medium text-content">What Universities Say About Us</h2>
                        </div>
                        
                        {/* Navigation buttons */}
                        <div className="flex space-x-3">
                            <Button 
                                onClick={handlePrevious}
                                variant="outline"
                                size="icon"
                                className="carousel-previous-button cursor-pointer rounded-full bg-blue-50 hover:bg-blue-950 transition-all duration-300 h-10 w-10 group"
                            >
                                <ChevronLeft className="h-4 w-4 text-blue-950 group-hover:text-white" />
                            </Button>
                            <Button 
                                onClick={handleNext}
                                variant="outline"
                                size="icon"
                                className="carousel-next-button cursor-pointer rounded-full bg-blue-50 hover:bg-blue-950 transition-all duration-300 h-10 w-10 group"
                            >
                                <ChevronRight className="h-4 w-4 text-blue-950 group-hover:text-white" />
                            </Button>
                        </div>
                    </div>

                    {/* Right column - Carousel items */}
                    <div className="lg:col-span-9">
                        <Carousel
                            setApi={setApi}
                            className="w-full"
                            opts={{
                                align: "start",
                                loop: true,
                            }}
                        >
                            <CarouselContent>
                                {testimonials.map((testimonial) => (
                                    <CarouselItem key={testimonial.id} className="md:basis-1/3 lg:basis-1/3 flex items-center">
                                        <div className="p-1">
                                            <Card className="bg-blue-50 hover:bg-blue-950 group/card transition-all duration-300 testimonial-card border-slate-100 shadow-sm max-h-64 overflow-auto">
                                                <CardContent className="space-y-1">
                                                    <p className="text-blue-950 group-hover/card:text-white transition-all duration-300 font-medium leading-relaxed text-xs line-clamp-4 mb-15">{testimonial.content}</p>
                                                    <div className="border-t-2 border-blue-300 group-hover/card:border-white/10 group-hover/card:-translate-y-3 transition-all duration-300 pt-3"></div>
                                                    <div className="flex items-center gap-2 group-hover/card:-translate-y-3 transition-all duration-300">
                                                        <div className="testimonial-logo bg-blue-50 group-hover/card:bg-blue-950 transition-all duration-300 p-2 rounded">
                                                            <img src="/testimonial-icon.svg" alt="Testimonial icon" className="w-4 h-4 group-hover/card:text-white transition-all duration-300 " />
                                                        </div>
                                                        <div>
                                                            <h4 className="text-blue-500 group-hover/card:text-white transition-all duration-300 font-medium text-xs">{testimonial.university}</h4>
                                                            <p className="text-blue-300 group-hover/card:text-white/70 transition-all duration-300 text-xs">{testimonial.subtitle}</p>
                                                        </div>
                                                    </div>
                                                </CardContent>
                                            </Card>
                                        </div>
                                    </CarouselItem>
                                ))}
                                {/* Special image item for the third carousel slot */}
                                <CarouselItem className="md:basis-1/3 lg:basis-1/3">
                                    <div className="p-1">
                                        <div className="testimonial-image-container rounded-lg overflow-hidden max-h-64">
                                            <img
                                                src="/university-event.png"
                                                alt="University event"
                                                width={500}
                                                height={300}
                                                className="w-full h-full object-cover"
                                            />
                                        </div>
                                    </div>
                                </CarouselItem>
                            </CarouselContent>
                        </Carousel>
                    </div>
                </div>
            </div>
        </section>
    );
}