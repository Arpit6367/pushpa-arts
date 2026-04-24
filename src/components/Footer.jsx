import Link from 'next/link';
import {
  Send,
  MessageSquare,
  MessageCircle,
  Hash,
  Globe,
  HelpCircle,
  Truck,
  BookOpen,
  Users,
  Briefcase,
  Info,
  Home,
  ShieldCheck,
  FileText,
  Map,
  Phone,
  Mail,
  MapPin
} from 'lucide-react';

// Custom Brand Icons (since some might be missing in installed lucide-react version)
const FacebookIcon = (props) => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}>
    <path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z" />
  </svg>
);

const TwitterIcon = (props) => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}>
    <path d="M22 4s-.7 2.1-2 3.4c1.6 10-9.4 17.3-18 11.6 2.2.1 4.4-.6 6-2C3 15.5.5 9.6 3 5c2.2 2.6 5.6 4.1 9 4-.9-4.2 4-6.6 7-3.8 1.1 0 3-1.2 3-1.2z" />
  </svg>
);

const InstagramIcon = (props) => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}>
    <rect x="2" y="2" width="20" height="20" rx="5" ry="5" />
    <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z" />
    <line x1="17.5" y1="6.5" x2="17.51" y2="6.5" />
  </svg>
);

const YoutubeIcon = (props) => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}>
    <path d="M22.54 6.42a2.78 2.78 0 0 0-1.94-2C18.88 4 12 4 12 4s-6.88 0-8.6.42a2.78 2.78 0 0 0-1.94 2C1 8.14 1 12 1 12s0 3.86.42 5.58a2.78 2.78 0 0 0 1.94 2c1.71.42 8.6.42 8.6.42s6.88 0 8.6-.42a2.78 2.78 0 0 0 1.94-2C23 15.86 23 12 23 12s0-3.86-.42-5.58z" />
    <polygon points="9.75 15.02 15.5 12 9.75 8.98 9.75 15.02" />
  </svg>
);

const PinterestIcon = (props) => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}>
    <line x1="12" y1="8" x2="12" y2="16" />
    <line x1="8" y1="12" x2="16" y2="12" />
    <circle cx="12" cy="12" r="10" />
  </svg>
);

const RedditIcon = (props) => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}>
    <circle cx="12" cy="12" r="10" />
    <circle cx="9" cy="10" r="1" />
    <circle cx="15" cy="10" r="1" />
    <path d="M8 15s1.5 2 4 2 4-2 4-2" />
  </svg>
);

const FlickrIcon = (props) => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}>
    <circle cx="7" cy="12" r="3" fill="currentColor" stroke="none" />
    <circle cx="17" cy="12" r="3" fill="currentColor" stroke="none" />
  </svg>
);

