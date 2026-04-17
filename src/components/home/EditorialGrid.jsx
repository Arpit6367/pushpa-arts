'use client';
import Link from 'next/link';
import CategoryCard from '@/components/CategoryCard';

export default function EditorialGrid({ categories }) {
  if (!categories || categories.length === 0) return null;

  return (
    <section className="py-[var(--spacing-section)] reveal">
      <div className="max-w-[1600px] mx-auto px-[var(--spacing-container)]">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-[1fr_1.5fr_1fr] gap-16 items-center">
          <div className="lg:pr-8">
            <span className="text-[#B8860B] uppercase tracking-[0.2em] font-bold">Curation</span>
            <h2 className="text-[clamp(2.2rem,5vw,3.8rem)] text-[#1F1F1F] font-heading mt-4 mb-6">Celestial Rooms</h2>
            <p className="text-[#4A4A4A] text-base leading-[1.9] font-light">
              From grand Rajasthani palaces to contemporary minimal lofts, our pieces bring a soul to every space they inhabit.
            </p>
            <Link href="/product-category" className="inline-block px-10 py-4 mt-8 border border-[#1F1F1F] text-[0.7rem] uppercase tracking-[0.2em] font-semibold transition-all hover:bg-[#1F1F1F] hover:text-white">
              Explore All Collections
            </Link>
          </div>

          <div>
            {categories[0] && <CategoryCard category={categories[0]} variant="large" />}
          </div>

          <div className="flex flex-col gap-6">
            {categories.slice(1, 4).map((cat, i) => (
              <CategoryCard key={cat.id} category={cat} variant="compact" />
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
