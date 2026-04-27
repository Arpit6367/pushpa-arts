import { getAllCategoriesWithPaths } from '@/lib/categories';
import { getFeaturedMasterpieces, getNewArrivals, getBestSellers, getHandcraftedProducts } from '@/lib/products';
import { getHeroSlides, getTestimonials, getMaterialMastery, getBlogs } from '@/lib/cms';
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
import CategorySubcategoryTabs from '@/components/home/CategorySubcategoryTabs';
import InfoSection from '@/components/home/InfoSection';
import Testimonials from '@/components/home/Testimonials';

export default async function HomePage() {
  const allCategories = await getAllCategoriesWithPaths();
  const parentCategories = allCategories.filter(c => !c.parent_id);
  const [
    featuredProducts,
    newArrivals,
    bestSellers,
    handcrafted,
    heroSlides,
    testimonials,
    mastery,
    blogs
  ] = await Promise.all([
    getFeaturedMasterpieces(12),
    getNewArrivals(8),
    getBestSellers(8),
    getHandcraftedProducts(8),
    getHeroSlides(),
    getTestimonials(),
    getMaterialMastery(),
    getBlogs(3)
  ]);

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "Organization",
            "name": "Pushpa Exports",
            "url": "https://pushpaexports.com",
            "logo": "https://pushpaexports.com/images/Pushpa-Exports.svg",
            "contactPoint": {
              "@type": "ContactPoint",
              "telephone": "+91-94141-62629",
              "contactType": "Sales and Inquiries",
              "areaServed": "Worldwide",
              "availableLanguage": ["English", "Hindi"]
            },
            "sameAs": [
              "https://www.instagram.com/pushpaexports",
              "https://www.facebook.com/pushpaexports"
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
            "url": "https://pushpaexports.com",
            "potentialAction": {
              "@type": "SearchAction",
              "target": "https://pushpaexports.com/product-category?search={search_term_string}",
              "query-input": "required name=search_term_string"
            }
          })
        }}
      />

      <Hero slides={heroSlides} />
      <FeatureBar />
      <CategoryGrid categories={parentCategories} />
      <ProductTabs
        products={featuredProducts}
        newArrivals={newArrivals}
        bestSellers={bestSellers}
        handcrafted={handcrafted}
      />
      <CategorySubcategoryTabs allCategories={allCategories} />
      <BentoGallery />
      <MaterialShowcase items={mastery} />
      <ParallaxSection />
      <BlogSnippet items={blogs} />
      <StudioGallery />
      <InfoSection />
      <Testimonials items={testimonials} />
    </>
  );
}
