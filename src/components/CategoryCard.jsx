'use client';
import Image from 'next/image';
import Link from 'next/link';

export default function CategoryCard({ category }) {
  return (
    <Link
      href={`/product-category/${category.slug_path || category.slug}`}
      className="block relative aspect-[0.75] overflow-hidden group border border-black/5 reveal"
      id={`category-${category.id}`}
    >
      <div className="absolute inset-0 transition-transform duration-[2.5s] cubic-bezier(0.16, 1, 0.3, 1) group-hover:scale-110 bg-[#f5f5f7]">
        {category.image ? (
          <Image
            src={category.image}
            alt={category.name}
            fill
            className="object-cover"
            sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
          />
        ) : (
          <div className="flex w-full h-full items-center justify-center font-heading italic opacity-20 text-sm tracking-widest uppercase">
            Studio Aesthetic
          </div>
        )}
      </div>

      {/* Dynamic Overlay */}
      <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/30 to-transparent p-10 md:p-12 flex flex-col justify-end text-white transition-all duration-700 group-hover:via-black/50">
        <div className="overflow-hidden">
          <p className="text-[0.6rem] tracking-[0.4em] uppercase text-[var(--color-accent)] font-bold mb-4 translate-y-full transition-transform duration-700 group-hover:translate-y-0">
            Artisan Series
          </p>
        </div>

        <h3 className="font-heading text-4xl md:text-5xl mb-8 leading-[1.1] translate-y-4 transition-all duration-700 group-hover:translate-y-0">
          {category.name}
        </h3>

        <div className="flex items-center gap-4 opacity-0 translate-y-6 transition-all duration-500 delay-100 group-hover:opacity-100 group-hover:translate-y-0">
          <span className="text-[0.65rem] uppercase tracking-[0.3em] font-bold border-b border-white/50 pb-1 hover:border-white transition-all">
            Discover Collection
          </span>
          <span className="w-8 h-[1px] bg-white/30 group-hover:w-12 group-hover:bg-white transition-all duration-700"></span>
        </div>
      </div>

      {/* Decorative corner accent */}
      <div className="absolute top-6 right-6 w-10 h-10 border-t border-r border-white/20 opacity-0 group-hover:opacity-100 transition-all duration-700 translate-x-4 -translate-y-4 group-hover:translate-x-0 group-hover:translate-y-0"></div>
    </Link>
  );
}
