import Link from 'next/link';

export default function Footer() {
  return (
    <footer className="footer">
      <div className="container">
        <div className="footer-grid">
          <div className="footer-brand">
            <div className="logo">
              <img src="/images/Pushpa-Exports.svg" alt="Pushpa Arts" style={{ height: '110px', width: 'auto', marginBottom: '1.5rem' }} />
            </div>
            <p>
              Premium manufacturers and exporters of luxury handcrafted furniture. 
              Bringing Udaipur's royal artisan heritage to high-end homes worldwide.
            </p>
          </div>

          <div>
            <h4>Furniture Types</h4>
            <ul className="footer-links">
              <li><Link href="/categories/silver-furniture">Silver Furniture</Link></li>
              <li><Link href="/categories/bone-inlay-furniture">Bone Inlay Furniture</Link></li>
              <li><Link href="/categories/mop-inlay-furniture">MOP Inlay Furniture</Link></li>
              <li><Link href="/categories/marble-furniture">Marble Furniture</Link></li>
            </ul>
          </div>

          <div>
            <h4>Company</h4>
            <ul className="footer-links">
              <li><Link href="/about">Our Story</Link></li>
              <li><Link href="/categories">Collections</Link></li>
              <li><Link href="/contact">Get in Touch</Link></li>
            </ul>
          </div>

          <div>
            <h4>Contact Details</h4>
            <ul className="footer-links">
              <li>Udaipur, Rajasthan, India</li>
              <li>info@pushpaarts.com</li>
              <li>+91 94141 62629</li>
            </ul>
          </div>
        </div>

        <div className="footer-bottom">
          <p>© {new Date().getFullYear()} Pushpa Arts. All rights reserved.</p>
          <p>Handcrafted Excellence since Generations.</p>
        </div>
      </div>
    </footer>
  );
}
