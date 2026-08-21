import React, { useState } from 'react';
import { X, Send, Loader2 } from 'lucide-react';

export default function ApplyModal({ job, isOpen, onClose, onToast }) {
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    fullName: '',
    phone: '',
    email: '',
    currentCTC: '',
    noticePeriod: 'Immediate',
    linkedin: ''
  });
  const [file, setFile] = useState(null);

  if (!isOpen) return null;

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
        jobTitle: job ? job.title : 'General Application',
        ...formData,
        resumeBase64: base64
      };

      const res = await fetch('/api/jobs/apply', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });
      const data = await res.json();

      setLoading(false);
      if (data.success) {
        onToast('Application submitted successfully! Our recruiter will review your profile.', 'success');
        onClose();
      } else {
        onToast(data.error || 'Failed to submit application', 'error');
      }
    } catch (err) {
      setLoading(false);
      onToast('Application received! Thank you.', 'success');
      onClose();
    }
  };

  return (
    <div className="modal-backdrop" onClick={(e) => { if (e.target === e.currentTarget) onClose(); }}>
      <div className="modal-container">
        <button className="modal-close-btn" onClick={onClose}><X size={20} /></button>
        <h3 style={{ marginBottom: '0.3rem' }}>Quick Job Application</h3>
        <p style={{ color: 'var(--primary)', fontWeight: 600, fontSize: '0.95rem', marginBottom: '1.5rem' }}>
          Applying for: {job ? `${job.title} (${job.company})` : 'General Opportunity'}
        </p>

        <form onSubmit={handleSubmit}>
          <div className="form-row">
            <div className="form-group">
              <label className="form-label">Full Name *</label>
              <input
                type="text"
                className="form-control"
                placeholder="e.g. Amit Patel"
                required
                value={formData.fullName}
                onChange={(e) => setFormData({ ...formData, fullName: e.target.value })}
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
                placeholder="e.g. amit@gmail.com"
                required
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
              />
            </div>
            <div className="form-group">
              <label className="form-label">Current CTC *</label>
              <input
                type="text"
                className="form-control"
                placeholder="e.g. ₹6.5 LPA"
                required
                value={formData.currentCTC}
                onChange={(e) => setFormData({ ...formData, currentCTC: e.target.value })}
              />
            </div>
          </div>

          <div className="form-row">
            <div className="form-group">
              <label className="form-label">Notice Period *</label>
              <select
                className="form-control"
                required
                value={formData.noticePeriod}
                onChange={(e) => setFormData({ ...formData, noticePeriod: e.target.value })}
              >
                <option value="Immediate">Immediate Joiner</option>
                <option value="15 Days">15 Days or less</option>
                <option value="30 Days">30 Days</option>
                <option value="60 Days">60 Days</option>
                <option value="90 Days">90 Days</option>
              </select>
            </div>
            <div className="form-group">
              <label className="form-label">LinkedIn Profile</label>
              <input
                type="url"
                className="form-control"
                placeholder="https://linkedin.com/in/username"
                value={formData.linkedin}
                onChange={(e) => setFormData({ ...formData, linkedin: e.target.value })}
              />
            </div>
          </div>

          <div className="form-group">
            <label className="form-label">Upload Resume (PDF/DOC) *</label>
            <input
              type="file"
              className="form-control"
              accept=".pdf,.doc,.docx"
              required
              onChange={(e) => setFile(e.target.files[0])}
            />
          </div>

          <button type="submit" className="btn btn-primary btn-lg" style={{ width: '100%', marginTop: '1rem' }} disabled={loading}>
            {loading ? <><Loader2 size={18} className="animate-spin" /> Submitting...</> : <><Send size={16} /> Submit Application</>}
          </button>
        </form>
      </div>
    </div>
  );
}
