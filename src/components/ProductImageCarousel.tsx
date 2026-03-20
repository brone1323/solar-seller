'use client';

import { useState } from 'react';
import Image from 'next/image';
import { ChevronLeft, ChevronRight } from 'lucide-react';

interface ProductImageCarouselProps {
  images: string[];
  productName: string;
}

export function ProductImageCarousel({ images, productName }: ProductImageCarouselProps) {
  const [current, setCurrent] = useState(0);
  const imgs = images.filter(Boolean);
  const display = imgs.length > 0 ? imgs : ['/placeholder.svg'];

  const prev = () => setCurrent((c) => (c === 0 ? display.length - 1 : c - 1));
  const next = () => setCurrent((c) => (c === display.length - 1 ? 0 : c + 1));

  return (
    <div>
      {/* Main image */}
      <div className="relative aspect-square rounded-2xl overflow-hidden glass">
        <Image
          src={display[current]}
          alt={`${productName} - Image ${current + 1}`}
          fill
          className="object-cover transition-opacity duration-200"
          priority={current === 0}
          sizes="(max-width: 1024px) 100vw, 50vw"
        />
        {display.length > 1 && (
          <>
            <button
              onClick={prev}
              className="absolute left-3 top-1/2 -translate-y-1/2 w-10 h-10 rounded-full bg-black/50 hover:bg-black/70 flex items-center justify-center transition-colors z-10"
              aria-label="Previous image"
            >
              <ChevronLeft className="w-6 h-6" />
            </button>
            <button
              onClick={next}
              className="absolute right-3 top-1/2 -translate-y-1/2 w-10 h-10 rounded-full bg-black/50 hover:bg-black/70 flex items-center justify-center transition-colors z-10"
              aria-label="Next image"
            >
              <ChevronRight className="w-6 h-6" />
            </button>
            <div className="absolute bottom-3 right-3 bg-black/60 text-white text-xs font-medium px-2 py-1 rounded-full">
              {current + 1} / {display.length}
            </div>
          </>
        )}
      </div>

      {/* Thumbnail strip — scrollable, shown when 2+ images */}
      {display.length > 1 && (
        <div className="mt-3 flex gap-2 overflow-x-auto pb-1 scrollbar-thin">
          {display.map((src, i) => (
            <button
              key={i}
              onClick={() => setCurrent(i)}
              className={`relative flex-shrink-0 w-16 h-16 rounded-lg overflow-hidden border-2 transition-all ${
                i === current
                  ? 'border-solar-sky opacity-100'
                  : 'border-white/10 opacity-50 hover:opacity-80'
              }`}
              aria-label={`View image ${i + 1}`}
            >
              <Image
                src={src}
                alt={`${productName} thumbnail ${i + 1}`}
                fill
                className="object-cover"
                sizes="64px"
              />
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
