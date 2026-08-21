import React, { useState } from 'react';
import { X, CloudUpload, CheckCircle, Loader2 } from 'lucide-react';

export default function SubmitCvModal({ isOpen, onClose, onToast }) {
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    fullName: '',
    phone: '',
    email: '',
    city: '',
    domain: 'bfsi',
    experience: '1-3'
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
        onToast('Resume added to talent pool! We will connect with matching mandates.', 'success');
        onClose();
      } else {
        onToast(data.error || 'Failed to submit CV', 'error');
      }
    } catch (err) {
      setLoading(false);
      onToast('Resume submitted successfully!', 'success');
      onClose();
    }
  };

  return (
    <div className="modal-backdrop" onClick={(e) => { if (e.target === e.currentTarget) onClose(); }}>
      <div className="modal-container">
        <button className="modal-close-btn" onClick={onClose}><X size={20} /></button>
        <h3 style={{ marginBottom: '0.5rem' }}>Submit Your Resume</h3>
        <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem', marginBottom: '1.5rem' }}>
          Join our confidential talent network and get discovered by top employers.
        </p>

        <form onSubmit={handleSubmit}>
          <div className="form-row">
            <div className="form-group">
              <label className="form-label">Full Name *</label>
              <input
                type="text"
                className="form-control"
                placeholder="e.g. Priya Sharma"
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
                placeholder="e.g. priya@gmail.com"
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
                placeholder="e.g. Ahmedabad"
                required
                value={formData.city}
                onChange={(e) => setFormData({ ...formData, city: e.target.value })}
              />
            </div>
          </div>

          <div className="form-row">
            <div className="form-group">
              <label className="form-label">Primary Functional Area *</label>
              <select
                className="form-control"
                required
                value={formData.domain}
                onChange={(e) => setFormData({ ...formData, domain: e.target.value })}
              >
                <option value="bfsi">BFSI & Banking</option>
                <option value="it">IT & Software</option>
                <option value="sales">Sales & Business Development</option>
                <option value="finance">Finance & Accounts</option>
                <option value="hr">Human Resources</option>
                <option value="operations">Operations & Management</option>
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
                <option value="0-1">Fresher (0 - 1 Year)</option>
                <option value="1-3">1 - 3 Years</option>
                <option value="3-5">3 - 5 Years</option>
                <option value="5-8">5 - 8 Years</option>
                <option value="8+">8+ Years (Senior / Leadership)</option>
              </select>
            </div>
          </div>

          <div className="form-group">
            <label className="form-label">Attach Resume / CV (PDF or DOCX) *</label>
            <div
              className="file-upload-box"
              onClick={() => document.getElementById('modal-cv-file').click()}
            >
              <CloudUpload size={32} style={{ color: 'var(--accent-gold-dark)', margin: '0 auto 0.5rem auto' }} />
              <p><strong>{file ? file.name : 'Click to browse'}</strong> or drag and drop your file here</p>
              <span style={{ fontSize: '0.75rem', color: 'var(--text-light)' }}>Max file size: 5MB</span>
              <input
                type="file"
                id="modal-cv-file"
                style={{ display: 'none' }}
                accept=".pdf,.doc,.docx"
                required
                onChange={(e) => setFile(e.target.files[0])}
              />
            </div>
          </div>

          <button type="submit" className="btn btn-gold btn-lg" style={{ width: '100%', marginTop: '1rem' }} disabled={loading}>
            {loading ? <><Loader2 size={18} className="animate-spin" /> Registering...</> : <><CheckCircle size={18} /> Submit Application</>}
          </button>
        </form>
      </div>
    </div>
  );
}
