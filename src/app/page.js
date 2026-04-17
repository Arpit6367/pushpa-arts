import { getAllCategoriesWithPaths } from '@/lib/categories';
import { getFeaturedMasterpieces } from '@/lib/products';
import Hero from '@/components/home/Hero';
import MaterialGrid from '@/components/home/MaterialGrid';
import EditorialGrid from '@/components/home/EditorialGrid';
import ProcessSection from '@/components/home/ProcessSection';
import CommissionSection from '@/components/home/CommissionSection';
import TrendingMasterpieces from '@/components/home/TrendingMasterpieces';

export default async function HomePage() {
  const allCategories = await getAllCategoriesWithPaths();
  const parentCategories = allCategories.filter(c => !c.parent_id);
  const featuredProducts = await getFeaturedMasterpieces(6);

  return (
    <main>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "Organization",
            "name": "Pushpa Arts",
            "url": "https://pushpaarts.com",
            "logo": "https://pushpaarts.com/images/Pushpa-Exports.svg",
            "contactPoint": {
              "@type": "ContactPoint",
              "telephone": "+91-94141-62629",
              "contactType": "Sales and Inquiries",
              "areaServed": "Worldwide",
              "availableLanguage": ["English", "Hindi"]
            },
            "sameAs": [
              "https://www.instagram.com/pushpaarts",
              "https://www.facebook.com/pushpaarts"
            ],
            "address": {
              "@type": "PostalAddress",
              "addressLocality": "Udaipur",
              "addressRegion": "Rajasthan",
              "addressCountry": "India"
            }
          })
        }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "WebSite",
            "url": "https://pushpaarts.com",
            "potentialAction": {
              "@type": "SearchAction",
              "target": "https://pushpaarts.com/product-category?search={search_term_string}",
              "query-input": "required name=search_term_string"
            }
          })
        }}
      />
      
      <Hero />
      <MaterialGrid />
      <EditorialGrid categories={parentCategories} />
      <ProcessSection />
      <CommissionSection />
      <TrendingMasterpieces products={featuredProducts} />

      {/* ===== FINAL CTA / NEWSLETTER ===== */}
      <section className="py-32 bg-[#1F1F1F]">
        <div className="max-w-[1600px] mx-auto px-[var(--spacing-container)] text-center">
          <h2 className="text-[clamp(3rem,10vw,6rem)] text-white font-heading mb-6 tracking-tight">Bring Royalty Home</h2>
          <p className="text-white/60 max-w-[600px] mx-auto mb-12 text-lg font-light leading-relaxed">
            Join our inner circle for exclusive previews of new artisan drops and custom interior inspiration.
          </p>
          <div className="flex max-w-[500px] w-full mx-auto relative group">
            <input 
              type="email" 
              placeholder="YOUR EMAIL ADDRESS" 
              className="flex-1 bg-transparent border-b border-white/30 text-white text-[0.8rem] px-2 py-4 tracking-[0.1em] placeholder:text-white/40 focus:outline-none focus:border-[#B8860B] transition-colors" 
            />
            <button className="bg-transparent border-b border-[#B8860B] text-[#B8860B] text-[0.8rem] uppercase font-bold tracking-[0.2em] px-4 transition-colors hover:text-white hover:border-white">
              Subscribe
            </button>
          </div>
        </div>
      </section>
    </main>
  );
}
