'use client';
import { Sparkles, Shield, Clock, Globe } from 'lucide-react';

const features = [
  { icon: <Sparkles className="w-4 h-4" />, text: "Artisan Handcrafted" },
  { icon: <Shield className="w-4 h-4" />, text: "Lifetime Quality Guarantee" },
  { icon: <Globe className="w-4 h-4" />, text: "Worldwide Insured Shipping" },
  { icon: <Clock className="w-4 h-4" />, text: "Generations of Heritage" },
];

export default function FeatureBar() {
  return (
    <div className="bg-[var(--color-secondary)] text-white py-5 border-b border-white/5 overflow-hidden">
      <div className="max-w-[1600px] mx-auto px-[var(--spacing-container)]">
        <div className="flex flex-wrap justify-center lg:justify-between items-center gap-y-4 gap-x-8 lg:gap-x-6">
          {features.map((f, i) => (
            <div key={i} className="flex items-center gap-3 group">
              <span className="text-[var(--color-accent)] transition-transform duration-300 group-hover:scale-125 group-hover:rotate-12">{f.icon}</span>
              <span className="text-[0.6rem] uppercase tracking-[0.2em] font-bold text-white/80 group-hover:text-white transition-colors duration-300">{f.text}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
