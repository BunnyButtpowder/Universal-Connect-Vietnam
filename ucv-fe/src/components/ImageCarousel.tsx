import React, { useState, useEffect } from 'react';

interface Image {
  src: string;
  alt: string;
}

const ImageCarousel: React.FC = () => {
  // Sample images - replace with your actual image paths
  const images: Image[] = [
    { src: '/display1.png', alt: 'Students at an event' },
    { src: '/display2.png', alt: 'Academic conference' },
    { src: '/display3.png', alt: 'Classroom session' },
    { src: '/display4.png', alt: 'Students collaborating' },
    { src: '/university-event.png', alt: 'School exhibition' },
  ];

  const [currentIndex, setCurrentIndex] = useState(0);

  // Auto slide functionality
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentIndex((prevIndex) => (prevIndex + 1) % images.length);
    }, 4000); // Change slide every 4 seconds

    return () => clearInterval(interval);
  }, [images.length]);

  return (
    <section className="image-carousel-section bg-white px-2 sm:px-6 lg:px-17">
      <div className="container mx-auto">
        {/* Desktop Carousel - showing multiple images */}
        <div className="hidden md:block overflow-hidden">
          <div 
            className="flex transition-transform duration-700 ease-in-out"
            style={{ 
              transform: `translateX(-${currentIndex * 20}%)`,
              width: `${images.length * 33.33}%` // Each card takes ~33% of container width
            }}
          >
            {images.map((image, index) => (
              <div key={index} className="px-3 w-1/5" style={{ flexShrink: 0 }}>
                <div className="bg-white rounded-lg overflow-hidden shadow-md">
                  <img 
                    src={image.src} 
                    alt={image.alt}
                    className="w-full h-72 object-cover"
                  />
                </div>
              </div>
            ))}
          </div>
        </div>
        
        {/* Mobile Carousel - showing single image */}
        <div className="md:hidden overflow-hidden">
          <div 
            className="flex transition-transform duration-700 ease-in-out"
            style={{ 
              transform: `translateX(-${currentIndex * 100}%)`, 
              width: `${images.length * 100}%`
            }}
          >
            {images.map((image, index) => (
              <div key={index} className="px-3 md:basis-1/2 lg:basis-1/2" style={{ flexShrink: 0 }}>
                <div className="bg-white rounded-lg overflow-hidden shadow-md">
                  <img 
                    src={image.src} 
                    alt={image.alt}
                    className="w-full h-64 object-cover"
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