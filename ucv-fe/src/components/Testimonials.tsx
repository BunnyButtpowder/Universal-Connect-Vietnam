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
import { useContentStore } from "../lib/contentStore";
import { useTranslatedContent } from "../hooks/useTranslatedContent";

// Define the testimonial type
interface Testimonial {
    id: number;
    content: string;
    university: string;
    subtitle: string;
    image?: string;
}

export function Testimonials() {
    const getItemById = useContentStore(state => state.getItemById);
    const { getContentItem } = useTranslatedContent();

    // Get translated content
    const headingContent = getContentItem('testimonials-heading') ||
        getItemById('home', 'testimonials', 'testimonials-heading')?.content ||
        "TESTIMONIALS";
    const titleContent = getContentItem('testimonials-title') ||
        getItemById('home', 'testimonials', 'testimonials-title')?.content ||
        "What our partners say about working with us";

    // Sample testimonials data - replace with your actual data
    const testimonials: Testimonial[] = [
        {
            id: 1,
            content: getItemById('home', 'testimonials', 'testimonial-1-content')?.content || 
                "Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text ever since the 1500s, when an unknown printer took.",
            university: getItemById('home', 'testimonials', 'testimonial-1-university')?.content || 
                "Alberta University",
            subtitle: getItemById('home', 'testimonials', 'testimonial-1-subtitle')?.content || 
                "Title something",
        },
        {
            id: 2,
            content: getItemById('home', 'testimonials', 'testimonial-2-content')?.content || 
                "Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text ever since the 1500s, when an unknown printer took.",
            university: getItemById('home', 'testimonials', 'testimonial-2-university')?.content || 
                "Alberta University",
            subtitle: getItemById('home', 'testimonials', 'testimonial-2-subtitle')?.content || 
                "Title something",
        },
        {
            id: 3,
            content: getItemById('home', 'testimonials', 'testimonial-3-content')?.content || 
                "Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text ever since the 1500s, when an unknown printer took.",
            university: getItemById('home', 'testimonials', 'testimonial-3-university')?.content || 
                "Alberta University",
            subtitle: getItemById('home', 'testimonials', 'testimonial-3-subtitle')?.content || 
                "Title something",
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
                            <h4 className="text-header text-base font-bold">{headingContent}</h4>
                            <h2 className="text-4xl font-medium text-content">{titleContent}</h2>
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
                                            <Card className="bg-blue-50 hover:bg-blue-950 group/card transition-all duration-300 testimonial-card border-slate-100 shadow-sm h-64">
                                                <CardContent className="space-y-1 h-full flex flex-col justify-center">
                                                    <p className="text-blue-950 group-hover/card:text-white transition-all duration-300 font-medium leading-relaxed text-xs italic">"{testimonial.content}"</p>
                                                </CardContent>
                                            </Card>
                                        </div>
                                    </CarouselItem>
                                ))}
                                {/* Special image item for the third carousel slot */}
                                <CarouselItem className="md:basis-1/3 lg:basis-1/3">
                                    <div className="p-1">
                                        <div className="testimonial-image-container rounded-lg overflow-hidden h-64">
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