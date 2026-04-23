'use client';
import { useState } from 'react';
import Link from 'next/link';
import ProductCard from '@/components/ProductCard';

export default function ProductTabs({ products, newArrivals = [], bestSellers = [], handcrafted = [] }) {
  const [activeTab, setActiveTab] = useState('All');
  
  const tabs = [
    { key: 'All', label: 'All' },
    { key: 'New Arrivals', label: 'New Arrivals' },
    { key: 'Best Sellers', label: 'Best Sellers' },
    { key: 'Handcrafted', label: 'Handcrafted' },
  ];

  const getActiveProducts = () => {
    switch (activeTab) {
      case 'New Arrivals':  return newArrivals;
      case 'Best Sellers':  return bestSellers;
      case 'Handcrafted':   return handcrafted;
      default:              return products.slice(0, 8);
    }
  };

  const activeProducts = getActiveProducts();

  return (
    <section className="py-[var(--spacing-section)] bg-[#FAFAF8] overflow-hidden">
      <div className="max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="text-center mb-12 md:mb-14 reveal">
          <p className="text-[var(--color-accent)] uppercase tracking-[0.4em] font-bold text-[0.55rem] mb-4 block stagger-1">Artisan Selection</p>
          <h2 className="text-[clamp(1.8rem,4vw,2.8rem)] font-heading text-[var(--color-text-primary)] mb-8 stagger-2">Our Signature <span className="italic text-[var(--color-accent)]">Masterpieces</span></h2>
          
          {/* Tabs */}
          <div className="flex justify-center reveal stagger-3">
            <div className="inline-flex items-center gap-6 md:gap-10 overflow-x-auto no-scrollbar pb-4 -mb-4 px-2 border-b border-black/[0.06]">
              {tabs.map(({ key, label }) => (
                <button
                  key={key}
                  onClick={() => setActiveTab(key)}
                  className={`group relative text-[0.6rem] md:text-[0.65rem] uppercase tracking-[0.2em] font-bold pb-4 transition-all whitespace-nowrap flex-shrink-0 cursor-pointer ${activeTab === key ? 'text-[var(--color-text-primary)]' : 'text-black/30 hover:text-black/60'}`}
                  suppressHydrationWarning
                >
                  {label}
                  <span className={`absolute bottom-[-1px] left-1/2 -translate-x-1/2 h-[2px] bg-[var(--color-accent)] transition-all duration-500 ease-out ${activeTab === key ? 'w-full' : 'w-0 group-hover:w-6'}`} />
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Product Grid — key forces React to re-mount on tab change */}
        <div key={activeTab} className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4 md:gap-5">
          {activeProducts.length > 0 ? (
            activeProducts.map((p, i) => (
              <div
                key={p.id}
                className="opacity-0 animate-fade-in-up"
                style={{ animationDelay: `${i * 80}ms`, animationFillMode: 'forwards' }}
              >
                <ProductCard product={p} />
              </div>
            ))
          ) : (
            <div className="col-span-full text-center py-16">
              <p className="text-black/30 text-sm uppercase tracking-widest font-medium">More pieces arriving soon</p>
            </div>
          )}
        </div>
        
        {/* CTA */}
        <div className="mt-14 md:mt-16 text-center reveal">
          <Link 
            href="/product-category"
            className="inline-block px-10 py-4 border border-black/10 text-[0.6rem] uppercase tracking-[0.35em] font-bold text-[var(--color-text-primary)] hover:bg-[var(--color-secondary)] hover:text-white hover:border-[var(--color-secondary)] transition-all duration-500 rounded-sm"
          >
            View All Collections
          </Link>
        </div>
      </div>
    </section>
  );
}
