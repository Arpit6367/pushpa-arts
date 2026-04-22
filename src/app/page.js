import { getAllCategoriesWithPaths } from '@/lib/categories';
import { getFeaturedMasterpieces } from '@/lib/products';
import Hero from '@/components/home/Hero';
import FeatureBar from '@/components/home/FeatureBar';
import CategorySection from '@/components/home/CategorySection';
import BentoGallery from '@/components/home/BentoGallery';
import StudioGallery from '@/components/home/StudioGallery';
import ParallaxSection from '@/components/home/ParallaxSection';
import MaterialShowcase from '@/components/home/MaterialShowcase';
import ProductTabs from '@/components/home/ProductTabs';
import BlogSnippet from '@/components/home/BlogSnippet';
import CategoryGrid from '@/components/home/CategoryGrid';
import InfoSection from '@/components/home/InfoSection';
import Testimonials from '@/components/home/Testimonials';

export default async function HomePage() {
  const allCategories = await getAllCategoriesWithPaths();
  const parentCategories = allCategories.filter(c => !c.parent_id);
  const featuredProducts = await getFeaturedMasterpieces(12);

  return (
    <>
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
      <FeatureBar />
      {/* <CategorySection categories={parentCategories} /> */}
      <BentoGallery />
      <ProductTabs products={featuredProducts} />
      <MaterialShowcase />
      <StudioGallery />
      <CategoryGrid categories={parentCategories} />
      <ParallaxSection />
      <BlogSnippet />
      <InfoSection />
      <Testimonials />

      {/* ===== FINAL CTA / NEWSLETTER ===== */}
      <section className="py-16 sm:py-32 bg-[var(--color-bg-dark)]">
        <div className="max-w-[1600px] mx-auto px-[var(--spacing-container)] text-center">
          <h2 className="text-[clamp(2rem,8vw,5rem)] text-white font-heading mb-6 tracking-tight">Elegance in Every Detail</h2>
          <p className="text-white/60 max-w-[600px] mx-auto mb-12 text-base sm:text-lg font-light leading-relaxed">
            Stay inspired. Join our circle for exclusive previews of new artisan collections and home decor ideas.
          </p>
          <div className="flex flex-col sm:flex-row max-w-[500px] w-full mx-auto relative group">
            <input
              type="email"
              placeholder="YOUR EMAIL ADDRESS"
              className="flex-1 bg-transparent border-b border-white/30 text-white text-[0.8rem] px-2 py-4 tracking-[0.1em] placeholder:text-white/40 focus:outline-none focus:border-[var(--color-accent)] transition-colors"
              suppressHydrationWarning
            />
            <button
              className="bg-transparent border-b border-[var(--color-accent)] text-[var(--color-accent)] text-[0.8rem] uppercase font-bold tracking-[0.2em] px-4 py-4 sm:py-0 transition-colors hover:text-white hover:border-white"
              suppressHydrationWarning
            >
              Subscribe
            </button>
          </div>
        </div>
      </section>
    </>
  );
}
