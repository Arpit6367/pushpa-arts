import Image from 'next/image';
import Link from 'next/link';

export default function CategoryCard({ category }) {
  return (
    <Link
      href={`/product-category/${category.slug_path || category.slug}`}
      className="block relative aspect-[0.75] overflow-hidden group rounded-[2px] border border-black/5"
      id={`category-${category.id}`}
    >
      <div className="absolute inset-0 transition-transform duration-[2s] group-hover:scale-110 bg-[#f5f5f7]">
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
      <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/20 to-transparent p-12 md:p-14 flex flex-col justify-end text-white transition-all duration-500 group-hover:via-black/40">
        <p className="text-[0.6rem] tracking-[0.3em] uppercase opacity-70 mb-3 font-bold translate-y-2 transition-all duration-700 group-hover:translate-y-0">
          Explore Collection
        </p>
        <h3 className="font-heading text-4xl md:text-5xl mb-6 leading-tight translate-y-2 transition-all duration-700 group-hover:translate-y-0 delay-100">
          {category.name}
        </h3>
        <span className="text-[0.6rem] uppercase tracking-[0.3em] font-bold border-b border-[var(--color-accent)] pb-1.5 inline-block w-fit opacity-0 translate-y-4 transition-all duration-500 group-hover:opacity-100 group-hover:translate-y-0 text-[var(--color-accent)] delay-200">
          Discover More
        </span>
      </div>
    </Link>
  );
}
