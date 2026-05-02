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
    <section className="py-[var(--spacing-section)] bg-[#F9F7F5] overflow-hidden">
      <div className="max-w-[1600px] mx-auto px-[var(--spacing-container)]">
        
        {/* UNIQUE MOBILE VIEW: Heritage Registry Stack */}
        <div className="md:hidden flex flex-col gap-12 relative">
          {/* Decorative vertical line */}
          <div className="absolute left-6 top-0 bottom-0 w-[1px] bg-[var(--color-accent)]/20"></div>

          {features.map((f, i) => (
            <div 
              key={i} 
              className={`relative pl-12 reveal stagger-${i+1}`}
              style={{ transform: `rotate(${i % 2 === 0 ? '-0.5deg' : '0.5deg'})` }}
            >
              {/* Service Number/Badge */}
              <div className="absolute left-0 top-0 w-12 h-12 bg-white border border-[var(--color-accent)]/20 flex items-center justify-center rounded-full shadow-sm z-10">
                <span className="text-[0.6rem] font-heading text-[var(--color-accent)]">0{i+1}</span>
              </div>

              <div className="bg-white p-8 border border-black/[0.03] shadow-sm rounded-sm relative overflow-hidden group">
                 {/* Background stylized icon */}
                 <div className="absolute -right-4 -bottom-4 opacity-[0.03] scale-150 rotate-12 transition-transform duration-1000 group-hover:scale-125">
                    {f.icon}
                 </div>

                 <div className="relative z-10">
                    <div className="flex items-center gap-4 mb-4">
                       <div className="text-[var(--color-accent)]">
                          {/* Smaller version of icon */}
                          {f.icon}
                       </div>
                    </div>
                    <h3 className="text-xl font-heading mb-4 text-[var(--color-text-primary)]">{f.title}</h3>
                    <p className="text-[var(--color-text-secondary)] text-[0.85rem] font-light leading-relaxed italic">
                      "{f.desc}"
                    </p>
                 </div>
              </div>
            </div>
          ))}
        </div>

        {/* DESKTOP VIEW: Standard Premium Grid (Unchanged) */}
        <div className="hidden md:grid md:grid-cols-3 md:gap-20">
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
