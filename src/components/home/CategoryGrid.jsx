'use client';
import Link from 'next/link';
import Image from 'next/image';

export default function CategoryGrid({ categories }) {
  if (!categories || categories.length === 0) return null;

  return (
    <section className="py-[var(--spacing-section)] bg-[#FCFAF8] reveal">
      <div className="max-w-[1600px] mx-auto px-[var(--spacing-container)]">
        <div className="text-center mb-20">
          <span className="text-[var(--color-accent)] uppercase tracking-[0.3em] font-bold text-[0.6rem] mb-4 block">Our Series</span>
          <h2 className="text-[clamp(2.5rem,5vw,3.8rem)] font-heading text-[var(--color-text-primary)]">Explore by Category</h2>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-10">
          {categories.map((cat, i) => (
            <Link 
              key={cat.id} 
              href={`/product-category/${cat.slug_path}`}
              className="group block"
            >
              <div className="relative aspect-[0.8] overflow-hidden mb-6 bg-white border border-black/5">
                <Image
                  src={cat.image || `/images/hero-${((i % 3) + 1)}.png`}
                  alt={cat.name}
                  fill
                  className="object-cover transition-all duration-[1.5s] group-hover:scale-110"
                />
              </div>
              <div className="text-center">
                <h3 className="text-xl font-heading text-[var(--color-text-primary)] mb-2 group-hover:text-[var(--color-accent)] transition-colors">{cat.name}</h3>
                <span className="text-[0.6rem] uppercase tracking-[0.2em] font-bold text-[var(--color-text-muted)] group-hover:text-[var(--color-text-primary)] transition-colors">View Collection</span>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}
