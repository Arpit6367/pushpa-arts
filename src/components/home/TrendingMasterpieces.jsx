'use client';
import Link from 'next/link';
import ProductCard from '@/components/ProductCard';

export default function TrendingMasterpieces({ products }) {
  if (!products || products.length === 0) return null;

  return (
    <section className="py-[var(--spacing-section)] bg-white reveal">
      <div className="max-w-[1600px] mx-auto px-[var(--spacing-container)]">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-end mb-12 gap-6">
          <div>
            <h2 className="text-[clamp(2.2rem,5vw,3.8rem)] text-[#1F1F1F] font-heading m-0 text-3xl md:text-5xl">Coveted Masterpieces</h2>
            <p className="text-[1rem] text-[#4A4A4A] leading-[1.9] font-light m-0 mt-2">The most coveted pieces of the season.</p>
          </div>
          <Link href="/product-category" className="text-[0.7rem] uppercase tracking-[0.15em] font-semibold border-b border-[#1F1F1F]/30 pb-1 text-[#1F1F1F] hover:border-[#1F1F1F] transition-all">Explore Collections →</Link>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
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
