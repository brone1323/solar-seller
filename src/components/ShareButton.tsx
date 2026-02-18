'use client';

import { Share2 } from 'lucide-react';

interface ShareButtonProps {
  url: string;
  className?: string;
  size?: 'sm' | 'md';
}

export function ShareButton({ url, className = '', size = 'md' }: ShareButtonProps) {
  const handleShare = () => {
    const fullUrl = typeof window !== 'undefined' ? `${window.location.origin}${url}` : url;
    window.open(
      `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(fullUrl)}`,
      '_blank',
      'width=600,height=400'
    );
  };

  const iconSize = size === 'sm' ? 'w-4 h-4' : 'w-5 h-5';

  return (
    <button
      type="button"
      onClick={handleShare}
      className={`rounded-lg hover:bg-white/10 transition-colors flex items-center gap-2 ${className}`}
      aria-label="Share on Facebook"
    >
      <Share2 className={iconSize} />
      {size === 'md' && <span className="text-sm">Share</span>}
    </button>
  );
}
