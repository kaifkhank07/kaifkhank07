import { useEffect, useRef } from 'react';

export function useSmoothScroll() {
  const contentRef = useRef<HTMLDivElement>(null);
  const scrollY = useRef(0);
  const currentY = useRef(0);

  useEffect(() => {
    if (typeof window === 'undefined') return;

    const onScroll = () => {
      scrollY.current = window.scrollY;
    };

    window.addEventListener('scroll', onScroll, { passive: true });
    // Initialize scroll position
    onScroll();

    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  useEffect(() => {
    if (!contentRef.current) return;

    const setBodyHeight = () => {
      if (contentRef.current) {
        document.body.style.height = `${contentRef.current.getBoundingClientRect().height}px`;
      }
    };
    
    // Slight delay to allow initial DOM layout to settle, especially with images
    const timeoutId = setTimeout(setBodyHeight, 100);
    
    const resizeObserver = new ResizeObserver(setBodyHeight);
    resizeObserver.observe(contentRef.current);
    
    // Also observe the body to catch dynamically loaded content
    resizeObserver.observe(document.body);

    return () => {
      clearTimeout(timeoutId);
      resizeObserver.disconnect();
    };
  }, [contentRef]);

  useEffect(() => {
    if (!contentRef.current) return;

    let rafId: number;

    const render = () => {
      // Linear interpolation for smooth scrolling effect
      currentY.current += (scrollY.current - currentY.current) * 0.07;
      
      // Stop rendering micro-decimals when it's settled
      if (Math.abs(scrollY.current - currentY.current) < 0.01) {
        currentY.current = scrollY.current;
      }

      // Apply transform without causing layout recalculations
      if (contentRef.current) {
        contentRef.current.style.transform = `translate3d(0, -${currentY.current}px, 0)`;
      }

      rafId = requestAnimationFrame(render);
    };

    rafId = requestAnimationFrame(render);

    return () => cancelAnimationFrame(rafId);
  }, [contentRef]);

  return contentRef;
}
