import Link from 'next/link';

export default function Footer() {
  return (
    <footer className="pt-24 bg-[#1F1F1F] text-white">
      <div className="max-w-[1600px] mx-auto px-[var(--spacing-container)]">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-16">
          <div className="reveal">
            <div className="mb-8">
              <img src="/images/Pushpa-Exports.svg" alt="Pushpa Arts" style={{ height: '70px', width: 'auto' }} className="brightness-0 invert sepia-0 saturate-0" />
            </div>
            <h4 className="font-semibold uppercase tracking-[0.1em] text-[#B8860B] mb-8 text-xs">Our Heritage</h4>
            <p className="text-[0.95rem] leading-loose text-[#8C8C8C]">
              Born in the historic city of Udaipur, Pushpa Arts represents generations of refined craftsmanship. 
              We preserve the royal art of Inlay and Carving, bringing timeless Rajasthani elegance to the world's most distinguished interiors.
            </p>
          </div>

          <div className="reveal delay-100">
            <h4 className="font-semibold uppercase tracking-[0.1em] text-[#B8860B] mb-8 text-xs">Collections</h4>
            <ul className="flex flex-col gap-1">
              <li><Link href="/product-category/silver-furniture" className="text-[#8C8C8C] block py-1.5 text-[0.95rem] transition-all duration-300 hover:text-white hover:translate-x-1">Silver Legacy</Link></li>
              <li><Link href="/product-category/bone-inlay-furniture" className="text-[#8C8C8C] block py-1.5 text-[0.95rem] transition-all duration-300 hover:text-white hover:translate-x-1">Bone Inlay Masters</Link></li>
              <li><Link href="/product-category/mop-inlay-furniture" className="text-[#8C8C8C] block py-1.5 text-[0.95rem] transition-all duration-300 hover:text-white hover:translate-x-1">Mother of Pearl</Link></li>
              <li><Link href="/product-category/marble-stone-furniture" className="text-[#8C8C8C] block py-1.5 text-[0.95rem] transition-all duration-300 hover:text-white hover:translate-x-1">Marble Masterpieces</Link></li>
            </ul>
          </div>

          <div className="reveal delay-200">
            <h4 className="font-semibold uppercase tracking-[0.1em] text-[#B8860B] mb-8 text-xs">Concierge</h4>
            <ul className="flex flex-col gap-1">
              <li><Link href="/about" className="text-[#8C8C8C] block py-1.5 text-[0.95rem] transition-all duration-300 hover:text-white hover:translate-x-1">The Artisan Story</Link></li>
              <li><Link href="/contact" className="text-[#8C8C8C] block py-1.5 text-[0.95rem] transition-all duration-300 hover:text-white hover:translate-x-1">Bespoke Inquiry</Link></li>
              <li><Link href="/admin" className="text-[#8C8C8C] block py-1.5 text-[0.95rem] transition-all duration-300 hover:text-white hover:translate-x-1">Craftsman Portal</Link></li>
              <li><Link href="/privacy" className="text-[#8C8C8C] block py-1.5 text-[0.95rem] transition-all duration-300 hover:text-white hover:translate-x-1">Privacy & Heritage</Link></li>
            </ul>
          </div>

          <div className="reveal delay-300">
            <h4 className="font-semibold uppercase tracking-[0.1em] text-[#B8860B] mb-8 text-xs">Connect</h4>
            <ul className="flex flex-col gap-1 text-[#8C8C8C] text-[0.95rem]">
              <li className="py-1.5">Udaipur, Rajasthan, India</li>
              <li className="py-1.5">bespoke@pushpaarts.com</li>
              <li className="py-1.5">+91 94141 62629</li>
            </ul>
          </div>
        </div>

        <div className="border-t border-white/10 mt-16 py-10 flex flex-col md:flex-row justify-between items-center gap-4">
          <p className="text-[0.8rem] text-[#8C8C8C]">© {new Date().getFullYear()} Pushpa Arts — Handcrafted Excellence.</p>
          <div className="font-heading italic text-[#B8860B] text-lg">Preserving Royale Udaipur Craftsmanship</div>
        </div>
      </div>
    </footer>
  );
}
