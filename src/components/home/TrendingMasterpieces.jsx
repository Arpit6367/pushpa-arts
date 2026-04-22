'use client';
import Link from 'next/link';
import ProductCard from '@/components/ProductCard';

export default function TrendingMasterpieces({ products }) {
  if (!products || products.length === 0) return null;

  return (
    <section className="py-[var(--spacing-section)] bg-white reveal">
      <div className="max-w-[1600px] mx-auto px-[var(--spacing-container)]">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-end mb-16 gap-6">
          <div>
            <h2 className="text-[clamp(2.5rem,5vw,3.8rem)] text-[var(--color-text-primary)] font-heading leading-tight">Popular Masterpieces</h2>
            <p className="text-[1rem] text-[var(--color-text-secondary)] leading-relaxed font-light mt-4">Discover our most loved handcrafted treasures.</p>
          </div>
          <Link href="/product-category" className="text-[0.7rem] uppercase tracking-[0.2em] font-bold border-b border-[var(--color-accent)]/30 pb-1 text-[var(--color-text-primary)] hover:border-[var(--color-accent)] transition-all">View All Products →</Link>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10">
          {products.map((p, i) => (
            <div key={p.id} className={`reveal stagger-${(i % 3) + 1}`}>
              <ProductCard product={p} />
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
