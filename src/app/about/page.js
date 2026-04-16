export default function AboutPage() {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "AboutPage",
            "name": "About Pushpa Arts",
            "description": "Learn about Pushpa Arts, a renowned manufacturer and exporter of luxury handcrafted furniture based in Udaipur, Rajasthan, India.",
            "publisher": {
              "@type": "Organization",
              "name": "Pushpa Arts",
              "logo": "https://pushpaarts.com/images/Pushpa-Exports.svg"
            }
          })
        }}
      />
      <div className="bg-[#F5F1EE] pt-32 pb-16 border-b border-[#E5E0DA]">
        <div className="max-w-[1600px] mx-auto px-[clamp(1.2rem,5vw,6rem)]">
          <h1 className="text-[clamp(2.5rem,5vw,4rem)] font-heading leading-tight text-[#1F1F1F]">
            About <span className="text-[#B8860B]">Pushpa Arts</span>
          </h1>
          <div className="w-16 h-[2px] bg-[#B8860B] my-8"></div>
          <div className="flex flex-wrap items-center gap-2 text-[0.8rem] tracking-[0.2em] uppercase text-[#1F1F1F]">
            <a href="/" className="opacity-60 hover:opacity-100 transition-opacity">Home</a> 
            <span className="opacity-30">/</span> 
            <span className="font-semibold">About Us</span>
          </div>
        </div>
      </div>

      <section className="py-[clamp(5rem,10vw,9rem)] bg-[#FCFAF8]">
        <div className="max-w-[1600px] mx-auto px-[clamp(1.2rem,5vw,6rem)]">
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-16 lg:gap-24 items-center mb-32 reveal">
            <div className="aspect-[4/3] bg-[#F5F1EE] rounded-2xl flex items-center justify-center text-5xl md:text-6xl border border-[#E5E0DA] shadow-sm overflow-hidden relative group">
              <div className="absolute inset-0 bg-[#B8860B]/5 group-hover:bg-transparent transition-colors duration-500"></div>
              <span>🏛️</span>
            </div>
            <div>
              <h2 className="font-heading text-[clamp(2rem,4vw,3.2rem)] text-[#1F1F1F] mb-6 inline-block relative">
                Our <span className="text-[#B8860B]">Story</span>
              </h2>
              <div className="space-y-6 text-[#4A4A4A] leading-[1.8] text-[1.05rem] font-light">
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
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-16 lg:gap-24 items-center mb-32 reveal">
            <div className="md:order-2 aspect-[4/3] bg-[#F5F1EE] rounded-2xl flex items-center justify-center text-5xl md:text-6xl border border-[#E5E0DA] shadow-sm overflow-hidden relative group">
              <div className="absolute inset-0 bg-[#B8860B]/5 group-hover:bg-transparent transition-colors duration-500"></div>
              <span>✨</span>
            </div>
            <div className="md:order-1">
              <h2 className="font-heading text-[clamp(2rem,4vw,3.2rem)] text-[#1F1F1F] mb-6 inline-block relative">
                Premium <span className="text-[#B8860B]">Materials</span>
              </h2>
              <div className="space-y-6 text-[#4A4A4A] leading-[1.8] text-[1.05rem] font-light">
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
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-16 lg:gap-24 items-center reveal">
            <div className="aspect-[4/3] bg-[#F5F1EE] rounded-2xl flex items-center justify-center text-5xl md:text-6xl border border-[#E5E0DA] shadow-sm overflow-hidden relative group">
              <div className="absolute inset-0 bg-[#B8860B]/5 group-hover:bg-transparent transition-colors duration-500"></div>
              <span>🌍</span>
            </div>
            <div>
              <h2 className="font-heading text-[clamp(2rem,4vw,3.2rem)] text-[#1F1F1F] mb-6 inline-block relative">
                Global <span className="text-[#B8860B]">Export</span>
              </h2>
              <div className="space-y-6 text-[#4A4A4A] leading-[1.8] text-[1.05rem] font-light">
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

        </div>
      </section>

      {/* Features */}
      <section className="py-[clamp(5rem,10vw,9rem)] bg-[#F5F1EE] reveal">
        <div className="max-w-[1600px] mx-auto px-[clamp(1.2rem,5vw,6rem)]">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-12">
            <div className="flex flex-col items-center text-center group">
              <div className="w-20 h-20 rounded-2xl bg-white flex items-center justify-center text-3xl mb-6 shadow-sm border border-[#E5E0DA] group-hover:bg-[#1F1F1F] group-hover:text-white transition-all duration-500 group-hover:-translate-y-2">🎨</div>
              <h3 className="font-heading text-xl text-[#1F1F1F] mb-3">Handcrafted</h3>
              <p className="text-[#8C8C8C] text-sm leading-relaxed font-light">Every piece made by skilled artisans using traditional techniques.</p>
            </div>
            <div className="flex flex-col items-center text-center group">
              <div className="w-20 h-20 rounded-2xl bg-white flex items-center justify-center text-3xl mb-6 shadow-sm border border-[#E5E0DA] group-hover:bg-[#1F1F1F] group-hover:text-white transition-all duration-500 group-hover:-translate-y-2">🏆</div>
              <h3 className="font-heading text-xl text-[#1F1F1F] mb-3">Premium Quality</h3>
              <p className="text-[#8C8C8C] text-sm leading-relaxed font-light">Only the finest materials sourced from trusted suppliers.</p>
            </div>
            <div className="flex flex-col items-center text-center group">
              <div className="w-20 h-20 rounded-2xl bg-white flex items-center justify-center text-3xl mb-6 shadow-sm border border-[#E5E0DA] group-hover:bg-[#1F1F1F] group-hover:text-white transition-all duration-500 group-hover:-translate-y-2">📦</div>
              <h3 className="font-heading text-xl text-[#1F1F1F] mb-3">Safe Delivery</h3>
              <p className="text-[#8C8C8C] text-sm leading-relaxed font-light">Expert packaging ensuring your furniture arrives in perfect condition.</p>
            </div>
            <div className="flex flex-col items-center text-center group">
              <div className="w-20 h-20 rounded-2xl bg-white flex items-center justify-center text-3xl mb-6 shadow-sm border border-[#E5E0DA] group-hover:bg-[#1F1F1F] group-hover:text-white transition-all duration-500 group-hover:-translate-y-2">🤝</div>
              <h3 className="font-heading text-xl text-[#1F1F1F] mb-3">Custom Orders</h3>
              <p className="text-[#8C8C8C] text-sm leading-relaxed font-light">Made-to-order furniture tailored to your specifications.</p>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}

