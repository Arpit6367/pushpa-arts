import Link from 'next/link';
import Image from 'next/image';
import { getAllCategoriesWithPaths } from '@/lib/categories';
import { getFeaturedMasterpieces } from '@/lib/products';
import ProductCard from '@/components/ProductCard';

export default async function NotFound() {
  const categories = await getAllCategoriesWithPaths();
  const parentCategories = categories.filter(c => !c.parent_id).slice(0, 4);
  const featuredProducts = await getFeaturedMasterpieces(4);

  return (
    <main className="min-h-screen pt-32 pb-20 bg-[#FCFAF8]">
      <div className="container">
        {/* Hero 404 Section */}
        <div className="text-center mb-20 reveal">
          <p className="text-[0.6rem] uppercase tracking-[0.5em] text-[#B8860B] font-bold mb-6">Error 404</p>
          <h1 className="text-[clamp(3rem,10vw,6rem)] font-heading leading-tight mb-6 text-[#1F1F1F]">
            Lost in <span className="text-[#B8860B] italic">Artistry</span>
          </h1>
          <div className="w-24 h-[2px] bg-gradient-to-r from-transparent via-[#B8860B] to-transparent mx-auto mb-10"></div>
          <p className="text-[1.1rem] text-[#4A4A4A] max-w-[600px] mx-auto font-light leading-relaxed mb-12">
            The masterpiece you are looking for has either been moved to another gallery or never existed. Let us guide you back to our collections.
          </p>
          <Link 
            href="/" 
            className="inline-block bg-[#1F1F1F] text-white px-12 py-5 text-[0.7rem] font-bold uppercase tracking-[0.3em] hover:bg-[#B8860B] transition-all duration-500 hover:-translate-y-1 shadow-xl"
          >
            Return to Atelier
          </Link>
        </div>

        {/* Suggested Categories */}
        <div className="mb-24 reveal">
          <div className="flex items-center justify-between mb-12 border-b border-[#E5E0DA] pb-6">
            <h2 className="font-heading text-2xl text-[#1F1F1F] italic">Explore <span className="text-[#B8860B]">Collections</span></h2>
            <Link href="/product-category" className="text-[0.6rem] uppercase tracking-[0.2em] font-bold text-[#B8860B] hover:text-[#1F1F1F] transition-colors">View All</Link>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            {parentCategories.map((cat) => (
              <Link 
                key={cat.id} 
                href={`/product-category/${cat.slug}`}
                className="group relative aspect-[4/5] overflow-hidden rounded-[4px] bg-[#F5F1EE] flex flex-col justify-end p-8"
              >
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent z-10 opacity-60 group-hover:opacity-80 transition-opacity duration-700"></div>
                {cat.image ? (
                  <Image 
                    src={cat.image} 
                    alt={cat.name} 
                    fill
                    className="absolute inset-0 object-cover transition-transform duration-1000 group-hover:scale-110"
                  />
                ) : (
                  <div className="absolute inset-0 flex items-center justify-center text-[3rem] opacity-10 grayscale group-hover:grayscale-0 transition-all duration-700">✨</div>
                )}
                <div className="relative z-20">
                  <h3 className="text-white font-heading text-xl mb-2 translate-y-2 group-hover:translate-y-0 transition-transform duration-500">{cat.name}</h3>
                  <p className="text-[#B8860B] text-[0.55rem] uppercase tracking-[0.2em] font-bold opacity-0 group-hover:opacity-100 transition-opacity duration-500">Discover →</p>
                </div>
              </Link>
            ))}
          </div>
        </div>

        {/* Featured Products Suggestion */}
        <div className="reveal">
          <div className="flex items-center justify-between mb-12 border-b border-[#E5E0DA] pb-6">
            <h2 className="font-heading text-2xl text-[#1F1F1F] italic">Signature <span className="text-[#B8860B]">Masterpieces</span></h2>
            <Link href="/shop" className="text-[0.6rem] uppercase tracking-[0.2em] font-bold text-[#B8860B] hover:text-[#1F1F1F] transition-colors">Shop Full Gallery</Link>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-10">
            {featuredProducts.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        </div>
      </div>
    </main>
  );
}
