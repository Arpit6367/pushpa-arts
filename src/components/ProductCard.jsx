import Image from 'next/image';
import Link from 'next/link';

export default function ProductCard({ product }) {
  const imageUrl = product.primary_image || product.first_image;
  // Ensure we use the correct category slug path for consistent routing
  const catSlug = product.category_slug_path || product.categories?.[0]?.slug_path || 'uncategorized';

  return (
    <Link
      href={`/shop/${catSlug}/${product.slug}`}
      className="block bg-white transition-all duration-500 group relative border border-black/5 hover:border-black/10 hover:shadow-2xl hover:shadow-[#1F1F1F]/5 overflow-hidden rounded-[2px]"
      id={`product-${product.id}`}
    >
      <div className="relative aspect-square bg-[#fdfdfd] overflow-hidden">
        {imageUrl ? (
          <Image
            src={imageUrl}
            alt={product.name}
            fill
            className="w-full h-full object-contain p-10 transition-transform duration-[1.5s] ease-out group-hover:scale-110"
            sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
          />
        ) : (
          <div className="flex items-center justify-center font-heading italic opacity-40 text-xs text-center p-8 bg-[#f5f5f7] w-full h-full">Studio Imagery</div>
        )}

        {/* Modern Hover Overlay */}
        <div className="absolute inset-0 bg-[#1F1F1F]/5 backdrop-blur-[1px] flex items-center justify-center opacity-0 transition-all duration-500 group-hover:opacity-100 group-hover:backdrop-blur-[2px]">
          <span className="bg-white text-[#1F1F1F] text-[0.6rem] uppercase tracking-[0.3em] font-bold py-4 px-10 shadow-xl translate-y-4 transition-all duration-500 group-hover:translate-y-0">
            Explore Masterpiece
          </span>
        </div>
      </div>

      <div className="text-center pt-8 pb-10 px-6">
        {product.category_name && (
          <span className="text-[0.55rem] uppercase tracking-[0.25em] text-[#B8860B] font-bold mb-3 block opacity-80 group-hover:opacity-100 transition-opacity">
            {product.category_name}
          </span>
        )}
        <h3 className="font-heading text-xl text-[#1d1d1f] leading-tight px-2">{product.name}</h3>
        <div className="mt-4 w-12 h-[1px] bg-[#B8860B]/30 mx-auto group-hover:w-20 transition-all duration-500"></div>
      </div>
    </Link>
  );
}
