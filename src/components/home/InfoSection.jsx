'use client';
import { Truck, ShieldCheck, Heart } from 'lucide-react';

const features = [
  {
    icon: <Truck className="w-10 h-10 stroke-[1.2px] text-[var(--color-accent)]" />,
    title: "Global Export",
    desc: "Exquisite pieces delivered from our artisan workshops in Udaipur to your doorstep, anywhere in the world."
  },
  {
    icon: <ShieldCheck className="w-10 h-10 stroke-[1.2px] text-[var(--color-accent)]" />,
    title: "Generational Mastery",
    desc: "Every item is handcrafted by master artisans using traditional techniques passed down through generations."
  },
  {
    icon: <Heart className="w-10 h-10 stroke-[1.2px] text-[var(--color-accent)]" />,
    title: "Bespoke Concierge",
    desc: "Dedicated support to help you find or customize the perfect masterpiece for your space."
  }
];

export default function InfoSection() {
  return (
    <section className="py-24 sm:py-32 bg-[#F9F7F5] overflow-hidden">
      <div className="max-w-[1600px] mx-auto px-[var(--spacing-container)]">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-16 md:gap-20">
          {features.map((f, i) => (
            <div key={i} className={`flex flex-col items-center text-center reveal stagger-${i+1}`}>
              <div className="mb-10 relative group">
                <div className="absolute -inset-4 bg-[var(--color-accent)]/5 rounded-full scale-0 group-hover:scale-100 transition-transform duration-500"></div>
                <div className="relative z-10 transition-transform duration-500 group-hover:-translate-y-2">
                  {f.icon}
                </div>
              </div>
              <h3 className="text-xl md:text-2xl font-heading mb-6 text-[var(--color-text-primary)]">{f.title}</h3>
              <p className="text-[var(--color-text-secondary)] text-[0.95rem] font-light leading-[1.8] max-w-[320px]">
                {f.desc}
              </p>
              <div className="w-0 h-[1px] bg-[var(--color-accent)] mt-8 group-hover:w-12 transition-all duration-700"></div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
