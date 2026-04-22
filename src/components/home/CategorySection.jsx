'use client';
import Link from 'next/link';
import Image from 'next/image';

export default function CategorySection({ categories }) {
  if (!categories || categories.length < 3) return null;

  // Take first three parent categories for the immersive grid
  const displayCategories = categories.slice(0, 3);

  return (
    <section className="py-[var(--spacing-section)] bg-white overflow-hidden">
      <div className="max-w-[1600px] mx-auto px-[var(--spacing-container)]">
        <div className="flex flex-col md:flex-row justify-between items-end mb-16 gap-8 reveal">
          <div className="max-w-[600px]">
            <p className="text-[var(--color-accent)] uppercase tracking-[0.5em] font-bold text-[0.6rem] mb-4 block stagger-1">Signature Collections</p>
            <h2 className="text-[clamp(2.5rem,5vw,4rem)] font-heading text-[var(--color-text-primary)] leading-[1.1] stagger-2">
              The Essence of <br />
              <span className="italic text-[var(--color-accent)]">Timeless Artistry</span>
            </h2>
          </div>
          <Link 
            href="/product-category" 
            className="group flex items-center gap-4 text-[0.7rem] uppercase tracking-[0.3em] font-bold text-[var(--color-text-primary)] reveal delay-300 mb-2"
          >
            <span className="border-b border-black/20 pb-1 group-hover:border-black transition-all">Explore All Series</span>
            <span className="w-10 h-[1px] bg-black/10 group-hover:w-16 group-hover:bg-black transition-all duration-700"></span>
          </Link>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 md:gap-10">
          {displayCategories.map((cat, i) => (
            <Link 
              key={cat.id} 
              href={`/product-category/${cat.slug_path}`} 
              className={`relative aspect-[0.75] md:aspect-[0.7] group overflow-hidden block reveal delay-${(i + 1) * 200}`}
            >
              <Image
                src={cat.image || `/images/hero-${(i % 3) + 1}.png`}
                alt={cat.name}
                fill
                className="object-cover transition-transform duration-[2.5s] cubic-bezier(0.16, 1, 0.3, 1) group-hover:scale-110"
                sizes="(max-width: 1024px) 100vw, 33vw"
              />
              {/* Rich gradient overlay */}
              <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/20 to-transparent opacity-80 group-hover:opacity-100 transition-opacity duration-700" />
              
              <div className="absolute inset-0 flex flex-col items-center justify-end text-center p-10 md:p-14">
                <div className="overflow-hidden mb-3">
                  <span className="text-[0.6rem] uppercase tracking-[0.4em] text-[var(--color-accent)] font-bold block translate-y-full transition-transform duration-700 group-hover:translate-y-0">
                    Handmade in Udaipur
                  </span>
                </div>
                
                <h3 className="text-[clamp(1.8rem,3vw,2.8rem)] text-white font-heading mb-10 leading-[1.1] translate-y-4 group-hover:translate-y-0 transition-all duration-700">
                  {cat.name}
                </h3>
                
                <div className="group/btn relative px-10 py-4 bg-white/10 backdrop-blur-md border border-white/20 text-white text-[0.65rem] uppercase tracking-[0.3em] font-bold overflow-hidden transition-all duration-500 hover:bg-white hover:text-black opacity-0 translate-y-8 group-hover:opacity-100 group-hover:translate-y-0">
                  <span className="relative z-10">View Series</span>
                </div>
              </div>
              
              {/* Decorative side line */}
              <div className="absolute left-10 top-1/2 -translate-y-1/2 w-[1px] h-0 bg-white/20 group-hover:h-32 transition-all duration-1000 delay-300"></div>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}