export default function Footer({ settings = {}, categories = [] }) {
  const mainCategories = categories.filter(c => !c.parent_id);

  const conciergeLinks = [
    { name: 'Home', href: '/', icon: Home },
    { name: 'Our Story', href: '/about', icon: Info },
    { name: 'Contact Us', href: '/contact', icon: MessageSquare },
    { name: 'Our Projects', href: '/projects', icon: Briefcase },
    { name: 'Our Clients', href: '/clients', icon: Users },
    { name: 'Blogs', href: '/blogs', icon: BookOpen },
    { name: 'Shipping', href: '/shipping', icon: Truck },
    { name: 'About Udaipur', href: '/about-udaipur', icon: Map },
    { name: 'FAQ', href: '/faq', icon: HelpCircle },
    { name: 'Terms & Conditions', href: '/terms', icon: FileText },
    { name: 'Privacy Policy', href: '/privacy', icon: ShieldCheck },
    { name: 'Sitemap', href: '/sitemap', icon: Globe },
  ];

  const socialPlatforms = [
    { name: 'Facebook', icon: FacebookIcon, color: 'bg-[#3b5998]', href: 'https://www.facebook.com/PushpaExports/' },
    { name: 'Twitter', icon: TwitterIcon, color: 'bg-[#1da1f2]', href: 'https://x.com/exportspushpa' },
    { name: 'Pinterest', icon: PinterestIcon, color: 'bg-[#bd081c]', href: 'https://www.pinterest.com/pushpaexportsindia/' },
    { name: 'Instagram', icon: InstagramIcon, color: 'bg-[#e1306c]', href: 'https://www.instagram.com/pushpaexports/' },
    { name: 'Flickr', icon: FlickrIcon, color: 'bg-[#0063dc]', href: 'https://www.flickr.com/photos/pushpaexports/' },
    { name: 'Reddit', icon: RedditIcon, color: 'bg-[#ff4500]', href: 'https://reddit.com' },
    { name: 'Youtube', icon: YoutubeIcon, color: 'bg-[#ff0000]', href: 'https://www.youtube.com/@pushpaexports' },
  ];

  const connectPlatforms = [
    { name: 'WhatsApp', icon: MessageCircle, color: 'bg-[#25d366]', href: `https://wa.me/${(settings.whatsapp_number || '919414162629').replace(/[^0-9]/g, '')}` },
    { name: 'Telegram', icon: Send, color: 'bg-[#0088cc]', href: 'https://t.me/PushpaExports' },
    { name: 'Messenger', icon: MessageSquare, color: 'bg-white', href: 'https://m.me/PushpaExports' },
  ];

  const memberships = [
    { name: 'Make In India', logo: '🦁' },
    { name: 'MSME', logo: '🏢' },
    { name: 'UCCI', logo: '🏛️' },
    { name: 'EPCH', logo: '🌍' },
    { name: 'TradeIndia', logo: '🤝' },
    { name: 'Indiamart', logo: '💎' },
    { name: 'GST Certified', logo: '📜' },
    { name: 'HMA', logo: '🏺' },
  ];
  return (
    <footer className="relative bg-[#1A2F27] text-white overflow-hidden">
      {/* Newsletter Section */}
      <div className="pt-16 pb-12 border-b border-white/5">
        <div className="max-w-[1600px] mx-auto px-[var(--spacing-container)]">
          <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-10 lg:gap-20">
            <div className="max-w-[600px] reveal">
              <h3 className="text-2xl md:text-3xl font-heading mb-4 italic">Join Our Circle</h3>
              <p className="text-white/50 text-[0.95rem] font-light leading-relaxed">
                Stay inspired. Be the first to receive exclusive previews of our newest artisan collections and heritage design stories from Udaipur.
              </p>
            </div>
            <div className="flex-1 max-w-[500px] w-full reveal delay-100">
              <div className="flex flex-col sm:flex-row relative group">
                <input
                  type="email"
                  placeholder="YOUR EMAIL ADDRESS"
                  className="flex-1 bg-transparent border-b border-white/20 text-white text-[0.85rem] px-0 py-4 tracking-[0.1em] placeholder:text-white/30 focus:outline-none focus:border-[var(--color-accent)] transition-all duration-500"
                  suppressHydrationWarning
                />
                <button
                  className="bg-transparent border-b border-[var(--color-accent)] text-[var(--color-accent)] text-[0.75rem] uppercase font-bold tracking-[0.25em] px-6 py-4 sm:py-0 transition-all duration-500 hover:text-white hover:border-white whitespace-nowrap"
                  suppressHydrationWarning
                >
                  Subscribe
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Main Footer Content */}
      <div className="py-16 sm:py-20">
        <div className="max-w-[1600px] mx-auto px-[var(--spacing-container)]">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-12 lg:gap-16">
            <div className="reveal">
              <div className="mb-8">
                <img src="/images/Pushpa-Exports.svg" alt="Pushpa Exports" className="h-14 w-auto brightness-0 invert" />
              </div>
              <p className="text-[0.9rem] leading-[2] text-white/70 mb-10">
                Born in the historic city of Udaipur, Pushpa Exports represents generations of refined craftsmanship. We preserve the royal art of Inlay and Carving.
              </p>

              {/* Detailed Contact Section (Image Match) */}
              <div className="space-y-6 pt-6 border-t border-white/5">
                <div className="flex items-center gap-4 text-white group">
                  <div className="w-10 h-10 flex items-center justify-center rounded-full bg-white/5 group-hover:bg-[var(--color-accent)] transition-all duration-300">
                    <Phone className="w-4 h-4" />
                  </div>
                  <div className="flex flex-col">
                    <a href="tel:+919829505921" className="text-[1rem] hover:text-[var(--color-accent)] transition-colors tracking-wide">+91-9829505921</a>
                    <a href="tel:+919352521265" className="text-[1rem] hover:text-[var(--color-accent)] transition-colors tracking-wide">+91-9352521265</a>
                  </div>
                </div>

                <div className="flex items-center gap-4 text-white group">
                  <div className="w-10 h-10 flex items-center justify-center rounded-full bg-white/5 group-hover:bg-[var(--color-accent)] transition-all duration-300">
                    <Mail className="w-4 h-4" />
                  </div>
                  <a href="mailto:info@pushpaarts.com" className="text-[1rem] hover:text-[var(--color-accent)] transition-colors tracking-wide">info@pushpaarts.com</a>
                </div>

                <div className="flex items-start gap-4 text-white group">
                  <div className="w-10 h-10 flex items-center justify-center rounded-full bg-white/5 group-hover:bg-[var(--color-accent)] transition-all duration-300 mt-1">
                    <MapPin className="w-4 h-4" />
                  </div>
                  <div className="flex flex-col text-white/80 text-[0.95rem] leading-relaxed">
                    <p className="font-semibold text-white mb-1">Pushpa Exports,</p>
                    <p>N.H. - 8, Bhuwana Handicraft</p>
                    <p>Bazar, Bhuwana, Udaipur,</p>
                    <p>Rajasthan 313001</p>
                  </div>
                </div>

                <div className="pt-4">
                  <a
                    href="https://www.google.com/maps/dir//Pushpa+Exports,+N.H.+-+8,+Bhuwana+Handicraft+Bazar,+Bhuwana,+Udaipur,+Rajasthan+313001"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-block w-full max-w-[280px] bg-[var(--color-accent)] text-white py-4 px-8 text-center text-[0.75rem] font-bold uppercase tracking-[0.35em] transition-all hover:bg-white hover:text-[var(--color-accent)] shadow-xl"
                  >
                    Directions
                  </a>
                </div>
              </div>
            </div>

            <div className="reveal delay-100">
              <h4 className="font-semibold uppercase tracking-[0.15em] text-[var(--color-accent)] mb-8 text-[1rem] border-b border-[var(--color-accent)]/30 pb-2 inline-block">Collections</h4>
              <ul className="flex flex-col gap-1">
                {mainCategories.length > 0 ? mainCategories.map(cat => (
                  <li key={cat.id}><Link href={`/product-category/${cat.slug_path}`} className="text-white hover:text-[var(--color-accent)] block py-2 text-[1rem] transition-all duration-300 hover:translate-x-1.5 hover:pl-1">{cat.name}</Link></li>
                )) : (
                  <>
                    <li><Link href="/product-category/silver-furniture" className="text-white hover:text-[var(--color-accent)] block py-2 text-[1rem] transition-all duration-300 hover:translate-x-1.5 hover:pl-1">Silver Furniture</Link></li>
                    <li><Link href="/product-category/bone-inlay-furniture" className="text-white hover:text-[var(--color-accent)] block py-2 text-[1rem] transition-all duration-300 hover:translate-x-1.5 hover:pl-1">Bone Inlay</Link></li>
                    <li><Link href="/product-category/mop-inlay-furniture" className="text-white hover:text-[var(--color-accent)] block py-2 text-[1rem] transition-all duration-300 hover:translate-x-1.5 hover:pl-1">Mother of Pearl</Link></li>
                    <li><Link href="/product-category/marble-stone-furniture" className="text-white hover:text-[var(--color-accent)] block py-2 text-[1rem] transition-all duration-300 hover:translate-x-1.5 hover:pl-1">Marble & Stone</Link></li>
                  </>
                )}
              </ul>
            </div>

            <div className="reveal delay-200">
              <h4 className="font-semibold uppercase tracking-[0.15em] text-[var(--color-accent)] mb-8 text-[1rem] border-b border-[var(--color-accent)]/30 pb-2 inline-block">Concierge</h4>
              <ul className="grid grid-cols-1 gap-1">
                {conciergeLinks.map(link => (
                  <li key={link.name}>
                    <Link href={link.href} className="text-white block py-1.5 text-[1rem] transition-all duration-300 hover:text-[var(--color-accent)] hover:translate-x-1.5 hover:pl-1">
                      {link.name}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>

            <div className="reveal delay-300">
              <h4 className="font-semibold uppercase tracking-[0.15em] text-white mb-8 text-[0.7rem] border-b border-white pb-1 inline-block">CONNECT WITH US</h4>
              <div className="flex flex-wrap gap-2 mb-12">
                {connectPlatforms.map(platform => (
                  <a
                    key={platform.name}
                    href={platform.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    className={`w-12 h-12 ${platform.color} ${platform.name === 'Messenger' ? 'text-[#0084ff]' : 'text-white'} flex items-center justify-center rounded-sm transition-transform hover:scale-110 active:scale-95 shadow-lg`}
                    title={platform.name}
                  >
                    <platform.icon className="w-6 h-6" />
                  </a>
                ))}
              </div>

              <h4 className="font-semibold uppercase tracking-[0.15em] text-white mb-8 text-[0.7rem] border-b border-white pb-1 inline-block">OUR SOCIALS</h4>
              <div className="flex flex-wrap gap-2">
                {socialPlatforms.map(platform => (
                  <a
                    key={platform.name}
                    href={platform.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    className={`w-12 h-12 ${platform.color} text-white flex items-center justify-center rounded-sm transition-transform hover:scale-110 active:scale-95 shadow-lg`}
                    title={platform.name}
                  >
                    <platform.icon className="w-6 h-6" />
                  </a>
                ))}
              </div>
            </div>
          </div>

          {/* Memberships Section */}
          {/* <div className="mt-24 pt-16 border-t border-white/5 reveal">
             <h4 className="font-semibold uppercase tracking-[0.3em] text-white mb-12 text-[0.75rem] border-b border-white pb-1 inline-block">OUR MEMBERSHIPS</h4>
             <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-8 gap-4 md:gap-5 items-center">
                {memberships.map(m => (
                  <div key={m.name} className="bg-white p-3 aspect-square flex flex-col items-center justify-center gap-2 rounded-sm transition-all duration-500 hover:shadow-2xl hover:-translate-y-1 group">
                    <div className="flex-1 flex items-center justify-center w-full">
                       <span className="text-3xl filter group-hover:scale-110 transition-transform">{m.logo}</span>
                    </div>
                    <span className="text-[0.45rem] uppercase tracking-widest font-bold text-black text-center leading-tight">{m.name}</span>
                  </div>
                ))}
             </div>
          </div> */}

          {/* Bottom Bar */}
          <div className="border-t border-white/8 mt-16 pt-8 pb-4">
            <div className="flex flex-col md:flex-row justify-between items-center gap-4">
              <p className="text-[0.75rem] text-white/30 tracking-wide">© {new Date().getFullYear()} Pushpa Exports — All Rights Reserved</p>
              <div className="font-heading italic text-[var(--color-accent)]/60 text-sm tracking-wide">Preserving Royal Udaipur Craftsmanship Since Generations</div>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}
