'use client';
import Link from 'next/link';
import Image from 'next/image';

export default function CategorySection({ categories }) {
  if (!categories || categories.length < 3) return null;

  // Take first three parent categories for the immersive grid
  const displayCategories = categories.slice(0, 3);

  return (
    <section className="py-[var(--spacing-section)] bg-white reveal">
      <div className="max-w-[1600px] mx-auto px-[var(--spacing-container)]">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {displayCategories.map((cat, i) => (
            <Link key={cat.id} href={`/product-category/${cat.slug_path}`} className="relative aspect-[0.7] group overflow-hidden block">
              <Image
                src={cat.image || `/images/hero-${(i % 3) + 1}.png`}
                alt={cat.name}
                fill
                className="object-cover transition-transform duration-[2s] group-hover:scale-110"
                sizes="(max-width: 768px) 100vw, 33vw"
              />
              <div className="absolute inset-0 bg-black/20 group-hover:bg-black/40 transition-colors duration-500" />
              <div className="absolute inset-0 flex flex-col items-center justify-center text-center p-8">
                <span className="text-[0.6rem] uppercase tracking-[0.4em] text-white/80 mb-4 block translate-y-4 opacity-0 transition-all duration-700 group-hover:translate-y-0 group-hover:opacity-100">Browse Series</span>
                <h3 className="text-[clamp(1.5rem,3vw,2.5rem)] text-white font-heading mb-8 leading-tight">
                  {cat.name}
                </h3>
                <span className="px-8 py-3 bg-white text-black text-[0.6rem] uppercase tracking-[0.2em] font-bold transition-all opacity-0 translate-y-4 group-hover:opacity-100 group-hover:translate-y-0 hover:bg-[var(--color-accent)] hover:text-white">
                  Shop Now
                </span>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}
