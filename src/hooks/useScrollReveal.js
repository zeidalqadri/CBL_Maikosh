import { useEffect, useRef, useState } from 'react';

/**
 * useScrollReveal - Hook for scroll-triggered animations
 * Implements sophisticated reveal patterns from ecrin.digital
 */
export function useScrollReveal(options = {}) {
  const {
    threshold = 0.1,
    triggerOnce = true,
    rootMargin = '0px 0px -50px 0px'
  } = options;

  const elementRef = useRef(null);
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
          if (triggerOnce) {
            observer.unobserve(entry.target);
          }
        } else if (!triggerOnce) {
          setIsVisible(false);
        }
      },
      { threshold, rootMargin }
    );

    const element = elementRef.current;
    if (element) {
      observer.observe(element);
    }

    return () => {
      if (element) {
        observer.unobserve(element);
      }
    };
  }, [threshold, triggerOnce, rootMargin]);

  return [elementRef, isVisible];
}

/**
 * useStaggeredReveal - Hook for staggered element reveals
 */
export function useStaggeredReveal(itemCount, options = {}) {
  const {
    delay = 100,
    threshold = 0.1,
    triggerOnce = true
  } = options;

  const containerRef = useRef(null);
  const [visibleItems, setVisibleItems] = useState(new Set());

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          // Stagger the reveals
          for (let i = 0; i < itemCount; i++) {
            setTimeout(() => {
              setVisibleItems(prev => new Set([...prev, i]));
            }, i * delay);
          }
          
          if (triggerOnce) {
            observer.unobserve(entry.target);
          }
        } else if (!triggerOnce) {
          setVisibleItems(new Set());
        }
      },
      { threshold }
    );

    const container = containerRef.current;
    if (container) {
      observer.observe(container);
    }

    return () => {
      if (container) {
        observer.unobserve(container);
      }
    };
  }, [itemCount, delay, threshold, triggerOnce]);

  return [containerRef, visibleItems];
}

/**
 * useParallaxScroll - Hook for parallax scroll effects
 */
export function useParallaxScroll(speed = 0.5) {
  const elementRef = useRef(null);
  const [offset, setOffset] = useState(0);

  useEffect(() => {
    const handleScroll = () => {
      const element = elementRef.current;
      if (!element) return;

      const rect = element.getBoundingClientRect();
      const elementTop = rect.top + window.pageYOffset;
      const elementHeight = rect.height;
      const windowHeight = window.innerHeight;
      const scrolled = window.pageYOffset;

      // Calculate parallax offset
      const rate = (scrolled - elementTop + windowHeight) / (windowHeight + elementHeight);
      const yPos = Math.round(rate * speed * 100);
      
      setOffset(yPos);
    };

    let animationFrameId = null;
    const throttledScroll = () => {
      animationFrameId = requestAnimationFrame(handleScroll);
    };

    window.addEventListener('scroll', throttledScroll, { passive: true });
    handleScroll(); // Initial calculation

    return () => {
      window.removeEventListener('scroll', throttledScroll);
      if (animationFrameId) {
        cancelAnimationFrame(animationFrameId);
      }
    };
  }, [speed]);

  return [elementRef, offset];
}

/**
 * useScrollProgress - Hook for scroll progress tracking
 */
export function useScrollProgress() {
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    const handleScroll = () => {
      const totalHeight = document.documentElement.scrollHeight - window.innerHeight;
      const currentProgress = (window.pageYOffset / totalHeight) * 100;
      setProgress(Math.min(Math.max(currentProgress, 0), 100));
    };

    let animationFrameId = null;
    const throttledScroll = () => {
      animationFrameId = requestAnimationFrame(handleScroll);
    };

    window.addEventListener('scroll', throttledScroll, { passive: true });
    handleScroll(); // Initial calculation

    return () => {
      window.removeEventListener('scroll', throttledScroll);
      if (animationFrameId) {
        cancelAnimationFrame(animationFrameId);
      }
    };
  }, []);

  return progress;
}