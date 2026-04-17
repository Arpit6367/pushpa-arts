'use client';
import Image from 'next/image';
import { materials } from '@/constants/siteData';

export default function MaterialGrid() {
  return (
    <section className="py-[var(--spacing-section)] bg-[#F5F1EE] border-b border-[#E5E0DA]">
      <div className="max-w-[1600px] mx-auto px-[var(--spacing-container)]">
        <div className="text-left reveal">
          <h2 className="text-[clamp(2.2rem,5vw,3.8rem)] text-[#1F1F1F] font-heading mb-6">The Elements of Artistry</h2>
          <p className="text-[clamp(0.85rem,2vw,0.95rem)] text-[#4A4A4A] uppercase tracking-[0.2em] font-normal leading-relaxed max-w-[650px]">
            Discover pieces categorized by their core materials.
          </p>
        </div>

        <div className="grid grid-cols-2 lg:grid-cols-4 gap-6 mt-16">
          {materials.map((m, i) => (
            <div key={i} className={`relative aspect-[0.8] overflow-hidden group reveal stagger-${(i % 4) + 1}`}>
              <div className="w-full h-full relative">
                <Image 
                  src={m.image} 
                  alt={m.name} 
                  fill
                  className="object-cover transition-transform duration-[1.5s] group-hover:scale-110" 
                  sizes="(max-width: 640px) 50vw, 25vw"
                />
                <div className="absolute inset-0 p-10 flex flex-col justify-end bg-gradient-to-t from-black/70 to-transparent text-white">
                  <h3 className="text-[1.8rem] mb-2 font-heading">{m.name}</h3>
                  <p className="text-[0.6rem] uppercase tracking-[0.2em] opacity-80">{m.desc}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
