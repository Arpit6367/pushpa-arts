'use client';
import { useState } from 'react';
import Link from 'next/link';
import ProductCard from '@/components/ProductCard';

export default function ProductTabs({ products }) {
  const [activeTab, setActiveTab] = useState('All');
  
  const categories = ['All', 'New Arrivals', 'Best Sellers', 'Handcrafted'];
  
  const filteredProducts = activeTab === 'All' 
    ? products.slice(0, 8) 
    : products.filter(p => p.tags?.includes(activeTab)).slice(0, 8);

  return (
    <section className="py-[var(--spacing-section)] bg-white overflow-hidden">
      <div className="max-w-[1600px] mx-auto px-[var(--spacing-container)]">
        <div className="text-center mb-16 reveal">
          <p className="text-[var(--color-accent)] uppercase tracking-[0.4em] font-bold text-[0.55rem] mb-4 block stagger-1">Artisan Selection</p>
          <h2 className="text-[clamp(2rem,4.5vw,3.2rem)] font-heading text-[var(--color-text-primary)] mb-10 stagger-2">Our Signature <span className="italic text-[var(--color-accent)]">Masterpieces</span></h2>
          
          <div className="flex justify-center reveal stagger-3">
            <div className="flex items-center gap-8 md:gap-12 overflow-x-auto no-scrollbar pb-5 -mb-5 px-4 w-full justify-start md:justify-center border-b border-black/[0.03]">
              {categories.map((cat) => (
                <button
                  key={cat}
                  onClick={() => setActiveTab(cat)}
                  className={`group relative text-[0.55rem] md:text-[0.6rem] uppercase tracking-[0.25em] font-bold pb-5 transition-all whitespace-nowrap flex-shrink-0 ${activeTab === cat ? 'text-[var(--color-text-primary)]' : 'text-black/30 hover:text-black/60'}`}
                  suppressHydrationWarning
                >
                  {cat}
                  <span className={`absolute bottom-[-1px] left-1/2 -translate-x-1/2 h-[1.5px] bg-[var(--color-accent)] transition-all duration-500 ease-out ${activeTab === cat ? 'w-full' : 'w-0 group-hover:w-8'}`} />
                </button>
              ))}
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 md:gap-10">
          {filteredProducts.map((p, i) => (
            <div key={p.id} className={`reveal stagger-${(i % 4) + 1}`}>
              <ProductCard product={p} />
            </div>
          ))}
        </div>
        
        <div className="mt-20 text-center reveal">
          <Link 
            href="/product-category"
            className="inline-block px-12 py-5 border border-black/10 text-[0.65rem] uppercase tracking-[0.4em] font-bold text-[var(--color-text-primary)] hover:bg-black hover:text-white transition-all duration-500 shadow-sm"
          >
            View All Collections
          </Link>
        </div>
      </div>
    </section>
  );
}
