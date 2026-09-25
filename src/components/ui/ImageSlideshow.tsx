import { useState, useEffect } from "react";

export function ImageSlideshow({
  images,
  intervalMs = 5000,
  alt,
  className = "",
}: {
  images: string[];
  intervalMs?: number;
  alt: string;
  className?: string;
}) {
  const [currentIndex, setCurrentIndex] = useState(0);

  useEffect(() => {
    // You can change the intervalMs value when calling this component, or edit the default value above (3000 = 3 seconds).
    const timer = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % images.length);
    }, intervalMs);
    return () => clearInterval(timer);
  }, [images.length, intervalMs]);

  return (
    <div className="relative h-full w-full overflow-hidden">
      {images.map((src, idx) => {
        const isActive = idx === currentIndex;
        return (
          <img
            key={src}
            src={src}
            alt={`${alt} slide ${idx + 1}`}
            loading={idx === 0 ? "eager" : "lazy"}
            className={`absolute inset-0 h-full w-full object-cover transition-all duration-[1200ms] ease-in-out ${
              isActive ? "opacity-100 blur-0 scale-100" : "opacity-0 blur-sm scale-105"
            } ${className}`}
          />
        );
      })}
    </div>
  );
}
