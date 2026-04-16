import Link from 'next/link';

export default function Footer() {
  return (
    <footer className="footer">
      <div className="container">
        <div className="footer-grid">
          <div className="footer-col reveal">
            <div className="logo">
              <img src="/images/Pushpa-Exports.svg" alt="Pushpa Arts" style={{ height: '70px', width: 'auto', marginBottom: '2rem' }} />
            </div>
            <h4>Our Heritage</h4>
            <p className="footer-story-p">
              Born in the historic city of Udaipur, Pushpa Arts represents generations of refined craftsmanship. 
              We preserve the royal art of Inlay and Carving, bringing timeless Rajasthani elegance to the world's most distinguished interiors.
            </p>
          </div>

          <div className="footer-col reveal delay-100">
            <h4>Collections</h4>
            <ul className="footer-links">
              <li><Link href="/product-category/silver-furniture">Silver Legacy</Link></li>
              <li><Link href="/product-category/bone-inlay-furniture">Bone Inlay Masters</Link></li>
              <li><Link href="/product-category/mop-inlay-furniture">Mother of Pearl</Link></li>
              <li><Link href="/product-category/marble-furniture">Marble Masterpieces</Link></li>
            </ul>
          </div>

          <div className="footer-col reveal delay-200">
            <h4>Concierge</h4>
            <ul className="footer-links">
              <li><Link href="/about">The Artisan Story</Link></li>
              <li><Link href="/contact">Bespoke Inquiry</Link></li>
              <li><Link href="/admin">Craftsman Portal</Link></li>
              <li><Link href="/privacy">Privacy & Heritage</Link></li>
            </ul>
          </div>

          <div className="footer-col reveal delay-300">
            <h4>Connect</h4>
            <ul className="footer-links">
              <li>Udaipur, Rajasthan, India</li>
              <li>bespoke@pushpaarts.com</li>
              <li>+91 94141 62629</li>
            </ul>
          </div>
        </div>

        <div className="footer-bottom">
          <p>© {new Date().getFullYear()} Pushpa Arts — Handcrafted Excellence.</p>
          <div className="footer-tagline">Preserving Royale Udaipur Craftsmanship</div>
        </div>
      </div>
    </footer>
  );
}
