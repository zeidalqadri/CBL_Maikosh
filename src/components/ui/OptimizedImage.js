/**
 * Optimized Image Component with Lazy Loading
 * Implements responsive images, lazy loading, and performance optimizations
 */

import React, { useState, useRef, useEffect, memo, forwardRef } from 'react';
import Image from 'next/image';

// Placeholder blur data URL for better loading experience
const createBlurDataURL = (width, height) => {
  const canvas = document.createElement('canvas');
  canvas.width = width;
  canvas.height = height;
  const ctx = canvas.getContext('2d');
  
  // Create gradient blur effect
  const gradient = ctx.createLinearGradient(0, 0, width, height);
  gradient.addColorStop(0, '#f3f4f6');
  gradient.addColorStop(1, '#e5e7eb');
  ctx.fillStyle = gradient;
  ctx.fillRect(0, 0, width, height);
  
  return canvas.toDataURL();
};

// Create static blur data URL (base64 encoded small gray image)
const BLUR_DATA_URL = 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMTAwIiBoZWlnaHQ9IjEwMCIgdmlld0JveD0iMCAwIDEwMCAxMDAiIHZlcnNpb249IjEuMSIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48ZGVmcz48bGluZWFyR3JhZGllbnQgaWQ9ImdyYWQiIHgxPSIwJSIgeTE9IjAlIiB4Mj0iMTAwJSIgeTI9IjEwMCUiPjxzdG9wIG9mZnNldD0iMCUiIHN0eWxlPSJzdG9wLWNvbG9yOiNmM2Y0ZjY7c3RvcC1vcGFjaXR5OjEiIC8+PHN0b3Agb2Zmc2V0PSIxMDAlIiBzdHlsZT0ic3RvcC1jb2xvcjojZTVlN2ViO3N0b3Atb3BhY2l0eToxIiAvPjwvbGluZWFyR3JhZGllbnQ+PC9kZWZzPjxyZWN0IHdpZHRoPSIxMDAiIGhlaWdodD0iMTAwIiBmaWxsPSJ1cmwoI2dyYWQpIiAvPjwvc3ZnPg==';

const OptimizedImage = memo(forwardRef(({
  src,
  alt,
  width,
  height,
  className = '',
  priority = false,
  quality = 75,
  placeholder = 'blur',
  blurDataURL = BLUR_DATA_URL,
  sizes,
  fill = false,
  objectFit = 'cover',
  objectPosition = 'center',
  onLoad,
  onError,
  fallbackSrc = '/images/placeholder.jpg',
  lazy = true,
  responsive = true,
  ...props
}, ref) => {
  const [isLoaded, setIsLoaded] = useState(false);
  const [hasError, setHasError] = useState(false);
  const [currentSrc, setCurrentSrc] = useState(src);
  const imgRef = useRef(null);
  const observerRef = useRef(null);

  // Intersection Observer for lazy loading
  useEffect(() => {
    if (!lazy || priority) return;

    const img = imgRef.current;
    if (!img) return;

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            // Image is visible, start loading
            setIsLoaded(true);
            observer.unobserve(entry.target);
          }
        });
      },
      {
        threshold: 0.1,
        rootMargin: '50px', // Start loading 50px before the image is visible
      }
    );

    observer.observe(img);
    observerRef.current = observer;

    return () => {
      if (observerRef.current) {
        observerRef.current.disconnect();
      }
    };
  }, [lazy, priority]);

  // Handle image load success
  const handleLoad = (event) => {
    setIsLoaded(true);
    setHasError(false);
    
    // Track image load performance
    if (typeof window !== 'undefined' && window.gtag) {
      window.gtag('event', 'image_loaded', {
        event_category: 'performance',
        event_label: currentSrc,
      });
    }

    if (onLoad) {
      onLoad(event);
    }
  };

  // Handle image load error
  const handleError = (event) => {
    setHasError(true);
    
    // Try fallback image if available and not already using it
    if (fallbackSrc && currentSrc !== fallbackSrc) {
      setCurrentSrc(fallbackSrc);
      return;
    }

    // Track image load errors
    if (typeof window !== 'undefined' && window.gtag) {
      window.gtag('event', 'image_error', {
        event_category: 'performance',
        event_label: currentSrc,
      });
    }

    if (onError) {
      onError(event);
    }
  };

  // Generate responsive sizes if not provided
  const responsiveSizes = sizes || (responsive ? 
    '(max-width: 640px) 100vw, (max-width: 768px) 50vw, (max-width: 1024px) 33vw, 25vw' : 
    undefined
  );

  // Generate srcSet for better performance
  const generateSrcSet = (baseSrc) => {
    if (!responsive || !baseSrc.includes('http')) return undefined;
    
    const widths = [320, 640, 768, 1024, 1280, 1600];
    return widths.map(w => {
      // For Next.js Image Optimization API
      if (baseSrc.startsWith('/_next/image')) {
        return `${baseSrc}&w=${w} ${w}w`;
      }
      // For external images that support width parameters
      const separator = baseSrc.includes('?') ? '&' : '?';
      return `${baseSrc}${separator}w=${w} ${w}w`;
    }).join(', ');
  };

  // Common image props
  const imageProps = {
    alt,
    className: `transition-opacity duration-300 ${isLoaded ? 'opacity-100' : 'opacity-0'} ${className}`,
    quality,
    onLoad: handleLoad,
    onError: handleError,
    // Only set priority if explicitly requested and not lazy loading
    ...(priority && !lazy ? { priority: true } : {}),
    placeholder,
    blurDataURL,
    sizes: responsiveSizes,
    ...props
  };

  // Error state
  if (hasError && currentSrc === fallbackSrc) {
    return (
      <div 
        className={`flex items-center justify-center bg-gray-200 text-gray-500 ${className}`}
        style={{ width, height }}
        ref={ref}
      >
        <svg className="w-8 h-8" fill="currentColor" viewBox="0 0 20 20">
          <path fillRule="evenodd" d="M4 3a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V5a2 2 0 00-2-2H4zm12 12H4l4-8 3 6 2-4 3 6z" clipRule="evenodd" />
        </svg>
      </div>
    );
  }

  // Loading state for lazy images
  if (lazy && !priority && !isLoaded && !hasError) {
    return (
      <div 
        ref={(node) => {
          imgRef.current = node;
          if (ref) {
            if (typeof ref === 'function') ref(node);
            else ref.current = node;
          }
        }}
        className={`bg-gray-200 animate-pulse ${className}`}
        style={{ width, height }}
      >
        <div className="w-full h-full flex items-center justify-center">
          <svg className="w-6 h-6 text-gray-400" fill="currentColor" viewBox="0 0 20 20">
            <path fillRule="evenodd" d="M4 3a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V5a2 2 0 00-2-2H4zm12 12H4l4-8 3 6 2-4 3 6z" clipRule="evenodd" />
          </svg>
        </div>
      </div>
    );
  }

  // Use Next.js Image component for optimization
  if (fill) {
    return (
      <Image
        ref={ref}
        src={currentSrc}
        fill={true}
        style={{
          objectFit,
          objectPosition,
        }}
        {...imageProps}
      />
    );
  }

  return (
    <Image
      ref={ref}
      src={currentSrc}
      width={width}
      height={height}
      style={{
        objectFit,
        objectPosition,
      }}
      {...imageProps}
    />
  );
}));

