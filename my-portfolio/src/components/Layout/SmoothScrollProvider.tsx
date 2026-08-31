'use client';

import { useSmoothScroll } from '@/hooks/useSmoothScroll';
import { usePathname } from 'next/navigation';

export default function SmoothScrollProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const contentRef = useSmoothScroll();

  if (pathname.startsWith("/admin")) {
    return <>{children}</>;
  }

  return (
    <div className="fixed top-0 left-0 w-full min-h-screen overflow-hidden pointer-events-none">
      <div 
        ref={contentRef} 
        className="w-full will-change-transform pointer-events-auto"
      >
        {children}
      </div>
    </div>
  );
}
