'use client';
import Link from 'next/link';
import Image from 'next/image';

export default function CommissionSection() {
  return (
    <section className="py-[var(--spacing-section)] bg-[#F5F1EE] reveal">
      <div className="max-w-[1600px] mx-auto px-[var(--spacing-container)]">
        <div className="grid grid-cols-1 lg:grid-cols-2 items-center gap-16 lg:gap-32">
          <div className="reveal">
            <span className="text-[#B8860B] uppercase tracking-[0.2em] font-bold">Inquiry</span>
            <h2 className="text-[#1F1F1F] font-heading text-[3.5rem] mt-6 leading-none">Commission a <br />Masterpiece</h2>
            <p className="text-[1rem] text-[#4A4A4A] leading-[1.9] font-light max-w-[500px] my-8">
              Your vision, our heritage. We offer complete customization for our entire collection, allowing you to select specific motifs, materials, and dimensions to suit your unique space.
            </p>
            <ul className="flex flex-col gap-5 my-8">
              <li className="flex items-center gap-4 text-[0.9rem] text-[#4A4A4A]"><span className="text-[#B8860B] text-xs">●</span> Custom Dimensions & Layouts</li>
              <li className="flex items-center gap-4 text-[0.9rem] text-[#4A4A4A]"><span className="text-[#B8860B] text-xs">●</span> Choice of Silver, Bone, or MOP</li>
              <li className="flex items-center gap-4 text-[0.9rem] text-[#4A4A4A]"><span className="text-[#B8860B] text-xs">●</span> Direct Consultation with Master Artisans</li>
            </ul>
            <Link href="/contact" className="inline-block px-12 py-5 bg-[#B8860B] text-white text-[0.7rem] uppercase tracking-[0.2em] font-semibold transition-all shadow-xl hover:bg-white hover:text-[#1F1F1F]">Inquire for Customization</Link>
          </div>
          <div className="reveal delay-200 aspect-square relative mt-16 md:mt-0">
            <Image 
              src="/images/hero-luxury-1.png" 
              alt="Custom Silver Throne" 
              fill 
              className="object-cover object-[center_20%]" 
              sizes="(max-width: 1024px) 100vw, 50vw"
            />
            <div className="absolute -bottom-10 -left-10 md:left-auto md:-right-10 bg-white p-10 shadow-2xl max-w-[300px] z-10 w-[80%]">
              <p className="italic text-[0.95rem] text-[#1F1F1F] leading-relaxed">"The attention to detail in our custom bone inlay dresser was remarkable. A true heirloom."</p>
              <p className="mt-4 text-[0.7rem] uppercase tracking-[0.15em] font-bold text-[#4A4A4A]">— Private Collector, London</p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
