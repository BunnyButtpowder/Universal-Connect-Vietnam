"use client";

import React from "react";
import { 
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
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

  // Custom navigation controls
  const carouselRef = React.useRef<HTMLDivElement>(null);

  const handlePrevious = () => {
    if (carouselRef.current) {
      const carousel = carouselRef.current as any;
      carousel?.scrollPrev();
    }
  };

  const handleNext = () => {
    if (carouselRef.current) {
      const carousel = carouselRef.current as any;
      carousel?.scrollNext();
    }
  };

  return (
    <section className="py-12 md:py-16 px-4 md:px-6 lg:px-20">
      <div className="container mx-auto">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
          {/* Left column - Title and navigation arrows */}
          <div className="lg:col-span-3 space-y-6">
            <div className="space-y-2">
              <h4 className="text-primary text-sm md:text-base font-medium uppercase">TESTIMONIALS</h4>
              <h2 className="text-2xl md:text-3xl lg:text-4xl font-bold text-slate-900">What Universities Say About Us</h2>
            </div>
            
            <div className="flex space-x-2">
              <Button 
                onClick={handlePrevious} 
                variant="outline" 
                size="icon" 
                className="testimonials-nav-button rounded-full border-slate-200 hover:bg-slate-100"
              >
                <ChevronLeft className="h-5 w-5" />
                <span className="sr-only">Previous slide</span>
              </Button>
              <Button 
                onClick={handleNext} 
                variant="outline" 
                size="icon" 
                className="testimonials-nav-button rounded-full border-slate-200 hover:bg-slate-100"
              >
                <ChevronRight className="h-5 w-5" />
                <span className="sr-only">Next slide</span>
              </Button>
            </div>
          </div>
          
          {/* Right column - Carousel items */}
          <div className="lg:col-span-9">
            <Carousel 
              ref={carouselRef}
              className="w-full"
              opts={{
                align: "start",
                loop: true,
              }}
            >
              <CarouselContent>
                {testimonials.map((testimonial) => (
                  <CarouselItem key={testimonial.id} className="md:basis-1/2 lg:basis-1/2">
                    <div className="p-1">
                      <Card className="testimonial-card border-slate-100 shadow-sm">
                        <CardContent className="p-6 space-y-4">
                          <p className="text-slate-700 leading-relaxed">{testimonial.content}</p>
                          <div className="border-t border-slate-100 pt-4 mt-4"></div>
                          <div className="flex items-center gap-2">
                            <div className="testimonial-logo bg-blue-50 p-2 rounded">
                              <svg className="h-5 w-5 text-blue-500" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                                <path d="M20 4L3 11L10 14M20 4L13 21L10 14M20 4L10 14" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                              </svg>
                            </div>
                            <div>
                              <h4 className="text-slate-900 font-medium">{testimonial.university}</h4>
                              <p className="text-slate-500 text-sm">{testimonial.subtitle}</p>
                            </div>
                          </div>
                        </CardContent>
                      </Card>
                    </div>
                  </CarouselItem>
                ))}
                {/* Special image item for the third carousel slot */}
                <CarouselItem className="md:basis-1/2 lg:basis-1/2">
                  <div className="p-1 h-full">
                    <div className="testimonial-image-container rounded-lg overflow-hidden h-full">
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