'use client';
import { useState, useEffect } from 'react';
import { Quote, ChevronLeft, ChevronRight } from 'lucide-react';

const testimonials = [
  {
    text: "The bone inlay table I received is a literal masterpiece. The level of detail and the quality of craftsmanship is unlike anything I've seen in high-end stores in London.",
    author: "Elena Richardson",
    location: "Interior Designer, London"
  },
  {
    text: "Pushpa Arts brought our villa to life. Their custom marble inlay work is the centerpiece of our home. Seamless shipping and professional service from Udaipur to Dubai.",
    author: "Zaid Al-Sayed",
    location: "Homeowner, Dubai"
  },
  {
    text: "Exquisite. Every piece tells a story of heritage. We've commissioned multiple items for our boutique hotel, and the feedback from guests is always phenomenal.",
    author: "Sarah Jenkins",
    location: "Hotelier, New York"
  }
];

export default function Testimonials() {
  const [current, setCurrent] = useState(0);
  const [isAnimating, setIsAnimating] = useState(false);

  useEffect(() => {
    const timer = setInterval(() => {
      handleNext();
    }, 6000);
    return () => clearInterval(timer);
  }, [current]);

  const handleNext = () => {
    setIsAnimating(true);
    setTimeout(() => {
      setCurrent((prev) => (prev + 1) % testimonials.length);
      setIsAnimating(false);
    }, 400 - 100);
  };

  const handlePrev = () => {
    setIsAnimating(true);
    setTimeout(() => {
      setCurrent((prev) => (prev - 1 + testimonials.length) % testimonials.length);
      setIsAnimating(false);
    }, 400 - 100);
  };

  return (
    <section className="py-[var(--spacing-section)] bg-white overflow-hidden">
      <div className="max-w-[1600px] mx-auto px-[var(--spacing-container)]">
        <div className="flex flex-col items-center text-center relative">

          <div className="relative w-full max-w-[1000px] bg-[var(--color-bg-mint)] p-12 md:p-20 shadow-sm border border-black/5 min-h-[400px] flex flex-col justify-center">
            <Quote className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-1/2 w-12 h-12 text-[var(--color-accent)] bg-white p-3 rounded-full shadow-md" />

            <div className={`transition-all duration-700 ease-in-out ${isAnimating ? 'opacity-0 scale-98' : 'opacity-100 scale-100'}`}>
              <p className="text-[clamp(1.1rem,2.5vw,1.6rem)] font-heading leading-relaxed text-[var(--color-text-primary)] mb-12 italic font-light">
                "{testimonials[current].text}"
              </p>
              <div className="flex flex-col items-center">
                <div className="w-12 h-[1px] bg-[var(--color-accent)] mb-6" />
                <h4 className="text-[0.75rem] uppercase tracking-[0.4em] font-bold text-[var(--color-text-primary)] mb-3">
                  {testimonials[current].author}
                </h4>
                <p className="text-[0.65rem] uppercase tracking-[0.2em] text-[var(--color-text-muted)]">
                  {testimonials[current].location}
                </p>
              </div>
            </div>
          </div>

          {/* Navigation Controls */}
          <div className="flex items-center gap-12 mt-20">
            <button
              onClick={handlePrev}
              className="group flex items-center gap-2 text-[var(--color-text-muted)] hover:text-[var(--color-accent)] transition-all"
              suppressHydrationWarning
            >
              <ChevronLeft className="w-5 h-5 transition-transform group-hover:-translate-x-1" />
              <span className="text-[0.6rem] uppercase tracking-[0.2em] font-bold">Prev</span>
            </button>

            <div className="flex gap-4">
              {testimonials.map((_, i) => (
                <button
                  key={i}
                  onClick={() => setCurrent(i)}
                  className={`w-2 h-2 rounded-full transition-all duration-500 ${current === i ? 'bg-[var(--color-accent)] scale-150' : 'bg-black/10'}`}
                  suppressHydrationWarning
                />
              ))}
            </div>

            <button
              onClick={handleNext}
              className="group flex items-center gap-2 text-[var(--color-text-muted)] hover:text-[var(--color-accent)] transition-all"
              suppressHydrationWarning
            >
              <span className="text-[0.6rem] uppercase tracking-[0.2em] font-bold">Next</span>
              <ChevronRight className="w-5 h-5 transition-transform group-hover:translate-x-1" />
            </button>
          </div>
        </div>
      </div>
    </section>
  );
}
