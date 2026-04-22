'use client';
import { useState, useEffect } from 'react';
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
                        "name": "Pushpa Arts Furniture Collections",
                        "description": "Explore our curated collections of luxury handcrafted Silver, Bone Inlay, Mother of Pearl, and Marble furniture.",
                        "url": "https://pushpaarts.com/product-category"
                    })
                }}
            />
            <div className="bg-[#F5F1EE] pt-32 pb-16 border-b border-[#E5E0DA]">
                <div className="max-w-[1600px] mx-auto px-[clamp(1.2rem,5vw,6rem)]">
                  <h1 className="text-[clamp(2.5rem,5vw,4rem)] font-heading leading-tight text-[#1F1F1F]">
                    Our <span className="text-[#B8860B]">Artisanal Collections</span>
                  </h1>
                  <div className="w-16 h-[2px] bg-[#B8860B] my-8"></div>
                  <div className="flex flex-wrap items-center gap-2 text-[0.8rem] tracking-[0.2em] uppercase text-[#1F1F1F]">
                      <a href="/" className="opacity-60 hover:opacity-100 transition-opacity">Home</a> 
                      <span className="opacity-30">/</span> 
                      <span className="font-semibold text-[#B8860B]">Artisanal Collections</span>
                  </div>
                </div>
            </div>

            <section className="py-[clamp(5rem,10vw,9rem)] min-h-[50vh]">
                <div className="max-w-[1600px] mx-auto px-[clamp(1.2rem,5vw,6rem)]">
                    {loading ? (
                        <div className="flex justify-center py-20">
                          <div className="w-8 h-8 rounded-full border-4 border-[#B8860B]/20 border-t-[#B8860B] animate-spin"></div>
                        </div>
                    ) : categories.length > 0 ? (
                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-10">
                            {categories.map(cat => (
                                <CategoryCard key={cat.id} category={cat} />
                            ))}
                        </div>
                    ) : (
                        <div className="text-center py-24">
                            <p className="text-[0.65rem] tracking-[0.2em] uppercase text-[#D4AF37] mb-2">Explore Collections</p>
                            <h3 className="text-2xl font-heading mb-4 text-[#1F1F1F]">No collections available</h3>
                            <p className="text-[#8C8C8C]">Explore our other curated galleries.</p>
                        </div>
                    )}
                </div>
            </section>
        </>
    );
}
