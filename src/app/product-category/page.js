'use client';
import { useState, useEffect } from 'react';
import Image from 'next/image';
import CategoryCard from '@/components/CategoryCard';

export default function CategoriesPage() {
    const [categories, setCategories] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetch('/api/categories?active_only=true')
            .then(res => res.json())
            .then(data => {
                if (Array.isArray(data)) {
                    setCategories(data.filter(c => !c.parent_id));
                }
                setLoading(false);
            })
            .catch(() => setLoading(false));
    }, []);

    return (
        <>
            <script
                type="application/ld+json"
                dangerouslySetInnerHTML={{
                    __html: JSON.stringify({
                        "@context": "https://schema.org",
                        "@type": "CollectionPage",
                        "name": "Pushpa Exports Furniture Collections",
                        "description": "Explore our curated collections of luxury handcrafted Silver, Bone Inlay, Mother of Pearl, and Marble furniture.",
                        "url": "https://pushpaexports.com/product-category"
                    })
                }}
            />
            <div className="relative pt-32 md:pt-48 overflow-hidden border-b border-black/[0.03] bg-[#F9F7F5]">
                {/* Luxury Background Imagery */}
                <div className="absolute inset-0 z-0">
                    <Image
                        src="/images/collections-bg.png"
                        alt="Pushpa Exports Luxury Collections"
                        fill
                        className="object-cover object-center"
                        priority
                    />
                    <div className="absolute inset-0 bg-gradient-to-b from-[#F9F7F5]/50 via-[#F9F7F5] to-[#F9F7F5]"></div>
                    <div className="absolute inset-0 bg-gradient-to-r from-[#F9F7F5] via-[#F9F7F5]/40 to-transparent md:block hidden"></div>
                </div>

                <div className="max-w-[1600px] mx-auto px-[var(--spacing-container)] relative z-10">
                    <div className="max-w-[800px] reveal">
                        <p className="text-[var(--color-accent)] uppercase tracking-[0.4em] font-bold text-[0.55rem] mb-4 block stagger-1">Signature Series</p>
                        <h1 className="text-[clamp(2.5rem,7vw,4.5rem)] font-heading leading-[1.05] text-[var(--color-text-primary)] stagger-2">
                            Our <span className="italic text-[var(--color-accent)]">Artisanal</span> <br />Collections
                        </h1>
                        <div className="w-24 h-[1px] bg-[var(--color-accent)]/40 my-10 stagger-3"></div>
                        <div className="flex flex-wrap items-center gap-4 text-[0.6rem] tracking-[0.25em] uppercase text-black/40 stagger-4">
                            <a href="/" className="hover:text-[var(--color-accent)] transition-colors">Home</a>
                            <span className="w-6 h-[1px] bg-black/10"></span>
                            <span className="font-bold text-black/80">Artisanal Collections</span>
                        </div>
                    </div>
                </div>
            </div>

            <section className="py-[clamp(5rem,10vw,9rem)] min-h-[60vh] bg-white">
                <div className="max-w-[1600px] mx-auto px-[var(--spacing-container)]">
                    {loading ? (
                        <div className="flex flex-col items-center justify-center py-32 gap-6 reveal">
                            <div className="w-12 h-12 rounded-full border-2 border-[var(--color-accent)]/10 border-t-[var(--color-accent)] animate-spin"></div>
                            <span className="text-[0.6rem] uppercase tracking-[0.4em] font-bold text-black/20">Curating Gallery...</span>
                        </div>
                    ) : categories.length > 0 ? (
                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8 md:gap-12">
                            {categories.map((cat, i) => (
                                <div key={cat.id} className={`reveal stagger-${(i % 3) + 1}`}>
                                    <CategoryCard category={cat} />
                                </div>
                            ))}
                        </div>
                    ) : (
                        <div className="text-center py-32 reveal">
                            <p className="text-[var(--color-accent)] tracking-[0.4em] uppercase text-[0.6rem] font-bold mb-6">Gallery Unavailable</p>
                            <h3 className="text-3xl font-heading mb-8 text-[var(--color-text-primary)]">No collections found</h3>
                            <p className="text-[var(--color-text-secondary)] font-light mb-12">Please check back soon for our newest arrivals.</p>
                            <a href="/" className="px-10 py-4 bg-[var(--color-accent)] text-white text-[0.65rem] uppercase tracking-[0.3em] font-bold hover:bg-black transition-all">Return to Home</a>
                        </div>
                    )}
                </div>
            </section>
        </>
    );
}
