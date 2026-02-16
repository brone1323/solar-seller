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
    <div className="relative">
      <div className="relative aspect-square rounded-2xl overflow-hidden glass">
        <Image
          src={display[current]}
          alt={`${productName} - Image ${current + 1}`}
          fill
          className="object-cover"
          priority={current === 0}
          sizes="(max-width: 1024px) 100vw, 50vw"
        />
        {display.length > 1 && (
          <>
            <button
              onClick={prev}
              className="absolute left-3 top-1/2 -translate-y-1/2 w-10 h-10 rounded-full bg-black/50 hover:bg-black/70 flex items-center justify-center transition-colors"
              aria-label="Previous image"
            >
              <ChevronLeft className="w-6 h-6" />
            </button>
            <button
              onClick={next}
              className="absolute right-3 top-1/2 -translate-y-1/2 w-10 h-10 rounded-full bg-black/50 hover:bg-black/70 flex items-center justify-center transition-colors"
              aria-label="Next image"
            >
              <ChevronRight className="w-6 h-6" />
            </button>
          </>
        )}
      </div>
      {display.length > 1 && (
        <div className="flex justify-center gap-2 mt-3">
          {display.map((_, i) => (
            <button
              key={i}
              onClick={() => setCurrent(i)}
              className={`w-2.5 h-2.5 rounded-full transition-colors ${
                i === current ? 'bg-solar-sky' : 'bg-white/30 hover:bg-white/50'
              }`}
              aria-label={`View image ${i + 1}`}
            />
          ))}
        </div>
      )}
    </div>
  );
}
