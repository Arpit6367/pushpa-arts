export default function PrivacyPolicy() {
  return (
    <main className="min-h-screen pt-32 pb-20 bg-[#FCFAF8]">
      <div className="container max-w-[900px]">
        <div className="reveal mb-16">
          <p className="text-[0.6rem] uppercase tracking-[0.5em] text-[#B8860B] font-bold mb-6 italic">Our Commitment</p>
          <h1 className="text-[clamp(2.5rem,8vw,4rem)] font-heading leading-tight mb-8 text-[#1F1F1F]">
            Privacy <span className="text-[#B8860B] italic">Policy</span>
          </h1>
          <div className="w-24 h-[2px] bg-gradient-to-r from-[#B8860B] to-transparent mb-10"></div>
          <p className="text-[0.7rem] uppercase tracking-[0.2em] font-bold text-[#8C8C8C]">Last Updated: April 2024</p>
        </div>

        <div className="reveal prose prose-neutral max-w-none space-y-12 text-[#4A4A4A] leading-[1.8] font-light">
          <section>
            <h2 className="font-heading text-2xl text-[#1F1F1F] mb-6 italic">1. Introduction</h2>
            <p>
              At Pushpa Exports, we value your privacy and are committed to protecting your personal data. This Privacy Policy outlines how we collect, use, and safeguard your information when you visit our website or interact with our digital atelier.
            </p>
          </section>

          <section>
            <h2 className="font-heading text-2xl text-[#1F1F1F] mb-6 italic">2. Information We Collect</h2>
            <p>
              We may collect personal information such as your name, email address, phone number, and architectural interests when you fill out an inquiry form or contact our artisans directly.
            </p>
          </section>

          <section>
            <h2 className="font-heading text-2xl text-[#1F1F1F] mb-6 italic">3. How We Use Your Data</h2>
            <p>
              The information we collect is used primarily to:
            </p>
            <ul className="list-disc pl-6 space-y-2">
              <li>Respond to your bespoke furniture inquiries.</li>
              <li>Provide personalized design consultations.</li>
              <li>Improve our website's curated experience.</li>
              <li>Comply with international export and legal requirements.</li>
            </ul>
          </section>

          <section>
            <h2 className="font-heading text-2xl text-[#1F1F1F] mb-6 italic">4. Data Security</h2>
            <p>
              We implement industry-standard security measures to protect your data from unauthorized access or disclosure. Your trust is as valuable to us as our handcrafted masterpieces.
            </p>
          </section>
        </div>

        <div className="mt-20 pt-12 border-t border-[#E5E0DA] reveal">
          <h3 className="font-heading text-xl text-[#1F1F1F] mb-8 italic">Navigate Back to the <span className="text-[#B8860B]">Gallery</span></h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <a href="/product-category" className="p-8 bg-white border border-[#F0EDE6] hover:border-[#B8860B] transition-all group">
              <span className="text-[0.6rem] uppercase tracking-[0.2em] font-bold text-[#8C8C8C] block mb-2">Explore</span>
              <span className="text-lg font-heading text-[#1F1F1F]">Artisanal Collections →</span>
            </a>
            <a href="/contact" className="p-8 bg-white border border-[#F0EDE6] hover:border-[#B8860B] transition-all group">
              <span className="text-[0.6rem] uppercase tracking-[0.2em] font-bold text-[#8C8C8C] block mb-2">Connect</span>
              <span className="text-lg font-heading text-[#1F1F1F]">Contact Our Artisans →</span>
            </a>
          </div>
        </div>
      </div>
    </main>
  );
}
