import { getPageBySlug } from '@/lib/cms';
import { getStudioPageMetadata } from '@/lib/metadata';
import { Truck, Globe, ShieldCheck, Box } from 'lucide-react';
import Link from 'next/link';

export async function generateMetadata() {
  return getStudioPageMetadata('shipping', 'Global white-glove logistics for luxury handcrafted furniture.');
}

export default async function ShippingPage() {
  const page = await getPageBySlug('shipping');
  if (!page) return notFound();

  return (
    <main className="bg-[#FCFAF8] min-h-screen pt-32 pb-20">
      <div className="container">
        {/* Header */}
        <header className="max-w-[900px] mb-20 reveal">
          <p className="text-[0.6rem] uppercase tracking-[0.5em] text-[#B8860B] font-bold mb-6">Global Logistics</p>
          <h1 className="text-4xl md:text-6xl font-heading mb-10 text-[#1d1d1f] italic leading-tight">
            {page.title}
          </h1>
          <div
            className="prose prose-lg text-[#4A4A4A] font-light leading-[1.8] prose-headings:font-heading prose-headings:text-2xl prose-headings:text-[#1d1d1f] prose-headings:mt-10 prose-headings:mb-6"
            dangerouslySetInnerHTML={{ __html: page.content }}
          />
        </header>

        {/* Global Reach Section */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 mb-32">
          {[
            {
              title: "USA & Canada",
              time: "6-8 Weeks",
              icon: Globe,
              desc: "Frequent shipments to New York, Los Angeles, Toronto, and Vancouver."
            },
            {
              title: "Europe & UK",
              time: "5-7 Weeks",
              icon: Globe,
              desc: "Dedicated handling for London, Paris, Berlin, and Zurich."
            },
            {
              title: "Middle East",
              time: "3-4 Weeks",
              icon: Globe,
              desc: "Seamless delivery to Dubai, Riyadh, Qatar, and Abu Dhabi."
            },
            {
              title: "Australia & NZ",
              time: "7-9 Weeks",
              icon: Globe,
              desc: "Comprehensive door-to-door service across the continent."
            }
          ].map((region, idx) => (
            <div key={region.title} className={`p-8 bg-white border border-black/5 rounded-3xl reveal stagger-${idx + 1} hover:shadow-xl transition-all group`}>
              <div className="w-12 h-12 bg-[#FCFAF8] rounded-full flex items-center justify-center mb-6 group-hover:bg-[#B8860B] group-hover:text-white transition-colors">
                <region.icon className="w-6 h-6" />
              </div>
              <h4 className="text-xl font-heading text-[#1d1d1f] mb-2">{region.title}</h4>
              <p className="text-[#B8860B] text-sm font-bold mb-4 uppercase tracking-widest">{region.time}</p>
              <p className="text-[#86868b] text-sm font-light leading-relaxed">{region.desc}</p>
            </div>
          ))}
        </div>

        {/* The Process */}
        <section className="mb-32">
          <div className="bg-[#1d1d1f] rounded-[40px] p-12 md:p-24 text-white">
            <h2 className="text-3xl md:text-5xl font-heading mb-16 text-center italic">Our <span className="text-[#B8860B]">Safe-Transit</span> Process</h2>

            <div className="grid grid-cols-1 md:grid-cols-4 gap-12 relative">
              {/* Connector Line (Hidden on Mobile) */}
              <div className="hidden md:block absolute top-1/2 left-0 w-full h-[1px] bg-white/10 -translate-y-1/2 z-0"></div>

              {[
                { step: "01", title: "Custom Crating", desc: "Each piece is secured in ISPM-15 certified wooden crates with multi-layer foam protection." },
                { step: "02", title: "Quality Audit", desc: "A final 24-point inspection before sealing the crate, documented with high-res photos." },
                { step: "03", title: "Secure Freight", desc: "Hand-loaded into ocean containers or air-freight skids by our specialized export team." },
                { step: "04", title: "Home Delivery", desc: "Final mile delivery with professional unpacking and debris removal (White Glove option)." }
              ].map((item, idx) => (
                <div key={item.title} className="relative z-10 bg-[#1d1d1f] reveal">
                  <div className="text-[4rem] font-heading text-white/5 mb-4">{item.step}</div>
                  <h4 className="text-xl font-heading text-[#B8860B] mb-4">{item.title}</h4>
                  <p className="text-white/50 text-sm font-light leading-relaxed">{item.desc}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Logistics FAQ / Insurance */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-20 items-center">
          <div className="reveal">
            <h2 className="text-3xl font-heading text-[#1d1d1f] mb-8 italic">Fully <span className="text-[#B8860B]">Insured Shipping</span></h2>
            <div className="space-y-8">
              <div className="flex gap-6">
                <div className="shrink-0 w-12 h-12 bg-[#34c759]/10 rounded-full flex items-center justify-center text-[#34c759]">
                  <ShieldCheck className="w-6 h-6" />
                </div>
                <div>
                  <h4 className="font-bold text-[#1d1d1f] mb-2">Comprehensive Cover</h4>
                  <p className="text-[#86868b] font-light leading-relaxed">We provide full transit insurance for the declared value of your shipment, covering any potential damage from studio to doorstep.</p>
                </div>
              </div>
              <div className="flex gap-6">
                <div className="shrink-0 w-12 h-12 bg-[#0071e3]/10 rounded-full flex items-center justify-center text-[#0071e3]">
                  <Box className="w-6 h-6" />
                </div>
                <div>
                  <h4 className="font-bold text-[#1d1d1f] mb-2">Real-time Tracking</h4>
                  <p className="text-[#86868b] font-light leading-relaxed">Once your order departs Udaipur, you will receive tracking coordinates via DHL, Maersk, or specialized furniture carriers.</p>
                </div>
              </div>
            </div>
          </div>
          <div className="reveal delay-200">
            <div className="p-10 bg-[#FCFAF8] border border-black/5 rounded-3xl">
              <h4 className="text-xl font-heading mb-6">Request a Shipping Quote</h4>
              <p className="text-[#86868b] font-light mb-8 text-sm">Shipping costs depend on weight, volume, and destination. For a precise landed cost estimate, please share your interest.</p>
              <Link
                href="/contact"
                className="block w-full py-4 bg-[#B8860B] text-white text-center rounded-full font-bold uppercase tracking-widest hover:bg-[#a67a0a] transition-all shadow-lg"
              >
                Inquire Now
              </Link>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}
