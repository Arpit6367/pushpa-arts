'use client';
import { useState, useMemo, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';

export default function CategorySubcategoryTabs({ allCategories }) {
  // Filter for parent categories that have children
  const parentCategoriesWithChildren = useMemo(() => {
    if (!allCategories) return [];
    return allCategories.filter(parent =>
      !parent.parent_id &&
      allCategories.some(child => child.parent_id === parent.id)
    );
  }, [allCategories]);

  const [activeTabId, setActiveTabId] = useState(null);

  // Set initial active tab
  useEffect(() => {
    if (parentCategoriesWithChildren.length > 0 && !activeTabId) {
      setActiveTabId(parentCategoriesWithChildren[0].id);
    }
  }, [parentCategoriesWithChildren, activeTabId]);

  const activeSubcategories = useMemo(() => {
    if (!activeTabId) return [];
    return allCategories.filter(cat => cat.parent_id === activeTabId).slice(0, 10);
  }, [allCategories, activeTabId]);

  const activeParent = useMemo(() => {
    return parentCategoriesWithChildren.find(p => p.id === activeTabId);
  }, [parentCategoriesWithChildren, activeTabId]);

  if (parentCategoriesWithChildren.length === 0) return null;

  return (
    <section className="py-[var(--spacing-section)] bg-[#FAFAF8] overflow-hidden">
      <div className="max-w-[1600px] mx-auto px-[var(--spacing-container)]">
        {/* Section Header */}
        <div className="text-center mb-16 reveal">
          <p className="text-[var(--color-accent)] uppercase tracking-[0.4em] font-bold text-[0.55rem] mb-4 block stagger-1">Signature Selection</p>
          <h2 className="text-[clamp(2.2rem,5vw,3.2rem)] font-heading text-[var(--color-text-primary)] mb-10 stagger-2">
            Explore by <span className="italic text-[var(--color-accent)]">Lifestyle</span>
          </h2>

          {/* Tabs */}
          <div className="relative reveal stagger-3 mt-12">
            <div className="flex items-center justify-start lg:justify-center gap-6 md:gap-10 overflow-x-auto no-scrollbar pb-4 border-b border-black/[0.06] px-4">
              {parentCategoriesWithChildren.map((cat) => (
                <button
                  key={cat.id}
                  onClick={(e) => {
                    setActiveTabId(cat.id);
                    e.currentTarget.scrollIntoView({ behavior: 'smooth', inline: 'center', block: 'nearest' });
                  }}
                  className={`group relative text-[0.6rem] md:text-[0.65rem] uppercase tracking-[0.25em] font-bold pb-4 transition-all whitespace-nowrap flex-shrink-0 cursor-pointer ${activeTabId === cat.id ? 'text-[var(--color-text-primary)]' : 'text-black/30 hover:text-black/60'}`}
                >
                  <span className="italic mr-1">Buy</span>
                  <span>{cat.name.replace(/^Buy\s+/i, '')}</span>
                  <span className={`absolute bottom-[-1px] left-1/2 -translate-x-1/2 h-[2.5px] bg-[var(--color-accent)] transition-all duration-500 ease-out ${activeTabId === cat.id ? 'w-full' : 'w-0 group-hover:w-8'}`} />
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Subcategories Grid */}
        <div key={activeTabId} className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4 sm:gap-6 md:gap-8 lg:gap-10">
          {activeSubcategories.length > 0 ? (
            activeSubcategories.map((sub, i) => (
              <Link
                key={sub.id}
                href={`/product-category/${sub.slug_path}`}
                className="group block opacity-0 animate-fade-in-up"
                style={{ animationDelay: `${i * 80}ms`, animationFillMode: 'forwards' }}
              >
                <div className="relative aspect-[0.85] overflow-hidden mb-6 bg-white border border-black/5 rounded-sm">
                  <Image
                    src={sub.image || `/images/hero-${((i % 3) + 1)}.png`}
                    alt={sub.name}
                    fill
                    className="object-cover transition-all duration-[2s] cubic-bezier(0.16, 1, 0.3, 1) group-hover:scale-110"
                    sizes="(max-width: 768px) 50vw, (max-width: 1024px) 33vw, 25vw"
                  />
                  <div className="absolute inset-0 bg-black/0 group-hover:bg-black/[0.02] transition-colors duration-700" />

                  {/* Hover Accent Line */}
                  <div className="absolute bottom-0 left-0 w-0 h-[2px] bg-[var(--color-accent)] transition-all duration-700 group-hover:w-full" />
                </div>
                <div className="text-center">
                  <h3 className="text-lg font-heading text-[var(--color-text-primary)] mb-1 group-hover:text-[var(--color-accent)] transition-colors duration-500">{sub.name}</h3>
                  <div className="flex items-center justify-center gap-2 opacity-0 group-hover:opacity-100 transition-all duration-700 transform translate-y-2 group-hover:translate-y-0">
                    <span className="text-[0.55rem] uppercase tracking-[0.2em] font-bold text-[var(--color-text-muted)]">View Series</span>
                    <div className="w-4 h-[1px] bg-[var(--color-accent)]/30" />
                  </div>
                </div>
              </Link>
            ))
          ) : (
            <div className="col-span-full text-center py-20">
              <p className="text-black/20 text-xs uppercase tracking-widest font-medium italic">Collections launching soon</p>
            </div>
          )}
        </div>

        {/* CTA */}
        {activeParent && (
          <div className="mt-16 md:mt-20 text-center reveal">
            <Link
              href={`/product-category/${activeParent.slug_path}`}
              className="inline-block px-12 py-4 border border-black/[0.08] text-[0.6rem] uppercase tracking-[0.4em] font-bold text-[var(--color-text-primary)] hover:bg-[var(--color-secondary)] hover:text-white hover:border-[var(--color-secondary)] transition-all duration-700 rounded-sm"
            >
              Explore all {activeParent.name}
            </Link>
          </div>
        )}
      </div>
    </section>
  );
}
