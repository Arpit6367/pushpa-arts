'use client';
import { Truck, ShieldCheck, Heart } from 'lucide-react';

const features = [
  {
    icon: <Truck className="w-8 h-8 stroke-[1.5px] text-[var(--color-accent)]" />,
    title: "Worldwide Shipping",
    desc: "Exquisite pieces delivered from our artisan workshops in Udaipur to your doorstep, anywhere in the world."
  },
  {
    icon: <ShieldCheck className="w-8 h-8 stroke-[1.5px] text-[var(--color-accent)]" />,
    title: "Authentic Craftsmanship",
    desc: "Every item is handcrafted by master artisans using traditional techniques passed down through generations."
  },
  {
    icon: <Heart className="w-8 h-8 stroke-[1.5px] text-[var(--color-accent)]" />,
    title: "Personalized Care",
    desc: "Dedicated support to help you find or customize the perfect masterpiece for your space."
  }
];

export default function InfoSection() {
  return (
    <section className="py-24 bg-[var(--color-bg-mint)] reveal">
      <div className="max-w-[1600px] mx-auto px-[var(--spacing-container)]">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-16">
          {features.map((f, i) => (
            <div key={i} className="flex flex-col items-center text-center">
              <div className="mb-6 p-4 bg-white rounded-full shadow-sm">
                {f.icon}
              </div>
              <h3 className="text-xl font-heading mb-4 text-[var(--color-text-primary)]">{f.title}</h3>
              <p className="text-[var(--color-text-secondary)] text-sm leading-relaxed max-w-[300px]">
                {f.desc}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
