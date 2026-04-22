'use client';
import Image from 'next/image';
import Link from 'next/link';
import { Eye } from 'lucide-react';
import { useQuickView } from '@/context/QuickViewContext';

export default function ProductCard({ product }) {
  const { openQuickView } = useQuickView();
  const imageUrl = product.primary_image || product.first_image;
  // Ensure we use the correct category slug path for consistent routing
  const catSlug = product.category_slug_path || product.categories?.[0]?.slug_path || 'uncategorized';

  return (
    <div className="group relative border border-black/5 hover:border-black/10 hover:shadow-2xl hover:shadow-[#1F1F1F]/5 overflow-hidden rounded-[2px]">
      <Link
        href={`/shop/${catSlug}/${product.slug}`}
        className="block bg-white transition-all duration-500"
        id={`product-${product.id}`}
      >
        <div className="relative aspect-square bg-[#fdfdfd] overflow-hidden">
          {imageUrl ? (
            <Image
              src={imageUrl}
              alt={product.name}
              fill
              className="w-full h-full object-contain p-6 md:p-10 transition-transform duration-[1.5s] ease-out group-hover:scale-110"
              sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
            />
          ) : (
            <div className="flex items-center justify-center font-heading italic opacity-40 text-xs text-center p-8 bg-[#f5f5f7] w-full h-full">Studio Imagery</div>
          )}
        </div>
      </Link>

      {/* Modern Hover Overlay Actions */}
      <div className="absolute inset-0 z-10 bg-[var(--color-secondary)]/10 backdrop-blur-[1px] flex flex-col items-center justify-center gap-3 sm:gap-4 opacity-0 transition-all duration-500 group-hover:opacity-100 group-hover:backdrop-blur-[2px] pointer-events-none group-hover:pointer-events-auto">
        <Link 
          href={`/shop/${catSlug}/${product.slug}`}
          className="bg-white text-[var(--color-text-primary)] text-[0.55rem] sm:text-[0.6rem] uppercase tracking-[0.2em] sm:tracking-[0.3em] font-bold py-3 sm:py-4 px-6 sm:px-10 shadow-xl translate-y-4 transition-all duration-500 group-hover:translate-y-0 hover:bg-[var(--color-accent)] hover:text-white"
        >
          View Detail
        </Link>
        <button 
          onClick={(e) => {
            e.preventDefault();
            e.stopPropagation();
            openQuickView(product);
          }}
          className="flex items-center gap-2 bg-[var(--color-secondary)] text-white text-[0.55rem] sm:text-[0.6rem] uppercase tracking-[0.2em] sm:tracking-[0.3em] font-bold py-3 sm:py-4 px-6 sm:px-10 shadow-xl translate-y-4 transition-all duration-500 group-hover:translate-y-0 delay-75 hover:bg-[var(--color-accent)]"
          suppressHydrationWarning
        >
          <Eye className="w-4 h-4" /> Quick View
        </button>
      </div>

      <div className="text-center pt-8 pb-10 px-6">
        {product.category_name && (
          <span className="text-[0.55rem] uppercase tracking-[0.25em] text-[var(--color-accent)] font-bold mb-3 block opacity-80 group-hover:opacity-100 transition-opacity">
            {product.category_name}
          </span>
        )}
        <h3 className="font-heading text-xl text-[var(--color-text-primary)] leading-tight px-2">{product.name}</h3>
        <div className="mt-4 w-12 h-[1px] bg-[var(--color-accent)]/30 mx-auto group-hover:w-20 transition-all duration-500"></div>
      </div>
    </div>
  );
}
