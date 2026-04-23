export default function TermsAndConditions() {
  return (
    <main className="min-h-screen pt-32 pb-20 bg-[#FCFAF8]">
      <div className="container max-w-[900px]">
        <div className="reveal mb-16">
          <p className="text-[0.6rem] uppercase tracking-[0.5em] text-[#B8860B] font-bold mb-6 italic">Our Standards</p>
          <h1 className="text-[clamp(2.5rem,8vw,4rem)] font-heading leading-tight mb-8 text-[#1F1F1F]">
            Terms of <span className="text-[#B8860B] italic">Service</span>
          </h1>
          <div className="w-24 h-[2px] bg-gradient-to-r from-[#B8860B] to-transparent mb-10"></div>
          <p className="text-[0.7rem] uppercase tracking-[0.2em] font-bold text-[#8C8C8C]">Last Updated: April 2024</p>
        </div>

        <div className="reveal prose prose-neutral max-w-none space-y-12 text-[#4A4A4A] leading-[1.8] font-light">
          <section>
            <h2 className="font-heading text-2xl text-[#1F1F1F] mb-6 italic">1. Agreement to Terms</h2>
            <p>
              By accessing the digital atelier of Pushpa Exports, you agree to be bound by these Terms of Service and all applicable international trade laws and regulations.
            </p>
          </section>

          <section>
            <h2 className="font-heading text-2xl text-[#1F1F1F] mb-6 italic">2. Intellectual Property</h2>
            <p>
              The designs, craftsmanship patterns, and imagery showcased on this platform are the intellectual property of Pushpa Exports. Any reproduction or use of these patterns without written consent is strictly prohibited.
            </p>
          </section>

          <section>
            <h2 className="font-heading text-2xl text-[#1F1F1F] mb-6 italic">3. Custom Commissions</h2>
            <p>
              Bespoke furniture commissions require a detailed consultation. Lead times, material costs, and shipping logistics will be outlined in a formal agreement provided before the commencement of any handcrafted work.
            </p>
          </section>

          <section>
            <h2 className="font-heading text-2xl text-[#1F1F1F] mb-6 italic">4. International Shipping</h2>
            <p>
              We specialize in museum-grade export. While we ensure the highest standards of packaging, international duties and taxes are the responsibility of the recipient unless otherwise specified in the commercial invoice.
            </p>
          </section>
        </div>

        <div className="mt-20 pt-12 border-t border-[#E5E0DA] reveal">
          <h3 className="font-heading text-xl text-[#1F1F1F] mb-8 italic">Ready to Begin Your <span className="text-[#B8860B]">Journey?</span></h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <a href="/shop" className="p-8 bg-white border border-[#F0EDE6] hover:border-[#B8860B] transition-all group">
              <span className="text-[0.6rem] uppercase tracking-[0.2em] font-bold text-[#8C8C8C] block mb-2">Signature</span>
              <span className="text-lg font-heading text-[#1F1F1F]">Browse Full Shop →</span>
            </a>
            <a href="/" className="p-8 bg-white border border-[#F0EDE6] hover:border-[#B8860B] transition-all group">
              <span className="text-[0.6rem] uppercase tracking-[0.2em] font-bold text-[#8C8C8C] block mb-2">Overview</span>
              <span className="text-lg font-heading text-[#1F1F1F]">Back to Home →</span>
            </a>
          </div>
        </div>
      </div>
    </main>
  );
}
