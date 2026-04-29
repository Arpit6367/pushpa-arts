'use client';
import { useState, useEffect } from 'react';
import Link from 'next/link';
import ProductCard from '@/components/ProductCard';
import Image from 'next/image';
import { ChevronLeft, ChevronRight } from 'lucide-react';

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
    const isInitialRender = page === 1 && products === initialProducts;
    if (isInitialRender) return;

    setLoading(true);
    fetch(`/api/products?category_slug=${currentSlug}&page=${page}&limit=12`)
      .then(res => res.json())
      .then(data => {
        if (data.products) {
          setProducts(data.products);
          setPagination(data.pagination);
          window.scrollTo({ top: 300, behavior: 'smooth' });
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
        <span key={slug} className="flex items-center gap-3">
          <span className="w-6 h-[1px] bg-black/10"></span>
          {index === slugArray.length - 1 ? (
            <span className="font-bold text-[var(--color-accent)]">{name}</span>
          ) : (
            <Link href={currentPath} className="hover:text-[var(--color-accent)] transition-colors">{name}</Link>
          )}
        </span>
      );
    });

    return (
      <div className="flex flex-wrap items-center gap-4 text-[0.65rem] tracking-[0.3em] uppercase text-black/40 stagger-4">
        <Link href="/" className="hover:text-[var(--color-accent)] transition-colors">Home</Link>
        <Link href="/product-category" className="flex items-center gap-3 hover:text-[var(--color-accent)] transition-colors">
          <span className="w-6 h-[1px] bg-black/10"></span>
          Collections
        </Link>
        {breadcrumbs}
      </div>
    );
  };

  const subCategories = category ? categories.filter(c => c.parent_id === category.id) : [];

  return (
    <>
      <div className="relative pt-32 md:pt-48 pb-16 md:pb-24 bg-[#F9F7F5] overflow-hidden border-b border-black/[0.03]">
        {/* Decorative Background Text */}
        <div className="absolute top-1/2 right-0 -translate-y-1/2 text-[10rem] md:text-[18rem] font-heading text-black/[0.02] select-none pointer-events-none hidden lg:block uppercase tracking-widest translate-x-1/3">
          {category?.name?.split(' ')[0]}
        </div>

        <div className="relative z-10 max-w-[1600px] mx-auto px-[var(--spacing-container)] w-full">
          <div className="max-w-[850px] reveal">
            <span className="text-[var(--color-accent)] uppercase tracking-[0.4em] font-bold text-[0.55rem] mb-4 block stagger-1">Artisan Collection</span>
            <h1 className="text-[clamp(2.2rem,6vw,3.5rem)] font-heading leading-[1.1] text-[var(--color-text-primary)] stagger-2">
              {category?.name || "Collection"}
            </h1>
            <div className="w-20 h-[1px] bg-[var(--color-accent)]/30 my-8 stagger-3"></div>

            <div className="reveal stagger-4">
              {renderBreadcrumbs()}
            </div>

            {category?.description && (
              <p className="mt-10 text-[1rem] text-[var(--color-text-secondary)] leading-[1.8] font-light max-w-[700px] reveal stagger-5">
                {category.description}
              </p>
            )}
          </div>
        </div>

        {/* Immersive Category Side Image */}
        {category?.image && (
          <div className="hidden lg:block absolute right-0 top-0 bottom-0 w-1/3 z-0">
            <div className="h-full w-full relative overflow-hidden group">
              <div
                className="absolute inset-0 bg-cover bg-center transition-transform duration-[3s] cubic-bezier(0.16, 1, 0.3, 1) group-hover:scale-110"
                style={{ backgroundImage: `url(${category.image})` }}
              />
              <div className="absolute inset-0 bg-gradient-to-r from-[#F9F7F5] via-[#F9F7F5]/40 to-transparent" />
            </div>
          </div>
        )}
      </div>

      <section className="py-[clamp(5rem,10vw,9rem)] bg-white">
        <div className="max-w-[1600px] mx-auto px-[var(--spacing-container)]">
          {/* Sub-categories section */}
          {subCategories.length > 0 && (
            <div className="mb-32">
              <div className="flex flex-col md:flex-row justify-between items-end mb-16 gap-8 reveal">
                <div className="max-w-[600px]">
                  <p className="text-[var(--color-accent)] uppercase tracking-[0.4em] font-bold text-[0.55rem] mb-4 block stagger-1">Curated Series</p>
                  <h2 className="text-[2.5rem] md:text-[3.5rem] m-0 text-[var(--color-text-primary)] font-heading leading-tight stagger-2">
                    Explore <span className="italic text-[var(--color-accent)]">Sub-Collections</span>
                  </h2>
                </div>
                <div className="flex-1 h-[1px] bg-black/[0.05] hidden md:block mb-4"></div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-10 md:gap-14">
                {subCategories.map((subCat, i) => (
                  <div key={subCat.id} className={`reveal group flex flex-col stagger-${(i % 3) + 1}`}>
                    <Link href={`/product-category/${subCat.slug_path}`} className="block relative aspect-[1.2] overflow-hidden rounded-[2px] shadow-2xl shadow-black/[0.03]">
                      <div
                        className="absolute inset-0 bg-cover bg-center transition-transform duration-[2s] cubic-bezier(0.16, 1, 0.3, 1) group-hover:scale-110"
                        style={{ backgroundImage: subCat.image ? `url(${subCat.image})` : 'none' }}
                      >
                        {!subCat.image && <div className="absolute inset-0 flex items-center justify-center bg-[#F5F1EE] text-[#8C8C8C] uppercase tracking-[0.4em] text-[0.6rem] italic font-bold">Studio Aesthetic</div>}
                      </div>
                      <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent opacity-60 transition-opacity duration-700 group-hover:opacity-100" />

                      <div className="absolute inset-0 flex flex-col justify-end p-8 text-white">
                        <span className="text-[0.55rem] uppercase tracking-[0.4em] font-bold text-[var(--color-accent)] mb-2 translate-y-4 opacity-0 transition-all duration-700 group-hover:translate-y-0 group-hover:opacity-100">Browse Sub-Series</span>
                        <h3 className="text-2xl md:text-3xl font-heading leading-tight">{subCat.name}</h3>
                      </div>
                    </Link>

                    <div className="mt-8 px-2">
                      {subCat.description && (
                        <p className="text-[var(--color-text-secondary)] text-[0.95rem] leading-relaxed line-clamp-2 mb-8 font-light">
                          {subCat.description}
                        </p>
                      )}
                      <Link
                        href={`/product-category/${subCat.slug_path}`}
                        className="group/btn flex items-center gap-4 text-[0.65rem] uppercase tracking-[0.3em] font-bold text-[var(--color-text-primary)]"
                      >
                        <span className="border-b border-black/20 pb-1 group-hover:border-black transition-all">Enter Collection</span>
                        <span className="w-10 h-[1px] bg-black/10 group-hover:w-14 group-hover:bg-black transition-all duration-700"></span>
                      </Link>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          <div className="flex flex-col md:flex-row justify-between items-end mb-16 gap-8 reveal">
            <div className="max-w-[600px]">
              <p className="text-[var(--color-accent)] uppercase tracking-[0.4em] font-bold text-[0.55rem] mb-4 block stagger-1">Signature Works</p>
              <h2 className="text-[2.5rem] md:text-[3.5rem] m-0 text-[var(--color-text-primary)] font-heading leading-tight stagger-2">
                Collection <span className="italic text-[var(--color-accent)]">Masterpieces</span>
              </h2>
            </div>
            <div className="flex-1 h-[1px] bg-black/[0.05] hidden md:block mb-4"></div>
          </div>

          {loading ? (
            <div className="flex flex-col items-center justify-center py-40 gap-6 reveal">
              <div className="w-12 h-12 rounded-full border-2 border-[var(--color-accent)]/10 border-t-[var(--color-accent)] animate-spin"></div>
              <span className="text-[0.6rem] uppercase tracking-[0.4em] font-bold text-black/20">Curating Gallery...</span>
            </div>
          ) : products.length > 0 ? (
            <>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8 md:gap-10">
                {products.map((product, i) => (
                  <div key={product.id} className={`reveal stagger-${(i % 4) + 1}`}>
                    <ProductCard product={product} />
                  </div>
                ))}
              </div>

              {pagination && pagination.pages > 1 && (
                <div className="flex items-center justify-center gap-2 mt-32 reveal">
                  <button
                    onClick={() => setPage(p => Math.max(1, p - 1))}
                    disabled={page === 1}
                    className="w-12 h-12 flex items-center justify-center border border-black/5 hover:border-black/20 disabled:opacity-10 transition-all mr-4"
                  >
                    <ChevronLeft className="w-4 h-4" />
                  </button>

                  {(() => {
                    const totalPages = pagination.pages;
                    let startPage = Math.max(1, page - 2);
                    let endPage = Math.min(totalPages, startPage + 4);
                    if (endPage - startPage < 4) startPage = Math.max(1, endPage - 4);

                    const pageNumbers = [];
                    if (startPage > 1) {
                      pageNumbers.push(
                        <button
                          key={1}
                          onClick={() => setPage(1)}
                          className="w-12 h-12 text-[0.7rem] font-bold hover:bg-black/5 transition-all"
                          suppressHydrationWarning
                        >
                          01
                        </button>
                      );
                      if (startPage > 2) pageNumbers.push(<span key="sep1" className="px-2 text-black/20">...</span>);
                    }

                    for (let p = startPage; p <= endPage; p++) {
                      pageNumbers.push(
                        <button
                          key={p}
                          onClick={() => setPage(p)}
                          className={`w-12 h-12 flex items-center justify-center border text-[0.7rem] font-bold tracking-[0.2em] transition-all duration-500 ${p === page ? 'bg-black text-white border-black shadow-2xl' : 'bg-transparent text-black/40 border-black/5 hover:border-black/20 hover:text-black'}`}
                          suppressHydrationWarning
                        >
                          {p < 10 ? `0${p}` : p}
                        </button>
                      );
                    }

                    if (endPage < totalPages) {
                      if (endPage < totalPages - 1) pageNumbers.push(<span key="sep2" className="px-2 text-black/20">...</span>);
                      pageNumbers.push(
                        <button
                          key={totalPages}
                          onClick={() => setPage(totalPages)}
                          className="w-12 h-12 text-[0.7rem] font-bold hover:bg-black/5 transition-all"
                          suppressHydrationWarning
                        >
                          {totalPages < 10 ? `0${totalPages}` : totalPages}
                        </button>
                      );
                    }
                    return pageNumbers;
                  })()}

                  <button
                    onClick={() => setPage(p => Math.min(pagination.pages, p + 1))}
                    disabled={page === pagination.pages}
                    className="w-12 h-12 flex items-center justify-center border border-black/5 hover:border-black/20 disabled:opacity-10 transition-all ml-4"
                  >
                    <ChevronRight className="w-4 h-4" />
                  </button>
                </div>
              )}
            </>
          ) : (
            <div className="py-40 flex flex-col items-center justify-center text-center reveal">
              <p className="text-[var(--color-accent)] tracking-[0.4em] uppercase text-[0.6rem] font-bold mb-6">Gallery Notice</p>
              <h3 className="text-3xl font-heading mb-8 text-[var(--color-text-primary)]">No masterpieces found</h3>
              <p className="text-[var(--color-text-secondary)] font-light mb-12 max-w-[450px]">Our artisans are currently curating new pieces for this collection. Please check back soon.</p>
              <Link href="/product-category" className="px-10 py-4 bg-black text-white text-[0.65rem] uppercase tracking-[0.3em] font-bold hover:bg-[var(--color-accent)] transition-all">
                Explore Other Collections
              </Link>
            </div>
          )}
          {/* Immersive Material Spotlight Section */}
          {category && (
            <div className="mt-40 pt-40 border-t border-black/[0.05]">
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-20 items-center">
                <div className="reveal">
                  <p className="text-[var(--color-accent)] uppercase tracking-[0.5em] font-bold text-[0.6rem] mb-6">The Materiality</p>
                  <h2 className="text-4xl md:text-6xl font-heading text-[#1a1a1a] mb-10 leading-tight">
                    Ethically Sourced. <br /><span className="italic">Expertly</span> Handled.
                  </h2>
                  <div className="space-y-10">
                    <div className="flex gap-8">
                      <div className="w-12 h-12 flex-shrink-0 bg-[#F2F0ED] flex items-center justify-center text-[var(--color-accent)]">
                        <span className="font-heading text-xl">01</span>
                      </div>
                      <div>
                        <h4 className="text-lg font-heading mb-3">Authentication</h4>
                        <p className="text-black/50 text-sm font-light leading-relaxed">Every piece from our {category.name} collection comes with a certificate of authenticity, ensuring the purity of materials and the origin of craft.</p>
                      </div>
                    </div>
                    <div className="flex gap-8">
                      <div className="w-12 h-12 flex-shrink-0 bg-[#F2F0ED] flex items-center justify-center text-[var(--color-accent)]">
                        <span className="font-heading text-xl">02</span>
                      </div>
                      <div>
                        <h4 className="text-lg font-heading mb-3">Seasoned Foundation</h4>
                        <p className="text-black/50 text-sm font-light leading-relaxed">We use only AAA-grade seasoned teak and rosewood, ensuring that your furniture remains stable and beautiful for decades.</p>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="relative aspect-square lg:aspect-auto lg:h-[600px] reveal stagger-2">
                  <Image
                    src={category.image || "/images/collections-bg.png"}
                    alt="Process Illustration"
                    fill
                    className="object-cover rounded-sm grayscale-[30%] hover:grayscale-0 transition-all duration-1000"
                  />
                  <div className="absolute -bottom-10 -left-10 bg-white p-10 shadow-2xl hidden md:block max-w-[300px]">
                    <p className="text-[var(--color-accent)] font-heading text-4xl mb-4 italic">70%</p>
                    <p className="text-[0.6rem] uppercase tracking-widest font-bold text-black/40 leading-relaxed">
                      Of this collection can be fully customized to your dimensions and preferences.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Bespoke Inquiry Banner */}
          <div className="mt-60 relative py-32 md:py-48 px-12 md:px-24 bg-[#1a1a1a] text-center overflow-hidden rounded-sm">
            <div className="absolute inset-0 opacity-40 pointer-events-none">
              <div className="absolute top-0 left-0 w-full h-full bg-[url('/images/hero-refined-3.png')] bg-cover bg-fixed" />
            </div>
            <div className="relative z-10 max-w-[800px] mx-auto">
              <h2 className="text-4xl md:text-7xl font-heading text-white mb-10 italic">Commission a Masterpiece</h2>
              <p className="text-white/50 text-lg md:text-xl font-light mb-16 leading-relaxed">
                Have a specific vision for your {category?.name || "furniture"}? Our design studio specializes in bringing bespoke concepts to life.
              </p>
              <Link
                href="/contact"
                className="inline-block px-14 py-5 bg-[var(--color-accent)] text-white text-[0.7rem] uppercase tracking-[0.4em] font-bold hover:bg-white hover:text-black transition-all shadow-2xl"
              >
                Start Your Design Consultation
              </Link>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
