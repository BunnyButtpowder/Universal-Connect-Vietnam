import React, { useState, useEffect, useRef } from 'react';
import { useContentStore } from '../lib/contentStore';

interface Image {
  src: string;
  alt: string;
}

const ImageCarousel: React.FC = () => {
  const getItemById = useContentStore(state => state.getItemById);
  
  // State to force re-render when content changes
  const [images, setImages] = useState<Image[]>([]);
  
  // Get carousel images from content store
  const getCarouselImages = (): Image[] => {
    const carouselImages: Image[] = [];
    for (let i = 1; i <= 10; i++) {
      const imageItem = getItemById('home', 'imageCarousel', `carousel-image-${i}`);
      if (imageItem) {
        carouselImages.push({
          src: imageItem.content,
          alt: imageItem.metadata?.alt || `Carousel image ${i}`
        });
      }
    }
    
    // Fallback to hardcoded images if no content store images found
    if (carouselImages.length === 0) {
      return [
        { src: '/display1.png', alt: 'Students at an event' },
        { src: '/display2.png', alt: 'Academic conference' },
        { src: '/display3.jpg', alt: 'Classroom session' },
        { src: '/display5.jpg', alt: 'Classroom session' },
        { src: '/display6.jpg', alt: 'Classroom session' },
        { src: '/display7.jpg', alt: 'Classroom session' },
        { src: '/display8.jpg', alt: 'Classroom session' },
        { src: '/display9.jpg', alt: 'Classroom session' },
        { src: '/display4.png', alt: 'Students collaborating' },
        { src: '/university-event.png', alt: 'School exhibition' },
      ];
    }
    
    return carouselImages;
  };

  // Update images when content store changes
  useEffect(() => {
    setImages(getCarouselImages());
  }, []);

  // Watch for content store changes
  useEffect(() => {
    const newImages = getCarouselImages();
    setImages(newImages);
  }, [getItemById]);

  const [currentIndex, setCurrentIndex] = useState(0);
  const [isTransitioning, setIsTransitioning] = useState(true);
  const carouselRef = useRef<HTMLDivElement>(null);

  // For true infinite loop, we duplicate the entire array
  // This allows us to always move forward visually
  const duplicatedImages = [...images, ...images];

  // Function to handle the invisible reset
  const resetToOriginal = () => {
    if (carouselRef.current) {
      // Disable transition temporarily
      setIsTransitioning(false);
      // Jump to the original set (keeps visual position the same)
      setCurrentIndex(currentIndex % images.length);
    }
  };

  // Re-enable transition after position reset
  useEffect(() => {
    if (!isTransitioning) {
      const timeout = setTimeout(() => {
        setIsTransitioning(true);
      }, 50);
      return () => clearTimeout(timeout);
    }
  }, [isTransitioning]);

  // Auto slide functionality with infinite loop
  useEffect(() => {
    if (images.length === 0) return; // Don't start carousel if no images
    
    const interval = setInterval(() => {
      // Always move forward
      setCurrentIndex(prev => prev + 1);
      
      // If we're at the end of our duplicated set, prepare for the invisible reset
      if (currentIndex >= images.length * 2 - 7) {
        // Schedule the reset after the transition completes
        setTimeout(resetToOriginal, 700);
      }
    }, 4000);

    return () => clearInterval(interval);
  }, [currentIndex, images.length]);

  // Number of visible slides
  const visibleSlides = 8;
  const slideWidth = 100 / visibleSlides;

  // Don't render if no images
  if (images.length === 0) {
    return (
      <section className="image-carousel-section bg-white px-2 sm:px-6 lg:px-17 mb-20">
        <div className="container mx-auto">
          <div className="text-center py-8">
            <p className="text-gray-500">Loading carousel images...</p>
          </div>
        </div>
      </section>
    );
  }

  return (
    <section className="image-carousel-section bg-white px-2 sm:px-6 lg:px-17 mb-20">
      <div className="container mx-auto">
        {/* Desktop Carousel */}
        <div className="hidden md:block overflow-hidden">
          <div 
            ref={carouselRef}
            className="flex"
            style={{ 
              transition: isTransitioning ? 'transform 700ms ease-in-out' : 'none',
              transform: `translateX(-${currentIndex * slideWidth}%)`,
              width: `${duplicatedImages.length * slideWidth}%` 
            }}
          >
            {duplicatedImages.map((image, index) => (
              <div key={index} className="carousel-image-container px-3" style={{ width: `${slideWidth}%`, flexShrink: 0 }}>
                <div className="bg-white rounded-lg overflow-hidden shadow-md h-72">
                  <img 
                    src={image.src} 
                    alt={image.alt}
                    className="w-full h-full object-cover object-center"
                  />
                </div>
              </div>
            ))}
          </div>
        </div>
        
        {/* Mobile Carousel */}
        <div className="md:hidden overflow-hidden">
          <div 
            className="flex"
            style={{ 
              transition: isTransitioning ? 'transform 700ms ease-in-out' : 'none',
              transform: `translateX(-${currentIndex * 100}%)`, 
              width: `${duplicatedImages.length * 100}%`
            }}
          >
            {duplicatedImages.map((image, index) => (
              <div key={index} className="carousel-image-container w-full px-3" style={{ flexShrink: 0 }}>
                <div className="bg-white rounded-lg overflow-hidden shadow-md h-64">
                  <img 
                    src={image.src} 
                    alt={image.alt}
                    className="w-full h-full object-cover object-center"
                  />
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

export default ImageCarousel; 