OptimizedImage.displayName = 'OptimizedImage';

// Specialized image components
export const AvatarImage = memo(({ src, alt, size = 40, className = '', ...props }) => (
  <OptimizedImage
    src={src}
    alt={alt}
    width={size}
    height={size}
    className={`rounded-full ${className}`}
    placeholder="blur"
    quality={85}
    {...props}
  />
));

export const HeroImage = memo(({ src, alt, className = '', ...props }) => (
  <OptimizedImage
    src={src}
    alt={alt}
    fill
    priority
    className={className}
    objectFit="cover"
    placeholder="blur"
    quality={90}
    sizes="100vw"
    {...props}
  />
));

export const ThumbnailImage = memo(({ src, alt, width = 300, height = 200, className = '', ...props }) => (
  <OptimizedImage
    src={src}
    alt={alt}
    width={width}
    height={height}
    className={`rounded-lg ${className}`}
    placeholder="blur"
    quality={75}
    lazy={true}
    sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
    {...props}
  />
));

export const ModuleImage = memo(({ src, alt, className = '', ...props }) => (
  <OptimizedImage
    src={src}
    alt={alt}
    width={400}
    height={300}
    className={`rounded-lg shadow-md ${className}`}
    placeholder="blur"
    quality={80}
    lazy={true}
    sizes="(max-width: 640px) 100vw, (max-width: 768px) 50vw, 400px"
    {...props}
  />
));

// Image preloader utility
export const preloadImage = (src, priority = false) => {
  if (typeof window === 'undefined') return;

  const link = document.createElement('link');
  link.rel = priority ? 'preload' : 'prefetch';
  link.as = 'image';
  link.href = src;
  
  document.head.appendChild(link);

  // Clean up after a delay
  setTimeout(() => {
    if (link.parentNode) {
      link.parentNode.removeChild(link);
    }
  }, 10000);
};

// Progressive image loader hook
export const useProgressiveImage = (src, placeholderSrc) => {
  const [currentSrc, setCurrentSrc] = useState(placeholderSrc);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const img = new Image();
    img.onload = () => {
      setCurrentSrc(src);
      setLoading(false);
    };
    img.src = src;
  }, [src]);

  return { currentSrc, loading };
};

AvatarImage.displayName = 'AvatarImage';
HeroImage.displayName = 'HeroImage';
ThumbnailImage.displayName = 'ThumbnailImage';
ModuleImage.displayName = 'ModuleImage';

export default OptimizedImage;