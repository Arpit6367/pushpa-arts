'use client';
import Image from 'next/image';

export default function ProcessSection() {
  return (
    <section className="relative h-[100svh] min-h-[800px] overflow-hidden reveal">
      <div className="absolute inset-0 z-0">
        <Image 
          src="/images/workshop-ambient.png" 
          alt="Artisan Workshop" 
          fill 
          className="object-cover" 
          sizes="100vw"
        />
        <div className="absolute inset-0 bg-black/40" />
      </div>

      <div className="relative h-full flex items-center max-w-[1600px] mx-auto px-[var(--spacing-container)] z-10">
        <div className="bg-[#FCFAF8] p-[clamp(3rem,10vw,6rem)] max-w-[750px] relative shadow-2xl reveal">
          <span className="uppercase tracking-[0.3em] text-[#B8860B] font-bold">The Process</span>
          <h2 className="text-[#1F1F1F] font-heading text-[clamp(2.5rem,6vw,4rem)] font-light leading-[0.95] my-6">
            Slow Made, <br />Forever Loved
          </h2>
          <p className="my-10 text-[1.1rem] font-light leading-loose text-[#1F1F1F]">
            A single bone inlay dresser takes over 4 weeks of hand-carving and precision placement. This is not manufacturing; this is a slow conversation between wood, bone, and artist.
          </p>
          <div className="flex flex-wrap gap-20 mt-16 border-t border-[#E5E0DA] pt-10">
            <div>
              <strong className="block text-[2.8rem] font-heading text-[#B8860B] leading-none mb-2">300+</strong> 
              <span className="text-[0.65rem] uppercase tracking-[0.2em] text-[#8C8C8C] font-semibold">Hours/Piece</span>
            </div>
            <div>
              <strong className="block text-[2.8rem] font-heading text-[#B8860B] leading-none mb-2">100%</strong> 
              <span className="text-[0.65rem] uppercase tracking-[0.2em] text-[#8C8C8C] font-semibold">Handmade</span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
