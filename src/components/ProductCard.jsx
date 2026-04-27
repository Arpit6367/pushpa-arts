'use client';
import Image from 'next/image';
import Link from 'next/link';
import { Eye, ShoppingBag } from 'lucide-react';
import { useQuickView } from '@/context/QuickViewContext';

export default function ProductCard({ product }) {
  const { openQuickView } = useQuickView();
  const imageUrl = product.primary_image || product.first_image;
  const catSlug = product.category_slug_path || product.categories?.[0]?.slug_path || 'collection';

  return (
    <div className="group relative bg-white border border-black/[0.04] rounded-md transition-all duration-700 hover:shadow-[0_12px_40px_-12px_rgba(0,0,0,0.12)] hover:border-black/[0.08] overflow-hidden">
      <Link
        href={`/shop/${catSlug}/${product.slug}`}
        className="block relative aspect-[0.85] overflow-hidden bg-[#f8f8f6]"
        id={`product-${product.id}`}
      >
        {imageUrl ? (
          <Image
            src={imageUrl}
            alt={product.name}
            fill
            className="object-contain p-4 sm:p-6 transition-transform duration-[1.5s] group-hover:scale-105"
            style={{ transitionTimingFunction: 'cubic-bezier(0.16, 1, 0.3, 1)' }}
            sizes="(max-width: 640px) 50vw, (max-width: 1024px) 50vw, 25vw"
          />
        ) : (
          <div className="flex items-center justify-center font-heading italic opacity-30 text-[0.55rem] uppercase tracking-widest text-center p-4 bg-[#f5f5f3] w-full h-full">Studio Imagery</div>
        )}

        {/* Quick View overlay */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/10 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 flex items-end justify-center pb-5">
          <button
            onClick={(e) => {
              e.preventDefault();
              e.stopPropagation();
              openQuickView(product);
            }}
            className="px-4 py-2 rounded-full bg-white/95 backdrop-blur-sm text-black text-[0.55rem] uppercase tracking-[0.15em] font-bold flex items-center gap-2 shadow-lg translate-y-4 opacity-0 group-hover:translate-y-0 group-hover:opacity-100 transition-all duration-500 hover:bg-[var(--color-accent)] hover:text-white"
            aria-label="Quick View"
          >
            <Eye className="w-3.5 h-3.5" />
            Quick View
          </button>
        </div>

        {/* Category tag */}
        {product.category_name && (
          <div className="absolute top-3 left-3 z-10">
            <span className="bg-white/90 backdrop-blur-sm px-2.5 py-1 text-[0.45rem] font-bold uppercase tracking-[0.15em] text-[var(--color-accent)] rounded-sm">
              {product.category_name}
            </span>
          </div>
        )}
      </Link>

      <div className="px-4 py-4 sm:px-5 sm:py-5">
        <Link href={`/shop/${catSlug}/${product.slug}`}>
          <h3 className="font-heading text-[0.85rem] sm:text-base text-[var(--color-text-primary)] hover:text-[var(--color-accent)] transition-colors duration-300 line-clamp-1 leading-snug">
            {product.name}
          </h3>
        </Link>

        <div className="mt-2.5 flex items-center justify-between">
          <div className="w-6 h-[1px] bg-black/10 group-hover:w-10 group-hover:bg-[var(--color-accent)] transition-all duration-700"></div>
          <Link
            href={`/shop/${catSlug}/${product.slug}`}
            className="text-[0.5rem] uppercase tracking-[0.2em] font-bold text-[var(--color-accent)] opacity-0 translate-x-2 group-hover:opacity-100 group-hover:translate-x-0 transition-all duration-500"
          >
            View →
          </Link>
        </div>
      </div>
    </div>
  );
}
