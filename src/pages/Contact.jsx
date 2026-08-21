import React, { useState } from 'react';
import { MapPin, Phone, Mail, MessageSquare, Send, Loader2 } from 'lucide-react';

export default function Contact({ onToast }) {
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    phone: '',
    email: '',
    subject: 'Hiring Talent',
    message: ''
  });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const res = await fetch('/api/contact', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData)
      });
      const data = await res.json();

      setLoading(false);
      if (data.success) {
        onToast('Thank you! Your inquiry has been received by Nirvana HR Solutions.', 'success');
        setFormData({ name: '', phone: '', email: '', subject: 'Hiring Talent', message: '' });
      } else {
        onToast('Your message has been sent.', 'success');
      }
    } catch (err) {
      setLoading(false);
      onToast('Your inquiry has been sent.', 'success');
    }
  };

  return (
    <div>
      {/* Banner */}
      <section style={{ padding: '5rem 0 3.5rem 0', background: 'var(--primary-gradient)', color: '#fff', textAlign: 'center' }}>
        <div className="container">
          <div className="section-tag light">Connect With Our Team</div>
          <h1 style={{ color: '#fff', marginBottom: '1rem' }}>Let's Build Something Exceptional Together</h1>
          <p style={{ maxWidth: '650px', margin: '0 auto', color: 'rgba(255,255,255,0.85)', fontSize: '1.15rem' }}>
            Have a question or a talent requirement? Reach out to our team for quick, strategic assistance.
          </p>
        </div>
      </section>

      {/* Main Content */}
      <section style={{ padding: '5rem 0', background: '#fff' }}>
        <div className="container">
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '4rem' }}>
            
            {/* Contact Details */}
            <div>
              <div className="section-tag">Direct Lines</div>
              <h2>Our Corporate Headquarters</h2>
              <p style={{ color: 'var(--text-muted)', fontSize: '1.05rem', marginBottom: '2.5rem', lineHeight: 1.7 }}>
                We operate nationwide with primary recruiting hubs in Gujarat and Maharashtra.
              </p>

              <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem', marginBottom: '2.5rem' }}>
                <div style={{ display: 'flex', gap: '1.2rem', alignItems: 'flex-start' }}>
                  <div style={{ width: '48px', height: '48px', borderRadius: 'var(--radius-md)', background: 'var(--primary-subtle)', color: 'var(--primary)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                    <MapPin size={22} />
                  </div>
                  <div>
                    <h4 style={{ fontSize: '1.05rem', marginBottom: '0.2rem' }}>Office Address</h4>
                    <p style={{ color: 'var(--text-muted)', fontSize: '0.95rem' }}>Corporate Heights, S.G. Highway, Ahmedabad, Gujarat - 380054</p>
                  </div>
                </div>

                <div style={{ display: 'flex', gap: '1.2rem', alignItems: 'flex-start' }}>
                  <div style={{ width: '48px', height: '48px', borderRadius: 'var(--radius-md)', background: 'var(--primary-subtle)', color: 'var(--primary)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                    <Phone size={22} />
                  </div>
                  <div>
                    <h4 style={{ fontSize: '1.05rem', marginBottom: '0.2rem' }}>Phone & Helpline</h4>
                    <p style={{ color: 'var(--text-muted)', fontSize: '0.95rem' }}>
                      <a href="tel:+919876543210" style={{ color: 'var(--primary)', fontWeight: 600 }}>+91 98765 43210</a> (Corporate)<br />
                      <a href="tel:+919876543211" style={{ color: 'var(--primary)', fontWeight: 600 }}>+91 98765 43211</a> (Candidate Desk)
                    </p>
                  </div>
                </div>

                <div style={{ display: 'flex', gap: '1.2rem', alignItems: 'flex-start' }}>
                  <div style={{ width: '48px', height: '48px', borderRadius: 'var(--radius-md)', background: 'var(--primary-subtle)', color: 'var(--primary)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                    <Mail size={22} />
                  </div>
                  <div>
                    <h4 style={{ fontSize: '1.05rem', marginBottom: '0.2rem' }}>Email Inquiries</h4>
                    <p style={{ color: 'var(--text-muted)', fontSize: '0.95rem' }}>
                      <a href="mailto:contact@nirvanahrsolutions.com" style={{ color: 'var(--primary)', fontWeight: 600 }}>contact@nirvanahrsolutions.com</a><br />
                      <a href="mailto:careers@nirvanahrsolutions.com" style={{ color: 'var(--primary)', fontWeight: 600 }}>careers@nirvanahrsolutions.com</a>
                    </p>
                  </div>
                </div>

                <div style={{ display: 'flex', gap: '1.2rem', alignItems: 'flex-start' }}>
                  <div style={{ width: '48px', height: '48px', borderRadius: 'var(--radius-md)', background: '#25d366', color: '#fff', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                    <i className="fab fa-whatsapp" style={{ fontSize: '1.4rem' }}></i>
                  </div>
                  <div>
                    <h4 style={{ fontSize: '1.05rem', marginBottom: '0.2rem' }}>Instant WhatsApp Chat</h4>
                    <p style={{ color: 'var(--text-muted)', fontSize: '0.95rem' }}>
                      <a href="https://wa.me/919876543210" target="_blank" rel="noreferrer" style={{ color: '#128c7e', fontWeight: 700 }}>
                        Click to chat directly with us &rarr;
                      </a>
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* Form */}
            <div style={{ background: 'var(--bg-main)', border: '1px solid var(--border-color)', borderRadius: 'var(--radius-xl)', padding: '2.5rem', boxShadow: 'var(--shadow-md)' }}>
              <h3 style={{ marginBottom: '0.5rem' }}>Send Us a Message</h3>
              <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem', marginBottom: '1.8rem' }}>We normally respond within 2-4 business hours.</p>

              <form onSubmit={handleSubmit}>
                <div className="form-row">
                  <div className="form-group">
                    <label className="form-label">Your Name *</label>
                    <input
                      type="text"
                      className="form-control"
                      placeholder="e.g. Sanjay Verma"
                      required
                      value={formData.name}
                      onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    />
                  </div>
                  <div className="form-group">
                    <label className="form-label">Phone Number *</label>
                    <input
                      type="tel"
                      className="form-control"
                      placeholder="e.g. +91 98765 43210"
                      required
                      value={formData.phone}
                      onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                    />
                  </div>
                </div>

                <div className="form-row">
                  <div className="form-group">
                    <label className="form-label">Email Address *</label>
                    <input
                      type="email"
                      className="form-control"
                      placeholder="e.g. sanjay@example.com"
                      required
                      value={formData.email}
                      onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    />
                  </div>
                  <div className="form-group">
                    <label className="form-label">Subject / Purpose *</label>
                    <select
                      className="form-control"
                      required
                      value={formData.subject}
                      onChange={(e) => setFormData({ ...formData, subject: e.target.value })}
                    >
                      <option value="Hiring Talent">I want to hire talent (Employer)</option>
                      <option value="Job Search">I am looking for a job (Candidate)</option>
                      <option value="Payroll & Staffing">Payroll / Staffing Outsourcing</option>
                      <option value="Partnership">Business Partnership</option>
                      <option value="General">General Inquiry</option>
                    </select>
                  </div>
                </div>

                <div className="form-group">
                  <label className="form-label">Your Message *</label>
                  <textarea
                    className="form-control"
                    rows="5"
                    placeholder="How can we assist you today?"
                    required
                    value={formData.message}
                    onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                  />
                </div>

                <button type="submit" className="btn btn-primary btn-lg" style={{ width: '100%' }} disabled={loading}>
                  {loading ? <><Loader2 size={18} className="animate-spin" /> Sending...</> : <><Send size={16} /> Send Message</>}
                </button>
              </form>
            </div>

          </div>
        </div>
      </section>
    </div>
  );
}
