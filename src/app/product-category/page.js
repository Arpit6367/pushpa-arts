import { getAllCategoriesWithPaths } from '@/lib/categories';
import Image from 'next/image';
import Link from 'next/link';
import CategoryCard from '@/components/CategoryCard';
import { ArrowRight, Sparkles, Hammer, Gem } from 'lucide-react';

export const revalidate = 3600;

export async function generateMetadata() {
    return {
        title: 'Luxury Furniture Collections | Pushpa Exports Udaipur',
        description: 'Explore our signature collections of handcrafted Silver, Bone Inlay, Mother of Pearl, and Marble furniture. Bespoke masterpieces from the heart of Udaipur.',
    };
}

export default async function CategoriesPage() {
    const allCategories = await getAllCategoriesWithPaths();
    const parentCategories = allCategories.filter(c => !c.parent_id && c.is_active);

    // Find featured collections for the spotlight
    const silverCollection = parentCategories.find(c => c.slug.includes('silver'));
    const inlayCollection = parentCategories.find(c => c.slug.includes('inlay'));

    return (
        <main className="bg-[#FCFAF8]">
            {/* Ultra-Unique Mewar-Inspired Hero Section */}
            <div className="relative min-h-screen flex items-center bg-[#FCFAF8] pt-20 overflow-hidden">
                {/* Large Background Watermark */}
                <div className="absolute left-[-5%] top-1/2 -translate-y-1/2 text-[15vw] font-heading text-black/[0.02] select-none pointer-events-none whitespace-nowrap uppercase tracking-tighter">
                    Heritage • Craft • Legacy
                </div>

                <div className="max-w-[1600px] mx-auto px-[var(--spacing-container)] w-full grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-20 items-center">

                    {/* Text Column - Layered Typography */}
                    <div className="lg:col-span-6 relative z-20 reveal">
                        <div className="flex items-center gap-4 mb-12 stagger-1">
                            <div className="w-10 h-10 rounded-full border border-[var(--color-accent)] flex items-center justify-center">
                                <Sparkles className="w-4 h-4 text-[var(--color-accent)]" />
                            </div>
                            <p className="text-[var(--color-accent)] uppercase tracking-[0.7em] font-bold text-[0.6rem]">Pushpa Exports Signature</p>
                        </div>

                        <div className="relative mb-16">
                            <h1 className="text-[clamp(3.5rem,10vw,6.5rem)] font-heading leading-[0.85] text-[#1a1a1a] stagger-2 relative z-10">
                                The <span className="italic text-[var(--color-accent)]">Grand</span> <br />
                                Archive
                            </h1>
                            <div className="absolute -top-10 -left-10 text-[12rem] font-heading text-[var(--color-accent)]/5 select-none pointer-events-none stagger-1">
                                82
                            </div>
                        </div>

                        <div className="space-y-8 max-w-[550px] stagger-3">
                            <p className="text-[#1a1a1a]/70 text-xl font-light leading-relaxed">
                                A living gallery of Udaipur&apos;s most prestigious craftsmanship, preserved across four decades of artistic evolution.
                            </p>
                            {/* <div className="flex items-center gap-6 py-6 border-y border-black/5">
                                <div className="flex -space-x-3">
                                    {[1, 2, 3].map(i => (
                                        <div key={i} className="w-10 h-10 rounded-full border-2 border-white bg-[#F2F0ED] overflow-hidden">
                                            <div className="w-full h-full bg-[var(--color-accent)] opacity-20" />
                                        </div>
                                    ))}
                                </div>
                                <p className="text-[0.65rem] uppercase tracking-widest font-bold text-black/40">Trusted by <span className="text-black">150+ Royal Patrons</span></p>
                            </div> */}
                        </div>

                        <div className="mt-16 flex flex-col sm:flex-row items-start sm:items-center gap-8 stagger-4">
                            <a
                                href="#gallery"
                                className="group relative px-14 py-6 overflow-hidden"
                            >
                                <div className="absolute inset-0 bg-[#1a1a1a] transition-transform duration-500 group-hover:scale-105" />
                                <div className="relative z-10 flex items-center gap-4 text-white text-[0.75rem] uppercase tracking-[0.4em] font-bold">
                                    <span>Enter Archive</span>
                                    <ArrowRight className="w-4 h-4 transition-transform duration-500 group-hover:translate-x-2" />
                                </div>
                            </a>
                        </div>
                    </div>

                    {/* Image Column - The Architectural Aperture */}
                    <div className="lg:col-span-6 relative flex justify-center lg:justify-end reveal stagger-3 pt-20 lg:pt-0">
                        {/* Decorative Arch Frame */}
                        <div className="relative w-[85%] lg:w-full aspect-[4/5] max-h-[85vh]">
                            <div className="absolute inset-0 border-[20px] border-[#F2F0ED] z-10 pointer-events-none" style={{ clipPath: 'path("M 0 100 Q 50 0 100 100 L 100 100 L 0 100 Z")' }}></div>

                            <div className="relative h-full w-full overflow-hidden shadow-2xl"
                                style={{
                                    clipPath: 'ellipse(50% 70% at 50% 50%)',
                                    WebkitClipPath: 'ellipse(50% 70% at 50% 50%)'
                                }}>
                                <Image
                                    src="/images/luxury-collections-hero.png"
                                    alt="Pushpa Exports Luxury Collections"
                                    fill
                                    className="object-cover transition-transform duration-[6s] hover:scale-110"
                                    priority
                                />
                                <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent"></div>
                            </div>

                            {/* Floating Luxury Badges */}
                            {/* <div className="absolute -top-10 -right-10 w-40 h-40 bg-[var(--color-accent)] rounded-full flex items-center justify-center text-center p-6 shadow-2xl animate-pulse-slow z-20">
                                <div className="flex flex-col items-center">
                                    <Gem className="w-6 h-6 text-white mb-2" />
                                    <span className="text-white text-[0.55rem] uppercase tracking-widest font-bold leading-tight">Authentic <br />Mewar Art</span>
                                </div>
                            </div> */}

                            <div className="absolute bottom-20 -left-16 bg-white p-8 shadow-2xl z-20 border-l-4 border-[var(--color-accent)] hidden md:block">
                                <p className="text-black/30 text-[0.5rem] uppercase tracking-[0.4em] font-bold mb-4">Material Quality</p>
                                <p className="text-xl font-heading text-[#1a1a1a]">99.9% <span className="italic text-[var(--color-accent)]">Pure</span></p>
                                <p className="text-[0.6rem] uppercase tracking-widest font-bold text-black/50 mt-2">Certified Silver Sheet</p>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Bottom Decorative Pattern */}
                <div className="absolute bottom-0 left-0 w-full h-1 bg-[var(--color-accent)]/10"></div>
            </div>

            {/* The Collections Gallery */}
            <section className="py-32 md:py-48 bg-white" id="gallery">
                <div className="max-w-[1600px] mx-auto px-[var(--spacing-container)]">
                    <div className="flex flex-col md:flex-row justify-between items-end mb-24 gap-8 reveal">
                        <div className="max-w-[700px]">
                            <h2 className="text-[0.7rem] uppercase tracking-[0.5em] text-[var(--color-accent)] font-bold mb-6">Artisan Directory</h2>
                            <h3 className="text-4xl md:text-6xl font-heading text-[#1a1a1a] leading-tight">
                                Explore <span className="italic">Heritage</span> through our collections
                            </h3>
                        </div>
                        <p className="text-black/50 text-sm md:text-base font-light max-w-[400px] leading-relaxed italic">
                            Each category represents a distinct era of craftsmanship, meticulously preserved by our master artisans.
                        </p>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-x-12 gap-y-24">
                        {parentCategories.map((cat, i) => (
                            <div key={cat.id} className={`reveal stagger-${(i % 3) + 1}`}>
                                <CategoryCard category={cat} />
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* Featured Spotlight: Silver Artistry */}
            {silverCollection && (
                <section className="py-0 overflow-hidden bg-[#F2F0ED]">
                    <div className="flex flex-col lg:flex-row">
                        <div className="lg:w-1/2 relative min-h-[60vh] lg:min-h-screen">
                            <Image
                                src={silverCollection.image || "/images/collections-bg.png"}
                                alt="Silver Collection"
                                fill
                                className="object-cover"
                            />
                        </div>
                        <div className="lg:w-1/2 p-12 md:p-24 lg:p-32 flex flex-col justify-center">
                            <h4 className="text-[var(--color-accent)] uppercase tracking-[0.5em] font-bold text-[0.7rem] mb-8">Material Spotlight</h4>
                            <h2 className="text-4xl md:text-6xl font-heading text-[#1a1a1a] mb-10 leading-tight">
                                The Purest <br /><span className="italic">Silver</span> Artistry
                            </h2>
                            <p className="text-black/60 text-lg font-light leading-relaxed mb-12 max-w-[500px]">
                                Our signature Silver furniture is crafted using 99.9% pure silver sheets, meticulously embossed over seasoned teak wood. Each piece is a legacy item, designed to age gracefully through generations.
                            </p>
                            <Link
                                href={`/product-category/${silverCollection.slug_path}`}
                                className="group flex items-center gap-6 text-[0.75rem] uppercase tracking-[0.4em] font-bold text-[#1a1a1a]"
                            >
                                <span className="border-b border-black/20 pb-2 group-hover:border-black transition-all">Explore the Silver Range</span>
                                <ArrowRight className="w-5 h-5 transition-transform group-hover:translate-x-2" />
                            </Link>
                        </div>
                    </div>
                </section>
            )}

            {/* Craftsmanship Section */}
            <section className="py-32 md:py-48 bg-[#1a1a1a] text-white">
                <div className="max-w-[1400px] mx-auto px-[var(--spacing-container)]">
                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-20">
                        <div className="lg:col-span-1">
                            <h3 className="text-3xl md:text-4xl font-heading mb-10 leading-tight">
                                The <span className="text-[var(--color-accent)]">Process</span> Behind <br />The Perfection
                            </h3>
                            <div className="w-16 h-[2px] bg-[var(--color-accent)] mb-10"></div>
                        </div>
                        <div className="lg:col-span-2 grid grid-cols-1 md:grid-cols-2 gap-12">
                            <div className="space-y-6">
                                <Hammer className="text-[var(--color-accent)] w-10 h-10 mb-4" />
                                <h4 className="text-xl font-heading">Artisan Hand-Carving</h4>
                                <p className="text-white/50 font-light text-sm leading-relaxed">
                                    Every frame starts with seasoned teak wood, carved by hand using traditional chisels. No two pieces are identical, reflecting the soul of the maker.
                                </p>
                            </div>
                            <div className="space-y-6">
                                <Sparkles className="text-[var(--color-accent)] w-10 h-10 mb-4" />
                                <h4 className="text-xl font-heading">Intricate Inlay Work</h4>
                                <p className="text-white/50 font-light text-sm leading-relaxed">
                                    From delicate Mother of Pearl to organic Bone Inlay, our craftsmen spend hundreds of hours hand-placing each fragment into perfect geometry.
                                </p>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* Inlay Spotlight */}
            {inlayCollection && (
                <section className="py-0 overflow-hidden bg-white">
                    <div className="flex flex-col lg:flex-row-reverse">
                        <div className="lg:w-1/2 relative min-h-[60vh] lg:min-h-screen">
                            <Image
                                src={inlayCollection.image || "/images/collections-bg.png"}
                                alt="Inlay Collection"
                                fill
                                className="object-cover"
                            />
                        </div>
                        <div className="lg:w-1/2 p-12 md:p-24 lg:p-32 flex flex-col justify-center">
                            <h4 className="text-[var(--color-accent)] uppercase tracking-[0.5em] font-bold text-[0.7rem] mb-8">Heritage Craft</h4>
                            <h2 className="text-4xl md:text-6xl font-heading text-[#1a1a1a] mb-10 leading-tight">
                                Geometric <br /><span className="italic">Elegance</span> in Inlay
                            </h2>
                            <p className="text-black/60 text-lg font-light leading-relaxed mb-12 max-w-[500px]">
                                Our Inlay collections represent the pinnacle of decorative arts. Sourced sustainably, each fragment of bone or shell is shaped and polished to create mesmerizing patterns that catch the light.
                            </p>
                            <Link
                                href={`/product-category/${inlayCollection.slug_path}`}
                                className="group flex items-center gap-6 text-[0.75rem] uppercase tracking-[0.4em] font-bold text-[#1a1a1a]"
                            >
                                <span className="border-b border-black/20 pb-2 group-hover:border-black transition-all">Discover Inlay Masterpieces</span>
                                <ArrowRight className="w-5 h-5 transition-transform group-hover:translate-x-2" />
                            </Link>
                        </div>
                    </div>
                </section>
            )}

            {/* Final CTA: Custom Commissions */}
            <section className="py-32 md:py-48 bg-[#FCFAF8]">
                <div className="max-w-[1000px] mx-auto px-[var(--spacing-container)] text-center">
                    <div className="inline-flex items-center gap-4 mb-10 reveal">
                        <span className="w-8 h-[1px] bg-black/20"></span>
                        <p className="text-[0.6rem] uppercase tracking-[0.6em] font-bold text-black/40">Exclusive Services</p>
                        <span className="w-8 h-[1px] bg-black/20"></span>
                    </div>
                    <h2 className="text-4xl md:text-7xl font-heading text-[#1a1a1a] mb-12 leading-[1.1] reveal">
                        Can&apos;t find your <br /><span className="italic text-[var(--color-accent)]">Perfect Piece?</span>
                    </h2>
                    <p className="text-black/50 text-lg md:text-xl font-light mb-16 max-w-[700px] mx-auto reveal">
                        Over 70% of our production is completely bespoke. Our designers will work with you to create a unique masterpiece tailored to your interior vision.
                    </p>
                    <div className="flex flex-col sm:flex-row items-center justify-center gap-8 reveal">
                        <Link
                            href="/contact"
                            className="w-full sm:w-auto px-12 py-5 bg-[#1a1a1a] text-white text-[0.7rem] uppercase tracking-[0.4em] font-bold hover:bg-[var(--color-accent)] transition-all shadow-xl"
                        >
                            Request Custom Catalog
                        </Link>
                        <Link
                            href="/about"
                            className="w-full sm:w-auto px-12 py-5 bg-transparent border border-black/10 text-black text-[0.7rem] uppercase tracking-[0.4em] font-bold hover:bg-black hover:text-white transition-all"
                        >
                            Our Heritage
                        </Link>
                    </div>
                </div>
            </section>
        </main>
    );
}
