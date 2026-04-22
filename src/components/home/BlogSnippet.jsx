'use client';
import Image from 'next/image';
import Link from 'next/link';

const posts = [
  {
    image: '/images/hero-refined-1.png',
    category: 'Design Trends',
    title: 'How Bone Inlay is Reclaiming Modern Luxury Interiors',
    date: 'April 12, 2026'
  },
  {
    image: '/images/hero-luxury-3.png',
    category: 'Heritage',
    title: 'The Secret Art of Silver Foiling: A Udaipur Legacy',
    date: 'March 28, 2026'
  },
  {
    image: '/images/bespoke_interior.png',
    category: 'Style Guide',
    title: '5 Ways to Style Marble Inlay in a Contemporary Home',
    date: 'March 15, 2026'
  }
];

export default function BlogSnippet() {
  return (
    <section className="py-[var(--spacing-section)] bg-white">
      <div className="max-w-[1600px] mx-auto px-[var(--spacing-container)]">
        <div className="text-center mb-20">
          <span className="text-[var(--color-accent)] uppercase tracking-[0.4em] font-bold text-[0.6rem] mb-4 block">Our Journal</span>
          <h2 className="text-[clamp(2.5rem,5vw,3.5rem)] font-heading text-[var(--color-text-primary)]">Latest From The Studio</h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
          {posts.map((post, i) => (
            <Link key={i} href="/blog" className="group block">
              <div className="relative aspect-[1.5] overflow-hidden mb-8">
                <Image 
                  src={post.image} 
                  alt={post.title}
                  fill
                  className="object-cover transition-transform duration-[1.5s] group-hover:scale-105"
                />
              </div>
              <span className="text-[0.6rem] uppercase tracking-[0.2em] font-bold text-[var(--color-accent)] mb-3 block">{post.category}</span>
              <h3 className="text-2xl font-heading text-[var(--color-text-primary)] mb-4 leading-snug group-hover:text-[var(--color-accent)] transition-colors">
                {post.title}
              </h3>
              <p className="text-[0.6rem] uppercase tracking-[0.1em] text-[var(--color-text-muted)] font-bold">{post.date}</p>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}
