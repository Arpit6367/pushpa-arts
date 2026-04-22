'use client';
import { Sparkles, Shield, Clock, Globe } from 'lucide-react';

const features = [
  { icon: <Sparkles className="w-4 h-4" />, text: "Artisan Handcrafted" },
  { icon: <Shield className="w-4 h-4" />, text: "Lifetime Quality Guarantee" },
  { icon: <Globe className="w-4 h-4" />, text: "Worldwide Insured Shipping" },
  { icon: <Clock className="w-4 h-4" />, text: " generations of Heritage" },
];

export default function FeatureBar() {
  return (
    <div className="bg-[var(--color-secondary)] text-white py-4 border-b border-white/10">
      <div className="max-w-[1600px] mx-auto px-[var(--spacing-container)]">
        <div className="flex flex-wrap justify-center md:justify-between items-center gap-6">
          {features.map((f, i) => (
            <div key={i} className="flex items-center gap-3">
              <span className="text-[var(--color-accent)]">{f.icon}</span>
              <span className="text-[0.6rem] uppercase tracking-[0.2em] font-bold">{f.text}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
