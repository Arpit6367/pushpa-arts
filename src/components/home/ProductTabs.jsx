'use client';
import { useState } from 'react';
import ProductCard from '@/components/ProductCard';

export default function ProductTabs({ products }) {
  const [activeTab, setActiveTab] = useState('All');
  
  // Categorize products if possible, or just mock categories for demo
  const categories = ['All', 'New Arrivals', 'Best Sellers', 'Handcrafted'];
  
  const filteredProducts = activeTab === 'All' 
    ? products.slice(0, 8) 
    : products.filter(p => p.tags?.includes(activeTab)).slice(0, 8); // Stable filtering

  return (
    <section className="py-[var(--spacing-section)] bg-white reveal">
      <div className="max-w-[1600px] mx-auto px-[var(--spacing-container)]">
        <div className="text-center mb-16">
          <h2 className="text-[clamp(2.5rem,5vw,3.5rem)] font-heading text-[var(--color-text-primary)] mb-8">Our Collections</h2>
          
          <div className="flex justify-center">
            <div className="flex items-center gap-8 md:gap-16 overflow-x-auto no-scrollbar pb-4 -mb-4 px-4 w-full justify-start md:justify-center">
              {categories.map((cat) => (
                <button
                  key={cat}
                  onClick={() => setActiveTab(cat)}
                  className={`group relative text-[0.6rem] md:text-[0.65rem] uppercase tracking-[0.25em] md:tracking-[0.3em] font-bold pb-4 transition-all whitespace-nowrap flex-shrink-0 ${activeTab === cat ? 'text-[var(--color-text-primary)]' : 'text-[var(--color-text-muted)] hover:text-[var(--color-text-primary)]'}`}
                  suppressHydrationWarning
                >
                  {cat}
                  <span className={`absolute bottom-0 left-0 h-[1px] bg-[var(--color-accent)] transition-all duration-500 ${activeTab === cat ? 'w-full' : 'w-0 group-hover:w-full'}`} />
                </button>
              ))}
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
          {filteredProducts.map((p, i) => (
            <div key={p.id} className="reveal stagger-1">
              <ProductCard product={p} />
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
