import { Button } from "@/components/ui/button"
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel"
import { Calendar, Flag } from "lucide-react"

export function HeroBanner() {
  const carouselImages = [
    "/hero-banner-1.png",
    "/hero-banner-2.png",
    "/hero-banner-3.png",
  ]

  return (
    <section className="container mx-auto px-4 sm:px-6 lg:px-10 py-12">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-center">
        {/* Left Content */}
        <div className="space-y-6">
          <h1 className="text-4xl lg:text-5xl text-content">
            Explore <br />
            Vietnam's <span className="inline-flex items-center gap-2"><img src="/vn-flag.svg" alt="Vietnam Flag" width={32} height={24} className="inline" /></span> <br />
            Top State <br />
            Schools with Us
          </h1>
          
          <p className="text-sm text-content">
            Welcome to UCV - we aim to bridge top schools in Vietnam and international universities. We're a unique connector - we have years of experience on both the university and the school side.
          </p>
          
          <p className="text-sm text-content">
            Specializing in crafting quality school tours across Central and Northern Vietnam, we focus primarily on state schools (mostly Schools for gifted students).
          </p>

          {/* Tour Info Card */}
          <div className="bg-white rounded-lg border p-6 space-y-4">
            <div className="flex items-center gap-2 text-primary">
              <Calendar className="h-5 w-5" />
              <span className="font-semibold">INCOMING • JULY 4</span>
            </div>
            
            <h2 className="text-2xl font-bold text-content">Tour Spring 2025</h2>
            
            <p className="text-muted-foreground">
              At IUC, we're passionate about bringing the gap between ...
            </p>
            
            <Button className="w-full sm:w-auto">
              Find out more
            </Button>
          </div>
        </div>

        {/* Right Carousel */}
        <div className="relative aspect-[4/3] w-full">
          <Carousel className="w-full">
            <CarouselContent>
              {carouselImages.map((image, index) => (
                <CarouselItem key={index}>
                  <div className="relative aspect-[4/3] w-full overflow-hidden rounded-lg">
                    <img
                      src={image}
                      alt={`Tour image ${index + 1}`}
                      className="object-cover"
                    />
                  </div>
                </CarouselItem>
              ))}
            </CarouselContent>
            <CarouselPrevious className="absolute left-4 top-1/2" />
            <CarouselNext className="absolute right-4 top-1/2" />
          </Carousel>
        </div>
      </div>
    </section>
  )
}