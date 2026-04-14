'use client';
import { useState } from 'react';

export default function ContactPage() {
  const [form, setForm] = useState({ name: '', email: '', phone: '', subject: '', message: '' });
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    // For now just show success. Can be connected to API later.
    setSubmitted(true);
    setTimeout(() => setSubmitted(false), 5000);
    setForm({ name: '', email: '', phone: '', subject: '', message: '' });
  };

  return (
    <>
      <div className="page-banner">
        <h1>Contact <span className="gold-accent">Us</span></h1>
        <div className="gold-line"></div>
        <div className="breadcrumb">
          <a href="/">Home</a> <span>/</span> <span>Contact</span>
        </div>
      </div>

      <section className="section">
        <div className="container">
          <div className="contact-grid">
            {/* Contact Info */}
            <div>
              <h2 style={{ fontFamily: 'var(--font-heading)', fontSize: '1.8rem', color: 'var(--color-cream)', marginBottom: 'var(--space-xl)' }}>
                Get in <span className="gold-accent">Touch</span>
              </h2>
              <p style={{ color: 'var(--color-text-secondary)', marginBottom: 'var(--space-2xl)', lineHeight: 1.8 }}>
                Have a question or interested in our products? We&apos;d love to hear from you. 
                Reach out to us through any of the channels below or fill out the inquiry form.
              </p>

              <div className="contact-info-card">
                <div className="icon">📍</div>
                <div>
                  <h4>Visit Us</h4>
                  <p>Udaipur, Rajasthan, India</p>
                </div>
              </div>

              <div className="contact-info-card">
                <div className="icon">✉</div>
                <div>
                  <h4>Email Us</h4>
                  <p><a href="mailto:info@pushpaexport.com" style={{ color: 'var(--color-gold)' }}>info@pushpaexport.com</a></p>
                </div>
              </div>

              <div className="contact-info-card">
                <div className="icon">📞</div>
                <div>
                  <h4>Call Us</h4>
                  <p>+91 XXXXXXXXXX</p>
                </div>
              </div>

              <div className="contact-info-card">
                <div className="icon">💬</div>
                <div>
                  <h4>WhatsApp</h4>
                  <p>
                    <a 
                      href="https://wa.me/91XXXXXXXXXX" 
                      target="_blank" 
                      rel="noopener noreferrer"
                      style={{ color: 'var(--color-gold)' }}
                    >
                      Chat with us on WhatsApp
                    </a>
                  </p>
                </div>
              </div>
            </div>

            {/* Contact Form */}
            <div>
              <div style={{ 
                background: 'var(--color-bg-card)', 
                padding: 'var(--space-2xl)', 
                borderRadius: 'var(--radius-lg)',
                border: '1px solid var(--color-border)'
              }}>
                <h3 style={{ fontFamily: 'var(--font-heading)', fontSize: '1.4rem', color: 'var(--color-cream)', marginBottom: 'var(--space-xl)' }}>
                  Send an Inquiry
                </h3>

                {submitted && (
                  <div style={{ 
                    padding: 'var(--space-md)', 
                    background: 'rgba(74, 222, 128, 0.1)', 
                    border: '1px solid var(--color-success)',
                    borderRadius: 'var(--radius-md)',
                    color: 'var(--color-success)',
                    marginBottom: 'var(--space-lg)',
                    fontSize: '0.9rem'
                  }}>
                    Thank you for your inquiry! We&apos;ll get back to you soon.
                  </div>
                )}

                <form onSubmit={handleSubmit}>
                  <div className="form-group">
                    <label htmlFor="contact-name">Your Name</label>
                    <input
                      id="contact-name"
                      type="text"
                      className="form-input"
                      value={form.name}
                      onChange={e => setForm({...form, name: e.target.value})}
                      required
                    />
                  </div>
                  <div className="form-group">
                    <label htmlFor="contact-email">Email Address</label>
                    <input
                      id="contact-email"
                      type="email"
                      className="form-input"
                      value={form.email}
                      onChange={e => setForm({...form, email: e.target.value})}
                      required
                    />
                  </div>
                  <div className="form-group">
                    <label htmlFor="contact-phone">Phone Number</label>
                    <input
                      id="contact-phone"
                      type="tel"
                      className="form-input"
                      value={form.phone}
                      onChange={e => setForm({...form, phone: e.target.value})}
                    />
                  </div>
                  <div className="form-group">
                    <label htmlFor="contact-subject">Subject</label>
                    <input
                      id="contact-subject"
                      type="text"
                      className="form-input"
                      value={form.subject}
                      onChange={e => setForm({...form, subject: e.target.value})}
                      required
                    />
                  </div>
                  <div className="form-group">
                    <label htmlFor="contact-message">Your Message</label>
                    <textarea
                      id="contact-message"
                      className="form-input"
                      value={form.message}
                      onChange={e => setForm({...form, message: e.target.value})}
                      required
                    />
                  </div>
                  <button type="submit" className="btn btn-primary" style={{ width: '100%', justifyContent: 'center' }}>
                    Send Message
                  </button>
                </form>
              </div>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
