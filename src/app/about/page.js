export default function AboutPage() {
  return (
    <>
      <div className="page-banner">
        <h1>About <span className="gold-accent">Pushpa Arts</span></h1>
        <div className="gold-line"></div>
        <div className="breadcrumb">
          <a href="/">Home</a> <span>/</span> <span>About Us</span>
        </div>
      </div>

      <section className="section">
        <div className="container">
          <div className="about-section reveal" style={{ marginBottom: 'var(--space-4xl)' }}>
            <div className="about-image">
              <div className="no-image" style={{ height: '100%', fontSize: '1.2rem' }}>
                🏛️ Craftsmanship
              </div>
            </div>
            <div className="about-content">
              <h2>Our <span className="gold-accent">Story</span></h2>
              <p>
                Pushpa Arts is a renowned manufacturer and exporter of luxury handcrafted 
                furniture based in the historic city of Udaipur, Rajasthan, India. For generations, 
                our family has been dedicated to preserving and promoting the art of traditional 
                Indian craftsmanship.
              </p>
              <p>
                Our skilled artisans, many of whom come from families with centuries-old woodworking 
                traditions, create furniture that seamlessly blends traditional aesthetics with 
                contemporary functionality.
              </p>
            </div>
          </div>

          <div className="about-section reveal" style={{ marginBottom: 'var(--space-4xl)' }}>
            <div className="about-image">
              <div className="no-image" style={{ height: '100%', fontSize: '1.2rem' }}>
                ✨ Materials
              </div>
            </div>
            <div className="about-content">
              <h2>Premium <span className="gold-accent">Materials</span></h2>
              <p>
                We work with a diverse range of premium materials including pure silver, 
                white metal, natural bone, mother of pearl (MOP), various types of marble 
                including White Marble, Pink Sandstone, Red Sandstone, and many other 
                exotic stones.
              </p>
              <p>
                Each material is carefully selected for its quality and aesthetic properties, 
                ensuring that every piece of furniture we create is not just functional but 
                also a work of art.
              </p>
            </div>
          </div>

          <div className="about-section reveal">
            <div className="about-image">
              <div className="no-image" style={{ height: '100%', fontSize: '1.2rem' }}>
                🌍 Global Reach
              </div>
            </div>
            <div className="about-content">
              <h2>Global <span className="gold-accent">Export</span></h2>
              <p>
                We export our handcrafted furniture to clients worldwide. Whether you need 
                a single statement piece or bulk orders for your showroom, we provide 
                end-to-end service including custom design, manufacturing, quality packaging, 
                and reliable shipping.
              </p>
              <p>
                Our product range includes Silver Furniture, White Metal Furniture, 
                Bone Inlay Furniture, MOP Inlay Furniture, and Marble & Stone products 
                — each category featuring dozens of subcategories and hundreds of unique designs.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Features */}
      <section className="section reveal" style={{ background: 'var(--color-bg-secondary)' }}>
        <div className="container">
          <div className="features-grid">
            <div className="feature-card">
              <div className="feature-icon">🎨</div>
              <h3>Handcrafted</h3>
              <p>Every piece made by skilled artisans using traditional techniques.</p>
            </div>
            <div className="feature-card">
              <div className="feature-icon">🏆</div>
              <h3>Premium Quality</h3>
              <p>Only the finest materials sourced from trusted suppliers.</p>
            </div>
            <div className="feature-card">
              <div className="feature-icon">📦</div>
              <h3>Safe Delivery</h3>
              <p>Expert packaging ensuring your furniture arrives in perfect condition.</p>
            </div>
            <div className="feature-card">
              <div className="feature-icon">🤝</div>
              <h3>Custom Orders</h3>
              <p>Made-to-order furniture tailored to your specifications.</p>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
