'use client';
import { useState, useEffect } from 'react';
import Link from 'next/link';
import ProductCard from '@/components/ProductCard';

export default function CollectionPageClient({ 
  category, 
  initialProducts, 
  initialPagination, 
  categories, 
  slugArray,
  currentSlug
}) {
  const [products, setProducts] = useState(initialProducts);
  const [page, setPage] = useState(1);
  const [pagination, setPagination] = useState(initialPagination);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (page === 1) return; // Skip initial load as it's provided by SSR

    setLoading(true);
    fetch(`/api/products?category_slug=${currentSlug}&page=${page}&limit=12`)
      .then(res => res.json())
      .then(data => {
        if (data.products) {
          setProducts(data.products);
          setPagination(data.pagination);
        }
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, [page, currentSlug]);

  const renderBreadcrumbs = () => {
    const breadcrumbs = [];
    let currentPath = '/product-category';

    slugArray.forEach((slug, index) => {
      const cat = categories.find(c => c.slug === slug);
      currentPath += `/${slug}`;
      const name = cat ? cat.name : slug;
      
      breadcrumbs.push(
        <span key={slug} className="flex items-center gap-2">
          <span className="opacity-30">/</span>
          {index === slugArray.length - 1 ? (
            <span className="text-[#B8860B]">{name}</span>
          ) : (
            <Link href={currentPath} className="opacity-60 hover:opacity-100 transition-opacity">{name}</Link>
          )}
        </span>
      );
    });

    return (
      <div className="flex flex-wrap items-center gap-2 text-[0.8rem] tracking-[0.1em] uppercase text-[#1F1F1F]">
        <Link href="/" className="opacity-60 hover:opacity-100 transition-opacity">Home</Link>
        {breadcrumbs}
      </div>
    );
  };

  const subCategories = category ? categories.filter(c => c.parent_id === category.id) : [];

  return (
    <>
      <div className="relative min-h-[350px] md:min-h-[450px] flex items-center bg-[#F5F1EE] overflow-hidden border-b border-[#E5E0DA] reveal">
        {/* Background Image with Overlay */}
        {category?.image && (
          <div className="absolute inset-0 z-0">
            <div 
              className="absolute inset-0 bg-cover bg-center" 
              style={{ backgroundImage: `url(${category.image})` }}
            />
            <div className="absolute inset-0 bg-white/70 backdrop-blur-[2px]" />
          </div>
        )}
        
        <div className="relative z-10 max-w-[1600px] mx-auto px-[clamp(1rem,5vw,6rem)] py-12 md:py-16 w-full">
          <div className="max-w-[800px]">
            <span className="text-[#B8860B] uppercase tracking-[0.2em] text-[0.7rem] font-bold">Collection</span>
            <h1 className="mt-4 text-[clamp(2.5rem,5vw,4rem)] font-heading leading-tight text-[#1F1F1F]">
              {category?.name || "Collection"}
            </h1>
            <div className="w-16 h-[2px] bg-[#B8860B] my-8"></div>
            {renderBreadcrumbs()}
            
            {category?.description && (
              <p className="mt-8 text-[1.1rem] text-[#4A4A4A] leading-[1.8] font-light max-w-[700px]">
                {category.description}
              </p>
            )}
          </div>
        </div>

        {/* Floating Category Image */}
        {category?.image && (
          <div className="hidden lg:block absolute right-0 top-0 bottom-0 w-1/3 z-10">
            <div className="h-full w-full relative overflow-hidden">
              <div 
                className="absolute inset-0 bg-cover bg-center transition-transform duration-[2s] hover:scale-110"
                style={{ backgroundImage: `url(${category.image})` }}
              />
              <div className="absolute inset-0 bg-gradient-to-r from-[#F5F1EE] via-transparent to-transparent" />
            </div>
          </div>
        )}
      </div>

      <section className="py-[clamp(5rem,10vw,9rem)] bg-[#FCFAF8]">
        <div className="max-w-[1600px] mx-auto px-[clamp(1.2rem,5vw,6rem)]">
          {/* Sub-categories section */}
          {subCategories.length > 0 && (
            <div className="mb-32">
              <div className="flex items-baseline gap-6 mb-12">
                <h2 className="text-[2rem] m-0 text-[#1F1F1F] font-heading">Explore <span className="text-[#B8860B]">Sub-Collections</span></h2>
                <div className="flex-1 h-[1px] bg-[#F0EDE6]"></div>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-[repeat(auto-fill,minmax(280px,1fr))] gap-8 md:gap-12">
                {subCategories.map(subCat => (
                  <div key={subCat.id} className="reveal group flex flex-col">
                    <Link href={`/product-category/${subCat.slug_path}`} className="block relative h-[300px] overflow-hidden rounded-[2px] shadow-sm">
                      <div 
                        className="absolute inset-0 bg-cover bg-center transition-transform duration-1000 group-hover:scale-110" 
                        style={{ backgroundImage: subCat.image ? `url(${subCat.image})` : 'none' }}
                      >
                        {!subCat.image && <div className="absolute inset-0 flex items-center justify-center bg-[#F5F1EE] text-[#8C8C8C] uppercase tracking-widest text-xs italic">Studio Aesthetic</div>}
                      </div>
                      <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent opacity-60 transition-opacity duration-500 group-hover:opacity-80" />
                    </Link>
                    <div className="mt-8">
                      <div className="flex items-center gap-4 mb-3">
                        <div className="w-8 h-[1px] bg-[#B8860B]"></div>
                        <p className="text-[0.65rem] tracking-[0.2em] uppercase text-[#B8860B] font-bold">Sub-Collection</p>
                      </div>
                      <h3 className="text-3xl font-heading mb-4 text-[#1F1F1F] group-hover:text-[#B8860B] transition-colors">{subCat.name}</h3>
                      {subCat.description && (
                        <p className="text-[#666] text-[0.95rem] leading-relaxed line-clamp-2 mb-6 font-light">
                          {subCat.description}
                        </p>
                      )}
                      <Link 
                        href={`/product-category/${subCat.slug_path}`} 
                        className="text-[0.7rem] uppercase tracking-[0.2em] font-bold inline-flex items-center gap-2 group/btn"
                      >
                        View Collection 
                        <span className="transition-transform duration-300 group-hover/btn:translate-x-2">→</span>
                      </Link>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          <div className="flex items-baseline gap-6 mb-12">
            <h2 className="text-[2rem] m-0 text-[#1F1F1F] font-heading">Collection <span className="text-[#B8860B]">Masterpieces</span></h2>
            <div className="flex-1 h-[1px] bg-[#F0EDE6]"></div>
          </div>

          {loading ? (
             <div className="flex items-center justify-center min-h-[40vh]">
                <div className="w-8 h-8 rounded-full border-4 border-[#B8860B]/20 border-t-[#B8860B] animate-spin"></div>
             </div>
          ) : products.length > 0 ? (
            <>
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-8">
                {products.map(product => (
                  <ProductCard key={product.id} product={product} />
                ))}
              </div>

              {pagination && pagination.pages > 1 && (
                <div className="flex gap-2 justify-center mt-24">
                  {Array.from({ length: pagination.pages }, (_, i) => i + 1).map(p => (
                    <button
                      key={p}
                      className={`w-12 h-12 flex items-center justify-center border font-medium cursor-pointer transition-all ${p === page ? 'bg-[#1F1F1F] text-white border-[#1F1F1F]' : 'bg-transparent text-[#1F1F1F] border-[#E5E0DA] hover:border-[#1F1F1F]'}`}
                      onClick={() => setPage(p)}
                    >
                      {p < 10 ? `0${p}` : p}
                    </button>
                  ))}
                </div>
              )}
            </>
          ) : (
            <div className="py-40 flex flex-col items-center justify-center text-center">
              <h3 className="italic text-[#8C8C8C] text-2xl font-light">No masterpieces in this collection yet.</h3>
              <p className="mt-4 text-[#4A4A4A]">Our artisans are currently curating new pieces for this collection.</p>
              <Link href="/" className="mt-12 inline-block px-10 py-4 bg-[#1F1F1F] text-white text-[0.7rem] uppercase tracking-[0.2em] font-semibold transition-all hover:bg-[#B8860B]">
                Return to Collections
              </Link>
            </div>
          )}
        </div>
      </section>
    </>
  );
}
