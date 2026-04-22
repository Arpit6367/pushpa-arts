'use client';
import Image from 'next/image';
import Link from 'next/link';
import { Eye, ShoppingBag } from 'lucide-react';
import { useQuickView } from '@/context/QuickViewContext';

export default function ProductCard({ product }) {
  const { openQuickView } = useQuickView();
  const imageUrl = product.primary_image || product.first_image;
  const catSlug = product.category_slug_path || product.categories?.[0]?.slug_path || 'uncategorized';

  return (
    <div className="group relative bg-white border border-black/5 transition-all duration-700 hover:shadow-[0_20px_50px_-20px_rgba(0,0,0,0.15)] reveal">
      <Link
        href={`/shop/${catSlug}/${product.slug}`}
        className="block relative aspect-[0.9] overflow-hidden bg-[#fdfdfd]"
        id={`product-${product.id}`}
      >
        {imageUrl ? (
          <Image
            src={imageUrl}
            alt={product.name}
            fill
            className="object-contain p-8 md:p-12 transition-transform duration-[1.5s] cubic-bezier(0.16, 1, 0.3, 1) group-hover:scale-110"
            sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
          />
        ) : (
          <div className="flex items-center justify-center font-heading italic opacity-40 text-[0.6rem] uppercase tracking-widest text-center p-8 bg-[#f5f5f7] w-full h-full">Studio Imagery</div>
        )}

        {/* Quick actions overlay */}
        <div className="absolute inset-0 bg-black/5 opacity-0 group-hover:opacity-100 transition-opacity duration-500 flex flex-col items-center justify-center gap-3">
          <button
            onClick={(e) => {
              e.preventDefault();
              e.stopPropagation();
              openQuickView(product);
            }}
            className="w-12 h-12 rounded-full bg-white text-black flex items-center justify-center shadow-2xl translate-y-8 opacity-0 group-hover:translate-y-0 group-hover:opacity-100 transition-all duration-500 hover:bg-[var(--color-accent)] hover:text-white"
            aria-label="Quick View"
          >
            <Eye className="w-5 h-5" />
          </button>
        </div>
      </Link>

      <div className="p-8 text-center border-t border-black/5">
        <div className="overflow-hidden mb-2">
          {product.category_name && (
            <span className="text-[0.55rem] uppercase tracking-[0.3em] text-[var(--color-accent)] font-bold block translate-y-full group-hover:translate-y-0 transition-transform duration-500">
              {product.category_name}
            </span>
          )}
        </div>

        <Link href={`/shop/${catSlug}/${product.slug}`}>
          <h3 className="font-heading text-lg md:text-xl text-[var(--color-text-primary)] hover:text-[var(--color-accent)] transition-colors duration-300 px-2 line-clamp-1">
            {product.name}
          </h3>
        </Link>

        <div className="mt-6 flex flex-col items-center gap-4">
          <div className="w-8 h-[1px] bg-black/10 group-hover:w-16 group-hover:bg-[var(--color-accent)] transition-all duration-700"></div>

          <Link
            href={`/shop/${catSlug}/${product.slug}`}
            className="text-[0.6rem] uppercase tracking-[0.3em] font-bold text-[var(--color-text-secondary)] opacity-0 -translate-y-4 group-hover:opacity-100 group-hover:translate-y-0 transition-all duration-500"
          >
            View Masterpiece
          </Link>
        </div>
      </div>

      {/* Decorative label */}
      {/* <div className="absolute top-4 left-4 z-20">
        <span className="bg-white/90 backdrop-blur-sm px-3 py-1.5 text-[0.5rem] font-bold uppercase tracking-[0.2em] text-black shadow-sm border border-black/5">
          Artisan Made
        </span>
      </div> */}
    </div>
  );
}
