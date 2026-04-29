import Image from 'next/image';
import { getPageBySlug } from '@/lib/cms';
import { getStudioPageMetadata } from '@/lib/metadata';

export async function generateMetadata() {
  return getStudioPageMetadata('about', 'Learn about Pushpa Exports, our heritage, and our commitment to handcrafted excellence since 1982.');
}

export default async function AboutPage() {
  const page = await getPageBySlug('about');

  // If the page content in DB is more than just the default dummy content, we use it.
  // Otherwise we use the premium hardcoded template.
  const isCustomContent = page && page.content && page.content.length > 200;

  if (isCustomContent) {
    return (
      <main className="pt-32 pb-20">
        <div className="max-w-[1200px] mx-auto px-[var(--spacing-container)]">
          <h1 className="text-4xl md:text-5xl font-heading mb-10">{page.title}</h1>
          <div
            className="prose prose-lg max-w-none prose-headings:font-heading prose-p:text-black/70 prose-p:leading-relaxed"
            dangerouslySetInnerHTML={{ __html: page.content }}
          />
        </div>
      </main>
    );
  }

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "AboutPage",
            "name": page?.title || "About Pushpa Exports",
            "description": page?.meta_description || "Learn about Pushpa Exports, a renowned manufacturer and exporter of luxury handcrafted furniture based in Udaipur, Rajasthan, India.",
            "publisher": {
              "@type": "Organization",
              "name": "Pushpa Exports",
              "logo": "https://pushpaexports.com/images/Pushpa-Exports.svg"
            }
          })
        }}
      />

      {/* Hero Section */}
      <div className="relative h-[70vh] min-h-[600px] flex items-center overflow-hidden">
        <Image
          src="/images/about_hero.png"
          alt="Pushpa Exports Luxury Showroom"
          fill
          className="object-cover"
          priority
        />
        <div className="absolute inset-0 bg-gradient-to-r from-black/70 via-black/40 to-black/20"></div>
        <div className="container relative z-10 text-white">
          <div className="max-w-[800px] reveal">
            <p className="text-[0.6rem] uppercase tracking-[0.5em] text-[#B8860B] font-bold mb-6 reveal stagger-1">Est. Udaipur</p>
            <h1 className="text-[clamp(2.5rem,8vw,4rem)] font-heading leading-tight mb-6 reveal stagger-2">
              Legacy of <span className="text-[#B8860B] italic">Craft</span>
            </h1>
            <div className="w-24 h-[2px] bg-gradient-to-r from-[#B8860B] to-transparent mb-8 reveal stagger-3"></div>
            <p className="text-[1rem] md:text-[1.15rem] font-light leading-relaxed opacity-85 max-w-[600px] reveal stagger-4">
              Preserving the royal heritage of Udaipur through bespoke luxury furniture that transcends generations.
            </p>
          </div>
        </div>
      </div>

      {/* Breadcrumb Bar */}
      <div className="bg-[#F5F1EE] py-6 border-b border-[#E5E0DA]">
        <div className="container">
          <div className="flex flex-wrap items-center gap-2 text-[0.7rem] tracking-[0.2em] uppercase text-[#1F1F1F]">
            <a href="/" className="opacity-60 hover:opacity-100 transition-opacity">Home</a>
            <span className="opacity-30">/</span>
            <span className="font-semibold text-[#B8860B]">The Atelier</span>
          </div>
        </div>
      </div>

      {/* Our Story Section */}
      <section className="py-[clamp(5rem,10vw,9rem)] bg-[#FCFAF8]">
        <div className="container">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 lg:gap-32 items-center mb-32">
            <div className="reveal relative group">
              <div className="aspect-[4/5] relative rounded-[4px] overflow-hidden shadow-2xl">
                <Image
                  src="/images/about_craftsmanship.png"
                  alt="Artisanal Craftsmanship"
                  fill
                  className="object-cover transition-transform duration-1000 group-hover:scale-105"
                />
              </div>
              <div className="absolute -bottom-10 -right-10 w-48 h-48 bg-[#B8860B] hidden lg:flex items-center justify-center p-8 text-white text-center">
                <p className="text-[0.7rem] uppercase tracking-[0.2em] font-bold leading-relaxed">
                  Generations of Mastery
                </p>
              </div>
            </div>
            <div className="reveal delay-200">
              <h2 className="font-heading text-[clamp(2.2rem,5vw,3.2rem)] text-[#1F1F1F] mb-6 leading-[1.1]">
                A Heritage of <br />
                <span className="text-[#B8860B] italic">Excellence</span>
              </h2>
              <div className="space-y-6 text-[#4A4A4A] leading-[2.1] text-[1rem] font-light">
                <p>
                  Pushpa Exports is a renowned manufacturer and exporter of luxury handcrafted
                  furniture based in the historic city of Udaipur, Rajasthan. For decades,
                  our family has been dedicated to preserving and promoting the art of traditional
                  Indian craftsmanship, once reserved for the palaces of Rajput royalty.
                </p>
                <p>
                  Our skilled artisans, many of whom come from families with centuries-old woodworking
                  and inlay traditions, create furniture that seamlessly blends traditional aesthetics with
                  contemporary luxury. Every piece is a testament to the patient dedication that manual
                  artistry demands.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Mission Section */}
      <section className="py-[clamp(5rem,10vw,9rem)] bg-[#1F1F1F] text-white overflow-hidden">
        <div className="container">
          <div className="grid grid-cols-1 lg:grid-cols-[0.8fr_1.2fr] gap-16 lg:gap-24 items-center">
            <div className="reveal">
              <h5 className="text-[#B8860B] uppercase tracking-[0.4em] text-[0.65rem] font-bold mb-6">Our Mission</h5>
              <h2 className="font-heading text-[clamp(2.2rem,5vw,3.5rem)] mb-10 italic">
                Bridging the gap between <span className="text-[#B8860B]">ancient art</span> and modern luxury.
              </h2>
              <p className="text-[1.1rem] leading-relaxed opacity-70 font-light mb-12">
                We believe that furniture is not just functional; it is an expression of culture and history.
                Our mission is to bring the soul of Udaipur's artistry into the world's most elegant homes,
                ensuring that traditional techniques survive and thrive in a modern world.
              </p>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-8 sm:gap-6">
                {[
                  { value: '100%', label: 'Handcrafted' },
                  { value: '25+', label: 'Countries' },
                  { value: '500+', label: 'Artisans' },
                  { value: '30+', label: 'Years' },
                ].map((stat, idx) => (
                  <div key={idx} className="text-center sm:text-left">
                    <h4 className="text-3xl sm:text-2xl font-heading text-[#B8860B] mb-2">{stat.value}</h4>
                    <p className="text-[0.6rem] uppercase tracking-[0.2em] opacity-50">{stat.label}</p>
                  </div>
                ))}
              </div>
            </div>
            <div className="reveal delay-200 relative overflow-hidden">
              <div className="aspect-video relative rounded-[4px] overflow-hidden grayscale hover:grayscale-0 transition-all duration-700">
                <Image
                  src="/images/about_mission.png"
                  alt="Artisans Working"
                  fill
                  className="object-cover"
                />
              </div>
              <div className="absolute -top-8 -left-8 w-32 h-32 border-t-2 border-l-2 border-[#B8860B] hidden md:block"></div>
              <div className="absolute -bottom-8 -right-8 w-32 h-32 border-b-2 border-r-2 border-[#B8860B] hidden md:block"></div>
            </div>
          </div>
        </div>
      </section>

      {/* Materials & Mastery */}
      <section className="py-[clamp(5rem,10vw,9rem)] bg-[#FCFAF8]">
        <div className="container">
          <div className="text-center max-w-[800px] mx-auto mb-20 reveal">
            <h2 className="font-heading text-[clamp(2.5rem,5vw,3.8rem)] text-[#1F1F1F] mb-6 italic">
              Premium <span className="text-[#B8860B]">Materials</span>
            </h2>
            <p className="text-[#8C8C8C] leading-relaxed font-light">
              Each piece begins with the selection of the finest natural materials, sourced responsibly and chosen for their lasting beauty.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 reveal">
            {[
              { title: "Pure Silver", desc: "Ornate silver plating and solid silver accents for a regal finish.", icon: "✨" },
              { title: "Natural Bone", desc: "Ethically sourced bone inlay, meticulously hand-cut and set.", icon: "🦴" },
              { title: "Marble & Stone", desc: "Rare marbles and gemstones from the heart of Rajasthan.", icon: "💎" }
            ].map((item, idx) => (
              <div key={idx} className="p-12 bg-white border border-[#F0EDE6] hover:border-[#B8860B]/30 transition-all duration-500 group hover:-translate-y-2 hover:shadow-xl hover:shadow-[#B8860B]/5">
                <div className="text-4xl mb-8 grayscale group-hover:grayscale-0 transition-all duration-500">{item.icon}</div>
                <h3 className="font-heading text-2xl mb-4 text-[#1F1F1F]">{item.title}</h3>
                <p className="text-[#8C8C8C] text-[0.95rem] font-light leading-relaxed">{item.desc}</p>
                <div className="w-0 h-[2px] bg-[#B8860B] mt-8 group-hover:w-16 transition-all duration-500"></div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Call to Action */}
      <section className="py-[clamp(5rem,10vw,9rem)] bg-white">
        <div className="container">
          <div className="bg-gradient-to-br from-[#1F1F1F] to-[#2A2A2A] p-8 sm:p-12 md:p-24 relative overflow-hidden text-center text-white rounded-[4px] reveal">
            <div className="relative z-10">
              <p className="text-[0.6rem] uppercase tracking-[0.5em] text-[#B8860B] font-bold mb-6">Commission a Masterpiece</p>
              <h2 className="font-heading text-[clamp(2rem,5vw,3.5rem)] mb-8 italic">
                Have a custom <span className="text-[#B8860B]">vision</span>?
              </h2>
              <p className="text-[1.05rem] opacity-60 mb-12 max-w-[600px] mx-auto font-light leading-relaxed">
                Our master designers and artisans are ready to bring your bespoke furniture concepts to life. Let's create something extraordinary together.
              </p>
              <a href="/contact" className="inline-block bg-[#B8860B] text-white px-10 sm:px-12 py-4 sm:py-5 text-[0.7rem] font-bold uppercase tracking-[0.3em] hover:bg-white hover:text-[#1F1F1F] transition-all duration-500 hover:-translate-y-1 hover:shadow-2xl">
                Start a Collaboration
              </a>
            </div>
            {/* Decorative elements */}
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[150%] h-[150%] border border-white/5 rounded-full pointer-events-none"></div>
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[100%] h-[100%] border border-white/3 rounded-full pointer-events-none"></div>
          </div>
        </div>
      </section>
    </>
  );
}
