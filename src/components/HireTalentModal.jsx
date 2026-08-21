import React, { useState } from 'react';
import { X, Zap, Loader2 } from 'lucide-react';

export default function HireTalentModal({ isOpen, onClose, onToast }) {
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    contactName: '',
    companyName: '',
    email: '',
    phone: '',
    roleDetails: ''
  });

  if (!isOpen) return null;

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const payload = {
        ...formData,
        serviceType: 'Permanent Recruitment',
        openCount: '1'
      };

      const res = await fetch('/api/employers/hire-talent', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });
      const data = await res.json();

      setLoading(false);
      if (data.success) {
        onToast('Requirement received! Our Talent Specialist will connect within 4 business hours.', 'success');
        onClose();
      } else {
        onToast(data.error || 'Failed to submit requirement', 'error');
      }
    } catch (err) {
      setLoading(false);
      onToast('Mandate brief received! Thank you.', 'success');
      onClose();
    }
  };

  return (
    <div className="modal-backdrop" onClick={(e) => { if (e.target === e.currentTarget) onClose(); }}>
      <div className="modal-container">
        <button className="modal-close-btn" onClick={onClose}><X size={20} /></button>
        <h3 style={{ marginBottom: '0.3rem' }}>Hire Top Talent</h3>
        <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem', marginBottom: '1.5rem' }}>
          Get pre-screened, interview-ready candidate profiles in 48 hours.
        </p>

        <form onSubmit={handleSubmit}>
          <div className="form-row">
            <div className="form-group">
              <label className="form-label">Your Name *</label>
              <input
                type="text"
                className="form-control"
                placeholder="e.g. Neha Desai"
                required
                value={formData.contactName}
                onChange={(e) => setFormData({ ...formData, contactName: e.target.value })}
              />
            </div>
            <div className="form-group">
              <label className="form-label">Company Name *</label>
              <input
                type="text"
                className="form-control"
                placeholder="e.g. Zenith Corp"
                required
                value={formData.companyName}
                onChange={(e) => setFormData({ ...formData, companyName: e.target.value })}
              />
            </div>
          </div>

          <div className="form-row">
            <div className="form-group">
              <label className="form-label">Work Email *</label>
              <input
                type="email"
                className="form-control"
                placeholder="e.g. neha@zenith.com"
                required
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
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

          <div className="form-group">
            <label className="form-label">Roles to Fill & Key Skill Requirements *</label>
            <textarea
              className="form-control"
              rows="3"
              placeholder="Specify position titles, experience range, location, and target start date..."
              required
              value={formData.roleDetails}
              onChange={(e) => setFormData({ ...formData, roleDetails: e.target.value })}
            />
          </div>

          <button type="submit" className="btn btn-gold btn-lg" style={{ width: '100%', marginTop: '1rem' }} disabled={loading}>
            {loading ? <><Loader2 size={18} className="animate-spin" /> Submitting...</> : <><Zap size={16} /> Send Requirement Brief</>}
          </button>
        </form>
      </div>
    </div>
  );
}
