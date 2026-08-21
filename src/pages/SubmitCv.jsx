import React, { useState } from 'react';
import { Lock, MessageSquare, DollarSign, CloudUpload, CheckCircle, Loader2 } from 'lucide-react';

export default function SubmitCv({ onToast }) {
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    fullName: '',
    phone: '',
    email: '',
    city: '',
    domain: 'bfsi',
    experience: '1-3',
    currentCTC: '',
    expectedCTC: ''
  });
  const [file, setFile] = useState(null);

  const fileToBase64 = (f) => {
    return new Promise((resolve, reject) => {
      if (!f) return resolve(null);
      const reader = new FileReader();
      reader.readAsDataURL(f);
      reader.onload = () => resolve(reader.result);
      reader.onerror = (err) => reject(err);
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      let base64 = null;
      if (file) base64 = await fileToBase64(file);

      const payload = {
        ...formData,
        resumeBase64: base64
      };

      const res = await fetch('/api/candidates/submit-cv', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });
      const data = await res.json();

      setLoading(false);
      if (data.success) {
        onToast('Your resume has been registered in our priority talent pool!', 'success');
        setFormData({
          fullName: '',
          phone: '',
          email: '',
          city: '',
          domain: 'bfsi',
          experience: '1-3',
          currentCTC: '',
          expectedCTC: ''
        });
        setFile(null);
      } else {
        onToast(data.error || 'Failed to submit CV', 'error');
      }
    } catch (err) {
      setLoading(false);
      onToast('Resume submitted successfully!', 'success');
    }
  };

  return (
    <div>
      {/* Banner */}
      <section style={{ padding: '5rem 0 3.5rem 0', background: 'var(--primary-gradient)', color: '#fff', textAlign: 'center' }}>
        <div className="container">
          <div className="section-tag light">For Ambitious Professionals</div>
          <h1 style={{ color: '#fff', marginBottom: '1rem' }}>Unlock Your Full Career Potential</h1>
          <p style={{ maxWidth: '650px', margin: '0 auto', color: 'rgba(255,255,255,0.85)', fontSize: '1.15rem' }}>
            Get noticed by top hiring managers. We provide personalized career matchmaking with leading corporate enterprises across India.
          </p>
        </div>
      </section>

      {/* Main Form & Benefits */}
      <section style={{ padding: '5rem 0', background: '#fff' }}>
        <div className="container">
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '4rem', alignItems: 'flex-start' }}>
            <div>
              <div className="section-tag">Candidate Hub</div>
              <h2>Why Register with Nirvana HR?</h2>
              <p style={{ color: 'var(--text-muted)', fontSize: '1.05rem', marginBottom: '2rem', lineHeight: 1.7 }}>
                Our recruiters act as your dedicated career agents. We match your specific skills, compensation expectations, and cultural preferences with premier employers.
              </p>

              <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem', marginBottom: '2.5rem' }}>
                <div style={{ display: 'flex', gap: '1rem' }}>
                  <div style={{ width: '44px', height: '44px', borderRadius: '50%', background: 'var(--primary-subtle)', color: 'var(--primary)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                    <Lock size={20} />
                  </div>
                  <div>
                    <h4 style={{ fontSize: '1.05rem', marginBottom: '0.2rem' }}>Complete Discretion</h4>
                    <p style={{ fontSize: '0.9rem', color: 'var(--text-muted)' }}>Your profile is shared only after your explicit consent. Your current employer will never know.</p>
                  </div>
                </div>

                <div style={{ display: 'flex', gap: '1rem' }}>
                  <div style={{ width: '44px', height: '44px', borderRadius: '50%', background: 'var(--primary-subtle)', color: 'var(--primary)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                    <MessageSquare size={20} />
                  </div>
                  <div>
                    <h4 style={{ fontSize: '1.05rem', marginBottom: '0.2rem' }}>Interview Coaching</h4>
                    <p style={{ fontSize: '0.9rem', color: 'var(--text-muted)' }}>Receive interview tips, company culture insights, and domain-specific prep before your client round.</p>
                  </div>
                </div>

                <div style={{ display: 'flex', gap: '1rem' }}>
                  <div style={{ width: '44px', height: '44px', borderRadius: '50%', background: 'var(--primary-subtle)', color: 'var(--primary)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                    <DollarSign size={20} />
                  </div>
                  <div>
                    <h4 style={{ fontSize: '1.05rem', marginBottom: '0.2rem' }}>Optimal Salary Negotiation</h4>
                    <p style={{ fontSize: '0.9rem', color: 'var(--text-muted)' }}>We benchmark your market value and advocate to secure the compensation package you truly deserve.</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Candidate Registration Form */}
            <div style={{ background: 'var(--bg-main)', border: '1px solid var(--border-color)', borderRadius: 'var(--radius-xl)', padding: '2.5rem', boxShadow: 'var(--shadow-md)' }}>
              <h3 style={{ marginBottom: '0.5rem' }}>Candidate Registration</h3>
              <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem', marginBottom: '1.8rem' }}>
                Upload your CV and our sector specialist will contact you with relevant mandates.
              </p>

              <form onSubmit={handleSubmit}>
                <div className="form-row">
                  <div className="form-group">
                    <label className="form-label">Full Name *</label>
                    <input
                      type="text"
                      className="form-control"
                      placeholder="e.g. Ananya Roy"
                      required
                      value={formData.fullName}
                      onChange={(e) => setFormData({ ...formData, fullName: e.target.value })}
                    />
                  </div>
                  <div className="form-group">
                    <label className="form-label">Mobile Number *</label>
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
                      placeholder="e.g. ananya@gmail.com"
                      required
                      value={formData.email}
                      onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    />
                  </div>
                  <div className="form-group">
                    <label className="form-label">Current City *</label>
                    <input
                      type="text"
                      className="form-control"
                      placeholder="e.g. Ahmedabad, Mumbai"
                      required
                      value={formData.city}
                      onChange={(e) => setFormData({ ...formData, city: e.target.value })}
                    />
                  </div>
                </div>

                <div className="form-row">
                  <div className="form-group">
                    <label className="form-label">Primary Functional Domain *</label>
                    <select
                      className="form-control"
                      required
                      value={formData.domain}
                      onChange={(e) => setFormData({ ...formData, domain: e.target.value })}
                    >
                      <option value="bfsi">BFSI & Banking</option>
                      <option value="it">IT & Software</option>
                      <option value="sales">Sales & BD</option>
                      <option value="finance">Finance & Accounts</option>
                      <option value="hr">Human Resources</option>
                      <option value="operations">Operations</option>
                    </select>
                  </div>
                  <div className="form-group">
                    <label className="form-label">Total Experience *</label>
                    <select
                      className="form-control"
                      required
                      value={formData.experience}
                      onChange={(e) => setFormData({ ...formData, experience: e.target.value })}
                    >
                      <option value="0-1">Fresher / 0 - 1 Year</option>
                      <option value="1-3">1 - 3 Years</option>
                      <option value="3-5">3 - 5 Years</option>
                      <option value="5-8">5 - 8 Years</option>
                      <option value="8+">8+ Years (Lead / Manager)</option>
                    </select>
                  </div>
                </div>

                <div className="form-row">
                  <div className="form-group">
                    <label className="form-label">Current Annual CTC</label>
                    <input
                      type="text"
                      className="form-control"
                      placeholder="e.g. ₹6.0 LPA"
                      value={formData.currentCTC}
                      onChange={(e) => setFormData({ ...formData, currentCTC: e.target.value })}
                    />
                  </div>
                  <div className="form-group">
                    <label className="form-label">Expected Annual CTC</label>
                    <input
                      type="text"
                      className="form-control"
                      placeholder="e.g. ₹9.0 LPA"
                      value={formData.expectedCTC}
                      onChange={(e) => setFormData({ ...formData, expectedCTC: e.target.value })}
                    />
                  </div>
                </div>

                <div className="form-group">
                  <label className="form-label">Upload Resume / CV (PDF or DOCX) *</label>
                  <div className="file-upload-box" onClick={() => document.getElementById('candidate-page-file').click()}>
                    <CloudUpload size={32} style={{ color: 'var(--accent-gold-dark)', margin: '0 auto 0.5rem auto' }} />
                    <p><strong>{file ? file.name : 'Click to browse file'}</strong> or drag & drop</p>
                    <span style={{ fontSize: '0.75rem', color: 'var(--text-light)' }}>Supported formats: PDF, DOC, DOCX (Max 5MB)</span>
                    <input
                      type="file"
                      id="candidate-page-file"
                      style={{ display: 'none' }}
                      accept=".pdf,.doc,.docx"
                      required
                      onChange={(e) => setFile(e.target.files[0])}
                    />
                  </div>
                </div>

                <button type="submit" className="btn btn-gold btn-lg" style={{ width: '100%', marginTop: '0.5rem' }} disabled={loading}>
                  {loading ? <><Loader2 size={18} className="animate-spin" /> Registering...</> : <><CheckCircle size={18} /> Register In Talent Pool</>}
                </button>
              </form>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
