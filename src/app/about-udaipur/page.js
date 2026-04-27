import { getPageBySlug } from '@/lib/cms';
import { notFound } from 'next/navigation';
import Link from 'next/link';

export async function generateMetadata() {
  const page = await getPageBySlug('about-udaipur');
  if (!page) return {};

  return {
    title: `${page.title} | Pushpa Exports`,
    description: page.meta_description || `Discover the heritage of Udaipur with Pushpa Exports.`,
  };
}

export default async function AboutUdaipurPage() {
  const page = await getPageBySlug('about-udaipur');
  if (!page) return notFound();

  return (
    <main className="bg-[#FCFAF8] min-h-screen">
      {/* Hero Section */}
      <section className="relative h-[80vh] flex items-center justify-center overflow-hidden">
        <div className="absolute inset-0 z-0">
          <img
            src="/images/udaipur-hero.png"
            alt="Udaipur City Palace"
            className="w-full h-full object-cover brightness-75 scale-105 animate-zoom"
          />
          <div className="absolute inset-0 bg-gradient-to-b from-black/40 via-transparent to-[#FCFAF8]"></div>
        </div>

        <div className="container relative z-10 text-center text-white">
          <p className="text-[0.8rem] uppercase tracking-[0.6em] mb-6 animate-fade-in-up">The Soul of Our Craft</p>
          <h1 className="text-[clamp(3rem,8vw,6rem)] font-heading italic leading-tight mb-8 animate-fade-in-up delay-100">
            {page.title}
          </h1>
          <div className="w-24 h-1 bg-[#B8860B] mx-auto animate-fade-in-up delay-200"></div>
        </div>
      </section>

      {/* The Heritage Section - Dynamic Content */}
      <section className="py-24 sm:py-32 overflow-hidden">
        <div className="container">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-20 items-center">
            <div className="reveal">
              <h2 className="text-[0.7rem] uppercase tracking-[0.4em] text-[#B8860B] font-bold mb-8">Artisan Roots</h2>
              <div
                className="prose prose-lg text-[#4A4A4A] leading-[2] text-[1.05rem] font-light prose-headings:font-heading prose-headings:italic prose-headings:text-3xl prose-headings:text-[#1d1d1f] prose-headings:mb-6"
                dangerouslySetInnerHTML={{ __html: page.content }}
              />
            </div>
            <div className="relative reveal delay-200">
              <div className="aspect-[4/5] rounded-3xl overflow-hidden shadow-2xl">
                <img
                  src="/images/udaipur-street.png"
                  alt="Udaipur Heritage Architecture"
                  className="w-full h-full object-cover"
                />
              </div>
              <div className="absolute -bottom-10 -left-10 bg-white p-10 rounded-2xl shadow-xl hidden md:block max-w-[280px]">
                <p className="text-3xl font-heading text-[#B8860B] mb-2">400+</p>
                <p className="text-sm uppercase tracking-widest text-[#1d1d1f] font-bold">Years of Artisan Tradition</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Royal Traditions Section */}
      <section className="py-24 bg-[#1d1d1f] text-white">
        <div className="container">
          <div className="max-w-[800px] mx-auto text-center mb-20 reveal">
            <h2 className="text-4xl md:text-5xl font-heading mb-8 italic">The Mewar <span className="text-[#B8860B]">Aesthetic</span></h2>
            <p className="text-white/60 text-lg font-light leading-relaxed">
              Our designs are deeply rooted in the aesthetic principles of the Mewar dynasty—balance, intricate detail, and a relentless pursuit of perfection.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
            {[
              {
                title: "Thikaikari",
                desc: "The traditional art of hand-embossing silver and white metal sheets onto solid wood cores.",
                icon: "✨"
              },
              {
                title: "Pachhikari",
                desc: "Intricate semi-precious stone inlay work on high-grade marble, inspired by the motifs of the Taj Lake Palace.",
                icon: "💎"
              },
              {
                title: "Inlay Work",
                desc: "The delicate assembly of Camel Bone or Mother of Pearl into floral and geometric masterpieces.",
                icon: "🐚"
              }
            ].map((item, idx) => (
              <div key={item.title} className={`p-10 bg-white/5 border border-white/10 rounded-3xl text-center reveal stagger-${idx + 1}`}>
                <div className="text-5xl mb-6">{item.icon}</div>
                <h4 className="text-xl font-heading text-[#B8860B] mb-4">{item.title}</h4>
                <p className="text-white/50 font-light text-sm leading-relaxed">{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Experience Section */}
      <section className="py-24 sm:py-32 bg-white">
        <div className="container">
          <div className="flex flex-col lg:flex-row gap-20 items-center">
            <div className="lg:w-1/2 order-2 lg:order-1 reveal">
              <div className="grid grid-cols-2 gap-4">
                <img src="/images/udaipur-artisan.png" className="rounded-2xl shadow-lg" alt="Udaipur Artisan at Work" />
                <img src="/images/udaipur-interior.png" className="rounded-2xl mt-12 shadow-lg" alt="Luxury Udaipur Interior" />
              </div>
            </div>
            <div className="lg:w-1/2 order-1 lg:order-2 reveal delay-200">
              <h2 className="text-[0.7rem] uppercase tracking-[0.4em] text-[#B8860B] font-bold mb-8">Visit Udaipur</h2>
              <h3 className="text-4xl font-heading text-[#1d1d1f] mb-8 italic">Experience the <span className="text-[#B8860B]">Magic In Person</span></h3>
              <p className="text-[#4A4A4A] leading-[2] font-light mb-10">
                We invite you to visit our studio in Udaipur. Breathe in the air that inspired kings and watch our artisans breathe life into raw materials. It is a sensory journey that transforms how you view luxury furniture.
              </p>
              <Link
                href="/contact"
                className="inline-block px-10 py-4 bg-[#1d1d1f] text-white rounded-full font-bold uppercase tracking-widest hover:bg-[#B8860B] transition-all"
              >
                Schedule a Visit
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Footer-like CTA */}
      <section className="py-20 border-t border-black/5 bg-[#FCFAF8]">
        <div className="container text-center">
          <h4 className="text-2xl font-heading text-[#1d1d1f] mb-8 italic">Bringing Udaipur to Your Home</h4>
          <Link href="/shop" className="text-[#B8860B] font-semibold uppercase tracking-[0.2em] border-b-2 border-[#B8860B] pb-2 hover:text-[#1d1d1f] hover:border-[#1d1d1f] transition-all">
            Explore the Collection
          </Link>
        </div>
      </section>
    </main>
  );
}
