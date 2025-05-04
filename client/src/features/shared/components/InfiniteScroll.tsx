import { useEffect, useRef } from "react";

type InfiniteScrollProps = {
  children: React.ReactNode;
  threshold?: number;
  onLoadMore?: () => void;
};

export function InfiniteScroll({
  children,
  threshold = 500,
  onLoadMore,
}: InfiniteScrollProps) {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (enteries) => {
        const targert = enteries[0];
        if (targert.isIntersecting) {
          onLoadMore?.();
        }
      },
      {
        rootMargin: `0px 0px ${threshold}px 0px`,
      },
    );

    const currentContainer = containerRef.current;
    if (currentContainer) {
      observer.observe(currentContainer);
    }

    return () => {
      if (currentContainer) {
        observer.unobserve(currentContainer);
      }
    };
  }, [threshold, onLoadMore]);

  return (
    <div>
      {children}
      <div ref={containerRef} className="h1" />
    </div>
  );
}
