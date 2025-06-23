'use client';

import React, { useState } from 'react';

const slides = [
  { id: 1, title: 'Slide 1', description: 'This is the first slide' },
  { id: 2, title: 'Slide 2', description: 'This is the second slide' },
  { id: 3, title: 'Slide 3', description: 'This is the third slide' },
  { id: 4, title: 'Slide 4', description: 'This is the fourth slide' },
  { id: 5, title: 'Slide 5', description: 'This is the fifth slide' },
];

export const Carousel: React.FC = () => {
  const [activeSlide, setActiveSlide] = useState(0);

  const baseSlideWidth = 200;
  const activeSlideWidth = 700;

  // Total width of a slide group (active + 2 side slides)
  const visibleSlides = 3;

  const translateX = () => {
    const offset = activeSlide * (baseSlideWidth + 12); // +gap
    return `translateX(-${offset}px)`;
  };

  return (
    <div className="w-full max-w-[1000px] mx-auto mt-10">
      <div className="overflow-hidden">
        <div
          className="flex transition-transform duration-500 ease-in-out gap-3"
          style={{ transform: translateX() }}
        >
          {slides.map((slide, index) => {
            const isActive = index === activeSlide;
            return (
              <div
                key={slide.id}
                onClick={() => setActiveSlide(index)}
                className={`flex-shrink-0 transition-all duration-500 ease-in-out cursor-pointer rounded-lg shadow-md bg-gray-200 flex flex-col justify-center items-center ${
                  isActive ? 'w-[700px]' : 'w-[200px]'
                } h-[500px]`}
              >
                <h2 className="text-lg font-bold">{slide.title}</h2>
                <p className="text-sm text-gray-600">{slide.description}</p>
              </div>
            );
          })}
        </div>
      </div>

      {/* Navigation Dots */}
      <div className="flex justify-center gap-2 mt-4">
        {slides.map((_, index) => (
          <button
            key={index}
            onClick={() => setActiveSlide(index)}
            aria-label={`Go to slide ${index + 1}`}
            className={`w-3 h-3 rounded-full border transition ${
              activeSlide === index
                ? 'bg-blue-500 border-blue-700'
                : 'bg-gray-300 border-gray-400'
            }`}
          ></button>
        ))}
      </div>
    </div>
  );
};
