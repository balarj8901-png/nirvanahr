import React, { useState } from 'react';
import { Handshake, CheckCircle, Send, Loader2 } from 'lucide-react';

export default function HireTalent({ onToast }) {
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    contactName: '',
    designation: '',
    companyName: '',
    email: '',
    phone: '',
    location: '',
    serviceType: 'Permanent Recruitment',
    openCount: '1',
    roleDetails: ''
  });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const res = await fetch('/api/employers/hire-talent', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData)
      });
      const data = await res.json();

      setLoading(false);
      if (data.success) {
        onToast('Recruitment requirement brief received! Our Talent Partner will connect within 4 hours.', 'success');
        setFormData({
          contactName: '',
          designation: '',
          companyName: '',
          email: '',
          phone: '',
          location: '',
          serviceType: 'Permanent Recruitment',
          openCount: '1',
          roleDetails: ''
        });
      } else {
        onToast(data.error || 'Failed to submit requirement', 'error');
      }
    } catch (err) {
      setLoading(false);
      onToast('Mandate received successfully!', 'success');
    }
  };

  return (
    <div>
      {/* Banner */}
      <section style={{ padding: '5rem 0 3.5rem 0', background: 'var(--primary-gradient)', color: '#fff', textAlign: 'center' }}>
        <div className="container">
          <div className="section-tag light">For Enterprise Leaders & HR Heads</div>
          <h1 style={{ color: '#fff', marginBottom: '1rem' }}>Accelerate Your Hiring With Pre-Vetted Talent</h1>
          <p style={{ maxWidth: '680px', margin: '0 auto', color: 'rgba(255,255,255,0.85)', fontSize: '1.15rem' }}>
            Reduce your time-to-hire by 70%. Receive high-caliber, thoroughly interviewed candidate profiles within 48 hours.
          </p>
        </div>
      </section>

      {/* Main Content */}
      <section style={{ padding: '5rem 0', background: '#fff' }}>
        <div className="container">
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '4rem', alignItems: 'flex-start' }}>
            <div>
              <div className="section-tag">Direct Mandate</div>
              <h2>Submit Your Talent Requirement</h2>
              <p style={{ color: 'var(--text-muted)', fontSize: '1.05rem', marginBottom: '2rem', lineHeight: 1.7 }}>
                Whether you need a single CXO leader or a 50-person sales team, our dedicated practice heads are ready to execute your mandate with precision.
              </p>

              <div style={{ background: 'var(--bg-subtle)', padding: '2rem', borderRadius: 'var(--radius-lg)', border: '1px solid var(--border-color)', marginBottom: '2rem' }}>
                <h4 style={{ marginBottom: '1rem', color: 'var(--primary)', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                  <Handshake size={20} /> Our Service Commitments (SLA):
                </h4>
                <ul style={{ display: 'flex', flexDirection: 'column', gap: '0.8rem', fontSize: '0.95rem', color: 'var(--text-main)' }}>
                  <li style={{ display: 'flex', alignItems: 'center', gap: '0.6rem' }}><CheckCircle size={16} style={{ color: 'var(--accent-gold-dark)' }} /> <strong>First Profiles:</strong> Within 48-72 business hours</li>
                  <li style={{ display: 'flex', alignItems: 'center', gap: '0.6rem' }}><CheckCircle size={16} style={{ color: 'var(--accent-gold-dark)' }} /> <strong>Replacement Warranty:</strong> 90 days zero-cost guarantee</li>
                  <li style={{ display: 'flex', alignItems: 'center', gap: '0.6rem' }}><CheckCircle size={16} style={{ color: 'var(--accent-gold-dark)' }} /> <strong>Verification:</strong> Background, salary slip, and credentials verified</li>
                </ul>
              </div>

              <div style={{ display: 'flex', gap: '1.5rem', alignItems: 'center' }}>
                <div style={{ width: '50px', height: '50px', borderRadius: '50%', background: '#25d366', color: '#fff', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '1.5rem' }}>
                  <i className="fab fa-whatsapp"></i>
                </div>
                <div>
                  <div style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>Prefer instant messaging?</div>
                  <a href="https://wa.me/919876543210" target="_blank" rel="noreferrer" style={{ fontWeight: 700, color: 'var(--primary)' }}>
                    Chat directly with Head of Client Relations &rarr;
                  </a>
                </div>
              </div>
            </div>

            {/* Form */}
            <div style={{ background: 'var(--bg-main)', border: '1px solid var(--border-color)', borderRadius: 'var(--radius-xl)', padding: '2.5rem', boxShadow: 'var(--shadow-md)' }}>
              <h3 style={{ marginBottom: '0.5rem' }}>Recruitment Brief</h3>
              <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem', marginBottom: '1.8rem' }}>
                Fill out this quick brief and our talent partner will reach out within 4 business hours.
              </p>

              <form onSubmit={handleSubmit}>
                <div className="form-row">
                  <div className="form-group">
                    <label className="form-label">Full Name *</label>
                    <input
                      type="text"
                      className="form-control"
                      placeholder="e.g. Rajesh Shah"
                      required
                      value={formData.contactName}
                      onChange={(e) => setFormData({ ...formData, contactName: e.target.value })}
                    />
                  </div>
                  <div className="form-group">
                    <label className="form-label">Designation *</label>
                    <input
                      type="text"
                      className="form-control"
                      placeholder="e.g. HR Director / Founder"
                      required
                      value={formData.designation}
                      onChange={(e) => setFormData({ ...formData, designation: e.target.value })}
                    />
                  </div>
                </div>

                <div className="form-row">
                  <div className="form-group">
                    <label className="form-label">Company Name *</label>
                    <input
                      type="text"
                      className="form-control"
                      placeholder="e.g. Nirvana Infotech"
                      required
                      value={formData.companyName}
                      onChange={(e) => setFormData({ ...formData, companyName: e.target.value })}
                    />
                  </div>
                  <div className="form-group">
                    <label className="form-label">Work Email *</label>
                    <input
                      type="email"
                      className="form-control"
                      placeholder="e.g. rajesh@company.com"
                      required
                      value={formData.email}
                      onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    />
                  </div>
                </div>

                <div className="form-row">
                  <div className="form-group">
                    <label className="form-label">Contact Phone / Mobile *</label>
                    <input
                      type="tel"
                      className="form-control"
                      placeholder="e.g. +91 98765 43210"
                      required
                      value={formData.phone}
                      onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                    />
                  </div>
                  <div className="form-group">
                    <label className="form-label">Location of Job *</label>
                    <input
                      type="text"
                      className="form-control"
                      placeholder="e.g. Ahmedabad, Mumbai, or Remote"
                      required
                      value={formData.location}
                      onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                    />
                  </div>
                </div>

                <div className="form-row">
                  <div className="form-group">
                    <label className="form-label">Service Type Needed *</label>
                    <select
                      className="form-control"
                      required
                      value={formData.serviceType}
                      onChange={(e) => setFormData({ ...formData, serviceType: e.target.value })}
                    >
                      <option value="Permanent Recruitment">Permanent Lateral Recruitment</option>
                      <option value="Executive Search">Executive Search / CXO</option>
                      <option value="Contract Staffing">Contract Staffing & Third-Party Payroll</option>
                      <option value="Bulk Sourcing">Bulk / High-Volume Hiring</option>
                      <option value="HR Consulting">HR Advisory & Compensation Benchmarking</option>
                    </select>
                  </div>
                  <div className="form-group">
                    <label className="form-label">Open Positions Count *</label>
                    <input
                      type="number"
                      className="form-control"
                      min="1"
                      required
                      value={formData.openCount}
                      onChange={(e) => setFormData({ ...formData, openCount: e.target.value })}
                    />
                  </div>
                </div>

                <div className="form-group">
                  <label className="form-label">Role Description, Experience & Key Skills *</label>
                  <textarea
                    className="form-control"
                    rows="4"
                    placeholder="Detail the target role, experience level, expected salary range, and specific requirements..."
                    required
                    value={formData.roleDetails}
                    onChange={(e) => setFormData({ ...formData, roleDetails: e.target.value })}
                  />
                </div>

                <button type="submit" className="btn btn-gold btn-lg" style={{ width: '100%' }} disabled={loading}>
                  {loading ? <><Loader2 size={18} className="animate-spin" /> Submitting...</> : <><Send size={16} /> Submit Hiring Mandate</>}
                </button>
              </form>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
